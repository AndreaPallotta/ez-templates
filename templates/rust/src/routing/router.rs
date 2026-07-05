use std::time::Duration;
use axum::http::header;
use axum::{
    body::{ Body, Bytes },
    http::{ HeaderMap, HeaderName, Request },
    middleware,
    response::Response,
    routing::{ get, post },
    Extension,
    Router,
};
use log::{ debug, error, info };
use tower_http::{
    classify::ServerErrorsFailureClass,
    compression::CompressionLayer,
    cors::CorsLayer,
    propagate_header::PropagateHeaderLayer,
    trace::TraceLayer,
    validate_request::ValidateRequestHeaderLayer,
};
use tracing::Span;

use crate::config::Environment;
use crate::constants::CONFIG;

use super::{ auth, user, mid };

pub async fn create_router() -> Router {
    let config = CONFIG.get().unwrap();
    let secret = config.server.secret.clone();

    let cors = if config.server.allow_origins().is_none() || config.server.env == Environment::DEV {
        CorsLayer::permissive()
    } else {
        CorsLayer::new()
            .allow_origin(config.server.allow_origins().unwrap())
            .allow_headers(vec![header::AUTHORIZATION])
    };

    Router::new()
        .route("/v1/auth/validate_jwt", post(auth::jwt_validate))
        .route("/v1/auth/login", post(auth::handle_login))
        .route("/v1/auth/refresh/:email", get(auth::refresh))
        .route(
            "/v1/user/:email",
            get(user::get_user).route_layer(middleware::from_fn(mid::jwt_middleware))
        )
        .layer(CompressionLayer::new())
        .layer(PropagateHeaderLayer::new(HeaderName::from_static("x-request-id")))
        .layer(ValidateRequestHeaderLayer::accept("application/json"))
        .layer(cors)
        .layer(Extension(secret))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|_request: &Request<Body>| tracing::debug_span!("http-request"))
                .on_request(|request: &Request<Body>, span: &Span| {
                    let method = request.method();

                    let uri = request.uri().path();

                    info!("REQUEST - {} | {}", method, uri);
                    println!("Request: {} {}", method, uri);
                    debug!("{:?} | {:?}", request, span);
                })
                .on_response(|response: &Response, latency: Duration, span: &Span| {
                    let status = response.status().as_u16();
                    println!("{} Response generated in {}ms", status, latency.as_millis());
                    info!("RESPONSE - {} | {}ms", status, latency.as_millis());
                    debug!("{:?} | {:?} | {:?}", response, latency, span);
                })
                .on_body_chunk(|chunk: &Bytes, latency: Duration, span: &Span| {
                    debug!(
                        "CHUNK - sending {} took {}ms: {:?}",
                        chunk.len(),
                        latency.as_millis(),
                        span
                    )
                })
                .on_eos(|trailers: Option<&HeaderMap>, stream_duration: Duration, span: &Span| {
                    debug!(
                        "Stream closed after {:?}ms, {:?}, {:?}",
                        stream_duration.as_millis(),
                        trailers.unwrap(),
                        span
                    );
                })
                .on_failure(|error: ServerErrorsFailureClass, latency: Duration, _span: &Span| {
                    eprintln!(
                        "Request failed with error {:?} after {}ms",
                        error,
                        latency.as_millis()
                    );
                    error!("FAILURE - {:?} | {}ms", error, latency.as_millis());
                })
        )
}
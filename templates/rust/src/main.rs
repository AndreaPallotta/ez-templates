use std::net::SocketAddr;

use axum::{ Router, Server };
use server::{ config::Config, constants::CONFIG, logs::set_log, routing::router::create_router };
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    #[derive(utoipa::OpenApi)]
    #[openapi(
        paths(
            server::routing::auth::handle_login,
            server::routing::auth::jwt_validate,
            server::routing::auth::refresh,
            server::routing::user::get_user
        ),
        components(
            schemas(
                server::interfaces::api::ErrorResponse,
                server::interfaces::req::LoginParams,
                server::interfaces::req::JwtValidateParams,
                server::interfaces::req::SignupParams,
                server::interfaces::res::AuthRes,
                server::interfaces::user::User,
                server::interfaces::user::Role
            )
        ),
        tags((name = "Axum API Template", description = "A secure API written in Rust & Axum"))
    )]
    struct ApiDoc;

    Config::global_load_config();

    let config = CONFIG.get().unwrap();

    set_log(&config.log.path, config.log.level);

    let app: Router = create_router().await.merge(
        SwaggerUi::new("/v1").url("/api-docs/openapi.json", ApiDoc::openapi())
    );

    let addr: SocketAddr = SocketAddr::from(config.server.socket_addr());
    tracing::info!("Server listening on {}", addr);
    println!("Server listening on {}", addr);
    Server::bind(&addr).serve(app.into_make_service()).await.expect("Server failed to start");
}
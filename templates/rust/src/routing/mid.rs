use axum::{ http::{ StatusCode, Request }, middleware::Next, response::Response };

use crate::{ jwt::validate_jwt, constants::CONFIG };

pub async fn jwt_middleware<B>(req: Request<B>, next: Next<B>) -> Result<Response, StatusCode> {
    let config = CONFIG.get().unwrap();

    if config.server.env.is_dev() {
        return Ok(next.run(req).await);
    }

    let auth_header = req
        .headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok());

    let token = if let Some(auth_header) = auth_header {
        auth_header.split_whitespace().nth(1)
    } else {
        eprintln!("Error validating token. Bearer token missing in request");
        return Err(StatusCode::UNAUTHORIZED);
    };

    match token {
        Some(tok) =>
            match validate_jwt(&tok.to_string(), &config.server.secret) {
                Ok(_) => {
                    return Ok(next.run(req).await);
                }
                Err(e) => {
                    eprintln!("Error validating JWT token: {:?}", e.to_string());
                    return Err(StatusCode::UNAUTHORIZED);
                }
            }
        None => {
            return Err(StatusCode::UNAUTHORIZED);
        }
    }
}
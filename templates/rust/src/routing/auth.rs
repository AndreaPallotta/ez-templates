use axum::{ http::StatusCode, Json, Extension, extract::Path };
use bcrypt::verify;
use crate::{
    interfaces::{
        api::ApiResponse,
        res::AuthRes,
        req::{ LoginParams, JwtValidateParams },
        user::{ User, Role },
    },
    jwt::{ validate_jwt, generate_jwt },
};

#[utoipa::path(
    post,
    path = "/v1/auth/login",
    request_body = LoginParams,
    responses(
        (status = 200, description = "Return authenticated user", body = AuthRes),
        (status = 400, description = "Credentials are wrong", body = ErrorResponse)
    )
)]
pub async fn handle_login(
    Extension(secret): Extension<String>,
    Json(payload): Json<LoginParams>
) -> (StatusCode, Json<ApiResponse<AuthRes>>) {
    let email: String = payload.email;
    let password: String = payload.password;

    let password_hash: &str = "$2b$12$UL2gWtAI0aPx7Z0nFEHwROxv9CMM8fRvd5HwhfFAsECF6vP3W0212"; // "test"

    if email.is_empty() || password.is_empty() {
        (StatusCode::BAD_REQUEST, ApiResponse::generate_error("Email and/or password are wrong"))
    } else {
        if verify(password, password_hash).unwrap_or(false) {
            let user = User {
                _id: "1234".to_string(),
                first_name: "First Name".to_string(),
                last_name: "Last Name".to_string(),
                email: "test@test.com".to_string(),
                password: None,
                role: Role::USER,
            };
            let token = generate_jwt(&email, &secret).unwrap();
            (StatusCode::OK, ApiResponse::generate_success(AuthRes::new(user, token)))
        } else {
            (
                StatusCode::BAD_REQUEST,
                ApiResponse::generate_error("Email and/or password are wrong"),
            )
        }
    }
}

#[utoipa::path(
    post,
    path = "/v1/auth/validate_jwt",
    request_body = JwtValidateParams,
    responses(
        (status = 200, description = "Return true if jwt is valid", body = bool),
        (status = 401, description = "JWT is invalid", body = ErrorResponse)
    )
)]
pub async fn jwt_validate(
    Extension(secret): Extension<String>,
    Json(payload): Json<JwtValidateParams>
) -> (StatusCode, Json<ApiResponse<bool>>) {
    let token: String = payload.token;

    match validate_jwt(&token, &secret) {
        Ok(_) => (StatusCode::OK, ApiResponse::generate_success(true)),
        Err(e) => {
            eprintln!("Error validating JWT token: {:?}", e.to_string());
            (StatusCode::UNAUTHORIZED, ApiResponse::generate_error("Invalid JWT Token"))
        }
    }
}

#[utoipa::path(
    get,
    path = "/v1/auth/refresh",
    params(("email" = String, Path, description = "user email")),
    responses(
        (status = 200, description = "Return authenticated user", body = String),
        (status = 500, description = "Error generating jwt", body = ErrorResponse)
    )
)]
pub async fn refresh(
    Extension(secret): Extension<String>,
    Path(email): Path<String>
) -> (StatusCode, Json<ApiResponse<String>>) {
    match generate_jwt(&email, &secret) {
        Ok(token) => (StatusCode::OK, ApiResponse::generate_success(token)),
        Err(_) =>
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                ApiResponse::generate_error("Error generating JWT"),
            ),
    }
}
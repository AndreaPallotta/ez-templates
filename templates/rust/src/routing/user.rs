use axum::{ extract::Path, http::StatusCode, Json };
use urlencoding::decode;

use crate::interfaces::{ api::ApiResponse, user::{ User, Role } };

#[utoipa::path(
    get,
    path = "/v1/get_user/{email}",
    params(("email" = String, Path, description = "Email for search")),
    responses(
        (status = 200, description = "Return user associated to email", body = User),
        (status = 500, description = "Error in the database query", body = ErrorResponse)
    )
)]
pub async fn get_user(Path(email): Path<String>) -> (StatusCode, Json<ApiResponse<User>>) {
    let decoded_email = decode(email.as_str()).expect("UTF-8");

    if decoded_email.is_empty() {
        (StatusCode::NOT_FOUND, ApiResponse::generate_error("No User Matches Provided Email"))
    } else {
        let user = User {
            _id: "1234".to_string(),
            first_name: "First Name".to_string(),
            last_name: "Last Name".to_string(),
            email: "test@test.com".to_string(),
            password: None,
            role: Role::USER,
        };
        (StatusCode::OK, ApiResponse::generate_success(user))
    }
}
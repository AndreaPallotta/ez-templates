use axum::Json;
use schemars::JsonSchema;
use serde::{ Deserialize, Serialize };
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, JsonSchema, ToSchema)]
pub struct ErrorResponse {
    pub error_msg: String,
}

#[derive(Serialize)]
#[serde(rename_all = "snake_case", tag = "result", content = "content")]
pub enum ApiResponse<T> {
    Success(T),
    Error(ErrorResponse),
}

impl<T> ApiResponse<T> {
    pub fn generate_error(msg: &str) -> Json<Self> {
        Json(
            Self::Error(ErrorResponse {
                error_msg: msg.to_string(),
            })
        )
    }

    pub fn generate_success(data: T) -> Json<Self> {
        Json(Self::Success(data))
    }
}
use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Deserialize, ToSchema)]
pub struct LoginParams {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, ToSchema)]
pub struct JwtValidateParams {
    pub token: String,
}

#[derive(Deserialize, ToSchema)]
pub struct SignupParams {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: String,
    pub role: String,
}
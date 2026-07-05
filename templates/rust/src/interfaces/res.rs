use serde::Serialize;
use utoipa::ToSchema;

use super::user::User;

#[derive(Serialize, ToSchema)]
pub struct AuthRes {
    user: User,
    token: String,
}

impl AuthRes {
    pub fn new(user: User, token: String) -> Self {
        Self { user, token }
    }
}
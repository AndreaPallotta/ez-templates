use schemars::JsonSchema;
use serde::{ Deserialize, Serialize };
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, JsonSchema, ToSchema)]
pub enum Role {
    USER,
    ADMIN,
}

impl Default for Role {
    fn default() -> Self {
        Role::USER
    }
}

#[derive(Deserialize, Serialize, JsonSchema, Debug, Clone, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct User {
    pub _id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub password: Option<String>,
    #[serde(default)]
    pub role: Role,
}
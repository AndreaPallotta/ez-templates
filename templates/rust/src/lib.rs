pub mod config;
pub mod logs;
pub mod constants;
pub mod jwt;
pub mod routing {
    pub mod router;
    pub mod auth;
    pub mod mid;
    pub mod user;
}
pub mod interfaces {
    pub mod api;
    pub mod user;
    pub mod res;
    pub mod req;
}
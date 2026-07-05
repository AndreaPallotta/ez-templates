use once_cell::sync::OnceCell;
use crate::config::Config;

pub static CONFIG_PATH: &'static str = "config.toml";
pub static INFO_LOG_FILE: &'static str = "info.log";
pub static ERROR_LOG_FILE: &'static str = "error.log";
pub static LOG_TS_FORMAT: &'static str = "%Y-%m-%dT%H:%M:%S";
pub static CONFIG: OnceCell<Config> = OnceCell::new();
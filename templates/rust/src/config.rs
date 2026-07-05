use log::LevelFilter;
use serde::{ Deserialize, Deserializer };
use tracing::info;
use std::{ error::Error, net::{ IpAddr, Ipv4Addr, SocketAddr } };
use tower_http::cors::AllowOrigin;

use crate::constants::{ CONFIG_PATH, CONFIG };

#[derive(Debug, Deserialize, Clone)]
pub struct Config {
    #[serde(rename = "Logs")]
    pub log: LogConfig,
    #[serde(rename = "Server")]
    pub server: ServerConfig,
}

impl Config {
    pub fn parse() -> Result<Self, Box<dyn Error>> {
        let contents = std::fs::read_to_string(CONFIG_PATH)?;
        let config: Self = toml::from_str(&contents)?;

        Ok(config)
    }

    pub fn global_load_config() {
        let parsed_config = Self::parse();

    match parsed_config {
        Ok(conf) => {
            if let Err(err) = CONFIG.set(conf) {
                eprintln!("Error setting config: {:?}", err);
            } else {
                info!("Successfully loaded configuration file");
                println!("Successfully loaded configuration file");
            }
        }
        Err(err) => {
            eprintln!("Error reading config file: {:?}", err);
            return;
        }
    }
    }
}

#[derive(Debug, Deserialize, Clone)]
pub struct LogConfig {
    pub path: String,
    #[serde(deserialize_with = "deserialize_log_level")]
    pub level: LevelFilter,
}

fn deserialize_log_level<'de, D>(deserializer: D) -> Result<LevelFilter, D::Error>
    where D: Deserializer<'de>
{
    let log_string = String::deserialize(deserializer)?;
    let level = match log_string.to_lowercase().as_str() {
        "off" => LevelFilter::Off,
        "error" => LevelFilter::Error,
        "warn" => LevelFilter::Warn,
        "info" => LevelFilter::Info,
        "debug" => LevelFilter::Debug,
        "trace" => LevelFilter::Trace,
        _ => LevelFilter::Info,
    };

    Ok(level)
}

#[derive(Debug, Deserialize, Clone)]
pub struct ServerConfig {
    #[serde(deserialize_with = "deserialize_env")]
    pub env: Environment,
    #[serde(deserialize_with = "deserialize_host")]
    pub host: IpAddr,
    pub port: u16,
    pub secret: String,
    pub origins: Option<Vec<String>>,
}

impl ServerConfig {
    pub fn socket_addr(&self) -> SocketAddr {
        SocketAddr::new(self.host, self.port)
    }

    pub fn allow_origins(&self) -> Option<AllowOrigin> {
        let mut origins = Vec::new();
        match self.origins.as_ref() {
            Some(values) => {
                for value in values {
                    origins.push(value.parse().unwrap());
                }
                return Some(AllowOrigin::list(origins));
            }
            None => None,
        }
    }
}

fn deserialize_host<'de, D>(deserializer: D) -> Result<IpAddr, D::Error> where D: Deserializer<'de> {
    let host = String::deserialize(deserializer)?;
    match host.parse() {
        Ok(ip) => Ok(ip),
        Err(_) => Ok(Ipv4Addr::new(0, 0, 0, 0).into()),
    }
}

fn deserialize_env<'de, D>(deserializer: D) -> Result<Environment, D::Error>
    where D: Deserializer<'de>
{
    let env_string = String::deserialize(deserializer)?;

    let env = match env_string.to_lowercase().as_str() {
        "development" => Environment::DEV,
        "production" => Environment::PROD,
        _ => Environment::DEV,
    };

    Ok(env)
}

#[derive(Debug, Deserialize, PartialEq, Clone)]
pub enum Environment {
    DEV,
    PROD,
}

impl Environment {
    pub fn is_dev(&self) -> bool {
        return self == &Environment::DEV;
    }

    pub fn is_prod(&self) -> bool {
        return self == &Environment::PROD;
    }

    pub fn is_equal(&self, compare_with: &Environment) -> bool {
        return self == compare_with;
    }

    pub fn compare(env: &Environment, compare_with: &Environment) -> bool {
        return env == compare_with;
    }
}
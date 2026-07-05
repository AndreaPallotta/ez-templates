use chrono::Utc;
use log::{ Level, LevelFilter, Log, Metadata, Record };
use std::io::Write;
use std::{ fs, path::PathBuf };
use crate::constants::{ ERROR_LOG_FILE, INFO_LOG_FILE, LOG_TS_FORMAT };

struct Logger {
    info_file: fs::File,
    error_file: fs::File,
}

impl Logger {
    fn new(path: &str) -> Logger {
        let log_dir_path = PathBuf::from(path);
        create_folder_path(&log_dir_path);

        let mut info_log = log_dir_path.clone();
        let mut error_log = log_dir_path.clone();

        info_log.push(INFO_LOG_FILE);
        error_log.push(ERROR_LOG_FILE);

        Self {
            info_file: create_new_file(&info_log),
            error_file: create_new_file(&error_log),
        }
    }
}

impl Log for Logger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= Level::Info && metadata.target() != "surf::middleware::logger::native"
    }

    fn flush(&self) {}

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            let timestamp = Utc::now().format(LOG_TS_FORMAT).to_string();
            let message = format!("{} - {} - {}", timestamp, record.level(), record.args());
            let mut file = match record.level() {
                Level::Error => &self.error_file,
                _ => &self.info_file,
            };

            if let Err(err) = writeln!(file, "{}", message) {
                eprintln!("Error writing to log file: {}", err);
            }
        }
    }
}

pub fn set_log(path: &str, level: LevelFilter) {
    let logger = Logger::new(path);
    log::set_boxed_logger(Box::new(logger)).unwrap();
    log::set_max_level(level);
}

fn create_new_file(name: &PathBuf) -> fs::File {
    fs::OpenOptions::new().create(true).append(true).open(name).ok().unwrap()
}

fn create_folder_path(path: &PathBuf) {
    if !path.exists() {
        if let Err(e) = fs::create_dir_all(path) {
            eprintln!("Failed to create directory {}: {}", path.display(), e);
        }
    }
}
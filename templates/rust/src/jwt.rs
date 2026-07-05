use jsonwebtoken::{
    decode,
    encode,
    errors::{ Error, ErrorKind },
    DecodingKey,
    EncodingKey,
    Header,
    Validation,
};
use serde::{ Deserialize, Serialize };
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Claims {
    sub: String,
    iat: usize,
    exp: usize,
}

pub fn generate_jwt(sub: &String, secret: &String) -> Result<String, jsonwebtoken::errors::Error> {
    let header = Header::default();
    let claims = Claims {
        sub: sub.to_string(),
        iat: chrono::Utc::now().timestamp() as usize,
        exp: (chrono::Utc::now() + chrono::Duration::minutes(15)).timestamp() as usize,
    };
    encode(&header, &claims, &EncodingKey::from_secret(secret.as_ref()))
}

pub fn validate_jwt(token: &String, secret: &String) -> Result<bool, Error> {
    let validation = Validation::new(jsonwebtoken::Algorithm::HS256);

    let result = decode::<Claims>(&token, &DecodingKey::from_secret(secret.as_ref()), &validation);

    match result {
        Ok(_) => Ok(true),
        Err(e) => {
            if e.kind() == &ErrorKind::ExpiredSignature {
                Err(ErrorKind::ExpiredSignature.into())
            } else {
                Err(ErrorKind::InvalidToken.into())
            }
        }
    }
}
use base64::{engine::general_purpose, Engine as _};
use gmsm::g2::consts::C1C2C3;
use gmsm::g2::consts::C1C3C2;
use gmsm::g2::p256::Sm2P256Curve;
use gmsm::g2::subject::bytes_to_public_key;
use gmsm::g2::subject::decrypt;
use gmsm::g2::subject::encrypt;

use gmsm::g2::subject::{PrivateKey, PublicKey};
use gmsm::sm2::sm2_decrypt_c1c3c2;
use gmsm::sm2::sm2_encrypt_c1c3c2;
use gmsm::sm2::sm2_generate_key_hex;
use gmsm::sm3::sm3_hex;
use gmsm::sm4::{
    sm4_cbc_decrypt_byte, sm4_cbc_decrypt_hex, sm4_cbc_encrypt_byte, sm4_cbc_encrypt_hex,
    sm4_ecb_decrypt_byte, sm4_ecb_decrypt_hex, sm4_ecb_encrypt_byte, sm4_ecb_encrypt_hex,
};
use num::{BigUint, FromPrimitive, Integer, Num};
use serde::Deserialize;
use serde::Serialize;
use serde_repr::{Deserialize_repr, Serialize_repr};
use std::ops::{Add, Sub};
use std::panic;
use std::time::Instant;
#[derive(Serialize, Deserialize, Clone)]
pub struct Sm2EncryptRequest {
    pub input_format: MessageFormat,
    pub output_format: MessageFormat,
    pub source_string: String,
    pub public_key: Option<String>,
    pub private_key: Option<String>,
    pub public_key_format: Option<MessageFormat>,
    pub private_key_format: Option<MessageFormat>,
    pub algorithm_type: AlgorithmType,
}
#[derive(Serialize, Deserialize, Clone)]
pub struct Sm4EncryptRequest {
    pub input_format: MessageFormat,
    pub output_format: MessageFormat,
    pub source_string: String,
    pub key: String,
    pub iv: Option<String>,
    pub key_format: MessageFormat,
    pub iv_format: Option<MessageFormat>,
    pub sm4_algorithm_type: Sm4AlgorithmType,
}
#[derive(Serialize_repr, Deserialize_repr, Clone)]
#[repr(u8)]

pub enum MessageFormat {
    Hex = 0,
    Base64 = 1,
    Text = 2,
}
#[derive(Serialize_repr, Deserialize_repr, Clone)]
#[repr(u8)]

pub enum Sm4AlgorithmType {
    Cbc = 0,
    Ecb = 1,
}
#[derive(Serialize_repr, Deserialize_repr, Clone)]
#[repr(u8)]

pub enum AlgorithmType {
    C1C2C3 = 0,
    C1C3C2 = 1,
}
pub fn sm2_encrypt_with_error(
    sm2_encrypt_request: Sm2EncryptRequest,
) -> Result<String, anyhow::Error> {
    let public_key_str = sm2_encrypt_request
        .public_key
        .ok_or(anyhow!("public_key is empty"))?;
    let source_vec = match sm2_encrypt_request.input_format {
        MessageFormat::Hex => hex::decode(sm2_encrypt_request.source_string)?,
        MessageFormat::Base64 => {
            general_purpose::STANDARD.decode(sm2_encrypt_request.source_string)?
        }
        MessageFormat::Text => sm2_encrypt_request.source_string.as_bytes().to_vec(),
    };
    let public_key_format = sm2_encrypt_request
        .public_key_format
        .ok_or(anyhow!("public_key_format is empty"))?;
    let public_key_decode = match public_key_format {
        MessageFormat::Hex => {
            let pub_hex_trim = public_key_str.trim_start_matches("04");
            hex::decode(pub_hex_trim)?
        }
        MessageFormat::Base64 => {
            let src_vec = general_purpose::STANDARD.decode(public_key_str)?;
            let hex_encode = hex::encode(src_vec);
            let pub_hex_trim = hex_encode.trim_start_matches("04");
            hex::decode(pub_hex_trim)?
        }
        MessageFormat::Text => Err(anyhow!("public_key_format error"))?,
    };
    let public_key = bytes_to_public_key(public_key_decode);
    let algorithm_type = match sm2_encrypt_request.algorithm_type {
        AlgorithmType::C1C2C3 => C1C2C3,
        AlgorithmType::C1C3C2 => C1C3C2,
    };
    let result_vec = panic::catch_unwind(|| encrypt(public_key, source_vec, algorithm_type))
        .map_err(|_| anyhow!("sm2_encrypt_c1c3c2 error"))?;
    let result = match sm2_encrypt_request.output_format {
        MessageFormat::Hex => hex::encode(result_vec),
        MessageFormat::Base64 => general_purpose::STANDARD.encode(result_vec),
        MessageFormat::Text => String::from_utf8(result_vec)?,
    };
    Ok(result)
}
pub fn sm2_decrypt_with_error(
    sm2_encrypt_request: Sm2EncryptRequest,
) -> Result<String, anyhow::Error> {
    let source_vec = match sm2_encrypt_request.input_format {
        MessageFormat::Hex => hex::decode(sm2_encrypt_request.source_string)?,
        MessageFormat::Base64 => {
            general_purpose::STANDARD.decode(sm2_encrypt_request.source_string)?
        }
        MessageFormat::Text => sm2_encrypt_request.source_string.as_bytes().to_vec(),
    };

    let algorithm_type = match sm2_encrypt_request.algorithm_type {
        AlgorithmType::C1C2C3 => C1C2C3,
        AlgorithmType::C1C3C2 => C1C3C2,
    };
    let private_key_str = sm2_encrypt_request
        .private_key
        .ok_or(anyhow!("private_key is empty"))?;
    let private_key_format = sm2_encrypt_request
        .private_key_format
        .ok_or(anyhow!("private_key_format is empty"))?;

    let source_private_key_hex = match private_key_format {
        MessageFormat::Hex => private_key_str,
        MessageFormat::Base64 => hex::encode(general_purpose::STANDARD.decode(private_key_str)?),
        MessageFormat::Text => Err(anyhow!("private_key_format error"))?,
    };
    info!("private key:{}", source_private_key_hex);
    let sm2_p256 = Sm2P256Curve::new();
    let pri = BigUint::from_str_radix(source_private_key_hex.as_str(), 16)?;
    info!("reach--");

    let (pkx, pky) = sm2_p256.scalar_base_mult(pri.to_bytes_be());
    let priv_g = PrivateKey {
        curve: sm2_p256.params().clone(),
        public_key: PublicKey { x: pkx, y: pky },
        d: pri,
    };
    let result_vec = panic::catch_unwind(|| decrypt(priv_g, source_vec, algorithm_type))
        .map_err(|_| anyhow!("sm2_encrypt_c1c3c2 error"))?;
    info!("reach4");
    let result = match sm2_encrypt_request.output_format {
        MessageFormat::Hex => hex::encode(result_vec),
        MessageFormat::Base64 => general_purpose::STANDARD.encode(result_vec),
        MessageFormat::Text => String::from_utf8_lossy(result_vec.as_slice()).to_string(),
    };
    info!("reach5");
    Ok(result)
}
pub fn get_sm2_keypair_with_error() -> Result<Vec<String>, anyhow::Error> {
    let keypair = sm2_generate_key_hex();
    let pri_key = keypair.pri_hex;
    let pub_hex = keypair.pub_hex;

    Ok(vec![pub_hex, pri_key])
}
pub fn sm3_encrypt_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let cipher = sm3_hex(&source_string);

    Ok(cipher)
}

pub fn sm4_encrypt_with_error(
    sm4_encrypt_request: Sm4EncryptRequest,
) -> Result<String, anyhow::Error> {
    let source_vec = match sm4_encrypt_request.input_format {
        MessageFormat::Hex => hex::decode(sm4_encrypt_request.source_string)?,
        MessageFormat::Base64 => {
            general_purpose::STANDARD.decode(sm4_encrypt_request.source_string)?
        }
        MessageFormat::Text => sm4_encrypt_request.source_string.as_bytes().to_vec(),
    };
    let key_vec = match sm4_encrypt_request.key_format {
        MessageFormat::Hex => hex::decode(sm4_encrypt_request.key)?,
        MessageFormat::Base64 => general_purpose::STANDARD.decode(sm4_encrypt_request.key)?,
        MessageFormat::Text => sm4_encrypt_request.key.as_bytes().to_vec(),
    };
    ensure!(key_vec.len() == 16, "key length must be 16");
    let result_vec = match sm4_encrypt_request.sm4_algorithm_type {
        Sm4AlgorithmType::Ecb => {
            panic::catch_unwind(|| sm4_ecb_encrypt_byte(&source_vec, &key_vec))
                .map_err(|e| anyhow!("sm4 ecb encrypt error,error is {:?}", e))?
        }
        Sm4AlgorithmType::Cbc => {
            let iv_str = sm4_encrypt_request.iv.ok_or(anyhow!("iv is required"))?;
            ensure!(iv_str.len() == 16, "iv length must be 16");

            let iv_format = sm4_encrypt_request
                .iv_format
                .ok_or(anyhow!("iv is required"))?;
            let iv_vec = match iv_format {
                MessageFormat::Hex => hex::decode(iv_str)?,
                MessageFormat::Base64 => general_purpose::STANDARD.decode(iv_str)?,
                MessageFormat::Text => iv_str.as_bytes().to_vec(),
            };
            panic::catch_unwind(|| sm4_cbc_encrypt_byte(&source_vec, &key_vec, &iv_vec))
                .map_err(|e| anyhow!("sm4 cbc encrypt error,error is {:?}", e))?
        }
    };
    let result = match sm4_encrypt_request.output_format {
        MessageFormat::Hex => hex::encode(result_vec),
        MessageFormat::Base64 => general_purpose::STANDARD.encode(result_vec),
        MessageFormat::Text => Err(anyhow!("output format must be hex or base64"))?,
    };
    Ok(result)
}
pub fn sm4_decrypt_with_error(
    sm4_encrypt_request: Sm4EncryptRequest,
) -> Result<String, anyhow::Error> {
    let source_vec = match sm4_encrypt_request.input_format {
        MessageFormat::Hex => hex::decode(sm4_encrypt_request.source_string)?,
        MessageFormat::Base64 => {
            general_purpose::STANDARD.decode(sm4_encrypt_request.source_string)?
        }
        MessageFormat::Text => Err(anyhow!("source string must be hex or base64"))?,
    };
    let key_vec = match sm4_encrypt_request.key_format {
        MessageFormat::Hex => hex::decode(sm4_encrypt_request.key)?,
        MessageFormat::Base64 => general_purpose::STANDARD.decode(sm4_encrypt_request.key)?,
        MessageFormat::Text => sm4_encrypt_request.key.as_bytes().to_vec(),
    };
    ensure!(key_vec.len() == 16, "key length must be 16");

    let result_vec = match sm4_encrypt_request.sm4_algorithm_type {
        Sm4AlgorithmType::Ecb => {
            panic::catch_unwind(|| sm4_ecb_decrypt_byte(&source_vec, &key_vec))
                .map_err(|e| anyhow!("sm4 ecb decrypt error,the error is {:?}", e))?
        }
        Sm4AlgorithmType::Cbc => {
            let iv_str = sm4_encrypt_request.iv.ok_or(anyhow!("iv is required"))?;
            let iv_format = sm4_encrypt_request
                .iv_format
                .ok_or(anyhow!("iv is required"))?;
            let iv_vec = match iv_format {
                MessageFormat::Hex => hex::decode(iv_str)?,
                MessageFormat::Base64 => general_purpose::STANDARD.decode(iv_str)?,
                MessageFormat::Text => iv_str.as_bytes().to_vec(),
            };
            panic::catch_unwind(|| sm4_cbc_decrypt_byte(&source_vec, &key_vec, &iv_vec))
                .map_err(|e| anyhow!("sm4 cbc decrypt error,error is {:?}", e))?
        }
    };
    let result = match sm4_encrypt_request.output_format {
        MessageFormat::Hex => hex::encode(result_vec),
        MessageFormat::Base64 => general_purpose::STANDARD.encode(result_vec),
        MessageFormat::Text => String::from_utf8(result_vec)?,
    };
    Ok(result)
}

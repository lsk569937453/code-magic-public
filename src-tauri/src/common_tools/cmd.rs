use crate::common_tools::about::get_about_version_with_error;
use crate::common_tools::base64::base64_decode_with_error;
use crate::common_tools::base64::base64_encode_of_image_with_error;
use crate::common_tools::base64::base64_encode_with_error;
use crate::common_tools::base64::base64_save_image_with_error;
use crate::common_tools::base_response::BaseResponse;
use crate::common_tools::code_full_half::to_cdb_with_error;
use crate::common_tools::code_full_half::to_dbc_with_error;
use crate::common_tools::crypto_algorithm::get_sm2_keypair_with_error;
use crate::common_tools::crypto_algorithm::sm2_decrypt_with_error;
use crate::common_tools::crypto_algorithm::sm2_encrypt_with_error;
use crate::common_tools::crypto_algorithm::sm3_encrypt_with_error;
use crate::common_tools::crypto_algorithm::sm4_decrypt_with_error;
use crate::common_tools::crypto_algorithm::sm4_encrypt_with_error;
use crate::common_tools::crypto_algorithm::Sm2EncryptRequest;
use crate::common_tools::crypto_algorithm::Sm4EncryptRequest;
use crate::common_tools::format::format_pretty_json_with_error;
use crate::common_tools::format::format_pretty_yaml_with_error;
use crate::common_tools::format::format_xml_with_error;
use crate::common_tools::md5::digest_all_with_error;
use crate::common_tools::qrcode::export_barcode_with_error;
use crate::common_tools::qrcode::export_qrcode_with_error;
use crate::common_tools::qrcode::get_barcode_with_error;
use crate::common_tools::qrcode::get_qrcode_with_error;
use crate::common_tools::sql_lite::get_menu_config_with_error;
use crate::common_tools::sql_lite::reset_menu_index_with_error;
use crate::common_tools::sql_lite::set_menu_index_with_error;
use crate::common_tools::sql_lite::GetMenuConfigReq;
use crate::common_tools::timestamp::format_datetime_to_timestamp_with_error;
use crate::common_tools::timestamp::format_timestamp_to_datetime_with_error;
use crate::common_tools::timestamp::get_current_timestamp_with_error;
use crate::common_tools::urlencode::url_decode_with_error;
use crate::common_tools::urlencode::url_encode_with_error;

use crate::sql_lite::connection::{SqlLite, SqlLiteState};
use tauri::State;
#[tauri::command]
pub fn base64_encode(source_string: String) -> String {
    match base64_encode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn base64_decode(source_string: String) -> String {
    match base64_decode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn to_cdb(source_string: String) -> String {
    match to_cdb_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn to_dbc(source_string: String) -> String {
    match to_dbc_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn base64_encode_of_image(source_string: String) -> String {
    match base64_encode_of_image_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn base64_save_image(source_string: String) -> String {
    match base64_save_image_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn url_encode(source_string: String) -> String {
    match url_encode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn url_decode(source_string: String) -> String {
    match url_decode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn get_current_timestamp() -> String {
    match get_current_timestamp_with_error() {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn format_datetime_to_timestamp(source_string: String) -> String {
    info!("aaaaaaa{}", source_string);
    match format_datetime_to_timestamp_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}

#[tauri::command]
pub fn format_timestamp_to_datetime(source_timestamp: i64) -> String {
    match format_timestamp_to_datetime_with_error(source_timestamp) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}

#[tauri::command]
pub fn digest_all(
    source_string_option: Option<String>,
    file_list_option: Option<Vec<String>>,
) -> String {
    match digest_all_with_error(source_string_option, file_list_option) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn get_qrcode(source_string: String) -> String {
    match get_qrcode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn sm3_encrypt(source_string: String) -> String {
    match sm3_encrypt_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn sm4_encrypt(sm4_encrypt_request: Sm4EncryptRequest) -> String {
    match sm4_encrypt_with_error(sm4_encrypt_request) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn sm4_decrypt(sm4_encrypt_request: Sm4EncryptRequest) -> String {
    match sm4_decrypt_with_error(sm4_encrypt_request) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}

#[tauri::command]
pub fn sm2_encrypt(sm2_encrypt_request: Sm2EncryptRequest) -> String {
    match sm2_encrypt_with_error(sm2_encrypt_request) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn sm2_decrypt(sm2_encrypt_request: Sm2EncryptRequest) -> String {
    match sm2_decrypt_with_error(sm2_encrypt_request) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn get_sm2_keypair() -> String {
    match get_sm2_keypair_with_error() {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn get_barcode(source_string: String) -> String {
    match get_barcode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn export_qrcode(source_string: String) -> String {
    match export_qrcode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn export_barcode(source_string: String) -> String {
    match export_barcode_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn format_pretty_json(source_string: String) -> String {
    match format_pretty_json_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn format_pretty_yaml(source_string: String) -> String {
    match format_pretty_yaml_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn format_pretty_xml(source_string: String) -> String {
    match format_xml_with_error(source_string) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn get_about_version() -> String {
    match get_about_version_with_error() {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn get_menu_config(
    state: State<SqlLiteState>,
    get_menu_config_reqs: Vec<GetMenuConfigReq>,
) -> String {
    match get_menu_config_with_error(state, get_menu_config_reqs) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn reset_menu_index(state: State<SqlLiteState>) -> String {
    match reset_menu_index_with_error(state) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}
#[tauri::command]
pub fn set_menu_index(
    state: State<SqlLiteState>,
    source_index: i32,
    dst_menu_index: i32,
) -> String {
    match set_menu_index_with_error(state, source_index, dst_menu_index) {
        Ok(item) => {
            let res = BaseResponse {
                response_code: 0,
                response_msg: item,
            };
            serde_json::to_string(&res).unwrap()
        }
        Err(e) => {
            let res = BaseResponse {
                response_code: 1,
                response_msg: e.to_string(),
            };
            serde_json::to_string(&res).unwrap()
        }
    }
}

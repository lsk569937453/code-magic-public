use percent_encoding::{percent_decode, utf8_percent_encode, CONTROLS, NON_ALPHANUMERIC};

pub fn url_encode_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let iter = utf8_percent_encode(source_string.as_str(), NON_ALPHANUMERIC);
    let encoded: String = iter.collect();
    Ok(encoded)
}
pub fn url_decode_with_error(source_string: String) -> Result<String, anyhow::Error> {
    let iter = percent_decode(source_string.as_bytes());
    let decoded = iter.decode_utf8()?.to_string();
    Ok(decoded)
}

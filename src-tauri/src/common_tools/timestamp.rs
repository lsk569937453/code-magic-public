use std::f32::consts::E;

use anyhow::anyhow;
use chrono::prelude::DateTime;
use chrono::FixedOffset;
use chrono::Local;
use chrono::LocalResult;
use chrono::NaiveDateTime;
use chrono::TimeZone;
use chrono::Utc;

pub fn get_current_timestamp_with_error() -> Result<String, anyhow::Error> {
    let offset = FixedOffset::east_opt(8 * 60 * 60).ok_or(anyhow!("FixedOffset new error!"))?;
    let now = chrono::offset::Utc::now().with_timezone(&offset);
    let res = now.timestamp().to_string();
    Ok(res)
}
pub fn format_datetime_to_timestamp_with_error(
    source_date_string: String,
) -> Result<String, anyhow::Error> {
    let source_with_timezone = format!("{} +0800", source_date_string);
    let source_format = "%Y-%m-%d %H:%M:%S %z";
    let naive_datetime = DateTime::parse_from_str(&source_with_timezone, source_format)?;
    let timestamp = naive_datetime.timestamp().to_string();
    info!("aaa;{}", timestamp);
    Ok(timestamp)
}
pub fn format_timestamp_to_datetime_with_error(
    source_timestamp: i64,
) -> Result<String, anyhow::Error> {
    let offset = FixedOffset::east_opt(8 * 60 * 60).ok_or(anyhow!("FixedOffset new error!"))?;
    if let LocalResult::Single(t) = offset.timestamp_opt(source_timestamp, 0) {
        let formatted = format!("{}", t.format("%Y-%m-%d %H:%M:%S"));
        return Ok(formatted);
    }
    Err(anyhow!(""))
}

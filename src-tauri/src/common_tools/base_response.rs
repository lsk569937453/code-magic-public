use serde::Deserialize;
use serde::Serialize;
#[derive(Serialize, Deserialize, Clone)]

pub struct BaseResponse<T> {
    pub response_code: i32,
    pub response_msg: T,
}

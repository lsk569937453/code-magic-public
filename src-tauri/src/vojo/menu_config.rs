use serde::Deserialize;
use serde::Serialize;
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MenuConfig {
    pub id: i32,
    pub menu_index: i32,
    pub source_index: i32,
}

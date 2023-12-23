use crate::sql_lite::connection::{SqlLite, SqlLiteState};
use crate::vojo::menu_config::MenuConfig;
use rusqlite::{params, Connection, Result};
use serde::Deserialize;
use serde::Serialize;
use tauri::State;
#[derive(Serialize, Deserialize, Clone)]

pub struct GetMenuConfigReq {
    pub menu_index: i32,
    pub source_index: i32,
}
pub fn get_menu_config_with_error(
    state: State<SqlLiteState>,
    get_menu_config_reqs: Vec<GetMenuConfigReq>,
) -> Result<Vec<MenuConfig>, anyhow::Error> {
    let sql_lite = state.0.lock().map_err(|e| anyhow!("lock error"))?;

    let connection = &sql_lite.connection;
    let mut statement = connection.prepare("SELECT id,menu_index,source_index FROM menu_config")?;
    let rows: Vec<_> = statement
        .query_map([], |row| {
            Ok(MenuConfig {
                id: row.get(0)?,
                menu_index: row.get(1)?,
                source_index: row.get(2)?,
            })
        })?
        .collect();
    let mut menu_configs: Vec<MenuConfig> = vec![];
    for name_result in rows {
        menu_configs.push(name_result?);
    }
    if menu_configs.is_empty() || menu_configs.len() != get_menu_config_reqs.len() {
        connection.execute("delete from menu_config", params![])?;
        for get_menu_config_req in get_menu_config_reqs {
            connection.execute(
                "insert into menu_config (menu_index,source_index) values (?1,?2)",
                params![
                    get_menu_config_req.menu_index,
                    get_menu_config_req.source_index
                ],
            )?;
        }
        let mut statement =
            connection.prepare("SELECT id,menu_index,source_index FROM menu_config")?;
        let rows: Vec<_> = statement
            .query_map([], |row| {
                Ok(MenuConfig {
                    id: row.get(0)?,
                    menu_index: row.get(1)?,
                    source_index: row.get(2)?,
                })
            })?
            .collect();
        for name_result in rows {
            menu_configs.push(name_result?);
        }
        menu_configs.sort_by_key(|item| item.menu_index);
        Ok(menu_configs)
    } else {
        menu_configs.sort_by_key(|item| item.menu_index);

        Ok(menu_configs)
    }
}
pub fn set_menu_index_with_error(
    state: State<SqlLiteState>,
    source_index: i32,
    dst_menu_index: i32,
) -> Result<(), anyhow::Error> {
    info!(
        "souce_index:{},dst_menu_index:{}",
        source_index, dst_menu_index
    );
    let sql_lite = state.0.lock().map_err(|e| anyhow!("lock error"))?;

    let connection = &sql_lite.connection;
    let mut statement = connection.prepare("SELECT id,menu_index,source_index FROM menu_config")?;
    let rows: Vec<_> = statement
        .query_map([], |row| {
            Ok(MenuConfig {
                id: row.get(0)?,
                menu_index: row.get(1)?,
                source_index: row.get(2)?,
            })
        })?
        .collect();
    let mut menu_configs: Vec<MenuConfig> = vec![];
    let mut source_menu_index = 0;
    for name_result in rows {
        let item = name_result?;
        if item.source_index == source_index {
            source_menu_index = item.menu_index;
        }
        menu_configs.push(item);
    }
    ensure!(!menu_configs.is_empty(), "menu_config is empty");
    let start = if source_menu_index < dst_menu_index {
        source_menu_index
    } else {
        dst_menu_index
    };
    let end = if source_menu_index > dst_menu_index {
        source_menu_index
    } else {
        dst_menu_index
    };
    let move_forward = source_menu_index > dst_menu_index;

    info!(
        "start:{},end:{},move_forward:{},source_menu_index:{},dst_menu_index:{}",
        start, end, move_forward, source_menu_index, dst_menu_index
    );
    menu_configs.sort_by_key(|item: &MenuConfig| item.menu_index);
    for item in menu_configs.iter_mut() {
        if move_forward {
            if item.menu_index == end {
                item.menu_index = start;
            } else if item.menu_index >= start && item.menu_index < end {
                item.menu_index += 1;
            }
        } else if item.menu_index == start {
            item.menu_index = end;
        } else if item.menu_index > start && item.menu_index <= end {
            item.menu_index -= 1;
        }

        info!("aa");
    }

    info!("menu_configs:{}", serde_json::to_string(&menu_configs)?);
    for menu_config in menu_configs {
        connection.execute(
            "update menu_config set menu_index=(?1) where source_index=(?2) ",
            params![menu_config.menu_index, menu_config.source_index],
        )?;
    }

    Ok(())
}
pub fn reset_menu_index_with_error(state: State<SqlLiteState>) -> Result<(), anyhow::Error> {
    let sql_lite = state.0.lock().map_err(|e| anyhow!("lock error"))?;

    let connection = &sql_lite.connection;
    let mut statement =
        connection.execute("update menu_config set menu_index=source_index", params![])?;
    Ok(())
}

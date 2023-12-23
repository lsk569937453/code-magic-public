// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use std::time::Duration;
mod common_tools;
mod sql_lite;
mod vojo;
use crate::common_tools::cmd::*;
use log::LevelFilter;
#[macro_use]
extern crate anyhow;
#[macro_use]
extern crate log;
use crate::sql_lite::connection::{SqlLite, SqlLiteState};
use std::sync::RwLock;
use tauri::Manager;
use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use tokio::time::sleep;
fn main() -> Result<(), anyhow::Error> {
    let quit = CustomMenuItem::new("quit".to_string(), "退出");
    let show = CustomMenuItem::new("show".to_string(), "显示");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);
    let sql_lite = SqlLite::new()?;
    let sql_lite_state = SqlLiteState(Mutex::new(sql_lite));
    tauri::Builder::default()
        .manage(sql_lite_state)
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(LevelFilter::Info)
                .build(),
        )
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
                // adapt sleeping time to be long enough
                sleep(Duration::from_millis(500)).await;
                main_window.show().unwrap();
            });

            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                info!("system tray received a left click");
            }

            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                // let window = app.create_tao_window();
                info!("system tray received a double click");
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            base64_encode,
            base64_decode,
            base64_encode_of_image,
            base64_save_image,
            to_cdb,
            to_dbc,
            url_encode,
            url_decode,
            get_current_timestamp,
            format_datetime_to_timestamp,
            format_timestamp_to_datetime,
            digest_all,
            get_sm2_keypair,
            sm2_encrypt,
            sm2_decrypt,
            sm3_encrypt,
            sm4_encrypt,
            sm4_decrypt,
            get_qrcode,
            get_barcode,
            export_qrcode,
            export_barcode,
            format_pretty_json,
            format_pretty_yaml,
            format_pretty_xml,
            get_about_version,
            get_menu_config,
            set_menu_index,
            reset_menu_index
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}

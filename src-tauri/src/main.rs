// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod manejador_archivos;
mod runner;
use crate::manejador_archivos::*;
use crate::runner::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            listardir,
            check_path_type,
            read_file,
            save_file,
            create_file,
            delete_dir,
            delete_file,
            load_config_estilos,
            load_config_editor,
            ejecutar_codigo
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::fs;
use std::fs::File;
use std::path::Path;
use std::io::{Read, Write};
use serde_json::json;

#[tauri::command]
pub fn load_config_estilos() -> Result<String, String> {
    let res = match read_file("./config/estilos.json") {
        Ok(res) => res,
        Err(e) => return Err(format!("No se pudo cargar el archivo de configuración: {}", e)),
    };
    Ok(res)
}

#[tauri::command]
pub fn load_config_editor() -> Result<String, String> {
    let res = match read_file("./config/settings.json") {
        Ok(res) => res,
        Err(e) => return Err(format!("No se pudo cargar el archivo de configuración: {}", e)),
    };
    Ok(res)
}


#[tauri::command]
pub fn listardir(path: &str) -> Vec<serde_json::Value> {
    fs::read_dir(path)
        .unwrap()
        .filter_map(|entry| {
            let entry = entry.unwrap();
            let path = entry.path();
            let name = path.file_name()?.to_string_lossy().to_string();
            let is_dir = path.is_dir();
            let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
            let obj = json!({
                "ext": ext,
                "path": path,
                "name": name,
                "isDir": is_dir
            });
            Some(obj)
        })
        .collect()
}

#[tauri::command]
pub fn check_path_type(path: &str) -> Result<String, String> {
    let path = Path::new(path);
    if path.exists() {
        if path.is_file() {
            Ok("Archivo".to_string())
        } else if path.is_dir() {
            Ok("Carpeta".to_string())
        } else {
            Err("Desconocido".to_string())
        }
    } else {
        Err("No existe".to_string())
    }
}

#[tauri::command]
pub fn save_file(path: &str, contenido: &str) -> Result<(), String> {
    let path = Path::new(path);
    let mut file = match File::create(&path) {
        Ok(file) => file,
        Err(e) => return Err(format!("El archivo no existe: {}", e)),
    };

    if let Err(e) = file.write_all(contenido.as_bytes()) {
        return Err(format!("Error al escribir en el archivo: {}", e));
    }

    Ok(())
}

#[tauri::command]
pub fn create_file(path: &str) -> Result<bool, String> {
    let path = Path::new(path);
    let _file = match File::create(&path) {
        Ok(_file) => _file,
        Err(e) => return Err(format!("Error al crear el archivo: {}", e)),
        };
    Ok(true)
}

#[tauri::command]
pub fn read_file(path: &str) -> Result<String, String> {
    let mut archivo = match File::open(path) {
        Ok(file) => file,
        Err(e) => return Err(format!("No se pudo abrir el archivo: {}", e)),
    };

    let mut contenido_bytes = Vec::new();
    if let Err(e) = archivo.read_to_end(&mut contenido_bytes) {
        return Err(format!("No se pudo leer el contenido del archivo: {}", e));
    }

    let contenido = String::from_utf8_lossy(&contenido_bytes).to_string();
    Ok(contenido)
}

#[tauri::command]
pub fn delete_file(path: &str) -> Result<(), String> {
    match fs::remove_file(path) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("No se pudo borrar el archivo: {}", e))
    }
}

#[tauri::command]
pub fn delete_dir(path: &str) -> Result<(), String> {
    match fs::remove_dir(path) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("No se pudo borrar el directorio: {}", e))
    }
}
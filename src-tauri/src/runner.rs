use std::fs::File;
use std::io::{Read, BufReader, Result, BufRead};
use std::process::Command;
use serde_json::{Value};
use regex::Regex;

const PATH_CONFIG: &str = "./config/settings.json";

fn extract_includes(file_path: &str) -> Result<Vec<String>> {
    let file: File = File::open(file_path)?;
    let reader:BufReader<File> = BufReader::new(file);
    let include_regex:Regex = Regex::new(r#"^#include\s+"([^"]+)""#).unwrap();
    let mut includes:Vec<String>  = Vec::new();

    for line in reader.lines() {
        let line = line?;
        if let Some(captures) = include_regex.captures(&line) {
            if let Some(include) = captures.get(1) {
                includes.push(include.as_str().to_owned());
            }
        }
    }

    Ok(includes)
}

fn analizar_cabeceras(path: &str) {
    match extract_includes(path) {
        Ok(includes) => {
            println!("Archivos incluidos:");
            for include in includes {
                println!("{}", include);
            }
        }
        Err(error) => {
            eprintln!("Error al extraer los archivos incluidos: {}", error);
        }
    }
}

// fn crear_makefile(path: &str, archivos: Vec<String>) -> Result<(), String> {
// }

#[tauri::command]
pub fn ejecutar_codigo(path: &str, filename: &str, lang: &str) {
    if lang == "c" || lang == "cpp" {
        // let archivos = analizar_cabeceras(path);
    }

    let mut file:File = File::open(PATH_CONFIG).expect("Error al abrir el archivo");
    let mut contents:String = String::new();
    file.read_to_string(&mut contents).expect("Error al leer el archivo");

    let config: Value  = serde_json::from_str(&contents).expect("Error al analizar el JSON");
    let cmd:&str  = config["ejecuciones"]["comandos"][lang].as_str().unwrap();
    let mut _output = Command::new("cmd")
        .args(&["/C", "start", "cmd", "/K", &format!("cd {} && {} {}", path, cmd, filename)])
        .spawn()
        .expect("Error al ejecutar");
}
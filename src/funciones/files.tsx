import { invoke } from "@tauri-apps/api/tauri";
import { dialog } from "@tauri-apps/api";
import { dirname } from '@tauri-apps/api/path'

async function exec_code(dir:string, filename:string, lang:string) {
    invoke("ejecutar_codigo", {path:await dirname(dir), filename, lang}).then( res => console.log(res))
}

async function listarDir(path:string){
    return invoke("listardir", {path}).then((res) => res)
}

async function loadFile(path:string){
    return invoke("read_file", {path})
    .then((res) => res)
    .catch(err => console.log(err))
}

function guardarArchivo(path:string, contenido:string){
    return invoke("save_file", {path, contenido})
}

function borrarArchivoOCarpeta(file:any){
    if(file.isDir){
        return invoke("delete_dir", {path: file.path})
        .then((res) => res)
        .catch(err => console.log(err))
    }
    return invoke("delete_file", {path: file.path})
    .then((res) => res)
    .catch(err => console.log(err))

}

async function saveNewFile(contenido:string){
    const result = await dialog.save({
        defaultPath: 'sin_titulo.txt',
        filters: [{ name:"Todos los archivos", extensions: ['*'] }]
    });

    if (result) {
        return invoke("create_file", {path: result}).then((res) => {
            return guardarArchivo(result, contenido)
            .then(() => { return {path: result} })
            .catch(error => {error})
        })
    }
}

async function isDir(path:string){
    return invoke("check_path_type", {path}).then((res) => res)
}

const Extensiones: {[key:string]:string} = {
    'js': 'javascript',
    'py': 'python',
    'c': 'c',
    'cpp': 'cpp',
    'ts': 'typescript',
    'php': 'php',
    'java': 'java',
    'rs':  'rust',
    'json': 'json',
    'md': 'markdown',
    'txt': 'text',
}

export { listarDir, loadFile, isDir, guardarArchivo, saveNewFile, borrarArchivoOCarpeta, exec_code, Extensiones }
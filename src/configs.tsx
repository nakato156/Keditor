import { invoke } from "@tauri-apps/api/tauri";

export async function loadStyles() {
    try {
        const configFile:string = await invoke("load_config_estilos");
        const config:Object = JSON.parse(configFile)["estilos"];
        Object.entries(config).forEach(([key, value]: [string, string] ) => {
            if(!value || !value.trim()) return;
            document.documentElement.style.setProperty(`--${key}`, value);
       })
    } catch (error) {
        console.log(error)
    }
}

export async function loadConfig(){
    if(localStorage.getItem("config")) return
    else{
        const config:Object = await invoke("load_config_editor");
        localStorage.setItem("config", JSON.stringify(config))
    }
}


import {Tab, Nav} from "react-bootstrap"
import { typeObjFiles } from "../defTypes/tipos"
import { Extensiones, exec_code } from "../funciones/files";
import { basename } from '@tauri-apps/api/path'

interface TabNavProps {
    files: typeObjFiles;
    activeTab: string | null;
    loader: (files: typeObjFiles, path: string) => Promise<any>;
    closeActiveFile: (key: string) => void;
}

function TabNav(params:TabNavProps) {
    const files = params.files;
    const activeTab = params.activeTab;
    const ext_activetab = activeTab?.split(".").slice(-1)[0]
    const loader = params.loader;
    const closeActiveFile = params.closeActiveFile;
    const archivos_ejecutables = JSON.parse(JSON.parse(localStorage.getItem("config")!))["ejecuciones"]["comandos"]
    const lang = Extensiones[ext_activetab!]
    const esEjecutable = archivos_ejecutables[lang];

    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="a">
            <Nav className="flex" style={{maxWidth: "95%"}}>
            {
            Object.keys(files).map((key: string) => (
                <div key={key} style={{ cursor:"pointer", borderRight:"0.1px solid #4C5154", padding: "0px 3px", borderTop: activeTab==key ? '2px solid #2dd4bf' : 'none', height: "40px"}}>
                    <Nav.Item>
                        <div className="itemNav">
                            <div  onClick={ () => loader(files, key)}>
                                <p className="file-text">{files[key]}</p>
                            </div>
                            <div className="iconoCerrarArchivo" onClick={ ()=> closeActiveFile(key) }>
                            { activeTab==key && 
                                <svg style={{width: 16, height:16 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            }
                            </div>
                        </div>
                    </Nav.Item>
                </div>
            ))
            }
            </Nav>
            { ext_activetab && esEjecutable && 
                <div onClick={async () => exec_code(await basename(activeTab), activeTab, lang) } style={{display:"flex", cursor:"pointer", alignItems:"center", justifyContent:"center", maxWidth:"5%"}}>
                    <svg style={{width: 20, height:20, color:"#fff" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                </div>
            }
        </Tab.Container>
    )
}

export {TabNav};
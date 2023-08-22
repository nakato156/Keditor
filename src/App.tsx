import { useState, useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import {Col, Container, Row} from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { basename, extname } from '@tauri-apps/api/path'
import { isDir, guardarArchivo, Extensiones, loadFile, saveNewFile, listarDir } from "./funciones/files"
import * as config from "./configs"
import { TabNav, Explorador } from "./componentesEditor/CompKeditor"
import { typeObjFiles } from "./defTypes/tipos"
import "./App.css";


function App() {
  config.loadStyles();
  config.loadConfig();
  const [lenguaje, setLanguaje] = useState<string>("");
  const [valueEditor, setValueEditor] = useState<string>("");
  const [visibleExplorer, setVisibleExplorer] = useState<boolean>(false);
  const [folderPath, setFolderPath] = useState<string>("");
  const [fileActive, setFileActive] = useState<string>("");
  
  const fileActiveRef = useRef< string | null>(null);
  const files = useRef<typeObjFiles>({});
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  function handleEditorDidMount(editor:any, monaco:any) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addAction({
      id: "executeCurrentAndAdvance",
      label: "Guarda el archivo",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: "navigation",
      run: () => {
        console.log(fileActiveRef, fileActive)
        if(fileActiveRef.current) guardarArchivo(fileActiveRef.current, editor.getValue());
        else {
          saveNewFile(editor.getValue()).then(async (res:any) => {
            if(!res || !res.path) return;
            const path = res.path
            loadderFile(files.current, path)
          })
        }
      },
  });

    // editorRef.current.onDropIntoEditor(event => {
    //   console.log("drop", event)
    // })
  }

  const loadderFile = (files:typeObjFiles, path:string) =>  loadFile(path).then(async (text:any) => { 
    const ext = await extname(path);
    const editor_lenguaje =  Extensiones[ext];
    setLanguaje(editor_lenguaje);
    files[path] = await basename(path);
    fileActiveRef.current = path
    setFileActive(path);
    setValueEditor(text) 
  });

  const loadderFolder = (path:string) => {
    sessionStorage.setItem("path", path)
    setFolderPath(path);
    setVisibleExplorer(true);
  }

  const closeActiveFile = (path:string) => {
    delete files.current[path]
    const listaPaths = Object.keys(files.current)
    if(listaPaths.length == 0) {
      editorRef.current.setValue("")
      fileActiveRef.current = ""
      setLanguaje("")
      return
    }
    const new_path = listaPaths.slice(-1)[0];
    loadderFile(files.current, new_path)
  }

  useEffect(() => {
    const unlisten = listen<string>('tauri://file-drop', async (event:any) => {
      await new Promise(resolve => setTimeout(resolve, 100))
      const path_ = event.payload[0]
      const tipo = await isDir(path_)

      if(tipo == "Archivo")
        loadderFile(files.current, path_);
      else loadderFolder(path_);
    })
    return () => { unlisten.then(f => f()); }
  }, [])


  return (
    <Container fluid style={{ backgroundColor: '#1E2122' }}>
      <Row>
        <Explorador visibleExplorer={visibleExplorer} files={files.current} loadderFile={loadderFile} getFiles={listarDir} folderPath={folderPath}/>
        <Col md={visibleExplorer ? 10 : 12} style={{ paddingLeft: 0 }}>
          <Row style={{ margin: 0, borderTop:'1px solid #4C5154', borderBottom: '1px solid #4C5154', maxHeight: "5vh" }}>
            <TabNav files={files.current} activeTab={fileActiveRef.current} loader={loadderFile} closeActiveFile={closeActiveFile}/>
          </Row>
          <Row style={{ padding: 0, height: "95vh"}}>
            < Editor 
              height="95vh"
              width="100%" 
              value={valueEditor}
              theme="vs-dark" 
              onMount={handleEditorDidMount}
              language={lenguaje}/>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

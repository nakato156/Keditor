import { useState, useEffect, useRef } from 'react';
import { Row, Col, ListGroup } from "react-bootstrap";
import { MenuFile } from "./contexMenus"
import { typeObjFiles, IFile, TreeNode } from "../defTypes/tipos"
import { getTree, syncTree } from "../funciones/helpers"

interface ExploradorArchivosProps {
    visibleExplorer: boolean;
    getFiles: Function;
    files: typeObjFiles;
    loadderFile: any;
    folderPath: string;
}

interface IPoints {
    x: number;
    y: number;
}

function Explorador (args:ExploradorArchivosProps){
    const { visibleExplorer, getFiles, files: listFiles, loadderFile, folderPath } = args;
    const [tree, setTree] = useState<Array<TreeNode>>([]);
    const [isContextMenuOpen, setContextMenuOpen] = useState<boolean>(false);
    const [points, setPoints] = useState<IPoints>({ x: 0, y: 0, });
    const [propiedadesSelectCM, setPropiedadesSelectCM] = useState<{file:IFile | null}>({ file: null })
    const carpetadAbiertasRef = useRef<Set<string>>(new Set<string>());
    const [carpetasAbiertas, setCarpetasAbiertas] = useState<Set<string>>(new Set<string>());

    const handleClick = () => setContextMenuOpen(false);

    function mostrarDirectorioTree(tree:Array<TreeNode>) : JSX.Element[] {
        return tree.map( nodo => 
        <ListGroup.Item key={nodo.file.path} action className='estiloItemExplorador'
        onContextMenu={(e: React.MouseEvent<HTMLElement>) =>  handleContextMenu(e, nodo.file)} 
        onClick={(e) => { 
            e.stopPropagation()
            if(!nodo.file.isDir) loadderFile(listFiles, nodo.file.path); 
            else {
                if(carpetadAbiertasRef.current.has(nodo.file.path))
                    carpetadAbiertasRef.current.delete(nodo.file.path)
                else carpetadAbiertasRef.current.add(nodo.file.path)
                
                setCarpetasAbiertas(new Set(carpetadAbiertasRef.current))
            }
        }}
        >
            <Row key={nodo.file.path} className='fontExplorador align-items-center' style={{display:'inline-flex'}}>
                {
                nodo.file.isDir ? <Col md={2} className='flex justify-content-center'>
                    <svg style={{ width: '.95rem', height: '.95rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Col> : <></>
                }
                <Col style={{paddingLeft: nodo.file.isDir ? '.3rem' : "1rem"}}>
                    { nodo.file.isDir && nodo.visible ? 
                        (<div>
                            {nodo.file.name}
                            <div>
                                {mostrarDirectorioTree(nodo.children)}
                            </div>
                        </div>)
                        : nodo.file.name 
                    }
                </Col>
            </Row>
        </ListGroup.Item> 
        )
    }

    const handleContextMenu = (e:React.MouseEvent<HTMLElement>, file:IFile) => {
        e.preventDefault();
        setContextMenuOpen(true);
        setPoints({
            x: e.pageX,
            y: e.pageY,
        });
        setPropiedadesSelectCM({file})
    };

    useEffect(() => {
        window.addEventListener("click", handleClick);
        if (visibleExplorer) {
            console.log("cargando tree 0", folderPath)
            getFiles(folderPath).then((files:Array<IFile>) => {
              getTree(files, carpetadAbiertasRef.current, getFiles).then((res) => {
                if(res.length == 0) return;
                sessionStorage.setItem("tree", JSON.stringify(res))
                setTree(res)
            });
          });
        }
        return () => {
            window.removeEventListener("click", handleClick);
        }
    }, [visibleExplorer, getFiles]);

    useEffect(() => {
        if (!visibleExplorer) return
        console.log("llamado useEfect2")
        console.log(carpetadAbiertasRef.current)
        
        const syncTreeWithFiles = async () => {
            const res: Array<TreeNode> = await syncTree(JSON.parse(sessionStorage.getItem("tree")!), getFiles, carpetadAbiertasRef.current);
            console.log(res[0].children);
            sessionStorage.setItem("tree", JSON.stringify(res));
            setTree(res);
        };
        syncTreeWithFiles();
    }, [carpetasAbiertas]);
    
    console.log("tree", tree)
    return(
        visibleExplorer &&
        <Col md={2} style={{ padding: 0 }}>
            <div className='divListGroupExplorador'>
                <ListGroup variant='flush' key="files">
                    { mostrarDirectorioTree(tree) }
                </ListGroup>
            </div>
            { isContextMenuOpen && <MenuFile top={points.y} left={points.x} file={propiedadesSelectCM.file!}/> }
        </Col>
    )
}

export {Explorador};
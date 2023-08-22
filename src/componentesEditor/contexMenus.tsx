import { IFile } from "../defTypes/tipos"
import { Extensiones, borrarArchivoOCarpeta, exec_code } from "../funciones/files"

interface MenuFileProps {
    left: number;
    top: number;
    file: IFile;
}

function MenuFile(data:MenuFileProps){
    console.log(data)
    return(
        <div className="contextMenu" style={{ left:data.left, top:data.top }}>
            <ul className="listaContextMenu">
                <li>Cambiar nombre</li>
                <li onClick={() => borrarArchivoOCarpeta(data.file.path)}>Eliminar</li>
                <li onClick={()=> exec_code(data.file.path, data.file.name, Extensiones[data.file.ext])}>Ejecutar</li>
                <li>Copiar path</li>
            </ul>
        </div>
    )
}

export { MenuFile };
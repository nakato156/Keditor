import { IFile, TreeNode } from "../defTypes/tipos";

export async function getTree(files:Array<IFile>, carpetasAbiertas: Set<string>, getFiles:Function) : Promise<Array<TreeNode>> {
    let tree: Array<TreeNode> = [];
    for (const file of files) {
        if(!file.isDir) tree.push({file, visible:true, children:[]})
        else {
            if(carpetasAbiertas.has(file.path)){
                carpetasAbiertas.delete(file.path)
                getTree(await getFiles(file.path), carpetasAbiertas, getFiles).then((children:Array<TreeNode>) => {
                    tree.push({file, visible:true, children})
                })
            }else{
                tree.push({file, visible:false, children:[]})
            }
        }
    }
    return tree;
}

export async function syncTree(tree: Array<TreeNode>, getFiles:Function, carpetasAbiertas:Set<string>) : Promise<Array<TreeNode>> {
    let nuevoTree: Array<TreeNode> = [];
    for (const node of tree) {
        if (carpetasAbiertas.has(node.file.path) && !node.visible) {
            const file_nodo = await getFiles(node.file.path)
            const data: Array<TreeNode> = file_nodo.map((file:IFile) => {return {file, visible: !file.isDir, children:[]}})
            node.children = data;
            node.visible = true;
        } else if (node.file.isDir && node.visible && !carpetasAbiertas.has(node.file.path)) {
          node.visible = false;
        } else if( node.file.isDir ){
            const nuevo_children = await syncTree(node.children, getFiles, carpetasAbiertas)
            node.children = nuevo_children;
        }
        nuevoTree.push(node);
    }
    return nuevoTree;
}
export interface typeObjFiles {
    [key:string]:string
};

export interface IFile {
    ext: string,
    path:string;
    name:string;
    isDir:boolean;
}

export interface TreeNode {
    file: IFile,
    visible: boolean,
    children:  TreeNode[]
}
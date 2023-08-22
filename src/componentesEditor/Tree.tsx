import { styled } from "styled-components"
import { useState } from "react";

const StyledTree = styled.div`
  line-height: 1.5;
`;
const StyledFile = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  span {
    margin-left: 5px;
  }
`;

const StyledFolder = styled.div`
  padding-left: 20px;

  .folder--label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }
`;
const Collapsible = styled.div`
  /* set the height depending on isOpen prop */
  height: ${(p: any) => (p.isOpen ? 'auto' : '0')};
  /* hide the excess content */
  overflow: hidden;
`;

const Tree = ({ children }:any) => {
  return <StyledTree>{children}</StyledTree>;
};

const File = ({ name }:any) => {
    // get the extension
    let ext = name.split('.')[1];
  
    return (
      <StyledFile>
        {/* render the extension or fallback to generic file icon  */}
        {/* {FILE_ICONS[ext] || <AiOutlineFile />} */}
        <span>{name}</span>
      </StyledFile>
    );
};

const Folder = ({ name, children }:any) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    const handleToggle = (e: any) => {
      e.preventDefault();
      setIsOpen(!isOpen);
    };
  
    return (
      <StyledFolder>
        <div className="folder--label" onClick={handleToggle}>
          {/* <AiOutlineFolder /> */}
          <span>{name}</span>
        </div>
        <Collapsible isOpen={isOpen}>{children}</Collapsible>
      </StyledFolder>
    );
};

Tree.File = File;
Tree.Folder = Folder;
export default Tree

/*
            {
                // files.map((file:IFile) => <ListGroup.Item key={file.path} onContextMenu={(e: React.MouseEvent<HTMLElement>) => handleContextMenu(e, file)} action className='estiloItemExplorador'>
                //     <Row key={file.path} className='fontExplorador align-items-center' style={{display:'inline-flex'}}>
                //         {
                //         file.isDir ? <Col md={2} className='flex justify-content-center'>
                //             <svg style={{ width: '.95rem', height: '.95rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                //                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                //             </svg>
                //         </Col> : <></>
                //         }
                //         <Col 
                //             style={{paddingLeft: file.isDir ? '.3rem' : "1rem"}} 
                //             onClick={() => { if(!file.isDir) loadderFile(listFiles, file.path); }}
                //         >
                //             {file.name}
                //         </Col>
                //     </Row>
                //     </ListGroup.Item> 
                )
            }
*/
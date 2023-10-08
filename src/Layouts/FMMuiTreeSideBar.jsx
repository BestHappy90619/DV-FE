import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import FileIcon from "@mui/icons-material/FilePresent";
import { useState } from "react";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0 8px 0",
  },
});

const MyTreeView = ({ treeData, onDragEnd }) => {
  const classes = useStyles();

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div className={classes.listItem}>
          {nodes.id === "root" ? (
            <></>
          ) : nodes.children ? (
            <FolderIcon sx={{ width: "18px", height: "18px" }} />
          ) : (
            <FileIcon sx={{ width: "18px", height: "18px" }} />
          )}
          <div className="ml-1 text-[14px] font-medium text-[#212121] ">
            {nodes.label}
          </div>
        </div>
      }
      icon={
        nodes.id === "root" ? (
          <img
            src="/image/FMHomeIcon.svg"
            className="w-[18px] h-[18px]"
            alt="home icon"
          />
        ) : undefined
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="TREE_ITEM">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <TreeView
              className={classes.root}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              {renderTree(treeData)}
            </TreeView>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const treeData = {
  id: "root",
  label: "Site",
  children: [
    {
      id: "node1",
      label: "Node 1",
      children: [
        { id: "node3", label: "Node 3" },
        { id: "node4", label: "Node 4" },
      ],
    },
    { id: "node2", label: "Node 2" },
    {
      id: "node5",
      label: "Node 5",
      children: [
        {
          id: "node6",
          label: "Node 6",
          children: [{ id: "node7", label: "Node 7" }],
        },
      ],
    },
  ],
};

const FileTreeView = ({ showOrHide }) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const handleDragEnd = (result) => {
    // Implement logic to update tree structure based on drag-and-drop actions
    // result.source.index and result.destination.index can be used to determine the new order.
  };

  return (
    <div
      className={` w-full flex-col pl-4 relative h-full ${
        showOrHide === true ? "pl-4" : "pl-0"
      }`}
      style={{ display: `${showOrHide === true ? "flex" : "none"}` }}
    >
      <div className="absolute -top-[23px] right-[46px]">
        <button
          className=" flex items-center justify-center h-[46px] w-[46px] 
        rounded-full shadow-md hover:shadow-lg        
      "
          onClick={() => setShowPlusMenu(!showPlusMenu)}
        >
          <img
            src="/image/plus-svgrepo-com.svg"
            className="w-full h-full"
            alt="plus"
          />
        </button>

        {showPlusMenu === true && (
          <div
            className="w-[240px] absolute z-10 left-[24px] top-[24px] flex flex-col gap-3 bg-white shadow-md
            border-[1px] border-[#E5E9EE] rounded-[4px] text-[16px] font-medium
          "
          >
            <div className="w-[240px] flex flex-col cursor-pointer  py-4 ">
              <div
                className="flex flex-start pl-5 items-center"
                onClick={() => setShowPlusMenu(false)}
              >
                <img
                  src="/image/FMNewFolderIcon.svg"
                  className="w-5 h-5 mr-2"
                  alt="folder"
                />
                Create Folder
              </div>
              <div className="flex justify-center mt-3">
                <div className="w-[200px] border-b-[1px] border-[#C4C4C4]  "></div>
              </div>
            </div>
            <div
              className="w-[240px] flex flex-col cursor-pointer  pb-4 "
              onClick={() => setShowPlusMenu(false)}
            >
              <div className="flex flex-start pl-5 items-center">
                <img
                  src="/image/FMNewFileIcon.svg"
                  className="w-5 h-5 mr-2"
                  alt="folder"
                />
                Upload Files
              </div>
            </div>{" "}
            <div
              className="w-[240px] flex flex-col cursor-pointer  pb-4 "
              onClick={() => setShowPlusMenu(false)}
            >
              <div className="flex flex-start pl-5 items-center">
                <img
                  src="/image/FMNewFolderIcon.svg"
                  className="w-5 h-5 mr-2"
                  alt="folder"
                />
                Upload Folder
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="text-[#212121] mt-5 font-bold">Directory</div>
      <div className="flex mt-3"></div>
      <MyTreeView treeData={treeData} onDragEnd={handleDragEnd} />
    </div>
  );
};

export default FileTreeView;

import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import FileIcon from "@mui/icons-material/FilePresent";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
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
          {nodes.children ? <FolderIcon /> : <FileIcon />}
          {nodes.label}
        </div>
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

const FileTreeView = () => {
  const handleDragEnd = (result) => {
    // Implement logic to update tree structure based on drag-and-drop actions
    // result.source.index and result.destination.index can be used to determine the new order.
  };
  return <MyTreeView treeData={treeData} onDragEnd={handleDragEnd} />;
};

export default FileTreeView;

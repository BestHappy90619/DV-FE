/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { TreeView, TreeItem, useTreeItem } from "@mui/x-tree-view";
import clsx from 'clsx';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import FileIcon from "@mui/icons-material/FilePresent";
import ImageIcon from "@mui/icons-material/Image";
import TextFileIcon from "@mui/icons-material/TextFields";
import DescriptionIcon from "@mui/icons-material/Description";
import ClearIcon from "@mui/icons-material/Clear";
import ZipFileIcon from "@mui/icons-material/FolderZip";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { RiHomeFill } from 'react-icons/ri';

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../redux-toolkit/reducers/fileUpload";
import {
  fetchAdditionalData,
  draggedItem,
} from "../redux-toolkit/reducers/fileTreeSliceDetail";
import { rowDropped } from "../redux-toolkit/reducers/fileTreeSlice";

const MyTreeView = ({ treeData, dispatchProp, onTreeItemClick,props,ref }) => {
  if (!treeData) {
    return null;
  }

  const handleDetail = async (id, data) => {
    const dataApi = await dispatchProp(fetchAdditionalData(id));
  
    // Combine data from dataApi and data.children
    const updatedData = [
      ...dataApi.payload.date.filter(
        (dateItem) => !data?.children?.some((child) => child?.id === dateItem?.Id)
      ),
      ...data.children,
    ];
    dispatchProp(draggedItem(updatedData))
  
    // Find the subtree with the matching id
    const subtree = treeData.children.find((item) => item.id === id);

    if (subtree) {
      const newData = updatedData.filter((dateItem) => {
        return !subtree.children.some(
          (child) => child.id === dateItem.Id || dateItem.id
        );
      });

      if (newData.length > 0) {
        const updatedDataTree = treeData.children.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              children: [...item.children, ...newData],
            };
          }
          return item;
        });

        dispatchProp(rowDropped(updatedDataTree));
      }
    }
  };

  const renderTree = (data) => {
    if (!data) {
      return null;
    }

    const mediaType = data.mediaType;
    const fileType = data.fileType;

    const isFolder = mediaType === "folder";
    const isFile = mediaType === "file";
    const iconMapping = {
      image: <ImageIcon sx={{ fill: "#4489fe" }} />,
      video: <VideoFileIcon sx={{ fill: "#4489fe" }} />,
      "image/png": <ImageIcon sx={{ fill: "#4489fe" }} />,
      "image/jpg": <ImageIcon sx={{ fill: "#4489fe" }} />,
      "image/gif": <ImageIcon sx={{ fill: "#4489fe" }} />,
      "application/zip": <ZipFileIcon sx={{ fill: "#4489fe" }} />,
      "application/pdf": <TextFileIcon sx={{ fill: "#4489fe" }} />,
      "text/plain": <TextFileIcon sx={{ fill: "#4489fe" }} />,
      "audio/mp3": <AudioFileIcon sx={{ fill: "#4489fe" }} />,
      "video/mp4": <VideoFileIcon sx={{ fill: "#4489fe" }} />,
      "application/msword": <DescriptionIcon sx={{ fill: "#4489fe" }} />,
      "application/vnd.ms-excel": (
        <InsertDriveFileIcon sx={{ fill: "#4489fe" }} />
      ),
      "application/vnd.ms-powerpoint": (
        <SlideshowIcon sx={{ fill: "#4489fe" }} />
      ),
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        <DescriptionIcon sx={{ fill: "#4489fe" }} />,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
        <InsertDriveFileIcon sx={{ fill: "#4489fe" }} />
      ),
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        <SlideshowIcon sx={{ fill: "#4489fe" }} />,
    };
    // Use iconMapping based on fileType if it's a file, otherwise use the folder icon
    const iconComponent = isFile ? (
      iconMapping[fileType] || (
        <FileIcon sx={{ width: "18px", height: "18px", fill: "#4489fe" }} />
      )
    ) : (
      <FolderIcon sx={{ width: "18px", height: "18px", fill: "#4489fe" }} />
    );

    const handleClick = (id, data) => {
      if (id === "root") {
        handleDetail(0);
      } else {
        handleDetail(id, data);
      }
    };
    const ellipsisStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "120px",
    };

    const nodeStyle = {
      display: "flex",
      alignItems: "center",
      padding: "8px 0 8px 0",
    };
    const LightTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
    }));
    
const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

    return (
      <TreeItem
      ContentComponent={CustomContent} {...props} ref={ref}
        key={data.id}
        nodeId={data.id}
        label={
          <div style={nodeStyle} onClick={() => handleClick(data?.id, data)}>
            {data.id === "root" ? (
             <RiHomeFill size={18} style={{color:"#4489FE"}} />
            ) : (
              iconComponent
            )}
            <LightTooltip title={data.label || data.FileName} >   
              <div
                className="ml-1 text-[14px] font-medium text-[#212121]"
                style={ellipsisStyle}
              >
                {data.label || data.FileName}
              </div>
            </LightTooltip>
          </div>
        }
        onClick={() => onTreeItemClick(data.path || [])}
      >
        {Array.isArray(data.children)
          ? data.children.map((child) => renderTree(child, onTreeItemClick))
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon sx={{ fill: "#4489fe" }} />}
      defaultExpandIcon={<ChevronRightIcon sx={{ fill: "#4489fe" }} />}
    >
      {renderTree(treeData, onTreeItemClick)}
    </TreeView>
  );
};

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [checkedFiles, setCheckedFiles] = useState({});
  const [selectedOption, setSelectedOption] = useState("allFiles");
  const dispatch = useDispatch();
  const { loading, data: fileData } = useSelector((state) => state.upload);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFiles((prevFiles) => [...prevFiles, file]);

    if (file) {
      dispatch(uploadFile(file));
    }
  };

  const handleDelete = (fileName) => {
    setFiles((files) => files.filter((file) => file.name !== fileName));
  };

  const handleCheckboxChange = (fileName) => {
    setCheckedFiles((prevState) => ({
      ...prevState,
      [fileName]: !prevState[fileName],
    }));
  };

  const handleChangeSelect = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box
      sx={{
        p: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ border: 1, borderRadius: 1, p: 5, borderColor: "gray" }}>
        <Box>
          <Typography variant="h5">
            <Select
              sx={{
                fontSize: "28px",
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: 0,
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: 0,
                },
              }}
              value={selectedOption}
              onChange={handleChangeSelect}
            >
              <MenuItem value="allFiles">All Files</MenuItem>
              <MenuItem value="folder">Folders</MenuItem>
              <MenuItem value="image">Images</MenuItem>
            </Select>
          </Typography>
          <Typography color="textSecondary">
            Please configure all files
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            mt: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            color="success"
            sx={{ textTransform: "none" }}
          >
            Create Order Part
          </Button>
          <input
            type="file"
            onChange={handleFileUpload}
            hidden
            id="upload-input"
          />
          <label htmlFor="upload-input">
            <Button
              variant="outlined"
              color="primary"
              component="span"
              sx={{ py: 1, px: 2, textTransform: "none" }}
            >
              Upload More Files
            </Button>
          </label>
        </Box>

        <List>
          {files.map(
            (file) =>
              file && (
                <ListItem
                  key={file.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={!!checkedFiles[file.name]}
                    tabIndex={-1}
                    sx={{ fontSize: 28 }}
                    disableRipple
                    onChange={() => handleCheckboxChange(file.name)}
                  />
                  <ListItemText primary={file.name} />
                  {loading && fileData?.name !== file.name ? (
                    <div className="text-[#757575] text-[13px] relative mx-5">
                      <div className="w-[200px] bg-[#F2F1F1] h-[8px] rounded-[3px]" />
                      <div className="w-[140px] bg-[#4489FE] h-[6px] rounded-[3px] absolute top-[1px] left-0" />
                    </div>
                  ) : (
                    <p className="ml-7">{file.size}</p>
                  )}
                  {loading && (
                    <Button
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(file.name)}
                    >
                      <ClearIcon className="text-black" />
                    </Button>
                  )}
                </ListItem>
              )
          )}
        </List>
      </Box>
    </Box>
  );
};

const FileTreeView = ({
  showOrHide,
  updatedDirectoryData,
  fileDirectoryData,
  setBreadcrumb,
}) => {
  const dispatch = useDispatch();

  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTreeItemClick = (path) => {
    setBreadcrumb(path);
  };

  return (
    <div
      className={`w-full flex-col pl-4 relative ${showOrHide === true ? "pl-4" : "pl-0"
        }`}
      style={{ display: `${showOrHide === true ? "flex relative" : "none"}` }}
    >
      <div className="z-50 absolute -top-[23px] right-[46px] select-none cursor-pointer">
        <button
          className="flex items-center justify-center h-[46px] w-[46px] 
          rounded-full shadow-md hover:shadow-lg select-none"
          onClick={() => setShowPlusMenu(!showPlusMenu)}
        >
          <img
            src="/image/plus-svgrepo-com.svg"
            className="w-full h-full select-none"
            alt="plus"
          />
        </button>
        {showPlusMenu === true && (
          <div
            className="w-[240px] absolute left-[24px] top-[24px] flex flex-col gap-3 bg-white shadow-md
              border-[1px] border-[#E5E9EE] rounded-[4px] text-[16px] font-medium"
          >
            <div className="w-[240px] flex flex-col cursor-pointer py-4">
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
                <div className="w-[200px] border-b-[1px] border-[#C4C4C4]"></div>
              </div>
            </div>
            <div
              className="w-[240px] flex flex-col cursor-pointer pb-4"
              onClick={() => setShowPlusMenu(false)}
            >
              <div
                className="flex flex-start pl-5 items-center"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src="/image/FMNewFileIcon.svg"
                  className="w-5 h-5 mr-2"
                  alt="folder"
                />
                Upload Files
              </div>
            </div>
            <div
              className="w-[240px] flex flex-col cursor-pointer pb-4"
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
        {isModalOpen && (
          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <FileList onClose={() => setIsModalOpen(false)} />
          </Dialog>
        )}
      </div>
      <div className="absolute bottom-0 right-0 left-5 top-0 flex flex-col mt-3 h-[calc(100vh-160px)] scrollable-container">
        <div className="text-[#212121] mt-5 font-bold">Directory</div>
        <MyTreeView
          treeData={updatedDirectoryData}
          dispatchProp={dispatch}
          onTreeItemClick={handleTreeItemClick}
        />
      </div>
    </div>
  );
};

export default FileTreeView;

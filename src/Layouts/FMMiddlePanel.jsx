import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import TextFileIcon from "@mui/icons-material/TextFields";
import ZipFileIcon from "@mui/icons-material/FolderZip";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import FolderIcon from "@mui/icons-material/Folder";
import { toast } from "react-hot-toast";
import { MOUSE_MOVE, RESIZED_WINDOW } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { draggedItem } from "../redux-toolkit/reducers/fileTreeSliceDetail";
import {
  rowDropped,
  selectFileTreeData,
} from "../redux-toolkit/reducers/fileTreeSlice";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";

import {
  selectAdditionalData,
  fetchAdditionalData,
} from "../redux-toolkit/reducers/fileTreeSliceDetail";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Share,
  DeleteOutlineOutlined as Delete,
  ContentCopyOutlined as FileCopy,
  FileDownloadOutlined as GetApp,
  DriveFileMoveOutlined as MoveToInbox,
  EventSeatOutlined as AssignmentInd,
  LocalOfferOutlined as Label,
  NoteAddOutlined as NoteAdd,
  BorderColorTwoTone as Assignment,
} from "@mui/icons-material";


function parseFileSize(fileSizeString) {
  const sizeParts = fileSizeString.trim().split(" ");
  if (sizeParts.length !== 2) {
    throw new Error("Invalid file size format.");
  }

  const size = parseFloat(sizeParts[0]);
  const unit = sizeParts[1].toUpperCase();

  switch (unit) {
    case "B":
      return size;
    case "KB":
      return size * 1024;
    case "MB":
      return size * 1024 * 1024;
    case "GB":
      return size * 1024 * 1024 * 1024;
    case "TB":
      return size * 1024 * 1024 * 1024 * 1024;
    default:
      throw new Error("Unsupported unit in file size.");
  }
}

function formatFileSize(fileSizeInBytes) {
  const units = ["B", "kB", "MB", "GB", "TB"];
  let size = fileSizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

const fillRows = (apiData) => {
  const rowsss = apiData.map((item, i) => {
    return {
      id: item?.Id ? item.Id : item?.id,
      identifier: i,
      mediaType: item?.mediaType,
      fileType: item?.fileType,
      FileName: item?.name ? item?.name : item?.FileName,
      LastUpdated: item?.lastUpdated ? new Date(item?.lastUpdated) : null,
      Size: item?.size || 0,
      PlayLength: 0,
      children: item?.children ? item?.children : null,
    };
  });

  return rowsss;
};

// eslint-disable-next-line react/prop-types
const FMMiddlePanel = ({ onUserSelect }) => {
  const fileDirectoryDataDetail = useSelector(selectAdditionalData);
  const fileDirectoryData = useSelector(selectFileTreeData);

  const treeDataFromApi = fileDirectoryData ? fileDirectoryData : null;
  const enhanceWithPath = (node, path = []) => {
    const newPath = [...path, node.name || node.FileName];
    return {
      ...node,
      id: node.id || node.Id, // Include the id field
      label: node.name || node.FileName,
      mediaType: node.mediaType,
      fileType: node.fileType,
      path: newPath,
      downloadURL: node.downloadURL,
      duration: node.duration,
      size: node.size,
      status: node.status,
      children: node.children
        ? node.children.map((child) => enhanceWithPath(child, newPath))
        : undefined,
    };

  };

  const updatedDirectoryData = {
    id: 'root',
    label: 'Site',
    children: Array.isArray(treeDataFromApi?.date) ? treeDataFromApi.date.map(item => enhanceWithPath(item)) : [],
  };

  useEffect(() => {
    dispatch(fetchAdditionalData(0));
  }, []);
  const dispatch = useDispatch();
  const divOfTableRef = useRef(null);
  const [divWidth, setDivWidth] = useState(1000);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [rowsss, setRowsss] = useState([]);

  const nodeStyle = {
    display: "flex",
    alignItems: "center",
    padding: "8px 0 8px 0",
  };
  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (fileDirectoryDataDetail.date) {
      // eslint-disable-next-line react/prop-types
      const rows = fillRows(fileDirectoryDataDetail.date);

      setRowsss(rows);
    }
    // eslint-disable-next-line react/prop-types
  }, [fileDirectoryDataDetail?.date]);
  const handleDetail = async (id, params) => {
    if (id === "root") {
      dispatch(fetchAdditionalData(0));
    } else {
      const dataApi = await dispatch(fetchAdditionalData(id));
      const updatedData = [...dataApi.payload.date, ...params.row.children];

      const subtree = updatedDirectoryData?.children.find(
        (item) => item.id === id
      );

      if (subtree) {
        const newData = updatedData.filter((dateItem) => {
          return !subtree.children.some(
            (child) => child.id === dateItem.Id || dateItem.id
          );
        });

        if (newData.length > 0) {
          const updatedDataTree = updatedDirectoryData?.children.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                children: [...item.children, ...newData],
              };
            }
            return item;
          });

          dispatch(rowDropped(updatedDataTree));
        }
      }

      dispatch(draggedItem(updatedData));
    }
  };

  const columns = [
    {
      field: "FileName",
      headerName: "Name",
      width: 300,
      renderCell: (params) => {
        const mediaType = params.row.mediaType;
        const fileType = params.row.fileType;
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

        let iconComponent;

        if (isFolder) {
          iconComponent = (
            <FolderIcon
              sx={{ width: "18px", height: "18px", fill: "#4489fe" }}
            />
          );
        } else if (isFile) {
          iconComponent = iconMapping[fileType] || (
            <InsertDriveFileIcon sx={{ fill: "#4489fe" }} />
          );
        } else {
          iconComponent = <InsertDriveFileIcon sx={{ fill: "#4489fe" }} />;
        }

        return (
          <div
            className="flex"
            style={nodeStyle}
            onClick={() =>
              handleUserClick(params.row)

            }
            onDoubleClick={() => handleDetail(params.row.id, params)}
          >
            {iconComponent}
            <Draggable
              draggableId={params.row.identifier.toString()}
              index={params.row.identifier}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="m-1"
                  style={{
                    ...provided.draggableProps.style,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "250px",
                    position: 'absolute',
                    marginTop: "12px",
                    marginLeft: "35px",
                    left: "auto !important",
                    top: "auto !important",
                  }}
                >

                  {params.value}

                </div>
              )}

            </Draggable>
          </div>
        );
      },
    },
    {
      field: "PlayLength",
      headerName: "Length",
      description: "This column shows play time length of file.",
      width: 150,
      valueGetter: (params) => {
        const playLength = params.row.PlayLength;

        if (playLength !== null && playLength !== undefined) {
          const hours = Math.floor(playLength / 3600);
          const minutes = Math.floor((playLength % 3600) / 60);
          const seconds = playLength % 60;
          // Pad the values with leading zeros if necessary
          const formattedLength = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          return formattedLength;
        }

        return null;
      },
    },
    {
      field: "LastUpdated",
      headerName: "Last Updated",
      type: Date,
      width: 200,
      valueGetter: (params) => {
        return new Date(params.row.LastUpdated).toUTCString();
      },
      sortComparator: (v1, v2, param1, param2) => {
        return (
          new Date(param1.value).getTime() - new Date(param2.value).getTime()
        );
      },
    },
    {
      field: "Size",
      headerName: "Size",
      width: 150,
      valueGetter: (params) => {

        const fileSize = params.row.Size;
        return formatFileSize(fileSize);
      },
      sortComparator: (v1, v2, param1, param2) => {
        return parseFileSize(param1.value) - parseFileSize(param2.value);
      },
    },
    {
      field: "Actions",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex">
            <div
              className="mr-1 cursor-pointer"
              onClick={(event) => {
                openMenu(event, params.row);
              }}
            >
              <div className="flex  gap-2 px-4 cursor-pointer">
                <img
                  src="/image/FMDotsIcon.svg"
                  className="w-[20px] h-[20px] "
                  alt="icon"
                />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const updateDivWidth = () => {
    if (divOfTableRef.current) {
      const width = divOfTableRef.current.offsetWidth;

      setDivWidth(Number(width));
    }
  };

  useEffect(() => {
    window.addEventListener(RESIZED_WINDOW, updateDivWidth);

    updateDivWidth();

    return () => {
      window.removeEventListener(RESIZED_WINDOW, updateDivWidth);
    };
  }, []);

  useEffect(() => {
    function onMouseMove() {
      if (!divOfTableRef.current) return;

      updateDivWidth();
    }
    window.addEventListener(MOUSE_MOVE, onMouseMove);

    return () => {
      window.removeEventListener(MOUSE_MOVE, onMouseMove);
    };
  }, []);
  const handleUserClick = (user) => {
    onUserSelect(user);
  };
  // const onDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const sourceIndex = result.source.index;
  //   const destIndex = result.destination.index;
  //   if (sourceIndex === destIndex) {
  //     return;
  //   }

  //   const draggedRowId = result.draggableId;

  //   const newRows = [...rowsss];

  //   const rowIndexToRemove = newRows.findIndex((row, i) => i == draggedRowId);

  //   const destinationRow = newRows[destIndex];

  //   if (destinationRow?.mediaType !== "file") {
  //     if (
  //       newRows[destIndex].children &&
  //       !newRows[destIndex]?.children[0]?.children
  //     ) {
  //       newRows[destIndex] = { ...newRows[destIndex] };
  //       newRows[destIndex].children = [
  //         ...newRows[destIndex].children,
  //         newRows[rowIndexToRemove],
  //       ];
  //     } else if (
  //       newRows[destIndex]?.children &&
  //       newRows[destIndex]?.children[0]?.children
  //     ) {
  //       newRows[destIndex].children = [
  //         ...newRows[destIndex].children,
  //         newRows[rowIndexToRemove],
  //       ];
  //     } else if (newRows[destIndex] && newRows[destIndex].children) {
  //       newRows[destIndex].children = [
  //         ...newRows[destIndex],
  //         newRows[rowIndexToRemove],
  //       ];
  //     } else {
  //       newRows[destIndex].children = [newRows[rowIndexToRemove]];
  //     }

  //     if (rowIndexToRemove !== -1) {
  //       newRows.splice(rowIndexToRemove, 1);
  //     }

  //     dispatch(draggedItem(newRows));
  //     dispatch(rowDropped(newRows));
  //   } else {
  //     toast.error("Dragging a file into another file is not allowed!");

  //     return;
  //   }
  // };
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) {
      return;
    }

    const draggedRowId = result.draggableId;

    const newRows = [...rowsss];
    const updatedChildren = [...updatedDirectoryData.children];

    const rowIndexToRemove = newRows.findIndex((row, i) => i === draggedRowId);
    const destinationRow = newRows[destIndex];

    if (destinationRow?.mediaType !== "file") {
      // Remove the dragged row from the newRows
      const [draggedRow] = newRows.splice(rowIndexToRemove, 1);
      newRows.splice(destIndex, 0, draggedRow);
      if (destinationRow.children) {
        destinationRow?.children?.push(draggedRow);
      } else {
        destinationRow.children = [draggedRow];
      }

      // Update the children in updatedDirectoryData
      const updatedDataTree = updatedChildren.map((item) => {
        if (item.id === destinationRow.id) {
          return {
            ...item,
            children: destinationRow.children,
          };
        }
        return item;
      });

      dispatch(rowDropped(updatedDataTree));
      dispatch(draggedItem(newRows));
    } else {
      toast.error("Dragging a file into another file is not allowed!");
    }
  };


  const openMenu = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    // setSelectedRowData(rowData);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    // setSelectedRowData(null);
  };

  return (
    <div className="w-full flex flex-col ">
      <div
        className="w-full flex justify-between items-center h-[60px] border-b border-b-[#dee0e4] fixed bg-white z-10 fill-white            "
        ref={divOfTableRef}
      >
        <div className="flex  justify-start ml-4 text-[14px] min-w-[400px] select-none ">
          <div className="flex border-r-[2px] border-[#dee0e4] gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMShareIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            Create link
          </div>
          <div className="flex border-r-[2px] border-[#dee0e4] gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMEyeIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            View selected
          </div>
          {divWidth <= 730 ? (
            <></>
          ) : (
            <>
              <div className=" border-r-[2px] border-[#dee0e4] gap-2 px-4 cursor-pointer flex ">
                <img
                  src="/image/FMEyeIcon.svg"
                  className="w-[20px] h-[20px] cursor-pointer"
                  alt="icon"
                />
                Zip
              </div>

              <div className=" border-r-[2px] border-[#dee0e4] gap-2 px-4 cursor-pointer  flex">
                <img
                  src="/image/FMCopyIcon.svg"
                  className="w-[19px] h-[19px] cursor-pointer"
                  alt="icon"
                />
                Copy
              </div>
              <div className=" border-r-[2px] border-[#dee0e4] gap-2 px-4 cursor-pointer flex">
                <img
                  src="/image/FMDownloadIcon.svg"
                  className="w-[20px] h-[20px] cursor-pointer"
                  alt="icon"
                />
                Download
              </div>
            </>
          )}
          <div className="flex  gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMDotsIcon.svg"
              className="w-[20px] h-[20px] "
              alt="icon"
            />
            More
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" key="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div
                className={`w-full px-4 flex justify-center  font-roboto mt-[60px]`}
              >
                <DataGrid
                  autoHeight
                  rows={rowsss}
                  columns={columns}
                  pageSize={rowsss.length + 1}
                  checkboxSelection
                  disableRowSelectionOnClick
                  getRowId={(row) => row.identifier}
                  sx={{
                    borderLeft: "none",
                    borderRight: "none",
                    borderTop: "none",
                  }}
                  components={{
                    ColumnSortedAscendingIcon: () => (
                      <img
                        src={"/image/down.png"}
                        className="w-4 h-4"
                        alt="Ascending"
                      />
                    ),
                    ColumnSortedDescendingIcon: () => (
                      <img
                        src={"/image/up.png"}
                        className="w-4 h-4"
                        alt="Descending"
                      />
                    ),
                  }}
                />
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {[
          { icon: <Assignment />, text: 'Transcribe' },
          { icon: <AssignmentInd />, text: 'Assign' },
          { icon: <NoteAdd />, text: 'Add Note' },
          { divider: true },
          { icon: <MoveToInbox />, text: 'Move' },
          { icon: <Label />, text: 'Tag' },
          { icon: <Share />, text: 'Share' },
          { divider: true },
          { icon: <GetApp />, text: 'Download' },
          { icon: <FileCopy />, text: 'Copy' },
          { icon: <Delete />, text: 'Delete' },
        ].map((item, index) => (
          item.divider ? (
            <Divider key={index} />
          ) : (
            <MenuItem key={index} onClick={closeMenu}
            sx={{
              display: "flex",
              width:"200px",
              alignItems: "center",
              "& .MuiSvgIcon-root": {
                marginRight: 1, 
              },
            }}
            >
              <IconButton size="small" edge="start">
                {item.icon}
              </IconButton>
              {item.text}
            </MenuItem>
          )
        ))}
      </Menu>

    </div>
  );
};

export default FMMiddlePanel;

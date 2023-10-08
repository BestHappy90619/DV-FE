import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "FileName", headerName: "File Name", width: 300 },
  {
    field: "LastUpdated",
    headerName: "Last Updated",
    type: Date,
    width: 200,
    valueGetter: (params) => {
      // Convert Date to a readable string (e.g., "October 10, 2023")
      return new Date(params.row.LastUpdated).toUTCString();
    },
    sortComparator: (v1, v2, param1, param2) => {
      // Custom sorting function for "Last updated" column
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
      // Convert the numeric file size to a human-readable format
      const fileSize = params.row.Size;
      return formatFileSize(fileSize);
    },
    sortComparator: (v1, v2, param1, param2) => {
      return parseFileSize(param1.value) - parseFileSize(param2.value);
    },
  },
  {
    field: "PlayLength",
    headerName: "Length",
    description: "This column shows play time length of file.",
    width: 150,
    valueGetter: (params) => {
      // Convert Date to "hh:mm:ss" string format
      const date = new Date(params.row.PlayLength);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
  },
];

const extensionsArray = ["txt", "pdf", "png", "mp3", "mp4", "zip"];
const wordList = ["apple", "banana", "cat", "dog", "elephant", "fox", "grape"];

function generateRandomFileName(extensions, length = 2) {
  if (!Array.isArray(extensions) || extensions.length === 0) {
    throw new Error("Extensions array must be provided and not empty.");
  }

  if (!Array.isArray(wordList) || wordList.length === 0) {
    throw new Error("Word list array must be provided and not empty.");
  }

  const randomExtension =
    extensions[Math.floor(Math.random() * extensions.length)];
  let randomFileName = "";

  for (let i = 0; i < length; i++) {
    const randomWordIndex = Math.floor(Math.random() * wordList.length);
    const randomWord = wordList[randomWordIndex];
    randomFileName += randomWord;
  }

  return `${randomFileName}.${randomExtension}`;
}

const generateRandomDate = () => {
  const startDate = new Date(2000, 0, 1).getTime(); // Adjust the start date as needed
  const endDate = new Date().getTime(); // Use the current date as the end date

  const randomTime = startDate + Math.random() * (endDate - startDate);
  return new Date(randomTime);
};

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

let rows = [];

const fillRows = () => {
  for (let index = 0; index < 25; index++) {
    rows[index] = {
      id: index + 1,
      FileName: generateRandomFileName(extensionsArray),
      LastUpdated: generateRandomDate(),
      Size: Math.floor(Math.random() * 10995116277760),
      PlayLength: generateRandomDate(),
    };
  }
};

fillRows();

const FMMiddlePanel = () => {
  const divOfTableRef = useRef(null);
  const [divWidth, setDivWidth] = useState(1000);

  // Function to update the div width when the screen is resized
  const updateDivWidth = () => {
    if (divOfTableRef.current) {
      const width = divOfTableRef.current.offsetWidth;
      setDivWidth(Number(width));
    }
  };

  // Attach an event listener to the window's resize event
  useEffect(() => {
    window.addEventListener("resize", updateDivWidth);

    // Call the function initially to get the initial width
    updateDivWidth();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateDivWidth);
    };
  }, []);

  return (
    <div className="w-full flex flex-col ">
      <div
        className="w-full flex justify-between items-center h-[60px] border-b border-b-[#dee0e4]        
      "
        ref={divOfTableRef}
      >
        <div className="flex justify-start ml-4 text-[14px] min-w-[400px]">
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
          {divOfTableRef.current !== null && divWidth <= 730 ? (
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
            {/* <img
              src="/image/FMStarIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            <img
              src="/image/FMEditIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            <img
              src="/image/FMTrashIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            /> */}
          </div>
        </div>
      </div>
      <div
        className={`w-full px-4 flex justify-center overflow-y-auto max-h-[calc(100vh-250px)] font-roboto`}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={rows.length + 1}
          checkboxSelection
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
              <img src={"/image/up.png"} className="w-4 h-4" alt="Descending" />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default FMMiddlePanel;

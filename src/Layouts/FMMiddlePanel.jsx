import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "", width: 70 },
  { field: "FileName", headerName: "File Name", width: 300 },
  { field: "LastUpdated", headerName: "Last Updated", width: 130 },
  {
    field: "Size",
    headerName: "Size",
    type: "number",
    width: 100,
  }, // name, length, updated, size
  {
    field: "PlayLength",
    headerName: "Length",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
  },
];

const rows = [
  {
    id: 1,
    FileName: "Snow",
    LastUpdated: "Jon",
    Size: 35,
    PlayLength: "0:25:45",
  },
  {
    id: 2,
    FileName: "Lannister",
    LastUpdated: "Cersei",
    Size: 42,
    PlayLength: "0:25:45",
  },
  {
    id: 3,
    FileName: "Lannister",
    LastUpdated: "Jaime",
    Size: 45,
    PlayLength: "0:25:45",
  },
  {
    id: 4,
    FileName: "Stark",
    LastUpdated: "Arya",
    Size: 16,
    PlayLength: "0:25:45",
  },
  {
    id: 5,
    FileName: "Targaryen",
    LastUpdated: "Daenerys",
    Size: null,
    PlayLength: "0:25:45",
  },
  {
    id: 6,
    FileName: "Melisandre",
    LastUpdated: null,
    Size: 150,
    PlayLength: "0:25:45",
  },
  {
    id: 7,
    FileName: "Clifford",
    LastUpdated: "Ferrara",
    Size: 44,
    PlayLength: "0:25:45",
  },
  {
    id: 8,
    FileName: "Frances",
    LastUpdated: "Rossini",
    Size: 36,
    PlayLength: "0:25:45",
  },
  {
    id: 9,
    FileName: "Roxie",
    LastUpdated: "Harvey",
    Size: 65,
    PlayLength: "0:25:45",
  },
  {
    id: 10,
    FileName: "Snow",
    LastUpdated: "Jon",
    Size: 35,
    PlayLength: "0:25:45",
  },
  {
    id: 11,
    FileName: "Lannister",
    LastUpdated: "Cersei",
    Size: 42,
    PlayLength: "0:25:45",
  },
  {
    id: 12,
    FileName: "Lannister",
    LastUpdated: "Jaime",
    Size: 45,
    PlayLength: "0:25:45",
  },
  {
    id: 13,
    FileName: "Stark",
    LastUpdated: "Arya",
    Size: 16,
    PlayLength: "0:25:45",
  },
  {
    id: 14,
    FileName: "Targaryen",
    LastUpdated: "Daenerys",
    Size: null,
    PlayLength: "0:25:45",
  },
  {
    id: 15,
    FileName: "Melisandre",
    LastUpdated: null,
    Size: 150,
    PlayLength: "0:25:45",
  },
  {
    id: 16,
    FileName: "Clifford",
    LastUpdated: "Ferrara",
    Size: 44,
    PlayLength: "0:25:45",
  },
  {
    id: 17,
    FileName: "Frances",
    LastUpdated: "Rossini",
    Size: 36,
    PlayLength: "0:25:45",
  },
  {
    id: 18,
    FileName: "Roxie",
    LastUpdated: "Harvey",
    Size: 65,
    PlayLength: "0:25:45",
  },
];

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

import { useEffect, useState } from "react";

const FMMiddlePanel = () => {
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = (e) => {
    setScrollLeft(e.target.scrollLeft);
  };

  useEffect(() => {
    const tableBody = document.querySelector(".table-body");
    if (tableBody) {
      tableBody.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableBody) {
        tableBody.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between items-center h-[60px] border-b border-b-[#dee0e4]">
        <div className="flex justify-start ml-10 text-[14px]">
          <div className="flex border-r border-[#dee0e4] gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMShareIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            Create link
          </div>
          <div className="flex border-r border-[#dee0e4] gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMEyeIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            View selected
          </div>
          <div className="flex border-r border-[#dee0e4] gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMEyeIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            Zip
          </div>
          <div className="flex border-r border-[#dee0e4] gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMCopyIcon.svg"
              className="w-[19px] h-[19px] cursor-pointer"
              alt="icon"
            />
            Copy
          </div>
          <div className="flex border-r border-[#dee0e4] gap-2 px-4 cursor-pointer">
            <img
              src="/image/FMDownloadIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            Download
          </div>
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
      <div className={`w-full flex justify-center  `}>
        <table className="w-full">
          <thead className=" ">
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] ">
              <th align="center">
                <input type="checkbox" />
              </th>
              <th className="text-[#212121] font-medium" align="left">
                Name
              </th>
              <th className="text-[#212121] font-medium" align="left">
                Updated
              </th>
              <th className="text-[#212121] font-medium" align="left">
                Size
              </th>
              <th align="center">{"  "}</th>
            </tr>
          </thead>
          <tbody className="">
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>

            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td align="center">
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FMMiddlePanel;

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { ContentCopyOutlined as FileCopy } from "@mui/icons-material";
import { useState } from "react";

const FMRightSideBar = ({ selectedUser }) => {
  const [activeTab, setActiveTab] = useState("details");
  const data = [
    {
      label: "DETAILS",
      value: "details",
    },

    {
      label: "MEMBERS",
      value: "members",
    },
  ];

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(2) + " GB";
  }

  return (
    <div className="flex flex-col  w-full px-1   h-[calc(100vh-160px)] scrollable-content"  >
      <div className="flex justify-center  w-full">
        <Tabs value={activeTab} className="w-full">
          <TabsHeader
            className="rounded-none border-b border-[#C4C4C4] bg-transparent p-0 h-[60px] "
            indicatorProps={{
              className:
                "bg-transparent border-b-[3px] border-[#4489FE] shadow-none rounded-none",
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value
                    ? "text-[#4489FE] font-medium text-[13px]"
                    : "text-[13px]"
                }
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            <TabPanel key={"details"} value={"details"}>
              <div className="flex flex-col">
                <div className="text-[#212121] text-lg mt-4 mb-4">
                  File Details
                </div>
                <div className="flex flex-col gap-2 text-[14px]">
                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Uploaded By:</div>
                    <div className="text-[#212121]"></div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Uploaded Date:</div>
                    <div className="text-[#212121]">
                      {selectedUser ? selectedUser.LastUpdated || "" : 0}
                    </div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Last Activity</div>
                    <div className="text-[#212121]">0 </div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">File Size</div>
                    <div className="text-[#212121]">

                      {(selectedUser ? formatFileSize(selectedUser.Size) : "")}
                    </div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">File Type</div>
                    <div className="text-[#212121]">
                      {selectedUser ? selectedUser.fileType || "" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel key={"members"} value={"members"} className="py-4 px-0">
              <div className="flex w-full justify-between border-b-[#C4C4C4] border-b-[1px] h-[54px] ">
                <div className="flex justify-start items-center ">
                  <img
                    src="/image/avatar4.png"
                    className="w-[40px] h-[40px] rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <div className="text-[#212121] text-[14px]">
                      Serhii Movchan
                    </div>
                    <div className="text-[#bdbdbd] text-[14px]">Manager</div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dots"
                  />
                </div>
              </div>
              <div className="flex w-full justify-between border-b-[#C4C4C4] border-b-[1px] h-[54px] ">
                <div className="flex justify-start items-center ">
                  <img
                    src="/image/avatar4.png"
                    className="w-[40px] h-[40px] rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <div className="text-[#212121] text-[14px]">
                      Serhii Movchan
                    </div>
                    <div className="text-[#bdbdbd] text-[14px]">Manager</div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dots"
                  />
                </div>
              </div>
              <div className="flex w-full justify-between border-b-[#C4C4C4] border-b-[1px] h-[54px] ">
                <div className="flex justify-start items-center ">
                  <img
                    src="/image/avatar4.png"
                    className="w-[40px] h-[40px] rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <div className="text-[#212121] text-[14px]">
                      Serhii Movchan
                    </div>
                    <div className="text-[#bdbdbd] text-[14px]">Manager</div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dots"
                  />
                </div>
              </div>
              <div className="flex w-full justify-between border-b-[#C4C4C4] border-b-[1px] h-[54px] ">
                <div className="flex justify-start items-center ">
                  <img
                    src="/image/avatar4.png"
                    className="w-[40px] h-[40px] rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <div className="text-[#212121] text-[14px]">
                      Serhii Movchan
                    </div>
                    <div className="text-[#bdbdbd] text-[14px]">Manager</div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dots"
                  />
                </div>
              </div>
              <div className="flex w-full justify-between border-b-[#C4C4C4] border-b-[1px] h-[54px] ">
                <div className="flex justify-start items-center ">
                  <img
                    src="/image/avatar4.png"
                    className="w-[40px] h-[40px] rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <div className="text-[#212121] text-[14px]">
                      Serhii Movchan
                    </div>
                    <div className="text-[#bdbdbd] text-[14px]">Manager</div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dots"
                  />
                </div>
              </div>
              <div className="flex w-full justify-between border-b-[#C4C4C4] border-b-[1px] h-[54px] ">
                <div className="flex justify-start items-center ">
                  <img
                    src="/image/avatar4.png"
                    className="w-[40px] h-[40px] rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <div className="text-[#212121] text-[14px]">
                      Serhii Movchan
                    </div>
                    <div className="text-[#bdbdbd] text-[14px]">Manager</div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <img
                    src="/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dots"
                  />
                </div>
              </div>
              <div className="mt-8 text-[#4489FE] underline font-medium">
                Show All
              </div>
              <div className="mt-6 text-[#212121] text-[12px] font-medium">
                Folder Link
              </div>
              <div className="w-full mt-2 border-[1px] border-[#DEE0E4] py-2 px-1 flex items-center">
                <FileCopy />
                <div className="ellipsis">

                {selectedUser?.downloadURL ?? "Not available"}
                </div>
              </div>


            </TabPanel>
          

          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
};

export default FMRightSideBar;

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useState } from "react";

const FMRightSideBar = () => {
  const [activeTab, setActiveTab] = useState("details");
  const data = [
    {
      label: "DETAILS",
      value: "details",
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "CHAT",
      value: "chat",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "MEMBERS",
      value: "members",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
  ];

  return (
    <div className="flex flex-col  w-full px-4">
      <div className="flex justify-start items-center">
        <img
          src="/public/image/FMBigNewfolderIcon.svg"
          className="w-[36px] h-[36px]"
          alt="new  folder"
        />
        <div className="ml-3 text-[26px] text-[#212121]">New Folder</div>
      </div>
      <div className="flex justify-center mt-4 w-full">
        <Tabs value={activeTab} className="w-full">
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 h-[54px] "
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
                  activeTab === value ? "text-[#4489FE] font-medium" : ""
                }
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            <TabPanel key={"details"} value={"details"}>
              <div className="flex flex-col">
                <div className="text-[#212121] text-lg mb-4">Preview</div>
                <img
                  src="/public/image/Timelinemusicspectrum.svg"
                  className="w-full"
                  alt="music spectrum"
                />
                <div className="text-[#212121] text-lg mt-8 mb-4">
                  File Details
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Uploaded by:</div>
                    <div className="text-[#212121]">Serhii Movchan</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Uploaded Date:</div>
                    <div className="text-[#212121]">08/24/2019 05:45 PM</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Last Activity</div>
                    <div className="text-[#212121]">Today 04:15 PM</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">File Size</div>
                    <div className="text-[#212121]">3MB</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">File Type</div>
                    <div className="text-[#212121]">MP3</div>
                  </div>
                </div>
                <div className="text-[#212121] text-lg my-4">
                  Folder Details
                </div>
              </div>
            </TabPanel>

            <TabPanel key={"chat"} value={"chat"}>
              {""}
            </TabPanel>

            <TabPanel key={"members"} value={"members"}>
              {""}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
};

export default FMRightSideBar;

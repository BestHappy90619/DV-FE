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
    <div className="flex flex-col ml-4 w-full">
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
                <div className="text-[#212121] text-lg my-4">File Details</div>
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

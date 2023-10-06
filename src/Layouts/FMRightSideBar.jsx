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
          src="/image/FMBigNewfolderIcon.svg"
          className="w-[36px] h-[36px]"
          alt="new  folder"
        />
        <div className="ml-3 text-[26px] text-[#212121]">New Folder</div>
      </div>
      <div className="flex justify-center mt-3 w-full">
        <Tabs value={activeTab} className="w-full">
          <TabsHeader
            className="rounded-none border-b border-[#C4C4C4] bg-transparent p-0 h-[54px] "
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
                  src="/image/Timelinemusicspectrum.svg"
                  className="w-full"
                  alt="music spectrum"
                />
                <div className="text-[#212121] text-lg mt-8 mb-4">
                  File Details
                </div>
                <div className="flex flex-col gap-4 text-[14px]">
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
                    <div className="text-[#212121]">3 MB</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">File Type</div>
                    <div className="text-[#212121]">MP3</div>
                  </div>
                </div>
                <div className="text-[#212121] text-lg my-4">
                  Folder Details
                </div>
                <div className="flex flex-col gap-4  text-[14px]">
                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Owner:</div>
                    <div className="text-[#212121]">Serhii Movchan</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Created:</div>
                    <div className="text-[#212121]">08/24/2019 05:45 PM</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Last Activity</div>
                    <div className="text-[#212121]">Today 04:15 PM</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Total Members</div>
                    <div className="text-[#212121]">11 Members</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Total Files</div>
                    <div className="text-[#212121]">9 Files</div>
                  </div>

                  <div className="w-full flex justify-between">
                    <div className="text-[#757575]">Folder Size</div>
                    <div className="text-[#212121]">27 MB</div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel key={"chat"} value={"chat"}>
              <div className="text-[13px] font-bold text-center">Group GPT</div>
              <div className="text-[11px] font-semibold text-center">
                8 members, 3 online
              </div>
              <div className="flex w-full justify-between relative mt-12">
                <img
                  src="/image/avatar4.png"
                  alt=""
                  className="w-[31px] h-[31px] rounded-full"
                ></img>
                <div className="ml-14 text-[13px] mt-12 text-center absolute top-[-80px]">
                  <div className="text-[#4489FE] text-left">
                    Vasili Kovanalchuk
                  </div>
                  <div className="text-left">
                    How u doing? Do you wanna
                    <br /> change some bitcoins?
                  </div>
                </div>
                <div className="text-[12px] text-[#A4AAB3]">18:52</div>
              </div>
              <div className="  w-full flex justify-end mt-6">
                <div className="bubble right text-white text-[13px] w-8/12 px-2 text-left">
                  Yeah man! I need to change 895 BTC. Do you have it in your
                  pocket?
                  <div className="text-white text-[12px] text-right">18:49</div>
                </div>
              </div>
              <div className="flex w-full justify-between relative mt-14">
                <img
                  src="/image/avatar4.png"
                  alt=""
                  className="w-[31px] h-[31px] rounded-full"
                ></img>
                <div className="ml-14 text-[13px] mt-12 text-center absolute top-[-80px]">
                  <div className="text-[#4489FE] text-left">
                    Vasili Kovanalchuk
                  </div>
                  <div className="text-left">
                    Of course,, I have? And Do you
                    <br /> have money to buy them?
                  </div>
                </div>
                <div className="text-[12px] text-[#A4AAB3]">18:52</div>
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
              <div className="w-full mt-2 border-[1px] border-[#DEE0E4] py-2 px-4 flex items-center">
                <img
                  src="/image/FMShareIcon.svg"
                  className="w-[20px] h-[20px] mr-4"
                  alt="share icon"
                />
                https://www.dv.com/packs/file-folder
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
};

export default FMRightSideBar;

import NavBar from "@/Layouts/NavBar";
import FMResizablePanel from "@/Components/FMResizablePanel";
import { useEffect, useState } from "react";
import SearchBox from "../../Components/FMSearchBox";
import FMTreeSideBar from "../../Layouts/FMTreeSideBar";
import FMMiddlePanel from "../../Layouts/FMMiddlePanel";

const FileManager = () => {
  const [middlePanelWidth, setMiddlePanelWidth] = useState(300);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);

  // Create a function to update the window width when the window is resized
  const handleWindowResize = () => {
    setMiddlePanelWidth((window.innerWidth * 5) / 12);
    setLeftPanelWidth((window.innerWidth * 3) / 12);
  };

  // Attach the resize event listener when the component mounts
  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    // Remove the event listener when the component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleResizwMiddlePanel = (event, { size }) => {
    setMiddlePanelWidth(size.width);
  };

  const hadleResizeLeftPanel = (event, { size }) => {
    setLeftPanelWidth(size.width);
  };

  return (
    <div className="">
      <NavBar />
      <div className=" mx-9 w-full flex flex-col md:flex-row justify-start items-center mt-28 overflow-y-hidden ">
        <div className="flex items-start">
          <img
            src="/image/favicon.png"
            alt="Transcribatron.png"
            className=" mr-2 w-[26px] h-[30px]"
          />
          <div className="ml-2 text-[#4489FE] text-[22px]  font-roboto">
            DeskVantage
          </div>
          <div className="ml-1 text-[#3F51B5] text-[22px]  font-roboto">
            Storage
          </div>
        </div>
        <div className="w-full md:w-calc-full-without-200  md:max-w-[840px] flex items-end ">
          <SearchBox
            className={`w-10/12 bg-[#F1F3F4] h-[50px] px-3  mx-0 md:ml-28 `}
          />
        </div>
      </div>
      <div className="w-full flex relative mt-10">
        <div className="">
          <FMResizablePanel
            width={leftPanelWidth}
            onResize={hadleResizeLeftPanel}
          >
            <FMTreeSideBar />
          </FMResizablePanel>
        </div>

        <div className="">
          <FMResizablePanel
            width={middlePanelWidth}
            onResize={handleResizwMiddlePanel}
          >
            <FMMiddlePanel />
          </FMResizablePanel>
        </div>
      </div>
    </div>
  );
};

export default FileManager;

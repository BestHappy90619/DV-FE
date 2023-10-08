import { useEffect, useRef, useState } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSearch,
  setLeftSidebarWidth,
  setRightSidebarWidth,
} from "@/redux-toolkit/reducers/Sidebar";

// layouts
import NavBar from "../../Layouts/NavBar";
// import FMTreeSideBar from "../../Layouts/FMTreeSideBar";
import FMMuiTreeSideBar from "../../Layouts/FMMuiTreeSideBar";
import FMMiddlePanel from "../../Layouts/FMMiddlePanel";
import FMRightSideBar from "../../Layouts/FMRightSideBar";

// constant
import { RESIZED_SIDEBAR, PREVENT_SELECT } from "@/utils/constant";
import { EventBus } from "@/utils/function";
import { Breadcrumbs } from "@material-tailwind/react";

const MainLyt = () => {
  const dispatch = useDispatch();

  const {
    minWidth,
    maxWidth,
    leftSidebarWidth,
    rightSidebarWidth,
  } = useSelector((state) => state.sidebar);

  const [showLeftSideBar, setShowLeftSideBar] = useState(true);
  const [showRightSideBar, setShowRightSideBar] = useState(true);
  const isNowLeftResizing = useRef(false);
  const isNowRightResizing = useRef(false);

  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        e.preventDefault();
        dispatch(toggleSearch());
      }
    });

    window.addEventListener("mousemove", function (e) {
      if (!isNowLeftResizing.current && !isNowRightResizing.current) return;
      EventBus.dispatch(PREVENT_SELECT, true);
      if (isNowLeftResizing.current) {
        // const newWidth = leftSidebarWidth + (e.screenX - leftSidebarWidth);
        const newWidth = e.clientX;

        if (newWidth >= minWidth && newWidth <= maxWidth)
          dispatch(setLeftSidebarWidth(newWidth));
      }
      if (isNowRightResizing.current) {
        const newWidth =
          rightSidebarWidth +
          (this.window.innerWidth - rightSidebarWidth - e.clientX);
        if (newWidth >= minWidth && newWidth <= maxWidth)
          dispatch(setRightSidebarWidth(newWidth));
      }
    });

    window.addEventListener("mouseup", () => {
      isNowLeftResizing.current = false;
      isNowRightResizing.current = false;
      EventBus.dispatch(PREVENT_SELECT, false);
    });

    window.addEventListener("resize", () => {
      console.log("window.innerWidth   >>> ", window?.innerWidth || 0);
      if (window) {
        if (window.innerWidth <= 800) {
          setShowLeftSideBar(false);
          setShowRightSideBar(false);
          dispatch(setLeftSidebarWidth(0));
          dispatch(setRightSidebarWidth(0));
        } else {
          setShowLeftSideBar(true);
          setShowRightSideBar(true);
          dispatch(setLeftSidebarWidth(250));
          dispatch(setRightSidebarWidth(250));
        }
      }
    });

    return () => {
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("mouseup", () => {});

      window.removeEventListener("resize", () => {});
    };
  }, []);

  useEffect(() => {
    EventBus.dispatch(RESIZED_SIDEBAR, RESIZED_SIDEBAR);
  }, [leftSidebarWidth, rightSidebarWidth]);

  const leftSidebarMouseDown = () => {
    isNowLeftResizing.current = true;
  };

  const rightSidebarMouseDown = () => {
    isNowRightResizing.current = true;
  };

  return (
    <div className="h-full ">
      <NavBar />
      <div className="flex z-40 bg-white justify-between w-full h-[60px] items-center border-b-[#dee0e4] border-b-[1px] top-[82px] fixed">
        <Breadcrumbs
          className={`flex items-center h-5 py-0 my-0 bg-transparent`}
          style={{ marginLeft: `${leftSidebarWidth + 10}px` }}
        >
          <a href="#" className="text-[16px] text-[#757575] font-medium">
            <span>Site</span>
          </a>
          <a href="#" className="text-[16px] text-[#212121] font-medium">
            <span>New Folder</span>
          </a>
        </Breadcrumbs>
      </div>
      <div className="mt-[142px] flex h-full">
        <div
          className=" fixed left-0 z-40 bg-white h-full"
          style={{
            width: `${leftSidebarWidth}px`,
            display: `${showLeftSideBar === true ? "flex" : "hidden"}`,
          }}
        >
          {/* <FMTreeSideBar /> */}
          <FMMuiTreeSideBar showOrHide={showLeftSideBar} />
          <div
            className="w-1 border-l-2 cursor-col-resize border-blue-gray-50 "
            onMouseDown={leftSidebarMouseDown}
          ></div>
        </div>

        <div
          style={{
            marginLeft: leftSidebarWidth + "px",
            marginRight: rightSidebarWidth + "px",
            width: `calc(100% - ${
              Number(leftSidebarWidth) + Number(rightSidebarWidth)
            }px)`,
          }}
        >
          <FMMiddlePanel />
        </div>

        <div
          className=" fixed right-0 z-40 bg-white h-full"
          style={{
            width: `${rightSidebarWidth}px`,
            display: `${showRightSideBar ? "flex" : "hidden"}`,
          }}
        >
          <div
            className="w-1 border-r-2 cursor-col-resize border-blue-gray-50 h-full"
            onMouseDown={rightSidebarMouseDown}
          ></div>
          <FMRightSideBar />
        </div>
      </div>
    </div>
  );
};

export default MainLyt;

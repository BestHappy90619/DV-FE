import { useEffect, useRef } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSearch,
  setLeftSidebarWidth,
  setRightSidebarWidth,
} from "@/redux-toolkit/reducers/Sidebar";

// layouts
import NavBar from "../../Layouts/NavBar";
import FMTreeSideBar from "../../Layouts/FMTreeSideBar";
import FMMiddlePanel from "../../Layouts/FMMiddlePanel";
import FMRightSideBar from "../../Layouts/FMRightSideBar";

// constant
import { RESIZED_SIDEBAR, PREVENT_SELECT } from "@/utils/constant";
import { EventBus } from "@/utils/function";
import { Breadcrumbs } from "@material-tailwind/react";

const MainLyt = () => {
  const dispatch = useDispatch();

  const { minWidth, maxWidth } = useSelector((state) => state.sidebar);
  const leftSidebarWidth = 300;
  const rightSidebarWidth = 350;

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
        const newWidth = leftSidebarWidth + (e.screenX - leftSidebarWidth);
        if (newWidth >= minWidth && newWidth <= maxWidth)
          dispatch(setLeftSidebarWidth(newWidth));
      }
      if (isNowRightResizing.current) {
        const newWidth =
          rightSidebarWidth +
          (this.window.innerWidth - rightSidebarWidth - e.screenX);
        if (newWidth >= minWidth && newWidth <= maxWidth)
          dispatch(setRightSidebarWidth(newWidth));
      }
    });

    window.addEventListener("mouseup", () => {
      isNowLeftResizing.current = false;
      isNowRightResizing.current = false;
      EventBus.dispatch(PREVENT_SELECT, false);
    });

    return () => {
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("mouseup", () => {});
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
    <div className="h-full">
      <NavBar />
      <div className="flex mt-[82px] justify-between w-full h-[60px] items-center border-b-[#dee0e4] border-b-[1px]">
        <Breadcrumbs className="ml-[300px] flex items-center h-5 py-0 my-0">
          <a href="#" className="text-[14px] text-[#757575]">
            <span>Site</span>
          </a>
          <a href="#" className="text-[14px] text-[#212121]">
            <span>New Folder</span>
          </a>
        </Breadcrumbs>
      </div>
      <div className="flex h-full">
        <div className="flex fixed z-40 bg-white h-full">
          <div style={{ width: leftSidebarWidth, height: "100%" }}>
            <FMTreeSideBar />
          </div>
          <div
            className="w-1 border-l-2 cursor-col-resize border-blue-gray-50"
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
            overflowX: "auto",
          }}
        >
          <FMMiddlePanel />
        </div>

        <div className="flex fixed right-0 z-40 bg-white h-full">
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

import { useEffect, useRef } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSearch,
  setLeftSidebarWidth,
  setRightSidebarWidth,
} from "@/redux-toolkit/reducers/Sidebar";

// layouts
import NavBar from "../../Layouts/FMNavBar";
import FMTreeSideBar from "../../Layouts/FMTreeSideBar";
import FMMiddlePanel from "../../Layouts/FMMiddlePanel";
import FMRightSideBar from "../../Layouts/FMRightSideBar";

// constant
import { RESIZED_SIDEBAR, PREVENT_SELECT } from "@/utils/constant";
import { EventBus } from "@/utils/function";
import FMFooter from "../../Layouts/FMFooter";

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
    <>
      <NavBar />

      <div className="flex mt-[122px] mb-[102px]">
        <div className="flex fixed z-40 bg-white">
          <div style={{ width: leftSidebarWidth }}>
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
          }}
        >
          <FMMiddlePanel />
        </div>

        <div className="flex fixed right-0 z-40 bg-white">
          <div
            className="w-1 border-r-2 cursor-col-resize border-blue-gray-50"
            onMouseDown={rightSidebarMouseDown}
          ></div>
          <FMRightSideBar />
        </div>
      </div>

      <FMFooter />
    </>
  );
};

export default MainLyt;

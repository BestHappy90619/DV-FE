import { useState, useEffect, useRef, useCallback } from "react";

let isLeftResized = false;

const DVResizeablePanel = (props) => {
    const { sidebarMinWidth, sidebarMaxWidth, sidebarDefaultWidth, showLeftSidebar, showRightSidebar } = props;
    const leftSidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [leftSidebarWidth, setLeftSidebarWidth] = useState(sidebarDefaultWidth);

    const rightSidebarRef = useRef(null);
    const [rightSidebarWidth, setRightSidebarWidth] = useState(sidebarDefaultWidth);

    const startLeftResizing = useCallback((mouseDownEvent) => {
        setIsResizing(true);
        isLeftResized = true;
    }, []);

    const startRightResizing = useCallback((mouseDownEvent) => {
        setIsResizing(true);
        isLeftResized = false
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((mouseMoveEvent) => {
        if (isResizing) {
            if (isLeftResized) {
                let newWidth = mouseMoveEvent.clientX - leftSidebarRef.current.getBoundingClientRect().left;
                newWidth >= sidebarMinWidth && newWidth <= sidebarMaxWidth && setLeftSidebarWidth(newWidth);
            } else {
                let newWidth = window.innerWidth - mouseMoveEvent.clientX;
                newWidth >= sidebarMinWidth && newWidth <= sidebarMaxWidth && setRightSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div className={`${true && 'select-none'} flex`}>
            <div
                ref={leftSidebarRef}
                className={`flex fixed z-40 bg-white ${props.className} ${showLeftSidebar ? '' : 'hidden'}`}
            >
                <div style={{ width: leftSidebarWidth }}>{ props.leftSidebar }</div>
                <div className="w-1 border-r-2 cursor-col-resize border-blue-gray-50" onMouseDown={startLeftResizing} />
            </div>

            <div style={{marginLeft: showLeftSidebar ? leftSidebarWidth + 6 + "px" : '0', marginRight: showRightSidebar ? rightSidebarWidth + 6 + "px" : '0'}} className={`w-full  ${props.className}`}>{props.children}</div>

            <div
                ref={rightSidebarRef}
                className={`flex fixed z-40 bg-white right-0 h-full ${props.className} ${showRightSidebar ? '' : 'hidden'}`}
            >
                <div className="w-1 border-l-2 cursor-col-resize border-blue-gray-50" onMouseDown={startRightResizing} />
                <div style={{ width: rightSidebarWidth }}>{ props.rightSidebar }</div>
            </div>
        </div>
    );
}

export default DVResizeablePanel;
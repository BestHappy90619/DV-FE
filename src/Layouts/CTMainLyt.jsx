import { Outlet } from "react-router-dom";

import DVNavigation from "@/Components/DVNavigation";

const TBFileManageLyt = () => {
    return (
        <div className="flex mt-[84px]">
            <div className="flex fixed z-40 bg-white w-[100px]">
                <DVNavigation close={() => dispatch(toggleNote())} />
            </div>
            <div className="ml-[100px] w-full">
            <Outlet />
            </div>
        </div>
    )
}

export default TBFileManageLyt;
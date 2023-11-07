import { Outlet } from "react-router-dom";

import DVBreadcrumbs from "@/Components/DVBreadcrumbs";

const TBFileManageLyt = () => {
    return (
        <>
            <DVBreadcrumbs />
            <Outlet />
        </>
    )
}

export default TBFileManageLyt;
import { Outlet } from "react-router-dom";

import DVBreadcrumbs from "../Components/DVBreadcrumbs";

const FileManageLyt = () => {
    return (
        <>
            <DVBreadcrumbs />
            <Outlet />
        </>
    )
}

export default FileManageLyt;
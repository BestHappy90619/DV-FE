import { Breadcrumbs } from "@material-tailwind/react";
const DVBreadcrumbs = () => {
    return (
      <div className="flex z-20 bg-white justify-between w-full h-[60px] items-center border-b-[#dee0e4] border-b-[1px] top-[82px] fixed">
        <Breadcrumbs
          className={`flex items-center h-5 py-0 my-0 bg-transparent`}
          style={{ marginLeft: `400px` }}
        >
          <a href="#" className="text-[16px] text-[#757575] font-medium">
            <span>Site</span>
          </a>
          <a href="#" className="text-[16px] text-[#212121] font-medium">
            <span>New Folder</span>
          </a>
        </Breadcrumbs>
      </div>
    )
}

export default DVBreadcrumbs;
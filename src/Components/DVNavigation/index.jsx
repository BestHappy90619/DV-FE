import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// icons
import { HiMiniShoppingCart } from "react-icons/hi2";
import { MdTask } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { BsFillHandbagFill } from "react-icons/bs";

const Navigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menus = [
    {
      id: 0,
      icon: <HiMiniShoppingCart />,
      label: "ORDERING",
      paths: ['/ordering', '/ordering/edit']
    },
    {
      id: 1,
      icon: <BsFillHandbagFill />,
      label: "PRODUCTION",
      paths: ['/production']
    },
    {
      id: 2,
      icon: <MdTask />,
      label: "TASKS",
      paths: ['/tasks']
    },
    {
      id: 3,
      icon: <FaUserGroup />,
      label: "USER MANAGEMENT",
      paths: ['/usermanagement']
    }
  ]

  const isHighlightNavigation = (paths) => {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] === pathname) return true;
    }
    return false;
  }

  // console.log(isHighlightNavigation(menus[0].paths), pathname, menus[0].paths)
  
  return (
    <>
      <div className='h-[calc(100vh-84px)] border-r-2 shadow-blue-gray-900/20 ease-in-out duration-300'>
        <div className="mt-24 p-0">
          <hr className="my-2 ml-[25px] border-blue-gray-50 w-1/2" />
          {
            menus.map(menu => {
              return (
                <div key={menu.id}>
                  <div className="flex hover:bg-blue-500/10" onClick={() => navigate(menu.paths[0])}>
                    <div className={`w-1 ${isHighlightNavigation(menu.paths) ? "bg-custom-sky" : ""} rounded-r-3xl`}></div>
                    <div className={`w-full cursor-pointer h-16 text-sm pr-1 py-2 text-center  ${isHighlightNavigation(menu.paths) ? "text-custom-sky" : "text-blue-gray-700"} flex items-center justify-center gap-2 flex-col`}>
                      {menu.icon}
                      <span className="text-[10px]">{menu.label}</span>
                    </div>
                  </div>
                  <hr className="my-2 ml-[25px] border-blue-gray-50 w-1/2" />
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
};

export default Navigation;

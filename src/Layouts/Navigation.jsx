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
      path: '/'
    },
    {
      id: 1,
      icon: <BsFillHandbagFill />,
      label: "PRODUCTION",
      path: '/production'
    },
    {
      id: 2,
      icon: <MdTask />,
      label: "TASKS",
      path: '/tasks'
    },
    {
      id: 3,
      icon: <FaUserGroup />,
      label: "USER MANAGEMENT",
      path: '/usermanagement'
    }
  ]

  const onClickMenu = (menuId) => {
    navigate(menus[menuId].path);
  }
  
  return (
    <>
      <div className='w-full h-[calc(100vh-82px)] border-r-2 shadow-blue-gray-900/20 ease-in-out duration-300'>
        <div className="mt-24 p-0">
          <hr className="my-2 ml-[25px] border-blue-gray-50 w-1/2" />
          {
            menus.map(menu => {
              return (
                <div key={menu.id}>
                  <div className="flex hover:bg-blue-500/10" onClick={() => onClickMenu(menu.id)}>
                    <div className={`w-1 ${pathname == menu.path ? "bg-custom-sky" : ""} rounded-r-3xl`}></div>
                    <div className={`w-full cursor-pointer h-16 text-sm pr-1 py-2 text-center  ${pathname == menu.path ? "text-custom-sky" : "text-blue-gray-700"} flex items-center justify-center gap-2 flex-col`}>
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

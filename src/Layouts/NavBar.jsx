import { useNavigate, useLocation } from "react-router-dom";

// material
import {
  Navbar,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";

export default function NavBar() {
  const navigate = useNavigate();

  const currentUrl = useLocation().pathname;

  const menus = [
    {
      title: "Media",
      path: "/media",
      key: ["/media", "/media/mines", "/media/upload"],
      children: [
        {
          title: "My Files",
          path: "/mines",
        },
        {
          title: "Upload File",
          path: "/upload",
        },
      ],
    },
    {
      title: "Transcripts",
      path: "/transcripts",
      key: ["/transcripts", "/transcripts/tasklist", "/transcripts/editor"],
      children: [
        {
          title: "List of Tasks",
          path: "/tasklist",
        },
        {
          title: "Editor",
          path: "/editor",
        },
      ],
    },
    {
      title: "Users",
      path: "/users",
      key: ["/user", "/users/clients", "/users/myteam"],
      children: [
        {
          title: "Clients",
          path: "/clients",
        },
        {
          title: "My Team",
          path: "/myteam",
        },
      ],
    },
    {
      title: "File Manage",
      path: "/filemanage",
      key: ["/filemanage"],
    },
  ];

  return (
    <Navbar className="top-0 z-50 rounded-none fixed bg-white bg-opacity-100 border-white border-opacity-100 backdrop-saturate-0 backdrop-blur-none">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Typography
            className="flex cursor-pointer mr-16 font-bold text-custom-black text-xl items-center"
            onClick={() => navigate("/")}
          >
            <img
              src="/image/favicon.png"
              alt="Transcribatron.png"
              className=" mr-2 w-[26px] h-[30px]"
            />
            {/* Transcribatron */}
          </Typography>
          <ul className="flex flex-row gap-6">
            {menus.map((menu) => {
              return (
                <li
                  key={menu.path}
                  className={`cursor-pointer ${
                    menu.key.includes(currentUrl)
                      ? "text-custom-sky"
                      : "text-custom-black"
                  }`}
                >
                  <Menu allowHover>
                    {Object.keys(menu)?.includes("children") ? (
                      <>
                        <MenuHandler>
                          <span
                            onClick={() =>
                              menu.children.length > 0
                                ? navigate("#")
                                : navigate(menu.path)
                            }
                            className={`cursor-pointer ${
                              menu.key.includes(currentUrl)
                                ? "text-custom-sky"
                                : "text-custom-black"
                            }`}
                          >
                            {menu.title}
                          </span>
                        </MenuHandler>
                        <MenuList>
                          {menu.children.map((child) => {
                            return (
                              <MenuItem key={child.path}>
                                <span
                                  className={
                                    menu.path + child.path == currentUrl
                                      ? "text-custom-sky"
                                      : "text-custom-black"
                                  }
                                  onClick={() =>
                                    navigate(menu.path + child.path)
                                  }
                                >
                                  {child.title}
                                </span>
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      </>
                    ) : (
                      <>
                        <span
                          className={`cursor-pointer ${
                            menu.key.includes(currentUrl)
                              ? "text-custom-sky"
                              : "text-custom-black"
                          }`}
                          onClick={() => navigate(menu.path)}
                        >
                          {menu.title}
                        </span>
                      </>
                    )}
                  </Menu>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="">
          <Menu>
            <MenuHandler>
              <Avatar
                variant="circular"
                alt="tania andrew"
                className="cursor-pointer"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
              />
            </MenuHandler>
            <MenuList>
              <div className="flex outline-0 cursor-pointer">
                <hr className="my-2 border-blue-gray-50 w-1/3" />
                <p className=" w-1/3 text-center text-custom">Account</p>
                <hr className="my-2  w-1/3 border-blue-gray-50" />
              </div>
              <MenuItem className="flex gap-2">
                <Typography variant="small" className="font-normal">
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem className="flex gap-2">
                <Typography variant="small" className="font-normal">
                  Password
                </Typography>
              </MenuItem>
              <MenuItem className="flex gap-2">
                <Typography variant="small" className="font-normal">
                  Settings
                </Typography>
              </MenuItem>
              <div className="flex outline-0 cursor-pointer">
                <hr className="my-2 border-blue-gray-50 w-1/3" />
                <p className=" w-1/3 text-center">Billing</p>
                <hr className="my-2  w-1/3 border-blue-gray-50" />
              </div>
              <MenuItem className="flex gap-2">
                <Typography variant="small" className="font-normal">
                  Payment Methods
                </Typography>
              </MenuItem>
              <MenuItem className="flex gap-2">
                <Typography variant="small" className="font-normal">
                  Transaction History
                </Typography>
              </MenuItem>
              <div className="flex outline-0 cursor-pointer">
                <hr className="my-2 border-blue-gray-50 w-1/3" />
                <p className=" w-1/3 text-center">Support</p>
                <hr className="my-2  w-1/3 border-blue-gray-50" />
              </div>
              <MenuItem className="flex gap-2">
                <Typography variant="small" className="font-normal">
                  Knowledge Base
                </Typography>
              </MenuItem>
              <MenuItem className="flex gap-2">
                <Typography variant="small" className="font-normal">
                  Contact Support
                </Typography>
              </MenuItem>
              <div className="flex outline-0 cursor-pointer">
                <hr className="my-2 border-blue-gray-50 w-full" />
              </div>
              <MenuItem className="flex gap-2 ">
                <Typography variant="small" className="font-normal">
                  Sign Out
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

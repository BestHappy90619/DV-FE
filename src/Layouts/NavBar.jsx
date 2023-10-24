
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

// icons
import { RxHamburgerMenu, RxPlus } from "react-icons/rx";
import { AiOutlineShoppingCart } from "react-icons/ai";

// components
import TSearchBox from "../Components/TSearchBox";
import TStatus from "../Components/TStatus";

// constants
import { APP_NAME } from "../utils/constant";

export default function NavBar() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && (
    <Navbar className="top-0 z-50 rounded-none fixed bg-white bg-opacity-100 border-white border-opacity-100 backdrop-saturate-0 backdrop-blur-none">
      <div className="flex justify-between">
        <div className="flex items-center">
          <RxHamburgerMenu className="text-custom-black text-2xl mr-8 cursor-pointer" />
          <Typography
            className="flex cursor-pointer mr-16 text-custom-sky text-xl items-center"
            onClick={() => navigate("/")}
          >
            <img src="/image/favicon.png" alt="Transcribatron.png" className=" mr-2 w-[26px] h-[30px]" />
            {APP_NAME}
          </Typography>
        </div>
        <div className="flex items-center gap-8 mr-8">
          <div className="w-[500px] mr-16">
            <TSearchBox className={` bg-[#F2F3F5] h-[50px] `} />
          </div>
          <div className="flex gap-4">
            <RxPlus className="text-custom-gray text-2xl cursor-pointer"/>
            <AiOutlineShoppingCart className="text-custom-gray text-2xl cursor-pointer" />
          </div>
          <Menu>
            <MenuHandler>
              <div className="flex items-center gap-4 cursor-pointer">
                <Avatar
                  variant="circular"
                  alt="tania andrew"
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                />
                <div>
                  <p className="text-custom-black text-sm">{currentUser.name}</p>
                  <TStatus status={currentUser.status} />
                </div>
              </div>
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

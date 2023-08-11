import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const MainLyt = () => {
  return (
    <>
      <NavBar />
      <SideBar />

      <Outlet />
    </>
  );
};

export default MainLyt;

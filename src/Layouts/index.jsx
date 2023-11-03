import { Outlet } from "react-router-dom";

// Navbar
import DVNavbar from "@/Components/DVNavbar";

const MainLyt = () => {


  return (
    <>
      <DVNavbar />

      <Outlet />
    </>
  );
};

export default MainLyt;
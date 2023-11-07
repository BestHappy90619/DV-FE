import { Outlet } from "react-router-dom";

// Navbar
import DVNavbar from "@/Components/DVNavbar";

const TBMainLyt = () => {

  return (
    <>
      <DVNavbar />

      <Outlet />
    </>
  );
};

export default TBMainLyt;
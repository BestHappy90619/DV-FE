import { Outlet } from "react-router-dom";

// layouts
import NavBar from "./NavBar";
import Navigation from "./Navigation";

const MainLyt = () => {
  
  return (
    <>
      <NavBar />
      <div className="flex mt-[82px]">
        <div className="flex fixed z-40 bg-white w-[100px]">
            <Navigation close={() => dispatch(toggleNote())} />
        </div>
        <div className="ml-[100px] w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLyt;
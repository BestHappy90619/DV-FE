import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import TMenuItem from "@/Components/TMenuItem";
import { AiOutlineMenu, AiOutlineMore, AiOutlineClose } from "react-icons/ai";
import { BiBrain } from "react-icons/bi";
import { IoArrowRedoOutline } from "react-icons/io5";
import { MdSystemUpdateAlt, MdOutlineSdStorage } from "react-icons/md";
import { LuMailOpen } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
 
export default function NavBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const currentUrl = location.pathname;
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
 
  const menuLists = [
    { label: "Home", href: "/", key: ["/"] },
    {
      label: "Format",
      href: "/format",
      key: ["/format"],
    },
    {
      label: "Jeffersonian",
      href: "/jeffersonian",
      key: ["/jeffersonian"],
    },
    {
      label: "Indexing",
      href: "/indexing",
      key: ["/indexing"],
    },
    {
      label: "Translation",
      href: "/translation",
      key: ["/translation"],
    },
    {
      label: "Subtitles",
      href: "/subtitles",
      key: ["/subtitles"],
    },
    {
      label: "Memory",
      href: "/memory",
      key: ["/memory"],
    },
  ];

  return (
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 xl:px-8 xl:py-4">
        <div className="flex justify-between">
        <div className="flex items-center">
            <AiOutlineMenu className="text-black text-2xl mr-4 cursor-pointer" />
            <Typography
              as="a"
              href="/"
              className="flex cursor-pointer py-1.5 mr-16 font-bold text-heavy-grey-21"
            >
              <img src="image/favicon.png" alt="Transcribatron.png" className=" mr-2 object-cover w-6 h-6"/>
              Transcribatron
            </Typography>
            <div className="mr-4 hidden xl:block">
              <ul className="mb-4 mt-2 flex flex-col gap-2 xl:mb-0 xl:mt-0 xl:flex-row xl:items-center xl:gap-6">
                {menuLists.map((item, index) => {
                  const { label, href, key } = item;
                  return (
                    <TMenuItem
                      key={index}
                      label={label}
                      selected={key.includes(currentUrl)}
                      href={href}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <BiBrain variant="gradient" className="hidden xl:inline-block text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <IoArrowRedoOutline variant="gradient" className="hidden xl:inline-block text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <MdSystemUpdateAlt variant="gradient" className="hidden xl:inline-block text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <MdOutlineSdStorage variant="gradient" className="hidden xl:inline-block text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <LuMailOpen variant="gradient" className="hidden xl:inline-block text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <FiSettings variant="gradient" className="hidden xl:inline-block text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent xl:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <AiOutlineClose className="text-heavy-grey-21 text-2xl mr-4" />
              ) : (
                <AiOutlineMore className="text-heavy-grey-21 text-2xl mr-4" />
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          <ul className="mb-4 mt-2 flex flex-col gap-2 xl:mb-0 xl:mt-0 xl:flex-row xl:items-center xl:gap-6">
            {menuLists.map((item, index) => {
                const { label, href, key } = item;
                return (
                  <TMenuItem
                    key={index}
                    label={label}
                    selected={key.includes(currentUrl)}
                    href={href}
                  />
                );
            })}
          </ul>
          <div className="flex gap-16 justify-center">
            <BiBrain variant="gradient" className="mb-2 text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <IoArrowRedoOutline variant="gradient" className="mb-2 text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <MdSystemUpdateAlt variant="gradient" className="mb-2 text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <MdOutlineSdStorage variant="gradient" className="mb-2 text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <LuMailOpen variant="gradient" className="mb-2 text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
            <FiSettings variant="gradient" className="mb-2 text-icon-4489FE text-2xl cursor-pointer rounded-lg w-8 h-8 p-1.5 bg-icon-4489FE bg-opacity-20" />
          </div>
        </Collapse>
      </Navbar>
  );
}
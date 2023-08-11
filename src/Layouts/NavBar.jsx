import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import TMenuItem from "@/Components/TMenuItem";
 
export default function NavBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const currentUrl = location.pathname;
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
 
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Pages
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Blocks
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Docs
        </a>
      </Typography>
    </ul>
  );
 
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
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
        <div className="flex text-blue-gray-900 justify-between">
          <div className="flex items-center">
            <Typography
              as="a"
              href="/"
              className="flex cursor-pointer py-1.5 font-medium  mr-16"
            >
              <img src="image/favicon.png" alt="Transcribatron.png" className=" mr-2 object-cover w-6 h-6"/>
              Transcribatron
            </Typography>
            <div className="mr-4 hidden lg:block">
              <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
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
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
            >
              <span>Buy Now</span>
            </Button>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
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
          <Button variant="gradient" size="sm" fullWidth className="mb-2">
            <span>Buy Now</span>
          </Button>
        </Collapse>
      </Navbar>
  );
}
import React from 'react';
import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";

const DVSearchBox = ({ className, hasSuffix, value, onChange }) => {
  const [openSuffix, setOpenSuffix] = React.useState(false);

  return (
    <div
      className={`${className} flex items-center justify-between rounded-[8px]`}
    >
      <div className="flex justify-start items-center w-full">
        <AiOutlineSearch className="text-2xl ml-4 text-custom-gray"/>
        <input
          placeholder="Start typing to search"
          type="text"
          className="text-black text-md bg-transparent w-full ml-3 outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {hasSuffix && (
          <div className="flex mr-4">
            <Popover placement="bottom-end" open={openSuffix} handler={setOpenSuffix}>
              <PopoverHandler>
                <button className="flex items-center outline-none text-custom-gray">
                  <span>All</span>
                  <BiChevronDown className={`transition-transform ${openSuffix ? "rotate-180" : ""}`} />
                </button>
              </PopoverHandler>
              <PopoverContent className="z-50 bg-opacity-0 border-opacity-0 shadow-none p-0 pt-2">
                <div className="w-40 h-14 text-custom-black text-sm rounded bg-white flex items-center pl-4 shadow-md cursor-pointer">All</div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default DVSearchBox;

import { useState } from "react";
// redux
import { togglePlaylist } from "../../../redux-toolkit/reducers/Sidebar";
import {useSelector, useDispatch } from "react-redux";

// material
import { Slider } from "@material-tailwind/react";

// icons
import { BsPlayCircleFill } from "react-icons/bs";
import { AiFillBackward, AiFillForward } from "react-icons/ai";
import { BiSolidVolume, BiSolidVolumeFull, BiFolder } from "react-icons/bi";
import { FaListUl } from "react-icons/fa";

import { setMinimumFractionFormat } from "@/utils/function";

const TMediaController = () => {
  const dispatch = useDispatch();
  const { selectedMedia } = useSelector((state) => state.media);
  const [frameSpeed, setFrameSpeed] = useState("1.0");
  const { currentTimeline, duration } = useSelector((state) => state.media); //true: left, false: right
  
  const clickMinusFrameSpeed = () => {
    var frameSpeedNum = frameSpeed * 1;
    frameSpeedNum -= 0.2;
    if (frameSpeedNum < 0.4) frameSpeedNum = 0.4;
    setFrameSpeed(setMinimumFractionFormat(frameSpeedNum));
  }

  const clickPlusFrameSpeed = () => {
    var frameSpeedNum = frameSpeed * 1;
    frameSpeedNum += 0.2;
    if (frameSpeedNum > 4) frameSpeedNum = 4;
    setFrameSpeed(setMinimumFractionFormat(frameSpeedNum));
  }

  return (
    <div className="h-[90px] w-[100vw] fixed bottom-0 z-50 bg-custom-white">
      {/* <Slider defaultValue={(currentTimeline / duration) * 100} className="h-1 w-full text-custom-sky" thumbClassName={`[&::-webkit-slider-thumb]:bg-custom-sky [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 ${"w-[" + (currentTimeline / duration) * 100 + "vw]"}`} /> */}
      <Slider defaultValue={50} className="h-1 w-full text-custom-sky" thumbClassName={`[&::-webkit-slider-thumb]:bg-custom-sky [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 ${"w-[" + (currentTimeline / duration) * 100 + "vw]"}`} />
      <div className="flex gap-6 h-full w-full justify-between px-10">
        <div className="flex self-center w-[400px]">
          <FaListUl variant="gradient" className="text-custom-sky cursor-pointer rounded-lg text-3xl p-1.5 bg-custom-sky bg-opacity-20" onClick={() => {dispatch(togglePlaylist())}} />
          <BiFolder className={`self-center ml-6 ${selectedMedia?.filename?.length ? "" : "hidden"}`} />
          <p className="self-center ml-3 text-sm">{ selectedMedia?.filename }</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1.5 w-[260px]">
            <BiSolidVolume className="text-custom-medium-gray text-lg cursor-pointer" />
            <Slider defaultValue={50} className="h-0.5 w-36 text-custom-sky" thumbClassName="[&::-webkit-slider-thumb]:bg-custom-sky [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2" />
            <BiSolidVolumeFull className="text-custom-medium-gray text-lg cursor-pointer" />
          </div>
          <div className="flex items-center gap-10 mr-[46px] ml-[42px]">
            <AiFillBackward className="text-custom-medium-gray text-2xl cursor-pointer" />
            <BsPlayCircleFill className="text-custom-sky text-5xl cursor-pointer" />
            <AiFillForward className="text-custom-medium-gray text-2xl cursor-pointer" />
          </div>
          <p className="text-custom-black text-[13px] self-center w-[260px]">03:26/05:20</p>
        </div>
        <div className="flex gap-2 items-center w-[400px] justify-end">
          <p className=" text-sm">Frames Speed</p>
          <div className="flex items-center border-[1px] rounded border-custom-light-gray select-none">
            <p onClick={clickMinusFrameSpeed} className="border-r-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[34px] h-[34px] rounded flex items-center justify-center">-</p>
            <p className="w-8 items-center justify-center flex">{ frameSpeed }</p>
            <p onClick={clickPlusFrameSpeed} className="border-l-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[34px] h-[34px] rounded flex items-center justify-center">+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TMediaController;
import { useEffect, useState } from "react";

import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
const PrettoSlider = styled(Slider)({
  color: '#4489FE',
  height: 4,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 12,
    width: 12,
  },
  '& .MuiSlider-valueLabel': {
    color: '#000000',
    backgroundColor: '#FFFFFF',
    boxShadow: "0 0 4px #d9d9d9",
  },
});

// icons
import { BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { AiFillBackward, AiFillForward } from "react-icons/ai";
import { BiSolidVolume, BiSolidVolumeFull, BiFolder } from "react-icons/bi";
import { FaListUl } from "react-icons/fa";

// constant
import { secToTimeFormat, setMinimumFractionFormat, isEmpty } from "@/utils/Functions";

const DVMediaController = (props) => {
  const {
    togglePlaylist,
    className,
    mediaRef,
    onClickPrevMedia,
    onClickNextMedia,
    mediaName,
    onChangeTSlider,
    currentTime,
    isPlaying,
    setIsPlaying,
    mediaDur,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    onSeekMouseDown,
    onSeekMouseUp
  } = props;

  const [currentTimePercent, setCurrentTimePercent] = useState(0); // timeslide's percent, 0 ~ 100
  
  const onClickMinusPlaybackRate = () => {
    if (playbackRate <= 0.4) return;
    setPlaybackRate(playbackRate - 0.2);
  }

  const onClickPlusPlaybackRate = () => {
    if (playbackRate >= 4) return;
    setPlaybackRate(playbackRate + 0.2);
  }

  const onChangeCurrentTimePercent = (e, val) => {
    setCurrentTimePercent(val);
    onChangeTSlider(val / 100 * mediaDur)
  }
 
  useEffect(() => {
    if (isEmpty(mediaDur) || isEmpty(currentTime)) return;
    setCurrentTimePercent(currentTime / mediaDur * 100);
  }, [currentTime, mediaDur]);

  return (
    <div className={className}>
      <PrettoSlider
        valueLabelDisplay="auto"
        style={{ position: 'absolute', padding: '0'}}
        value={currentTimePercent}
        onChange={onChangeCurrentTimePercent}
        onMouseDown={onSeekMouseDown}
        onMouseUp={onSeekMouseUp}
        getAriaValueText={() => secToTimeFormat(currentTime, true)}
        valueLabelFormat={() => secToTimeFormat(currentTime, true)}
      />
      <div className="gap-6 h-full w-full grid grid-flow-col justify-stretch px-10 laptop:grid miniPhone:hidden">
        <div className="flex self-center">
          <FaListUl variant="gradient" className="self-center text-custom-sky cursor-pointer rounded-lg w-[30px] h-[30px] p-1.5 bg-custom-sky bg-opacity-20" onClick={togglePlaylist} />
          <BiFolder className={`w-[20px] h-[20px] self-center ml-6 ${ mediaName?.length ? "" : "hidden"}`} />
          <p className="self-center ml-3 text-sm">{ mediaName }</p>
        </div>
        <div className="flex gap-10 ">
          <div className="flex items-center gap-1.5 w-48">
            <BiSolidVolume className="text-custom-medium-gray text-lg cursor-pointer"  onClick={() => setVolume(0)}/>
            <PrettoSlider
              valueLabelDisplay="auto"
              value={Math.ceil(volume * 100)}
              onChange={(e, val) => setVolume(val / 100)}
            />
            <BiSolidVolumeFull className="text-custom-medium-gray text-lg cursor-pointer" onClick={() => setVolume(1)}/>
          </div>
          <div className="flex items-center gap-6">
            <AiFillBackward className="text-custom-medium-gray text-2xl cursor-pointer" onClick={onClickPrevMedia} />
            {isPlaying ? <BsPauseCircleFill className="text-custom-sky text-5xl cursor-pointer" onClick={() => { setIsPlaying(false); }} /> : <BsPlayCircleFill className="text-custom-sky text-5xl cursor-pointer" onClick={() => { setIsPlaying(true); }} />}
            <AiFillForward className="text-custom-medium-gray text-2xl cursor-pointer" onClick={onClickNextMedia}/>
          </div>
          <p className="text-custom-black text-[13px] self-center">{secToTimeFormat(currentTime, true)}/{ secToTimeFormat(mediaDur, true) }</p>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <p className=" text-sm">Frames Speed</p>
          <div className="flex items-center border-[1px] rounded border-custom-light-gray select-none">
            <p onClick={onClickMinusPlaybackRate} className="border-r-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[34px] h-[34px] rounded flex items-center justify-center">-</p>
            <p className="w-8 items-center justify-center flex text-sm">{ setMinimumFractionFormat(playbackRate) }</p>
            <p onClick={onClickPlusPlaybackRate} className="border-l-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[34px] h-[34px] rounded flex items-center justify-center">+</p>
          </div>
        </div>
      </div>
      <div className="py-4 gap-6 h-full w-full laptop:hidden">
        <div className="flex justify-between px-10 gap-2">
          <div className="flex self-center overflow-hidden">
            <FaListUl variant="gradient" className="self-center text-custom-sky cursor-pointer rounded-lg w-[30px] h-[30px] p-1.5 bg-custom-sky bg-opacity-20" onClick={togglePlaylist} />
            <BiFolder className={`w-[20px] h-[20px] self-center ml-6 ${ mediaName?.length ? "" : "hidden"}`} />
            <p className="self-center ml-3 text-xs md:text-sm overflow-hidden text-ellipsis whitespace-nowrap">{ mediaName }</p>
          </div>
          <div className="flex gap-2 items-center justify-end">
            <p className=" text-xs md:text-sm">Frames Speed</p>
            <div className="flex items-center border-[1px] rounded border-custom-light-gray select-none">
              <p onClick={onClickMinusPlaybackRate} className="border-r-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[25px] h-[25px] md:w-[34px] md:h-[34px] rounded flex items-center justify-center">-</p>
              <p className="w-8 items-center justify-center flex text-xs md:text-sm">{ setMinimumFractionFormat(playbackRate) }</p>
              <p onClick={onClickPlusPlaybackRate} className="border-l-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[25px] h-[25px] md:w-[34px] md:h-[34px] rounded flex items-center justify-center">+</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-10">
          <div className="flex items-center gap-1.5 w-40">
            <BiSolidVolume className="text-custom-medium-gray text-sm cursor-pointer"  onClick={() => setVolume(0)}/>
            <PrettoSlider
              valueLabelDisplay="auto"
              value={volume}
              onChange={(e, val) => setVolume(val)}
            />
            <BiSolidVolumeFull className="text-custom-medium-gray text-sm cursor-pointer" onClick={() => setVolume(100)}/>
          </div>
          <div className="flex items-center gap-6">
            <AiFillBackward className="text-custom-medium-gray text-xl cursor-pointer" onClick={onClickPrevMedia} />
            {isPlaying ? <BsPauseCircleFill className="text-custom-sky text-4xl cursor-pointer" onClick={() => { setIsPlaying(false); }} /> : <BsPlayCircleFill className="text-custom-sky text-4xl cursor-pointer" onClick={() => { setIsPlaying(true); }} />}
            <AiFillForward className="text-custom-medium-gray text-xl cursor-pointer" onClick={onClickNextMedia}/>
          </div>
          <p className="text-custom-black text-xs self-center md:text-sm">{secToTimeFormat(currentTime, true)}/{ secToTimeFormat(mediaDur, true) }</p>
        </div>
      </div>
    </div>
  );
};

export default DVMediaController;
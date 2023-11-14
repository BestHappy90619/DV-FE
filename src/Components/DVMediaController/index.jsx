import { useEffect, useState } from "react";

// redux
import {useSelector, useDispatch } from "react-redux";
import { setIsPlaying, setSelectedMediaId, setFrameSpeed, setVolume } from "@/redux-toolkit/reducers/Media";

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
import { EventBus, getIndexFromArr, getItemFromArr, msToTime, setMinimumFractionFormat } from "@/utils/Functions";
import { TIME_SLIDE_DRAG, TIME_UPDATE_OUTSIDE } from "@/utils/Constant";

const DVMediaController = (props) => {
  const dispatch = useDispatch();
  const { togglePlaylist, className } = props;

  const { selectedMediaId, medias, isPlaying, frameSpeed, volume, currentTime } = useSelector((state) => state.media);

  const [currentTimePercent, setCurrentTimePercent] = useState(0); // timeslide's percent, 0 ~ 100
  
  const onClickMinusFrameSpeed = () => {
    let frameSpeedNum = frameSpeed * 1;
    frameSpeedNum -= 0.2;
    if (frameSpeedNum < 0.4) frameSpeedNum = 0.4;
    dispatch(setFrameSpeed(setMinimumFractionFormat(frameSpeedNum)));
  }

  const onClickPlusFrameSpeed = () => {
    let frameSpeedNum = frameSpeed * 1;
    frameSpeedNum += 0.2;
    if (frameSpeedNum > 4) frameSpeedNum = 4;
    dispatch(setFrameSpeed(setMinimumFractionFormat(frameSpeedNum)));
  }

  const onClickPrevMedia = () => {
    let selMIndex = getIndexFromArr(medias, "fileId", selectedMediaId);
    if (selMIndex < 1) return;
    dispatch(setSelectedMediaId(medias[selMIndex - 1].fileId));
  }

  const onClickNextMedia = () => {
    let selMIndex = getIndexFromArr(medias, "fileId", selectedMediaId);
    if (selMIndex == medias.length - 1 || selMIndex == -1) return;
    dispatch(setSelectedMediaId(medias[selMIndex + 1].fileId));
  }

  const onChangeCurrentTimePercent = (e, val) => {
    if (selectedMediaId == "") return;
    setCurrentTimePercent(val);
    EventBus.dispatch(TIME_UPDATE_OUTSIDE, { time: val / 100 * getItemFromArr(medias, "fileId", selectedMediaId)?.duration });
    EventBus.dispatch(TIME_SLIDE_DRAG);
  }

  useEffect(() => {
    if (!medias.length) return;
    if (selectedMediaId == "") {
      setCurrentTimePercent(0);
      return;
    }
    setCurrentTimePercent(currentTime / getItemFromArr(medias, "fileId", selectedMediaId)?.duration * 100);
  }, [currentTime]);

  return (
    <div className={className}>
      <PrettoSlider
        valueLabelDisplay="auto"
        style={{ position: 'absolute', padding: '0 0 12px 0'}}
        value={currentTimePercent}
        getAriaValueText={() => msToTime(currentTime, true)}
        valueLabelFormat={() => msToTime(currentTime, true)}
        onChange={onChangeCurrentTimePercent}
      />
      <div className="flex gap-6 h-full w-full justify-between px-10">
        <div className="flex self-center w-[400px]">
          <FaListUl variant="gradient" className="text-custom-sky cursor-pointer rounded-lg text-3xl p-1.5 bg-custom-sky bg-opacity-20" onClick={togglePlaylist} />
          <BiFolder className={`self-center ml-6 ${ getItemFromArr(medias, "fileId", selectedMediaId)?.fileName?.length ? "" : "hidden"}`} />
          <p className="self-center ml-3 text-sm">{ getItemFromArr(medias, "fileId", selectedMediaId)?.fileName }</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1.5 w-[260px]">
            <BiSolidVolume className="text-custom-medium-gray text-lg cursor-pointer"  onClick={() => dispatch(setVolume(0))}/>
            <PrettoSlider
              valueLabelDisplay="auto"
              value={volume}
              onChange={(e, val) => dispatch(setVolume(val))}
            />
            <BiSolidVolumeFull className="text-custom-medium-gray text-lg cursor-pointer" onClick={() => dispatch(setVolume(100))}/>
          </div>
          <div className="flex items-center gap-10 mr-[46px] ml-[42px]">
            <AiFillBackward className="text-custom-medium-gray text-2xl cursor-pointer" onClick={onClickPrevMedia} />
            {isPlaying ? <BsPauseCircleFill className="text-custom-sky text-5xl cursor-pointer" onClick={() => selectedMediaId == "" ? "" : dispatch(setIsPlaying(false))} /> : <BsPlayCircleFill className="text-custom-sky text-5xl cursor-pointer" onClick={() => selectedMediaId == "" ? "" : dispatch(setIsPlaying(true))}/>}
            <AiFillForward className="text-custom-medium-gray text-2xl cursor-pointer" onClick={onClickNextMedia}/>
          </div>
          <p className="text-custom-black text-[13px] self-center w-[260px]">{msToTime(currentTime, true)}/{ selectedMediaId == "" ? "00:00" : msToTime(getItemFromArr(medias, "fileId", selectedMediaId)?.duration, true) }</p>
        </div>
        <div className="flex gap-2 items-center w-[400px] justify-end">
          <p className=" text-sm">Frames Speed</p>
          <div className="flex items-center border-[1px] rounded border-custom-light-gray select-none">
            <p onClick={onClickMinusFrameSpeed} className="border-r-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[34px] h-[34px] rounded flex items-center justify-center">-</p>
            <p className="w-8 items-center justify-center flex">{ frameSpeed }</p>
            <p onClick={onClickPlusFrameSpeed} className="border-l-[1px] border-custom-light-gray cursor-pointer bg-custom-white w-[34px] h-[34px] rounded flex items-center justify-center">+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DVMediaController;
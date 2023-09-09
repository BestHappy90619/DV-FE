import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTimeline, setDuration } from "../../../redux-toolkit/reducers/Media";

// components
import TEditor from "@/Components/TEditor";

import { MEDIA_TYPE_VIDEO, MEDIA_TYPE_AUDIO, RESIZED_WINDOW, RESIZED_SIDEBAR, RESIZED_FUNCTION_BAR } from "@/utils/constant";
import { EventBus } from "@/utils/function";

const Home = () => {
  const dispatch = useDispatch();
  const videoRef = useRef();
  const homeRef = useRef();
  var video = videoRef.current;

  const { selectedMedia, showMedia, mediaSide, currentTimeline, duration } = useSelector((state) => state.media);

  const [videoWidth, setVideoWidth] = useState(0);

  // handle video/audio tag event
  useEffect(() => {

    function handleTimeUpdate() {
      dispatch(setCurrentTimeline(video.currentTime)) 
      dispatch(setDuration(video.duration)) 
        // timeline.value = video.currentTime;
    }

    if(video) {
        video.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
        if(video) {
            video.removeEventListener("timeupdate", handleTimeUpdate);
        }
    };
  }, []);

  const handleResize = () => {
    var videoTagWidth = videoRef.current?.clientWidth == undefined ? 0 : videoRef.current.clientWidth;
    var homeWidth = homeRef.current?.clientWidth == undefined ? 0 : homeRef.current.clientWidth;
    setVideoWidth(videoTagWidth);
    EventBus.dispatch(RESIZED_FUNCTION_BAR, homeWidth - videoTagWidth);
  }

  // handle home resize event
  useEffect(() => {

    // Listener to trigger sidebar resize event
    EventBus.on(RESIZED_SIDEBAR, handleResize);

    // Attach the event listener to the window object
    window.addEventListener(RESIZED_WINDOW, handleResize);

    // Remove the event listeners when the component unmounts
    return () => {
      window.removeEventListener(RESIZED_WINDOW, handleResize);
      EventBus.remove(RESIZED_SIDEBAR, handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  },[showMedia])

  return (
    <div ref={homeRef} className={`flex ${mediaSide ? "" : "flex-row-reverse"}`}>
      <video ref={videoRef} src={selectedMedia.type == MEDIA_TYPE_VIDEO && showMedia? selectedMedia.path : ""} className={`fixed ${mediaSide ? "pl-10 pr-6" : "pl-6 pr-10"} w-96 h-72 ${selectedMedia.type == MEDIA_TYPE_VIDEO && showMedia ? "" : "hidden"}`}/>
      <audio src={selectedMedia.type == MEDIA_TYPE_AUDIO ? selectedMedia.path : ""} className={`hidden`} />
      <div style={{padding: showMedia ? mediaSide ? "0 0 0 " + videoWidth + "px" : "0 " + videoWidth + "px 0 0" : ""}}>
        <TEditor />
      </div>
    </div>
  );
};

export default Home;
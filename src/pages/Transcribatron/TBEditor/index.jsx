import { useEffect, useRef, useState } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTime, setIsPlaying, setMedias, setSelectedMediaId } from "@/redux-toolkit/reducers/Media";

import TEditor from "@/pages/Transcribatron/TBEditor/TEditor";

// sidebars
import DVNoteSideBar from "@/Components/DVNoteSidebar";
import DVPlaylistSidebar from "@/Components/DVPlaylistSidebar";
import DVSearchSideBar from "@/Components/DVSearchSidebar";

// components
import DVResizeablePanel from "@/Components/DVResizeablePanel";
import DVMediaController from "@/Components/DVMediaController";

// Toast
import { toast } from "react-hot-toast";

// utils
import { MEDIA_TYPE_VIDEO, MEDIA_TYPE_AUDIO, RESIZED_WINDOW, TIME_UPDATE_OUTSIDE, MEDIA_TIME_UPDATE, SET_LOADING, NOTE_SIDEBAR, PLAYLIST_SIDEBAR, SEARCH_SIDEBAR, KEY_DOWN, STATUS_TRANSCRIBED } from "@/utils/Constant";
import { EventBus, getItemFromArr } from "@/utils/Functions";

// services
import MediaService from "@/services/media";

const TBEditor = () => {
  const dispatch = useDispatch();

  const videoRef = useRef();
  const audioRef = useRef();
  const isUpdatedFromOutside = useRef(false);

  const {  minWidth, maxWidth, defaultWidth, mainMax, mainMin } = useSelector((state) => state.sidebar);
  const { selectedMediaId, showMedia, mediaSide, medias, isPlaying, frameSpeed, volume, autoPlay } = useSelector((state) => state.media);

  // show sidebar as per order(+: left sidebar order, -: right sidebar order 1/-1: hidden)
  const [playlistOrder, setPlaylistOrder] = useState(2);
  const [noteOrder, setNoteOrder] = useState(-2);
  const [searchOrder, setSearchOrder] = useState(1);
  const [editorResized, setEditorResized] = useState();
  const [rSdebarWidth, setRSdebarWidth] = useState();
  const [lSdebarWidth, setLSdebarWidth] = useState();
  const [isFlex, setIsFlex] = useState();
  const [windowMinWidth, setWindowMinWidth] = useState();
  
  const getMaxOrder = (playlistOrder, noteOrder, searchOrder) => {
    return playlistOrder > noteOrder ?
      playlistOrder > searchOrder ? playlistOrder : searchOrder
      :
      noteOrder > searchOrder ? noteOrder : searchOrder;
  }

  const getMinOrder = (playlistOrder, noteOrder, searchOrder) => {
    return playlistOrder < noteOrder ?
      playlistOrder < searchOrder ? playlistOrder : searchOrder
      :
      noteOrder < searchOrder ? noteOrder : searchOrder;
  }

  const togglePlaylist = () => {
    let newOrder = 1;
    // change order
    let oldOrder = playlistOrder;
    let minOrder = getMinOrder(oldOrder, noteOrder, searchOrder);
    let maxOrder = getMaxOrder(oldOrder, noteOrder, searchOrder);
    if (oldOrder < -1) oldOrder > minOrder ? newOrder = minOrder - 1 : newOrder = -1
    else if (oldOrder > 1) oldOrder < maxOrder ? newOrder = maxOrder + 1 : newOrder = 1
    else if (oldOrder == -1) newOrder = minOrder - 1;
    else if (oldOrder == 1) newOrder = maxOrder + 1;

    setPlaylistOrder(newOrder);
  }

  const toggleNote = () => {
    let newOrder = 1;
    // change order
    let oldOrder = noteOrder;
    let minOrder = getMinOrder(playlistOrder, oldOrder, searchOrder);
    let maxOrder = getMaxOrder(playlistOrder, oldOrder, searchOrder);
    if (oldOrder < -1) oldOrder > minOrder ? newOrder = minOrder - 1 : newOrder = -1
    else if (oldOrder > 1) oldOrder < maxOrder ? newOrder = maxOrder + 1 : newOrder = 1
    else if (oldOrder == -1) newOrder = minOrder - 1;
    else if (oldOrder == 1) newOrder = maxOrder + 1;

    setNoteOrder(newOrder);
  }

  const toggleSearch = () => {
    let newOrder = 1;
    // change order
    let oldOrder = searchOrder;      
    let minOrder = getMinOrder(playlistOrder, noteOrder, oldOrder);
    let maxOrder = getMaxOrder(playlistOrder, noteOrder, oldOrder);
    if (oldOrder < -1) oldOrder > minOrder ? newOrder = minOrder - 1 : newOrder = -1
    else if (oldOrder > 1) oldOrder < maxOrder ? newOrder = maxOrder + 1 : newOrder = 1
    else if (oldOrder == -1) newOrder = minOrder - 1;
    else if (oldOrder == 1) newOrder = maxOrder + 1;
    
    setSearchOrder(newOrder);
  }

  const togglePlaylistSidebarPosition = () => {
    let newOrder = 1;
    let oldOrder = playlistOrder;
    if (Math.abs(oldOrder) == 1) newOrder = oldOrder * -1;
    else if (oldOrder < -1) {
      newOrder = getMaxOrder(oldOrder * -1, noteOrder, searchOrder) + 1;
    } else if (oldOrder > 1) {
      newOrder = getMinOrder(oldOrder * -1, noteOrder, searchOrder) - 1;
    }

    setPlaylistOrder(newOrder);
  }

  const toggleNoteSidebarPosition = () => {
    let newOrder = 1;
    let oldOrder = noteOrder;
    if (Math.abs(oldOrder) == 1) newOrder = oldOrder * -1;
    else if (oldOrder < -1) {
      newOrder = getMaxOrder(playlistOrder, oldOrder * -1, searchOrder) + 1;
    } else if (oldOrder > 1) {
      newOrder = getMinOrder(playlistOrder, oldOrder * -1, searchOrder) - 1;
    }

    setNoteOrder(newOrder);
  }

  const toggleSearchSidebarPosition = () => {
    let newOrder = 1;
    let oldOrder = searchOrder;
    if (Math.abs(oldOrder) == 1) newOrder = oldOrder * -1;
    else if (oldOrder < -1) {
      newOrder = getMaxOrder(playlistOrder, noteOrder, oldOrder * -1) + 1;
    } else if (oldOrder > 1) {
      newOrder = getMinOrder(playlistOrder, noteOrder, oldOrder * -1) - 1;
    }

    setSearchOrder(newOrder);
  }
  
  useEffect(() => {
    function onKeyDown(e) {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        // open searchbar: F3 || ctrl + f
        e.preventDefault();
        toggleSearch();
      }
    }
    window.addEventListener(KEY_DOWN, onKeyDown);

    return () => {
      window.removeEventListener(KEY_DOWN, onKeyDown);
    };
  }, [playlistOrder, noteOrder, searchOrder])
  
  useEffect(() => {
    EventBus.dispatch(SET_LOADING, true);
    MediaService.getAllMedias()
      .then((res) => {
        if (res.status == 200) {
          let data = res.data.data;
          let totalRes = [];
          data.map(item => {
            if (item?.status === STATUS_TRANSCRIBED) totalRes.push(item)
          })
          dispatch(setMedias(totalRes))
          dispatch(setSelectedMediaId(totalRes[0].fileId));
        } else {
          toast.error("Sorry, but an error has been ocurred while getting media list!");
        }
        EventBus.dispatch(SET_LOADING, false);
      })
      .catch((err) => {
        toast.error("Sorry, but an error has been ocurred while getting media list!");
        EventBus.dispatch(SET_LOADING, false);
      });
  }, [])

  const getLeftSidebar = () => {
    return playlistOrder > noteOrder ? playlistOrder > searchOrder ? PLAYLIST_SIDEBAR : SEARCH_SIDEBAR : noteOrder > searchOrder ? NOTE_SIDEBAR : SEARCH_SIDEBAR;
  }

  const getRightSidebar = () => {
    return playlistOrder < noteOrder ? playlistOrder < searchOrder ? PLAYLIST_SIDEBAR : SEARCH_SIDEBAR : noteOrder < searchOrder ? NOTE_SIDEBAR : SEARCH_SIDEBAR;
  }

  const handleResize = () => {
    let isFlex = (window.innerWidth - rSdebarWidth - lSdebarWidth - (getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO && showMedia ? 384 : 0)) > mainMin;
    setIsFlex(isFlex);
    setWindowMinWidth(mainMin + rSdebarWidth + lSdebarWidth + (getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO && showMedia ? isFlex ? 384 : 0 : 0));
    setEditorResized(new Date().getTime());
  }

  // handle event
  useEffect(() => {

    // Attach the event listener to the window object
    window.addEventListener(RESIZED_WINDOW, handleResize);

    // handle video/audio timeupdate event
    function onVideoTimeUpdate() {
      if (!isUpdatedFromOutside.current) {
        let time = videoRef.current.currentTime
        if (time == videoRef.current.duration) {
          dispatch(setCurrentTime(0))
          dispatch(setIsPlaying(false));
          return;
        }
        dispatch(setCurrentTime(time));
      } else {
        isUpdatedFromOutside.current = false;
      }
    }
    videoRef.current.addEventListener(MEDIA_TIME_UPDATE, onVideoTimeUpdate);

    function onAudioTimeUpdate() {
      if (!isUpdatedFromOutside.current) {
        let time = audioRef.current.currentTime
        if (time == audioRef.current.duration) {
          dispatch(setCurrentTime(0))
          dispatch(setIsPlaying(false));
          return;
        }
        dispatch(setCurrentTime(time));
      } else {
        isUpdatedFromOutside.current = false;
      }
    }
    audioRef.current.addEventListener(MEDIA_TIME_UPDATE, onAudioTimeUpdate);

    function onTimeUpdateOutside(data) {
      let { time } = data;
      if (selectedMediaId == "") return;
      let mediaRef = getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO ? videoRef : audioRef;
      if (!mediaRef.current) return;
      isUpdatedFromOutside.current = true;
      mediaRef.current.currentTime = time;
      dispatch(setCurrentTime(time));
      if (time == mediaRef?.current.duration) dispatch(setIsPlaying(false));
    }
    EventBus.on(TIME_UPDATE_OUTSIDE, onTimeUpdateOutside)

    // Remove the event listeners when the component unmounts
    return () => {
      window.removeEventListener(RESIZED_WINDOW, handleResize);
      videoRef?.current?.removeEventListener(MEDIA_TIME_UPDATE, onVideoTimeUpdate);
      audioRef?.current?.removeEventListener(MEDIA_TIME_UPDATE, onAudioTimeUpdate);
      EventBus.remove(TIME_UPDATE_OUTSIDE, onTimeUpdateOutside);
    };
  }, [medias]);

  useEffect(() => {
    handleResize();
  }, [showMedia, rSdebarWidth, lSdebarWidth]);

  useEffect(() => {
    handleResize();
    dispatch(setIsPlaying(autoPlay));
  }, [selectedMediaId]);

  useEffect(() => {
    if (selectedMediaId == "") return;
    isPlaying ? getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO ? videoRef.current.play() : audioRef.current.play() : getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO ? videoRef.current.pause() : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (selectedMediaId == "") return;
    getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO ? videoRef.current.playbackRate = frameSpeed : audioRef.current.playbackRate = frameSpeed;
  }, [frameSpeed]);

  useEffect(() => {
    if (selectedMediaId == "") return;
    getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO ? videoRef.current.volume = volume / 100 : audioRef.current.volume = volume / 100;
  }, [volume]);

  return (
    <>
      <DVResizeablePanel
        leftSidebar={
          <>
            <div className={`${getLeftSidebar() === PLAYLIST_SIDEBAR ? "" : "hidden"} select-none`}><DVPlaylistSidebar close={togglePlaylist} /></div>
            <div className={`${getLeftSidebar() === NOTE_SIDEBAR ? "" : "hidden"} select-none`}><DVNoteSideBar close={toggleNote} /></div>
            <div className={`${getLeftSidebar() === SEARCH_SIDEBAR ? "" : "hidden"} select-none`}><DVSearchSideBar close={toggleSearch} /></div>
          </>
        }
        rightSidebar={
          <>
            <div className={`${getRightSidebar() === PLAYLIST_SIDEBAR ? "" : "hidden"} select-none`}><DVPlaylistSidebar close={togglePlaylist} /></div>
            <div className={`${getRightSidebar() === NOTE_SIDEBAR ? "" : "hidden"} select-none`}><DVNoteSideBar close={toggleNote} /></div>
            <div className={`${getRightSidebar() === SEARCH_SIDEBAR ? "" : "hidden"} select-none`}><DVSearchSideBar close={toggleSearch} /></div>
          </>
        }
        showLeftSidebar={(playlistOrder > 1 || noteOrder > 1 || searchOrder > 1)}
        showRightSidebar={(playlistOrder < -1 || noteOrder < -1 || searchOrder < -1)}
        sidebarMinWidth={minWidth}
        sidebarMaxWidth={maxWidth}
        sidebarDefaultWidth={defaultWidth}
        getRSdebarWidth={setRSdebarWidth}
        getLSdebarWidth={setLSdebarWidth}
        className="pt-[82px] pb-[122px]"
        minWidth={windowMinWidth}
      >
        <div className={` ${isFlex ? "flex" : ""} ${mediaSide ? "" : "flex-row-reverse"} select-none justify-center`}>
          <div
            className={`sticky top-[82px] self-start pt-8 bg-white ${isFlex ? "" : "flex justify-center"} ${mediaSide ? "pl-10 pr-6" : "pl-6 pr-10"} ${getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO && showMedia ? "" : "hidden"}`}
            style={{position: '-webkit-sticky'}}
          >
            <video
              ref={videoRef}
              src={getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO ? getItemFromArr(medias, "fileId", selectedMediaId)?.previewURL : ""}
              className="min-w-[380px] min-h-[180px] max-w-[380px] max-h-[180px]"
            />
          </div>
          <audio ref={audioRef} src={getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_AUDIO ? getItemFromArr(medias, "fileId", selectedMediaId)?.previewURL : ""} className={`hidden`} />
          {/* <div className={`${getItemFromArr(medias, "fileId", selectedMediaId)?.mediaType == MEDIA_TYPE_VIDEO && showMedia ? mediaSide ? "pl-[384px]" : "pr-[384px]" : ""}`}> */}
          <TEditor
            toggleNote={toggleNote}
            toggleSearch={toggleSearch}
            playlistOrder={playlistOrder}
            noteOrder={noteOrder}
            searchOrder={searchOrder}
            togglePlaylistSidebarPosition={togglePlaylistSidebarPosition}
            toggleNoteSidebarPosition={toggleNoteSidebarPosition}
            toggleSearchSidebarPosition={toggleSearchSidebarPosition}
            editorResized={editorResized}
            setEditorResized={setEditorResized}
            isFlex={isFlex}
          />
        </div>
      </DVResizeablePanel>

      <DVMediaController togglePlaylist={togglePlaylist} className="h-[90px] w-[100%] fixed bottom-0 z-50 bg-custom-white select-none"/>
    </>
  );
};

export default TBEditor;
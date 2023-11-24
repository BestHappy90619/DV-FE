import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTime, setIsPlaying } from "@/redux-toolkit/reducers/Media";

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
import { MEDIA_TYPE_VIDEO, MEDIA_TYPE_AUDIO, RESIZED_WINDOW, TIME_UPDATE_OUTSIDE, MEDIA_TIME_UPDATE, SET_LOADING, NOTE_SIDEBAR, PLAYLIST_SIDEBAR, SEARCH_SIDEBAR, KEY_DOWN, STATUS_TRANSCRIBED, TIME_SLIDE_DRAG } from "@/utils/Constant";
import { EventBus, getIndexFromArr, getItemFromArr } from "@/utils/Functions";

// services
import MediaService from "@/services/media";

const TBEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fileId } = useParams();

  const videoRef = useRef();
  const audioRef = useRef();
  const isUpdatedFromOutside = useRef(false);

  const { minWidth, maxWidth, defaultWidth, mainMax, mainMin } = useSelector((state) => state.sidebar);
  const { showMedia, mediaSide, isPlaying, autoPlay, currentTime } = useSelector((state) => state.media);

  // show sidebar as per order(+: left sidebar order, -: right sidebar order 1/-1: hidden)
  const [playlistOrder, setPlaylistOrder] = useState(2);
  const [noteOrder, setNoteOrder] = useState(-2);
  const [searchOrder, setSearchOrder] = useState(1);
  const [editorResized, setEditorResized] = useState();
  const [rSdebarWidth, setRSdebarWidth] = useState();
  const [lSdebarWidth, setLSdebarWidth] = useState();
  const [isFlex, setIsFlex] = useState();
  const [windowMinWidth, setWindowMinWidth] = useState();
  const [medias, setMedias] = useState([]);
  const [selMediaIndex, setSelMediaIndex] = useState(-1);
  
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

  const getLeftSidebar = () => {
    return playlistOrder > noteOrder ? playlistOrder > searchOrder ? PLAYLIST_SIDEBAR : SEARCH_SIDEBAR : noteOrder > searchOrder ? NOTE_SIDEBAR : SEARCH_SIDEBAR;
  }

  const getRightSidebar = () => {
    return playlistOrder < noteOrder ? playlistOrder < searchOrder ? PLAYLIST_SIDEBAR : SEARCH_SIDEBAR : noteOrder < searchOrder ? NOTE_SIDEBAR : SEARCH_SIDEBAR;
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
          if (totalRes.length > 0) {
            if (fileId === undefined) {
              navigate('/' + totalRes[0].fileId);
            } else {
              setMedias(totalRes);
              let selInd = getIndexFromArr(totalRes, "fileId", fileId);
              if (selInd === -1) toast.error("Not found selected media!");
              else setSelMediaIndex(selInd);
            }
          } else {
            toast.error("No Media!");
          }
        } else {
          toast.error("Sorry, but an error has been ocurred while getting media list!");
        }
        EventBus.dispatch(SET_LOADING, false);
      })
      .catch((err) => {
        toast.error("Sorry, but an error has been ocurred while getting media list!");
        EventBus.dispatch(SET_LOADING, false);
      });
  }, [fileId])

  const handleResize = () => {
    let isFlex = (window.innerWidth - rSdebarWidth - lSdebarWidth - 80 - (medias[selMediaIndex]?.mediaType === MEDIA_TYPE_VIDEO && showMedia ? videoRef.current.offsetWidth : 0)) > mainMin;
    setIsFlex(isFlex);
    console.log("minW>>>>>>", mainMin, rSdebarWidth, lSdebarWidth, (medias[selMediaIndex]?.mediaType === MEDIA_TYPE_VIDEO && showMedia ? isFlex ? videoRef.current.offsetWidth : 0 : 0));
    setWindowMinWidth(mainMin + rSdebarWidth + lSdebarWidth + 200 + (medias[selMediaIndex]?.mediaType === MEDIA_TYPE_VIDEO && showMedia ? isFlex ? videoRef.current.offsetWidth : 0 : 0));
    setEditorResized(new Date().getTime());
  }
  
  const onVideoTimeUpdate = () => {
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

  const onAudioTimeUpdate = () => {
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

  // handle event
  useEffect(() => {
    handleResize();
    if (selMediaIndex === -1) return;
    
    dispatch(setIsPlaying(autoPlay));
    dispatch(setCurrentTime(0));

    // Attach the resized event listener to the window object
    window.addEventListener(RESIZED_WINDOW, handleResize);

    function onTimeUpdateOutside(data) {
      if (selMediaIndex === -1) return;
      let { time } = data;
      let mediaRef = medias[selMediaIndex]?.mediaType == MEDIA_TYPE_VIDEO ? videoRef : audioRef;
      if (!mediaRef.current) return;
      isUpdatedFromOutside.current = true;
      mediaRef.current.currentTime = time;
      dispatch(setCurrentTime(time));
      if (time == mediaRef?.current.duration) dispatch(setIsPlaying(false));
    }
    EventBus.on(TIME_UPDATE_OUTSIDE, onTimeUpdateOutside);
    
    // Remove the event listeners when the component unmounts
    return () => {
      window.removeEventListener(RESIZED_WINDOW, handleResize);
      EventBus.remove(TIME_UPDATE_OUTSIDE, onTimeUpdateOutside);
    };
  }, [selMediaIndex]);

  useEffect(() => {
    handleResize();
  }, [showMedia, rSdebarWidth, lSdebarWidth]);

  useEffect(() => {
    if (selMediaIndex == -1) return;
    isPlaying ? medias[selMediaIndex]?.mediaType == MEDIA_TYPE_VIDEO ? videoRef.current.play() : audioRef.current.play() : medias[selMediaIndex]?.mediaType == MEDIA_TYPE_VIDEO ? videoRef.current.pause() : audioRef.current.pause();
  }, [isPlaying]);

  const onClickPrevMedia = () => {
    if (selMediaIndex < 1) return;
    navigate('/' + medias[selMediaIndex - 1].fileId);
  }

  const onClickNextMedia = () => {
    if (selMediaIndex === medias.length - 1 || selMediaIndex == -1) return;
    navigate('/' + medias[selMediaIndex + 1].fileId);
  }

  const onChangeTSlider = (time) => {
    EventBus.dispatch(TIME_UPDATE_OUTSIDE, {time});
    EventBus.dispatch(TIME_SLIDE_DRAG);
  }

  return (
    <>
      <DVResizeablePanel
        leftSidebar={
          <>
            <div className={`${getLeftSidebar() === PLAYLIST_SIDEBAR ? "" : "hidden"} select-none`}><DVPlaylistSidebar medias={medias} selMediaIndex={selMediaIndex} close={togglePlaylist} /></div>
            <div className={`${getLeftSidebar() === NOTE_SIDEBAR ? "" : "hidden"} select-none`}><DVNoteSideBar close={toggleNote} /></div>
            <div className={`${getLeftSidebar() === SEARCH_SIDEBAR ? "" : "hidden"} select-none`}><DVSearchSideBar close={toggleSearch} /></div>
          </>
        }
        rightSidebar={
          <>
            <div className={`${getRightSidebar() === PLAYLIST_SIDEBAR ? "" : "hidden"} select-none`}><DVPlaylistSidebar medias={medias} selMediaIndex={selMediaIndex} close={togglePlaylist} /></div>
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
        <div className={`${selMediaIndex === -1 ? "hidden" : ""} ${isFlex ? "flex" : ""} ${mediaSide ? "" : "flex-row-reverse"} select-none justify-center`}>
          <div
            className={`sticky top-[82px] self-start bg-white ${isFlex ? "" : "flex justify-center"}  pt-8 pb-4`}
            style={{position: '-webkit-sticky'}}
          >
            <video
              ref={videoRef}
              src={medias[selMediaIndex]?.mediaType == MEDIA_TYPE_VIDEO ? medias[selMediaIndex]?.previewURL : ""}
              onTimeUpdate={onVideoTimeUpdate}
              className={`min-w-[380px] min-h-[180px] max-w-[380px] max-h-[180px] ${medias[selMediaIndex]?.mediaType == MEDIA_TYPE_VIDEO && showMedia ? isFlex ? mediaSide ? "pl-10 " : " pr-10" : "" : "hidden"}`}
            />
          </div>
          <audio
            ref={audioRef}
            src={medias[selMediaIndex]?.mediaType == MEDIA_TYPE_AUDIO ? medias[selMediaIndex]?.previewURL : ""}
            onTimeUpdate={onAudioTimeUpdate}
            className={`hidden`}
          />
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

      <DVMediaController
        mediaName={medias[selMediaIndex]?.fileName}
        mediaRef={medias[selMediaIndex]?.mediaType === MEDIA_TYPE_VIDEO ? videoRef : audioRef}
        mediaDur={medias[selMediaIndex]?.duration}
        togglePlaylist={togglePlaylist}
        onClickPrevMedia={onClickPrevMedia}
        onClickNextMedia={onClickNextMedia}
        onChangeTSlider={onChangeTSlider}
        currentTime={currentTime}
        play={isPlaying}
        onChangePlay={(status) => dispatch(setIsPlaying(status))}
        className="h-[90px] w-[100%] fixed bottom-0 z-50 bg-custom-white select-none"
      />
    </>
  );
};

export default TBEditor;
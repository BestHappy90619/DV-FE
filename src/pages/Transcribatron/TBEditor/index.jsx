import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTime, setIsPlaying, toggleMediaSide, setShowMedia } from "@/redux-toolkit/reducers/Media";
import { setZoomTranscriptNum, toggleSpeaker } from "@/redux-toolkit/reducers/Editor";

import TBody from "./TEditor/TBody";

// components
import DVResizeablePanel from "@/Components/DVResizeablePanel";
import DVMediaController from "@/Components/DVMediaController";
import DVNoteSideBar from "@/Components/DVNoteSidebar";
import DVPlaylistSidebar from "@/Components/DVPlaylistSidebar";
import DVSearchSideBar from "@/Components/DVSearchSidebar";

import { toast } from "react-hot-toast";
import { Github } from '@uiw/react-color';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
    Popover,
    PopoverHandler,
    PopoverContent,
    Spinner
} from "@material-tailwind/react";

// icons
import { AiOutlineHighlight, AiOutlineBold, AiOutlineItalic, AiOutlineUnderline, AiOutlineFontColors} from "react-icons/ai";
import { RxDividerVertical } from "react-icons/rx";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import { TbSettingsCode } from "react-icons/tb";
import { BiChevronDown } from "react-icons/bi";
import { IoIosCheckmark } from "react-icons/io";

// utils
import {
  MEDIA_TYPE_VIDEO,
  MEDIA_TYPE_AUDIO,
  RESIZED_WINDOW,
  TIME_UPDATE_OUTSIDE,
  MEDIA_TIME_UPDATE,
  SET_LOADING,
  NOTE_SIDEBAR,
  PLAYLIST_SIDEBAR,
  SEARCH_SIDEBAR,
  KEY_DOWN,
  STATUS_TRANSCRIBED,
  TIME_SLIDE_DRAG,
  DEBUG_MODE,
  BOLD,
  FONT_COLOR,
  HIGHLIGHT_BG,
  ITALIC,
  UNDERLINE,
  MEDIUM_GRAY,
  LISTENING_CHANGES,
  SAVED,
  SAVING
} from "@/utils/Constant";
import { EventBus, getIndexFromArr, getItemFromArr, timestampToDate } from "@/utils/Functions";

// services
import MediaService from "@/services/media";
import ReactHlsPlayer  from "react-hls-player";

const TBEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fileId } = useParams();

  const zoomTranscriptInputRef = useRef();
  const mediaRef = useRef();

  var isUpdatedFromOutside;
  const RES_FULL = 1300;

  const { minWidth, maxWidth, defaultWidth, mainMax, mainMin } = useSelector((state) => state.sidebar);
  const { showMedia, mediaSide, isPlaying, autoPlay, currentTime } = useSelector((state) => state.media);
  const { zoomTranscriptNum, speakerMethod } = useSelector((state) => state.editor); //true: left, false: right

  // show sidebar as per order(+: left sidebar order, -: right sidebar order 1/-1: hidden)
  const [playlistOrder, setPlaylistOrder] = useState(2);
  const [noteOrder, setNoteOrder] = useState(-2);
  const [searchOrder, setSearchOrder] = useState(1);
  const [medias, setMedias] = useState([]);
  const [selMediaIndex, setSelMediaIndex] = useState(-1);
  const [openFontColorPicker, setOpenFontColorPicker] = useState(false);
  const [openHighlightPicker, setOpenHighlightPicker] = useState(false);
  const [openZoomMenu, setOpenZoomMenu] = useState(false);
  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [openInsertMenu, setOpenInsertMenu] = useState(false);
  const [openViewMenu, setOpenViewMenu] = useState(false);
  const [openFunctionBar, setOpenFunctionBar] = useState(true);
  const [zoomTranscript, setZoomTranscript] = useState("100%");
  const [actionStyle, setActionStyle] = useState();
  const [changedFontClr, setChangedFontClr] = useState();
  const [changedHighlightClr, setChangedHighlightClr] = useState();
  const [changeStyle, setChangeStyle] = useState(false);
  const [fontColor, setFontColor] = useState(MEDIUM_GRAY);
  const [highlightBg, setHighlightBg] = useState(MEDIUM_GRAY);
  const [undo, setUndo] = useState(false);
  const [redo, setRedo] = useState(false);
  const [enableUndo, setEnableUndo] = useState(false);
  const [enableRedo, setEnableRedo] = useState(false);
  const [savingStatus, setSavingStatus] = useState();
  const [lastSavedTime, setLastSavedTime] = useState(0);
  const [clickedInsSection, setClickedInsSection] = useState(false);
  const [rsdeWidth, setRSdeWidth] = useState();
  const [lsdeWidth, setLSdeWidth] = useState();
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    // console.log("rsdeWidth, lsdeWidth>>>>", rsdeWidth, lsdeWidth);
    setContentWidth(window.innerWidth - rsdeWidth - lsdeWidth);
  }, [rsdeWidth, lsdeWidth])
  
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
          console.log('medias>>>>>', totalRes);
          totalRes[0].previewURL = 'http://35.224.48.157:8081/files/stream/9a1f388e-66e2-444a-86a2-2b7c756692ae';
          totalRes[1].previewURL = 'http://35.224.48.157:8081/files/stream/ff3a0622-aac7-4b96-ae39-1ca9c63009fd';
          totalRes = totalRes.slice(0, 2);
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

  const onTimeUpdate = () => {
    if (!isUpdatedFromOutside) {
      let time = mediaRef.current.currentTime
      if (time == mediaRef.current.duration) {
        dispatch(setCurrentTime(0))
        dispatch(setIsPlaying(false));
        return;
      }
      dispatch(setCurrentTime(time));
    } else {
      isUpdatedFromOutside = false;
    }
  }

  const onResizedWindow = () => {
    setContentWidth(window.innerWidth - rsdeWidth - lsdeWidth);
  }

  // handle event
  useEffect(() => {
    if (selMediaIndex === -1) return;

    if (autoPlay) mediaRef.current.play()
    else mediaRef.current.pause();
    mediaRef.current.currentTime = 0;
    mediaRef.current.volume = 1;
    mediaRef.current.playbackRate = 1;
    dispatch(setIsPlaying(autoPlay));
    dispatch(setCurrentTime(0));

    window.addEventListener('resize', onResizedWindow);
    
    function onTimeUpdateOutside(data) {
      if (selMediaIndex === -1) return;
      let { time } = data;
      if (!mediaRef.current) return;
      isUpdatedFromOutside = true;
      mediaRef.current.currentTime = time;
      dispatch(setCurrentTime(time));
      if (time == mediaRef?.current.duration) dispatch(setIsPlaying(false));
    }
    EventBus.on(TIME_UPDATE_OUTSIDE, onTimeUpdateOutside);
    
    // Remove the event listeners when the component unmounts
    return () => {
      EventBus.remove(TIME_UPDATE_OUTSIDE, onTimeUpdateOutside);
    };
  }, [selMediaIndex]);

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

  const onKeyDownZoomTranscriptInput = (e) => {
      if (e.key !== 'Enter') return;
      if (/\d/.test(zoomTranscript)) {
          let num = zoomTranscript.match(/\d+/)[0] * 1;
          num = num < 50 ? 50 : num > 200 ? 200 : num;
          dispatch(setZoomTranscriptNum(num));
          setZoomTranscript(num + "%");
      } else {
          setZoomTranscript(zoomTranscriptNum + "%");
      }
  }

  const onFocusZoomTranscriptMenu = () => {
      setTimeout(() => {
          zoomTranscriptInputRef.current.focus();
      }, 100)
  }

  const onBlurZoomTranscriptMenu = () => {
      zoomTranscriptInputRef.current.blur();
  }

  const onClickEditStyle = (actionStyle) => {
      setActionStyle(actionStyle);
      if (actionStyle == FONT_COLOR && fontColor != MEDIUM_GRAY)
          setChangedFontClr(fontColor);
      if (actionStyle == HIGHLIGHT_BG && highlightBg != MEDIUM_GRAY)
          setChangedHighlightClr(highlightBg);
      setChangeStyle(!changeStyle);
  }

  const onChangeFontClr = (clr) => {
      setFontColor(clr.hex);
      setActionStyle(FONT_COLOR);
      setChangedFontClr(clr.hex);
      setChangeStyle(!changeStyle);
  }

  const onChangeHighlightBg = (clr) => {
      setHighlightBg(clr.hex);
      setActionStyle(HIGHLIGHT_BG);
      setChangedHighlightClr(clr.hex);
      setChangeStyle(!changeStyle);
  }

  const onClickInsertSection = () => {
      setClickedInsSection(!clickedInsSection);
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
        setRSdeWidth={setRSdeWidth}
        setLSdeWidth={setLSdeWidth}
        className="pt-[82px] pb-[122px]"
      >
        <div
          className={`${selMediaIndex === -1 ? "hidden" : ""} ${contentWidth > RES_FULL ? mediaSide ? "" : "flex-row-reverse" : "flex-col"} flex select-none justify-center m-auto`}
          style={{maxWidth: mainMax + "px"}}
        >
          <div
            className={`sticky self-start bg-white flex flex-col items-center w-full ${!(medias[selMediaIndex]?.mediaType == MEDIA_TYPE_VIDEO && showMedia) && contentWidth > RES_FULL ? 'hidden' : ""}`}
            style={{position: '-webkit-sticky', top: '82px'}}
          >
            <div className={`${medias[selMediaIndex]?.mediaType == MEDIA_TYPE_VIDEO && showMedia ? "" : "hidden"} pt-4`}>
              <ReactHlsPlayer
                playerRef={mediaRef}
                // src="http://35.224.48.157:8081/files/stream/ff3a0622-aac7-4b96-ae39-1ca9c63009fd"
                src={medias[selMediaIndex]?.previewURL}
                onTimeUpdate={onTimeUpdate}
                className={`min-w-[380px] min-h-[180px] max-w-[380px] max-h-[180px] `}
              />
            </div>
            {
              contentWidth <= RES_FULL ?
                <>
                  <div className={`px-10 justify-items-end self-center grid w-full ${!openFunctionBar ? "" : "hidden"} h-8`}>
                    <MdKeyboardArrowDown onClick={() => setOpenFunctionBar(!openFunctionBar)} className={`self-center transition-transform w-[30px] h-[30px] text-custom-gray cursor-pointer`} />
                  </div>
                  <div className={`sticky bg-white ${openFunctionBar ? "" : "hidden"} w-full z-30`} style={{ top: '82px' }}>
                    <div className={`bg-white flex justify-between py-4 px-10`}>
                      <div className="w-full flex flex-wrap">
                        <div className="flex">
                          <div className="flex gap-4 self-center select-none">
                              <LuUndo2 className={`${enableUndo ? "text-custom-black" : "text-custom-medium-gray"} cursor-pointer`} onClick={() => enableUndo && setUndo(!undo)}/>
                              <LuRedo2 className={`${enableRedo ? "text-custom-black" : "text-custom-medium-gray"} cursor-pointer`} onClick={() => enableRedo && setRedo(!redo)}/>
                          </div>
                          <RxDividerVertical className="text-custom-medium-gray self-center" />
                        </div>
                        <div className="flex">
                          <div className="flex gap-4 self-center select-none">
                              <AiOutlineBold className="text-custom-medium-gray self-center cursor-pointer" onClick={() => onClickEditStyle(BOLD)} />
                              <AiOutlineItalic className="text-custom-medium-gray self-center cursor-pointer" onClick={() => onClickEditStyle(ITALIC)} />
                              <AiOutlineUnderline className="text-custom-medium-gray self-center cursor-pointer" onClick={() => onClickEditStyle(UNDERLINE)} />
                              <div className="flex">
                                  <AiOutlineFontColors onClick={() => onClickEditStyle(FONT_COLOR)} className="cursor-pointer text-custom-medium-gray" style={{color: fontColor}}/>
                                  <Popover placement="bottom-end" open={openFontColorPicker} handler={setOpenFontColorPicker}>
                                      <PopoverHandler>
                                          <button className="flex outline-none text-custom-medium-gray">
                                              <BiChevronDown className={`transition-transform ${openFontColorPicker ? "rotate-180" : ""}`} />
                                          </button>
                                      </PopoverHandler>
                                      <PopoverContent className="z-50 bg-opacity-0 border-opacity-0 shadow-none p-0 pt-2"><Github color={fontColor} onChange={onChangeFontClr} /></PopoverContent>
                                  </Popover>
                              </div>
                              <div className="flex">
                                  <AiOutlineHighlight onClick={() => onClickEditStyle(HIGHLIGHT_BG)} className="cursor-pointer text-custom-medium-gray" style={{color: highlightBg}} />
                                  <Popover placement="bottom-end" open={openHighlightPicker} handler={setOpenHighlightPicker}>
                                      <PopoverHandler>
                                          <button className="flex outline-none text-custom-medium-gray">
                                              <BiChevronDown className={`transition-transform ${openHighlightPicker ? "rotate-180" : ""}`} />
                                          </button>
                                      </PopoverHandler>
                                      <PopoverContent className="z-50 bg-opacity-0 border-opacity-0 shadow-none p-0 pt-2"><Github color={highlightBg} onChange={onChangeHighlightBg}/></PopoverContent>
                                  </Popover>
                              </div>
                              <TbSettingsCode className="text-custom-medium-gray self-center cursor-pointer" />
                          </div>
                          <RxDividerVertical className="text-custom-medium-gray self-center" />
                        </div>
                        <div className="flex">
                          <div className="flex gap-4 self-center" onFocus={onFocusZoomTranscriptMenu} onBlur={() => onBlurZoomTranscriptMenu()}>
                              <Menu open={openZoomMenu} handler={setOpenZoomMenu}>
                                  <MenuHandler>
                                      <Button
                                          variant="text"
                                          className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-2 gap-1"
                                      >
                                          <input ref={zoomTranscriptInputRef} onKeyDown={onKeyDownZoomTranscriptInput} className="w-10 outline-none" value={zoomTranscript} onChange={(e) => setZoomTranscript(e.target.value)} />
                                          <BiChevronDown className={`transition-transform ${openZoomMenu ? "rotate-180" : ""}`}/>
                                      </Button>
                                  </MenuHandler>
                                  <MenuList>
                                      <MenuItem onClick={() => { setZoomTranscript("50%"); dispatch(setZoomTranscriptNum(50)) }}>50%</MenuItem>
                                      <MenuItem onClick={() => { setZoomTranscript("75%"); dispatch(setZoomTranscriptNum(75)) }}>75%</MenuItem>
                                      <MenuItem onClick={() => { setZoomTranscript("90%"); dispatch(setZoomTranscriptNum(90)) }}>90%</MenuItem>
                                      <MenuItem onClick={() => { setZoomTranscript("100%"); dispatch(setZoomTranscriptNum(100)) }}>100%</MenuItem>
                                      <MenuItem onClick={() => { setZoomTranscript("125%"); dispatch(setZoomTranscriptNum(125)) }}>125%</MenuItem>
                                      <MenuItem onClick={() => { setZoomTranscript("150%"); dispatch(setZoomTranscriptNum(150)) }}>150%</MenuItem>
                                      <MenuItem onClick={() => { setZoomTranscript("200%"); dispatch(setZoomTranscriptNum(200)) }}>200%</MenuItem>
                                  </MenuList>
                              </Menu>
                          </div>
                          <RxDividerVertical className="text-custom-medium-gray self-center" />
                        </div>
                        <div className="flex">
                          <div className="flex gap-4 self-center">
                              <Menu open={openEditMenu} handler={setOpenEditMenu}>
                                  <MenuHandler>
                                      <Button
                                          variant="text"
                                          className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-0 gap-1"
                                      >
                                          Edit
                                          <BiChevronDown className={`transition-transform ${openEditMenu ? "rotate-180" : ""}`}/>
                                      </Button>
                                  </MenuHandler>
                                  <MenuList>
                                      <MenuItem><p className="w-[100px]">Undo</p></MenuItem>
                                      <MenuItem><p className="w-[100px]">Redo</p></MenuItem>
                                      <MenuItem onClick={toggleSearch}><p className="w-[100px]">Find</p></MenuItem>
                                      <MenuItem><p className="w-[100px]">Replace</p></MenuItem>
                                  </MenuList>
                              </Menu>
                              <Menu open={openInsertMenu} handler={setOpenInsertMenu}>
                                  <MenuHandler>
                                      <Button
                                          variant="text"
                                          className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-2 gap-1"
                                      >
                                          Insert
                                          <BiChevronDown className={`transition-transform ${openInsertMenu ? "rotate-180" : ""}`}/>
                                      </Button>
                                  </MenuHandler>
                                  <MenuList>
                                      <MenuItem><p className="w-[100px]">Link</p></MenuItem>
                                      <MenuItem><p className="w-[100px]">Bullets</p></MenuItem>
                                      <MenuItem><p className="w-[100px]">Numbering</p></MenuItem>
                                      <MenuItem onClick={toggleNote}><p className="w-[100px]">Notes</p></MenuItem>
                                      <MenuItem onClick={onClickInsertSection}><p className="w-[100px]">Section</p></MenuItem>
                                  </MenuList>
                              </Menu>
                              <Menu open={openViewMenu} handler={setOpenViewMenu}>
                                  <MenuHandler>
                                      <Button
                                          variant="text"
                                          className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-0 gap-1"
                                      >
                                          View
                                          <BiChevronDown className={`transition-transform ${openViewMenu ? "rotate-180" : ""}`}/>
                                      </Button>
                                  </MenuHandler>
                                  <MenuList>
                                      <MenuItem>
                                          <Menu placement="right-start" offset={24}>
                                              <MenuHandler><p className="w-[100px]">Search</p></MenuHandler>
                                              <MenuList>
                                                  <MenuItem value="searchPositionLeft" onClick={() => searchOrder < 0 ? toggleSearchSidebarPosition() : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${searchOrder >= 0 ? "" : "invisible"}`} />Left</span>
                                                  </MenuItem>
                                                  <MenuItem value="searchPositionRight" onClick={() => searchOrder >= 0 ? toggleSearchSidebarPosition() : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${searchOrder < 0 ? "" : "invisible"}`} />Right</span>
                                                  </MenuItem>                               
                                              </MenuList>
                                          </Menu>
                                      </MenuItem>
                                      <MenuItem>
                                          <Menu placement="right-start" offset={24}>
                                              <MenuHandler><p className="w-[100px]">Note</p></MenuHandler>
                                              <MenuList>
                                                  <MenuItem name="notePositionLeft" onClick={() => noteOrder < 0 ? toggleNoteSidebarPosition() : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${noteOrder >= 0 ? "" : "invisible"}`} />Left</span>
                                                  </MenuItem>
                                                  <MenuItem name="notePositionRight" onClick={() => noteOrder >= 0 ? toggleNoteSidebarPosition() : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${noteOrder < 0 ? "" : "invisible"}`} />Right</span>
                                                  </MenuItem>                                    
                                              </MenuList>
                                          </Menu>
                                      </MenuItem>
                                      <MenuItem>
                                          <Menu placement="right-start" offset={24}>
                                              <MenuHandler><p className="w-[100px]">PlayList</p></MenuHandler>
                                              <MenuList>
                                                  <MenuItem name="playlistPositionLeft" onClick={() => playlistOrder < 0 ? togglePlaylistSidebarPosition() : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${playlistOrder >= 0 ? "" : "invisible"}`} />Left</span>
                                                  </MenuItem>
                                                  <MenuItem name="playlistPositionRight" onClick={() => playlistOrder >= 0 ? togglePlaylistSidebarPosition() : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${playlistOrder < 0 ? "" : "invisible"}`} />Right</span>
                                                  </MenuItem>                              
                                              </MenuList>
                                          </Menu>
                                      </MenuItem>
                                      <MenuItem>
                                          <Menu placement="right-start" offset={24}>
                                              <MenuHandler><p className="w-[100px]">Speaker Tags</p></MenuHandler>
                                              <MenuList>
                                                  <MenuItem name="speakerMethodHorizontal" onClick={() => !speakerMethod ? dispatch(toggleSpeaker()) : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${speakerMethod ? "" : "invisible"}`} />Horizontal</span>
                                                  </MenuItem>
                                                  <MenuItem name="speakerMethodVertical" onClick={() => speakerMethod ? dispatch(toggleSpeaker()) : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${!speakerMethod ? "" : "invisible"}`} />Vertical</span>
                                                  </MenuItem>                              
                                              </MenuList>
                                          </Menu>
                                      </MenuItem>
                                      <MenuItem>
                                          <Menu placement="right-start" offset={24}>
                                              <MenuHandler><p className="w-[100px]">Video</p></MenuHandler>
                                              <MenuList>
                                                  <MenuItem name="videoPositionLeft" onClick={() => !mediaSide ? dispatch(toggleMediaSide()) : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${mediaSide ? "" : "invisible"}`} />Left</span>
                                                  </MenuItem>
                                                  <MenuItem name="videoPositionRight" onClick={() => mediaSide ? dispatch(toggleMediaSide()) : ''}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${!mediaSide ? "" : "invisible"}`} />Right</span>
                                                  </MenuItem>
                                                  <MenuItem name="videoShowHide" onClick={() => dispatch(setShowMedia(!showMedia))}>
                                                      <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`invisible`} />{ showMedia ? 'Hide' : 'Show' }</span>
                                                  </MenuItem>                             
                                              </MenuList>
                                          </Menu>
                                      </MenuItem>
                                  </MenuList>
                              </Menu>
                          </div>
                          <RxDividerVertical className="text-custom-medium-gray self-center" />
                        </div>
                        <div className="flex self-center ">
                        <div className={`${ savingStatus === SAVING ? 'flex gap-1 self-center' : 'hidden'}`}>
                            <Spinner className="h-3.5 w-3.5 self-center" />
                            <span className="text-sm">Saving...</span>
                        </div>
                        <div className={`${ savingStatus === LISTENING_CHANGES ? 'flex gap-1 self-center' : 'hidden'}`}>
                            <Spinner className="h-3.5 w-3.5 self-center" />
                            <span className="text-sm">Listening your change...</span>
                        </div>
                        <div className={`${ savingStatus === SAVED ? 'flex gap-1 self-center' : 'hidden'}`}>
                            <IoIosCheckmark className="h-3.5 w-3.5 self-center"/>
                            <span className="text-sm">{ timestampToDate(lastSavedTime) }</span>
                        </div>
                        </div>
                      </div>
                      <div className="justify-items-end self-center grid">
                          <MdKeyboardArrowUp onClick={() => setOpenFunctionBar(!openFunctionBar)} className={`self-center w-[30px] h-[30px] text-custom-gray cursor-pointer`} />
                      </div>
                    </div>
                    <hr className={`mb-2 bg-white w-full border-blue-gray-50`} />
                  </div>
                </> : <></>
            }
          </div>
          <div className="grid">
            {
              contentWidth > RES_FULL ?
                <>
                  <div className={`px-10 justify-items-end self-center grid w-full ${!openFunctionBar ? "" : "hidden"} h-8`}>
                    <MdKeyboardArrowDown onClick={() => setOpenFunctionBar(!openFunctionBar)} className={`self-center transition-transform w-[30px] h-[30px] text-custom-gray cursor-pointer`} />
                  </div>
                  <div className={`sticky bg-white ${openFunctionBar ? "" : "hidden"} z-30`} style={{ top: '82px' }}>
                    <div className={`bg-white flex justify-between py-4 px-10`}>
                      <div className="flex">
                        <div className="flex gap-4 self-center select-none">
                            <LuUndo2 className={`${enableUndo ? "text-custom-black" : "text-custom-medium-gray"} cursor-pointer`} onClick={() => enableUndo && setUndo(!undo)}/>
                            <LuRedo2 className={`${enableRedo ? "text-custom-black" : "text-custom-medium-gray"} cursor-pointer`} onClick={() => enableRedo && setRedo(!redo)}/>
                        </div>
                        <RxDividerVertical className="text-custom-medium-gray self-center" />
                        <div className="flex gap-4 self-center select-none">
                            <AiOutlineBold className="text-custom-medium-gray self-center cursor-pointer" onClick={() => onClickEditStyle(BOLD)} />
                            <AiOutlineItalic className="text-custom-medium-gray self-center cursor-pointer" onClick={() => onClickEditStyle(ITALIC)} />
                            <AiOutlineUnderline className="text-custom-medium-gray self-center cursor-pointer" onClick={() => onClickEditStyle(UNDERLINE)} />
                            <div className="flex">
                                <AiOutlineFontColors onClick={() => onClickEditStyle(FONT_COLOR)} className="cursor-pointer text-custom-medium-gray" style={{color: fontColor}}/>
                                <Popover placement="bottom-end" open={openFontColorPicker} handler={setOpenFontColorPicker}>
                                    <PopoverHandler>
                                        <button className="flex outline-none text-custom-medium-gray">
                                            <BiChevronDown className={`transition-transform ${openFontColorPicker ? "rotate-180" : ""}`} />
                                        </button>
                                    </PopoverHandler>
                                    <PopoverContent className="z-50 bg-opacity-0 border-opacity-0 shadow-none p-0 pt-2"><Github color={fontColor} onChange={onChangeFontClr} /></PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex">
                                <AiOutlineHighlight onClick={() => onClickEditStyle(HIGHLIGHT_BG)} className="cursor-pointer text-custom-medium-gray" style={{color: highlightBg}} />
                                <Popover placement="bottom-end" open={openHighlightPicker} handler={setOpenHighlightPicker}>
                                    <PopoverHandler>
                                        <button className="flex outline-none text-custom-medium-gray">
                                            <BiChevronDown className={`transition-transform ${openHighlightPicker ? "rotate-180" : ""}`} />
                                        </button>
                                    </PopoverHandler>
                                    <PopoverContent className="z-50 bg-opacity-0 border-opacity-0 shadow-none p-0 pt-2"><Github color={highlightBg} onChange={onChangeHighlightBg}/></PopoverContent>
                                </Popover>
                            </div>
                            <TbSettingsCode className="text-custom-medium-gray self-center cursor-pointer" />
                        </div>
                        <RxDividerVertical className="text-custom-medium-gray self-center" />
                        <div className="flex gap-4 self-center" onFocus={onFocusZoomTranscriptMenu} onBlur={() => onBlurZoomTranscriptMenu()}>
                            <Menu open={openZoomMenu} handler={setOpenZoomMenu}>
                                <MenuHandler>
                                    <Button
                                        variant="text"
                                        className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-2 gap-1"
                                    >
                                        <input ref={zoomTranscriptInputRef} onKeyDown={onKeyDownZoomTranscriptInput} className="w-10 outline-none" value={zoomTranscript} onChange={(e) => setZoomTranscript(e.target.value)} />
                                        <BiChevronDown className={`transition-transform ${openZoomMenu ? "rotate-180" : ""}`}/>
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem onClick={() => { setZoomTranscript("50%"); dispatch(setZoomTranscriptNum(50)) }}>50%</MenuItem>
                                    <MenuItem onClick={() => { setZoomTranscript("75%"); dispatch(setZoomTranscriptNum(75)) }}>75%</MenuItem>
                                    <MenuItem onClick={() => { setZoomTranscript("90%"); dispatch(setZoomTranscriptNum(90)) }}>90%</MenuItem>
                                    <MenuItem onClick={() => { setZoomTranscript("100%"); dispatch(setZoomTranscriptNum(100)) }}>100%</MenuItem>
                                    <MenuItem onClick={() => { setZoomTranscript("125%"); dispatch(setZoomTranscriptNum(125)) }}>125%</MenuItem>
                                    <MenuItem onClick={() => { setZoomTranscript("150%"); dispatch(setZoomTranscriptNum(150)) }}>150%</MenuItem>
                                    <MenuItem onClick={() => { setZoomTranscript("200%"); dispatch(setZoomTranscriptNum(200)) }}>200%</MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                        <RxDividerVertical className="text-custom-medium-gray self-center" />
                        <div className="flex gap-4 self-center">
                            <Menu open={openEditMenu} handler={setOpenEditMenu}>
                                <MenuHandler>
                                    <Button
                                        variant="text"
                                        className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-0 gap-1"
                                    >
                                        Edit
                                        <BiChevronDown className={`transition-transform ${openEditMenu ? "rotate-180" : ""}`}/>
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem><p className="w-[100px]">Undo</p></MenuItem>
                                    <MenuItem><p className="w-[100px]">Redo</p></MenuItem>
                                    <MenuItem onClick={toggleSearch}><p className="w-[100px]">Find</p></MenuItem>
                                    <MenuItem><p className="w-[100px]">Replace</p></MenuItem>
                                </MenuList>
                            </Menu>
                            <Menu open={openInsertMenu} handler={setOpenInsertMenu}>
                                <MenuHandler>
                                    <Button
                                        variant="text"
                                        className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-2 gap-1"
                                    >
                                        Insert
                                        <BiChevronDown className={`transition-transform ${openInsertMenu ? "rotate-180" : ""}`}/>
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem><p className="w-[100px]">Link</p></MenuItem>
                                    <MenuItem><p className="w-[100px]">Bullets</p></MenuItem>
                                    <MenuItem><p className="w-[100px]">Numbering</p></MenuItem>
                                    <MenuItem onClick={toggleNote}><p className="w-[100px]">Notes</p></MenuItem>
                                    <MenuItem onClick={onClickInsertSection}><p className="w-[100px]">Section</p></MenuItem>
                                </MenuList>
                            </Menu>
                            <Menu open={openViewMenu} handler={setOpenViewMenu}>
                                <MenuHandler>
                                    <Button
                                        variant="text"
                                        className="flex items-center text-sm outline-none capitalize tracking-normal hover:bg-white text-custom-black font-light px-0 gap-1"
                                    >
                                        View
                                        <BiChevronDown className={`transition-transform ${openViewMenu ? "rotate-180" : ""}`}/>
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem>
                                        <Menu placement="right-start" offset={24}>
                                            <MenuHandler><p className="w-[100px]">Search</p></MenuHandler>
                                            <MenuList>
                                                <MenuItem value="searchPositionLeft" onClick={() => searchOrder < 0 ? toggleSearchSidebarPosition() : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${searchOrder >= 0 ? "" : "invisible"}`} />Left</span>
                                                </MenuItem>
                                                <MenuItem value="searchPositionRight" onClick={() => searchOrder >= 0 ? toggleSearchSidebarPosition() : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${searchOrder < 0 ? "" : "invisible"}`} />Right</span>
                                                </MenuItem>                               
                                            </MenuList>
                                        </Menu>
                                    </MenuItem>
                                    <MenuItem>
                                        <Menu placement="right-start" offset={24}>
                                            <MenuHandler><p className="w-[100px]">Note</p></MenuHandler>
                                            <MenuList>
                                                <MenuItem name="notePositionLeft" onClick={() => noteOrder < 0 ? toggleNoteSidebarPosition() : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${noteOrder >= 0 ? "" : "invisible"}`} />Left</span>
                                                </MenuItem>
                                                <MenuItem name="notePositionRight" onClick={() => noteOrder >= 0 ? toggleNoteSidebarPosition() : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${noteOrder < 0 ? "" : "invisible"}`} />Right</span>
                                                </MenuItem>                                    
                                            </MenuList>
                                        </Menu>
                                    </MenuItem>
                                    <MenuItem>
                                        <Menu placement="right-start" offset={24}>
                                            <MenuHandler><p className="w-[100px]">PlayList</p></MenuHandler>
                                            <MenuList>
                                                <MenuItem name="playlistPositionLeft" onClick={() => playlistOrder < 0 ? togglePlaylistSidebarPosition() : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${playlistOrder >= 0 ? "" : "invisible"}`} />Left</span>
                                                </MenuItem>
                                                <MenuItem name="playlistPositionRight" onClick={() => playlistOrder >= 0 ? togglePlaylistSidebarPosition() : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${playlistOrder < 0 ? "" : "invisible"}`} />Right</span>
                                                </MenuItem>                              
                                            </MenuList>
                                        </Menu>
                                    </MenuItem>
                                    <MenuItem>
                                        <Menu placement="right-start" offset={24}>
                                            <MenuHandler><p className="w-[100px]">Speaker Tags</p></MenuHandler>
                                            <MenuList>
                                                <MenuItem name="speakerMethodHorizontal" onClick={() => !speakerMethod ? dispatch(toggleSpeaker()) : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${speakerMethod ? "" : "invisible"}`} />Horizontal</span>
                                                </MenuItem>
                                                <MenuItem name="speakerMethodVertical" onClick={() => speakerMethod ? dispatch(toggleSpeaker()) : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${!speakerMethod ? "" : "invisible"}`} />Vertical</span>
                                                </MenuItem>                              
                                            </MenuList>
                                        </Menu>
                                    </MenuItem>
                                    <MenuItem>
                                        <Menu placement="right-start" offset={24}>
                                            <MenuHandler><p className="w-[100px]">Video</p></MenuHandler>
                                            <MenuList>
                                                <MenuItem name="videoPositionLeft" onClick={() => !mediaSide ? dispatch(toggleMediaSide()) : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${mediaSide ? "" : "invisible"}`} />Left</span>
                                                </MenuItem>
                                                <MenuItem name="videoPositionRight" onClick={() => mediaSide ? dispatch(toggleMediaSide()) : ''}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`${!mediaSide ? "" : "invisible"}`} />Right</span>
                                                </MenuItem>
                                                <MenuItem name="videoShowHide" onClick={() => dispatch(setShowMedia(!showMedia))}>
                                                    <span className="flex cursor-pointer items-center gap-2"><AiOutlineCheck className={`invisible`} />{ showMedia ? 'Hide' : 'Show' }</span>
                                                </MenuItem>                             
                                            </MenuList>
                                        </Menu>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                        <RxDividerVertical className="text-custom-medium-gray self-center" />
                        <div className="flex self-center ">
                          <div className={`${ savingStatus === SAVING ? 'flex gap-1 self-center' : 'hidden'}`}>
                              <Spinner className="h-3.5 w-3.5 self-center" />
                              <span className="text-sm">Saving...</span>
                          </div>
                          <div className={`${ savingStatus === LISTENING_CHANGES ? 'flex gap-1 self-center' : 'hidden'}`}>
                              <Spinner className="h-3.5 w-3.5 self-center" />
                              <span className="text-sm">Listening your change...</span>
                          </div>
                          <div className={`${ savingStatus === SAVED ? 'flex gap-1 self-center' : 'hidden'}`}>
                              <IoIosCheckmark className="h-3.5 w-3.5 self-center"/>
                              <span className="text-sm">{ timestampToDate(lastSavedTime) }</span>
                          </div>
                        </div>
                      </div>
                      <div className="justify-items-end self-center grid">
                          <MdKeyboardArrowUp onClick={() => setOpenFunctionBar(!openFunctionBar)} className={`self-center w-[30px] h-[30px] text-custom-gray cursor-pointer`} />
                      </div>
                    </div>
                    <hr className={`mb-2 bg-white w-full border-blue-gray-50`} />
                  </div>
                </> : <></>
            }
            <div className={`px-10`}>
              <TBody
                  actionStyle={actionStyle}
                  changeStyle={changeStyle}
                  changedFontClr={changedFontClr}
                  changedHighlightClr={changedHighlightClr}
                  undo={undo}
                  redo={redo}
                  setEnableUndo={setEnableUndo}
                  setEnableRedo={setEnableRedo}
                  setSavingStatus={setSavingStatus}
                  setLastSavedTime={setLastSavedTime}
                  clickedInsSection={clickedInsSection}
              />
            </div>
          </div>
        </div>
      </DVResizeablePanel>

      <DVMediaController
        togglePlaylist={togglePlaylist}
        mediaRef={mediaRef}
        mediaName={medias[selMediaIndex]?.fileName}
        mediaDur={medias[selMediaIndex]?.duration}
        currentTime={currentTime}
        isPlaying={isPlaying}
        setIsPlaying={(status) => dispatch(setIsPlaying(status))}
        onClickPrevMedia={onClickPrevMedia}
        onClickNextMedia={onClickNextMedia}
        onChangeTSlider={onChangeTSlider}
        className="h-[90px] w-[100%] fixed bottom-0 z-50 bg-custom-white select-none"
      />
    </>
  );
};

export default TBEditor;
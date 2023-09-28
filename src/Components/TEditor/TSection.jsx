import { useEffect, useState, useRef } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTime, setIsPlaying } from "@/redux-toolkit/reducers/Media";

// Components
import TFadeInOut from "../TFadeInOut";

// material
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";

// icons
import { HiMiniUser } from "react-icons/hi2";
import { AiFillCaretDown } from "react-icons/ai";
import { BiPlay, BiPencil, BiPause } from "react-icons/bi";

// utils
import { EventBus, getActiveWord, getIndexFromArr, getItemFromArr, isEmpty, msToTime } from "@/utils/function";
import { TIME_UPDATE_OUTSIDE, TIME_SYNC_TRANSCRIPTION, SET_LOADING } from "@/utils/constant";
import MediaService from "@/services/media";

const TSection = () => {
    const dispatch = useDispatch();
    const activeWordId = useRef("");

    const { zoomTranscriptNum, speakerMethod } = useSelector((state) => state.editor); //true: left, false: right
    const { selectedMediaId, medias, isPlaying, currentTime } = useSelector((state) => state.media);
    const [showFade, setShowFade] = useState(false);
    const [showAddSpeaker, setShowAddSpeaker] = useState(false);
    const [selectedEditSpeakerId, setSelectedEditSpeakerId] = useState(-1);
    const [newSpeaker, setNewSpeaker] = useState("");
    const [updatedSpeaker, setUpdatedSpeaker] = useState("");
    const [transcription, setTranscription] = useState({});

    useEffect(() => {
        if (medias.length == 0 || selectedMediaId == "") return;
        EventBus.dispatch(SET_LOADING, true);
        setShowFade(false);
        MediaService.getTranscriptionByFileId(getItemFromArr(medias, "fileId", selectedMediaId).fileId) // get transcription data
            .then((res) => {
                var data = res.data;
                if (!("speakers" in data)) {    // in case of first loading
                    var speakers = []; //speaker array
                    var speakerTags = [];  //speakerTag array
                    var sectionTags = [];   //sectionTag array
                    var changeTracks = { tracks: [], curIndex: -1};    //changes array for tracking
                    var prevWorditemSpeakerTag = -1, newSpeakerTagRangeStartId = "", newSpeakerTagitemSpeakerId = "", prevSpeakerTagId = "";
                    // make useful structure
                    let wordCurrentId = data.words[0].id;
                    while(true) {
                        var word = getItemFromArr(data.words, "id", wordCurrentId);
                        word.style = {};
                        if (prevWorditemSpeakerTag != word.speakerTag) { // check if the current speakerTag is not equal to the previous item's one
                            // add speakerTag
                            if (newSpeakerTagRangeStartId != "") {
                                var curSpeakerTagId = uuidv4();
                                speakerTags.push({
                                    id: curSpeakerTagId,
                                    prevId: prevSpeakerTagId,
                                    nextId: "",
                                    speakerId: newSpeakerTagitemSpeakerId,  // id of the speaker array
                                    range: [newSpeakerTagRangeStartId, word.prevId],    // [startId, endId] of the words array
                                    startTime: getItemFromArr(data.words, "id", newSpeakerTagRangeStartId).startTime    // startTime of this speaker tag
                                })
                                speakerTags[getIndexFromArr(speakerTags, "id", prevSpeakerTagId)].nextId = curSpeakerTagId;
                                prevSpeakerTagId = curSpeakerTagId;
                            }
                            // check if the current speakerTag is already existed in the speaker array
                            let speakerItem = getItemFromArr(speakers, "label", "Speaker " + (word.speakerTag + 1));
                            if(isEmpty(speakerItem)) 
                                speakers.push({id: uuidv4(), label: "Speaker " + (word.speakerTag + 1)});
                            newSpeakerTagitemSpeakerId = isEmpty(speakerItem) ? speakers[speakers.length - 1].id : speakerItem.id;
                            newSpeakerTagRangeStartId = word.id;    // reset the first item of the new speakerTag's range property
                            prevWorditemSpeakerTag = word.speakerTag;
                        }
                        // throw away speakerTag, speakerTag
                        delete word.speakerTag;
                        // actually change the word
                        data.words[getIndexFromArr(data.words, "id", word.id)] = word;
                        if (word.nextId == "") break;
                        wordCurrentId = word.nextId;
                    }
                    // add last speaker tag
                    speakerTags.push({
                        id: uuidv4(),
                        prevId: prevSpeakerTagId,
                        nextId: "",
                        speakerId: newSpeakerTagitemSpeakerId,  // id of the speaker array
                        range: [newSpeakerTagRangeStartId, wordCurrentId],    // [startId, endId] of the words array
                        startTime: getItemFromArr(data.words, "id", newSpeakerTagRangeStartId).startTime    // startTime of this speaker tag
                    })
                    // add section tag
                    sectionTags.push({ id: uuidv4(), prevId: "", nextId: "", label: "", range: [speakerTags[0].id, speakerTags[speakerTags.length - 1].id] }) // label: section's title, range: [startId, endId] of the speakerTag array
                    data.speakers = speakers;
                    data.speakerTags = speakerTags;
                    data.sectionTags = sectionTags;
                    data.changeTracks = changeTracks;
                }
                setTranscription(data);
                
                activeWordId.current = data.words[0].id;
            });
    }, [selectedMediaId, medias]);

    useEffect(() => {
        if (isPlaying) return;
        if (transcription.speakerTags == undefined) return;
        var speakerTagPlayBtns = document.getElementsByClassName('allSpeakerTagPlayBtn');
        for (let i = 0; i < speakerTagPlayBtns.length; i++) speakerTagPlayBtns[i].style.display = "flex";
        var speakerTagPauseBtns = document.getElementsByClassName('allSpeakerTagPauseBtn');
        for (let i = 0; i < speakerTagPauseBtns.length; i++) speakerTagPauseBtns[i].style.display = "none";
    }, [isPlaying])

    useEffect(() => {
        EventBus.dispatch(SET_LOADING, false);
        setShowFade(true);
        if (isEmpty(transcription)) return;
        document.getElementById(activeWordId.current)?.classList.add("activeWord");

        EventBus.on(TIME_SYNC_TRANSCRIPTION, ({ time, isFromClicked }) => {
            var activeWord = getItemFromArr(transcription.words, "id", activeWordId.current);
            // remove highlight from previous active word
            if(!(time >= activeWord?.startTime && time < activeWord?.endTime))
                document.getElementById(activeWordId.current)?.classList.remove("activeWord");
            // apply highlight to current active word
            var newActiveWord = getActiveWord(transcription.words, time)
            if (isEmpty(newActiveWord)) return;
            var activeElement = document.getElementById(newActiveWord.id);
            activeElement?.classList.add("activeWord");
            if(!isFromClicked) window.scrollTo({ behavior: 'smooth', top: activeElement?.offsetTop - 216 - (window.innerHeight - 314) / 4 })
            activeWordId.current = newActiveWord.id;
        });

        return () => {
            EventBus.remove(TIME_SYNC_TRANSCRIPTION);
        };
    }, [transcription])

    const onClickAddSpeaker = (id) => {
        setShowAddSpeaker(true);
        setNewSpeaker("");
        setTimeout(() => {
            document.getElementById(id).focus();
        }, 10)
    }

    const onClickEditSpeaker = (speaker, editInputId) => {
        setSelectedEditSpeakerId(speaker.id);
        setUpdatedSpeaker(speaker.label);
        setTimeout(() => {
            document.getElementById(editInputId).focus();
        }, 10)
    }

    const addNewSpeaker = () => {
        setShowAddSpeaker(false);
        if (newSpeaker.length) {
            var updatedTranscription = { ...transcription };
            var updatedSpeakers = updatedTranscription.speakers;
            updatedSpeakers.push({ id: uuidv4(), label: newSpeaker });
            updatedTranscription.speakers = updatedSpeakers;
            setTranscription(updatedTranscription);
        }
    }

    const editSpeakerById = () => {
        var updatedTranscription = { ...transcription };
        var updatedSpeakers = updatedTranscription.speakers;
        var updatedIndex = getIndexFromArr(updatedSpeakers, "id", selectedEditSpeakerId);
        if (updatedSpeaker.length) updatedSpeakers[updatedIndex].label = updatedSpeaker;
        else updatedSpeakers.splice(updatedIndex, 1);
        updatedTranscription.speakers = updatedSpeakers;
        setTranscription(updatedTranscription);
        setSelectedEditSpeakerId(-1);
    }

    const onEditKeyUp = (e) => {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13) editSpeakerById();
    }

    const onAddKeyUp = (e) => {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13) addNewSpeaker();        
    }

    const changeSpeakerId = (speakerTagId, newSpeakerId) => {
        var updatedTranscription = { ...transcription };
        var updatedSpeakerTags = updatedTranscription.speakerTags;
        var updatedIndex = getIndexFromArr(updatedSpeakerTags, "id", speakerTagId)
        var updatedSpeakerTag = updatedSpeakerTags[updatedIndex];
        updatedSpeakerTag.speakerId = newSpeakerId;
        updatedSpeakerTags[updatedIndex] = updatedSpeakerTag;
        updatedTranscription.speakerTags = updatedSpeakerTags;
        setTranscription(updatedTranscription);
    }

    const toggleSpeakerTagPlay = (firstWordId, speakerTagStartTime, playBtnId, pauseBtnId) => {
        if (document.getElementById(playBtnId).style.display == "none") {    // make pause
            document.getElementById(playBtnId).style.display = "flex";
            document.getElementById(pauseBtnId).style.display = "none";
            dispatch(setIsPlaying(false));
        } else {    // make play
            document.getElementById(activeWordId.current).classList.remove("activeWord");
            document.getElementById(firstWordId).classList.add("activeWord");
            activeWordId.current = firstWordId;
            dispatch(setCurrentTime(speakerTagStartTime));
            dispatch(setIsPlaying(true))
            EventBus.dispatch(TIME_UPDATE_OUTSIDE, { time: speakerTagStartTime == 0 ? 0.000001 : speakerTagStartTime, mediaId: selectedMediaId });
            // make other speakerTag paused
            var speakerTagPlayBtns = document.getElementsByClassName('allSpeakerTagPlayBtn');
            for (let i = 0; i < speakerTagPlayBtns.length; i++) speakerTagPlayBtns[i].style.display = "flex";
            var speakerTagPauseBtns = document.getElementsByClassName('allSpeakerTagPauseBtn');
            for (let i = 0; i < speakerTagPauseBtns.length; i++) speakerTagPauseBtns[i].style.display = "none"
            // make clicked speakerTag play
            document.getElementById(playBtnId).style.display = "none";
            document.getElementById(pauseBtnId).style.display = "flex";
        }
    }

    const onClickWord = (e) => {
        dispatch(setCurrentTime(e.target.dataset.start))
        EventBus.dispatch(TIME_UPDATE_OUTSIDE, { time: e.target.dataset.start == 0 ? 0.000001 : e.target.dataset.start, mediaId: selectedMediaId, isFromClicked: true });
    }

    const getWords = (startId, endId) => {
        if (transcription.words == undefined) return;
        var element = [];
        var wordCurrentId = startId;
        while (true) {
            var word = getItemFromArr(transcription.words, "id", wordCurrentId);
            element.push(
                <span
                    key={word.id}
                    id={word.id}
                    data-start = {word.startTime}
                    onClick={onClickWord}
                    style={{ fontSize: (Math.ceil(zoomTranscriptNum / 100 * 13) % 2 == 1 ? (Math.ceil(zoomTranscriptNum / 100 * 13) + 1) : Math.ceil(zoomTranscriptNum / 100 * 13)) + "px" }}
                >
                    {" " + word.word}
                </span>
            )
            if (word.id == endId || word.nextId == "") break;
            wordCurrentId = word.nextId;
        }
        return element;
    }

    const getSpeakerTags = (startId, endId) => {
        if (transcription.speakerTags == undefined || transcription.speakers == undefined) return;
        var element = [];
        var speakerTagCurrentId = startId;
        while (true) {
            var speakerTag = getItemFromArr(transcription.speakerTags, "id", speakerTagCurrentId);
            var curSpeaker = getItemFromArr(transcription.speakers, "id", speakerTag.speakerId);
            let speakerTagAddSpeakerInputId = speakerTag.id + "-addInputId";
            var speakerTagPlayBtnId = speakerTag.id + "-playBtnId";
            var speakerTagPauseBtnId = speakerTag.id + "-pauseBtnId";
            element.push(
                <div key={speakerTag.id} className={`${speakerMethod ? "flex" : ""} gap-2`}>
                    <div className={`text-custom-sky text-sm ${speakerMethod ? "w-40" : "flex gap-2"}`}>
                        <Popover placement="bottom">
                            <PopoverHandler onClick={() => { setSelectedEditSpeakerId(-1);  setShowAddSpeaker(false)}}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <HiMiniUser />
                                    <p>{ curSpeaker.label == undefined ? transcription.speakers[0].label : curSpeaker.label }</p>
                                    <AiFillCaretDown />
                                </div>
                            </PopoverHandler>
                            <PopoverContent className="w-52 z-50">
                                {
                                    transcription.speakers.map((speaker, index) => {
                                        const editSpeakerLabelInputId = speakerTag.id + "-" + speaker.id + "-editInputId";
                                        return (
                                            <div key={speakerTag.id + "-" + speaker.id} >
                                                <div className={`${selectedEditSpeakerId == speaker.id ? "hidden" : ""} w-full justify-between flex py-1`}>
                                                    <p className="text-custom-black text-sm cursor-pointer" onClick={() => changeSpeakerId(speakerTagCurrentId, speaker.id)}>{ speaker.label }</p>
                                                    <BiPencil className="text-xs self-center text-custom-sky cursor-pointer" onClick={() => onClickEditSpeaker(speaker, editSpeakerLabelInputId)} />
                                                </div>
                                                <div className={`w-full py-1 flex h-9 gap-1 ${selectedEditSpeakerId == speaker.id ? "" : "hidden"}`}>
                                                    <input
                                                        id={editSpeakerLabelInputId}
                                                        onKeyUp={onEditKeyUp}
                                                        value={updatedSpeaker}
                                                        onChange={(e) => setUpdatedSpeaker(e.target.value)}
                                                        className="h-full w-full rounded border border-custom-sky pl-3 bg-transparent text-sm font-normal text-blue-gray-700 outline outline-0 transition-all"
                                                    />
                                                    <button onClick={editSpeakerById} className="rounded bg-custom-sky px-3 text-xs font-bold text-white">Save</button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                <div>
                                    <div className={`${showAddSpeaker ? "hidden" : ""} py-1`} onClick={() => onClickAddSpeaker(speakerTagAddSpeakerInputId)}>
                                        <p className="text-custom-sky text-sm cursor-pointer">+ Add new speaker</p>
                                    </div>
                                    <div className={`w-full py-1 flex h-9 gap-1 ${showAddSpeaker ? "" : "hidden"}`}>
                                        <input
                                            id={speakerTagAddSpeakerInputId}
                                            onKeyUp={onAddKeyUp}
                                            value={newSpeaker}
                                            onChange={(e) => setNewSpeaker(e.target.value)}
                                            className="h-full w-full rounded border border-custom-sky pl-3 bg-transparenttext-sm font-normal text-blue-gray-700 outline outline-0 transition-all"
                                        />
                                        <button onClick={addNewSpeaker} className="rounded bg-custom-sky px-3 text-xs font-bold text-white">Save</button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <div className={`flex gap-2 items-center ${speakerMethod ? "mt-2" : ""}`}>
                            <p>{ msToTime(speakerTag.startTime, true) }</p>
                            <div className="cursor-pointer w-12" onClick={() => toggleSpeakerTagPlay(speakerTag.range[0], speakerTag.startTime, speakerTagPlayBtnId, speakerTagPauseBtnId)}>
                                <div id={speakerTagPlayBtnId} className="flex items-center allSpeakerTagPlayBtn"><BiPlay /><p className=" self-center">Play</p></div>
                                <div id={speakerTagPauseBtnId} className="flex items-center allSpeakerTagPauseBtn" style={{display: "none"}}><BiPause /><p>Pause</p></div>
                            </div>
                        </div>
                    </div>
                    <p contentEditable suppressContentEditableWarning className="outline-none text-custom-gray w-full h-auto">
                        {getWords(speakerTag.range[0], speakerTag.range[1])}
                    </p>
                </div>
            )
            if (speakerTag.id == endId || speakerTag.nextId == "") break;
            speakerTagCurrentId = speakerTag.nextId;
        }
        return element;
    }

    const getSectionTags = (startId, endId) => {
        if (transcription.sectionTags == undefined) return;
        var element = [];
        var sectionTagCurrentId = startId;
        while (true) {
            var sectionTag = getItemFromArr(transcription.sectionTags, "id", sectionTagCurrentId);
            element.push(
                <div key={sectionTag.id}>
                    <input className={`text-black outline-none focus:border-2 focus:border-custom-medium-gray text-base mb-2 ${sectionTag.label.length == 0 ? "hidden" : ""}`} value={sectionTag.label} onChange={(e) => setSectionHeading(e.target.value)}/>
                        <div className="grid gap-4">
                            {getSpeakerTags(sectionTag.range[0], sectionTag.range[1])}
                        </div>
                    <p className={` text-custom-black text-xs mt-2 ${sectionTag.label.length == 0 ? "hidden" : ""}`} >- End of {sectionTag.label} -</p>
                </div>
            )
            if (sectionTag.id == endId || sectionTag.nextId == "") break;
            sectionTagCurrentId = sectionTag.nextId;
        }
        return element;
    }

    return (
        <TFadeInOut show={showFade} duration={300} >
            {transcription.sectionTags != undefined && getSectionTags(transcription.sectionTags[0].id, transcription.sectionTags[transcription.sectionTags.length - 1].id)}
        </TFadeInOut>
    )
}

export default TSection;
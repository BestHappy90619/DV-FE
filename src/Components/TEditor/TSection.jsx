import { useEffect, useState, useRef } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { setIsPlaying } from "@/redux-toolkit/reducers/Media";

// Components
import TFadeInOut from "../TFadeInOut";

// material
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";

// Toast
import { toast } from "react-hot-toast";

// icons
import { HiMiniUser } from "react-icons/hi2";
import { AiFillCaretDown } from "react-icons/ai";
import { BiPlay, BiPencil, BiPause } from "react-icons/bi";

// utils
import { EventBus, getActiveWord, getIndexFromArr, getItemFromArr, hexToRGB, isEmpty, msToTime } from "@/utils/function";
import { TIME_UPDATE_OUTSIDE, SET_LOADING, BOLD, FONT_COLOR, HIGHLIGHT_BG, ITALIC, UNDERLINE, GRAY, ACTIVE_WORD_COLOR, DEFAULT_FONT_SIZE, SPEAKER_TAG, WORD, TIME_SLIDE_DRAG, KEY_UP, SELECTION_CHANGE } from "@/utils/constant";
import MediaService from "@/services/media";

const TSection = ({actionStyle, startEle, endEle, changeStyle, changeFontClr, changeHighlightClr}) => {
    const dispatch = useDispatch();
    const activeWordId = useRef("");
    const selectionRange = useRef(null);

    const { zoomTranscriptNum, speakerMethod } = useSelector((state) => state.editor); //true: left, false: right
    const { selectedMediaId, medias, isPlaying, currentTime } = useSelector((state) => state.media);
    const [showFade, setShowFade] = useState(false);
    const [showAddSpeaker, setShowAddSpeaker] = useState(false);
    const [selectedEditSpeakerId, setSelectedEditSpeakerId] = useState(-1);
    const [newSpeaker, setNewSpeaker] = useState("");
    const [updatedSpeaker, setUpdatedSpeaker] = useState("");
    const [transcription, setTranscription] = useState({});
    const [changeTracks, setChangeTracks] = useState({ tracks: [], curIndex: -1 })        //changes array for tracking

    useEffect(() => {
        if (medias.length == 0 || selectedMediaId == "") return;
        EventBus.dispatch(SET_LOADING, true);
        setShowFade(false);
        MediaService.getTranscriptionByFileId(getItemFromArr(medias, "fileId", selectedMediaId).fileId) // get transcription data
            .then((res) => {
                if (res.status == 200) {
                    let data = res.data;
                    if (!("sectionTags" in data) || data.sectionTags.length == 0) {
                        let sectionTags = [];
                        let wordCurrentId = "", speakerTagCurrentIndex = -1, previewTag = "", newSectionTagRange = "", prevSectionTagId = "", curTag = "";
                        wordCurrentId = data.words[0].id;
                        while (true) {
                            let word = getItemFromArr(data.words, "id", wordCurrentId);
                            if (speakerTagCurrentIndex < 0) {
                                let i = 0;
                                for (; i < data.speakerTags.length; i++) {
                                    const speakerTag = data.speakerTags[i];
                                    if (wordCurrentId == speakerTag.range[0]) {
                                        speakerTagCurrentIndex = i;
                                        curTag = SPEAKER_TAG;
                                        break;
                                    }
                                }
                                if (i == data.speakerTags.length) curTag = WORD;
                            } else if (wordCurrentId == data.speakerTags[speakerTagCurrentIndex].range[1]) {
                                newSectionTagRange.push(data.speakerTags[speakerTagCurrentIndex].id);
                                speakerTagCurrentIndex = -1;
                            }
                            if (curTag != previewTag) {
                                if (previewTag != "") {
                                    let range = [];
                                    if (previewTag == WORD) {
                                        range.push(newSectionTagRange);
                                        range.push(word.prevId);
                                    } else
                                        range = newSectionTagRange;
                                    let newSectionTagId = uuidv4();
                                    sectionTags.push({
                                        id: newSectionTagId,
                                        label: "Section" + (sectionTags.length + 1),
                                        nextId: "",
                                        prevId: prevSectionTagId,
                                        range,
                                        isWordGroup: previewTag == WORD,
                                        showHeading: false
                                    })
                                    let prevSectionTagIndex = getIndexFromArr(sectionTags, "id", prevSectionTagId);
                                    if (prevSectionTagIndex > -1) sectionTags[prevSectionTagIndex].nextId = newSectionTagId;
                                    prevSectionTagId = newSectionTagId;
                                }
                                if (curTag == WORD) newSectionTagRange = wordCurrentId;
                                else newSectionTagRange = [];
                                previewTag = curTag;
                            }
                            if (word.nextId == "") break;
                            wordCurrentId = word.nextId;
                        }
                        let range = [];
                        if (previewTag == WORD) {
                            range.push(newSectionTagRange);
                            range.push(wordCurrentId);
                        } else
                            range = newSectionTagRange;
                        let newSectionTagId = uuidv4();
                        sectionTags.push({
                            id: newSectionTagId,
                            label: "Section" + (sectionTags.length + 1),
                            nextId: "",
                            prevId: prevSectionTagId,
                            range,
                            isWordGroup: previewTag == WORD,
                            showHeading: false
                        })
                        let prevSectionTagIndex = getIndexFromArr(sectionTags, "id", prevSectionTagId);
                        if (prevSectionTagIndex > -1) sectionTags[prevSectionTagIndex].nextId = newSectionTagId;
                        data.sectionTags = sectionTags;
                    }
                    setTranscription(data);
                } else if (res.status == 400) {
                    toast.error("The selected media has not transcribed yet!");
                    setTranscription({});
                } else {
                    toast.error("Sorry, but an error has been ocurred while getting transcription!");
                    setTranscription({});
                }
                EventBus.dispatch(SET_LOADING, false);
                setShowFade(true);
            })
            .catch((err) => {
                toast.error("Sorry, but an error has been ocurred while getting transcription!");
                setTranscription({});
                EventBus.dispatch(SET_LOADING, false);
                setShowFade(true);
            })
    }, [selectedMediaId, medias]);
    
    useEffect(() => {
        if (isPlaying) return;
        if (transcription.speakerTags == undefined) return;
        let speakerTagPlayBtns = document.getElementsByClassName('allSpeakerTagPlayBtn');
        for (let i = 0; i < speakerTagPlayBtns.length; i++) speakerTagPlayBtns[i].style.display = "flex";
        let speakerTagPauseBtns = document.getElementsByClassName('allSpeakerTagPauseBtn');
        for (let i = 0; i < speakerTagPauseBtns.length; i++) speakerTagPauseBtns[i].style.display = "none";
    }, [isPlaying])

    useEffect(() => {
        function onTimeSlideDrag() {
            setTimeout(() => {
                let activeElement = document.getElementById(activeWordId.current);
                window.scrollTo({ behavior: 'smooth', top: activeElement?.offsetTop - 216 - (window.innerHeight - 314) / 4 })
            }, 50)
        }
        EventBus.on(TIME_SLIDE_DRAG, onTimeSlideDrag);
        // Remove the event listeners when the component unmounts
        return () => {
            EventBus.remove(TIME_SLIDE_DRAG, onTimeSlideDrag);
        };
    }, [])

    useEffect(() => {
        if (isEmpty(transcription)) return;
        highlightActiveWord();

        function handleKeyupEditableSection(e) {
            if (e.keyCode === 32) {
                e.preventDefault(); // Prevent default behavior of space key
                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let caretPosition = range.endOffset;

                let parEle = range.endContainer.parentNode;
                let parEleText = parEle.textContent; // Trim whitespace from text content
                let parentStartTime = parEle.dataset.start * 1;
                let parentDuration = parEle.dataset.duration * 1;

                let eleTextBefCar = parEleText.substring(0, caretPosition - 1);
                let eleIdBefCar = uuidv4();
                let eleStartTimeBefCar = parentStartTime;
                let eleDurBefCar = eleTextBefCar.length / parEleText.length * parentDuration;

                let eleTextAftCar = " " + parEleText.substring(caretPosition);
                let eleIdAftCar = uuidv4();
                let eleStartTimeAftCar = eleStartTimeBefCar + eleDurBefCar;
                let eleDurAftCar = parentDuration - eleDurBefCar;

                let rawFontSize = Math.ceil(zoomTranscriptNum / 100 * DEFAULT_FONT_SIZE);
                // create element to insert before the caret
                const elementBeforeCaret = document.createElement("span");
                elementBeforeCaret.id = eleIdBefCar;
                elementBeforeCaret.dataset.start = eleStartTimeBefCar;
                elementBeforeCaret.dataset.duration = eleDurBefCar;
                elementBeforeCaret.addEventListener("click", onClickWord);
                elementBeforeCaret.style.fontSize = (rawFontSize % 2 == 1 ? (rawFontSize + 1) : rawFontSize) + "px";
                elementBeforeCaret.textContent = eleTextBefCar;

                // create element to insert after the caret
                const elementAfterCaret = document.createElement("span");
                elementAfterCaret.id = eleIdAftCar;
                elementAfterCaret.dataset.start = eleStartTimeAftCar;
                elementAfterCaret.dataset.duration = eleDurAftCar;
                elementAfterCaret.addEventListener("click", onClickWord);
                elementAfterCaret.style.fontSize = (rawFontSize % 2 == 1 ? (rawFontSize + 1) : rawFontSize) + "px";
                elementAfterCaret.textContent = eleTextAftCar;

                parEle.parentNode.insertBefore(elementBeforeCaret, parEle);
                parEle.parentNode.insertBefore(elementAfterCaret, parEle);
                parEle.parentNode.removeChild(parEle);
                
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.setStart(elementAfterCaret.childNodes[0], 1); // Adjust caret position to end of space element
                newRange.setEnd(elementAfterCaret.childNodes[0], 1);
                selection.addRange(newRange);

                // change words array
                let updatedTranscription = transcription;
                let updatedIndex = getIndexFromArr(updatedTranscription.words, "id", parEle.id);
                let parWord = updatedTranscription.words[updatedIndex];
                // updatedTranscription.words.splice(updatedIndex, 1);
                updatedTranscription.words[updatedIndex].removed = true;
                updatedTranscription.words.push({
                    id: eleIdBefCar,
                    prevId: parWord.prevId,
                    nextId: eleIdAftCar,
                    word: eleTextBefCar,
                    startTime: eleStartTimeBefCar,
                    endTime: eleStartTimeBefCar + eleDurBefCar,
                    confidence: parWord.confidence
                })
                updatedTranscription.words.push({
                    id: eleIdAftCar,
                    prevId: eleIdBefCar,
                    nextId: parWord.nextId,
                    word: eleTextAftCar,
                    startTime: eleStartTimeAftCar,
                    endTime: eleStartTimeAftCar + eleDurAftCar,
                    confidence: parWord.confidence
                })
                highlightActiveWord();
            }
        }
        let editableSection = document.getElementById('editableSection');
        editableSection && editableSection.addEventListener(KEY_UP, handleKeyupEditableSection);

        // Remove the event listeners when the component unmounts
        return () => {
            editableSection && editableSection.removeEventListener(KEY_UP, handleKeyupEditableSection)
        }
    }, [currentTime])

    useEffect(() => {
        if (actionStyle == undefined || startEle == undefined || endEle == undefined) return;
        if (actionStyle == FONT_COLOR && changeFontClr == undefined) return;
        if (actionStyle == HIGHLIGHT_BG && changeHighlightClr == undefined) return;
        let wordCurrentId = startEle.id;
        while (true) {
            let word = getItemFromArr(transcription.words, "id", wordCurrentId);
            var wordCurEle = document.getElementById(wordCurrentId);
            switch (actionStyle) {
                case BOLD:
                    wordCurEle.style.fontWeight = wordCurEle.style.fontWeight == "700" ? "400" : "700";
                    break;
                case ITALIC:
                    wordCurEle.style.fontStyle = wordCurEle.style.fontStyle == "italic" ? "normal" : "italic";
                    break;
                case UNDERLINE:
                    wordCurEle.style.textDecorationLine = wordCurEle.style.textDecorationLine == "underline" ? "none" : "underline";
                    break;
                case FONT_COLOR:
                    wordCurEle.style.color = wordCurEle.style.color == hexToRGB(changeFontClr) ? wordCurEle.classList.contains("activeWord") ? ACTIVE_WORD_COLOR : GRAY : changeFontClr;
                    break;
                case HIGHLIGHT_BG:
                    wordCurEle.style.backgroundColor = wordCurEle.style.backgroundColor == hexToRGB(changeHighlightClr) ? "#FFF" : changeHighlightClr;
                    break;
            }
            if (word.id == endEle.id || word.nextId == "") break;
            wordCurrentId = word.nextId;
        }
    },[changeStyle])

    const highlightActiveWord = () => {
        document.getElementById(activeWordId.current)?.classList.remove("activeWord");
        let newActiveWord = getActiveWord(transcription.words, currentTime)
        if (isEmpty(newActiveWord)) return;
        let activeElement = document.getElementById(newActiveWord.id);
        activeElement?.classList.add("activeWord");
        activeWordId.current = newActiveWord.id;
    }

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
            let updatedTranscription = { ...transcription };
            updatedTranscription.speakers.push({ id: uuidv4(), label: newSpeaker });
        }
    }

    const editSpeakerById = () => {
        let updatedTranscription = { ...transcription };
        let updatedIndex = getIndexFromArr(updatedTranscription.speakers, "id", selectedEditSpeakerId);
        if (updatedSpeaker.length) updatedTranscription.speakers[updatedIndex].label = updatedSpeaker;
        else updatedTranscription.speakers.splice(updatedIndex, 1);
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
        let updatedTranscription = { ...transcription };
        let updatedSpeakerTags = updatedTranscription.speakerTags;
        let updatedIndex = getIndexFromArr(updatedSpeakerTags, "id", speakerTagId)
        let updatedSpeakerTag = updatedSpeakerTags[updatedIndex];
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
            document.getElementById(activeWordId.current)?.classList.remove("activeWord");
            document.getElementById(firstWordId).classList.add("activeWord");
            activeWordId.current = firstWordId;
            dispatch(setIsPlaying(true))
            let time = speakerTagStartTime == 0 ? 0.000001 : speakerTagStartTime;
            EventBus.dispatch(TIME_UPDATE_OUTSIDE, { time, mediaId: selectedMediaId });
            // make other speakerTag paused
            let speakerTagPlayBtns = document.getElementsByClassName('allSpeakerTagPlayBtn');
            for (let i = 0; i < speakerTagPlayBtns.length; i++) speakerTagPlayBtns[i].style.display = "flex";
            let speakerTagPauseBtns = document.getElementsByClassName('allSpeakerTagPauseBtn');
            for (let i = 0; i < speakerTagPauseBtns.length; i++) speakerTagPauseBtns[i].style.display = "none"
            // make clicked speakerTag play
            document.getElementById(playBtnId).style.display = "none";
            document.getElementById(pauseBtnId).style.display = "flex";
        }
    }

    const onClickWord = (e) => {
        let time = e.target.dataset.start == 0 ? 0.000001 : e.target.dataset.start;
        EventBus.dispatch(TIME_UPDATE_OUTSIDE, { time, mediaId: selectedMediaId });
    }

    const getWords = (range) => {
        let startId = range[0];
        let endId = range[1];
        if (transcription.words == undefined) return;
        let element = [];
        let wordCurrentId = startId;
        while (true) {
            let word = getItemFromArr(transcription.words, "id", wordCurrentId);
            let rawFontSize = Math.ceil(zoomTranscriptNum / 100 * DEFAULT_FONT_SIZE);
            element.push(
                <span
                    key={word.id}
                    id={word.id}
                    data-start={word.startTime}
                    data-duration={word.endTime - word.startTime}
                    onClick={onClickWord}
                    style={{ fontSize: (rawFontSize % 2 == 1 ? (rawFontSize + 1) : rawFontSize) + "px" }}
                >
                    {" " + word.word}
                </span>
            )
            if (word.id == endId || word.nextId == "") break;
            wordCurrentId = word.nextId;
        }
        return element;
    }

    const getSpeakerTags = (range, hideSpeaker) => {
        if (transcription.speakerTags == undefined || transcription.speakers == undefined) return;
        let element = [];
        if (hideSpeaker) {
            element.push(
                <div key={uuidv4()}>
                    <p className="text-custom-gray w-full h-auto text-justify">
                        {getWords(range)}
                    </p>
                </div>
            )
        } else 
            for (let i = 0; i < range.length; i++) {
                let speakerTagCurrentId = range[i];
                let speakerTag = getItemFromArr(transcription.speakerTags, "id", speakerTagCurrentId);
                let curSpeaker = getItemFromArr(transcription.speakers, "id", speakerTag.speakerId);
                let speakerTagAddSpeakerInputId = speakerTag.id + "-addInputId";
                let speakerTagPlayBtnId = speakerTag.id + "-playBtnId";
                let speakerTagPauseBtnId = speakerTag.id + "-pauseBtnId";
                element.push(
                    <div key={speakerTag.id} className={`${speakerMethod ? "flex" : ""} ${hideSpeaker ? "" : "gap-2"}`}>
                        <div contentEditable={false} className={`${hideSpeaker ? "hidden" : ""} select-none text-custom-sky text-sm ${speakerMethod ? "w-40" : "flex gap-2"}`}>
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
                        <p className="text-custom-gray w-full h-auto text-justify">
                            {getWords(speakerTag.range)}
                        </p>
                    </div>
                )
            }
        return element;
    }

    const getSectionTags = () => {
        let element = [];
        let sectionTagCurrentId = transcription.sectionTags[0].id;
        while (true) {
            let sectionTag = getItemFromArr(transcription.sectionTags, "id", sectionTagCurrentId);
            element.push(
                <div key={sectionTag.id}>
                    <input contentEditable={false} className={`text-black outline-none focus:border-2 focus:border-custom-medium-gray text-base mb-2 ${sectionTag.showHeading ? "" : "hidden"}`} value={sectionTag.label} onChange={(e) => setSectionHeading(e.target.value)}/>
                        <div className="grid gap-4">
                            {getSpeakerTags(sectionTag.range, sectionTag.isWordGroup)}
                        </div>
                    <p contentEditable={false} className={`text-custom-black text-xs mt-2 ${sectionTag.showHeading ? "" : "hidden"}`} >- End of {sectionTag.label} -</p>
                </div>
            )
            if (sectionTag.nextId == "") break;
            sectionTagCurrentId = sectionTag.nextId;
        }
        return element;
    }

    return (
        <TFadeInOut show={showFade} duration={300} className="outline-none">
            {transcription.sectionTags && transcription.sectionTags.length != 0 && getSectionTags()}
        </TFadeInOut>
    )
}

export default TSection;
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setIsPlaying } from "@/redux-toolkit/reducers/Media";

import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";

import { HiMiniUser } from "react-icons/hi2";
import { AiFillCaretDown, AiOutlineDelete } from "react-icons/ai";
import { BiPlay, BiPencil, BiPause } from "react-icons/bi";

import { EventBus, getIndexFromArr, getItemFromArr, getModifierState, msToTime } from "@/utils/Functions";
import { KEY_DOWN, TIME_UPDATE_OUTSIDE } from "@/utils/Constant";

import { v4 as uuidv4 } from "uuid";

const TSpeakerTag = (props) => {
    const dispatch = useDispatch();

    const { speakerTag, getWords, transcription, setTranscription, newSpkTgId, setNewSpkTgId } = props;
    const { speakerMethod } = useSelector((state) => state.editor);

    const [showAddSpeaker, setShowAddSpeaker] = useState(false);
    const [selectedEditSpeakerId, setSelectedEditSpeakerId] = useState("");
    const [newSpeaker, setNewSpeaker] = useState("");
    const [updatedSpeaker, setUpdatedSpeaker] = useState("");
    const [tagOpen, setTagOpen] = useState(newSpkTgId === speakerTag.id);
    const [fcsdSpk, setFcsdSpk] = useState(0);
    
    const curSpeaker = getItemFromArr(transcription.speakers, "id", speakerTag.speakerId);
    const speakerTagAddSpeakerInputId = speakerTag.id + "-addInputId";
    const speakerTagPlayBtnId = speakerTag.id + "-playBtnId";
    const speakerTagPauseBtnId = speakerTag.id + "-pauseBtnId";
    const ADD_SPEAKER_P = -1;

    useEffect(() => {
        setTagOpen(newSpkTgId === speakerTag.id);
    }, [newSpkTgId])

    const onKeyDown = (e) => {
        let modifier = getModifierState(e);
        if (newSpkTgId.length === 0) return true;
        if (e.keyCode === 9 && modifier === "") {
            e.preventDefault();
            if (fcsdSpk === (transcription.speakers.length - 1)) setFcsdSpk(ADD_SPEAKER_P);
            else if (fcsdSpk !== ADD_SPEAKER_P) setFcsdSpk(fcsdSpk + 1);
        } else if (e.keyCode === 13 && modifier === '') {
            e.preventDefault();
            if (fcsdSpk !== ADD_SPEAKER_P) {
                changeSpeakerId(speakerTag.id, transcription.speakers[fcsdSpk]?.id)
            } else {
                document.getElementsByClassName("focusSpeaker")[0].click();
            }
        }
    }

    useEffect(() => {
        if (newSpkTgId.length > 0) {
            if (tagOpen) {
                setFcsdSpk(transcription.speakers.length === 0 ? ADD_SPEAKER_P : 0);
            } else {
                setNewSpkTgId('');
                setFcsdSpk(-2);
            }
        }
    }, [tagOpen])

    const addNewSpeaker = () => {
        setShowAddSpeaker(false);
        if (newSpeaker.length) {
            let updatedTranscription = { ...transcription };
            let newTagId = uuidv4()
            updatedTranscription.speakers.push({ id: newTagId, label: newSpeaker });
            changeSpeakerId(speakerTag.id, newTagId)
            setTranscription(updatedTranscription);
        }
    }

    const editSpeakerById = () => {
        let updatedTranscription = { ...transcription };
        let updatedIndex = getIndexFromArr(updatedTranscription.speakers, "id", selectedEditSpeakerId);
        if (updatedSpeaker.length) updatedTranscription.speakers[updatedIndex].label = updatedSpeaker;
        else updatedTranscription.speakers.splice(updatedIndex, 1);
        setTranscription(updatedTranscription);
        setSelectedEditSpeakerId("");
    }

    const onClickAddSpeaker = (id) => {
        // debugger
        setSelectedEditSpeakerId("");
        setShowAddSpeaker(true);
        setNewSpeaker("");
        setTimeout(() => {
            document.getElementById(id).focus();
        }, 10)
    }

    const onClickEditSpeaker = (speaker, editInputId) => {
        setShowAddSpeaker(false);
        setSelectedEditSpeakerId(speaker.id);
        setUpdatedSpeaker(speaker.label);
        setTimeout(() => {
            document.getElementById(editInputId).select();
        }, 10)
    }

    const onEditKeyDown = (e) => {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13) editSpeakerById();
    }

    const onAddKeyDown = (e) => {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13) addNewSpeaker();
    }

    const changeSpeakerId = (speakerTagId, newSpeakerId) => {
        let updatedTranscription = { ...transcription };
        let updatedSpeakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', speakerTagId);
        updatedSpeakerTag.speakerId = newSpeakerId;
        setTranscription(updatedTranscription);
        setNewSpkTgId('');
        setFcsdSpk(-2);
    }

    const onToggleSpeakerTagPlay = (speakerTagStartTime, playBtnId, pauseBtnId) => {
        if (document.getElementById(playBtnId).style.display === "none") {    // make pause
            document.getElementById(playBtnId).style.display = "flex";
            document.getElementById(pauseBtnId).style.display = "none";
            dispatch(setIsPlaying(false));
        } else {    // make play
            let time = speakerTagStartTime;
            EventBus.dispatch(TIME_UPDATE_OUTSIDE, { time });
            dispatch(setIsPlaying(true))
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

    return (
        <div className={`${speakerMethod ? "flex" : ""} `}>
            <div contentEditable={false} className={`select-none text-custom-sky text-sm ${speakerMethod ? "w-40" : "flex gap-2"}`}>
                <Popover placement="bottom" open={tagOpen} handler={setTagOpen}>
                    <PopoverHandler onClick={() => { setSelectedEditSpeakerId("");  setShowAddSpeaker(false)}}>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <HiMiniUser />
                            {curSpeaker.label === undefined ? <p className="text-custom-medium-gray">(New Speaker)</p> : <p>{curSpeaker.label}</p> }
                            <AiFillCaretDown />
                        </div>
                    </PopoverHandler>
                    <PopoverContent className="w-52 z-50 select-none" onKeyDown={onKeyDown}>
                        {
                            transcription.speakers.map((speaker, index) => {
                                const editSpeakerLabelInputId = speakerTag.id + "-" + speaker.id + "-editInputId";
                                return (
                                    <div key={speakerTag.id + "-" + speaker.id} >
                                        <div className={`${selectedEditSpeakerId === speaker.id ? "hidden" : ""} w-full justify-between flex py-1`}>
                                            <p className={`${fcsdSpk === index ? "focusSpeaker" : ""} ${curSpeaker.id === speaker.id ? "text-custom-sky" : "text-custom-black"} text-sm cursor-pointer`}
                                                onClick={() => changeSpeakerId(speakerTag.id, speaker.id)}
                                            >
                                                {speaker.label}
                                            </p>
                                            <BiPencil className="text-xs self-center text-custom-sky cursor-pointer" onClick={() => onClickEditSpeaker(speaker, editSpeakerLabelInputId)} />
                                        </div>
                                        <div className={`w-full py-1 flex h-9 gap-1 ${selectedEditSpeakerId === speaker.id ? "" : "hidden"}`}>
                                            <input
                                                id={editSpeakerLabelInputId}
                                                onKeyDown={onEditKeyDown}
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
                            <div className={`${showAddSpeaker ? "hidden" : ""} py-1 flex items-center justify-between`}>
                                <p className={`${fcsdSpk === -1 ? "focusSpeaker" : ""} text-custom-sky text-sm cursor-pointer`} onClick={() => onClickAddSpeaker(speakerTagAddSpeakerInputId)}>+ Add new speaker</p>
                                <AiOutlineDelete className="cursor-pointer text-red-400" onClick={() => changeSpeakerId(speakerTag.id, "")} />
                            </div>
                            <div className={`w-full py-1 flex h-9 gap-1 ${showAddSpeaker ? "" : "hidden"}`}>
                                <input
                                    id={speakerTagAddSpeakerInputId}
                                    onKeyDown={onAddKeyDown}
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
                    <p>{ msToTime(getItemFromArr(transcription.words, 'id', speakerTag.range[0]).startTime) }</p>
                    <div className="cursor-pointer w-12" onClick={() => onToggleSpeakerTagPlay(getItemFromArr(transcription.words, 'id', speakerTag.range[0]).startTime, speakerTagPlayBtnId, speakerTagPauseBtnId)}>
                        <div id={speakerTagPlayBtnId} className="flex items-center allSpeakerTagPlayBtn"><BiPlay /><p className=" self-center">Play</p></div>
                        <div id={speakerTagPauseBtnId} className="flex items-center allSpeakerTagPauseBtn" style={{display: "none"}}><BiPause /><p>Pause</p></div>
                    </div>
                </div>
            </div>
            <p className="text-custom-gray w-full h-auto text-left">
                {getWords(speakerTag.range)}
            </p>
        </div>
    );
}

export default TSpeakerTag;
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addSpeaker, editSpeaker } from "../../../redux-toolkit/reducers/Speaker";

// material
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

// icons
import { HiMiniUser } from "react-icons/hi2";
import { AiFillCaretDown } from "react-icons/ai";
import { BiPlay, BiPause, BiPencil } from "react-icons/bi";

const TSection = ({ sectionTitle }) => {
    const dispatch = useDispatch();
    const editRef = useRef(null);
    const addRef = useRef(null);
    
    const { speakerMethod, speakers } = useSelector((state) => state.speaker); //true: left, false: right
    const { zoomTranscriptNum } = useSelector((state) => state.editor); //true: left, false: right
    const [showAddSpeaker, setShowAddSpeaker] = useState(false);
    const [newSpeaker, setNewSpeaker] = useState("");
    const [play, setPlay] = useState(false);
    const [selectedEditSpeakerId, setSelectedEditSpeakerId] = useState(-1);
    const [updatedSpeaker, setUpdatedSpeaker] = useState("");
    const [selectedSpeakerId, setSelectedSpeakerId] = useState(-1);
    const [sectionHeading, setSectionHeading] = useState(sectionTitle);

    const editSpeakerById = () => {
        dispatch(editSpeaker({ id: selectedEditSpeakerId, val: updatedSpeaker }));
        setSelectedEditSpeakerId(-1);
    }

    const onClickAddSpeaker = () => {
        setShowAddSpeaker(true);
        setTimeout(() => {
            addRef.current.focus();
        }, 100)
    }

    const onClickEditSpeaker = (speaker, index) => {
        setSelectedEditSpeakerId(index);
        setUpdatedSpeaker(speaker);
        setTimeout(() => {
            editRef.current.focus();
        }, 100);
    }

    const addNewSpeaker = () => {
        setShowAddSpeaker(false);
        dispatch(addSpeaker(newSpeaker));
        setNewSpeaker("");
    }

    const onEditKeyUp = (e) => {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13) editSpeakerById();
    }

    const onAddKeyUp = (e) => {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13) addNewSpeaker();
    }
    
    return (
        <div>
            <input className={`text-black outline-none focus:border-2 focus:border-custom-medium-gray text-base mb-2 ${sectionHeading.length == 0 ? "hidden" : ""}`} value={sectionHeading} onChange={(e) => setSectionHeading(e.target.value)}/>
            <div className={`${speakerMethod ? "flex" : ""} gap-2`}>
                <div className={`text-custom-sky text-sm ${speakerMethod ? "w-40" : "flex gap-2"}`}>
                    <Popover placement="bottom">
                        <PopoverHandler>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <HiMiniUser />
                                <p>{ selectedSpeakerId == -1 ? "(Speaker)" : speakers[selectedSpeakerId] }</p>
                                <AiFillCaretDown />
                            </div>
                        </PopoverHandler>
                        <PopoverContent className="w-52 z-50">
                            {
                                speakers.map((speaker, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={`${selectedEditSpeakerId == index ? "hidden" : ""} w-full justify-between flex py-1`}>
                                                <p className="text-custom-black text-sm cursor-pointer" onClick={() => setSelectedSpeakerId(index)}>{ speaker }</p>
                                                <BiPencil className="text-xs self-center text-custom-sky cursor-pointer" onClick={() => onClickEditSpeaker(speaker, index)} />
                                            </div>
                                            <div className={`w-full py-1 flex h-9 gap-1 ${selectedEditSpeakerId == index ? "" : "hidden"}`}>
                                                <input ref={editRef} onKeyUp={onEditKeyUp} value={updatedSpeaker} onChange={(e) => setUpdatedSpeaker(e.target.value)} className="h-full w-full rounded border border-custom-sky pl-3 bg-transparent text-sm font-normal text-blue-gray-700 outline outline-0 transition-all"/>
                                                <button onClick={editSpeakerById} className="rounded bg-custom-sky px-3 text-xs font-bold text-white">Save</button>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <div>
                                <div className={`${showAddSpeaker ? "hidden" : ""} py-1`} onClick={onClickAddSpeaker}>
                                    <p className="text-custom-sky text-sm cursor-pointer">+ Add new speaker</p>
                                </div>
                                <div className={`w-full py-1 flex h-9 gap-1 ${showAddSpeaker ? "" : "hidden"}`}>
                                    <input ref={addRef} onKeyUp={onAddKeyUp} value={newSpeaker} onChange={(e) => setNewSpeaker(e.target.value)} className="h-full w-full rounded border border-custom-sky pl-3 bg-transparent text-sm font-normal text-blue-gray-700 outline outline-0 transition-all"/>
                                    <button onClick={addNewSpeaker} className="rounded bg-custom-sky px-3 text-xs font-bold text-white">Save</button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <div className={`flex gap-2 items-center ${speakerMethod ? "mt-2" : ""}`}>
                        <p>00:14:30</p>
                        <div className="flex cursor-pointer items-center w-12" onClick={() => setPlay(!play)}>
                            { play ? <><BiPause /><p>Pause</p></> : <><BiPlay /><p>Play</p></>}
                        </div>
                    </div>
                </div>
                <p style={{fontSize: (Math.ceil(zoomTranscriptNum/100*13) % 2 == 1 ? (Math.ceil(zoomTranscriptNum/100*13) + 1) : Math.ceil(zoomTranscriptNum/100*13)) + "px"}} className={` text-custom-gray w-full h-auto`} >Nam quis dui varius, commodo justo eget, sagittis odio. Nullam ut turpis commodo, tempor lacus quis, iaculis nibh. Pellentesque et erat ac lacus faucibus scelerisque. Fusce eget dignissim odio. Suspendisse rutrum erat in lobortis porta. Nullam pellentesque bibendum eros, in elementum ante consectetur sit amet. Mauris ultricies consequat tortor, non porta lacus iaculis. Quisque pharetra porta tellus, id lacinia odio semper euismod. Phasellus ut ornare massa, id pharetra lacus. Ut bibendum consequat lectus vel feugiat. Nam eu justo nec est efficitur aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nam quis dui varius, commodo justo eget, sagittis odio. Nullam ut turpis commodo, tempor lacus quis, iaculis nibh. Pellentesque et erat ac lacus faucibus scelerisque. Fusce eget dignissim odio. Suspendisse rutrum erat in lobortis porta. Nullam pellentesque bibendum eros, in elementum ante consectetur sit amet. Mauris ultricies consequat tortor, non porta lacus iaculis. Quisque pharetra porta tellus, id lacinia odio semper euismod. Phasellus ut ornare massa, id pharetra lacus. Ut bibendum consequat lectus vel feugiat. Nam eu justo nec est efficitur aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <p className={` text-custom-black text-sm mt-2 ${sectionHeading.length == 0 ? "hidden" : ""}`} >- End of {sectionHeading} -</p>
        </div>
    )
}

export default TSection;
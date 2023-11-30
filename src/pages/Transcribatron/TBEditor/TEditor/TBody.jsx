import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
// redux
import { useSelector } from "react-redux";

import TSectionTag from "./TSectionTag";

// Components
import DVFadeInOut from "@/Components/DVFadeInOut";
import { toast } from "react-hot-toast";

// services
import MediaService from "@/services/media";

// utils
import { EventBus, getIndexFromArr, getItemFromArr, isEmpty, getModifierState } from "@/utils/Functions";
import { SET_LOADING, BOLD, FONT_COLOR, HIGHLIGHT_BG, ITALIC, UNDERLINE, GRAY, SPEAKER_TAG, WORD, TIME_SLIDE_DRAG, DEBUG_MODE, KEY_CTRL, KEY_SHIFT, NEW_LINE_SIGN, SELECTION_CHANGE, LISTENING_CHANGES, SAVED, SAVING } from "@/utils/Constant";
import { Caret } from "@/utils/Caret";

import { v4 as uuidv4 } from "uuid";

var track;
var trackIndex;

var lastSavedTime;
var typingTimer;
const SAVING_DUR = 3000;
const UNTYPING_DUR = 1000;

var newSpkerTagId = '';

var pendingUploading;

const TBody = ({actionStyle, changeStyle, changedFontClr, changedHighlightClr, undo, redo, setEnableUndo, setEnableRedo, setSavingStatus, setLastSavedTime, setEditorResized, clickedInsSection}) => {
    const { fileId } = useParams();

    const lastSelectedWordRange = useRef();
    const willChangedSelection = useRef({});
    const wasTimeSlideDrag = useRef(false);

    const { zoomTranscriptNum } = useSelector((state) => state.editor);
    const { isPlaying, currentTime } = useSelector((state) => state.media);
    const [showFade, setShowFade] = useState(false);
    const [transcription, setTranscription] = useState({});
    const [activeWordId, setActiveWordId] = useState();
    const [newSpkTgId, setNewSpkTgId] = useState();

    useEffect(() => {
        if (fileId === undefined) return;
        EventBus.dispatch(SET_LOADING, true);
        setShowFade(false);
        MediaService.getTranscriptionByFileId(fileId) // get transcription data
            .then((res) => {
                if (res.status === 200) {
                    let data = res.data;
                    if (!("sectionTags" in data) || (('sectionTags' in data) && data.sectionTags.length === 0)) {
                        let sectionTags = [];
                        let wordCurrentId = "", speakerTagCurrentIndex = -1, previewTag = "", newSectionTagRange = "", prevSectionTagId = "", curTag = "";
                        wordCurrentId = getFirstItem(data.words).id;
                        while (true) {
                            let word = getItemFromArr(data.words, "id", wordCurrentId);
                            if (isEmpty(word)) break;
                            if (isEmpty(word.startTime) || isEmpty(word.endTime)) {
                                let prevWord = getItemFromArr(data.words, 'id', word.prevId);
                                let nextWord = getItemFromArr(data.words, 'id', word.nextId);
                                if (!isEmpty(prevWord) && isEmpty(nextWord)) prevWord.nextId = '';
                                else if (isEmpty(prevWord) && !isEmpty(nextWord)) nextWord.prevId = word.prevId;
                                else if (!isEmpty(prevWord) && !isEmpty(nextWord)) {
                                    prevWord.nextId = nextWord.id;
                                    nextWord.prevId = prevWord.id;
                                }
                                let wordIndex = getIndexFromArr(data.words, 'id', word.id);
                                data.words.splice(wordIndex, 1);
                                if (word.nextId === "") break;
                                wordCurrentId = word.nextId;
                                continue;
                            }
                            if (speakerTagCurrentIndex < 0) {
                                let i = 0;
                                for (; i < data.speakerTags.length; i++) {
                                    const speakerTag = data.speakerTags[i];
                                    if (wordCurrentId === speakerTag.range[0]) {
                                        speakerTagCurrentIndex = i;
                                        curTag = SPEAKER_TAG;
                                        break;
                                    }
                                }
                                if (i === data.speakerTags.length) curTag = WORD;
                            } else if (wordCurrentId === data.speakerTags[speakerTagCurrentIndex].range[1]) {
                                newSectionTagRange.push(data.speakerTags[speakerTagCurrentIndex].id);
                                speakerTagCurrentIndex = -1;
                            }
                            if (curTag != previewTag || word.nextId === "") {
                                if (previewTag != "") {
                                    let range = [];
                                    if (previewTag === WORD) {
                                        range.push(newSectionTagRange);
                                        range.push(word.nextId === "" ? word.id : word.prevId);
                                    } else
                                        range = newSectionTagRange;
                                    let newSectionTagId = uuidv4();
                                    sectionTags.push({
                                        id: newSectionTagId,
                                        label: "Section" + (sectionTags.length + 1),
                                        nextId: "",
                                        prevId: prevSectionTagId,
                                        range,
                                        isWordGroup: previewTag === WORD,
                                        showHeading: false
                                    })
                                    let prevSectionTag = getItemFromArr(sectionTags, "id", prevSectionTagId);
                                    if (!isEmpty(prevSectionTag)) prevSectionTag.nextId = newSectionTagId;
                                    prevSectionTagId = newSectionTagId;
                                }
                                if (curTag === WORD) newSectionTagRange = wordCurrentId;
                                else newSectionTagRange = [];
                                previewTag = curTag;
                            }
                            if (word.nextId === "") break;
                            wordCurrentId = word.nextId;
                        }
                        data.sectionTags = sectionTags;
                    } else if (('sectionTags' in data) && data.sectionTags.length > 0) {
                        data.sectionTags.map((sectionTag) => {
                            let delThisTag = false;
                            if (!('label' in sectionTag)) sectionTag.label = 'Untitled Section';
                            if (!('isWordGroup' in sectionTag)) delThisTag = true;
                            if (!('showHeading' in sectionTag)) sectionTag.showHeading = false;
                            if (!('range' in sectionTag)) delThisTag = true;
                            else if (sectionTag.range.length === 0) delThisTag = true;
                            else {
                                if (sectionTag.isWordGroup) {
                                    if(isEmpty(getItemFromArr(data.words, 'id', sectionTag.range[0])) || isEmpty(getItemFromArr(data.words, 'id', sectionTag.range[1]))) delThisTag = true
                                } else {
                                    let delSectionTagRangeIndexs = [];
                                    sectionTag.range.map((item, index) => {
                                        if (isEmpty(getItemFromArr(data.speakerTags, 'id', item))) delSectionTagRangeIndexs.push(index);
                                    })
                                    delSectionTagRangeIndexs.map((delIndex, i) => {
                                        sectionTag.range.splice(delIndex - i, 1);
                                    })
                                }
                            }
                            if (delThisTag) {
                                let prevTag = getItemFromArr(data.sectionTags, 'id', sectionTag.prevId);
                                let nextTag = getItemFromArr(data.sectionTags, 'id', sectionTag.nextId);
                                if (isEmpty(prevTag) && !isEmpty(nextTag)) nextTag.prevId = '';
                                else if (!isEmpty(prevTag) && isEmpty(nextTag)) prevTag.nextId = '';
                                else if (!isEmpty(prevTag) && !isEmpty(nextTag)) {
                                    prevTag.nextId = nextTag.id;
                                    nextTag.prevId = prevTag.id;
                                }
                                let delIndex = getIndexFromArr(data.sectionTags, 'id', sectionTag.id);
                                data.sectionTags.splice(delIndex, 1);
                            }
                        })
                    }
                    if (("speakerTags" in data) && data.speakerTags.length !== 0) {
                        let delSpeakerTagIndexs = [];
                        data.speakerTags.map((speakerTag, index) => {
                            if (isEmpty(getItemFromArr(data.words, 'id', speakerTag.range[0])) || isEmpty(getItemFromArr(data.words, 'id', speakerTag.range[1]))) delSpeakerTagIndexs.push(index);
                            // if ('startTime' in speakerTag) delete speakerTag.startTime;
                        })
                        delSpeakerTagIndexs.map((delIndex, i) => {
                            data.speakerTags.splice(delIndex - i, 1);
                        })
                    }
                    if (("speakers" in data) && data.speakers.length !== 0) {
                        let delSpeakerIndexs = [];
                        data.speakers.map((speaker, index) => {
                            let i = 0;
                            for (; i < data.speakerTags.length; i++) if (data.speakerTags[i].speakerId === speaker.id) break;
                            if (i === data.speakerTags.length) delSpeakerIndexs.push(index);
                        })
                        delSpeakerIndexs.map((delIndex, i) => {
                            data.speakers.splice(delIndex - i, 1);
                        })
                    }
                    let newTrans = {
                        words: data.words,
                        speakers: data.speakers,
                        speakerTags: data.speakerTags,
                        sectionTags: data.sectionTags,
                        lastSavedTime: data?.lastSavedTime || new Date().getTime()
                    }
                    track = { transcriptions: [JSON.parse(JSON.stringify(newTrans))] };
                    trackIndex = 0;
                    pendingUploading = [];

                    setSavingStatus(SAVED);
                    setLastSavedTime(newTrans.lastSavedTime);

                    setEnableUndo(false);
                    setEnableRedo(false);

                    setTranscription(newTrans);
                } else if (res.status === 400) {
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
                if (DEBUG_MODE) console.log(err);
                setTranscription({});
                EventBus.dispatch(SET_LOADING, false);
                setShowFade(true);
            })
        
        const onTimeSlideDrag = () => {
            wasTimeSlideDrag.current = true;
        }
        EventBus.on(TIME_SLIDE_DRAG, onTimeSlideDrag);

        const onSelectionChange = (e) => {
            let selection = document.getSelection();
            if (isCaretInEditor(selection)) lastSelectedWordRange.current = selection.getRangeAt(0);
        }
        document.addEventListener(SELECTION_CHANGE, onSelectionChange);

        return () => {
            EventBus.remove(TIME_SLIDE_DRAG, onTimeSlideDrag);
            document.removeEventListener(SELECTION_CHANGE, onSelectionChange);
        }
    }, [fileId])

    useEffect(() => {
        if (DEBUG_MODE) console.log("transcriptionUpdate>>>>", transcription);
        if (!isEmpty(willChangedSelection.current)) {
            let range = willChangedSelection.current;
            let startEle, endEle;
            if (getItemFromArr(transcription.words, 'id', range.startWordId).hasBr) startEle = document.getElementById(range.startWordId)?.childNodes[1];
            else startEle = document.getElementById(range.startWordId)?.childNodes[0];
            if (getItemFromArr(transcription.words, 'id', range.endWordId).hasBr) endEle = document.getElementById(range.endWordId)?.childNodes[1];
            else endEle = document.getElementById(range.endWordId)?.childNodes[0];
            if(startEle != undefined && endEle != undefined && range.startOffset >= 0 && range.endOffset >= 0) Caret.doChange(startEle, range.startOffset, endEle, range.endOffset);
            // willChangedSelection.current = {};
        }

        setNewSpkTgId(newSpkerTagId);

        setEditorResized(new Date().getTime());
    }, [transcription])

    useEffect(() => {
        newSpkerTagId = newSpkTgId;
    }, [newSpkTgId])

    const getBelongedTag = (updatedTranscription, wordId) => {
        let searchingWord = getItemFromArr(updatedTranscription.words, 'id', wordId);
        if (isEmpty(searchingWord)) return {};
        let lastSectionTagId = '', lastSectionTagRangeIndex = -1, lastSpeakerTagId = '', lastSpeakerTagRangeIndex = -1, isPassLastSection = true, isPassLastSpeaker = true;
        let wordCurrentId = getFirstItem(updatedTranscription.words).id;
        while (true) {
            let word = getItemFromArr(updatedTranscription.words, 'id', wordCurrentId);
            if (isEmpty(word)) break;
            if (isPassLastSection) {
                let sectionTagCurrentId = getFirstSectionTag(updatedTranscription).id;
                while (true) {
                    let sectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', sectionTagCurrentId);
                    if (isEmpty(sectionTag)) break;
                    if (sectionTag.isWordGroup) {
                        if (sectionTag.range[0] === word.id) {
                            lastSectionTagId = sectionTag.id;
                            lastSectionTagRangeIndex = 0;
                            isPassLastSection = sectionTag.range[0] === sectionTag.range[1];
                            break;
                        }
                    } else {
                        let i = 0;
                        for (; i < sectionTag.range.length; i++) {
                            let speakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', sectionTag.range[i]);
                            if (speakerTag.range[0] === word.id) {
                                lastSectionTagId = sectionTag.id;
                                lastSectionTagRangeIndex = i === 0 ? 0 : -1;
                                lastSpeakerTagId = speakerTag.id;
                                lastSpeakerTagRangeIndex = 0;
                                isPassLastSection = speakerTag.range[0] === speakerTag.range[1] && i === (sectionTag.range - 1);
                                isPassLastSpeaker = speakerTag.range[0] === speakerTag.range[1];
                                break;
                            }
                        }
                        if (i < sectionTag.range.length) break;
                    }
                    if (sectionTag.nextId === '') break;
                    sectionTagCurrentId = sectionTag.nextId;
                }
            } else {
                let lastSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', lastSectionTagId);
                if (!isEmpty(lastSectionTag)) {
                    if (lastSectionTag.isWordGroup) {
                        if (lastSectionTag.range[1] === word.id) {
                            lastSectionTagRangeIndex = 1;
                            isPassLastSection = true;
                        } else {
                            lastSectionTagRangeIndex = -1;
                        }
                    } else {
                        if (isPassLastSpeaker) {
                            for (let i = 0; i < lastSectionTag.range.length; i++) {
                                let speakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', lastSectionTag.range[i]);
                                if (speakerTag.range[0] === word.id) {
                                    lastSpeakerTagId = speakerTag.id;
                                    lastSpeakerTagRangeIndex = 0;
                                    lastSectionTagRangeIndex = i === 0 ? 0 : -1;
                                    isPassLastSpeaker = speakerTag.range[0] === speakerTag.range[1];
                                    isPassLastSection = speakerTag.range[0] === speakerTag.range[1] && i === (lastSectionTag.range.length - 1);
                                    break;
                                }
                            }
                        } else {
                            let lastSpeakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', lastSpeakerTagId);
                            if (lastSpeakerTag.range[1] === word.id) {
                                lastSpeakerTagRangeIndex = 1;
                                lastSectionTagRangeIndex = lastSectionTag.range[lastSectionTag.range.length - 1] === lastSpeakerTagId ? 1 : lastSectionTagRangeIndex;
                                isPassLastSpeaker = true;
                                isPassLastSection = lastSectionTag.range[lastSectionTag.range.length - 1] === lastSpeakerTagId;
                            } else {
                                lastSpeakerTagRangeIndex = -1;
                                lastSectionTagRangeIndex = -1;
                            }
                        }
                    }
                }
            }
            if (searchingWord.id === word.id || word.nextId === '') break;
            wordCurrentId = word.nextId;
        }
        return { sectionTagId: lastSectionTagId, sectionTagRangeIndex: lastSectionTagRangeIndex, speakerTagId: lastSpeakerTagId, speakerTagRangeIndex: lastSpeakerTagRangeIndex };
    }

    // get the first wordId from the given range
    const getFirstItem = (arr) => {
        let temp = [];
        for (let i = 0; i < arr.length; i++) if(arr[i].prevId === '') temp.push(arr[i])
        return temp.find((item, index, array) => item.startTime !== null && item.startTime === Math.min(...array.map(obj => obj.startTime)) );
    }

    // get the first sectionTag from the given range
    const getFirstSectionTag = (trans) => {
        let arr = [];
        try {
            trans.sectionTags.map(sectionTag => {
                arr.push({
                    id: sectionTag.id,
                    prevId: sectionTag.prevId,
                    nextId: sectionTag.nextId,
                    startTime: sectionTag.isWordGroup
                        ? getItemFromArr(trans.words, 'id', sectionTag.range[0]).startTime
                        : getItemFromArr(trans.words, 'id', getItemFromArr(trans.speakerTags, 'id', sectionTag.range[0] || '').range[0] || '').startTime || 0
                });
            })
        } catch (e) {
            DEBUG_MODE && console.log(e);
        }

        return getFirstItem(arr);
    }

    // check if the caret is in editor at the current
    const isCaretInEditor = (range) => {
        if (!range?.anchorNode) return !!range.startContainer?.parentNode?.classList?.contains('word');
        else return !!range.anchorNode.parentNode?.classList?.contains('word');
    }

    const isCaretInTagPole = (updatedTranscription, wordId, offset) => {
        let word = getItemFromArr(updatedTranscription.words, 'id', wordId);
        let belongedTag = getBelongedTag(updatedTranscription, wordId);
        let belongedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedTag.sectionTagId);
        if ((belongedSectionTag.isWordGroup && ((belongedTag.sectionTagRangeIndex === 0 && offset === 1) ||
                                                (belongedTag.sectionTagRangeIndex === 1 && offset === (word.word.length + 1)))) ||
            (!belongedSectionTag.isWordGroup && ((belongedTag.speakerTagRangeIndex === 0 && offset === 1) ||
                                                (belongedTag.speakerTagRangeIndex === 1 && offset === (word.word.length + 1)))))
            return true;
    }

    const isAvailableOnSplit = (updatedTranscription, wordId, offset) => {
        return offset !== 1 && !isCaretInTagPole(updatedTranscription, wordId, offset);
    }

    const getWordRange = (selection) => {
        if (!isCaretInEditor(selection)) return;
        let range = selection.getRangeAt(0);
        let wordRange = {};
        wordRange.startId = range.startContainer.parentNode.id;
        wordRange.startOffset = range.startOffset;
        wordRange.endId = range.endContainer.parentNode.id;
        wordRange.endOffset = range.endOffset;
        return wordRange;
    }

    const splitTag = async (updatedTranscription, selection) => {
        let wordRange = getWordRange(selection);
        await delWordRange(updatedTranscription, wordRange);
        let offset = willChangedSelection.current.startOffset;
        let word = getItemFromArr(updatedTranscription.words, 'id', willChangedSelection.current.startWordId);
        if (isEmpty(word)) return;
        let belongedTag = getBelongedTag(updatedTranscription, word.id);
        let belongedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedTag.sectionTagId);
        if (isEmpty(belongedSectionTag)) return;
        if (belongedSectionTag.isWordGroup) {
            if ((belongedTag.sectionTagRangeIndex === 0 && offset === 1) || (belongedTag.sectionTagRangeIndex === 1 && offset === (word.word.length + 1))) return;
            // await split SectionTag(updatedTranscription, belongedSectionTag.id);
        } else {
            let belongedSpeakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', belongedTag.speakerTagId);
            if ((belongedSectionTag.range[0] === belongedSpeakerTag.id && belongedTag.speakerTagRangeIndex === 0 && offset === 1) ||
                (belongedSectionTag.range[belongedSectionTag.range.length - 1] === belongedSpeakerTag.id && belongedTag.speakerTagRangeIndex === 1 && offset === (word.word.length + 1)))
                return;
            else if (belongedTag.speakerTagRangeIndex === 0 || belongedTag.speakerTagRangeIndex === 1) {
                // await split SectionTag(updatedTranscription, belongedSectionTag.id);
            } else await splitSpeakerTag(updatedTranscription, belongedSpeakerTag.id, belongedSectionTag.id);
        }
    }

    const createSectionTag = async (updatedTranscription, range, isWordGroup, nextId, prevId) => {
        let prevSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', prevId);
        let nextSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', nextId);
        let newSectionTag = {
            id: uuidv4(),
            label: "Untitled Section",
            nextId,
            prevId,
            range,
            isWordGroup,
            showHeading: true
        }
        if (!isEmpty(prevSectionTag)) prevSectionTag.nextId = newSectionTag.id;
        if (!isEmpty(nextSectionTag)) nextSectionTag.prevId = newSectionTag.id;
        updatedTranscription.sectionTags.splice(updatedTranscription.sectionTags.length, 0, newSectionTag);
    }

    const mergeSectionTag = async (updatedTranscription, firstSectionTag, secondSectionTag) => {
        if (firstSectionTag.isWordGroup) {
            if (secondSectionTag.isWordGroup) {
                firstSectionTag.range[1] = secondSectionTag.range[1];
                await delSectionTag(updatedTranscription, secondSectionTag.id);
            } else {
                await createSpeakerTag(updatedTranscription, firstSectionTag.range, firstSectionTag, 0);
                await mergeSectionTag(updatedTranscription, firstSectionTag, secondSectionTag);
            }
        } else {
            if (secondSectionTag.isWordGroup) {
                await createSpeakerTag(updatedTranscription, secondSectionTag.range, secondSectionTag, 0);
                await mergeSectionTag(updatedTranscription, firstSectionTag, secondSectionTag);
            } else {
                firstSectionTag.range = firstSectionTag.range.concat(secondSectionTag.range);
                await delSectionTag(updatedTranscription, secondSectionTag.id);
            }
        }
    }

    const splitSectionTag = async (updatedTranscription) => {
        await splitWord(updatedTranscription);
        let belongedTag = getBelongedTag(updatedTranscription, willChangedSelection.current.startWordId);
        let splittedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedTag.sectionTagId);
        if (splittedSectionTag.isWordGroup) {
            let newRange = [];
            newRange.push(willChangedSelection.current.startWordId);
            newRange.push(splittedSectionTag.range[1]);
            splittedSectionTag.range[1] = getItemFromArr(updatedTranscription.words, 'id', willChangedSelection.current.startWordId).prevId;
            await createSectionTag(updatedTranscription, newRange, true, splittedSectionTag.nextId, splittedSectionTag.id);
        } else {
            if (belongedTag.speakerTagRangeIndex !== 0 && belongedTag.speakerTagRangeIndex !== 1) {
                await splitSpeakerTag(updatedTranscription, belongedTag.speakerTagId, belongedTag.sectionTagId)
                await splitSectionTag(updatedTranscription);
            } else {
                let splitIndex = 0;
                for (; splitIndex < splittedSectionTag.range.length; splitIndex++) if (splittedSectionTag.range[splitIndex] === belongedTag.speakerTagId) break;
                if (belongedTag.speakerTagRangeIndex === 1) splitIndex += 1;
                let newRange = splittedSectionTag.range.slice(splitIndex);
                splittedSectionTag.range = splittedSectionTag.range.slice(0, splitIndex);
                await createSectionTag(updatedTranscription, newRange, false, splittedSectionTag.nextId, splittedSectionTag.id);
            }
        }
    }

    const delSectionTag = async (updatedTranscription, sectionTagId) => {
        let sectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', sectionTagId);
        let prevSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', sectionTag.prevId);
        let nextSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', sectionTag.nextId);
        if (isEmpty(prevSectionTag) && !isEmpty(nextSectionTag)) nextSectionTag.prevId = '';
        else if (!isEmpty(prevSectionTag) && isEmpty(nextSectionTag)) prevSectionTag.nextId = '';
        else if (!isEmpty(prevSectionTag) && !isEmpty(nextSectionTag)) {
            prevSectionTag.nextId = nextSectionTag.id;
            nextSectionTag.prevId = prevSectionTag.id;
        }
        let sectionTagIndex = getIndexFromArr(updatedTranscription.sectionTags, 'id', sectionTag.id);
        updatedTranscription.sectionTags.splice(sectionTagIndex, 1);
    }

    const createSpeakerTag = async (updatedTranscription, range, belongedSectionTag, insertIndex) => {
        let newSpeakerTagId = uuidv4();
        updatedTranscription.speakerTags.push({
            id: newSpeakerTagId,
            speakerId: updatedTranscription.speakers[0]?.id || "",
            range,
        })
        if (belongedSectionTag.isWordGroup) {
            belongedSectionTag.range = [newSpeakerTagId];
            belongedSectionTag.isWordGroup = false;
        } else {
            belongedSectionTag.range.splice(insertIndex, 0, newSpeakerTagId);
        }
        newSpkerTagId = newSpeakerTagId;
    }

    const mergeSpeakerTag = async (updatedTranscription, firstSpeakerTag, secondSpeakerTag, firstBelongedSectionTag, secondBelongedSectionTag) => {
        if (firstBelongedSectionTag.id === secondBelongedSectionTag.id) {
            firstSpeakerTag.range[1] = secondSpeakerTag.range[1];
            await delSpeakerTag(updatedTranscription, secondSpeakerTag.id, secondBelongedSectionTag.id);
        } else {
            await mergeSectionTag(updatedTranscription, firstBelongedSectionTag, secondBelongedSectionTag);
            await mergeSpeakerTag(updatedTranscription, firstSpeakerTag, secondSpeakerTag, firstBelongedSectionTag, firstBelongedSectionTag);
        }
    }

    const splitSpeakerTag = async (updatedTranscription, splittedSpeakerTagId, belongedSectionTagId) => {
        await splitWord(updatedTranscription);
        let splittedSpeakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', splittedSpeakerTagId);
        let newRange = [];
        newRange.push(willChangedSelection.current.startWordId);
        newRange.push(splittedSpeakerTag.range[1]);
        splittedSpeakerTag.range[1] = getItemFromArr(updatedTranscription.words, 'id', willChangedSelection.current.startWordId).prevId;
        let belongedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedSectionTagId);
        let insertIndex = 0;
        for (; insertIndex < belongedSectionTag.range.length; insertIndex++) if (belongedSectionTag.range[insertIndex] === splittedSpeakerTag.id) break;
        createSpeakerTag(updatedTranscription, newRange, belongedSectionTag, insertIndex + 1);
    }

    const delSpeakerTag = async (updatedTranscription, speakerTagId, belongedSectionTagId) => {
        let speakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', speakerTagId);
        if (isEmpty(speakerTag)) return;

        let belongedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedSectionTagId);
        if (belongedSectionTag.range.length === 1) await delSectionTag(updatedTranscription, belongedSectionTag.id);
        else
            for (let i = 0; i < belongedSectionTag.range.length; i++)
                if (belongedSectionTag.range[i] === speakerTag.id) {
                    belongedSectionTag.range.splice(i, 1);
                    break;
                }

        let speakerTagIndex = getIndexFromArr(updatedTranscription.speakerTags, 'id', speakerTag.id);
        updatedTranscription.speakerTags.splice(speakerTagIndex, 1);
    }

    const mergeWord = async (updatedTranscription, firstWordId, secondWordId) => {
        if (firstWordId === '' || secondWordId === '') return;
        let firstWord = getItemFromArr(updatedTranscription.words, 'id', firstWordId);
        let secondWord = getItemFromArr(updatedTranscription.words, 'id', secondWordId);
        let firstWordBelongedTag = getBelongedTag(updatedTranscription, firstWord.id);
        let secondWordBelongedTag = getBelongedTag(updatedTranscription, secondWord.id);
        let firstWordBelongedSection = getItemFromArr(transcription.sectionTags, 'id', firstWordBelongedTag.sectionTagId);
        let secondWordBelongedSection = getItemFromArr(transcription.sectionTags, 'id', secondWordBelongedTag.sectionTagId);
        if (firstWordBelongedTag.sectionTagId === secondWordBelongedTag.sectionTagId) {
            if (firstWordBelongedSection.isWordGroup) {
                willChangedSelection.current = {
                    startWordId: firstWord.id,
                    startOffset: firstWord.word.length + 1,
                    endWordId: firstWord.id,
                    endOffset: firstWord.word.length + 1
                }
                firstWord.word = firstWord.word + secondWord.word;
                firstWord.endTime = secondWord.endTime;
                firstWord.confidence = (firstWord.confidence + secondWord.confidence) / 2;
                await delWord(updatedTranscription, secondWord.id);
            } else {
                if (firstWordBelongedTag.speakerTagId === secondWordBelongedTag.speakerTagId) {
                    willChangedSelection.current = {
                        startWordId: firstWord.id,
                        startOffset: firstWord.word.length + 1,
                        endWordId: firstWord.id,
                        endOffset: firstWord.word.length + 1
                    }
                    firstWord.word = firstWord.word + secondWord.word;
                    firstWord.endTime = secondWord.endTime;
                    firstWord.confidence = (firstWord.confidence + secondWord.confidence) / 2;
                    await delWord(updatedTranscription, secondWord.id);
                } else {
                    let firstWordBelongedSpeaker = getItemFromArr(transcription.speakerTags, 'id', firstWordBelongedTag.speakerTagId);
                    let secondWordBelongedSpeaker = getItemFromArr(transcription.speakerTags, 'id', secondWordBelongedTag.speakerTagId);
                    await mergeSpeakerTag(updatedTranscription, firstWordBelongedSpeaker, secondWordBelongedSpeaker, firstWordBelongedSection, secondWordBelongedSection);
                    await mergeWord(updatedTranscription, firstWordId, secondWordId);
                }
            }
        } else {
            await mergeSectionTag(updatedTranscription, firstWordBelongedSection, secondWordBelongedSection);
            await mergeWord(updatedTranscription, firstWordId, secondWordId);
        }
    }

    const splitWord = async (updatedTranscription) => {
        let { startWordId, startOffset } = willChangedSelection.current;
        let startWord = getItemFromArr(updatedTranscription.words, 'id', startWordId);
        if (!isAvailableOnSplit(updatedTranscription, startWordId, startOffset)) return;
        if ((startOffset - 1) === startWord.word.length) {
            willChangedSelection.current = {
                startWordId: startWord.nextId,
                startOffset: 1,
                endWordId: startWord.nextId,
                endOffset: 1
            }
            return;
        }
        let newWord = {
            id: uuidv4(),
            prevId: startWordId,
            nextId: startWord.nextId,
            word: startWord.word.substring(startOffset - 1),
            startTime: startWord.startTime + (startOffset - 1) / startWord.word.length * (startWord.endTime - startWord.startTime),
            endTime: startWord.endTime,
            confidence: startWord.confidence,
        }
        startWord.nextId = newWord.id;
        startWord.word = startWord.word.substring(0, startOffset - 1);
        startWord.endTime = newWord.startTime;
        let nextWord = getItemFromArr(updatedTranscription.words, 'id', newWord.nextId);
        nextWord.prevId = newWord.id;
        updatedTranscription.words.push(newWord);
        willChangedSelection.current = {
            startWordId: newWord.id,
            startOffset: 1,
            endWordId: newWord.id,
            endOffset: 1
        }
        let belongedTag = getBelongedTag(updatedTranscription, startWord.id);
        let belongedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedTag.sectionTagId);
        if (belongedSectionTag.isWordGroup && belongedTag.sectionTagRangeIndex === 1) belongedSectionTag.range[1] = newWord.id
        else if (!belongedSectionTag.isWordGroup && belongedTag.speakerTagRangeIndex === 1) {
            let speakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', belongedTag.speakerTagId);
            speakerTag.range[1] = newWord.id;
        }
    }

    const delWord = async (updatedTranscription, wordId) => {
        if (wordId === '') return;
        let word = getItemFromArr(updatedTranscription.words, 'id', wordId);
        let belongedTag = getBelongedTag(updatedTranscription, word.id);
        let belongedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedTag.sectionTagId);
        if (belongedSectionTag.isWordGroup) {
            if (belongedSectionTag.range[0] === belongedSectionTag.range[1]) {
                await delSectionTag(updatedTranscription, belongedSectionTag.id);
            } else {
                if (belongedTag.sectionTagRangeIndex === 0) {
                    belongedSectionTag.range[0] = word.nextId;
                } else if (belongedTag.sectionTagRangeIndex === 1) {
                    belongedSectionTag.range[1] = word.prevId;
                }
            }
        } else {
            let belongedSpeakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', belongedTag.speakerTagId);
            if (belongedSpeakerTag.range[0] === belongedSpeakerTag.range[1]) {
                await delSpeakerTag(updatedTranscription, belongedSpeakerTag.id, belongedSectionTag.id);
            } else {
                if (belongedTag.speakerTagRangeIndex === 0) {
                    belongedSpeakerTag.range[0] = word.nextId;
                } else if (belongedTag.speakerTagRangeIndex === 1) {
                    belongedSpeakerTag.range[1] = word.prevId;
                }
            }
        }

        let prevWord = getItemFromArr(updatedTranscription.words, 'id', word.prevId);
        let nextWord = getItemFromArr(updatedTranscription.words, 'id', word.nextId);
        if (isEmpty(prevWord) && !isEmpty(nextWord)) nextWord.prevId = '';
        else if (!isEmpty(prevWord) && isEmpty(nextWord)) prevWord.nextId = '';
        else if (!isEmpty(prevWord) && !isEmpty(nextWord)) {
            prevWord.nextId = nextWord.id;
            nextWord.prevId = prevWord.id;
        }
        let wordIndex = getIndexFromArr(updatedTranscription.words, 'id', word.id);
        updatedTranscription.words.splice(wordIndex, 1);
    }

    const delWordRange = async (updatedTranscription, { startId, startOffset, endId, endOffset }) => {
        if (startId === endId) {
            if (startOffset === endOffset) {
                willChangedSelection.current = {
                    startWordId: startId,
                    startOffset: startOffset,
                    endWordId: endId,
                    endOffset: endOffset
                }
                return;
            }
            let word = getItemFromArr(updatedTranscription.words, 'id', startId);
            let wordEleContent = document.getElementById(word.id)?.textContent || "";
            let wordContent = (wordEleContent.substring(0, startOffset) + wordEleContent.substring(endOffset)).replaceAll('\u00A0', " ").replace(/\s+/g, " ");
            if (wordContent.length === 0 || (wordContent.length === 1 && wordContent.charCodeAt(0) === 32)) {
                let prevWord = getItemFromArr(updatedTranscription.words, 'id', word.prevId);
                willChangedSelection.current = {
                    startWordId: word.prevId,
                    startOffset: prevWord.word.length + 1,
                    endWordId: word.prevId,
                    endOffset: prevWord.word.length + 1
                }
                await delWord(updatedTranscription, word.id);
                return;
            } else if (wordContent.charCodeAt(0) != 32) {
                let prevWord = getItemFromArr(updatedTranscription.words, 'id', word.prevId);
                word.word = wordContent.trim();
                if (isEmpty(prevWord)) {
                    willChangedSelection.current = {
                        startWordId: word.id,
                        startOffset: startOffset,
                        endWordId: word.id,
                        endOffset: startOffset
                    }
                } else {
                    await mergeWord(updatedTranscription, prevWord.id, word.id);
                }
                return;
            }
            willChangedSelection.current = {
                startWordId: word.id,
                startOffset: startOffset,
                endWordId: word.id,
                endOffset: startOffset
            }
            word.word = wordContent.trim();
        } else {
            let wordCurrentId = startId
            while (true) {
                let word = getItemFromArr(updatedTranscription.words, 'id', wordCurrentId);
                if (isEmpty(word)) break;

                if (word.id === startId) await delWordRange(updatedTranscription, { startId: word.id, startOffset, endId: word.id, endOffset: word.word.length + 1 });
                else if (word.id === endId) await delWordRange(updatedTranscription, { startId: word.id, startOffset: 0, endId: word.id, endOffset });
                else await delWord(updatedTranscription, word.id);

                if (word.id === endId || word.nextId === '') break;
                wordCurrentId = word.nextId;
            }
        }
    }

    const insertTextToEditor = async (updatedTranscription, txt, selection) => {
        let wordRange = getWordRange(selection);
        await delWordRange(updatedTranscription, wordRange);
        if (txt.length === 0) return;
        let txtArr = txt.replaceAll('\u00A0', " ").replace(/\n+/g, " " + NEW_LINE_SIGN).replace(/\s+/g, " ").split(' ');
        for (let i = 0; i < txtArr.length; i++) {
            let txt = txtArr[i];
            txt = txt.split(NEW_LINE_SIGN);
            let hasBr = txt.length === 2;
            if (hasBr) txt = txt[1];
            else txt = txt[0];
            if (i != 0) await splitWord(updatedTranscription);
            let { startWordId, startOffset } = willChangedSelection.current;
            let startWord = getItemFromArr(updatedTranscription.words, 'id', startWordId);
            startWord.word = startWord.word.substring(0, startOffset - 1) + txt + startWord.word.substring(startOffset - 1);
            if (i != 0) {
                if (!startWord.hasBr) startWord.hasBr = hasBr && !isCaretInTagPole(updatedTranscription, startWordId, startOffset);
                else if (startWord.hasBr && hasBr) {
                    startWord.hasBr = false;
                    await splitTag(updatedTranscription, selection);
                }
            }
            willChangedSelection.current.startOffset += txt.length;
            willChangedSelection.current.endOffset = willChangedSelection.current.startOffset;
        }
    }

    const doBSDel = async (updatedTranscription, selection, isBS, isCtrl) => {
        let { startId, startOffset, endId, endOffset } = getWordRange(selection);
        let instSave;
        if (startId === endId && startOffset === endOffset) {
            let word = getItemFromArr(updatedTranscription.words, 'id', startId);
            if (startOffset === 1) {
                if (isBS) {
                    if (isCtrl) {
                        await delWord(updatedTranscription, word.prevId);
                        instSave = true;
                    } else {
                        await mergeWord(updatedTranscription, word.prevId, word.id);
                        if(word.prevId !== '') instSave = true;
                    }
                } else {
                    if (isCtrl) {
                        await delWord(updatedTranscription, word.id);
                        instSave = true;
                    } else {
                        await delWordRange(updatedTranscription, { startId: word.id, startOffset: 1, endId: word.id, endOffset: 2 });
                        instSave = false;
                    }
                }
            } else if (startOffset === (word.word.length + 1)) {
                if (isBS) {
                    if (isCtrl) {
                        await delWord(updatedTranscription, word.id);
                        instSave = true;
                    } else {
                        await delWordRange(updatedTranscription, { startId: word.id, startOffset: startOffset - 1, endId: word.id, endOffset });
                        instSave = false;
                    }
                } else {
                    if (isCtrl) {
                        instSave = true;
                        await delWord(updatedTranscription, word.nextId);
                    } else {
                        await mergeWord(updatedTranscription, word.id, word.nextId);
                        if(word.nextId !== '') instSave = true;
                    }
                }
            } else {
                if (isBS) {
                    if (isCtrl) {
                        await delWordRange(updatedTranscription, { startId: word.id, startOffset: 1, endId: word.id, endOffset });
                        instSave = true;
                    } else {
                        await delWordRange(updatedTranscription, { startId: word.id, startOffset: startOffset - 1, endId: word.id, endOffset });
                        instSave = false;
                    }
                } else {
                    if (isCtrl) {
                        await delWordRange(updatedTranscription, { startId: word.id, startOffset, endId: word.id, endOffset: word.word.length + 1 });
                        instSave = true;
                    } else {
                        await delWordRange(updatedTranscription, { startId: word.id, startOffset, endId: word.id, endOffset: endOffset + 1 });
                        instSave = false;
                    }
                }
            }
        } else {
            await delWordRange(updatedTranscription, { startId, startOffset, endId, endOffset });
            instSave = true;
        }
        return instSave;
    }

    const doUndo = () => {
        if (isEmpty(track) || trackIndex < 1) return;
        trackIndex -= 1;
        setTranscription(track.transcriptions[trackIndex]);
        saveData(track.transcriptions[trackIndex], false);
    }

    const doRedo = () => {
        if (isEmpty(track) || trackIndex > (track.transcriptions.length - 2) ) return;
        trackIndex += 1;
        setTranscription(track.transcriptions[trackIndex]);
        saveData(track.transcriptions[trackIndex], false);
    }

    useEffect(() => {
        doUndo();
    }, [undo]);

    useEffect(() => {
        doRedo();
    }, [redo])

    const doInsertSection = async () => {
        let selection = document.getSelection();
        if (!isCaretInEditor(selection)) return;
        let updatedTranscription = { ...transcription };

        let wordRange = getWordRange(selection);
        delWordRange(updatedTranscription, wordRange);
        let offset = willChangedSelection.current.startOffset;
        let word = getItemFromArr(updatedTranscription.words, 'id', willChangedSelection.current.startWordId);
        if (isEmpty(word)) return;
        let belongedTag = getBelongedTag(updatedTranscription, word.id);
        let belongedSectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', belongedTag.sectionTagId);
        if (isEmpty(belongedSectionTag)) return;
        if (belongedSectionTag.isWordGroup) {
            if ((belongedTag.sectionTagRangeIndex === 0 && offset === 1) || (belongedTag.sectionTagRangeIndex === 1 && offset === (word.word.length + 1))) return;
            await splitSectionTag(updatedTranscription);
        } else {
            let belongedSpeakerTag = getItemFromArr(updatedTranscription.speakerTags, 'id', belongedTag.speakerTagId);
            if ((belongedSectionTag.range[0] === belongedSpeakerTag.id && belongedTag.speakerTagRangeIndex === 0 && offset === 1) ||
                (belongedSectionTag.range[belongedSectionTag.range.length - 1] === belongedSpeakerTag.id && belongedTag.speakerTagRangeIndex === 1 && offset === (word.word.length + 1)))
                return;
            else await splitSectionTag(updatedTranscription);
        }
        
        setTranscription(updatedTranscription);
        lastSavedTime = new Date().getTime();
        saveData(updatedTranscription);
    }

    useEffect(() => {
        doInsertSection();
    }, [clickedInsSection])

    const saveData = (trans, pushTrack = true) => {
        trans.lastSavedTime = new Date().getTime();
        let updatedTranscription = JSON.parse(JSON.stringify(trans));
        if (pushTrack) {
            trackIndex += 1;
            track.transcriptions.splice(trackIndex, track.transcriptions.length - trackIndex, updatedTranscription);
            // track.transcriptions = track.transcriptions.slice(0, trackIndex);
            // track.transcriptions.push(updatedTranscription);
        }
        setSavingStatus(SAVING);
        MediaService.updateTranscriptionByFileId(fileId, updatedTranscription)
            .then((res) => {
                if (res.status === 200) {
                    if(DEBUG_MODE) console.log(res);
                    setSavingStatus(SAVED);
                    setLastSavedTime(updatedTranscription.lastSavedTime);
                } else {
                    if(DEBUG_MODE) console.log(res);
                }
            })
            .catch((err) => {
                if (DEBUG_MODE) console.log(err);
            });
        setEnableUndo(trackIndex > 0);
        setEnableRedo(trackIndex < (track.transcriptions.length - 1));
    };

    const handleKeyDownTBody = async (e) => {
        let selection = document.getSelection();
        if (!isCaretInEditor(selection)) return true;

        let instSave;
        let modifier = getModifierState(e);
        let updatedTranscription = { ...transcription };
        if (modifier === KEY_CTRL && e.keyCode === 90) {
            // ctrl + z
            e.preventDefault();
            if (DEBUG_MODE) console.log('undo: ctrl + z');
            doUndo();
        } else if ((modifier === (KEY_CTRL + " " + KEY_SHIFT) && e.keyCode === 90) || (modifier === KEY_CTRL && e.keyCode === 89)) {
            // ctrl + shift + z || ctrl + y
            e.preventDefault();
            if (DEBUG_MODE) console.log('redo: ctrl + shift + z || ctrl + y');
            doRedo();
        } else if (e.keyCode === 8) {
            // backspace
            if (modifier === KEY_CTRL) {
                // ctrl + backspace
                e.preventDefault();
                if (DEBUG_MODE) console.log('remove word: ctrl + backspace');
                instSave = await doBSDel(updatedTranscription, selection, true, true);
                setTranscription(updatedTranscription);
            } else if(modifier === '') {
                // only backspace
                e.preventDefault();
                if(DEBUG_MODE) console.log('remove letter: backspace');
                let updatedTranscription = { ...transcription };
                instSave = await doBSDel(updatedTranscription, selection, true, false);
                setTranscription(updatedTranscription);
            }
        } else if (e.keyCode === 46) {
            // del
            if (modifier === KEY_CTRL) {
                // ctrl + del
                e.preventDefault();
                if(DEBUG_MODE) console.log('remove word: ctrl + del');
                let updatedTranscription = { ...transcription };
                instSave = await doBSDel(updatedTranscription, selection, false, true);
                setTranscription(updatedTranscription);
            } else if(modifier === '') {
                // only del
                e.preventDefault();
                if(DEBUG_MODE) console.log('remove letter: del');
                let updatedTranscription = { ...transcription };
                instSave = await doBSDel(updatedTranscription, selection, false, false);
                setTranscription(updatedTranscription);
            }
        } else if (e.keyCode === 32 && (modifier === "" || modifier === KEY_SHIFT)) {
            // space
            e.preventDefault();
            if (DEBUG_MODE) console.log('split word: space');
            let updatedTranscription = { ...transcription };
            await insertTextToEditor(updatedTranscription, ' ', selection);
            setTranscription(updatedTranscription);
            instSave = true;
        } else if (e.keyCode === 13 && modifier === '') {
            // enter
            // if (modifier === KEY_SHIFT) {
            //     // shift + enter
            //     e.preventDefault();
            //     if(DEBUG_MODE) console.log('create paragraph: shift + enter');
            //     let updatedTranscription = { ...transcription };
            //     await insertTextToEditor(updatedTranscription, '\n', selection);
            //     setTranscription(updatedTranscription);
            //     instSave = true;
            // } else if (modifier === '') {
                // only enter
                e.preventDefault();
                if (newSpkTgId.length !== 0) return true;
                if(DEBUG_MODE) console.log('create speaker: enter');
                let updatedTranscription = { ...transcription };
                // await splitTag(updatedTranscription, selection);
                await insertTextToEditor(updatedTranscription, '\n', selection);
                setTranscription(updatedTranscription);
                instSave = true;
            // }
        } else if (e.keycode === 27 || e.keyCode === 9) {
            // Esc || Tab
            e.preventDefault();
            if (newSpkTgId.length !== 0) return true;
            if(DEBUG_MODE) console.log('prevent default: Esc || Tab');
        } else if (e.key.length === 1 && (modifier === "" || modifier === KEY_SHIFT)) {
            e.preventDefault();
            if(DEBUG_MODE) console.log('insert letter: ', e.key);
            let updatedTranscription = { ...transcription };
            await insertTextToEditor(updatedTranscription, e.key, selection);
            setTranscription(updatedTranscription);
            instSave = false;
        }
        if (instSave !== undefined) {
            clearTimeout(typingTimer);
            if (instSave) {
                lastSavedTime = new Date().getTime();
                saveData(updatedTranscription);
            } else {
                let curTime = new Date().getTime();
                lastSavedTime ||= new Date().getTime();
                let diff = curTime - lastSavedTime;
                if (diff >= SAVING_DUR) {
                    saveData(updatedTranscription);
                    lastSavedTime = curTime;
                } else {
                    setSavingStatus(LISTENING_CHANGES);
                    typingTimer = setTimeout(() => {
                        saveData(updatedTranscription);
                        lastSavedTime = new Date().getTime();
                    }, UNTYPING_DUR);
                }
            }
        }
    }
    
    const getStringFromWordRange = async (updatedTranscription, { startId, startOffset, endId, endOffset }) => {
        let res = '';
        if (startId === endId) {
            if (startOffset != endOffset) {
                let word = getItemFromArr(updatedTranscription.words, 'id', startId);
                res = word.word.substring(startOffset - 1, endOffset - 1);
            }
        } else {
            let wordCurrentId = startId;
            while (true) {
                let word = getItemFromArr(updatedTranscription.words, 'id', wordCurrentId);
                if (isEmpty(word)) break;

                res += word.hasBr ? "\n" : " ";
                if (word.id === startId) res += word.word.substring(startOffset - 1);
                else if (word.id === endId) res += word.word.substring(0, endOffset - 1);
                else res += word.word;
                
                if (word.id === endId || word.nextId === '') break;
                wordCurrentId = word.nextId;
            }
        }
        return res;
    }

    const handleCutTBody = async (e) => {
        let selection = document.getSelection();
        if (!isCaretInEditor(selection)) return true;
        e.preventDefault();
        let updatedTranscription = { ...transcription };
        let wordRange = getWordRange(selection);
        e.clipboardData.setData('text/plain', await getStringFromWordRange(updatedTranscription, wordRange));
        await delWordRange(updatedTranscription, wordRange);
        setTranscription(updatedTranscription);
    }

    const handlePasteTBody = async (e) => {
        let selection = document.getSelection();
        if (!isCaretInEditor(selection)) return true;
        e.preventDefault();
        let updatedTranscription = { ...transcription };
        await insertTextToEditor(updatedTranscription, e.clipboardData.getData('text'), selection);
        setTranscription(updatedTranscription);
    }

    useEffect(() => {
        if (!lastSelectedWordRange.current) return;
        if (!isCaretInEditor(lastSelectedWordRange.current)) return;
        if (actionStyle === undefined) return;
        if (actionStyle === FONT_COLOR && changedFontClr === undefined) return;
        if (actionStyle === HIGHLIGHT_BG && changedHighlightClr === undefined) return;
        let range = lastSelectedWordRange.current;
        Caret.doChange(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
        range = {
            start: range.startContainer.parentNode.id,
            end: range.endContainer.parentNode.id,
        }
        let wordCurrentId = range.start;
        let updatedTranscription = { ...transcription };
        while (true) {
            let word = getItemFromArr(updatedTranscription.words, "id", wordCurrentId);
            if(isEmpty(word)) break
            switch (actionStyle) {
                case BOLD:
                    word = {
                        ...word,
                        style: {
                            ...word.style,
                            bold: !word?.style?.bold
                        }
                    }
                    break;
                case ITALIC:
                    word = {
                        ...word,
                        style: {
                            ...word.style,
                            italic: !word?.style?.italic
                        }
                    }
                    break;
                case UNDERLINE:
                    word = {
                        ...word,
                        style: {
                            ...word.style,
                            underline: !word?.style?.underline
                        }
                    }
                    break;
                case FONT_COLOR:
                    word = {
                        ...word,
                        style: {
                            ...word.style,
                            fontClr: word?.style?.fontClr === changedFontClr ? GRAY : changedFontClr
                        }
                    }
                    break;
                case HIGHLIGHT_BG:
                    word = {
                        ...word,
                        style: {
                            ...word.style,
                            highlightClr: word?.style?.highlightClr === changedHighlightClr ? "#FFF" : changedHighlightClr
                        }
                    }
                    break;
            }
            updatedTranscription.words[getIndexFromArr(updatedTranscription.words, 'id', wordCurrentId)] = word;
            setTranscription(updatedTranscription);
            if (word.id === range.end || word.nextId === "") break;
            wordCurrentId = word.nextId;
        }
    },[changeStyle])
    
    useEffect(() => {
        if (isPlaying) return;
        if (transcription.speakerTags === undefined) return;
        let speakerTagPlayBtns = document.getElementsByClassName('allSpeakerTagPlayBtn');
        for (let i = 0; i < speakerTagPlayBtns.length; i++) speakerTagPlayBtns[i].style.display = "flex";
        let speakerTagPauseBtns = document.getElementsByClassName('allSpeakerTagPauseBtn');
        for (let i = 0; i < speakerTagPauseBtns.length; i++) speakerTagPauseBtns[i].style.display = "none";
    }, [isPlaying])
    
    // get active word by time from words array
    const getActiveWord = () => {
        if (transcription.words === undefined || (transcription.words && transcription.words.length === 0)) return {};
        let word = transcription.words.find(item => currentTime >= item.startTime && currentTime < item.endTime);
        return word === undefined ? {} : word;
    }

    const highlightActiveWord = () => {
        if (isEmpty(transcription)) return;
        let newActiveWord = getActiveWord();
        if (isEmpty(newActiveWord)) {
            setActiveWordId('');
            return;
        }
        setActiveWordId(newActiveWord.id);
        if (wasTimeSlideDrag.current) {
            let activeElement = document.getElementById(newActiveWord.id);
            window.scrollTo({ behavior: 'smooth', top: activeElement?.offsetTop - 216 - (window.innerHeight - 314) / 4 });
            wasTimeSlideDrag.current = false;
        }
    }

    useEffect(() => {
        highlightActiveWord();
    }, [currentTime])

    const getSectionTags = () => {
        let element = [];
        let sectionTagCurrentId = getFirstSectionTag(transcription).id || '';
        while (true) {
            let sectionTag = getItemFromArr(transcription.sectionTags, "id", sectionTagCurrentId);
            if (isEmpty(sectionTag)) break;
            element.push(
                <TSectionTag
                    key={sectionTag.id}
                    sectionTag={sectionTag}
                    transcription={transcription}
                    setTranscription={setTranscription}
                    zoomTranscriptNum={zoomTranscriptNum}
                    activeWordId={activeWordId}
                    createSpeakerTag={createSpeakerTag}
                    delSpeakerTag={delSpeakerTag}
                    newSpkTgId={newSpkTgId}
                    setNewSpkTgId={setNewSpkTgId}
                />
            )
            if (sectionTag.nextId === "") break;
            sectionTagCurrentId = sectionTag.nextId;
        }
        return element;
    }

    return (
        <DVFadeInOut
            contentEditable={true}
            suppressContentEditableWarning={true}
            show={showFade}
            duration={300}
            className="outline-none"
            onKeyDown={handleKeyDownTBody}
            onPaste={handlePasteTBody}
            onCut={handleCutTBody}
        >
            {!isEmpty(transcription) && transcription.sectionTags && transcription.sectionTags.length !== 0 && getSectionTags()}
        </DVFadeInOut>
    )
}

export default TBody;
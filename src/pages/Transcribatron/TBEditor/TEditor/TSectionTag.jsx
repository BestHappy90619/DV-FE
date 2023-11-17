import TSpeakerTag from "./TSpeakerTag";
import TWord from "./TWord";

import { Popover, PopoverHandler, PopoverContent} from "@material-tailwind/react";
import { BsThreeDots } from "react-icons/bs";

import { getItemFromArr, isEmpty } from "@/utils/Functions";
import { DEFAULT_FONT_SIZE } from "@/utils/Constant";

const TSectionTag = (props) => {
    const { sectionTag, transcription, setTranscription, zoomTranscriptNum, activeWordId, createSpeakerTag, delSpeakerTag } = props;

    const getWords = (range) => {
        let startId = range[0];
        let endId = range[1];
        if (transcription.words === undefined) return;
        let element = [];
        let wordCurrentId = startId;
        while (true) {
            let word = getItemFromArr(transcription.words, "id", wordCurrentId);
            if (isEmpty(word)) break;
            element.push(<TWord key={word.id} word={word} rawFontSize={Math.ceil(zoomTranscriptNum / 100 * DEFAULT_FONT_SIZE)} activeWordId={activeWordId} />)
            if (word.id === endId || word.nextId === "") break;
            wordCurrentId = word.nextId;
        }
        return element;
    }

    const switchSectionTagMode = async (sectionTagId) => {
        let updatedTranscription = { ...transcription };
        let sectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', sectionTagId);
        if (sectionTag.isWordGroup) await createSpeakerTag(updatedTranscription, sectionTag.range, sectionTag, 0)
        else {
            sectionTag.range.push(getItemFromArr(updatedTranscription.speakerTags, 'id', sectionTag.range[0]).range[0]);
            sectionTag.range.push(getItemFromArr(updatedTranscription.speakerTags, 'id', sectionTag.range[sectionTag.range.length - 2]).range[1]);
            while (true) {
                if (sectionTag.range.length === 2) break;
                await delSpeakerTag(updatedTranscription, sectionTag.range[0], sectionTag.id);
            }
            sectionTag.isWordGroup = !sectionTag.isWordGroup;
        } 
        setTranscription(updatedTranscription);
    }

    const toggleTitle = (sectionTagId) => {
        let updatedTranscription = { ...transcription };
        let sectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', sectionTagId);
        sectionTag.showHeading = !sectionTag.showHeading;
        setTranscription(updatedTranscription);
    }

    const updateSectionHeading = (sectionTagId, newHeading) => {
        let updatedTranscription = { ...transcription };
        let sectionTag = getItemFromArr(updatedTranscription.sectionTags, 'id', sectionTagId);
        sectionTag.label = newHeading;
        setTranscription(updatedTranscription);
    }
    
    return (
        <div className={`gap-8 ${sectionTag.nextId === "" ? "" : "mb-8"}`}>
            <div contentEditable={false} className={`flex ${sectionTag.showHeading ? "" : "hidden"} mb-2 justify-between`}>
                <input contentEditable={false} className={`text-black outline-none focus:border-2 focus:border-custom-medium-gray text-base`} value={sectionTag.label} onChange={(e) => updateSectionHeading(sectionTag.id, e.target.value)} />
                    <Popover placement="bottom-end">
                        <PopoverHandler>
                            <div>
                                <BsThreeDots className="text-custom-gray cursor-pointer" />
                            </div>
                        </PopoverHandler>
                        <PopoverContent>
                            <div className={`select-none py-1`}>
                                <p className="text-custom-black justify-end flex text-sm cursor-pointer mb-2" onClick={() => switchSectionTagMode(sectionTag.id)}>Switch to { sectionTag.isWordGroup ? 'speaker' : 'dictation' } mode</p>
                                <p className="text-custom-black justify-end flex text-sm cursor-pointer" onClick={() => toggleTitle(sectionTag.id)}>{ sectionTag.showHeading ? 'Hide' : 'Show' } title</p>
                            </div>
                        </PopoverContent>
                    </Popover>
            </div>
            <div className="grid gap-4 outline-none" contentEditable={true} suppressContentEditableWarning={true}>
                {
                    sectionTag.isWordGroup ?
                        <div><p className="text-custom-gray w-full h-auto text-justify">{getWords(sectionTag.range)}</p></div>
                        :
                        transcription.speakerTags !== undefined && transcription.speakers !== undefined && sectionTag.range.map(item => {
                            let speakerTag = getItemFromArr(transcription.speakerTags, "id", item);
                            return !isEmpty(speakerTag) &&
                                <TSpeakerTag
                                    key={speakerTag.id}
                                    speakerTag={speakerTag}
                                    getWords={getWords}
                                    transcription={transcription}
                                    setTranscription={setTranscription}
                                />
                        })
                }
            </div>
            <p contentEditable={false} className={`text-custom-black text-xs mt-2 ${sectionTag.showHeading ? "" : "hidden"}`} >- End of {sectionTag.label} -</p>
        </div>
    );
}

export default TSectionTag;
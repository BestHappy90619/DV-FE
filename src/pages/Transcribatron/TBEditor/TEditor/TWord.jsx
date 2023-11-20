import { EventBus } from "@/utils/Functions";
import { TIME_UPDATE_OUTSIDE } from "@/utils/Constant";

const TWord = (props) => {
    const { word, rawFontSize, activeWordId } = props;

    const onClickWord = (e) => {
        EventBus.dispatch(TIME_UPDATE_OUTSIDE, { time: e.target.dataset.start * 1 });
    }

    return (
        <span
            id={word.id}
            data-start={word.startTime}
            data-duration={word.endTime - word.startTime}
            onClick={onClickWord}
            style={{ fontSize: (rawFontSize % 2 === 1 ? (rawFontSize + 1) : rawFontSize) + "px", color: word?.style?.fontClr, backgroundColor: word?.style?.highlightClr}}
            className={`word ${word?.style?.bold ? "font-bold" : ""} ${word?.style?.italic ? " italic" : ""} ${word?.style?.underline ? " underline" : ""} ${word.id === activeWordId ? 'activeWord' : ''}`}
        >
            {word.hasBr && <br /> }
            {" " + word.word}
        </span>
    );
}

export default TWord;
var saveSelection, restoreSelection, changeSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;
        
        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    changeSelection = function (startEle, startOffset, endEle, endOffset) {
        window.getSelection().removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(startEle, startOffset);
        newRange.setEnd(endEle, endOffset);
        window.getSelection().addRange(newRange);
    }
} else if (document.selection && document.body.createTextRange) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };

    changeSelection = function (startEle, startOffset, endEle, endOffset) {
        document.getSelection().removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(startEle, startOffset);
        newRange.setEnd(endEle, endOffset);
        document.getSelection().addRange(newRange);
    }
}

var savedSelection;

const doSave = (elementId) => {
    let ele = document.getElementById(elementId);
    if(ele) savedSelection = saveSelection(ele);
}

const doRestore = (elementId) => {
    let ele = document.getElementById(elementId);
    if (savedSelection && ele) {
        restoreSelection(ele, savedSelection);
    }
}

const doChange = (startEle, startOffset, endEle, endOffset) => {
    changeSelection(startEle, startOffset, endEle, endOffset);
}
    
export const Caret = { doSave, doRestore, doChange };
var wordList = []
var count = 0;
var lastOccurence = 0;
var totalList = wordList;
var placementElement = "";
var inputElement = "";
var letterElement = "";
var search = [searchBasic, searchAdv];
var currList = []
var currIterator;
var currentPosition = 0;

function temp(event) {
    inputReg = inputElement.value;
    currentPosition = 0;
    currList = [];
    currIterator = null;
    currIterator = (search[document.getElementById('preferDouble').checked ? 1 : 0](inputReg));
    console.log(document.getElementById('preferDouble').checked ? "using advanced" : "using basic");
    placementElement.innerHTML = "";
    listOfElements = "";
    render(0, currIterator, placementElement);
}

function init(placementE, patternE, letterE) {
    placementElement = placementE;
    inputElement = patternE;
    letterElement = letterE
    importWords();
    inputE.addEventListener('input', (event) => {
        temp(event);
    });

    letterE.addEventListener('input', (event) => {
        temp(event);
    });

    document.getElementById('preferDouble').addEventListener('change', (event) => {
        temp(event);
    })

    document.getElementById('range_min').addEventListener('change', (event) => {
        temp(event);
    })
    document.getElementById('range_max').addEventListener('change', (event) => {
        temp(event);
    })

    window.addEventListener('wheel', (event) => {
        if ((new Date()).getTime() - lastOccurence > 200) {
            if (event.deltaY > 0) {
                console.log("Mouse went down");
                console.log(`Position : ${window.scrollY} at ${(new Date()).getTime()}`);
                lastOccurence = (new Date()).getTime();
                count = Math.max(count - 10, 0);
                render(count, currList, placementE);
            } else {
                console.log("Mouse went up");
                console.log(`Position : ${window.scrollY} at ${(new Date()).getTime()}`);
                lastOccurence = (new Date()).getTime()
                count = count + 10;
                render(count, currList, placementE);
            }
        }
    });
}

function importWords() {
    fetch('./static/data/converted.json').then((response) => {
        if (response.status != 200) {
            console.log("Error")
        } else {
            response.json().then((result) => {
                console.log(result);
                wordList = (result);
                //currList = wordList;
                for (i_IW = 0; i_IW < wordList.length; i_IW++) {
                    wordList[i_IW] = {
                        "word": wordList[i_IW],
                        "pos": i_IW
                    }
                }
                currList = wordList;
                currentIterator = searchAdv();
                render(0, searchAdv(), placementElement);
            });
        }
    });
}

function processRegEx(string, mode) {
    // mode = true  => Advanced
    // mode = false => Basic
    if (string == "" && mode) {
        return new RegExp('.*');
    } else if (string == "") {
        return new RegExp('');
    }
    try {
        if (mode == true) {
            return new RegExp(`^${string.toLowerCase()}.*`);
        } else {
            for (i_P = 0; i_P < string.size; i_P++) {
                if (!'abcdefghijklmnopqrstuvwxyz.'.include(string.slice(i_P, i_P + 1))) {
                    return new RegExp('');
                }
            }
        }
        return new RegExp(string);
    } catch (error) {
        console.log(error);
        console.log("Input Error, Trying again");
        return processRegEx(string.slice(0, string.length - 1), mode);//search[document.getElementById('preferDouble').checked ? 1 : 0](string.slice(0, string.length - 1));
    }
}

function wordFromLetters(word, lettersUsable) {
    for (j = 0; j < word.length; j++) {
        const letter = (word.slice(j, j + 1)).toLowerCase();
        if (!(lettersUsable.includes(letter))) {
            return false;
        }
    }
    return true;
}

function SearchReturnNext(Reg, list = totalList, position = 0, letterSizeMin = 3, letterSizeMax = 10, mode = false) {
    lettersUsable = document.getElementById('inputK').value;
    if (lettersUsable == "") {
        lettersUsable = 'abcdefghjklmnopqrstuvxyz';
    }
    for (i_SRN = position; i_SRN < list.length; i_SRN++) {
        let word = list[i_SRN].word;
        truthReg = Reg.test(word.toLowerCase());
        truthLetters = wordFromLetters(word, lettersUsable);
        if (mode) {
            if (truthReg && truthLetters && word.length >= letterSizeMin && word.length <= letterSizeMax) {
                return {
                    "word": word,
                    "pos": i_SRN
                }
            }
        } else {
            if (truthReg && truthLetters && word.length == (("" + Reg).length - 2)) {
                return {
                    "word": word,
                    "pos": i_SRN
                }
            }
        }
    }
    return {
        "word": null,
        "pos": NaN
    }
}

function* searchAdv(regExString = "") {
    min = parseInt(document.getElementById('range_min').value);
    max = parseInt(document.getElementById('range_max').value);
    reg = processRegEx(regExString.toLocaleLowerCase(), true);

    currentPosition = -1;
    while (currentPosition < wordList.length) {
        item = SearchReturnNext(reg, wordList, currentPosition + 1, min, max, true);
        yield item;
        currentPosition = item.pos;
    }
}

function* searchBasic(regExString = "") {
    min = parseInt(document.getElementById('range_min').value);
    max = parseInt(document.getElementById('range_max').value);
    reg = new RegExp();
    mode = false;
    if (regExString == "") {
        mode = true;
        reg = processRegEx(regExString.toLocaleLowerCase(), mode);
    } else {
        reg = processRegEx(regExString.toLocaleLowerCase(), mode);
    }

    currentPosition = -1;
    while (currentPosition < wordList.length) {
        item = SearchReturnNext(reg, wordList, currentPosition + 1, min, max, mode);
        yield item;
        currentPosition = item.pos;
    }
}

function render(pos, iter, element) {
    printList = ""
    k = pos;
    while (k < (pos + 20)) {
        word = "";
        try {
            word = currList[k];
            if (word == undefined) {
                throw new RangeError("word not in list yet.");
            }
        } catch (error) {
            currList[k] = iter.next().value;
            word = currList[k];
        }
        console.log(word);
        if (word != undefined && word.word != null) {
            printList +=
                `<div class="fadebox">
                    <span class="fadeInWord" style="animation-delay:${(k - pos) * 300}ms;" id="textSpan${k}">
                        <a href = "./${word.word}/${word.pos}" style="color:inherit;">${word.word}</a>
                    </span>
                </div>
            <br>`;
        }
        k++;
    }
    element.innerHTML = "";
    element.insertAdjacentHTML('beforeend', printList);
}
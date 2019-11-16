var wordList = []
var count = 0;
var lastOccurence = 0;
var currList = wordList;
var placementElement = "";
var inputElement = "";
var search = [searchBasic, searchAdv];

function temp(event) {
    inputReg = inputElement.value;
    out = (search[document.getElementById('preferDouble').checked ? 1 : 0](inputReg, document.getElementById('range_min').value, document.getElementById('range_max').value));
    console.log(document.getElementById('preferDouble').checked ? "using advanced" : "using basic");
    placementElement.innerHTML = "";
    listOfElements = "";
    currList = out;
    render(0, out, placementElement);
}

function init(placementE, inputE) {
    placementElement = placementE;
    inputElement = inputE;
    importWords();
    inputE.addEventListener('input', (event) => {
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
                render(Math.min(count - 10, 0), currList, placementE);
            } else {
                console.log("Mouse went up");
                console.log(`Position : ${window.scrollY} at ${(new Date()).getTime()}`);
                lastOccurence = (new Date()).getTime()
                render(count + 10, currList, placementE);
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
                render(0, searchAdv(), placementElement);
            });
        }
    });
}

function searchAdv(regExString = "", min = 0, max = Infinity) {
    try {
        reg = new RegExp(`^${regExString}.*`);
        console.log(reg);
        if (regExString == "") {
            list = [];
            for (item = 0; item < wordList.length; item++) {
                const word = wordList[item];
                if (word.length >= min && word.length <= max) {
                    list.push(word);
                }
            }
            return list;
        } else {
            list = [];
            for (item = 0; item < wordList.length; item++) {
                const word = wordList[item];
                const truth = reg.test(word);
                if (truth && word.length >= min && word.length <= max) {
                    list.push(word);
                }
            }
            return list;
        }
    } catch (error) {
        console.log(error);
        console.log("Input Error, Trying again");
        return search(regExString.slice(0, regExString.length - 1));
    }
}

function searchBasic(regExString = "", min = 0, max = Infinity) {
    try {
        str = "";
        len = 0;
        regExString = regExString.toLowerCase();
        inputList = 'abcdefghjklmnopqrstuvxyz.'
        for (i = 0; i < regExString.length; i++) {
            const letter = (regExString.slice(i, i + 1)).toLowerCase();
            if (inputList.includes(letter)) {
                str += letter;
                min = str.length;
                max = str.length;
            } else {
                return ['Word Input Error'];
            }
        }


        reg = new RegExp(`^${str}.*`);
        console.log(reg);
        if (regExString == "") {
            console.log("full list")
            list = [];
            for (item = 0; item < wordList.length; item++) {
                const word = wordList[item];
                if (word.length >= min && word.length <= max) {
                    list.push(word);
                }
            }
            return list;
        } else {
            list = [];
            for (item = 0; item < wordList.length; item++) {
                const word = wordList[item];
                const truth = reg.test(word.toLowerCase());
                if (truth && word.length >= min && word.length <= max) {
                    list.push(word);
                }
            }
            return list;
        }
    } catch (error) {
        console.log(error);
        console.log("Input Error, Trying again");
        return search(regExString.slice(0, regExString.length - 1));
    }
}

function render(pos, list, element) {
    printList = ""
    if (pos >= list.length) {
        pos = list.length - 10 - 1;
    }
    if (pos < 0) {
        pos = 0;
    }
    count = pos;
    console.log("Position is " + count);
    for (i = pos; i < Math.min(pos + 20, list.length); i++) {
        printList += `<div class="fadebox">
        <span class="fadeInWord" style="animation-delay:${(i - pos) * 300}ms;" id="textSpan${i}">
            <a href = "./" style="color:inherit;">${list[i]}</a>
        </span>
    </div>
    <br>`;
    }
    element.innerHTML = "";
    element.insertAdjacentHTML('beforeend', printList);
}
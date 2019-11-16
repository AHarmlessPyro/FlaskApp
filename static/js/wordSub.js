var wordList = []
var count = 0;
var lastOccurence = 0;
var currList = wordList;
var placementElement = "";

var word = "";
var num = 0;

function temp(event) {
    placementElement.innerHTML = "";
    currList = wordList;
    render(0, out, placementElement);
}

function init(placementE) {
    placementElement = placementE;
    wordReg = /\/[a-zA-Z]+\//;
    numReg = /\/\d+/g;

    console.log(document.URL);
    console.log(window.location.href);
    word = document.URL.match(wordReg)[0];
    word = word.slice(1, word.length - 1);

    num = document.URL.match(numReg);
    num = num[num.length - 1];
    num = parseInt(num.slice(1, num.length));

    importWords();

    window.addEventListener('wheel', (event) => {
        if ((new Date()).getTime() - lastOccurence > 200) {
            if (event.deltaY > 0) {
                console.log("Mouse went down");
                console.log(`Position : ${window.scrollY} at ${(new Date()).getTime()}`);
                lastOccurence = (new Date()).getTime();
                render(Math.max(count - 10, 0), currList, placementE);
            } else {
                console.log("Mouse went up");
                console.log(`Position : ${window.scrollY} at ${(new Date()).getTime()}`);
                lastOccurence = (new Date()).getTime()
                render(Math.min(count + 10,currList.length-10), currList, placementE);
            }
        }
    });
}

function importWords() {
    fetch('../static/data/converted.json').then((response) => {
        if (response.status != 200) {
            console.log("Error")
        } else {
            response.json().then((result) => {
                console.log(result);
                wordList = (result);
                currList = wordList
                render(Math.max(num - 10, 0), wordList, placementElement);
            });
        }
    });
}

function render(pos, list, element) {
    printList = ""
    if (pos >= list.length) {
        pos = list.length - 20 - 1;
    }
    if (pos < 0) {
        pos = 0;
    }
    count = pos;
    console.log("Position is " + count);
    console.log(window.location)
    for (i = pos; i < Math.min(pos + 20, list.length); i++) {
        printList += `<div class="fadebox">
        <span class="fadeInWord" style="animation-delay:${(i - pos) * 300}ms;color:white;" id="textSpan${i}">
            <a href = "${window.location.origin}/${list[i]}/${i}" style="color:inherit;">${list[i]}</a>
        </span>
    </div>
    <br>`;
    }
    element.innerHTML = "";
    element.insertAdjacentHTML('beforeend', printList);
}
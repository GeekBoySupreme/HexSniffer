let randomHex = "";
const GUESS_STRINGS = ["GUESS", "THAT'S IT", "CHECK IT"];

window.onload = function () {
    document.getElementById("loading").style.height = "0%";
    document.getElementById("loading").innerText = "";
    document.getElementById("guess-body").style.display = "flex";
    newRandomBg(false);
    setTimeout(function () {
        document.getElementsByClassName("guess-input")[0].focus();
    }, 1000);
};

function evaluateHex() {
    let inputText = document.getElementsByClassName("guess-input")[0].value;
    if ((inputText.length != 6 && inputText.length != 3) || (!(/^#[0-9A-F]{6}$/i.test("#" + inputText)) && !(/^#[0-9A-F]{3}$/i.test("#" + inputText)))) {
        alert("Please guess a valid 6-character (#000000 - #ffffff) or 3-character hex value (#000 - #fff)");
    } else {
        if (inputText.length == 3) {
            inputText = convertShortHexToLongHex(inputText);
        }
        let de2000 = new dE00(hexToLab(randomHex), hexToLab("#" + inputText));
        // let score = getDeltaE(hexToLab(randomHex), hexToLab("#" + inputText)).toFixed(2);
        let score = (de2000.getDeltaE() * 100).toFixed(2);

        document.getElementsByClassName("result-color")[0].style.backgroundColor = "#" + inputText;
        document.getElementsByClassName("result-answer")[0].innerText = randomHex;
        document.getElementsByClassName("result-score")[0].innerText = score;
        document.getElementById("results-div").style.display = "flex";
        document.getElementById("guess-div").style.display = "none";
        document.getElementsByClassName("guess-input")[0].disabled = true;
    }
}

window.addEventListener("keydown", handleFirstTab);

function handleFirstTab(e) {
    if (e.keyCode === 9) {
        // the "I am a keyboard user" key
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
    }
}

window.addEventListener("keydown", handleEnter);

function handleEnter(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        if (document.getElementById("results-div").style.display === "none") {
            evaluateHex();
        } else {
            newRandomBg(true);
        }
    }
}

function convertShortHexToLongHex(inputText) {
    return inputText[0] + inputText[0] + inputText[1] + inputText[1] + inputText[2] + inputText[2];
}

function newRandomBg(autofocus) {
    randomHex = randomColorHex();

    let textColor = isLightColor(randomHex)
      ? "rgba(0, 0, 0, .65)"
      : "rgba(255, 255, 255, .65)";
    document.body.style.color = textColor;
    document.getElementsByClassName("result-color")[0].style.border = "3px solid " + (textColor);

    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        if (links[i].href) {
            links[i].style.color = textColor;
        }
    }

    document.getElementsByClassName("colored-bg")[0].style.background = randomHex;
    document.getElementById("guess-button").innerText = randomGuessString();

    document.getElementById("results-div").style.display = "none";
    document.getElementById("guess-div").style.display = "initial";
    document.getElementsByClassName("guess-input")[0].disabled = false;
    if (autofocus) {
        document.getElementsByClassName("guess-input")[0].focus();
    }
    document.getElementsByClassName("guess-input")[0].value = "";
}

function randomGuessString() {
    return GUESS_STRINGS[Math.floor(Math.random() * GUESS_STRINGS.length)];
}

function randomColorHex() {
    return "#" + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
}

function isLightColor(bgColor) {
    var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map(col => {
        if (col <= 0.03928) {
            return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return L > 0.179;
}

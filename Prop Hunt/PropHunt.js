const popupImgCount = 32; // Number of avaiable popups
const popupCount = 300;
const windowHeight = 1000;//400;
const windowWidth = 1500;//1000;

const arrUp    = 38;
const arrDown  = 40;
const arrLeft  = 37;
const arrRight = 39;
const arr = [arrUp, arrDown, arrLeft, arrRight];

const awsdUp    = 87;
const awsdDown  = 83;
const awsdLeft  = 65;
const awsdRight = 68;
const awsd = [awsdUp, awsdDown, awsdLeft, awsdRight];

// Game states
var prop1 = null;
var prop2 = null;
var gameOver = false;

function initPopups() {
    document.getElementById("start-button").style.display = "none";
    for (var i = 0; i < popupCount; i++) {
        createPopup();
    }
    document.getElementById("announcer").style.display = "block";
}


function random(max) {
    return Math.floor(Math.random() * max) + 1 
}

function createPopup() {
    var popupLink = document.createElement("a");
    popupLink.classList.add("pop-up");
    popupLink.href = "#";
    popupLink.onclick = clickHandle;
    var heightPos = random(windowHeight); //+ 200;
    var widthPos = random(windowWidth);// + 180;
    popupLink.style.top = heightPos + 'px';
    popupLink.style.left = widthPos + 'px';
    var zindex = random(10);
    popupLink.style.zIndex = zindex;

    var popupImg = document.createElement("img");
    var popupNum = random(popupImgCount);
    popupImg.src = `imgs/${popupNum}.jpg`
    popupLink.appendChild(popupImg);

    document.getElementById("window").appendChild(popupLink);
    return false;
}

function clickHandle(ev) {
    var popUp = this;
    if (gameOver) {
        location.reload();
    }

    var hunterStarted = document.getElementById("click-count");
    if (!prop1 && !hunterStarted) {
        cloneProp(popUp, 1);
        document.getElementById("announcer").innerHTML = "<h2>PROP #2 - NOW DO THE SAME...</h2>";
        return;
    }
    if (!prop2 && !hunterStarted) {
        cloneProp(popUp, 2);
        document.getElementById("announcer").innerHTML = "<h2>HIDE PROPS!! <div id='countdown'></div></h2>";
        return;
    }
    if (hunterStarted) {
        var attemptsLeft = Number(document.getElementById("click-count").innerText);
        if (attemptsLeft <= 0 && (prop1 || prop2)) {
            document.getElementById("announcer").innerHTML = "<h2>PROPS WIN!</h2>";
            if (prop1) prop1.classList.add("blink")
            if (prop2) prop2.classList.add("blink")
            gameOverEvent();
        }
        else if (prop1 && popUp.id == prop1.id) {
            prop1.parentNode.removeChild(prop1);
            prop1 = null;
            document.getElementById("player1").innerHTML = "<h2>YOU ARE DEAD</h2>";
            document.getElementById("player1").style.border = "solid 10px #ff0000";
        }
        else if (prop2 && popUp.id == prop2.id) {
            prop2.parentNode.removeChild(prop2);
            prop2 = null;
            document.getElementById("player2").innerHTML = "<h2>YOU ARE DEAD</h2>";
            document.getElementById("player2").style.border = "solid 10px #ff0000";
        }
        else {
            attemptsLeft--;
            document.getElementById("click-count").innerText = attemptsLeft;
            if (attemptsLeft == 10) {
                document.getElementById("count-text").style.color = "red";
            }
        }

        if (!prop1 && !prop2) {
            document.getElementById("announcer").innerHTML = "<h2>HUNTER WIN!</h2>";
            gameOverEvent();
        }
    }
}

function cloneProp(popup, propNum) {
    var propClone = popup.cloneNode(true);
    propClone.id = `prop${propNum}`;
    propClone.classList.add("player-prop");
    propClone.style.top = addRemovePx(propClone.style.top, 15);
    propClone.style.left = addRemovePx(propClone.style.left, 15);
    propClone.onclick = clickHandle;
    document.getElementById("window").appendChild(propClone);
    if (propNum == 1) 
        prop1 = propClone;
    else
        prop2 = propClone;
    document.getElementById(`player${propNum}`).style.display = "block";
}


document.onkeydown = detectKey;
function detectKey(e) {
    var key = (e || window.event).keyCode;
    if (prop1 && awsd.includes(key)) {
        moveProp(prop1, key);
    }
    if (prop2 && arr.includes(key)) {
        moveProp(prop2, key);
    }
}

function moveProp(prop, key) {
    const movementDistance = 75;
    switch (key) {
        case arrUp:
        case awsdUp:
            prop.style.top = addRemovePx(prop.style.top, movementDistance * -1);
            break;
        case arrDown:
        case awsdDown:
            prop.style.top = addRemovePx(prop.style.top, movementDistance);
            break;
        case arrLeft:
        case awsdLeft:
            prop.style.left = addRemovePx(prop.style.left, movementDistance * -1);
            break;
        case arrRight:
        case awsdRight:
            prop.style.left = addRemovePx(prop.style.left, movementDistance);
            break;
    }
}

function addRemovePx(px, x) {
    var pixels = Number(px.substring(0, px.length - 2));
    var newPx = pixels + x;
    return newPx + "px";
}


var timeleft = 10;
var downloadTimer = setInterval(function () {
    if (document.getElementById("countdown")) {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
            document.getElementById("countdown").style.color = "inherit";
            document.getElementById("countdown").innerHTML = "GO FIND THEM HUNTER! <div id='count-text'><span id='click-count'>30</span> CLICKS LEFTS</div>";
        } else {
            document.getElementById("countdown").innerHTML = "<span id='timer'>" + timeleft + " seconds remaining </span>";
            if (timeleft <= 3) {
                document.getElementById("timer").style.color = "red";
            }
        }
        timeleft -= 1;
    }
}, 1000);


function gameOverEvent() {
    gameOver = true;
    var div_elem = document.getElementById("announcer");
    var h = setInterval(function () {
        div_elem.style.top = Math.floor((Math.random() * 100) + 1) + "px";
        div_elem.style.left = Math.floor((Math.random() * 200) + 1) + "px";
    }, 100)
}
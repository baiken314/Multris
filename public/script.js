/* global postScore */
/* global scoreJSON */

// check for window name
if (window.name.length < 4) {
  window.location.href = "https://multris.glitch.me";
}

/**********************
* INITIALIZE VARIABLES
***********************/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var running = true;

var mapWidth = 12;
var mapHeight = 24;
var SCALE = 50;

var level = 0;

var speeds = [100, 75, 50, 40, 30, 25, 20, 18, 15, 13, 11, 10, 9, 8, 7];

var score = 0;
var lines = 0;
var combo = 0;

var holdPiece = [];
var canHold = true;

var fallTimer = 0;
var fastFallDelay = 2;
var fallDelay = speeds[level];
var currentFallDelay = fallDelay;

var blockTimer = 0;
var blockDelay = 15;

var shiftTimer = 0;
var shiftDelay = 2;
var autoShiftDelay = 15;
var currentShiftDelay = autoShiftDelay;
var firstShift = true;

var lineClearTimer = 0;
var lineClearDelay = 25;
var lineClearTetrisDelay = 30;
var lineClearMultrisDelay = 35;

var hardDropped = false;
var canSoftDrop = true;
var canHardDrop = true;
var canRotate = true;

var gotTetris = false;
var gotMultris = false;

canvas.width = 7*SCALE + mapWidth*SCALE + 7*SCALE;
canvas.height = mapHeight*SCALE + 180;

var map = Array(mapWidth*mapHeight);
var nextPiece = [];

var linesCleared = [];

resetMap();

// monotris piece
var mPiece = [
    ".", ".", ".", 
    ".", "m", ".", 
    ".", ".", "."
];

// dotris piece
var dPiece = [
    ".", ".", ".", ".", 
    ".", "d", "d", ".", 
    ".", ".", ".", ".", 
    ".", ".", ".", "."
];

// tritris pieces
var tiPiece = [
    ".", ".", ".", 
    "ti", "ti", "ti", 
    ".", ".", "."
];

var tcPiece = [
    ".", ".", ".", ".", 
    ".", ".", "tc", ".", 
    ".", "tc", "tc", ".", 
    ".", ".", ".", ".", 
]

// tetris pieces
var tPiece = [
    ".", ".", ".",
    "t", "t", "t",
    ".", "t", "."
];

var lPiece = [
    ".", ".", ".",
    "l", "l", "l",
    ".", ".", "l"
];

var jPiece = [
    ".", ".", ".",
    "j", "j", "j",
    "j", ".", "."
];

var zPiece = [
    "z", "z", ".",
    ".", "z", "z",
    ".", ".", "."
];

var sPiece = [
    ".", "s", "s",
    "s", "s", ".",
    ".", ".", "."
];

var iPiece = [
    ".", ".", ".", ".",
    "i", "i", "i", "i",
    ".", ".", ".", ".",
    ".", ".", ".", "."
];

var oPiece = [
    ".", ".", ".", ".",
    ".", "o", "o", ".",
    ".", "o", "o", ".",
    ".", ".", ".", "."
];

// Multris pieces
var xxPiece = [
    ".", "xx", ".",
    "xx", "xx", "xx", 
    ".", "xx", "."
];

var uPiece = [
    ".", ".", ".", 
    "u", ".", "u", 
    "u", "u", "u"
];

var btPiece = [
    "bt", "bt", "bt", 
    ".", "bt", ".",
    ".", "bt", "."
];

var bcPiece = [
    ".", ".", "bc", 
    ".", ".", "bc", 
    "bc", "bc", "bc"
];

var bsPiece = [
    ".", ".", "bs", 
    "bs", "bs", "bs", 
    ".", "bs", "." 
];

var bzPiece = [
    "bz", ".", ".", 
    "bz", "bz", "bz", 
    ".", "bz", "."
];

var blPiece = [
    ".", ".", ".", ".", 
    "bl", "bl", "bl", "bl", 
    ".", ".", ".", "bl", 
    ".", ".", ".", ".", 
];

var bjPiece = [
    ".", ".", ".", ".", 
    "bj", "bj", "bj", "bj", 
    "bj", ".", ".", ".",
    ".", ".", ".", "."
];

var biPiece = [
    ".", ".", ".", ".", ".", 
    ".", ".", ".", ".", ".", 
    "bi", "bi", "bi", "bi", "bi", 
    ".", ".", ".", ".", ".", 
    ".", ".", ".", ".", "."
];

var bopPiece = [
    ".", ".", ".", ".", 
    ".", "bop", "bop", ".", 
    ".", "bop", "bop", "bop", 
    ".", ".", ".", "."
];

var bolPiece = [
    ".", ".", ".", ".", 
    ".", "bol", "bol", ".", 
    "bol", "bol", "bol", ".", 
    ".", ".", ".", "."
];

var bmsPiece = [
    ".", ".", ".", ".", 
    "bms", "bms", "bms", ".", 
    ".", ".", "bms", "bms", 
    ".", ".", ".", "."
];

var bmzPiece = [
    ".", ".", ".", ".", 
    ".", "bmz", "bmz", "bmz", 
    "bmz", "bmz", ".", ".", 
    ".", ".", ".", "."
];

var stPiece = [
    ".", ".", "st", 
    ".", "st", "st", 
    "st", "st", "." 
];

var ltrPiece = [
    ".", ".", ".", ".", 
    "ltr", "ltr", "ltr", "ltr", 
    ".", "ltr", ".", ".",
    ".", ".", ".", ".", 
];

var ltlPiece = [
    ".", ".", ".", ".", 
    "ltl", "ltl", "ltl", "ltl", 
    ".", ".", "ltl", ".",
    ".", ".", ".", ".",
];

var psPiece = [
    ".", "ps", "ps", 
    ".", "ps", ".",
    "ps", "ps", "."
];

var pzPiece = [
    "pz", "pz", ".", 
    ".", "pz", ".", 
    ".", "pz", "pz"
];

var pieces = [tPiece, lPiece, jPiece, zPiece, sPiece, 
              iPiece, oPiece, xxPiece, uPiece, btPiece, 
              bcPiece, bsPiece, bzPiece, blPiece, bjPiece, 
              pzPiece, psPiece, ltlPiece, ltrPiece, stPiece, 
              bmsPiece, bmzPiece, biPiece, bopPiece, bolPiece, 
              mPiece, dPiece, tcPiece, tiPiece];

var colors = {"t": "#b14ceb", "l": "#32f", "j": "#fc9b42", "z": "#f21", "s": "#3d4", "o": "#fc1",
              "xx": "#678", "u": "#7d8", "bt": "#c9f", "bc": "#f9f", "bs": "#6f9", "bz": "#c94",
              "bl": "#c4c9", "bj": "#9c6", "pz": "#6cc", "ps": "#ccb399", "ltl": "#98a", "ltr": "#c66",
              "st": "#fcc", "bms": "#ff9", "bmz": "#f22175", "bi": "#f7b", "bop": "#29f", "bol": "#4ba",
              "m": "#74d", "d": "#ff5050", "ti": "#d7a", "tc": "#a44", "white": "#eee", "i": "#9bf"};

var pieceQueue = [];
refillPieceQueue();
refillPieceQueue();

var currentPiece = pieceQueue.shift();
var shadowPiece = currentPiece;
var startX = 4
var startY = 0;
var x = startX;
var y = startY;
var shadowX = x;
var shadowY = y;
var rotation = 0;

/******************
* STATIC FUNCTIONS
*******************/
function printScore() {
    ctx.font = "50px \"Press Start 2P\"";
    ctx.fillStyle = "#eee";
    ctx.fillText("Score: ", mapWidth*SCALE + 30 + 7*SCALE, 400);
    ctx.fillText(score, mapWidth*SCALE + 30 + 7*SCALE, 475);
    ctx.fillText("Lines: ", mapWidth*SCALE + 30 + 7*SCALE, 550);
    ctx.fillText(lines, mapWidth*SCALE + 30 + 7*SCALE, 625);
    ctx.fillText("Level: ", mapWidth*SCALE + 30 + 7*SCALE, 700);
    ctx.fillText((level + 1), mapWidth*SCALE + 30 + 7*SCALE, 775);

    ctx.font = "25px \"Press Start 2P\"";
    ctx.fillText("Arrow keys - move", 7*SCALE, (mapHeight + 1)*SCALE + 0);
    ctx.fillText("Z and X - rotate", 7*SCALE, (mapHeight + 1)*SCALE + 40);
    ctx.fillText("C - hold", 7*SCALE, (mapHeight + 1)*SCALE + 80);
    ctx.fillText("Down - soft drop, Space - hard drop", 7*SCALE, (mapHeight + 1)*SCALE + 120);

    // draw next piece
    for (let y = 0; y < Math.sqrt(nextPiece.length); y++) {
        for (let x = 0; x < Math.sqrt(nextPiece.length); x++) {
            if (nextPiece[y*Math.sqrt(nextPiece.length) + x] !== ".") {
                var color = getColorByPieceCode(nextPiece[y*Math.sqrt(nextPiece.length) + x]);
                drawRect((x + mapWidth + 1)*SCALE + 7*SCALE, (y + 1)*SCALE, SCALE, SCALE, color);
            }
        }
    }

    // draw hold piece
    for (let y = 0; y < Math.sqrt(holdPiece.length); y++) {
        for (let x = 0; x < Math.sqrt(holdPiece.length); x++) {
            if (holdPiece[y*Math.sqrt(holdPiece.length) + x] !== ".") {
                var color = getColorByPieceCode(holdPiece[y*Math.sqrt(holdPiece.length) + x]);
                drawRect(x*SCALE, (y + 1)*SCALE, SCALE, SCALE, color);
            }
        }
    }
}

function getLowestPosition(piece, xOffset, yOffset, rotation) {
    removePiece(currentPiece, x, y, rotation);
    while (isClear(piece, xOffset, yOffset + 1, rotation)) {
        yOffset++;
    }
    if (blockTimer <= 0 && lineClearTimer <= 0)
        placePiece(currentPiece, x, y, rotation);
    return {
        x: xOffset,
        y: yOffset
    }
}

function getColorByPieceCode(pieceCode) {
    if (pieceCode in colors) {
        return colors[pieceCode];
    }
    else {
        return "#bbb";
    }
}

function resetMap() {
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            map[y*mapWidth + x] = x == 0 || x == mapWidth - 1 || y == mapHeight - 1 ? "x" : ".";
        }
    }
    score = 0;
    lines = 0;
    level = 0;
    fallDelay = speeds[0];
    rotation = 0;
    holdPiece = [];
}

function refillPieceQueue() {
    var pieceSet = [];
    while (pieceSet.length != pieces.length) {
        var newPiece = pieces[Math.floor(Math.random()*pieces.length)];
        if (!pieceSet.includes(newPiece)) {
            pieceSet.push(newPiece);
        }
    }
    for (let i = 0; i < pieceSet.length; i++) {
        pieceQueue.push(pieceSet[i]) + " " + pieceSet[i];
    }
}

function pushDownLines(line) {
    for (let y = line; y > 1; y--) {
        for (let x = 1; x < mapWidth; x++) {
            map[y*mapWidth + x] = map[(y - 1) * mapWidth + x];
        }
    }
}

function checkLines() {
    linesCleared = [];
    for (let y = 0; y < mapHeight - 1; y++) {
        if (!map.slice(y*mapWidth, y*mapWidth + mapWidth - 1).includes(".")) {
            linesCleared.push(y);
        }
    }
    return linesCleared;
}

function getPart(piece, x, y, rotation) {
    if (((rotation % 4) + 4) % 4 == 0) {
        return piece[y*Math.sqrt(piece.length) + x];
    }
    else if (((rotation % 4) + 4) % 4 == 1) {
        return piece[piece.length - Math.sqrt(piece.length) + y - Math.sqrt(piece.length)*x];
    }
    else if (((rotation % 4) + 4) % 4 == 2) {
        return piece[piece.length - 1 - Math.sqrt(piece.length)*y - x];
    }
    else {
        return piece[Math.sqrt(piece.length) - 1 - y + Math.sqrt(piece.length)*x];
    }
}

function placePiece(piece, xOffset, yOffset, rotation) {
    for (let y = 0; y < Math.sqrt(piece.length); y++) {
        for (let x = 0; x < Math.sqrt(piece.length); x++) {
            map[(y + yOffset)*mapWidth + x + xOffset] = getPart(piece, x, y, rotation) != "." ? getPart(piece, x, y, rotation) : map[(y + yOffset)*mapWidth + x + xOffset];
        }
    }
}

function removePiece(piece, xOffset, yOffset, rotation) {
    for (let y = 0; y < Math.sqrt(piece.length); y++) {
        for (let x = 0; x < Math.sqrt(piece.length); x++) {
            map[(y + yOffset)*mapWidth + x + xOffset] = getPart(piece, x, y, rotation) != "." ? "." : map[(y + yOffset)*mapWidth + x + xOffset];
        }
    }
}

function isClear(piece, xOffset, yOffset, rotation) {
    for (let y = 0; y < Math.sqrt(piece.length); y++) {
        for (let x = 0; x < Math.sqrt(piece.length); x++) {
            if (getPart(piece, x, y, rotation) !== "." && map[(y + yOffset)*mapWidth + x + xOffset] !== ".") return false;
        }
    }
    return true;
}

function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawMap() {
    // draw walls
    ctx.globalAlpha = 1;
    for (let y = 2; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (map[y*mapWidth + x] !== ".") {
                var color = getColorByPieceCode(map[y*mapWidth + x]);
                drawRect(x*SCALE + 7*SCALE, y*SCALE - 2*SCALE, SCALE, SCALE, color);
            }
        }
    }
}

/***************
* MAIN FUNCTION
****************/
function main() {

    // clear the sceen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // show lines and score
    shadowPiece = currentPiece;
    shadowX = getLowestPosition(currentPiece, x, y, rotation).x;
    shadowY = getLowestPosition(currentPiece, x, y, rotation).y;
    printScore();

    // show next piece
    if (blockTimer <= 0 && lineClearTimer <= 0)
        nextPiece = pieceQueue[0];

    // make piece fall
    if (blockTimer <= 0)
        fallTimer++;
    
    blockTimer--;
    lineClearTimer--;

    // clear line animations
    if (lineClearTimer > 0) {
        var color = "white";
        var colors = ["t", "s", "z", "o", "i", "l", "j"];
        for (let y = 0; y < linesCleared.length; y++) {
            for (let x = 1; x < mapWidth - 1; x++) {
                if (gotTetris || gotMultris)
                    color = colors[Math.floor(Math.random() * colors.length)];
                map[linesCleared[y]*mapWidth + x] = color;
                if (gotMultris && x%2 == 0) {
                    var html = document.getElementById("html");
                    html.style.backgroundColor = "#eee";
                }
                else if (gotMultris % x%2 == 1) {
                    var html = document.getElementById("html");
                    html.style.backgroundColor = "#000";
                }
            }
        }
    }

    if (lineClearTimer == 0) {
        // clear lines
        for (let y = 0; y < linesCleared.length; y++) {
            for (let x = 1; x < mapWidth - 1; x++) {
                map[linesCleared[y]*mapWidth + x] = ".";
            }
        }

        // push down lines
        for (let y = 0; y < linesCleared.length; y++) {
            pushDownLines(linesCleared[y]);
        }
    }
    
    // handle movements
    if (blockTimer <= 0 && lineClearTimer <= 0) {
        if (leftPressed && !rightPressed) {
            if (shiftTimer % currentShiftDelay == 0) {
                removePiece(currentPiece, x, y, rotation);
                if (isClear(currentPiece, x - 1, y, rotation)) {
                    x--;
                }
                if (!firstShift)
                    currentShiftDelay = shiftDelay;
                firstShift = false;
            }
            shiftTimer++;
        }
        
        if (rightPressed && !leftPressed) {
            if (shiftTimer % currentShiftDelay == 0) {
                removePiece(currentPiece, x, y, rotation);
                if (isClear(currentPiece, x + 1, y, rotation)) {
                    x++;
                }
                if (!firstShift)
                    currentShiftDelay = shiftDelay;
                firstShift = false;
            }
            shiftTimer++;
        }

        if (!leftPressed && !rightPressed) {
            shiftTimer = 0;
            currentShiftDelay = autoShiftDelay;
            firstShift = true;
        }

        // soft drop
        if (downPressed && canSoftDrop) {
            currentFallDelay = fastFallDelay;
        }
        else if (!downPressed) {
            currentFallDelay = fallDelay;
            canSoftDrop = true;
        }
        else {
            currentFallDelay = fallDelay;
        }

        // hard drop
        if (spacePressed && canHardDrop) {
            var bottomX = getLowestPosition(currentPiece, x, y, rotation).x;
            var bottomY = getLowestPosition(currentPiece, x, y, rotation).y;
            removePiece(currentPiece, x, y, rotation);
            score += 2*(bottomY - y);
            x = bottomX;
            y = bottomY;
            placePiece(currentPiece, x, y, rotation);
            fallTimer = -1;
            hardDropped = true;
            canHardDrop = false;
        }

        if (!spacePressed) {
            canHardDrop = true;
        }
        
        // handle rotation
        if (zPressed && canRotate) {
            canRotate = false;
            removePiece(currentPiece, x, y, rotation);
            if (isClear(currentPiece, x, y, rotation - 1)) {
                rotation--;
            }
        }
        
        if (xPressed && canRotate) {
            canRotate = false;
            removePiece(currentPiece, x, y, rotation);
            if (isClear(currentPiece, x, y, rotation + 1)) {
                rotation++;
            }
        }
        
        if (!zPressed && !xPressed) {
            canRotate = true;
        }

        // handle hold piece controls
        if (cPressed && canHold) {
            removePiece(currentPiece, x, y, rotation);
            if (holdPiece.length == 0) {
                holdPiece = currentPiece;
                currentPiece = pieceQueue.shift();
            } 
            else {
                var temp = holdPiece;
                holdPiece = currentPiece;
                currentPiece = temp;
            }
            rotation = 0;
            fallTimer = -1;
            x = startX;
            y = startY;
            canHold = false;
        }
    } // if blockTimer <= 0

   if (fallTimer % currentFallDelay == 0 && blockTimer <= 0 && lineClearTimer <= 0) {
        removePiece(currentPiece, x, y, rotation);
        if (isClear(currentPiece, x, y + 1, rotation)) {
            y++;
            
            // increase score if fastdropping
            if (downPressed) {
                score++;
            }
        }	

        // piece hits ground
        else {
            // get next piece
            placePiece(currentPiece, x, y, rotation);
            x = startX;
            y = startY;
            rotation = 0;
            currentPiece = pieceQueue.shift();
            if (hardDropped || !canHold)
                blockTimer = 1;
            else
                blockTimer = blockDelay;
            canHold = true;
            hardDropped = false;

            if (pieceQueue.length == pieces.length) {
                refillPieceQueue();
            }

            // prevent second soft drop
            if (downPressed) {
                canSoftDrop = false;
            }

            // check for lines
            linesCleared = checkLines();

            // update score
            lines += linesCleared.length;
            level = Math.min(speeds.length - 1, Math.floor(lines/10));

            // increase level according to lines
            if (level < speeds.length) {
                fallDelay = speeds[level];
            }

            // count combos
            if (linesCleared.length >= 1) {
                combo++;
                lineClearTimer = lineClearDelay;
            }
            else {
                combo = 0;
            }

            // check for tetris or multris
            if (linesCleared.length == 4) {
                gotTetris = true;
                lineClearTimer = lineClearTetrisDelay;
            }
            else if (linesCleared.length == 5) {
                gotTetris = true;
                gotMultris = true;
                lineClearDelay = lineClearMultrisDelay;
            }
            else {
                gotTetris = false;
                gotMultris = false;
            }

            if (linesCleared.length == 1)
                score += 100*(level + 1) + (combo - 1)*50*(level + 1);
            else if (linesCleared.length == 2)
                score += 300*(level + 1) + (combo - 1)*50*(level + 1);
            else if (linesCleared.length == 3)
                score += 500*(level + 1) + (combo - 1)*50*(level + 1);
            else if (linesCleared.length == 4)
                score += 800*(level + 1) + (combo - 1)*50*(level + 1);
            else if (linesCleared.length == 5)
                score += 1200*(level + 1) + (combo - 1)*50*(level + 1);

            // check for game over
            // return to menu, post score
            if (!isClear(currentPiece, startX, 0, rotation)) {
                running = false;
                postScore(window.name, score);
                //resetMap();
                //pieceQueue = Array(0);
                //refillPieceQueue();
                //refillPieceQueue();
                //currentPiece = pieceQueue.shift();
            }
        }
    }
  
    // draw block
    if (blockTimer <= 0 && lineClearTimer <= 0) {
        placePiece(currentPiece, x, y, rotation);

        // draw shadow piece
        if (!hardDropped) {
            ctx.globalAlpha = .35;
            for (let y = 0; y < Math.sqrt(shadowPiece.length); y++) {
                for (let x = 0; x < Math.sqrt(shadowPiece.length); x++) {
                    if (getPart(shadowPiece, x, y, rotation) !== ".") {
                        var color = getColorByPieceCode(getPart(shadowPiece, x, y, rotation));
                        drawRect((shadowX + x + 7)*SCALE, (shadowY + y)*SCALE - 2*SCALE, SCALE, SCALE, color);
                    }
                }
            }
            ctx.globalAlpha = 1;
        }
    }

    drawMap();

    // check if game is running
    if (running) {
      requestAnimationFrame(main);
    }

}

// run game
main();

/****************
* CONTROL INPUTS
*****************/
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var rightPressed = false;
var leftPressed = false;
var downPressed = false;
var spacePressed = false;
var zPressed = false;
var xPressed = false;
var cPressed = false;

var keyTime = 0;

function keyDownHandler(e) {
    if (e.keyCode == 37) {
        leftPressed = true;
    }
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    if (e.keyCode == 40) {
        downPressed = true;
    }
    if (e.keyCode == 90) {
        zPressed = true;
    }
    if (e.keyCode == 88) {
        xPressed = true;
    }
    if (e.keyCode == 67) {
        cPressed = true;
    }
    if (e.keyCode == 32) {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 37) {
        leftPressed = false;
    }
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    if (e.keyCode == 40) {
        downPressed = false;
    }
    if (e.keyCode == 90) {
        zPressed = false;
    } 
    if (e.keyCode == 88) {
        xPressed = false;
    }
    if (e.keyCode == 67) {
        cPressed = false;
    }
    if (e.keyCode == 32) {
        spacePressed = false;
    }
}
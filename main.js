// Game data
var i = 0;
var highest = 0;
var gameOver = false;

// Elements
var currentElement;
var maxElement;
var nextElement;
var inputElement;
var outputElement;
var resetButton;
var resetLabel;
var isTouch;

document.addEventListener('keydown', keyHandler);

window.onload = function () {
    // Get the elements to display info
    currentElement = document.getElementById("current");
    maxElement = document.getElementById("max");
    nextElement = document.getElementById("next");
    outputElement = document.getElementById("output");
    resetButton = document.getElementById("reset-button");
    resetLabel = document.getElementById("reset-label");

    // Initialise some of the elements
    highest = getHighest() || 0;
    maxElement.innerHTML = highest;
    currentElement.innerHTML = 0;

    // Is this a touchscreen
    isTouch = 'ontouchstart' in document.documentElement;
    if (isTouch) {
        //Focus the hidden input to show the touch keyboard
        inputElement = document.getElementById("hidden-input");
        inputElement.focus();
        resetLabel.style.display = 'none';
        resetButton.style.display = 'inline-block'
    }
}

/**
 * Handle a keyboard input
 * @param {event} e keyboard event
 */
function keyHandler(e) {
    if (/^[0-9]$/i.test(e.key) && !gameOver) {
        // 0-9 and not game over, check the digits
        checkDigit(e.key);
    } else if (/^r$/i.test(e.key) && gameOver) {
        // r/R and game is over, reset the game
        reset();
    }
}

/**
 * Check a digit against the current index of Pi
 * @param {number} digit A digit from 0-9
 */
function checkDigit(digit) {
    // Is the latest key-press digit the same as the current index in Pi
    if (PI[i] == digit) {
        i++;
        addDigit(digit);
        // Check if this is the highest score so far 
        if (i > highest) {
            setHighest();
        }
    } else {
        wrong();
    }
}


/**
 * Add a correct digit to the output of Pi and update the current score
 * @param {number} digit A digit from 0-9
 */
function addDigit(digit) {
    // Create a new span to hold the number
    const newSpan = document.createElement('span');
    newSpan.innerText = digit;

    // Calculate the colour, this cycles every 36 numbers but could be dynamic e.g. proportional to current max or approaching green near the max
    const hue = ((i + 18) % 36) * 10;
    const style = `color: hsl(${hue}, 50%, 50%)`;
    newSpan.style = style;

    // Append the span
    outputElement.appendChild(newSpan);
    currentElement.innerHTML = i;
}

/**
 * Shows the next 4 digits of Pi and checks if the current score beats the highest
 */
function wrong() {
    // Show the next 4 digits of Pi
    // nextElement.innerHTML = PI.substring(i, i + 4);

    const nextNumbers = PI.substring(i, i + 100);

    for (let j = 0; j < nextNumbers.length; j++) {
        const n = nextNumbers[j];
        // Create a new span to hold the number
        const newSpan = document.createElement('span');
        newSpan.innerText = n;

        const fontSize = 32 * Math.pow(0.95, j);
        newSpan.style.fontSize = `${fontSize}pt`;

        nextElement.appendChild(newSpan);
    }

    gameOver = true;
}

/**
 * Reset the game
 */
function reset() {
    outputElement.innerHTML = "3.";
    nextElement.innerHTML = "";
    currentElement.innerHTML = "0";
    i = 0;
    gameOver = false;

    if (isTouch) {
        inputElement.value = '';
        inputElement.focus();
    }
}

/**
 * Store the current highest score in local storage and show it on screen
 */
function setHighest() {
    highest = i;
    if (typeof (Storage) !== "undefined") {
        window.localStorage.setItem("maxScore", highest);
    }
    maxElement.innerHTML = highest;
}

/**
 * Get the highest score from local storage
 */
function getHighest() {
    if (typeof (Storage) !== "undefined") {
        return window.localStorage.getItem("maxScore", highest);
    }
}

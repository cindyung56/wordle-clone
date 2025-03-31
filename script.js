import WORDS from "./words.js";
import letterColors from "./colors.js";

// CONSTANTS
const word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
const NUMBER_OF_GUESSES = 6;

// VARIABLES
let index = 0;
let remainingGuesses = NUMBER_OF_GUESSES;
let guessArr = [0, 0, 0, 0, 0];

// HTML Elements
const gameBoard = document.getElementById("game-board");
const keyButton = document.querySelectorAll(".keyboard-button");

// function to initialize the game board on page load
function createGameBoard() {
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      const box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }
    gameBoard.appendChild(row);
  }
}

// function from the Animate.css documentation to assign an element with an animate class
const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    element.style.setProperty("--animate-duration", "0.5s");

    element.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });

/* function that looks out for a key press 
    - if there are no remaining guesses left, just return immediately to stop function
    - if the key is either an alphabetic or Backspace key, call updateGameArr() with the value of the key pressed
    - if the key is Enter AND the guessArr is full, call submitGuess()
*/
function getLetterFromKeyUp(event) {
  if (remainingGuesses === 0) {
    return;
  }
  const pressedKey = String(event.key).toUpperCase();
  if (pressedKey !== "ENTER") updateGameArr(pressedKey);
  else if (pressedKey == "ENTER" && !guessArr.join("").includes(0))
    submitGuess();
}

/* function that handles the in-app keyboard interaction inputs
    - if there are no remaining guesses left, just return immediately to stop function
    - if the button pressed is not Enter, call updateGameArr with the button's value
    - if the button pressed is Enter AND guessArr is full, call submitGuess()
*/
function getLetterFromButton(event) {
  if (remainingGuesses === 0) {
    return;
  }
  const pressedKey = event.target.textContent;
  if (pressedKey !== "ENTER") updateGameArr(pressedKey);
  else if (pressedKey == "ENTER" && !guessArr.join("").includes(0))
    submitGuess();
}

/* function that handles updating the guessArr array to reflect the user's guesses
    - if the key is either "BACKSPACE" (keyboard input) or "DEL" (in-app keyboard button), revert the guessArr[index] back to 0 decrement the index
    - if the key is a singular letter char AND the index is less than 5, add the letter to guessArr and increment the index
    - after either of those options run, call updateDisplay() to update the display on the board
*/
function updateGameArr(letter) {
  let backspacePressed = false;
  if ((letter === "BACKSPACE" || letter === "DEL") && index > 0) {
    index--;
    guessArr[index] = 0;
    backspacePressed = true;
  } else if (/^[a-zA-Z]+$/.test(letter) && letter.length === 1 && index < 5) {
    guessArr[index] = letter;
    index++;
  }
  updateDisplay(backspacePressed);
}

/* update the current row with the letters from guessArr 
    - for each letter box in the current row, check if guessArr[i] is a letter or 0
    - if guessArr[i] is a letter, update the textContent of the letter box to the character in guessArr[i] and animate it with the pulse animation
    - if guessArr[i] is a 0, leave the letter box blank (will not animate due to backspacePressed)
*/
function updateDisplay(backspacePressed) {
  const r = document.querySelectorAll(".row")[6 - remainingGuesses];
  for (let i = 0; i < 5; i++) {
    const l = r.querySelectorAll(".letter-box")[i];
    if (guessArr[i] !== 0) {
      if (index - 1 === i && !backspacePressed) animateCSS(l, "pulse");
      l.textContent = guessArr[i];
    } else l.textContent = "";
  }
}

/* function to submit the guess and compare it to the word
    - joins the arr to a single string
    - calls changeColorsAfterGuess() to change the display of the row and keyboard
    - if the guess and word are equal, immediately return and stop the game
    - if the guess and word are not equal, decrease remainingGuesses and reset both the guessArr and index
    - if remainingGuesses are 0, call finalWordDisplay() to display the word to the user
*/
function submitGuess() {
  const guess = guessArr.join("");
  changeColorsAfterGuess();
  if (guess === word) {
    remainingGuesses = 0;
  } else {
    // reset both the guessArr and index
    guessArr = [0, 0, 0, 0, 0];
    index = 0;
  }
  remainingGuesses--;
  if (remainingGuesses === 0) finalWordDisplay();
}

/* function to change the colors of the row and keyboard after the user submits their guess
    - for each letter box in the current row, check if the letter box's textContent matches the letter in the word at that specific index
    - if it does, change the backgroundColor of the letter box to #6AAA64 and update the letterColors object with that color
    - if it doesn't match but the letter is in the word, change the backgroundColor of the letter box to #D1B036 and update the letterColors object with that color
    - (NOTE: if the letter has already been established as green but was put in a different spot that turned yellow, it should not update the letterColors object to yellow; it should stay as green)
    - if it doesn't match and the letter is not in the word, change the backgroundColor of the letter box to grey and update the letterColors object with that color
    - after changing the colors, call changeColorsOnKeyboard() to update the colors of the keyboard buttons to match the new colors of the row and keyboard letters
*/
function changeColorsAfterGuess() {
  const r = document.querySelectorAll(".row")[6 - remainingGuesses];
  const boxes = r.querySelectorAll(".letter-box");
  for (let j = 0; j < boxes.length; j++) {
    setTimeout(() => {
      animateCSS(boxes[j], "flipInX");
      const l = boxes[j].textContent;
      if (l === word[j]) {
        boxes[j].style.backgroundColor = "#6AAA64";
        letterColors[l] = "#6AAA64";
      } else if (word.includes(l)) {
        boxes[j].style.backgroundColor = "#D1B036";
        if (letterColors[l] !== "#6AAA64") letterColors[l] = "#D1B036";
      } else {
        boxes[j].style.backgroundColor = "grey";
        letterColors[l] = "grey";
      }
      changeColorsOnKeyboard(l);
    }, 250 * j);
  }
}

/* function to change the colors of the keyboard based on the colors from the letterColors object
    - goes through each key on the keyboard and compares it to the letter argument; if they match, changes the background-color of the button element with the given color
*/
function changeColorsOnKeyboard(letter) {
  const keys = document.querySelectorAll(".keyboard-button");
  for (let i = 0; i < keys.length; i++) {
    const l = keys[i].textContent;
    if (letter === l) keys[i].style.backgroundColor = letterColors[l];
  }
}

// function to display the final word at the end of the game if the user ran out of tries
function finalWordDisplay() {
  const finalWordEl = document.getElementById("final-word");
  finalWordEl.textContent = `The word was ${word.toLowerCase()}.`;
}

// event listeners
document.addEventListener("keyup", getLetterFromKeyUp);
for (let i = 0; i < keyButton.length; i++) {
  keyButton[i].addEventListener("click", getLetterFromButton);
}

// initialize game board
createGameBoard();

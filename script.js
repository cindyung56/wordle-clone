import WORDS from "./words.js";
import letterColors from "./colors.js";

// CONSTANTS
const word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
const NUMBER_OF_GUESSES = 6;

// VARIABLES
let index = 0;
let remainingGuesses = NUMBER_OF_GUESSES;
let guessArr = [0, 0, 0, 0, 0];
console.log(word); // test, comment out later

// HTML Elements
const gameBoard = document.getElementById("game-board");
const keyButton = document.querySelectorAll(".keyboard-button");

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

function getLetterFromKeyUp(event) {
  if (remainingGuesses === 0) {
    return;
  }
  const pressedKey = String(event.key).toUpperCase();
  if (pressedKey !== "ENTER") updateGameArr(pressedKey);
  else if (pressedKey == "ENTER" && !guessArr.join("").includes(0)) submitGuess();
}

function getLetterFromButton(event) {
  if (remainingGuesses === 0) {
    return;
  }
  const pressedKey = event.target.textContent;
  if (pressedKey !== "ENTER") updateGameArr(pressedKey);
  else if (pressedKey == "ENTER" && !guessArr.join("").includes(0)) submitGuess();
}

function updateGameArr(letter) {
  if ((letter === "BACKSPACE" || letter === "DEL") && index > 0) {
    index--;
    guessArr[index] = 0;
  } else if (/^[a-zA-Z]+$/.test(letter) && letter.length === 1 && index < 5) {
    guessArr[index] = letter;
    index++;
  }
  updateDisplay();
}

// update the current row with the letters from guessArr
function updateDisplay() {
  const r = document.querySelectorAll(".row")[6 - remainingGuesses];
  for (let i = 0; i < 5; i++) {
    const l = r.querySelectorAll(".letter-box")[i];
    guessArr[i] !== 0 ? (l.textContent = guessArr[i]) : (l.textContent = "");
  }
}

function submitGuess() {
    const guess = guessArr.join("");
    changeColorsAfterGuess();
    if (guess === word) {
      remainingGuesses = 0;
      return;
    } else {
      // reset both the guessArr and index
      guessArr = [0, 0, 0, 0, 0];
      index = 0;
    }
    remainingGuesses--;
    if (remainingGuesses === 0) finalWordDisplay();
  }

function changeColorsAfterGuess() {
  const r = document.querySelectorAll(".row")[6 - remainingGuesses];
  const boxes = r.querySelectorAll(".letter-box");
  for (let j = 0; j < boxes.length; j++) {
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
  }
  changeColorsOnKeyboard();
}

function changeColorsOnKeyboard() {
  const keys = document.querySelectorAll(".keyboard-button");
  for (let i = 0; i < keys.length; i++) {
    const l = keys[i].textContent;
    keys[i].style.backgroundColor = letterColors[l];
  }
}

function finalWordDisplay(){
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

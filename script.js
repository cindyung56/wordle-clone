import { WORDS } from "./words.js";

// CONSTANTS
const word = WORDS[Math.floor(Math.random() * WORDS.length)];
const NUMBER_OF_GUESSES = 6;
const gray_letters = [];
const yellow_letters = [];
const green_letters = [];


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
  if (pressedKey !== "ENTER") updateBoard(pressedKey);
  else if (pressedKey == "ENTER" && !guessArr.join("").includes(0)) submitGuess();
}

function getLetterFromButton(event) {
  if (remainingGuesses === 0) {
    return;
  }
  const pressedKey = event.target.textContent;
  if (pressedKey !== "ENTER") updateBoard(pressedKey);
  else if (pressedKey == "ENTER" && !guessArr.join("").includes(0)) submitGuess();
}

function updateBoard(letter) {
  if ((letter === "BACKSPACE" || letter === "DEL") && index > 0) {
    index--;
    guessArr[index] = 0;
  } else if (/^[a-zA-Z]+$/.test(letter) && letter.length === 1 && index < 5) {
    guessArr[index] = letter;
    index++;
  }
  updateDisplay();
}

function submitGuess() {
  const guess = guessArr.join("");
  changeColorsAfterGuess();
  if (guess.toLowerCase() === word) {
    remainingGuesses = 0;
    return;
  } else {
    guessArr = [0, 0, 0, 0, 0];
    index = 0;
  }
  remainingGuesses--;
}

// update the row with the letters from guessArr
function updateDisplay() {
  const r = document.querySelectorAll(".row")[6 - remainingGuesses];
  for (let i = 0; i < 5; i++) {
    const l = r.querySelectorAll(".letter-box")[i];
    guessArr[i] !== 0 ? (l.textContent = guessArr[i]) : (l.textContent = "");
  }
}

function changeColorsAfterGuess() {
  const r = document.querySelectorAll(".row")[6 - remainingGuesses];
  const boxes = r.querySelectorAll(".letter-box");
  for (let j = 0; j < boxes.length; j++) {
    const l = boxes[j].textContent.toLowerCase();
    if (l === word[j]) {
      boxes[j].style.backgroundColor = "#6AAA64";
      if (!green_letters.includes(l)) green_letters.push(l);
    } else if (word.includes(l)) {
      boxes[j].style.backgroundColor = "#D1B036";
      if (!yellow_letters.includes(l)) yellow_letters.push(l);
    } else {
      boxes[j].style.backgroundColor = "grey";
      if (!gray_letters.includes(l)) gray_letters.push(l);
    }
  }
  changeColorsOnKeyboard();
}

function changeColorsOnKeyboard() {
  const keys = document.querySelectorAll(".keyboard-button");
  for (let i = 0; i < keys.length; i++) {
    const l = keys[i].textContent.toLowerCase();
    if (gray_letters.includes(l)) keys[i].style.backgroundColor = "grey";
    else if (yellow_letters.includes(l)) keys[i].style.backgroundColor = "#D1B036";
    else if (green_letters.includes(l)) keys[i].style.backgroundColor = "#6AAA64";
  }
}

// event listeners
document.addEventListener("keyup", getLetterFromKeyUp);
for (let i = 0; i < keyButton.length; i++) {
  keyButton[i].addEventListener("click", getLetterFromButton);
}

// initialize game board
createGameBoard();

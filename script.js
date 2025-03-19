import { WORDS } from "./words.js";

// CONSTANTS
const word = WORDS[Math.floor(Math.random() * WORDS.length)];
const NUMBER_OF_GUESSES = 6;

// VARIABLES
let index = 0;
let remainingGuesses = NUMBER_OF_GUESSES;
let guessArr = [0, 0, 0, 0, 0];
// console.log(word); // test, comment out later

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
  pressedKey !== "ENTER" ? updateBoard(pressedKey) : submitGuess();
}

function getLetterFromButton(event) {
  if (remainingGuesses === 0) {
    return;
  }
  const pressedKey = event.target.textContent;
  pressedKey !== "ENTER" ? updateBoard(pressedKey) : submitGuess();
}

function updateBoard(letter) {
  if ((letter === "BACKSPACE" || letter === "DEL") && index > 0) {
    index--;
    guessArr[index] = 0;
  } else if (/^[a-zA-Z]+$/.test(letter) && letter.length === 1 && index < 5) {
    guessArr[index] = letter;
    index++;
  }
  console.log(guessArr.join(""), index);
  updateDisplay();
}

function submitGuess() {
  const guess = guessArr.join("");
  console.log("Guess: ", guess);
  remainingGuesses--;
  if (guess.toLowerCase() === word) {
    console.log("Congratulations! You guessed the word!");
    remainingGuesses = 0;
    return;
  } else{
    console.log("Incorrect guess. You have", remainingGuesses, "guesses left.");
    guessArr = [0,0,0,0,0];
    index = 0;
  }
}

function updateDisplay() {
  const r = document.querySelectorAll(".row")[6 - remainingGuesses];
  for (let i = 0; i < 5; i++) {
    const l = r.querySelectorAll(".letter-box")[i];
    guessArr[i] !== 0 ? (l.textContent = guessArr[i]) : (l.textContent = "");
  }
}

document.addEventListener("keyup", getLetterFromKeyUp);
for (let i = 0; i < keyButton.length; i++) {
  keyButton[i].addEventListener("click", getLetterFromButton);
}

createGameBoard();
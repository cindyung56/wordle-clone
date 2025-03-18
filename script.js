import { WORDS } from "./words.js";

// CONSTANTS
const word = WORDS[Math.floor(Math.random() * WORDS.length)];
const NUMBER_OF_GUESSES = 6; 
const remainingGuesses = NUMBER_OF_GUESSES;
console.log(word); // test, comment out later

// HTML Elements
const gameBoard = document.getElementById('game-board');
const keyButton = document.querySelectorAll('.keyboard-button');


function createGameBoard(){
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            row.appendChild(box);
        }
        gameBoard.appendChild(row);
    }
}

function getLetterFromKeyUp(event){
    const pressedKey = String(event.key).toUpperCase();
    console.log(pressedKey);
}


function getLetterFromButton(event){
    const pressedKey = event.target.textContent;
    console.log(pressedKey);
}



createGameBoard();

document.addEventListener('keyup', getLetterFromKeyUp);
for (let i = 0; i < keyButton.length; i++) {
    keyButton[i].addEventListener('click', getLetterFromButton);
}
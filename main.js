// Importing styles at the beginning of your main.js
import "./app.scss";

import {WordGuesser} from "./WordGuesser.js";

const wordGuesser = new WordGuesser();
const wordDisplay = document.getElementById('wordDisplay');
const keyboard = document.getElementById('keyboard');

function renderWord() {
    const currentWord = wordGuesser.getCurrentWord();
    wordDisplay.textContent = currentWord
        .split('')
        .map(letter => (wordGuesser.hasGuessedLetter(letter.toLowerCase()) ? letter : '_'))
        .join(' ');
}

function renderKeyboard() {
    const russianAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

    russianAlphabet.split('').forEach(letter => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = letter.toUpperCase();
        keyElement.addEventListener('click', () => handleKeyClick(letter, keyElement));
        keyboard.appendChild(keyElement);
    });
}

function handleKeyClick(letter, keyElement) {
    try {
        const isCorrectGuess = wordGuesser.guessLetter(letter);
        renderWord();

        if (!isCorrectGuess) {
            keyElement.classList.add('incorrect');
        }

        if (isCorrectGuess && wordGuesser.areAllLettersGuessed()) {
            alert('Поздравляем! Вы отгадали слово.');
            wordGuesser.generateNewWord();
            renderWord();
        }
    } catch (error) {
        alert(error.message);
    }
}

renderWord();
renderKeyboard();

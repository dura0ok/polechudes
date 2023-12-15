import "./app.scss";
import { WordGuesser } from "./WordGuesser.js";

function play(src) {
    return new Promise(function(resolve, reject) {   // return a promise
        const audio = new Audio();                     // create audio wo/ src
        audio.preload = "auto";                      // intend to play through
        audio.autoplay = true;                       // autoplay when loaded
        audio.onerror = reject;                      // on error, reject
        audio.onended = resolve;                     // when done, resolve
        audio.src = src
    });
}


const wordGuesser = new WordGuesser();
const wordDisplay = document.getElementById('wordDisplay');
const keyboard = document.getElementById('keyboard');




function renderWord() {
    const currentWord = wordGuesser.getCurrentWord();
    wordDisplay.innerHTML = ""; // Clear word display before rendering

    for (let i = 0; i < currentWord.length; i++) {
        const letter = currentWord[i];
        const span = document.createElement('span');
        span.classList.add('word-letter');

        if (wordGuesser.hasGuessedLetterAtPosition(letter.toLowerCase(), i) || letter === ' ') {
            span.textContent = letter;
        } else {
            span.textContent = '_';
        }

        wordDisplay.appendChild(span);
    }
}

function renderKeyboard() {
    const russianAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

    for (const letter of russianAlphabet) {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = letter;
        keyElement.addEventListener('click', () => handleKeyClick(letter, keyElement));
        keyboard.appendChild(keyElement);
    }
}

async function handleKeyClick(letter, keyElement) {
    try {
        const isCorrectGuess = wordGuesser.guessLetter(letter.toLowerCase(), null);
        displayResultImage(isCorrectGuess)
        if (isCorrectGuess) {
            markKeyAsCorrect(keyElement);
        }else {
            await play('./sounds/incorrect.mp3');
            markKeyAsIncorrect(keyElement);
        }
        renderWord();

        if (wordGuesser.allLettersGuessed()) {
            await handleWin();
        }
    } catch (error) {
        alert(error.message);
    }
}

function markKeyAsCorrect(keyElement) {
    keyElement.classList.add("correct");
}

function markKeyAsIncorrect(keyElement) {
    keyElement.classList.add('incorrect');
}

async function handleWordClick(event) {
    const index = Array.from(event.target.parentNode.children).indexOf(event.target);
    const letter = wordGuesser.getCurrentWord()[index];

    if (!wordGuesser.hasGuessedLetterAtPosition(letter.toLowerCase(), index)) {
        wordGuesser.guessLetterAtPosition(letter, index);
        if (wordGuesser.hasGuessedLetterAtPosition(letter, null)) {
            markKeyAsCorrect(getKeyElementByLetter(letter));
        }
        renderWord();

        if (wordGuesser.allLettersGuessed()) {
            await handleWin();
        }
    }
}

function getKeyElementByLetter(letter) {
    const keys = document.querySelectorAll('.key');
    for (const key of keys) {
        if (key.textContent === letter) {
            return key;
        }
    }
    return null;
}


async function handleWin() {
    play('./sounds/correct.mp3').then(() => {
        alert('Поздравляем! Вы отгадали слово.');
        wordGuesser.generateNewWord();
        renderWord();
        clearStyles(); // Clear incorrect styles
    });

}

function clearStyles() {
    document.querySelectorAll('.key').forEach(key => key.classList.remove('incorrect'));
    document.querySelectorAll('.key').forEach(key => key.classList.remove('correct'));
}

function displayResultImage(isCorrect) {
    const imageContainer = document.querySelector('#imageContainer');
    const resultImage = imageContainer.querySelector('img');

    // Use the server base path
    const basePath = 'images/';
    const imagePath = isCorrect ? 'correct.png' : 'incorrect.png';

    resultImage.src = basePath + imagePath;
    imageContainer.style.display = 'block';

    // Hide the image after 3 seconds
    setTimeout(() => {
        imageContainer.style.display = 'none';
    }, 3000);
}



renderWord();
renderKeyboard();
wordDisplay.addEventListener('click', async (event) => {
    if (event.target.classList.contains('word-letter')) {
        await handleWordClick(event);
    }
});

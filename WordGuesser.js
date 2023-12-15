export class WordGuesser {
    static #words = [
        'хоровод',
        'пуансеттия',
        'бонбоньерка',
        'простоквашино',
        'дзюнанушик',
        'декалькомания',
        'кирибати'
    ];

    #wordsIndex = 0;
    #guessedLetters = new Set();
    #guessedIndexes = new Set();

    generateNewWord() {
        this.#wordsIndex++;
        this.#guessedLetters.clear();
        this.#guessedIndexes.clear();
    }

    guessLetter(letter, position) {
        if (this.#guessedLetters.has(letter)) {
            throw new Error(`Буква "${letter}" уже была угадана ранее.`);
        }

        const currentWord = WordGuesser.#words[this.#wordsIndex];
        const letterLowerCase = letter.toLowerCase();

        if (currentWord.includes(letterLowerCase)) {
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i].toLowerCase() === letterLowerCase) {
                    this.#guessedLetters.add(letterLowerCase);
                    if (position === null || i === position) {
                        this.#guessedIndexes.add(i);
                    }
                }
            }

            return true;
        } else {
            this.#guessedLetters.add(letterLowerCase);
            return false;
        }
    }


    hasGuessedLetterAtPosition(letter, position) {
        const letterLowerCase = letter.toLowerCase();

        if (position === null) {
            const word = WordGuesser.#words[this.#wordsIndex];
            return [...Array(word.length).keys()].every(i =>
                (word[i] === letter && this.#guessedIndexes.has(i)) ||
                word[i] !== letter
            );
        } else {
            // Check if the guessed letter is at the specified position
            return this.#guessedIndexes.has(position) &&
                this.#guessedLetters.has(letterLowerCase);
        }
    }




    guessLetterAtPosition(letter, position) {
        if (this.hasGuessedLetterAtPosition(letter, position)) {
            throw new Error(`Буква "${letter}" уже была угадана ранее.`);
        }

        const currentWord = WordGuesser.#words[this.#wordsIndex];
        const letterLowerCase = letter.toLowerCase();
        if (currentWord[position].toLowerCase() === letterLowerCase) {
            this.#guessedLetters.add(letterLowerCase);
            this.#guessedIndexes.add(position);
        } else {
            throw new Error(`Неверная буква "${letter}" в данной позиции.`);
        }
    }

    allLettersGuessed() {
        const currentWord = WordGuesser.#words[this.#wordsIndex];
        for (let i = 0; i < currentWord.length; i++) {
            const letterLowerCase = currentWord[i].toLowerCase();
            if (!this.hasGuessedLetterAtPosition(letterLowerCase, null)) {
                return false; // Найдена неразгаданная буква
            }
        }
        return true; // Все буквы разгаданы
    }

    getCurrentWord() {
        return WordGuesser.#words[this.#wordsIndex];
    }
}

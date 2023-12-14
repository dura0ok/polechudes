export class WordGuesser {
    static #words = [
        'хоровод',
        'пуансеттия',
        'бонбоньерка',
        'простоквашино',
        'Дзюнанушик',
        'декалькомания',
        'Кирибати'
    ];

    #wordsIndex = 0;
    #guessedLetters = new Set();

    getCurrentWord() {
        return WordGuesser.#words[this.#wordsIndex];
    }

    hasGuessedLetter(letter) {
        return this.#guessedLetters.has(letter);
    }


    generateNewWord() {
        this.#wordsIndex++;
        this.#guessedLetters.clear();
    }

    guessLetter(letter) {
        if (this.#guessedLetters.has(letter)) {
            throw new Error(`Буква "${letter}" уже была угадана ранее.`);
        }

        const currentWord = WordGuesser.#words[this.#wordsIndex];
        const letterLowerCase = letter.toLowerCase();

        if (currentWord.includes(letterLowerCase)) {
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i].toLowerCase() === letterLowerCase) {
                    this.#guessedLetters.add(letterLowerCase);
                }
            }

            return true;
        } else {
            this.#guessedLetters.add(letterLowerCase);
            return false;
        }
    }

    areAllLettersGuessed() {
        const currentWord = WordGuesser.#words[this.#wordsIndex];

        for (let i = 0; i < currentWord.length; i++) {
            const currentLetter = currentWord[i].toLowerCase();

            if (!this.#guessedLetters.has(currentLetter)) {
                return false;
            }
        }

        return true;
    }
}

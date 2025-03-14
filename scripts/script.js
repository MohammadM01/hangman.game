// Getting all the necessary HTML elements using querySelector
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Setting up the main game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6; // Player has 6 chances to guess wrong

const resetGame = () => {
    // This function resets everything to start a new game
    correctLetters = []; // Clear correct letters array
    wrongGuessCount = 0; // Reset wrong guesses to 0
    hangmanImage.src = "images/hangman-0.svg"; // Set hangman image to initial state
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Reset guess counter display
    
    // Create empty letter spaces for the new word
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    
    // Enable all keyboard buttons again
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    
    // Hide the game over/win modal
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Pick a random word and hint from our word list
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Save the chosen word
    
    // Show the hint for the word
    document.querySelector(".hint-text b").innerText = hint;
    
    // Reset the game for the new word
    resetGame();
}

const gameOver = (isVictory) => {
    // Shows the game over modal with win/lose message
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    
    // Set the appropriate image (victory.gif or lost.gif)
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    
    // Set the appropriate heading (Congrats! or Game Over!)
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    
    // Show the correct word in the modal
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    
    // Display the modal
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    // This function runs when player clicks a letter
    
    // Check if clicked letter is in the word
    if(currentWord.includes(clickedLetter)) {
        // If letter is correct, show it in all positions where it appears
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If letter is wrong, increase wrong guess count and update hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    
    // Disable the clicked button so it can't be clicked again
    button.disabled = true;
    
    // Update the display of wrong guesses
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Check if game should end
    if(wrongGuessCount === maxGuesses) return gameOver(false); // Lost game
    if(correctLetters.length === currentWord.length) return gameOver(true); // Won game
}

// Create the keyboard buttons (a to z)
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i); // Convert ASCII to letter
    keyboardDiv.appendChild(button);
    // Add click event to each button
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

// Start the game by getting a random word
getRandomWord();

// Add click event to the play again button
playAgainBtn.addEventListener("click", getRandomWord);
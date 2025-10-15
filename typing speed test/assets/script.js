// --- JavaScript Logic: Enhanced Functionality ---

// --- DOM Elements ---
const textDisplay = document.getElementById('text-display');
const inputArea = document.getElementById('input-area');
const startButton = document.getElementById('start-button');
const timerDisplay = document.querySelector('#timer-display span');
const resultsSection = document.getElementById('results-section');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');
const errorsDisplay = document.getElementById('errors-display');
const difficultySelector = document.getElementById('difficulty');

// --- Game State Variables ---
let testText = '';
const TOTAL_TIME = 60; // Test duration in seconds
let timeLeft = TOTAL_TIME;
let timerInterval = null;
let errors = 0;
let isRunning = false;
let typedChars = 0;

// --- Sample Paragraphs organized by difficulty ---
const paragraphs = {
    easy: [
        "The quick brown fox jumps over the lazy dog. A simple sentence for practice.",
        "Coding is fun and interactive. Use JavaScript for dynamic web apps."
    ],
    medium: [
        "Web development is a creative and rewarding field. Mastering JavaScript DOM manipulation is essential for interactive projects. Accuracy is key.",
        "Programming a typing test requires handling many real-time events. This project is excellent for practicing front-end skills."
    ],
    hard: [
        "Accuracy is just as important as speed when measuring typing proficiency. Always focus on minimizing your error rate, even when faced with complex text structures and uncommon punctuation marks. A consistent effort in touch typing will yield the best long-term results.",
        "A computer science student often spends long hours debugging code, a process which refines problem-solving skills and requires immense patience. Building responsive user interfaces using modern CSS practices ensures a great experience on any device."
    ]
};

/** Get text based on difficulty */
function getParagraphByDifficulty(level) {
    const list = paragraphs[level] || paragraphs['medium'];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

/** Load new text */
function loadText() {
    const difficulty = difficultySelector.value;
    testText = getParagraphByDifficulty(difficulty);
    textDisplay.innerHTML = testText.split('').map(char => `<span>${char}</span>`).join('');
}

/** Start timer */
function startTimer() {
    timerDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

/** Handle input typing */
function handleInput() {
    if (!isRunning) {
        isRunning = true;
        startButton.disabled = true;
        difficultySelector.disabled = true;
        resultsSection.classList.add('hidden');
        startTimer();
    }

    const typedText = inputArea.value;
    const textChars = textDisplay.querySelectorAll('span');
    errors = 0;
    typedChars = typedText.length;
    let correctChars = 0;

    textChars.forEach((charSpan, index) => {
        const char = typedText[index];
        charSpan.classList.remove('correct', 'incorrect', 'cursor');

        if (index < typedChars) {
            if (char === charSpan.textContent) {
                charSpan.classList.add('correct');
                correctChars++;
            } else {
                if (index < testText.length) {
                    charSpan.classList.add('incorrect');
                    errors++;
                }
            }
        } else if (index === typedChars) {
            charSpan.classList.add('cursor');
        }
    });

    if (typedChars === testText.length) {
        clearInterval(timerInterval);
        endTest(correctChars);
    }
}

/** End test and calculate results */
function endTest(finalCorrectChars = 0) {
    isRunning = false;
    inputArea.disabled = true;
    startButton.textContent = 'Restart Test';
    startButton.disabled = false;
    difficultySelector.disabled = false;

    if (timeLeft <= 0) {
        const typedText = inputArea.value;
        const textChars = textDisplay.querySelectorAll('span');
        finalCorrectChars = 0;
        errors = 0;
        for (let i = 0; i < typedText.length; i++) {
            if (i < testText.length && typedText[i] === textChars[i].textContent) {
                finalCorrectChars++;
            } else if (i < testText.length) {
                errors++;
            }
        }
    }

    const timeUsed = TOTAL_TIME - timeLeft;
    const minutes = timeUsed / 60;
    const totalTyped = inputArea.value.length;
    const wpm = minutes > 0 ? Math.round((finalCorrectChars / 5) / minutes) : 0;
    const accuracy = totalTyped > 0 ? Math.round((finalCorrectChars / totalTyped) * 100) : 0;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    errorsDisplay.textContent = errors;
    resultsSection.classList.remove('hidden');
}

/** Reset and start test */
function startTest() {
    clearInterval(timerInterval);
    timeLeft = TOTAL_TIME;
    errors = 0;
    isRunning = false;
    typedChars = 0;

    timerDisplay.textContent = TOTAL_TIME;
    inputArea.value = '';
    inputArea.disabled = false;
    inputArea.focus();
    startButton.textContent = 'Typing...';
    startButton.disabled = true;
    difficultySelector.disabled = true;
    resultsSection.classList.add('hidden');

    loadText();
}

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    if (!isRunning) startTest();
});

inputArea.addEventListener('input', handleInput);
difficultySelector.addEventListener('change', loadText);

// Initial load
loadText();

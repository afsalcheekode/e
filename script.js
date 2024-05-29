const letters = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 
    'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

let placedLetters = [];
let gameStarted = false;
let startTime;
let timerInterval;

const interfaceDiv = document.getElementById('interface');
const gameContainer = document.getElementById('gameContainer');
const startBtn = document.getElementById('startBtn');
const dropZone = document.getElementById('dropZone');
const lettersContainer = document.getElementById('letters');
const result = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const checkOrderBtn = document.getElementById('checkOrderBtn');
const undoBtn = document.getElementById('undoBtn');
const restartBtn = document.getElementById('restartBtn');
const timerDisplay = document.getElementById('timer');

startBtn.addEventListener('click', startGame);
checkOrderBtn.addEventListener('click', stopTimer);
restartBtn.addEventListener('click', resetGame);

function startGame() {
    gameStarted = true;
    startTime = new Date();
    interfaceDiv.style.display = 'none';
    gameContainer.style.display = 'block';
    startTimer();
    initializeGame();
}

function initializeGame() {
    dropZone.innerHTML = '';
    lettersContainer.innerHTML = '';
    result.innerText = '';
    scoreDisplay.innerText = '';
    placedLetters = [];

    for (let i = 0; i < 28; i++) {
        const dropSlot = document.createElement('div');
        dropSlot.classList.add('drop-slot');
        dropSlot.ondrop = drop;
        dropSlot.ondragover = allowDrop;
        dropSlot.ondragleave = dragLeave;
        dropSlot.ondragenter = dragEnter;
        dropZone.appendChild(dropSlot);
    }

    const shuffledLetters = shuffleArray([...letters]);
    shuffledLetters.forEach(letter => {
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('letter');
        letterDiv.innerText = letter;
        letterDiv.draggable = true;
        letterDiv.ondragstart = drag;
        lettersContainer.appendChild(letterDiv);
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.innerText);
    event.target.classList.add('dragging');
}

function dragEnter(event) {
    event.preventDefault();
    if (event.target.classList.contains('drop-slot') && !event.target.innerText) {
        event.target.classList.add('hovered');
    }
}

function dragLeave(event) {
    if (event.target.classList.contains('drop-slot')) {
        event.target.classList.remove('hovered');
    }
}

function drop(event) {
    event.preventDefault();
    const letter = event.dataTransfer.getData('text');
    const draggingLetter = document.querySelector('.dragging');

    if (event.target.classList.contains('drop-slot') && !event.target.innerText) {
        event.target.innerText = letter;
        placedLetters.push(event.target);
        draggingLetter.remove();
    } else if (event.target.classList.contains('letter')) {
        const dropZone = document.getElementById('dropZone');
        dropZone.appendChild(draggingLetter.cloneNode(true));
        draggingLetter.remove();
    }

    document.querySelectorAll('.hovered').forEach(element => element.classList.remove('hovered'));
    draggingLetter.classList.remove('dragging');
}

function undo() {
    if (placedLetters.length > 0) {
        const lastPlacedSlot = placedLetters.pop();
        const lettersContainer = document.getElementById('letters');
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('letter');
        letterDiv.innerText = lastPlacedSlot.innerText;
        letterDiv.draggable = true;
        letterDiv.ondragstart = drag;
        lettersContainer.appendChild(letterDiv);
        lastPlacedSlot.innerText = '';
    }
}

function checkOrder() {
    const dropSlots = document.querySelectorAll('.drop-slot');
    let correctCount = 0;

    dropSlots.forEach((slot, index) => {
        if (slot.innerText === letters[index]) {
            correctCount++;
            slot.classList.add('correct');
        } else {
            slot.classList.add('wrong');
        }
    });

    const score = `${correctCount} / 28`;
    scoreDisplay.innerText = `Score: ${score}`;

    if (correctCount === 28) {
        stopTimer();
        result.innerText = 'Congratulations! You ordered the letters correctly!';
        result.style.color = 'green';
    } else {
        result.innerText = 'Try again! The order is incorrect.';
        result.style.color = 'red';
    }

    checkOrderBtn.disabled = true;
    undoBtn.disabled = true;
}

function showCorrectOrder() {
    const dropSlots = document.querySelectorAll('.drop-slot');
    dropSlots.forEach((slot, index) => {
        slot.innerText = letters[index];
        slot.classList.remove('correct', 'wrong');
    });

    const checkOrderBtn = document.getElementById('checkOrderBtn');
    const undoBtn = document.getElementById('undoBtn');
    checkOrderBtn.disabled = true;
    undoBtn.disabled = true;

    setTimeout(() => {
        dropSlots.forEach(slot => {
            slot.innerText = '';
        });
        startGame();
    }, 3000);
}

function resetGame() {
    stopTimer();
    gameStarted = false;
    interfaceDiv.style.display = 'block';
    gameContainer.style.display = 'none';
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerDisplay.innerText = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
// Add this function to the end of the script
function resetGame() {
    stopTimer();
    startGame();
}
function resetGame() {
    stopTimer();
    startGame();

    // Enable all buttons
    const checkOrderBtn = document.getElementById('checkOrderBtn');
    const undoBtn = document.getElementById('undoBtn');
    const restartBtn = document.getElementById('restartBtn');

    checkOrderBtn.disabled = false;
    undoBtn.disabled = false;
    restartBtn.disabled = false;
}

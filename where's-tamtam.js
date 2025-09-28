// Game variables
let timer = 30;
let score = 0;
let gameInterval;
let tamtamElement = null;
let gameActive = false;
let currentBackground = 0;
let soundEnabled = true;

// High scores array
let highScores = [];

// TamTam facts
const tamtamFacts = [
    "FEU's official mascot is a tamaraw named <strong>Tamtam</strong>.",
    "The tamaraw's scientific name is <strong>Bubalus mindorensis</strong>.",
    "Tamaraws are <strong>found only in Mindoro, Philippines</strong>—mainly in Mount Iglit-Baco National Park and Mount Aruyan.",
    "The tamaraw is considered <strong>one of the most intelligent and aggressive species</strong>, mirroring FEU's progressive spirit in education.",
    "Fun twist: <strong>Tamtam has no eyes!</strong> FEU wanted the mascot to stand out as unique.",
    "Tamtam's design drew inspiration from <strong>We Bare Bears, Alistar (League of Legends), and Shirley (Shaun the Sheep)</strong>.",
    "Early versions of Tamtam actually <strong>had eyes and eyebrows</strong>.",
    "Tamtam first appeared in <strong>2015</strong> on FEU's 'Walang Pasok' social media post.",
    "That same year, Tamtam joined the <strong>UAAP campaign</strong>, when FEU clinched the <strong>basketball championship</strong>.",
    "<strong>Since then, Tamtam has had countless versions: Christmas Tamtam, The Flash Tamtam, Robin Hood Tamtam, Michael Jackson Tamtam, and more!</strong>",
    "<strong>At the <strong>entrance of FEU Roosevelt Marikina</strong>, you'll spot Tamtam welcoming visitors.",
    "The real <strong>tamaraw is critically endangered</strong> due to hunting and habitat loss.",
    "Contrary to belief, the <strong>tamaraw is NOT related to the carabao</strong>."
];

// Background images (using placeholder images from picsum.photos)
const backgrounds = [
    'background-1.jpg',
    'background-2.jpg',
    'background-3.jpg',
    'background-4.jpg',
    'background-5.jpg',
    'background-6.jpg',
    'background-7.jpg'
];

// DOM elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const startBtn = document.getElementById('startBtn');
const howToBtn = document.getElementById('howToBtn');
const backToMenu = document.getElementById('backToMenu');
const howToModal = document.getElementById('howToModal');
const timeUpModal = document.getElementById('timeUpModal');
const factModal = document.getElementById('factModal');
const factText = document.getElementById('factText');
const closeHowTo = document.getElementById('closeHowTo');
const okBtn = document.getElementById('okBtn');
const closeFact = document.getElementById('closeFact');
const correctMsg = document.getElementById('correctMsg');
const wrongMsg = document.getElementById('wrongMsg');
const soundControl = document.getElementById('soundControl');
const soundIcon = document.getElementById('soundIcon');
const highScoresList = document.getElementById('highScoresList');
const scoreSubmission = document.getElementById('scoreSubmission');
const playerNameInput = document.getElementById('playerName');
const submitScoreBtn = document.getElementById('submitScore');

// Audio elements
const bgMusic = document.getElementById('bgMusic');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

// Initialize the game
function init() {
    // Load high scores from localStorage
    loadHighScores();
    
    // Display high scores
    displayHighScores();
    
    // Add event listeners
    startBtn.addEventListener('click', startGame);
    howToBtn.addEventListener('click', () => howToModal.style.display = 'flex');
    closeHowTo.addEventListener('click', () => howToModal.style.display = 'none');
    backToMenu.addEventListener('click', endGame);
    okBtn.addEventListener('click', () => {
        timeUpModal.style.display = 'none';
        endGame();
    });
    closeFact.addEventListener('click', () => factModal.style.display = 'none');
    gameBoard.addEventListener('click', handleGameBoardClick);
    soundControl.addEventListener('click', toggleSound);
    submitScoreBtn.addEventListener('click', submitHighScore);
    
    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === howToModal) {
            howToModal.style.display = 'none';
        }
        if (e.target === timeUpModal) {
            timeUpModal.style.display = 'none';
            endGame();
        }
        if (e.target === factModal) {
            factModal.style.display = 'none';
        }
    });
}

// Load high scores from localStorage
function loadHighScores() {
    const saveScores = localStorage.getItem('TamtamhighScorEs');
    if (saveScores) {
        highScores = JSON.parse(saveScores);
    } else {
        // Default high scores if none exist
        highScores = [
            { name: "I", score: 35 },
            { name: "N", score: 30 },
            { name: "N", score: 25 },
            { name: "O", score: 20 },
            { name: "V", score: 20 },
            { name: "A", score: 15 },
            { name: "T", score: 15 },
            { name: "I", score: 15 },
            { name: "O", score: 10 },
            { name: "N", score: 5 }
        ];
        saveHighScores();
    }
}

// Save high scores to localStorage
function saveHighScores() {
    localStorage.setItem('TamtamhighScorEs', JSON.stringify(highScores));
}

// Display high scores
function displayHighScores() {
    highScoresList.innerHTML = '';
    
    highScores.forEach((scoreData, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'high-score-item';
        scoreItem.innerHTML = `
            <span class="high-score-rank">${index + 1}.</span>
            <span class="high-score-name">${scoreData.name}</span>
            <span class="high-score-value">${scoreData.score}</span>
        `;
        highScoresList.appendChild(scoreItem);
    });
}

// Check if score qualifies for high scores
function isHighScore(score) {
    return highScores.length < 10 || score > highScores[highScores.length - 1].score;
}

// Add score to high scores
function addHighScore(name, score) {
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    if (highScores.length > 10) {
        highScores = highScores.slice(0, 10);
    }
    
    saveHighScores();
    displayHighScores();
}

// Submit high score
function submitHighScore() {
    const name = playerNameInput.value.trim();
    if (name) {
        addHighScore(name, score);
        scoreSubmission.style.display = 'none';
        okBtn.style.display = 'block';
        playerNameInput.value = '';
    } else {
        alert('Please enter a nickname!');
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        soundIcon.textContent = '🔊';
        if (gameActive) {
            bgMusic.play().catch(e => console.log("Audio play error:", e));
        }
    } else {
        soundIcon.textContent = '🔇';
        bgMusic.pause();
    }
}

// Play sound effect
function playSound(sound) {
    if (soundEnabled) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play error:", e));
    }
}

// Get a random fact
function getRandomFact() {
    const randomIndex = Math.floor(Math.random() * tamtamFacts.length);
    return tamtamFacts[randomIndex];
}

// Show fact modal
function showFactModal() {
    factText.innerHTML = getRandomFact();
    factModal.style.display = 'flex';
}

// Start the game
function startGame() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    soundControl.style.display = 'flex';
    
    timer = 30;
    score = 0;
    timerDisplay.textContent = timer;
    scoreDisplay.textContent = score;
    
    // Set initial background
    currentBackground = Math.floor(Math.random() * backgrounds.length);
    gameBoard.style.backgroundImage = `url(${backgrounds[currentBackground]})`;
    
    placeTamtam();
    gameActive = true;
    
    // Start background music
    if (soundEnabled) {
        bgMusic.play().catch(e => console.log("Audio play error:", e));
    }
    
    // Start timer
    gameInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        
        if (timer <= 0) {
            endGame();
            finalScoreDisplay.textContent = score;
            
            // Check if score qualifies for high scores
            if (isHighScore(score)) {
                scoreSubmission.style.display = 'block';
                okBtn.style.display = 'none';
            } else {
                scoreSubmission.style.display = 'none';
                okBtn.style.display = 'block';
            }
            
            timeUpModal.style.display = 'flex';
        }
    }, 1000);
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    gameActive = false;
    
    // Stop background music
    bgMusic.pause();
    soundControl.style.display = 'none';
    
    if (tamtamElement) {
        gameBoard.removeChild(tamtamElement);
        tamtamElement = null;
    }
    
    gameScreen.style.display = 'none';
    startScreen.style.display = 'block';
}

// Place the TamTam in a random position
function placeTamtam() {
    // Remove existing TamTam if any
    if (tamtamElement) {
        gameBoard.removeChild(tamtamElement);
    }
    
    // Create new TamTam
    tamtamElement = document.createElement('div');
    tamtamElement.className = 'tamtam';
    
    // Calculate random position (within game board boundaries)
    const boardRect = gameBoard.getBoundingClientRect();
    const maxX = boardRect.width - 25;
    const maxY = boardRect.height - 25;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    tamtamElement.style.left = `${randomX}px`;
    tamtamElement.style.top = `${randomY}px`;
    
    gameBoard.appendChild(tamtamElement);
}

// Handle click on game board
function handleGameBoardClick(e) {
    if (!gameActive) return;
    
    const clickX = e.offsetX;
    const clickY = e.offsetY;
    
    const tamtamRect = tamtamElement.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    
    const tamtamX = parseInt(tamtamElement.style.left);
    const tamtamY = parseInt(tamtamElement.style.top);
    
    // Check if click is within TamTam area
    if (clickX >= tamtamX && clickX <= tamtamX + 25 &&
        clickY >= tamtamY && clickY <= tamtamY + 25) {
        // Correct click
        score += 5;
        timer += 5;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timer;
        
        // Play correct sound
        playSound(correctSound);
        
        // Show correct message
        correctMsg.style.display = 'block';
        setTimeout(() => {
            correctMsg.style.display = 'none';
        }, 2000);
        
        // Show time change indicator
        showTimeChange('+5s', true, clickX, clickY);
        
        // Show fact modal
        showFactModal();
        
        // Change background image
        let newBackground;
        do {
            newBackground = Math.floor(Math.random() * backgrounds.length);
        } while (newBackground === currentBackground);
        
        currentBackground = newBackground;
        gameBoard.style.backgroundImage = `url(${backgrounds[currentBackground]})`;
        
        // Place new TamTam in new position
        placeTamtam();
    } else {
        // Wrong click
        timer -= 2;
        if (timer < 0) timer = 0;
        timerDisplay.textContent = timer;
        
        // Play wrong sound
        playSound(wrongSound);
        
        // Show wrong message
        wrongMsg.style.display = 'block';
        setTimeout(() => {
            wrongMsg.style.display = 'none';
        }, 2000);
        
        // Show time change indicator
        showTimeChange('-2s', false, clickX, clickY);
        
        if (timer <= 0) {
            endGame();
            finalScoreDisplay.textContent = score;
            
            // Check if score qualifies for high scores
            if (isHighScore(score)) {
                scoreSubmission.style.display = 'block';
                okBtn.style.display = 'none';
            } else {
                scoreSubmission.style.display = 'none';
                okBtn.style.display = 'block';
            }
            
            timeUpModal.style.display = 'flex';
        }
    }
}

// Show time change indicator
function showTimeChange(text, positive, x, y) {
    const indicator = document.createElement('div');
    indicator.className = `time-change`;
    indicator.textContent = text;
    indicator.style.color = positive ? '#006400' : '#8B0000';
    indicator.style.left = `${x}px`;
    indicator.style.top = `${y}px`;
    
    gameBoard.appendChild(indicator);
    
    // Remove after animation completes
    setTimeout(() => {
        if (indicator.parentNode) {
            gameBoard.removeChild(indicator);
        }
    }, 1000);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', init);
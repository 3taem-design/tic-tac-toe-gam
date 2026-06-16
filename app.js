const API_URL = 'https://ax-tools-backend.onrender.com';
let currentEmail = "";
let gameMode = ""; 
let aiDifficulty = ""; 

document.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("user_email");
    const isVerified = localStorage.getItem("is_verified");

    if (savedEmail && isVerified === "true") {
        currentEmail = savedEmail;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('mode-screen').classList.remove('hidden');
    }
});

async function handleSocialLogin(provider) {
    currentEmail = prompt(`أدخل إيميل تجريبي لمحاكاة تسجيل دخول ${provider}:`);
    if (!currentEmail || !currentEmail.includes('@')) {
        alert("يرجى إدخال بريد إلكتروني صحيح");
        return;
    }

    const response = await fetch(`${API_URL}/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, provider: provider })
    });
    
    if (response.ok) {
        localStorage.setItem("user_email", currentEmail);
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('otp-screen').classList.remove('hidden');
    }
}

async function verifyOTP() {
    const otp = document.getElementById('otp-input').value;
    const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, code: otp })
    });

    const data = await response.json();
    if (response.ok && data.success) {
        localStorage.setItem("is_verified", "true");
        document.getElementById('otp-screen').classList.add('hidden');
        document.getElementById('mode-screen').classList.remove('hidden');
    } else {
        alert("الرمز خاطئ، حاول مجدداً");
    }
}

function selectMode(mode) {
    gameMode = mode;
    document.getElementById('mode-screen').classList.add('hidden');
    if (mode === 'ai') {
        document.getElementById('difficulty-screen').classList.remove('hidden');
    } else {
        startGame();
    }
}

function selectDifficulty(diff) {
    aiDifficulty = diff;
    document.getElementById('difficulty-screen').classList.add('hidden');
    startGame();
}

function startGame() {
    document.getElementById('game-screen').classList.remove('hidden');
    resetGame();
}

// تعديل دالة تغيير النمط لتصفير العدادات فوراً
function backToModes() {
    scores = { X: 0, O: 0 }; // تصفير النقاط برمجياً
    document.getElementById('score-x').textContent = "0"; // تحديث الواجهة لـ X
    document.getElementById('score-o').textContent = "0"; // تحديث الواجهة لـ O
    
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('mode-screen').classList.remove('hidden');
}

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; 
let isGameActive = true;
let scores = { X: 0, O: 0 };

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => cell.replaceWith(cell.cloneNode(true))); 
const newCells = document.querySelectorAll('.cell');
newCells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== "" || !isGameActive) return;

    makeMove(index, currentPlayer);

    if (isGameActive && gameMode === 'ai' && currentPlayer === "O") {
        isGameActive = false; 
        setTimeout(() => {
            isGameActive = true;
            aiMove();
        }, 400);
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player);

    if (checkWin(board, player)) {
        document.getElementById('status').textContent = gameMode === 'ai' ? (player === "X" ? "لقد فزت! 🎉" : "الكمبيوتر فاز! 🤖") : `الفائز هو ${player}! 🎉`;
        scores[player]++;
        document.getElementById(`score-${player.toLowerCase()}`).textContent = scores[player];
        isGameActive = false;
        return;
    }

    if (!board.includes("")) {
        document.getElementById('status').textContent = "تعادل! 🤝";
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    
    if (gameMode === 'ai') {
        document.getElementById('status').textContent = currentPlayer === "O" ? "دور الكمبيوتر..." : "دورك (X)";
    } else {
        document.getElementById('status').textContent = `دور اللاعب ${currentPlayer}`;
    }
}

function aiMove() {
    let bestMove;
    if (aiDifficulty === 'easy') {
        let emptyCells = [];
        board.forEach((val, idx) => { if (val === "") emptyCells.push(idx); });
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (aiDifficulty === 'medium') {
        if (Math.random() < 0.6) {
            bestMove = minimax(board, "O").index;
        } else {
            let emptyCells = [];
            board.forEach((val, idx) => { if (val === "") emptyCells.push(idx); });
            bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    } else {
        bestMove = minimax(board, "O").index;
    }
    makeMove(bestMove, "O");
}

function minimax(newBoard, player) {
    let availSpots = [];
    newBoard.forEach((val, idx) => { if (val === "") availSpots.push(idx); });

    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function checkWin(currentBoard, player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winConditions.some(condition => {
        return condition.every(index => currentBoard[index] === player);
    });
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    document.getElementById('status').textContent = "دور اللاعب X";
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = "cell";
    });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

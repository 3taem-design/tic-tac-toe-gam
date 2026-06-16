let board = ["", "", "", "", "", "", "", "", ""];
let turn = "X";
let gameActive = true;

window.addEventListener('online', () => document.getElementById('status-badge').innerText = "متصل");
window.addEventListener('offline', () => document.getElementById('status-badge').innerText = "غير متصل");

function switchScreen(s) {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.add('hidden'));
    document.getElementById(s + '-screen').classList.remove('hidden');
    document.getElementById('page-title').innerText = s === 'tools' ? 'AX Tools' : s.toUpperCase();
}

function makeMove(i) {
    if (board[i] === "" && gameActive) {
        board[i] = turn;
        document.getElementById(`c${i}`).innerText = turn;
        checkWinner();
        turn = turn === "X" ? "O" : "X";
        if(gameActive) document.getElementById("status-text").innerText = "دور: " + turn;
    }
}

function checkWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let combo of wins) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById("status-text").innerText = "فاز اللاعب: " + board[a];
            gameActive = false; return;
        }
    }
    if (!board.includes("")) { document.getElementById("status-text").innerText = "تعادل!"; gameActive = false; }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    turn = "X"; gameActive = true;
    document.getElementById("status-text").innerText = "دور: X";
    document.querySelectorAll('.cell').forEach(c => c.innerText = "");
}

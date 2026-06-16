let board = ["", "", "", "", "", "", "", "", ""];
let turn = "X";

window.addEventListener('online', () => document.getElementById('status-badge').innerText = "متصل");
window.addEventListener('offline', () => document.getElementById('status-badge').innerText = "غير متصل");

function switchScreen(s) {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.add('hidden'));
    document.getElementById(s + '-screen').classList.remove('hidden');
    document.getElementById('page-title').innerText = s.toUpperCase();
}

function makeMove(i) {
    if (board[i] === "") {
        board[i] = turn;
        document.querySelectorAll('.cell')[i].innerText = turn;
        turn = turn === "X" ? "O" : "X";
    }
}

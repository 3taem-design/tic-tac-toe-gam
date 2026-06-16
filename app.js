let board = Array(9).fill(""), turn = "X", gameActive = false;

function switchScreen(s) {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.add('hidden'));
    document.getElementById(s + '-screen').classList.remove('hidden');
}

function handleLogin() { document.getElementById("otp-container").classList.remove("hidden"); }
function handleVerify() { alert("تم التحقق بنجاح!"); switchScreen('tools'); }

function startGame() {
    document.getElementById("menu-area").classList.add("hidden");
    document.getElementById("game-area").classList.remove("hidden");
    gameActive = true;
}

function makeMove(i) {
    if (board[i] === "" && gameActive) {
        board[i] = turn;
        document.getElementById(`c${i}`).innerText = turn;
        document.getElementById(`c${i}`).className = `cell ${turn.toLowerCase()}`;
        if (checkWinner()) return;
        turn = (turn === "X") ? "O" : "X";
        document.getElementById("status-text").innerText = "دور: " + turn;
        if (document.getElementById("game-mode").value === "cpu" && turn === "O") setTimeout(cpuMove, 500);
    }
}

function checkWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let combo of wins) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            let winnerName = (board[a] === "O" && document.getElementById("game-mode").value === "cpu") ? "الكمبيوتر" : "اللاعب " + board[a];
            document.getElementById("status-text").innerText = "فاز: " + winnerName;
            gameActive = false; return true;
        }
    }
    if (!board.includes("")) { document.getElementById("status-text").innerText = "تعادل!"; gameActive = false; return true; }
    return false;
}

function resetGame() {
    board = Array(9).fill("");
    turn = "X"; gameActive = true;
    document.getElementById("status-text").innerText = "دور: X";
    document.querySelectorAll('.cell').forEach(c => { c.innerText = ""; c.className = "cell"; });
}

function cpuMove() {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = "O";
    document.getElementById(`c${move}`).innerText = "O";
    document.getElementById(`c${move}`).className = "cell o";
    checkWinner(); turn = "X";
    document.getElementById("status-text").innerText = "دور: X";
}

const gameContainer = document.getElementById('game-container');
gameContainer.innerHTML = `
    <h3 id="status">دور اللاعب X</h3>
    <div class="board" id="game-board">
        ${[...Array(9).keys()].map(i => `<div class="cell" data-index="${i}"></div>`).join('')}
    </div>
    <button class="back-btn" onclick="resetGame()">إعادة اللعب</button>
`;

let board = Array(9).fill(""), turn = "X", gameActive = true;
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        if (board[idx] === "" && gameActive) {
            board[idx] = turn;
            e.target.innerText = turn;
            e.target.classList.add(turn);
            turn = turn === "X" ? "O" : "X";
            document.getElementById('status').innerText = `دور اللاعب ${turn}`;
        }
    });
});

function resetGame() {
    board = Array(9).fill("");
    document.querySelectorAll('.cell').forEach(c => { c.innerText = ""; c.className = "cell"; });
    turn = "X"; gameActive = true;
    document.getElementById('status').innerText = "دور اللاعب X";
}

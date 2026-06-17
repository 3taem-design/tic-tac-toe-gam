let gameMode = '';
let difficulty = '';

function setMode(mode) {
    gameMode = mode;
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
}

function showLevels() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('levels-screen').classList.remove('hidden');
}

function startXO(level) {
    difficulty = level;
    gameMode = 'pc';
    document.getElementById('levels-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    // هنا ابدأ منطق اللعبة بناءً على المستوى...
}

function resetGame() { /* كود تصفير اللعبة */ }

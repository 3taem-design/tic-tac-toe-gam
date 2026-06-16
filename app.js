function loadGame(gameName) {
    document.getElementById('main-grid').classList.add('hidden');
    document.getElementById('game-wrapper').classList.remove('hidden');
    const script = document.createElement('script');
    script.src = `games/${gameName}.js`;
    script.id = 'dynamic-game-script';
    document.body.appendChild(script);
}

function backToGrid() {
    const script = document.getElementById('dynamic-game-script');
    if(script) script.remove();
    document.getElementById('main-grid').classList.remove('hidden');
    document.getElementById('game-wrapper').classList.add('hidden');
    document.getElementById('game-container').innerHTML = '';
}

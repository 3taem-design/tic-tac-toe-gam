function loadGame(gameName) {
    document.getElementById('main-grid').classList.add('hidden');
    document.getElementById('game-wrapper').classList.remove('hidden');
    
    // حقن ملف اللعبة ديناميكياً
    const script = document.createElement('script');
    script.src = `games/${gameName}.js`;
    document.body.appendChild(script);
}

function backToGrid() {
    document.getElementById('main-grid').classList.remove('hidden');
    document.getElementById('game-wrapper').classList.add('hidden');
    document.getElementById('game-container').innerHTML = ''; // تنظيف الحاوية
}

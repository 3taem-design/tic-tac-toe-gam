alert("ابدا المرح الان");
window.addEventListener("load", function() {

    // --- إعدادات اللعبة ---
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const introductionElement = document.getElementById("introduction");
    const perfectElement = document.getElementById("perfect");
    const restartButton = document.getElementById("restart");
    const scoreElement = document.getElementById("score");

    // تثبيت أبعاد الكانفاس لتطابق الـ CSS (375x375)
    canvas.width = 375;
    canvas.height = 375;

    // --- بيانات اللعبة الأساسية ---
    let phase = "waiting"; 
    let lastTimestamp;
    let heroX, heroY, sceneOffset;
    let platforms = [], sticks = [], trees = [];
    let score = 0;

    const platformHeight = 100, heroDistanceFromEdge = 10, paddingX = 100, perfectAreaSize = 10;
    const backgroundSpeedMultiplier = 0.2, hill1BaseHeight = 100, hill1Amplitude = 10, hill1Stretch = 1;
    const hill2BaseHeight = 70, hill2Amplitude = 20, hill2Stretch = 0.5;
    const stretchingSpeed = 4, turningSpeed = 4, walkingSpeed = 4, transitioningSpeed = 2, fallingSpeed = 2;
    const heroWidth = 17, heroHeight = 30;

    Array.prototype.last = function () { return this[this.length - 1]; };
    Math.sinus = function (degree) { return Math.sin((degree / 180) * Math.PI); };

    // --- الدوال الأساسية ---
    function resetGame() {
        phase = "waiting"; lastTimestamp = undefined; sceneOffset = 0; score = 0;
        introductionElement.style.opacity = 1;
        perfectElement.style.opacity = 0;
        restartButton.style.display = "none";
        scoreElement.innerText = score;
        platforms = [{ x: 50, w: 50 }];
        generatePlatform(); generatePlatform(); generatePlatform(); generatePlatform();
        sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
        trees = []; for(let i=0; i<10; i++) generateTree();
        heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge; heroY = 0;
        draw();
    }

    function generateTree() {
        const x = (trees.length ? trees.last().x : 0) + 30 + Math.floor(Math.random() * 120);
        trees.push({ x, color: ["#6D8821", "#8FAC34", "#98B333"][Math.floor(Math.random() * 3)] });
    }

    function generatePlatform() {
        const x = platforms.last().x + platforms.last().w + 40 + Math.floor(Math.random() * 160);
        const w = 20 + Math.floor(Math.random() * 80);
        platforms.push({ x, w });
    }

    // --- التحكم (اللمس والماوس) ---
    function handleStart() {
        if (phase == "waiting") {
            lastTimestamp = undefined;
            introductionElement.style.opacity = 0;
            phase = "stretching";
            window.requestAnimationFrame(animate);
        }
    }
    function handleEnd() { if (phase == "stretching") phase = "turning"; }

    window.addEventListener("mousedown", handleStart);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchstart", (e) => { e.preventDefault(); handleStart(); }, {passive: false});
    window.addEventListener("touchend", (e) => { e.preventDefault(); handleEnd(); }, {passive: false});

    // --- حلقة اللعبة (Animation) ---
    function animate(timestamp) {
        if (!lastTimestamp) { lastTimestamp = timestamp; window.requestAnimationFrame(animate); return; }
        const delta = timestamp - lastTimestamp;
        
        switch (phase) {
            case "stretching": sticks.last().length += delta / stretchingSpeed; break;
            case "turning": 
                sticks.last().rotation += delta / turningSpeed;
                if (sticks.last().rotation > 90) {
                    sticks.last().rotation = 90;
                    const [nextPlatform] = thePlatformTheStickHits();
                    if (nextPlatform) { score++; scoreElement.innerText = score; generatePlatform(); generateTree(); }
                    phase = "walking";
                }
                break;
            case "walking":
                heroX += delta / walkingSpeed;
                const [nextP] = thePlatformTheStickHits();
                if (nextP && heroX > nextP.x + nextP.w - heroDistanceFromEdge) { heroX = nextP.x + nextP.w - heroDistanceFromEdge; phase = "transitioning"; }
                else if (!nextP && heroX > sticks.last().x + sticks.last().length + heroWidth) phase = "falling";
                break;
            case "transitioning":
                sceneOffset += delta / transitioningSpeed;
                if (sceneOffset > platforms[1].x + platforms[1].w - paddingX) {
                    sticks.push({ x: platforms[1].x + platforms[1].w, length: 0, rotation: 0 });
                    phase = "waiting";
                }
                break;
            case "falling":
                heroY += delta / fallingSpeed;
                if (heroY > 300) restartButton.style.display = "block";
                break;
        }
        draw();
        lastTimestamp = timestamp;
        if (phase !== "waiting" && phase !== "falling") window.requestAnimationFrame(animate);
    }

    function thePlatformTheStickHits() {
        const stickFarX = sticks.last().x + sticks.last().length;
        return [platforms.find(p => p.x < stickFarX && stickFarX < p.x + p.w), false];
    }

    // --- الرسم ---
    function draw() {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2 - sceneOffset, canvas.height / 2);
        
        // رسم العناصر (تبسيط للرسم الأصلي)
        platforms.forEach(p => { ctx.fillStyle = "black"; ctx.fillRect(p.x, 80, p.w, 300); });
        ctx.fillStyle = "red"; ctx.fillRect(heroX - 8, 50, 16, 30);
        sticks.forEach(s => { ctx.beginPath(); ctx.moveTo(s.x, 80); ctx.lineTo(s.x, 80 - s.length); ctx.stroke(); });

        ctx.restore();
    }

    restartButton.addEventListener("click", resetGame);
    resetGame();
});

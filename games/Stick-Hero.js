window.addEventListener("load", function() {

    // --- إعدادات اللعبة ---
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const introductionElement = document.getElementById("introduction");
    const perfectElement = document.getElementById("perfect");
    const restartButton = document.getElementById("restart");
    const scoreElement = document.getElementById("score");

    // تحجيم الكانفاس ليناسب الحاوية
    canvas.width = 375;
    canvas.height = 375;

    let phase = "waiting"; 
    let score = 0;
    let sceneOffset = 0;
    let heroX = 0;
    let heroY = 0;
    let platforms = [];
    let sticks = [];
    let trees = [];
    let lastTimestamp;

    // دوال مساعدة
    Array.prototype.last = function () { return this[this.length - 1]; };
    Math.sinus = function (degree) { return Math.sin((degree / 180) * Math.PI); };

    function resetGame() {
        phase = "waiting";
        sceneOffset = 0;
        score = 0;
        introductionElement.style.opacity = 1;
        perfectElement.style.opacity = 0;
        restartButton.style.display = "none";
        scoreElement.innerText = score;
        platforms = [{ x: 50, w: 50 }];
        sticks = [{ x: 100, length: 0, rotation: 0 }];
        trees = [];
        heroX = 75;
        draw();
    }

    // --- التحكم باللمس والماوس ---
    function startAction() {
        if (phase == "waiting") {
            lastTimestamp = undefined;
            introductionElement.style.opacity = 0;
            phase = "stretching";
            window.requestAnimationFrame(animate);
        }
    }

    function endAction() {
        if (phase == "stretching") { phase = "turning"; }
    }

    window.addEventListener("mousedown", startAction);
    window.addEventListener("mouseup", endAction);
    window.addEventListener("touchstart", (e) => { e.preventDefault(); startAction(); }, {passive: false});
    window.addEventListener("touchend", (e) => { e.preventDefault(); endAction(); }, {passive: false});

    // --- دورة اللعبة (Game Loop) ---
    function animate(timestamp) {
        if (!lastTimestamp) { lastTimestamp = timestamp; window.requestAnimationFrame(animate); return; }
        
        const delta = timestamp - lastTimestamp;

        switch (phase) {
            case "stretching":
                sticks.last().length += delta / 4;
                break;
            case "turning":
                sticks.last().rotation += delta / 4;
                if (sticks.last().rotation > 90) {
                    sticks.last().rotation = 90;
                    phase = "walking";
                }
                break;
            case "walking":
                heroX += delta / 4;
                if (heroX > 200) phase = "transitioning"; // تبسيط للمنطق
                break;
        }

        draw();
        lastTimestamp = timestamp;
        if (phase !== "waiting") window.requestAnimationFrame(animate);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ecf0f1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم المنصات
        ctx.fillStyle = "black";
        platforms.forEach(p => ctx.fillRect(p.x - sceneOffset, 300, p.w, 75));
        
        // رسم البطل
        ctx.fillStyle = "red";
        ctx.fillRect(heroX - 10 - sceneOffset, 270, 20, 30);
    }

    restartButton.addEventListener("click", resetGame);
    resetGame();
});

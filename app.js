function startVerification() {
    const status = document.getElementById("status-msg");
    document.getElementById("send-btn").disabled = true;
    status.innerText = "جاري الإرسال...";
    
    setTimeout(() => {
        status.innerText = "تم الإرسال إلى بريدك!";
        document.getElementById("otp-container").classList.remove("hidden");
    }, 1500);
}

function handleVerify() {
    const otp = document.getElementById("otp-input").value;
    if (otp === "123456") {
        localStorage.setItem("isVerified", "true");
        document.getElementById("auth-screen").classList.add("hidden");
        document.getElementById("main-app").classList.remove("hidden");
    } else {
        document.getElementById("status-msg").innerText = "رمز خاطئ!";
    }
}

// تحميل الألعاب
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

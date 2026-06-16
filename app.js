const API_URL = "https://ax-tools-backend.onrender.com"; // تأكد من مطابقة هذا الرابط لرابط سيرفرك

function startVerification() {
    const email = document.getElementById("email-input").value;
    const status = document.getElementById("status-msg");
    
    if (!email) { status.innerText = "أدخل البريد أولاً!"; return; }

    document.getElementById("send-btn").disabled = true;
    status.innerText = "جاري الإرسال...";
    
    fetch(`${API_URL}/auth/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, provider: "email" })
    })
    .then(res => res.json())
    .then(data => {
        status.innerText = "تم إرسال الرمز!";
        document.getElementById("otp-container").classList.remove("hidden");
    })
    .catch(err => {
        status.innerText = "خطأ في الاتصال!";
        document.getElementById("send-btn").disabled = false;
    });
}

function handleVerify() {
    const email = document.getElementById("email-input").value;
    const code = document.getElementById("otp-input").value;
    
    fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, code: code })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("isVerified", "true");
            document.getElementById("auth-screen").classList.add("hidden");
            document.getElementById("main-app").classList.remove("hidden");
        } else {
            document.getElementById("status-msg").innerText = "الرمز خاطئ!";
        }
    });
}

// مدير الألعاب
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

// التحقق عند فتح الصفحة
window.onload = () => {
    if (localStorage.getItem("isVerified") === "true") {
        document.getElementById("auth-screen").classList.add("hidden");
        document.getElementById("main-app").classList.remove("hidden");
    }
};

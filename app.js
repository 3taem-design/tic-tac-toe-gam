window.onload = () => {
    if (localStorage.getItem("isVerified") === "true") {
        document.getElementById("auth-screen").classList.add("hidden");
        document.getElementById("main-app").classList.remove("hidden");
    }
};

function startVerification() {
    const email = document.getElementById("email-input").value;
    fetch("https://ax-tools-backend.onrender.com/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    }).then(() => {
        document.getElementById("status-msg").innerText = "تم إرسال الرمز!";
        document.getElementById("otp-container").classList.remove("hidden");
    });
}

function handleVerify() {
    const email = document.getElementById("email-input").value;
    const code = document.getElementById("otp-input").value;
    fetch("https://ax-tools-backend.onrender.com/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            localStorage.setItem("isVerified", "true");
            location.reload();
        } else { alert("رمز خاطئ!"); }
    });
}

function logout() { localStorage.clear(); location.reload(); }

// رسالة تأكيد الخروج
function confirmLogout() {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        logout();
    }
}

// دالة التحديث الفخمة
function checkUpdate() {
    const popup = document.createElement('div');
    popup.className = 'update-popup';
    popup.innerHTML = `
        <p>هل تريد البحث عن تحديثات؟</p>
        <button id="upd-btn" onclick="runUpdate()">تحديث</button>
        <button onclick="this.parentElement.remove()">إلغاء</button>
        <div class="progress-bar"><div id="progress" class="progress-fill"></div></div>
    `;
    document.body.appendChild(popup);
}

function runUpdate() {
    const btn = document.getElementById('upd-btn');
    const progress = document.getElementById('progress');
    
    btn.disabled = true;
    btn.innerText = "جاري التحديث...";
    progress.style.width = '100%';
    
    // الانتظار لمدة 5 ثواني كما طلبت لجمالية العرض
    setTimeout(() => {
        // هذا هو السطر "الحقيقي" الذي يجبر المتصفح على جلب أحدث ملفات من GitHub
        // وإعادة تحميل التطبيق بدون حذف الاختصار
        window.location.reload(true); 
    }, 5000);
}

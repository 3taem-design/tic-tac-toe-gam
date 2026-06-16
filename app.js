const API_URL = 'https://ax-tools-backend.onrender.com';
let currentEmail = "";

document.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("user_email");
    const isVerified = localStorage.getItem("is_verified");

    if (savedEmail && isVerified === "true") {
        currentEmail = savedEmail;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('files-screen').classList.remove('hidden');
        document.getElementById('main-nav').classList.remove('hidden');
    }
});

// دالة طلب الـ OTP
async function handleLogin() {
    const emailInput = document.getElementById("email-input").value;
    if (!emailInput || !emailInput.includes("@")) {
        alert("الرجاء إدخال بريد إلكتروني صحيح");
        return;
    }

    currentEmail = emailInput;
    try {
        const response = await fetch(`${API_URL}/auth/social`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentEmail, provider: "Google" })
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById("otp-container").classList.remove("hidden");
            document.getElementById("login-btn").classList.add("hidden");
            alert("تم إرسال الرمز! تحقق من سجلات ريندر (Logs)");
        }
    } catch (error) {
        alert("فشل الاتصال بالسيرفر");
    }
}

// دالة التحقق من الـ OTP
async function handleVerify() {
    const otpCode = document.getElementById("otp-input").value;
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentEmail, code: otpCode })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem("user_email", currentEmail);
            localStorage.setItem("is_verified", "true");
            
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('files-screen').classList.remove('hidden');
            document.getElementById('main-nav').classList.remove('hidden');
        }
    } catch (error) {
        alert("الرمز خاطئ، حاول مجدداً");
    }
}

// دالة التنقل السحرية بين الشاشات مع ثبات شريط الأدوات بالأسفل
function switchScreen(screenName) {
    const screens = ['auth-screen', 'files-screen', 'youtube-screen', 'emails-screen', 'games-screen'];
    screens.forEach(screen => {
        const el = document.getElementById(screen);
        if(el) el.classList.add('hidden');
    });

    const buttons = ['btn-files', 'btn-youtube', 'btn-emails', 'btn-games'];
    buttons.forEach(btn => {
        const el = document.getElementById(btn);
        if(el) el.classList.remove('active');
    });

    document.getElementById(`${screenName}-screen`).classList.remove('hidden');
    document.getElementById(`btn-${screenName}`).classList.add('active');
}

// دالة التحقق الذكي وشريط التقدم وتنزيل المقاطع
async function startDownload() {
    const urlInput = document.getElementById("download-url").value;
    if (!urlInput) return alert("الرجاء وضع رابط مقطع أولاً");

    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const progressStatus = document.getElementById("progress-status");

    progressContainer.classList.remove("hidden");
    progressBar.style.width = "100%";
    progressStatus.innerText = "جاري الاتصال بالسيرفر واقتناص المقطع...";

    try {
        const response = await fetch(`${API_URL}/download`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: urlInput, type: "audio" }) // يحمل صوت MP3
        });

        if (!response.ok) throw new Error();

        progressStatus.innerText = "جاري معالجة الملف وتنزيله في التطبيق...";
        progressBar.style.width = "70%";

        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);
        
        progressBar.style.width = "100%";
        progressStatus.innerText = "تم التحميل بنجاح!";

        // إضافة الملف مباشرة للقائمة تحت
        addFileToList("مقطع صوتي محمل.mp3", fileUrl);

        setTimeout(() => { progressContainer.classList.add("hidden"); }, 2000);

    } catch (error) {
        alert("حدث خطأ أثناء التحميل، تأكد من صحة الرابط أو جرب لاحقاً.");
        progressContainer.classList.add("hidden");
    }
}

function addFileToList(name, url) {
    const filesList = document.getElementById("files-list");
    
    // إخفاء الحالة الفارغة إذا وجدت
    const emptyState = filesList.querySelector(".empty-state");
    if (emptyState) emptyState.remove();

    const fileRow = document.createElement("div");
    fileRow.style = "background: #1c1c1e; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #2c2c2e;";
    
    fileRow.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; width: 50%;">
            <i class="fas fa-music" style="color: #007aff; font-size: 18px;"></i>
            <span style="font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${name}</span>
        </div>
        <audio src="${url}" controls style="height: 32px; max-width: 50%;"></audio>
    `;
    
    filesList.appendChild(fileRow);
}

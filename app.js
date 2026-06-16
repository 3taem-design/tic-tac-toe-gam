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

// دالة تسجيل الدخول وطلب OTP
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

// دالة التحقق من الرمز ودخول التطبيق
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
            
            // تحويل المستخدم لواجهة التطبيق الرئيسية
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('files-screen').classList.remove('hidden');
            document.getElementById('main-nav').classList.remove('hidden');
        }
    } catch (error) {
        alert("الرمز خاطئ، حاول مجدداً");
    }
}

// دالة التنقل السحرية بين الشاشات مع الحفاظ على الشريط ثابت
function switchScreen(screenName) {
    // إخفاء كافة الشاشات
    const screens = ['auth-screen', 'files-screen', 'youtube-screen', 'emails-screen', 'games-screen'];
    screens.forEach(screen => {
        const el = document.getElementById(screen);
        if(el) el.classList.add('hidden');
    });

    // إزالة الصفة النشطة (Active) من أزرار القائمة السفلية
    const buttons = ['btn-files', 'btn-youtube', 'btn-emails', 'btn-games'];
    buttons.forEach(btn => {
        const el = document.getElementById(btn);
        if(el) el.classList.remove('active');
    });

    // إظهار الشاشة المطلوبة وتفعيل زرها
    document.getElementById(`${screenName}-screen`).classList.remove('hidden');
    document.getElementById(`btn-${screenName}`).classList.add('active');
}

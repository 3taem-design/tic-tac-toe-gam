const API_URL = 'https://ax-tools-backend.onrender.com';
let currentEmail = "";

document.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("user_email");
    const isVerified = localStorage.getItem("is_verified");

    if (savedEmail && isVerified === "true") {
        currentEmail = savedEmail;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
    }
});

// 1. دالة إرسال الـ OTP المحسنة (بدون رسائل منبثقة)
async function handleLogin() {
    const emailInput = document.getElementById("user-email").value.trim();
    const btnLogin = document.getElementById("btn-login");

    if (!emailInput || !emailInput.includes("@")) {
        alert("الرجاء إدخال بريد إلكتروني صحيح");
        return;
    }

    currentEmail = emailInput;
    btnLogin.disabled = true;
    btnLogin.innerText = "جاري الإرسال...";

    try {
        const response = await fetch(`${API_URL}/auth/social`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentEmail, provider: "Email" })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // هنا تم الاستغناء عن الـ alert وتحديث حالة الزر مباشرة وظهور الحقل بالأسفل
            btnLogin.innerText = "تم إرسال الرمز ✅";
            document.getElementById("otp-area").classList.remove("hidden");
        } else {
            alert(data.detail || "حدث خطأ أثناء إرسال الرمز");
            btnLogin.disabled = false;
            btnLogin.innerText = "إرسال الرمز 🚀";
        }
    } catch (error) {
        console.error(error);
        alert("فشل الاتصال بالسيرفر، تأكد أن السيرفر يعمل");
        btnLogin.disabled = false;
        btnLogin.innerText = "إرسال الرمز 🚀";
    }
}

// 2. دالة التحقق من الرمز المدخل
async function handleVerify() {
    const codeInput = document.getElementById("otp-code").value.trim();
    const btnVerify = document.getElementById("btn-verify");

    if (!codeInput) {
        alert("الرجاء إدخال الرمز");
        return;
    }

    btnVerify.disabled = true;
    btnVerify.innerText = "جاري التحقق...";

    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentEmail, code: codeInput })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            localStorage.setItem("user_email", currentEmail);
            localStorage.setItem("is_verified", "true");
            
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('main-screen').classList.remove('hidden');
        } else {
            alert(data.detail || "الرمز غير صحيح");
            btnVerify.disabled = false;
            btnVerify.innerText = "تحقق ودخول";
        }
    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء الاتصال بالسيرفر");
        btnVerify.disabled = false;
        btnVerify.innerText = "تحقق ودخول";
    }
}

// 3. دالة التنقل الذكي والآمن بين التبويبات (الشريط السفلي)
function switchTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    document.getElementById(`section-${tabName}`).classList.remove('hidden');
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function openXO() {
    alert("جاهز لتشغيل لعبة الـ XO! في الخطوة القادمة سنعيد دمج كود مربعات اللعبة القديم هنا لتلعب مباشرة.");
}

function copyEmail() {
    alert("سيتم تفعيل خاصية النسخ التلقائي فور ربط سيرفر الإيميلات المؤقتة.");
}

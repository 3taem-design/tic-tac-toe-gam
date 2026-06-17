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

// المتغير الحالي للتطبيق
const CURRENT_VERSION = "v.1.2.4"; 

async function checkUpdate() {
    try {
        // نستخدم توقيت (?t=...) لمنع المتصفح من تخزين نتيجة الفحص
        const response = await fetch('version.json?t=' + new Date().getTime());
        const data = await response.json();

        if (data.version === CURRENT_VERSION) {
            // رسالة عندما يكون التطبيق محدثاً
            alert("تطبيقك محدث! أنت تستخدم آخر إصدار (" + CURRENT_VERSION + ")");
        } else {
            // إظهار النافذة الاحترافية إذا كان هناك تحديث
            showUpdatePopup(data.version);
        }
    } catch (e) {
        alert("لا يمكن الاتصال بخادم التحديثات حالياً.");
    }
}

function showUpdatePopup(newVersion) {
    const popup = document.createElement('div');
    popup.className = 'update-popup';
    
    // هنا يمكنك إضافة 5 نقاط بكل سهولة
    const changes = [
        "إضافة نظام أمان متطور لتشفير البيانات.",
        "تحسين سرعة استجابة الكروت بنسبة 40%.",
        "إضافة أيقونات جديدة عالية الجودة للألعاب.",
        "تعديل واجهة المستخدم لتناسب وضع الشاشة الكاملة.",
        "إصلاح مشكلة الذاكرة المؤقتة لضمان تحديث فوري."
    ];

    popup.innerHTML = `
        <h3 style="margin-bottom: 5px;">تحديث جديد متاح (${newVersion})</h3>
        <p style="font-size: 13px; color: #888; margin-bottom: 15px;">ما الجديد في هذا الإصدار؟</p>
        <ul style="text-align: right; font-size: 14px; padding-right: 20px; margin-bottom: 20px; line-height: 1.6;">
            ${changes.map(change => `<li>${change}</li>`).join('')}
        </ul>
        <div class="progress-bar"><div id="progress" class="progress-fill"></div></div>
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
            <button id="upd-btn" onclick="runUpdate()" style="background:#38bdf8; border:none; padding:12px; border-radius:10px; cursor:pointer; font-weight:bold;">تحديث الآن</button>
            <button onclick="this.parentElement.parentElement.remove()" style="background:transparent; border:1px solid #30363d; padding:12px; border-radius:10px; cursor:pointer; color:#ff4d4d;">إلغاء</button>
        </div>
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

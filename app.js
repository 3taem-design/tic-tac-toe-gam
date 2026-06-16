// استبدل الرابط أدناه برابط سيرفرك الحقيقي على Render
const API_URL = "https://ax-tools-backend.onrender.com"; 

function startVerification() {
    const email = document.getElementById("email-input").value;
    const status = document.getElementById("status-msg");
    
    document.getElementById("send-btn").disabled = true;
    status.innerText = "جاري الإرسال...";
    
    // إرسال طلب للباك أند
    fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    })
    .then(res => res.json())
    .then(data => {
        status.innerText = "تم إرسال الرمز!";
        document.getElementById("otp-container").classList.remove("hidden");
    })
    .catch(err => {
        status.innerText = "خطأ في الاتصال بالسيرفر!";
        document.getElementById("send-btn").disabled = false;
    });
}

function handleVerify() {
    const email = document.getElementById("email-input").value;
    const otp = document.getElementById("otp-input").value;
    
    fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("isVerified", "true");
            document.getElementById("auth-screen").classList.add("hidden");
            document.getElementById("main-app").classList.remove("hidden");
        } else {
            document.getElementById("status-msg").innerText = "رمز خاطئ!";
        }
    });
}

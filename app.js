const API_URL = "https://ax-tools-backend.onrender.com";

// التحقق من حالة الدخول عند تحميل الصفحة
window.onload = () => {
    const isVerified = localStorage.getItem("isVerified");
    const userEmail = localStorage.getItem("userEmail");
    
    if (isVerified === "true") {
        showApp(userEmail);
    }
};

function showApp(email) {
    document.getElementById("user-email-display").innerText = email;
    document.getElementById("auth-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
}

function handleVerify() {
    const email = document.getElementById("email-input").value;
    const code = document.getElementById("otp-input").value;
    
    fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("isVerified", "true");
            localStorage.setItem("userEmail", email);
            showApp(email);
        } else {
            alert("رمز خاطئ!");
        }
    });
}

function logout() {
    localStorage.clear();
    location.reload(); // إعادة تحميل الصفحة للرجوع لشاشة الدخول
}

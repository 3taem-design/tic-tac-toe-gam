function startVerification() {
    const email = document.getElementById("email-input").value;
    const status = document.getElementById("status-msg");
    if (!email) return alert("أدخل الإيميل");
    
    status.innerText = "جاري الإرسال...";
    // سأضع لك الرابط هنا مباشرة، تأكد من تعديله لرابط سيرفرك لاحقاً
    fetch("https://ax-tools-backend.onrender.com/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    }).then(() => {
        status.innerText = "تم إرسال الرمز!";
        document.getElementById("otp-container").classList.remove("hidden");
    });
}

function handleVerify() {
    const email = document.getElementById("email-input").value;
    const code = document.getElementById("otp-input").value;
    
    fetch("https://ax-tools-backend.onrender.com/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, code: code })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            alert("تم الدخول بنجاح!");
        } else {
            alert("رمز خاطئ");
        }
    });
}

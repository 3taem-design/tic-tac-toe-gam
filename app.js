const API_URL = "https://ax-tools-backend.onrender.com";

window.onload = () => {
    if (localStorage.getItem("isVerified") === "true") {
        showApp(localStorage.getItem("userEmail"));
    }
};

function showApp(email) {
    document.getElementById("user-email-display").innerText = email;
    document.getElementById("auth-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
}

function startVerification() {
    const email = document.getElementById("email-input").value;
    fetch(`${API_URL}/auth/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    }).then(() => {
        document.getElementById("otp-container").classList.remove("hidden");
    });
}

function handleVerify() {
    const email = document.getElementById("email-input").value;
    const code = document.getElementById("otp-input").value;
    fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, code: code })
    }).then(res => res.json()).then(data => {
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
    location.reload();
}

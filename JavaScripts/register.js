document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("msg");

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  msg.textContent = "Registering...";

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      msg.textContent = "Registered! Redirecting to login...";
      setTimeout(() => { window.location.href = "/login.html"; }, 1000);
    } else {
      msg.textContent = data.error || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "Network error";
  }
});

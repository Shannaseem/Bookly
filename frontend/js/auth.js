// Wait for the HTML to be fully ready before running this script
document.addEventListener("DOMContentLoaded", () => {
  // (Use the global API_URL from app.js, do not redeclare it)

  // ===========================
  // 1. SIGNUP LOGIC
  // ===========================
  const signupFormAuth = document.getElementById("signupForm"); // Renamed variable to avoid conflict

  if (signupFormAuth) {
    signupFormAuth.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get values
      const email = document.getElementById("signupEmail").value;
      const role = document.getElementById("signupRole").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Debug Alert
      alert("Processing Signup for: " + email);

      if (password !== confirmPassword) {
        alert("Error: Passwords do not match!");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            role: role,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("SUCCESS: Account created! Switching to Login.");
          // Click the "Login" switch link to hide the signup form
          document.getElementById("switchToLogin").click();
        } else {
          alert("ERROR from Server: " + data.detail);
        }
      } catch (error) {
        alert("CONNECTION ERROR: " + error.message);
      }
    });
  }

  // ===========================
  // 2. LOGIN LOGIC
  // ===========================
  const loginFormAuth = document.getElementById("loginForm"); // Renamed variable to avoid conflict

  if (loginFormAuth) {
    loginFormAuth.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      // Debug Alert
      alert("Processing Login for: " + email);

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          alert("LOGIN SUCCESSFUL!");

          // 1. Save Token
          localStorage.setItem("token", data.access_token);

          // 2. Save Role (CRITICAL for Doctor Dashboard)
          // Note: Ensure your Backend /login endpoint returns "role"
          localStorage.setItem("role", data.role);

          // 3. Close the modal
          document.getElementById("authModal").style.display = "none";

          // 4. Update the UI
          document.getElementById("loginBtn").innerText = "Logout";

          // 5. Refresh the page to load the correct dashboard
          location.reload();
        } else {
          alert("LOGIN FAILED: " + (data.detail || "Invalid credentials"));
        }
      } catch (error) {
        alert("CONNECTION ERROR: " + error.message);
      }
    });
  }
});

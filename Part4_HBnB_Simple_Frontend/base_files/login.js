document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const togglePassword = document.getElementById("toggle-password");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful:", data);

          // Stocker le token dans les cookies
          document.cookie = `authToken=${data.access_token}; path=/; max-age=3600; secure`;

          alert("Login successful!");
          window.location.href = "index.html";
        } else {
          const errorData = await response.json();
          alert("Login failed: " + (errorData.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while logging in. Please try again later.");
      }
    });
  }

  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const passwordField = document.getElementById("password");
      const type = passwordField.type === "password" ? "text" : "password";
      passwordField.type = type;

      togglePassword.textContent =
        type === "password" ? "Show Password" : "Hide Password";
    });
  }
});

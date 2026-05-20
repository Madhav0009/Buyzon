/* REGISTER USER */

async function registerUser(event) {
  event.preventDefault();

  const message = document.getElementById("message");
  const button = event.target.querySelector("button");

  button.innerText = "Creating Account...";
  button.disabled = true;

  const data = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch("http://localhost:8081/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      message.innerHTML = `
        <span style="color:#dc2626;font-weight:600;">
          ${result.message || "Registration failed"}
        </span>
      `;

      button.innerText = "Create Account";
      button.disabled = false;
      return;
    }

    message.innerHTML = `
      <span style="color:#16a34a;font-weight:600;">
        Account created successfully
      </span>
    `;

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1200);

  } catch (error) {
    console.error(error);

    message.innerHTML = `
      <span style="color:#dc2626;font-weight:600;">
        Something went wrong
      </span>
    `;

    button.innerText = "Create Account";
    button.disabled = false;
  }
}


/* LOGIN USER */

async function loginUser(event, isAdminLogin = false) {
  event.preventDefault();

  const message = document.getElementById("message");
  const button = event.target.querySelector("button");

  button.innerText = "Logging In...";
  button.disabled = true;

  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch("http://localhost:8081/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      message.innerHTML = `
        <span style="color:#dc2626;font-weight:600;">
          Invalid username or password
        </span>
      `;

      button.innerText = "Login";
      button.disabled = false;
      return;
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.username);
    localStorage.setItem("role", result.role);

    message.innerHTML = `
      <span style="color:#16a34a;font-weight:600;">
        Login successful
      </span>
    `;

    setTimeout(() => {
      if (result.role === "ADMIN") {
        window.location.href = "/admin-home.html";
      } else {
        window.location.href = "/customer-home.html";
      }
    }, 1000);

  } catch (error) {
    console.error(error);

    message.innerHTML = `
      <span style="color:#dc2626;font-weight:600;">
        Something went wrong
      </span>
    `;

    button.innerText = "Login";
    button.disabled = false;
  }
}


/* PAGE LOAD */

document.addEventListener("DOMContentLoaded", () => {

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const adminLoginForm = document.getElementById("adminLoginForm");

  if (signupForm) {
    signupForm.addEventListener("submit", registerUser);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => loginUser(e, false));
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => loginUser(e, true));
  }

});
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  // Demonstration-only credentials. This is not secure authentication.
  if (username === "fabbies" && password === "1234") {
    sessionStorage.setItem("fabbiesDemoLoggedIn", "yes");
    sessionStorage.setItem("fabbiesDemoUser", username);
    window.location.href = "micproj.html";
  } else {
    error.textContent = "Invalid username or password. Try the demo credentials shown below.";
  }
});

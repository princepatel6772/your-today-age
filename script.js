 let users = JSON.parse(localStorage.getItem("users")) || [];
let activeUser = null;

// Replace this with your real Google Apps Script Web App URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyp8krtAsHtFm854SF5oh8zZE_RwQZU5UMLQrxQw5vYO8TbYK0DwYySrrmmSXv5GzVXyA/exec';

function signIn() {
  const mobile = document.getElementById("loginMobile").value;
  const password = document.getElementById("loginPassword").value;
  const user = users.find(u => u.mobile === mobile && u.password === password);
  if (user) {
    localStorage.setItem("activeUser", JSON.stringify(user));
    window.location.href = "age.html";
  } else {
    alert("User not found. Please Sign Up.");
    document.getElementById("signupForm").style.display = "block";
  }
}

function signUp() {
  const name = document.getElementById("signupName").value;
  const mobile = document.getElementById("signupMobile").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }
  const newUser = { name, mobile, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("activeUser", JSON.stringify(newUser));
  window.location.href = "age.html";
}

function showSignUp() {
  document.getElementById("signupForm").style.display = "block";
}

function calculateAge() {
  const birthDate = new Date(document.getElementById("birthDate").value);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const result = `${years} years, ${months} months, ${days} days`;
  document.getElementById("result").innerText = "Your Age: " + result;

  const user = JSON.parse(localStorage.getItem("activeUser"));
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: JSON.stringify({
      name: user.name,
      mobile: user.mobile,
      password: user.password,
      birthday: birthDate.toISOString().split("T")[0],
      age: result
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.text())
    .then(data => console.log("Saved to Google Sheets:", data));
}

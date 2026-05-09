/* ==================================================
   INTRO SCREEN + SYSTEM START
================================================== */

window.addEventListener("load", () => {

    if (!sessionStorage.getItem("introPlayed")) {

        sessionStorage.setItem("introPlayed", "true")

        setTimeout(() => {

            document.getElementById("intro-screen").style.display = "none"
            startSystem()

        }, 2500)

    } else {

        startSystem()

    }

})



/* ==================================================
   SYSTEM START
================================================== */

function startSystem() {

    /* DEVICE CHECK */

    if (window.innerWidth < 1366 || window.innerHeight < 650) {

        document.getElementById("unsupported-screen").style.display = "flex";
        return;

    }

    /* LOGIN CHECK */

    const currentUser = localStorage.getItem("currentUser")

    if (currentUser) {

        window.location.href = "/home-page/home.html"

    } else {

        document.getElementById("auth-section").style.visibility = "visible";
        document.getElementById("auth-section").style.display = "flex";

    }

}



/* ==================================================
   PASSWORD TOGGLE
================================================== */

function togglePassword() {

    const pass = document.getElementById("auth-password")
    const show = document.getElementById("show-eye")
    const hide = document.getElementById("hide-eye")

    if (pass.type === "password") {

        pass.type = "text"
        hide.style.display = "none"
        show.style.display = "inline"

    } else {

        pass.type = "password"
        hide.style.display = "inline"
        show.style.display = "none"

    }

}



/* ==================================================
   LOGIN USER
================================================== */

function loginUser() {

    const email = document.getElementById("auth-email").value.trim()
    const password = document.getElementById("auth-password").value.trim()
    const error = document.getElementById("auth-error")

    let users = JSON.parse(localStorage.getItem("users")) || {}

    if (!email || !password) {

        error.innerText = "Please enter email and password"
        return

    }

    if (!users[email]) {

        error.innerText = "User not found. Please sign up."
        return

    }

    if (users[email].password !== password) {

        error.innerText = "Incorrect password."
        return

    }

    /* LOGIN SUCCESS */

    localStorage.setItem("currentUser", email)

    window.location.href = "/home-page/home.html"

}



/* ==================================================
   SIGNUP USER
================================================== */

function signupUser() {

    const college = document.getElementById("college-name").value.trim()
    const email = document.getElementById("auth-email").value.trim()
    const password = document.getElementById("auth-password").value.trim()
    const error = document.getElementById("auth-error")

    let users = JSON.parse(localStorage.getItem("users")) || {}

    if (!college) {

        error.innerText = "Please enter college name"
        return

    }

    if (!email || !password) {

        error.innerText = "Please enter email and password"
        return

    }

    if (users[email]) {

        error.innerText = "User already exists. Please login."
        return

    }

    /* CREATE USER */

    users[email] = { college, password }

    localStorage.setItem("users", JSON.stringify(users))

    localStorage.setItem("currentUser", email)

    window.location.href = "/home-page/home.html"

}



/* ==================================================
   SWITCH TO SIGNUP MODE
================================================== */

function showSignup() {

    document.getElementById("auth-title").innerText = "Sign Up"

    document.getElementById("college-name").style.display = "block"

    document.getElementById("auth-button").innerText = "Create Account"

    document.getElementById("auth-button").onclick = signupUser

    document.getElementById("switch-msg").innerText = "Already registered?"

    document.getElementById("switch-action").innerText = "Login"

    document.getElementById("switch-action").onclick = showLogin

}



/* ==================================================
   SWITCH TO LOGIN MODE
================================================== */

function showLogin() {

    document.getElementById("auth-title").innerText = "Login"

    document.getElementById("college-name").style.display = "none"

    document.getElementById("auth-button").innerText = "Login"

    document.getElementById("auth-button").onclick = loginUser

    document.getElementById("switch-msg").innerText = "Don't have account?"

    document.getElementById("switch-action").innerText = "Sign Up"

    document.getElementById("switch-action").onclick = showSignup

}
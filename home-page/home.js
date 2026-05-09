document.addEventListener("DOMContentLoaded", () => {

    loadCollegeName();
    loadDepartmentVisibility();
    updateStudentCount();
    updateDepartmentCount();

});

/* ==================================================
   LOAD COLLEGE NAME (WITH FALLBACK)
================================================== */

function loadCollegeName() {

    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};

    let displayName = "Student Desk";

    if (currentUser && users[currentUser]) {

        const userData = users[currentUser];

        if (userData.college && userData.college.trim() !== "") {
            displayName = userData.college;
        } else {
            displayName = currentUser; // fallback to email
        }

    }

    document.querySelector(".college-name").textContent = displayName;
}


/* ==================================================
   2️⃣ LOGOUT SYSTEM
================================================== */


const logoutBtn = document.querySelector(".logout-btn")

logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to logout?")

    if (!confirmLogout) return;

    /* remove login session */

    localStorage.removeItem("currentUser");

    /* clear intro so login page shows properly */

    sessionStorage.removeItem("introPlayed");

    /* redirect */

    window.location.href = "/index.html";

})

/* ==================================================
   3️⃣ TOTAL STUDENT COUNT
================================================== */

function getTotalStudents() {

    let totalStudents = 0;

    for (let key in localStorage) {

        if (key.includes("_students_data")) {

            const students =
                JSON.parse(localStorage.getItem(key)) || [];

            totalStudents += students.length;

        }

    }

    return totalStudents;

}

function updateStudentCount() {

    const total = getTotalStudents();

    document.querySelector(".stat-box.stu span")
        .textContent = total;

}



/* ==================================================
   4️⃣ DEPARTMENT COUNT
================================================== */

function updateDepartmentCount() {

    const singleVisible =
        document.querySelectorAll(".dept-card:not([style*='display: none'])").length

    const subVisible =
        document.querySelectorAll(".sub-card:not([style*='display: none'])").length

    document.querySelector(".stat-box.dep span").textContent =
        singleVisible + subVisible

}



/* ==================================================
   5️⃣ POPUP OPEN / CLOSE
================================================== */

const deptBtn =
    document.querySelector(".dept-btn");

const popupContainer =
    document.querySelector(".dept-popup-container");

const closePopup =
    document.querySelector(".close-popup");

deptBtn.addEventListener("click", () => {

    popupContainer.classList.remove("hide");

});

closePopup.addEventListener("click", () => {

    popupContainer.classList.add("hide");

});



/* ================= SAVE DEPARTMENT SETTINGS ================= */

const saveBtn = document.querySelector(".save-dept-settings")

saveBtn.addEventListener("click", () => {

    let visibility = {}

    /* SINGLE DEPARTMENTS */

    document.querySelectorAll("[data-dept]").forEach(box => {

        const dept = box.dataset.dept
        const card = document.querySelector(`.dept-card.${dept}`)

        if (!card) return

        visibility[dept] = box.checked

        card.style.display = box.checked ? "" : "none"

    })

    /* SUB ROWS */

    document.querySelectorAll("[data-row]").forEach(box => {

        const rowName = box.dataset.row
        const row = document.querySelector(`.${rowName}`)

        if (!row) return

        visibility[rowName] = box.checked

        row.style.display = box.checked ? "" : "none"

    })

    /* SUB CARDS */

    document.querySelectorAll("[data-card]").forEach(box => {

        const sub = box.dataset.card

        visibility[sub] = box.checked

        document.querySelectorAll(".sub-card").forEach(card => {

            const name = card.querySelector("h4").innerText.toLowerCase()

            if (name.includes(sub)) {

                card.style.display = box.checked ? "" : "none"

            }

        })

    })

    localStorage.setItem("dept_visibility", JSON.stringify(visibility))

    updateDepartmentCount()

    popupContainer.classList.add("hide")

})


/* ================= LOAD SAVED VISIBILITY ================= */

function loadDepartmentVisibility() {

    const saved = localStorage.getItem("dept_visibility")

    if (!saved) return

    const visibility = JSON.parse(saved)

    /* LOOP THROUGH SAVED SETTINGS */

    Object.keys(visibility).forEach(key => {

        const isVisible = visibility[key]

        /* SINGLE DEPARTMENTS */

        const deptCard = document.querySelector(`.dept-card.${key}`)
        const deptCheckbox = document.querySelector(`[data-dept="${key}"]`)

        if (deptCard) {

            deptCard.style.display = isVisible ? "" : "none"

            if (deptCheckbox) deptCheckbox.checked = isVisible

        }

        /* SUB ROWS */

        const row = document.querySelector(`.${key}`)
        const rowCheckbox = document.querySelector(`[data-row="${key}"]`)

        if (row) {

            row.style.display = isVisible ? "" : "none"

            if (rowCheckbox) rowCheckbox.checked = isVisible

        }

        /* SUB CARDS */

        document.querySelectorAll(".sub-card").forEach(card => {

            const name = card.querySelector("h4").innerText.toLowerCase()

            if (name.includes(key)) {

                card.style.display = isVisible ? "" : "none"

                const subCheckbox = document.querySelector(`[data-card="${key}"]`)

                if (subCheckbox) subCheckbox.checked = isVisible

            }

        })

    })

}


/* ==================================================
   LOAD DASHBOARD DATA
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    updateStudentCount();
    updateDepartmentCount();

});
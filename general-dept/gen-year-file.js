/* ==================================================
   GET COLLEGE NAME FROM STORAGE
   ================================================== */

const collegeName = localStorage.getItem("college_name") || "Student Desk";

/* ==================================================
   1️⃣ GET DEPARTMENT + YEAR FROM URL
   Example URL:
   year.html?dept=bca&year=1
   ================================================== */
const params = new URLSearchParams(window.location.search);
const department = params.get("dept");
// department.innerText.toUpperCase();
const year = params.get("year");


/* ==================================================
   YEAR TEXT FORMAT
   1 -> 1st Year
   2 -> 2nd Year
   3 -> 3rd Year
   ================================================== */

function getYearText(y) {

    if (y === 1) return "1st Year";
    if (y === 2) return "2nd Year";
    if (y === 3) return "3rd Year";

}

/* ==================================================
   YEAR NAVIGATION LINKS (TOP RIGHT NAVBAR)
   ================================================== */

const yearLinksContainer = document.getElementById("year-links");

if (yearLinksContainer && department && year) {

    for (let y = 1; y <= 3; y++) {

        // Skip current year
        if (y !== Number(year)) {

            const li = document.createElement("li");

            const link = document.createElement("a");

            // Example: year.html?dept=bca&year=2
            link.href = `gen-year-file.html?dept=${department}&year=${y}`;

            // Display text
            link.textContent = `${department.toUpperCase()} ${getYearText(y)}`;

            li.appendChild(link);
            yearLinksContainer.appendChild(li);
        }
    }

}

/* ==================================================
   2️⃣ DYNAMIC STORAGE KEY
   Each department + year has its own storage
   Example:
   bca_year1_students_data
   bba_year2_students_data
   ba_year3_students_data
   ================================================== */

const STORAGE_KEY = `${department}_year${year}_students_data`;


/* ==================================================
   3️⃣ UPDATE PAGE TITLE
   ================================================== */

/* ==================================================
   UPDATE PAGE TITLE
   ================================================== */

document.getElementById("clg-name").textContent =
    `${collegeName} - ( ${department?.toUpperCase()} ${getYearText(Number(year))} )`;


/* ==================================================
   4️⃣ LOCAL STORAGE HELPERS
   ================================================== */

// Get students array from localStorage
function getStudentsFromStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save students array to localStorage
function saveStudentsToStorage(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}


/* ==================================================
   5️⃣ STUDENT COUNT
   ================================================== */

function updateStudentCount() {
    const students = getStudentsFromStorage();
    document.getElementById("student-count").textContent = students.length;
}


/* ==================================================
   6️⃣ RENDER TABLE FROM STORAGE
   ================================================== */

const tableBody = document.getElementById("student-table-body");

function renderTable() {

    tableBody.innerHTML = "";

    const students = getStudentsFromStorage();

    students.forEach((student, index) => {

        const remainingFees = student.totalFees - student.paidFees;

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.roll}</td>
        <td>${student.name}</td>
        <td>${student.semester}</td>
        <td>${department.toUpperCase()}</td>
        <td>${student.phone}</td>
        <td>${student.parentPhone}</td>
        <td>${student.email}</td>
        <td>₹${student.totalFees}</td>
        <td>₹${student.paidFees}</td>
        <td>₹${remainingFees}</td>

        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
        `;

        tableBody.appendChild(row);

    });

    updateStudentCount();
}


/* ==================================================
   7️⃣ ADD STUDENT PANEL OPEN / CLOSE
   ================================================== */

const addStudentBtn = document.getElementById("add-student-btn");
const addStudentPanelContainer = document.querySelector(".add-student-panel-container");
const addStudentPanel = document.querySelector(".add-student-panel");

// open panel
addStudentBtn.addEventListener("click", (e) => {

    e.stopPropagation();
    addStudentPanelContainer.classList.toggle("hide");

});

// prevent closing when clicking inside panel
addStudentPanel.addEventListener("click", (e) => {

    e.stopPropagation();

});

// close panel when clicking outside
document.addEventListener("click", () => {

    addStudentPanelContainer.classList.add("hide");

});


/* ==================================================
   8️⃣ ADD STUDENT
   Save new student to localStorage
   ================================================== */

document.querySelector(".add-button").addEventListener("click", () => {

    const student = {

        roll: document.getElementById("student-roll").value.trim(),
        name: document.getElementById("student-name").value.trim(),
        semester: document.getElementById("student-semester").value.trim(),
        phone: document.getElementById("student-phone").value.trim(),
        parentPhone: document.getElementById("parent-phone").value.trim(),
        email: document.getElementById("student-email").value.trim(),
        totalFees: Number(document.getElementById("student-fees").value),
        paidFees: Number(document.getElementById("student-paid").value)

    };


    /* ---------- VALIDATION ---------- */

    if (
        !student.roll || !student.name || !student.semester ||
        !student.phone || !student.parentPhone || !student.email ||
        isNaN(student.totalFees) || isNaN(student.paidFees)
    ) {

        alert("Please fill all fields correctly");
        return;

    }

    if (student.paidFees > student.totalFees) {

        alert("Paid fees cannot be greater than total fees");
        return;

    }


    /* ---------- SAVE STUDENT ---------- */

    const students = getStudentsFromStorage();

    students.push(student);

    saveStudentsToStorage(students);


    /* ---------- REFRESH UI ---------- */

    renderTable();


    /* ---------- CLEAR INPUTS ---------- */

    document
        .querySelectorAll(".add-student-panel input")
        .forEach(input => input.value = "");


    addStudentPanelContainer.classList.add("hide");

});


/* ==================================================
   9️⃣ SEARCH STUDENT
   Search by Roll or Name
   ================================================== */

document.getElementById("search-bar").addEventListener("input", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll("#student-table-body tr").forEach(row => {

        const roll = row.children[1].textContent.toLowerCase();
        const name = row.children[2].textContent.toLowerCase();

        row.style.display =
            roll.includes(value) || name.includes(value)
                ? ""
                : "none";

    });

});


/* ==================================================
   🔟 EDIT / SAVE & DELETE
   ================================================== */

tableBody.addEventListener("click", (e) => {


    /* ---------- DELETE STUDENT ---------- */

    if (e.target.classList.contains("delete-btn")) {

        const index = e.target.dataset.index;

        if (!confirm("Delete this student?")) return;

        const students = getStudentsFromStorage();

        students.splice(index, 1);

        saveStudentsToStorage(students);

        renderTable();

    }


    /* ---------- EDIT / SAVE ---------- */

    if (e.target.classList.contains("edit-btn")) {

        const row = e.target.closest("tr");

        const cells = row.querySelectorAll("td");

        const index = row.rowIndex - 1;


        /* ---------- SAVE MODE ---------- */

        if (e.target.textContent === "Save") {

            const students = getStudentsFromStorage();

            students[index] = {

                roll: cells[1].querySelector("input").value,
                name: cells[2].querySelector("input").value,
                semester: cells[3].querySelector("input").value,
                phone: cells[5].querySelector("input").value,
                parentPhone: cells[6].querySelector("input").value,
                email: cells[7].querySelector("input").value,
                totalFees: Number(cells[8].querySelector("input").value),
                paidFees: Number(cells[9].querySelector("input").value)

            };

            saveStudentsToStorage(students);

            renderTable();

            return;

        }


        /* ---------- EDIT MODE ---------- */

        for (let i = 1; i <= 9; i++) {

            cells[i].innerHTML =
                `<input class="edit-input" value="${cells[i].textContent.replace("₹", "")}">`;

        }

        e.target.textContent = "Save";

        row.classList.add("editing");

    }

});


/* ==================================================
   1️⃣1️⃣ EXPORT CSV
   ================================================== */

document.getElementById("export-btn").addEventListener("click", () => {

    const rows = document.querySelectorAll(".student-table table tr");

    let csv = ["sep=,"];

    rows.forEach(row => {

        let data = [];

        row.querySelectorAll("th,td").forEach((cell, i, arr) => {

            if (i !== arr.length - 1) {

                data.push(`"${cell.innerText}"`);

            }

        });

        csv.push(data.join(","));

    });


    const blob = new Blob([csv.join("\n")], { type: "text/csv" });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download =
        `${department.toUpperCase()}_Year${year}_Students.csv`;

    a.click();

});


/* ==================================================
   1️⃣2️⃣ IMPORT CSV
   ================================================== */

document.getElementById("import-btn").addEventListener("click", () => {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".csv";

    input.addEventListener("change", handleCSVImport);

    input.click();

});


/* ==================================================
   IMPORT CSV LOGIC
   ================================================== */

function handleCSVImport(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const csvText = e.target.result;

        importCSVData(csvText);

    };

    reader.readAsText(file);

}


function importCSVData(csvText) {

    const lines = csvText.trim().split("\n");


    if (lines[0].startsWith("sep=")) {

        lines.shift();

    }


    lines.shift(); // remove header


    const students = [];


    lines.forEach(line => {

        const cols = line.split(",").map(col =>
            col.replace(/"/g, "").trim()
        );


        if (cols.length < 10) return;


        const student = {

            roll: cols[1],
            name: cols[2],
            semester: cols[3],
            phone: cols[5],
            parentPhone: cols[6],
            email: cols[7],
            totalFees: Number(cols[8].replace("₹", "")),
            paidFees: Number(cols[9].replace("₹", ""))

        };


        students.push(student);

    });


    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));

    renderTable();

    alert("Students imported successfully!");

}


/* ==================================================
   1️⃣3️⃣ LOAD DATA ON PAGE LOAD
   ================================================== */

document.addEventListener("DOMContentLoaded", renderTable);
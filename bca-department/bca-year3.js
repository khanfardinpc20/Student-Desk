/* ==================================================
   1️⃣ STORAGE CONFIGURATION
   ================================================== */

/* 🔄 CHANGED: storage key for BCA 2nd Year */
const STORAGE_KEY = "bca_year2_students_data";

/* ==================================================
   2️⃣ LOCAL STORAGE HELPERS
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
   3️⃣ STUDENT COUNT
   ================================================== */

function updateStudentCount() {
    const students = getStudentsFromStorage();
    document.getElementById("student-count").textContent = students.length;
}

/* ==================================================
   4️⃣ RENDER TABLE FROM STORAGE
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
            <td>Computer Applications</td>
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
   5️⃣ ADD STUDENT PANEL OPEN / CLOSE
   ================================================== */

const addStudentBtn = document.getElementById("add-student-btn");
const addStudentPanelContainer = document.querySelector(".add-student-panel-container");
const addStudentPanel = document.querySelector(".add-student-panel");

addStudentBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addStudentPanelContainer.classList.toggle("hide");
});

addStudentPanel.addEventListener("click", (e) => {
    e.stopPropagation();
});

document.addEventListener("click", () => {
    addStudentPanelContainer.classList.add("hide");
});

/* ==================================================
   6️⃣ ADD STUDENT (SAVE TO STORAGE)
   ================================================== */

document.querySelector(".add-button").addEventListener("click", () => {

    const student = {
        roll: document.getElementById("student-roll").value.trim(),
        name: document.getElementById("student-name").value.trim(),

        /* 🧠 Semester expected: 3rd / 4th */
        semester: document.getElementById("student-semester").value.trim(),

        phone: document.getElementById("student-phone").value.trim(),
        parentPhone: document.getElementById("parent-phone").value.trim(),
        email: document.getElementById("student-email").value.trim(),
        totalFees: Number(document.getElementById("student-fees").value),
        paidFees: Number(document.getElementById("student-paid").value)
    };

    // Validation
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

    // Save to localStorage
    const students = getStudentsFromStorage();
    students.push(student);
    saveStudentsToStorage(students);

    // Refresh UI
    renderTable();

    // Clear inputs
    document.querySelectorAll(".add-student-panel input").forEach(input => input.value = "");
    addStudentPanelContainer.classList.add("hide");
});

/* ==================================================
   7️⃣ SEARCH STUDENT
   ================================================== */

document.getElementById("search-bar").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    document.querySelectorAll("#student-table-body tr").forEach(row => {
        const roll = row.children[1].textContent.toLowerCase();
        const name = row.children[2].textContent.toLowerCase();

        row.style.display =
            roll.includes(value) || name.includes(value) ? "" : "none";
    });
});

/* ==================================================
   8️⃣ EDIT / SAVE & DELETE
   ================================================== */

tableBody.addEventListener("click", (e) => {

    /* ---------- DELETE ---------- */
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

        // EDIT MODE
        for (let i = 1; i <= 9; i++) {
            cells[i].innerHTML =
                `<input class="edit-input" value="${cells[i].textContent.replace("₹", "")}">`;
        }

        e.target.textContent = "Save";
        row.classList.add("editing");
    }
});

/* ==================================================
   9️⃣ EXPORT CSV
   ================================================== */

document.getElementById("export-btn").addEventListener("click", () => {
    const rows = document.querySelectorAll(".student-table table tr");
    let csv = ["sep=,"];

    rows.forEach(row => {
        let data = [];
        row.querySelectorAll("th,td").forEach((cell, i, arr) => {
            if (i !== arr.length - 1) data.push(`"${cell.innerText}"`);
        });
        csv.push(data.join(","));
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    /* 🔄 FILE NAME UPDATED */
    a.download = "BCA_Year2_Students.csv";
    a.click();
});

/* ==================================================
   🔟 IMPORT CSV
   ================================================== */

document.getElementById("import-btn").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.addEventListener("change", handleCSVImport);
    input.click();
});

function handleCSVImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => importCSVData(e.target.result);
    reader.readAsText(file);
}

function importCSVData(csvText) {
    const lines = csvText.trim().split("\n");

    if (lines[0].startsWith("sep=")) lines.shift();
    lines.shift(); // remove header

    const students = [];

    lines.forEach(line => {
        const cols = line.split(",").map(c => c.replace(/"/g, "").trim());
        if (cols.length < 10) return;

        students.push({
            roll: cols[1],
            name: cols[2],
            semester: cols[3],
            phone: cols[5],
            parentPhone: cols[6],
            email: cols[7],
            totalFees: Number(cols[8].replace("₹", "")),
            paidFees: Number(cols[9].replace("₹", ""))
        });
    });

    saveStudentsToStorage(students);
    renderTable();
    alert("Students imported successfully!");
}

/* ==================================================
   🔟 LOAD DATA ON PAGE LOAD
   ================================================== */

document.addEventListener("DOMContentLoaded", renderTable);

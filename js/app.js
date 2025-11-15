/* ===============================
   SCHOOL MIS — FULL FRONT END
   LocalStorage Database Engine
   iSAMS-style
================================*/

// ---------- DATABASE INITIAL SETUP ----------
let DB = JSON.parse(localStorage.getItem("MISDATA")) || {
    students: [],
    classes: [],
    teachers: [],
    attendance: {},
    behaviour: [],
};

// Save to localStorage
function saveDB() {
    localStorage.setItem("MISDATA", JSON.stringify(DB));
}

// ---------- PAGE LOADER ----------
function loadPage(page) {
    const container = document.getElementById("page-content");
    if (page === "dashboard") renderDashboard(container);
    if (page === "students") renderStudents(container);
    if (page === "classes") renderClasses(container);
    if (page === "teachers") renderTeachers(container);
    if (page === "attendance") renderAttendance(container);
    if (page === "behaviour") renderBehaviour(container);
    if (page === "admin") renderAdmin(container);
}

window.onload = () => loadPage("dashboard");

// ---------- DASHBOARD ----------
function renderDashboard(root) {
    const today = new Date().toISOString().slice(0, 10);

    root.innerHTML = `
        <h1>Dashboard</h1>

        <div class="card">
            <h2>Today's Classes</h2>
            <input type="date" id="dashDate" value="${today}" onchange="renderDashboard(document.getElementById('page-content'))">

            <div id="dashClasses"></div>
        </div>
    `;

    const date = document.getElementById("dashDate").value;
    renderDashboardClasses(date);
}

function renderDashboardClasses(date) {
    const out = document.getElementById("dashClasses");
    let html = "";

    DB.classes.forEach(cls => {
        html += `<div>${cls.code} — ${cls.teacher}</div>`;
    });

    out.innerHTML = html;
}

// ---------- STUDENTS ----------
function renderStudents(root) {
    root.innerHTML = `
        <h1>Students</h1>
        <div class="card">
            <table class="table">
                <tr><th>Name</th><th>House</th><th>Actions</th></tr>
                ${DB.students.map((s,i)=>`
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.house}</td>
                        <td><button onclick="openStudent(${i})">Open</button></td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

function openStudent(id) {
    const s = DB.students[id];
    const root = document.getElementById("page-content");

    root.innerHTML = `
        <h1>${s.name}</h1>

        <div class="card">
            <h3>House: ${s.house}</h3>
            <h3>Timetable</h3>
            ${renderTimetableHTML(s)}
        </div>

        <button onclick="loadPage('students')">Back</button>
    `;
}

// ---------- TIMETABLE ----------
function renderTimetableHTML(student) {
    let html = "<table class='table'><tr><th>Period</th><th>Class</th></tr>";

    for (let p = 1; p <= 6; p++) {
        html += `
            <tr>
                <td>P${p}</td>
                <td>${student.timetable?.[`P${p}`] || "—"}</td>
            </tr>
        `;
    }
    html += "</table>";
    return html;
}

// ---------- CLASSES ----------
function renderClasses(root) {
    root.innerHTML = `
        <h1>Classes</h1>

        <div class="card">
            <table class="table">
                <tr><th>Code</th><th>Teacher</th><th>Students</th></tr>
                ${DB.classes.map(c=>`
                    <tr>
                        <td>${c.code}</td>
                        <td>${c.teacher}</td>
                        <td>${c.students.length}</td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

// ---------- TEACHERS ----------
function renderTeachers(root) {
    root.innerHTML = `
        <h1>Teachers</h1>
        <div class="card">
            ${DB.teachers.map(t=>`<div>${t}</div>`).join("")}
        </div>
    `;
}

// ---------- ATTENDANCE ----------
function renderAttendance(root) {
    const today = new Date().toISOString().slice(0, 10);

    root.innerHTML = `
        <h1>Attendance</h1>
        <input type="date" id="attDate" value="${today}" onchange="renderAttendance(document.getElementById('page-content'))">

        <div class="card">
            ${renderAttendanceTable(today)}
        </div>
    `;
}

function renderAttendanceTable(date) {
    let out = "<table class='table'><tr><th>Student</th>";

    for (let p = 1; p <= 6; p++) out += `<th>P${p}</th>`;
    out += "</tr>";

    DB.students.forEach((s, i) => {
        out += `<tr><td>${s.name}</td>`;

        for (let p = 1; p <= 6; p++) {
            const code = DB.attendance?.[date]?.[s.name]?.[`P${p}`] || "";
            out += `
                <td>
                    <select onchange="updateAttendance('${date}','${s.name}','P${p}',this.value)">
                        <option value=""></option>
                        <option ${code=="P"?"selected":""}>P</option>
                        <option ${code=="L"?"selected":""}>L</option>
                        <option ${code=="A"?"selected":""}>A</option>
                    </select>
                </td>`;
        }
        out += "</tr>";
    });

    out += "</table>";
    return out;
}

function updateAttendance(date, student, period, value) {
    if (!DB.attendance[date]) DB.attendance[date] = {};
    if (!DB.attendance[date][student]) DB.attendance[date][student] = {};
    DB.attendance[date][student][period] = value;
    saveDB();
}

// ---------- BEHAVIOUR ----------
function renderBehaviour(root) {
    root.innerHTML = `
        <h1>Behaviour</h1>

        <div class="card">
            ${DB.behaviour.map(b=>`
                <div><strong>${b.student}</strong>: ${b.text}</div>
            `).join("")}
        </div>
    `;
}

// ---------- ADMIN ----------
function renderAdmin(root) {
    root.innerHTML = `
        <h1>Admin Panel</h1>

        <div class="card">
            <h3>Add Student</h3>
            <input id="newStuName" placeholder="Name">
            <input id="newStuHouse" placeholder="House">
            <button onclick="addStudent()">Add</button>
        </div>
    `;
}

function addStudent() {
    DB.students.push({
        name: document.getElementById("newStuName").value,
        house: document.getElementById("newStuHouse").value,
        timetable: {}
    });
    saveDB();
    loadPage("students");
}

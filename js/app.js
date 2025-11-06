const user = { username: "callan.chesser", password: "callan.chesser" };

if (!localStorage.getItem("students")) {
  const houses = ["Fraser", "Morrison", "Arthur", "Temple"];
  const students = [];
  for (let i = 1; i <= 180; i++) {
    students.push({
      id: i,
      name: `Student ${i}`,
      house: houses[i % 4],
      tutor: `S3-${houses[i % 4][0]}${(i % 3) + 1}`,
      merits: 0,
      demerits: 0,
      attendance: {}
    });
  }
  localStorage.setItem("students", JSON.stringify(students));
}

// LOGIN
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === user.username && p === user.password) {
    localStorage.setItem("loggedIn", "true");
    location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "Invalid login";
  }
}
function logout() {
  localStorage.removeItem("loggedIn");
  location.href = "index.html";
}

// DASHBOARD
function loadDashboard() {
  if (!localStorage.getItem("loggedIn")) location.href = "index.html";
  document.getElementById("user").innerText = user.username;
  const students = JSON.parse(localStorage.getItem("students"));
  document.getElementById("studentCount").innerText = students.length;
  const houses = {};
  students.forEach(s => {
    if (!houses[s.house]) houses[s.house] = 0;
    houses[s.house] += s.merits - s.demerits;
  });
  let max = Object.entries(houses).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("houseChampion").innerText = max[0];
  document.getElementById("houseBoard").innerHTML = Object.entries(houses)
    .map(([h, pts]) => `<div class='card'>${h}: ${pts} pts</div>`).join("");
  document.getElementById("attendanceAvg").innerText = 95;
}

// ATTENDANCE
function loadAttendance() {
  if (!localStorage.getItem("loggedIn")) location.href = "index.html";
  const students = JSON.parse(localStorage.getItem("students"));
  const tbody = document.querySelector("#attendanceTable tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    tbody.innerHTML += `<tr>
      <td>${s.name}</td>
      <td>${s.tutor}</td>
      <td>${s.house}</td>
      <td>
        <select onchange="updateAttendance(${s.id}, this.value)">
          <option>Present</option>
          <option>Late</option>
          <option>Absent</option>
          <option>Out of School</option>
        </select>
      </td>
    </tr>`;
  });
}
function updateAttendance(id, status) {
  const students = JSON.parse(localStorage.getItem("students"));
  const s = students.find(st => st.id === id);
  s.attendance[new Date().toDateString()] = status;
  localStorage.setItem("students", JSON.stringify(students));
}

// BEHAVIOUR
function loadBehaviour() {
  if (!localStorage.getItem("loggedIn")) location.href = "index.html";
  const students = JSON.parse(localStorage.getItem("students"));
  const tbody = document.querySelector("#behaviourTable tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    tbody.innerHTML += `<tr>
      <td>${s.name}</td>
      <td>${s.house}</td>
      <td>${s.merits}</td>
      <td>${s.demerits}</td>
      <td>
        <button onclick="addMerit(${s.id})">+ Merit</button>
        <button onclick="addDemerit(${s.id})">- Demerit</button>
      </td>
    </tr>`;
  });
}
function addMerit(id) {
  const students = JSON.parse(localStorage.getItem("students"));
  const s = students.find(st => st.id === id);
  s.merits++;
  localStorage.setItem("students", JSON.stringify(students));
  loadBehaviour();
}
function addDemerit(id) {
  const students = JSON.parse(localStorage.getItem("students"));
  const s = students.find(st => st.id === id);
  s.demerits++;
  localStorage.setItem("students", JSON.stringify(students));
  loadBehaviour();
}

// TIMETABLE
function loadTimetable() {
  if (!localStorage.getItem("loggedIn")) location.href = "index.html";
  const students = JSON.parse(localStorage.getItem("students"));
  const container = document.getElementById("timetableContainer");
  container.innerHTML = "<p>Example timetable generator coming soon.</p>";
}

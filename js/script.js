// ---------- BASIC LOGIN ----------
const defaultUser = { username: "callan.chesser", password: "callan.chesser" };

if (!localStorage.getItem("tgaUser")) {
  localStorage.setItem("tgaUser", JSON.stringify(defaultUser));
}

function login(username, password) {
  const u = JSON.parse(localStorage.getItem("tgaUser"));
  if (username === u.username && password === u.password) {
    localStorage.setItem("loggedIn", "true");
    location.href = "dashboard.html";
  } else {
    alert("Invalid login");
  }
}

document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  login(
    document.getElementById("username").value.trim(),
    document.getElementById("password").value.trim()
  );
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  location.href = "index.html";
});

// ---------- DARK / LIGHT ----------
const toggleThemeBtn = document.getElementById("toggleTheme");
if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("click", () => {
    const body = document.body;
    body.classList.toggle("light");
    localStorage.setItem("theme", body.classList.contains("light") ? "light" : "dark");
  });
}
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");

// ---------- STUDENT GENERATION ----------
if (!localStorage.getItem("students")) {
  const firstNames = ["Aiden","Sophie","Liam","Ella","Noah","Grace","James","Isla","Lucas","Freya"];
  const lastNames  = ["McLeod","Fraser","Wallace","Campbell","Stewart","MacKay","Gordon","Reid","Brown","Wilson"];
  const houses     = ["Fraser","Morrison","Arthur","Temple"];

  const students = [];
  for (let i=0;i<180;i++){
    const name = `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`;
    const house = houses[i % 4];
    const tutor = `S3-${house[0]}${Math.floor(i/15)%4+1}`;
    students.push({
      id:i, name, house, tutor,
      attendance:{}, merits:0, detentions:0
    });
  }
  localStorage.setItem("students", JSON.stringify(students));
}

// ---------- DASHBOARD ----------
if (document.getElementById("teacherName")) {
  document.getElementById("teacherName").textContent =
    JSON.parse(localStorage.getItem("tgaUser")).username;
  renderDashboard();
}

function renderDashboard() {
  const students = JSON.parse(localStorage.getItem("students"));
  const houses = ["Fraser","Morrison","Arthur","Temple"];
  const scores = {Fraser:0,Morrison:0,Arthur:0,Temple:0};
  students.forEach(s=>scores[s.house]+=s.merits - s.detentions);

  const leaderboard = Object.entries(scores)
    .map(([h,pts])=>`<div class='mb-2'><strong>${h}</strong>: ${pts} pts</div>`).join("");
  document.getElementById("houseLeaderboard").innerHTML = leaderboard;

  const tutor = "S3-F1"; // you can change to your tutor group
  const tutorList = students.filter(s=>s.tutor===tutor)
    .map(s=>`<li class='list-group-item bg-dark text-light'>${s.name}</li>`).join("");
  document.getElementById("tutorList").innerHTML = tutorList;
}

// ---------- STUDENT PAGE ----------
if (document.getElementById("studentList")) {
  const container = document.getElementById("studentList");
  const data = JSON.parse(localStorage.getItem("students"));
  function render(list){
    container.innerHTML = list.map(s=>`
      <div class='col-md-4'>
        <div class='student-card'>
          <strong>${s.name}</strong><br>
          House: ${s.house} | Tutor: ${s.tutor}<br>
          Merits: ${s.merits} | Detentions: ${s.detentions}
        </div>
      </div>`).join("");
  }
  render(data);
  document.getElementById("searchStudent").addEventListener("input", e=>{
    const q=e.target.value.toLowerCase();
    render(data.filter(s=>s.name.toLowerCase().includes(q)));
  });
}

// ---------- HOUSES PAGE ----------
if (document.getElementById("housePoints")) {
  const container=document.getElementById("housePoints");
  const students=JSON.parse(localStorage.getItem("students"));
  const totals={Fraser:0,Morrison:0,Arthur:0,Temple:0};
  students.forEach(s=>totals[s.house]+=s.merits-s.detentions);
  const html=Object.entries(totals)
    .map(([h,pts])=>`<div class='col-md-3'><div class='card text-center p-3'><h5>${h}</h5><h2>${pts}</h2></div></div>`).join("");
  container.innerHTML=html;
  const champ=Object.entries(totals).sort((a,b)=>b[1]-a[1])[0][0];
  document.getElementById("weeklyChampion").textContent=champ;
}

// ---------- SETTINGS ----------
document.getElementById("changePassBtn")?.addEventListener("click", ()=>{
  const newPass=document.getElementById("newPassword").value.trim();
  if(!newPass)return alert("Enter new password");
  const u=JSON.parse(localStorage.getItem("tgaUser"));
  u.password=newPass;
  localStorage.setItem("tgaUser",JSON.stringify(u));
  alert("Password updated");
});

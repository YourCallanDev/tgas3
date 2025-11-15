// LocalStorage DB
let DB = JSON.parse(localStorage.getItem("MISDATA")) || {
    students: [],
    classes: [],
    teachers: [],
    attendance: {},
    behaviour: []
};

function saveDB(){
    localStorage.setItem("MISDATA", JSON.stringify(DB));
}

function loadPage(page){
    const root = document.getElementById("page-content");

    if (page === "dashboard") renderDashboard(root);
    if (page === "students") renderStudents(root);
    if (page === "classes") renderClasses(root);
    if (page === "teachers") renderTeachers(root);
    if (page === "attendance") renderAttendance(root);
    if (page === "behaviour") renderBehaviour(root);
    if (page === "admin") renderAdmin(root);
}

function renderAdmin(root){
    root.innerHTML = `
        <h1>Admin Panel</h1>
        <div class="card">
            <h3>Add Student</h3>
            <input id="newStu" placeholder="Name">
            <input id="newHouse" placeholder="House">
            <button onclick="addStudent()">Add</button>
        </div>
    `;
}

function addStudent(){
    DB.students.push({
        name: document.getElementById("newStu").value,
        house: document.getElementById("newHouse").value,
        timetable: {}
    });
    saveDB();
    loadPage("students");
}

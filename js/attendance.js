function renderAttendance(root){
    const date = new Date().toISOString().split("T")[0];

    root.innerHTML = `
        <h1>Attendance</h1>
        <input type="date" id="attDate" value="${date}" onchange="renderAttendance(root)">
        <div class="card">${attendanceTable(date)}</div>
    `;
}

function attendanceTable(date){
    let html = `<table class='table'>
        <tr><th>Student</th>
        <th>P1</th><th>P2</th><th>P3</th><th>P4</th><th>P5</th><th>P6</th></tr>
    `;

    DB.students.forEach(stu => {
        html += `<tr><td>${stu.name}</td>`;

        for (let p = 1; p <= 6; p++){
            const val = DB.attendance?.[date]?.[stu.name]?.[`P${p}`] || "";
            html += `
                <td>
                    <select onchange="updateAttendance('${date}','${stu.name}','P${p}',this.value)">
                        <option value=""></option>
                        <option ${val=="P"?"selected":""}>P</option>
                        <option ${val=="L"?"selected":""}>L</option>
                        <option ${val=="A"?"selected":""}>A</option>
                    </select>
                </td>
            `;
        }

        html += `</tr>`;
    });

    html += `</table>`;
    return html;
}

function updateAttendance(date, student, period, value){
    if(!DB.attendance[date]) DB.attendance[date] = {};
    if(!DB.attendance[date][student]) DB.attendance[date][student] = {};
    DB.attendance[date][student][period] = value;
    saveDB();
}

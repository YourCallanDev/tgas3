// Sidebar rendering
document.getElementById("sidebar").innerHTML = `
    <h2>MIS</h2>
    <ul>
        <li onclick="navigate('index.html')">Dashboard</li>
        <li onclick="navigate('students.html')">Students</li>
        <li onclick="navigate('classes.html')">Classes</li>
        <li onclick="navigate('teachers.html')">Teachers</li>
        <li onclick="navigate('attendance.html')">Attendance</li>
        <li onclick="navigate('behaviour.html')">Behaviour</li>
        <li onclick="navigate('admin.html')">Admin</li>
    </ul>
`;

function navigate(page){
    window.location.href = page;
}

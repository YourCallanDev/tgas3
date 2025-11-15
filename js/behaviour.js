function renderBehaviour(root){
    root.innerHTML = `
        <h1>Behaviour Log</h1>
        <div class="card">
            <input id="behName" placeholder="Student name">
            <input id="behText" placeholder="Note">
            <button onclick="addBehaviour()">Add</button>
        </div>

        ${DB.behaviour.map(b=>`
            <div class="card"><b>${b.student}</b>: ${b.text}</div>
        `).join("")}
    `;
}

function addBehaviour(){
    DB.behaviour.push({
        student: document.getElementById("behName").value,
        text: document.getElementById("behText").value
    });
    saveDB();
    loadPage("behaviour");
}

let fields = [
    null, null, null,
    null, null, null,
    null, null, null,
];

let currentPlayer = 'circle'; // Spielerwechsel: circle → cross

function handleClick(index, td) {
    if (fields[index]) return;

    fields[index] = currentPlayer;

    if (currentPlayer === 'circle') {
        td.innerHTML = generateCircleSVG();
        currentPlayer = 'cross';
    } else {
        td.innerHTML = generateCrossSVG();
        currentPlayer = 'circle';
    }

    td.onclick = null;

    let result = checkWinner();
    if (result) {
        drawWinningLine(result);
        setTimeout(() => {
            showDialog(result.player);
        }, 600);
    }
}

function render() {
    let html = "<table>";

    for (let i = 0; i < 3; i++) {
        html += "<tr>";
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = "";

            if (fields[index] === "circle") symbol = generateCircleSVG();
            else if (fields[index] === "cross") symbol = generateCrossSVG();

            html += `<td onclick="handleClick(${index}, this)">${symbol}</td>`;
        }
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById("container").innerHTML = html;
}

function generateCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#00b0ef" transform="scale(0)" transform-origin="50 50">
                <animateTransform attributeName="transform" type="scale" from="0" to="1" dur="0.6s" fill="freeze" />
            </circle>
            <circle cx="50" cy="50" r="40" stroke="#00b0ef" stroke-width="8" fill="none" opacity="0">
                <animate attributeName="opacity" from="0" to="1" begin="0.6s" dur="0.2s" fill="freeze" />
            </circle>
        </svg>
    `;
}

function generateCrossSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">
            <line x1="20" y1="20" x2="80" y2="80" stroke="#FFC000" stroke-width="8" stroke-dasharray="84.85" stroke-dashoffset="84.85">
                <animate attributeName="stroke-dashoffset" from="84.85" to="0" dur="0.5s" fill="freeze" />
            </line>
            <line x1="80" y1="20" x2="20" y2="80" stroke="#FFC000" stroke-width="8" stroke-dasharray="84.85" stroke-dashoffset="84.85">
                <animate attributeName="stroke-dashoffset" from="84.85" to="0" begin="0.5s" dur="0.5s" fill="freeze" />
            </line>
        </svg>
    `;
}

// Gewinner prüfen
function checkWinner() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // Reihen
        [0,3,6], [1,4,7], [2,5,8], // Spalten
        [0,4,8], [2,4,6]           // Diagonalen
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return { pattern, player: fields[a] };
        }
    }

    if (!fields.includes(null)) {
        return { pattern: null, player: 'draw' };
    }

    return null;
}

// Gewinnlinie zeichnen
function drawWinningLine(result) {
    if (!result.pattern) return;

    const container = document.getElementById("container");
    const table = container.querySelector("table");
    const tdElements = table.querySelectorAll("td");
    
    const first = tdElements[result.pattern[0]];
    const last = tdElements[result.pattern[2]];

    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.background = "white";
    line.style.height = "5px";
    line.style.transformOrigin = "0 50%";
    line.style.transition = "width 0.5s";

    const rect1 = first.getBoundingClientRect();
    const rect2 = last.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const x1 = rect1.left + rect1.width/2 - containerRect.left;
    const y1 = rect1.top + rect1.height/2 - containerRect.top;
    const x2 = rect2.left + rect2.width/2 - containerRect.left;
    const y2 = rect2.top + rect2.height/2 - containerRect.top;

    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = "0px";
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";
    line.style.transform = `rotate(${angle}deg)`;

    container.appendChild(line);

    setTimeout(() => {
        line.style.width = length + "px";
    }, 50);
}

// Stylischer Dialog
function showDialog(player) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = 1000;

    const dialog = document.createElement("div");
    dialog.style.background = "#fff";
    dialog.style.borderRadius = "15px";
    dialog.style.padding = "30px 40px";
    dialog.style.textAlign = "center";
    dialog.style.fontSize = "22px";
    dialog.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
    dialog.style.maxWidth = "300px";
    dialog.style.color = "#333";
    dialog.style.fontWeight = "600";

    dialog.innerText = player === 'draw' ? "Unentschieden!" : `Spieler ${player === 'circle' ? '1' : '2'} hat gewonnen!`;

    const button = document.createElement("button");
    button.innerText = "OK";
    button.style.marginTop = "20px";
    button.style.padding = "10px 20px";
    button.style.border = "none";
    button.style.background = "#00b0ef";
    button.style.color = "#fff";
    button.style.fontSize = "18px";
    button.style.borderRadius = "10px";
    button.style.cursor = "pointer";
    button.style.transition = "background 0.3s";

    button.onmouseover = () => button.style.background = "#008ac7";
    button.onmouseleave = () => button.style.background = "#00b0ef";

    button.onclick = () => location.reload();

    dialog.appendChild(button);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

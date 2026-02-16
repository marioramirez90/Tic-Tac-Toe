let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'circle';
let scores = { circle: 0, cross: 0 };
let gameActive = true;

function init() {
    render();
    updateScoreDisplay();
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
            html += `<td id="td-${index}" onclick="handleClick(${index})">${symbol}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("container").innerHTML = html;
}

function handleClick(index) {
    if (fields[index] || !gameActive) return;

    fields[index] = currentPlayer;
    const td = document.getElementById(`td-${index}`);
    
    if (currentPlayer === 'circle') {
        td.innerHTML = generateCircleSVG();
        currentPlayer = 'cross';
    } else {
        td.innerHTML = generateCrossSVG();
        currentPlayer = 'circle';
    }

    let result = checkWinner();
    if (result) {
        gameActive = false;
        let roundMessage = "";

        if (result.player !== 'draw') {
            drawWinningLine(result);
            scores[result.player]++;
            updateScoreDisplay();
            // Text für den Gewinner der Runde
            roundMessage = (result.player === 'circle' ? "Spieler 1" : "Spieler 2") + " hat gewonnen!";
        } else {
            // Text für Unentschieden
            roundMessage = "Unentschieden!";
        }
        
        // Zeige das Pop-Up für die Runde
        showRoundResult(roundMessage);

        // Längere Pause (2000ms), damit man das Pop-Up lesen kann
        setTimeout(() => {
            if (scores.circle === 3 || scores.cross === 3) {
                showFinalWinner(result.player);
            } else {
                nextRound(result.player);
            }
        }, 2000);
    }
}

// NEUE FUNKTION: Das temporäre Pop-Up für jede Runde
function showRoundResult(text) {
    const overlay = document.createElement("div");
    overlay.id = "temp-result-overlay";
    // Style passend zum restlichen Design
    overlay.style = `
        position: fixed; 
        top: 15%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background: rgba(15, 23, 42, 0.95); 
        padding: 15px 30px; 
        border-radius: 15px; 
        border: 1px solid var(--accent-blue); 
        color: white; 
        font-weight: bold; 
        font-size: 18px; 
        z-index: 1500; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
    `;
    overlay.innerText = text;
    document.body.appendChild(overlay);

    // Löscht das Pop-Up automatisch kurz bevor die nächste Runde startet
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if(overlay) overlay.remove();
        }, 500);
    }, 1500);
}

function updateScoreDisplay() {
    document.getElementById('points-1').innerText = scores.circle;
    document.getElementById('points-2').innerText = scores.cross;
}

function nextRound(winner) {
    fields = [null, null, null, null, null, null, null, null, null];
    gameActive = true;
    const oldLine = document.querySelector('.winning-line');
    if (oldLine) oldLine.remove();
    // Falls das Overlay noch da sein sollte (Sicherheitsmaßnahme), entfernen
    const oldOverlay = document.getElementById("temp-result-overlay");
    if (oldOverlay) oldOverlay.remove();
    
    render();
}

function resetFullGame() {
    scores = { circle: 0, cross: 0 };
    updateScoreDisplay();
    nextRound();
}

function generateCircleSVG() {
    return `
        <svg width="60" height="60" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" stroke="#00d2ff" stroke-width="10" fill="none" 
                    stroke-dasharray="220" stroke-dashoffset="220">
                <animate attributeName="stroke-dashoffset" from="220" to="0" dur="0.4s" fill="freeze" />
            </circle>
        </svg>`;
}

function generateCrossSVG() {
    return `
        <svg width="60" height="60" viewBox="0 0 100 100">
            <line x1="25" y1="25" x2="75" y2="75" stroke="#ffc000" stroke-width="12" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.3s" fill="freeze" />
            </line>
            <line x1="75" y1="25" x2="25" y2="75" stroke="#ffc000" stroke-width="12" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100">
                <animate attributeName="stroke-dashoffset" from="100" to="0" begin="0.2s" dur="0.3s" fill="freeze" />
            </line>
        </svg>`;
}

function checkWinner() {
    const winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return { pattern, player: fields[a] };
        }
    }
    return fields.includes(null) ? null : { player: 'draw' };
}

function drawWinningLine(result) {
    if (!result.pattern) return;
    const container = document.getElementById("container");
    const tdElements = container.querySelectorAll("td");
    const first = tdElements[result.pattern[0]], last = tdElements[result.pattern[2]];
    const r1 = first.getBoundingClientRect(), r2 = last.getBoundingClientRect(), cR = container.getBoundingClientRect();
    
    const x1 = r1.left + r1.width/2 - cR.left, y1 = r1.top + r1.height/2 - cR.top;
    const x2 = r2.left + r2.width/2 - cR.left, y2 = r2.top + r2.height/2 - cR.top;
    
    const line = document.createElement("div");
    line.className = "winning-line";
    const len = Math.hypot(x2-x1, y2-y1);
    line.style.width = "0px";
    line.style.left = x1 + "px"; line.style.top = y1 + "px";
    line.style.transform = `rotate(${Math.atan2(y2-y1, x2-x1) * 180 / Math.PI}deg)`;
    line.style.transformOrigin = "0 50%";
    container.appendChild(line);
    setTimeout(() => line.style.width = len + "px", 10);
}

function showFinalWinner(player) {
    const winnerName = player === 'circle' ? "SPIELER 1" : "SPIELER 2";
    const overlay = document.createElement("div");
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:2000; backdrop-filter:blur(10px);";
    overlay.innerHTML = `
        <div style="background:#1e293b; padding:40px; border-radius:20px; text-align:center; border:2px solid var(--accent-blue);">
            <h2 style="font-size:40px; margin:0; color:gold;">🏆 CHAMPION!</h2>
            <p style="font-size:24px;">${winnerName} hat das Match gewonnen!</p>
            <button onclick="location.reload()" style="background:var(--accent-blue); border:none; color:white; padding:15px 30px; border-radius:10px; cursor:pointer; font-weight:bold;">NEUES MATCH</button>
        </div>
    `;
    document.body.appendChild(overlay);
}
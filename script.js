let fields = [
    null, null, null,
    null, null, null,
    null, null, null,
];

let currentPlayer = 'circle'; // Spielerwechsel: circle → cross

function handleClick(index, td) {
    // Feld füllen
    fields[index] = currentPlayer;

    // HTML-Code einfügen
    if (currentPlayer === 'circle') {
        td.innerHTML = generateCircleSVG();
        currentPlayer = 'cross'; // Nächster Spieler
    } else {
        td.innerHTML = generateCrossSVG();
        currentPlayer = 'circle'; // Nächster Spieler
    }

    // Klick deaktivieren
    td.onclick = null;
}

function render() {
    let html = "<table>";

    for (let i = 0; i < 3; i++) {
        html += "<tr>";

        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = "";

            if (fields[index] === "circle") {
                symbol = generateCircleSVG();
            } else if (fields[index] === "cross") {
                symbol = generateCrossSVG();
            }

            // td mit onclick
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

            <!-- Füll-Kreis -->
            <circle 
                cx="50" 
                cy="50" 
                r="40"
                fill="#00b0ef"
                transform="scale(0)"
                transform-origin="50 50">
                
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    from="0"
                    to="1"
                    dur="0.6s"
                    fill="freeze" />
            </circle>

            <!-- Outline -->
            <circle 
                cx="50" 
                cy="50" 
                r="40"
                stroke="#00b0ef"
                stroke-width="8"
                fill="none"
                opacity="0">
                
                <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    begin="0.6s"
                    dur="0.2s"
                    fill="freeze" />
            </circle>

        </svg>
    `;
}
function generateCrossSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">

            <!-- Erste Linie des X -->
            <line x1="20" y1="20" x2="80" y2="80"
                  stroke="#FFC000"
                  stroke-width="8"
                  stroke-dasharray="84.85"
                  stroke-dashoffset="84.85">
                <animate
                    attributeName="stroke-dashoffset"
                    from="84.85"
                    to="0"
                    dur="0.5s"
                    fill="freeze" />
            </line>

            <!-- Zweite Linie des X -->
            <line x1="80" y1="20" x2="20" y2="80"
                  stroke="#FFC000"
                  stroke-width="8"
                  stroke-dasharray="84.85"
                  stroke-dashoffset="84.85">
                <animate
                    attributeName="stroke-dashoffset"
                    from="84.85"
                    to="0"
                    begin="0.5s"
                    dur="0.5s"
                    fill="freeze" />
            </line>

        </svg>
    `;
}




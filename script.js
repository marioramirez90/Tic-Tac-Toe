let fields = [
    null,
    null,
    'circle',
    null,
    null,
    'cross',
    null,
    null,
    null,
];

function render() {
    let html = "<table>";

    for (let i = 0; i < 3; i++) {
        html += "<tr>";

        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = "";

            if (fields[index] === "circle") {
                symbol = generateCircleSVG();
            }

            if (fields[index] === "cross") {
                symbol = "X";
            }

            html += `<td>${symbol}</td>`;
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


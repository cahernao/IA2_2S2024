let contenidoArchivo = "";
let a = ""
function procesarArchivo() {
    const fileInput = document.getElementById("fileInput");
    const optionSelected = document.getElementById("ml").value;
    generateOptions();


    if (fileInput.files.length === 0) {
        alert("Por favor, seleccione un archivo");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        contenidoArchivo = e.target.result;

        switch (optionSelected) {
            case "uno":
                optionOne();
                break;
            case "dos":
                optionTwo();
                break;
            default:
                alert("Opcion no valida");
        }

    }

    reader.readAsText(file);
}


function optionOne() {
    const lines = contenidoArchivo.split('\n');

    // Obtener los nombres de las columnas
    const headers = lines[0].trim().split(';');
    const indexXTrain = headers.indexOf('XTrain');
    const indexYTrain = headers.indexOf('YTrain');

    // Crear listas para almacenar los valores
    const XTrain = [];
    const YTrain = [];

    // Iterar sobre cada fila (excepto la primera, que contiene los encabezados)
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(';');
        XTrain.push(parseFloat(row[indexXTrain]));
        YTrain.push(parseFloat(row[indexYTrain]));
    }

    console.log("XTrain:", XTrain);
    console.log("YTrain:", YTrain);

    document.getElementById("log").innerHTML = XTrain;
    document.getElementById("log").innerHTML += YTrain;

    var linear = new LinearRegression()
    linear.fit(XTrain, YTrain)
    yPredict = linear.predict(XTrain)
    document.getElementById("log").innerHTML += '<br>X Train:   ' + XTrain + '<br>Y Train:   ' + YTrain + '<br>Y Predict: ' + yPredict
    a = joinArrays('x', XTrain, 'yTrain', YTrain, 'yPredict', yPredict)

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

}

function optionTwo() {
    let fragmento = contenidoArchivo.slice(0, 50);
    document.getElementById("output").innerHTML += "<h3>Opcion dos</h3><br><b>";
    document.getElementById("output").innerHTML += fragmento;
    document.getElementById("output").innerHTML += "</p>";
}

function generateOptions() {
    const content = document.getElementById("operations");
    content.innerHTML = `
        <button onclick="entrenamiento()">Entrenamiento</button>
        <button onclick="prediccion()">Prediccion</button>
        <button onclick="prediccion()">Tendencias</button>
        <button onclick="graficos()">Graficos</button>
    `;
}



function drawChart() {
    var data = google.visualization.arrayToDataTable(a);
    var options = {
        seriesType: 'scatter',
        series: { 1: { type: 'line' } }
    };
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}    
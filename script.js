let contenidoArchivo = "";
let contenidoDos = "";
let a = ""
let dtSt = [];
//let predi
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
            case "tres":
                optionThree();
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


    var linear = new LinearRegression()
    linear.fit(XTrain, YTrain)
    yPredict = linear.predict(XTrain)
    document.getElementById("log").innerHTML += '<br>X Train:   ' + XTrain + '<br>Y Train:   ' + YTrain + '<br>Y Predict: ' + yPredict
    a = joinArrays('x', XTrain, 'yTrain', YTrain, 'yPredict', yPredict)

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

}

function optionTwo() {
    const lines = contenidoArchivo.split('\n');

    // Obtener los nombres de las columnas
    const headers = lines[0].trim().split(';');
    const indexXTrain = headers.indexOf('XTrain');
    const indexYTrain = headers.indexOf('YTrain');
    const indexXToPredict = headers.indexOf('XToPredict');

    // Crear listas para almacenar los valores
    const xTrain = [];
    const yTrain = [];
    const predictArray = [];

    // Iterar sobre cada fila (excepto la primera, que contiene los encabezados)
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(';');
        xTrain.push(parseFloat(row[indexXTrain]));
        yTrain.push(parseFloat(row[indexYTrain]));
        predictArray.push(parseFloat(row[indexXToPredict]));
    }

    console.log("XTrain:", xTrain);
    console.log("YTrain:", yTrain);
    console.log("Predict:", predictArray);

    var polynomial = new PolynomialRegression();

    polynomial.fit(xTrain, yTrain, 2);
    yPredict = polynomial.predict(predictArray);
    r2 = polynomial.getError();

    polynomial.fit(xTrain, yTrain, 3);
    yPredict2 = polynomial.predict(predictArray);
    r22 = polynomial.getError();

    polynomial.fit(xTrain, yTrain, 4);
    yPredict3 = polynomial.predict(predictArray);
    r23 = polynomial.getError();

    for (let i = 0; i < predictArray.length; i++) {
        yPredict[i] = Number(yPredict[i].toFixed(2));
        yPredict2[i] = Number(yPredict2[i].toFixed(2));
        yPredict3[i] = Number(yPredict3[i].toFixed(2));
    }

    document.getElementById("log").innerHTML += 'Y Prediction Degree 2: [' + yPredict + ']<br>';
    document.getElementById("log").innerHTML += 'Y Prediction Degree 3: [' + yPredict2 + ']<br>';
    document.getElementById("log").innerHTML += 'Y Prediction Degree 4: [' + yPredict3 + ']<br>';
    document.getElementById("log").innerHTML += 'R^2 for Degree 2: ' + Number(r2.toFixed(2)) + '<br>';
    document.getElementById("log").innerHTML += 'R^2 for Degree 3: ' + Number(r22.toFixed(2)) + '<br>';
    document.getElementById("log").innerHTML += 'R^2 for Degree 4: ' + Number(r23.toFixed(2)) + '<br>';

    a = joinArrays('x', xTrain, 'Training', yTrain, 'Prediction Degree 2', yPredict, 'Prediction Degree 3', yPredict2, 'Prediction Degree 4', yPredict3);

    console.log('el valor de a es' + a);

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart2);

    //drawChart2();
}

function generateOptions() {
    const content = document.getElementById("operations");
    content.innerHTML = `
    <input type="file" id="fileInputP" title="Archivo CSV">    
    <button onclick="entrenamiento()">Entrenamiento</button>
        <button onclick="prediccion()">Prediccion</button>
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



//-------------------------------------------               polinomial
function joinArrays() {
    a = []
    if (arguments.length == 10) {
        a.push([arguments[0], arguments[2], arguments[4], arguments[6], arguments[8]]);
        for (var i = 0; i < arguments[1].length; i++) {
            a.push([arguments[1][i], arguments[3][i], arguments[5][i], arguments[7][i], arguments[9][i]]);
        }
    }
    return a;
}

function drawChart2() {
    var data = google.visualization.arrayToDataTable(a);
    var options = {
        seriesType: 'scatter',
        series: {
            1: { type: 'line' },
            2: { type: 'line' },
            3: { type: 'line' }
        }
    };
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}


//-------------------------------------------               polinomial
//-------------------------------------------               arbol de decision

function optionThree() {

    try {
        const lines = contenidoArchivo.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        dtSt = [];
        // Procesar cada línea
        for (let i = 1; i < lines.length - 1; i++) {  // Comienza en 1 y termina en length - 1
            const line = lines[i];
            // Eliminar los corchetes externos si están presentes y separar por comas
            const row = line.replace(/[\[\]]/g, '').split(',').map(item => item.trim().replace(/"/g, ''));
            dtSt.push(row);
        }

        // Muestra la dtSt en la consola y en el HTML
        console.log("dtSt leída:", dtSt);
        //document.getElementById("output").textContent = JSON.stringify(dtSt, null, 2);

    } catch (error) {
        console.error('error al leer archivo' + error);
    }
}

function prediccion() {

    const fileInput = document.getElementById("fileInputP");
    if (fileInput.files.length === 0) {
        alert("Por favor, seleccione un archivo");
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    const predictm = [];
    
    reader.onload = function (e) {
        try {
            contenidoDos = e.target.result;
            const lines = contenidoDos.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            // Procesar cada línea, excluyendo la primera y última
            for (let i = 1; i < lines.length - 1; i++) {  
                const line = lines[i];
                const row = line.replace(/[\[\]]/g, '').split(',').map(item => item.trim().replace(/"/g, ''));
                predictm.push(row);
            }

            console.log("Archivo de predicción:", predictm);

        } catch (error) {
            console.log('Error al leer archivo:', error);
        }
    };
    reader.readAsText(file);

    let dTree = new DecisionTreeID3(dtSt);
    let root = dTree.train(dTree.dataset);
    let predict = dTree.predict(predictm, root);

    const objt = {
        dotStr: dTree.generateDotString(root),
        predictNode: predict
    };

    document.getElementById("log").innerHTML += '<br>Arbol de decision: <br>' + objt.dotStr + '<br>';

    //renderTree(objt.dotStr);  

    /*const fileInput = document.getElementById("fileInputP");
    if (fileInput.files.length === 0) {
        alert("Por favor, seleccione un archivo");
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    const predictm = [];
    reader.onload = function (e) {

        try {
            contenidoDos = e.target.result;
            const lines = contenidoDos.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            // Procesar cada línea
            for (let i = 1; i < lines.length - 1; i++) {  // Comienza en 1 y termina en length - 1
                const line = lines[i];
                // Eliminar los corchetes externos si están presentes y separar por comas
                const row = line.replace(/[\[\]]/g, '').split(',').map(item => item.trim().replace(/"/g, ''));
                predictm.push(row);
            }

            // Muestra la dtSt en la consola y en el HTML
            console.log("--- leída:", predictm);

        } catch (error) {
            console.log('error al leer archivo' + error);

        }

    }
    reader.readAsText(file);

    let dTree = new DecisionTreeID3(dtSt);
    let root = dTree.train(dTree.dataset);
    let predict = dTree.predict(predictm, root);

    const objt = {
        dotStr: dTree.generateDotString(root),
        predictNode: predict
    };

    var chart = document.getElementById("chart_div");
        var {
            dotStr,
            predictNode
        } = this.testWithChart()
        //console.log(predictNode);
        var parsDot = vis.network.convertDot(dotStr);
        var data = {
            nodes: parsDot.nodes,
            edges: parsDot.edges
        }
        var options = {
            layout: {
                hierarchical: {
                    levelSeparation: 100,
                    nodeSpacing: 100,
                    parentCentralization: true,
                    direction: 'UD', // UD, DU, LR, RL
                    sortMethod: 'directed', // hubsize, directed
                    //shakeTowards: 'roots' // roots, leaves                        
                },
            },
        };
        var network = new vis.Network(chart, data, options);*/


}

function renderTree(dotStr) {
    const chart = document.getElementById("chart_div");
    const parsedDot = vis.network.convertDot(dotStr);

    const data = {
        nodes: parsedDot.nodes,
        edges: parsedDot.edges
    };
    const options = {
        layout: {
            hierarchical: {
                levelSeparation: 100,
                nodeSpacing: 100,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed'
            },
        },
    };
    new vis.Network(chart, data, options);
}

/**
 * function procesarArchivo() {
    const fileInput = document.getElementById("fileInput");
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
            case "tres":
                optionThree();
                break;
            default:
                alert("Opcion no valida");
        }

    }

    reader.readAsText(file);
}

 */
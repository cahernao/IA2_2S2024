let contenidoArchivo="";
function procesarArchivo(){
    const fileInput = document.getElementById("fileInput");
    const optionSelected=document.getElementById("ml").value;
    generateOptions();
    

    if(fileInput.files.length===0){
        alert("Por favor, seleccione un archivo");
        return;
    }

    const file=fileInput.files[0];
    const reader=new FileReader();

    reader.onload = function(e){
        contenidoArchivo=e.target.result;

        switch(optionSelected){
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


function optionOne(){
    let fragmento;
    document.getElementById("output").innerHTML+="<h3>Opcion uno</h3><br><i>";
    fragmento=contenidoArchivo.slice(0,100);
    document.getElementById("output").innerHTML+=fragmento;
    document.getElementById("output").innerHTML+="</i>";
}

function optionTwo(){
    let fragmento= contenidoArchivo.slice(0,50);
    document.getElementById("output").innerHTML+="<h3>Opcion dos</h3><br><b>";
    document.getElementById("output").innerHTML+=fragmento;
    document.getElementById("output").innerHTML+="</p>";
}

function generateOptions(){
    const content = document.getElementById("operations");
    content.innerHTML = `
        <button onclick="entrenamiento()">Entrenamiento</button>
        <button onclick="prediccion()">Prediccion</button>
        <button onclick="graficos()">Graficos</button>
    `;
}
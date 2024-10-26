function procesarArchivo(){
    const fileInput = document.getElementById("fileInput");
    const optionSelected=document.getElementById("ml").value;
    const output = document.getElementById("output");

    if(fileInput.files.length===0){
        alert("Por favor, seleccione un archivo");
        return;
    }

    const file=fileInput.files[0];
    const reader=new FileReader();

    reader.onload = function(e){
        const contenido=e.target.result;

        switch(optionSelected){
            case "uno":
                optionOne(contenido);
                break;
            case "dos":
                optionTwo(contenido);
                break;
            default:
                alert("Opcion no valida");
        }
        
    }

    reader.readAsText(file);
}


function optionOne(contenido){
    let fragmento;
    document.getElementById("output").innerHTML+="<h3>Opcion uno</h3><br><i>";
    fragmento=contenido.slice(0,100);
    document.getElementById("output").innerHTML+=fragmento;
    document.getElementById("output").innerHTML+="</i>";
}

function optionTwo(contenido){
    let fragmento= contenido.slice(0,50);
    document.getElementById("output").innerHTML+="<h3>Opcion dos</h3><br><b>";
    document.getElementById("output").innerHTML+=fragmento;
    document.getElementById("output").innerHTML+="</p>";
}
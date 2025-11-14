class Circuito {

    constructor() {
        this.comprobarApiFile()
        document.querySelector("input").addEventListener("change", this.leerArchivoHTML.bind(this))
    }

    comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob)  {
            //SOPORTA LA API
        } else {
            //no la soporta
            //TODO mostrar mensaje al usuario en forma de párrafo
        }
    }

    leerArchivoHTML() {
        let file = document.querySelector("input").files[0]

        let reader = new FileReader()
        reader.onload = (event) => {
            this.#processDOM(reader.result)
        }
        if(file && file.name.endsWith(".html")) {
            reader.readAsText(file)
        } else {
            //TODO error al leer el archivo
        }
    }

    #processDOM(htmlText) {
        //TODO comprobar errores
        let section = document.createElement("section")
        let parsedDocument = new DOMParser().parseFromString(htmlText, "text/html")
        for (let element of parsedDocument.querySelectorAll("section > *")) {
            section.appendChild(element)
        }
        document.querySelector("main").appendChild(section)
    }  
}


class CargadorSVG {
    leerArchivoSVG() {

    }


    insertarSVG() {
        
    }
}
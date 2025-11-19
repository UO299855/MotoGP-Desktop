class Circuito {
    #input
    #errorP

    constructor() {
        this.#comprobarApiFile()        
    }

    #comprobarApiFile() {
        let section = $("<section></section>").appendTo("main")
        $("<h3>Cargar información del circuito</h3>").appendTo(section)
        if (window.File && window.FileReader && window.FileList && window.Blob)  {
            //SOPORTA LA API
            // Pasamos de JQuery a HTML puro
            this.#input = $('<input type="file" accept=".html"/>').appendTo(section)[0]
            this.#input.addEventListener("change", this.#leerArchivoHTML.bind(this))
        } else {
            const errorStr = "Error: parece que su navegador no soporta la funcionalidad necesaria para poder cargar información sobre el circuito."
            $(`<p>${errorStr}</p>`).appendTo(section)
        }
    }

    /**
     * Borra el mensaje de error en caso de haberlo
     */
    #removeErorP() {
        if(this.#errorP != null) {
                this.#errorP.remove()
                this.#errorP = null
        }
    }

    #showErrorP(errorStr) {
        if(this.#errorP == null) {
            this.#errorP = $(`<p>${errorStr}</p>`)
            $(this.#input).after(this.#errorP)
        } else {
            this.#errorP.text(errorStr)
        }
    }

    #leerArchivoHTML() {
        let file = this.#input.files[0]
        let reader = new FileReader()
        reader.onload = (event) => {
            this.#processDOM(reader.result)
        }
        if(file) {
            console.log(file.type) //TODO quitar
            reader.readAsText(file)
            this.#removeErorP()
        } else {
            this.#showErrorP(`Error al leer ${file.name}. Escoja un archivo válido.`)
        }
    }

    #processDOM(htmlText) {
        //TODO comprobar errores
        // TODO hacer que solo se pueda incrustar un HTML a la vez
        let article = document.createElement("article")
        let parsedDocument = new DOMParser().parseFromString(htmlText, "text/html")
        for (let element of parsedDocument.querySelectorAll("section > *")) {
            article.appendChild(element)
        }
        $(this.#input).after($(article))
    }  
}


class CargadorSVG {
    #input

    //  Comprobamos que soporte la API file
    constructor() {
        let section = $("<section></section>").appendTo("main")
        $("<h3>Cargar altimetría del circuito</h3>").appendTo(section)
        if (window.File && window.FileReader && window.FileList && window.Blob)  {
            //SOPORTA LA API
            // Pasamos de JQuery a HTML puro
            this.#input = $('<input type="file" accept=".svg"/>').appendTo(section)[0]
            this.#input.addEventListener("change", this.#leerArchivoSVG.bind(this))
        } else {
            const errorStr = "Error: parece que su navegador no soporta la funcionalidad necesaria para cargar la altimetría del circuito."
            $(`<p>${errorStr}</p>`).appendTo(section)
        }
    }

    #leerArchivoSVG() {
        let file = this.#input.files[0]
        let reader = new FileReader()
        reader.onload = (event) => {
            this.#insertarSVG(reader.result)
        }
        reader.readAsText(file)
    }


    #insertarSVG(dataText) {
        const svgElement = new DOMParser().parseFromString(dataText, 'image/svg+xml').documentElement
        $(this.#input).after($(svgElement))
    }
}
class Circuito {
    #input
    #errorP
    #article

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
        if(file && file.type == "text/html") {
            reader.readAsText(file)
            this.#removeErorP()
        } else {
            this.#showErrorP(`Error al leer ${file.name}. Escoja un archivo válido.`)
        }
    }

    #processDOM(htmlText) {
        //TODO comprobar errores
        if(this.#article == null) {
            this.#article = document.createElement("article")
            $(this.#input).after($(this.#article))
        } else {
            this.#article.innerHTML = ""
        }
        let parsedDocument = new DOMParser().parseFromString(htmlText, "text/html")
        for (let element of parsedDocument.querySelectorAll("section > *")) {
            this.#article.appendChild(element)
        }
    }  
}


class CargadorSVG {
    #input
    #section

    //  Comprobamos que soporte la API file
    constructor() {
        let section = $("<section></section>").appendTo("main")
        $("<h3>Cargar altimetría del circuito</h3>").appendTo(section)
        if (window.File && window.FileReader && window.FileList && window.Blob)  {
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
        if(this.#section == null) {
            this.#section = document.createElement("section")
            $(this.#input).after($(this.#section))
        } else {
            this.#section.innerHTML = ""
        }
        const svgElement = new DOMParser().parseFromString(dataText, 'image/svg+xml').documentElement
        this.#section.appendChild(svgElement)
    }
}


class CargadorKML {
    #input
    #div

    constructor() {
        let section = $("<section></section>").appendTo("main")
        $("<h3>Cargar coordenadas del circuito</h3>").appendTo(section)
        if (window.File && window.FileReader && window.FileList && window.Blob)  {
            this.#input = $('<input type="file" accept=".kml"/>').appendTo(section)[0]
            this.#input.addEventListener("change", this.#leerArchivoKML.bind(this))
        } else {
            const errorStr = "Error: parece que su navegador no soporta la funcionalidad necesaria para cargar la altimetría del circuito."
            $(`<p>${errorStr}</p>`).appendTo(section)
        }
    }

    #leerArchivoKML() {
        let file = this.#input.files[0]
        let reader = new FileReader()
        reader.onload = (event) => {
            this.#insertarCapaKML(reader.result)
        }
        reader.readAsText(file)
    }

    #insertarCapaKML(kmlText) {
        if(this.#div == null) {
            this.#div = document.createElement("div")
            $(this.#input).after($(this.#div))
        } else {
            this.#div.innerHTML = ""
        }
        const map = new google.maps.Map(this.#div, {
            zoom: 8,
            center: { lat: 43.3619, lng: -5.8494 }, // Centro aproximado de Asturias
        });

        const asturiasPath = [
            { lat: 43.3603, lng: -5.8448 }, // Oviedo
            { lat: 43.3500, lng: -5.1333 }, // Cangas de Onís
            { lat: 43.5420, lng: -5.6624 }, // Gijón
            { lat: 43.5566, lng: -5.9215 }, // Avilés  
            { lat: 43.5443, lng: -6.5379 }, // Luarca
            { lat: 43.3603, lng: -5.8448 }, // Oviedo
        ];

        const polyline = new google.maps.Polyline({
            path: asturiasPath,
            geodesic: true,
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 4,
        });

        polyline.setMap(map);
    
    }
}
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
        if (window.File && window.FileReader && window.FileList)  {
            const label = $('<label for="cargarHTML">Seleccionar HTML del circuito</label>').appendTo(section)
            this.#input = $('<input id="cargarHTML" type="file" accept=".html"/>')[0]
            label.after($(this.#input))
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
            const label = $('<label for="cargarSVG">Seleccionar SVG de altimetría</label>').appendTo(section)
            this.#input = $('<input id="cargarSVG" type="file" accept=".svg"/>')[0]
            label.after($(this.#input))

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
        if (window.File && window.FileReader && window.FileList)  {
            const label = $('<label for="cargarKML">Seleccionar KML de planimetría</label>').appendTo(section)
            this.#input = $('<input id="cargarKML" type="file" accept=".kml"/>')[0]
            label.after($(this.#input))
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

        const nameSpace = "http://www.opengis.net/kml/2.2"
        const nsResolver = prefix => nameSpace;
        let parsedDocument = new DOMParser().parseFromString(kmlText, "application/xml")
        const origen = parsedDocument.evaluate("//ns:Placemark/ns:Point/ns:coordinates",
            parsedDocument, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        console.log(origen)
        const origen_coords = origen.textContent.split(",")

        const map = new google.maps.Map(this.#div, {
            zoom: 16,
            center: {
                lng : parseFloat(origen_coords[0].trim()),
                lat : parseFloat(origen_coords[1].trim())
        }})
        
        const lineStringIterator = parsedDocument.evaluate("//ns:LineString/ns:coordinates", parsedDocument,
            nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)

        let coords;
        while(coords = lineStringIterator.iterateNext()) {
            let path = []
            const lines = coords.textContent.trim().split("\n")
            for(let line of lines) {
                const tokens = line.split(",")
                path.push({
                    lng : parseFloat(tokens[0].trim()),
                    lat : parseFloat(tokens[1].trim())
                })
            }
            const polyline = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 4})
            polyline.setMap(map)
        }
    }
}
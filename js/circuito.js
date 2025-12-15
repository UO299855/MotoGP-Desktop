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
        } else {
            this.#showErrorP(`Error al leer ${file.name}. Escoja un archivo válido.`)
        }
    }

    #replaceHeader(element, newLevel) {
        let newHeader = document.createElement(`h${newLevel}`)
        // Anexamos los hijos en orden
        while(element.firstChild) {
            // Según la documentación de Mozilla, al hacer append de un nodo existente, se mueve de su posición antigua a la nueva
            newHeader.appendChild(element.firstChild)
        }
        // No aseguramos de que los atributos son los mismos
        for (let attribute of element.attributes) {
            newHeader.setAttribute(attribute.name, attribute.value)
        }
        return newHeader
    }

    #processDOM(htmlText) {
        let parsedDocument = new DOMParser().parseFromString(htmlText, "text/html")
        const parseError = parsedDocument.querySelector("parsererror");
        if(parseError) {
            this.#showErrorP("El archivo seleccionado contiene HTML no válido. Por favor, seleccione otro archivo.")
        } else {
            this.#removeErorP()
        }
        const elements = parsedDocument.querySelectorAll("section > *")
        if(elements.length <= 0) {
            return this.#showErrorP("El HTML está vacío. Por favor, escoja otro archivo.")
        }
        if(this.#article == null) {
            this.#article = document.createElement("article")
            $(this.#input).after($(this.#article))
        } else {
            this.#article.innerHTML = ""
        }
        for (let element of elements) {
            // Bajamos los niveles de encabezado si fuese necesario
            const headerMatch = element.tagName.toLowerCase().match(/^h([1-6])$/) // es de la forma hi con i=1,...,6
            if(headerMatch) {
                const headerLevel = parseInt(headerMatch[1]) // parseamos el patrón que encaja para tratarlo como entero
                const newLevel = Math.min(headerLevel + 1, 6)
                element = this.#replaceHeader(element, newLevel)
            }
            this.#article.appendChild(element)
        }
    }  
}


class CargadorSVG {
    #input
    #svgHtmlElement
    #errorP


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

    #showErrorP(errorStr) {
        if(this.#errorP == null) {
            this.#errorP = $(`<p>${errorStr}</p>`)
            $(this.#input).after(this.#errorP)
        } else {
            this.#errorP.text(errorStr)
        }
    }

    #removeErorP() {
        if(this.#errorP != null) {
                this.#errorP.remove()
                this.#errorP = null
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
        const parsedDocument = new DOMParser().parseFromString(dataText, 'image/svg+xml')
        const parseError = parsedDocument.querySelector("parsererror");
        if(parseError) {
            return this.#showErrorP("El archivo seleccionado no es un SVG válido. Por favor, seleccione otro archivo.")
        } else {
            this.#removeErorP()
        }

        if(this.#svgHtmlElement == null) {
            this.#svgHtmlElement = document.createElement("svg")
            $(this.#input).after($(this.#svgHtmlElement))
        }
        const svgElement = parsedDocument.documentElement
        svgElement.setAttribute("version", "1.1")
        $(this.#svgHtmlElement).replaceWith(svgElement)
        this.#svgHtmlElement = svgElement
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
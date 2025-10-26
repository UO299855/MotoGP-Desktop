class Ciudad {
    //Hemos de declarar los atributos primero si queremos hacerlos privados
    #nombre
    #pais
    #gentilicio
    #poblacion
    #latitud
    #longitud

    /**
     * Constructor de la clase Ciudad
     * @param {string} nombre 
     * @param {string} pais 
     * @param {string} gentilicio 
     */
    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre
        this.#pais = pais
        this.#gentilicio = gentilicio
    }

    /**
     * @returns Devuelve el nombre de la ciudad
     */
    getNombre() {
        return this.#nombre
    }

    /**
     * 
     * @returns Devuelve el nombre del país
     */
    getPais() {
        return this.#pais
    }

    /**
     * Rellena los siguientes campos
     * @param {number} poblacion
     * @param {number} latitud 
     * @param {number} longitud 
     */
    setSecondaryInfo(poblacion, latitud, longitud) {
        this.#poblacion = poblacion
        this.#latitud = latitud
        this.#longitud = longitud
    }

    /**
     * Devuelve la información secundaria de la ciudad
     * @returns <ul><li>*gentilicio*</li><li>*población*</li></ul>
     */
    getSecondaryInfo() {
        return `<ul><li>Gentilicio: ${this.#gentilicio}</li><li>Población: ${this.#poblacion}</li></ul>`
    }

    /**
     * Convierte unas coordenadas en grados (decimal) a grados, minutos y segundos
     * Los grados y minutos se truncan, mientras que los segundos se redondean
     * El signo viene determinado por el de los grados (afecta a las tres componentes)
     * @param {number} coords Coordenadas en formato decimal
     * @returns [degrees, minutes, seconds]
     */
    #parseCoords(coords) {
        const degs = Math.trunc(coords)
        const mins = 60*(Math.abs(coords - degs)) //Usamos Math.abs para que mins y secs sean positivos
        const secs = 60 * (mins - Math.trunc(mins))
        return [degs, Math.trunc(mins), Math.round(secs)]
    }

    /**
     * Escribe las coordenadas del punto elegido en el documento
     * Sigue el formato '<p>*longitud* *latitud*</p>'
     */
    writeCoords() {
        const [degsLat, minsLat, secsLat] = this.#parseCoords(this.#latitud)
        const letraLat = degsLat > 0 ? "N" : "S"
        const [degsLong, minsLong, secsLong] = this.#parseCoords(this.#longitud)
        const letraLong = degsLong > 0 ? "E" : "W"
        // Como ahora usamos letras para determinar el signo de los grados,
        // usamos Math.abs en degsLat y degsLong
        document.write(`<p>Está localizada en las coordenadas ${Math.abs(degsLat)}°${minsLat}'${secsLat}''${letraLat} ${Math.abs(degsLong)}°${minsLong}'${secsLong}''${letraLong}<p>`)
    }
}

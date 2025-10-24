class Ciudad {
    /**
     * Constructor de la clase Ciudad
     * @param {string} nombre 
     * @param {string} pais 
     * @param {string} gentilicio 
     */
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre
        this.pais = pais
        this.gentilicio = gentilicio
    }

    /**
     * @returns Devuelve el nombre de la ciudad
     */
    getNombre() {
        return this.nombre
    }

    /**
     * 
     * @returns Devuelve el nombre del país
     */
    getPais() {
        return this.pais
    }

    /**
     * Rellena los siguientes campos
     * @param {number} poblacion
     * @param {number} latitud 
     * @param {number} longitud 
     */
    setSecondaryInfo(poblacion, longitud, latitud) {
        this.poblacion = poblacion
        this.latitud = latitud
        this.longitud = longitud
    }

    /**
     * Devuelve la información secundaria de la ciudad
     * @returns <ul><li>*gentilicio*</li><li>*población*</li></ul>
     */
    getSecondaryInfo() {
        return `<ul><li>${this.nombre}</li><li>${this.gentilicio}</li></ul>`
    }

    /**
     * Escribe las coordenadas del punto elegido en el documento
     * Sigue el formato '<p>*longitud* *latitud*</p>'
     */
    writeCoords() {
        document.write("<p>" + this.longitud + " " + this.latitud + "</p>");
    }
}

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
    setSecondaryInfo(poblacion, latitud, longitud) {
        this.poblacion = poblacion
        this.latitud = latitud
        this.longitud = longitud
    }

    /**
     * Devuelve la información secundaria de la ciudad
     * @returns <ul><li>*gentilicio*</li><li>*población*</li></ul>
     */
    getSecondaryInfo() {
        return `<ul><li>Gentilicio: ${this.gentilicio}</li><li>Población: ${this.poblacion}</li></ul>`
    }

    /**
     * Escribe las coordenadas del punto elegido en el documento
     * Sigue el formato '<p>*longitud* *latitud*</p>'
     */
    writeCoords() {
        const tabla = document.createElement("table")
        const filaLat = tabla.appendChild(document.createElement("tr"))
        const headerLat = filaLat.appendChild(document.createElement("th"))
        headerLat.textContent = "Latitud"
        const dataLat = filaLat.appendChild(document.createElement("td"))
        dataLat.textContent = this.latitud

        const filaLong = tabla.appendChild(document.createElement("tr"))
        const headerLong = filaLong.appendChild(document.createElement("th"))
        headerLong.textContent = "Longitud"
        const dataLong = filaLong.appendChild(document.createElement("td"))
        dataLong.textContent = this.longitud        
        
        document.currentScript.parentNode.insertBefore(tabla, document.currentScript);
    }
}

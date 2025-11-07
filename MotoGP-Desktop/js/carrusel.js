class  Carrusel {
    #busqueda
    #actual
    #maximo

    constructor() {
        this.#busqueda = "término de búsqueda en Flickr" //TODO cambiar al término real
        this.#actual = 0
        this.#maximo = 4
    }

    getFotografias() {
        $.ajax({
            dataType: "json",
            url: this.url,
            method: "GET",
            success: this.procesarJSONFotografias
        })
    }

    /**
     * Extrae la información de (1 + #this.maximo) fotografías del JSON devuelto por la API
     */
    procesarJSONFotografias() {

    }
}
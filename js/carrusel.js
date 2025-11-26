class  Carrusel {
    #busqueda
    #actual
    #maximo
    #fotos

    constructor() {
        this.#busqueda = "pertamina, circuit"
        this.#actual = 0
        this.#maximo = 4
        this.#fotos = new Array()
    }

    getFotografias() {
        $.ajax({
            url: "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
            dataType: "json",
            method: "GET",
            success: this.#procesarJSONFotografias.bind(this),
            error: this.#handleError,
            data: {
                tags: this.#busqueda,
                tagmode: "all",
                format: "json"
            }
        })
    }

    /**
     * Extrae la información de (this.#maximo + 1) fotografías del JSON devuelto por la API
     */
    #procesarJSONFotografias(data) {
        $.each(data.items, (i, item) => {
            this.#fotos[i] = {
                src: item.media.m.replace("_m.jpg", "_z.jpg"),
                alt: item.title
            }
            if(i == this.#maximo) {
                return false
            }
        })
        this.#mostrarFotografias()
    }

    #handleError() {
        $("main").append("<article><h2>Imágenes del circuito de Pertamina Mandalika</h2><p>Error: No se han podido cargar las imágenes</p></article>")
    }
    
    #mostrarFotografias() {
        $("main").append("<article><h2>Imágenes del circuito de Pertamina Mandalika</h2><img/></article>") 
        this.#cambiarFotografias()
        setInterval(this.#cambiarFotografias.bind(this), 3000)
    }

    #cambiarFotografias() {
        $("img").attr("src", this.#fotos[this.#actual].src)
        $("img").attr("alt", this.#fotos[this.#actual].alt)
        $("img").attr("title", this.#fotos[this.#actual].alt)
        if(++this.#actual > this.#maximo) {
            this.#actual = 0
        }
    }
}
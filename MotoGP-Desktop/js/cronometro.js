class Cronometro {
    #inicio
    #tiempo
    #corriendo

    constructor() {
        this.#tiempo = 0
    }

    arrancar() {
        try {
            this.#inicio = Temporal.instant().epochMilliseconds
        } catch(err) {
            this.#inicio = Date.now()
        }
        //Llamada a 'actualizar()' con el contexto del cronómetro cada décima de segundo
        if(this.#corriendo == null) {   
            this.#corriendo = setInterval(this.actualizar.bind(this), 100)
        }
    }

    actualizar() {
        try {
            this.#tiempo = Temporal.instant().epochMilliseconds - this.#inicio
        }catch(err) {
            this.#tiempo = Date.now() - this.#inicio
        }
        this.mostrar()
    }

    reiniciar() {
        this.parar()
        this.#tiempo = 0
        this.mostrar()
    }

    parar() {
        if(this.#corriendo != null) {
            clearInterval(this.#corriendo)
            this.#corriendo = null
        }
    }

    _formatTwoPlaceNumber(quantity) {
        return `${quantity < 10 ? "0" : ""}${quantity}`;
    }

    /**
     * Escribe los datos del cronómetro en el primer párrafo hijo del elemento <main>
     */
    mostrar() {
        const parrafo = document.querySelector("main p"); //querySelector ya toma el primero, no hay que añadir ":first-of-type"
        const minutos = Math.floor(this.#tiempo / 60000); //truncamos
        const segundos = Math.floor(this.#tiempo/1000 - 60 * minutos);
        const decimas = Math.floor((this.#tiempo - 60000 * minutos - 1000*segundos)/100);
        parrafo.textContent = `${this._formatTwoPlaceNumber(minutos)}:${this._formatTwoPlaceNumber(segundos)}.${decimas}`
    }
}
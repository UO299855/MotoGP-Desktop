class Memoria {
    #tablero_bloqueado
    #primera_carta
    #segunda_carta
    
    constructor() {
        this.reiniciarAtributos()
        
        /**
         * Registra el listener de evento de click pertinente para las cartas
         */
        const cartas = document.querySelectorAll("article");
        for(let i = 0; i < cartas.length; i++) {
            cartas[i].onclick = this.flipCard.bind(cartas[i], cartas[i])
        }
    }

    /**
     * Le da la vuelta a la carta que se pasa como parámetro
     * @param {Element} card Carta parámetro
     */
    flipCard(card) {
        console.log(card) //TODO borrar el logeo
        card.setAttribute("data-estado", "volteada")
    }

    reiniciarAtributos() {
        this.#tablero_bloqueado = true
        this.#primera_carta = null
        this.#segunda_carta = null
    }

    barajarCartas() {
        let cartas = Array.from(document.querySelectorAll("article"))
        const main = document.querySelector("main")
        for(let i = 0; i < cartas.length; i++) {
            let rIndex = Math.floor(Math.random() * (cartas.length - i))
            let eliminada = cartas.splice(rIndex, 1)[0];
            main.appendChild(eliminada)
        }
    }

    deshabilitarCartas() {
        this.#primera_carta.setAttribute("data-estado", "revelada")
        this.#segunda_carta.setAttribute("data-estado", "revelada")
        this.comprobarJuego()
        this.reiniciarAtributos()
    }

    comprobarJuego() {
        return 12 == document.querySelectorAll("main article[data-estado=revelada]").length
    }
}
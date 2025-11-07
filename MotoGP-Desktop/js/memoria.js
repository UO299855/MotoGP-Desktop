class Memoria {
    #tablero_bloqueado
    #primera_carta
    #segunda_carta
    #reveladas
    #cronometro
    
    constructor() {
        this.#reveladas = 0
        this.#reiniciarAtributos()
        this.#barajarCartas()
        
        /* Registra el listener de evento de click pertinente para las cartas */
        const cartas = document.querySelectorAll("article");
        for(let i = 0; i < cartas.length; i++) {
            cartas[i].onclick = this.#voltearCarta.bind(this, cartas[i])
        }

        /* Comienza a cronometrar la partida */
        this.#cronometro = new Cronometro()
        this.#cronometro.arrancar()
    }


    #puedeVoltearse(card) {
        return card.getAttribute("data-estado") != "volteada" && card.getAttribute("data-estado") != "revelada"
    }

    /**
     * Le da la vuelta a la carta que se pasa como parámetro
     * @param {Element} card Carta parámetro
     */
    #voltearCarta(card) {
        if(!this.#tablero_bloqueado && this.#puedeVoltearse(card)) {
            card.setAttribute("data-estado", "volteada")
            if(this.#primera_carta == null) {
                this.#primera_carta = card
            } else {
                this.#segunda_carta = card
                this.#tablero_bloqueado = true
                this.#comprobarPareja()
            }
        }
    }

    #reiniciarAtributos() {
        this.#tablero_bloqueado = false
        this.#primera_carta = null
        this.#segunda_carta = null
    }

    #barajarCartas() {
        let cartas = Array.from(document.querySelectorAll("article"))
        const main = document.querySelector("main")
        while(cartas.length > 0) {
            let rIndex = Math.floor(Math.random() * (cartas.length))
            let eliminada = cartas.splice(rIndex, 1)[0];
            main.appendChild(eliminada)
        }        
    }

    #deshabilitarCartas() {
        this.#primera_carta.setAttribute("data-estado", "revelada")
        this.#segunda_carta.setAttribute("data-estado", "revelada")
        this.#reveladas += 2
        this.#comprobarJuego()
        this.#reiniciarAtributos()
    }

    #comprobarJuego() {
        if (this.#reveladas == 12) {
            this.#cronometro.parar()
        }
    }

    #cubrir() {        
        this.#primera_carta.removeAttribute("data-estado")
        this.#segunda_carta.removeAttribute("data-estado")
        this.#reiniciarAtributos()
    }

    #cubrirCartas() {
        setTimeout(this.#cubrir.bind(this), 1500)
    }

    #comprobarPareja() {
        if (this.#primera_carta.children.item(1).getAttribute("alt") == this.#segunda_carta.children.item(1).getAttribute("alt")) {
            // Si son iguales
            this.#deshabilitarCartas()
        } else {
            // Si son distintas
            this.#cubrirCartas()
        }
    }
}
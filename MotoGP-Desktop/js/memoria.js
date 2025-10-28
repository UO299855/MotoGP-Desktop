class Memoria {
    constructor() {
        /**
         * Registra el listener de evento de click pertinente para las cartas
         */
        const cartas = document.querySelectorAll("article");
        for(let i = 0; i < cartas.length; i++) {
            cartas[i].onclick = this.flipCard
        }
    }

    /**
     * Le da la vuelta a la carta que se pasa como parámetro
     * @param {Element} card Carta parámetro
     */
    flipCard(card) {
        console.log(this)
        card.setAttribute("data-state", "flip")
    }
}
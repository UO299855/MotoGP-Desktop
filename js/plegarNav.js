class Plegar {
    #button
    #nav
    #visible
    
    constructor() {
        this.#nav = document.querySelector("header > nav")
        this.#button = document.querySelector("header button")
        this.#button.addEventListener("click", this.#toggle.bind(this))

        // Garantizamos la adaptabilidad si se redimensiona la ventana
        let matchMedia = window.matchMedia("(min-width: 320px) and (max-width: 799px)")
        matchMedia.addEventListener("change", this.#resize.bind(this))
    }

    /** Muestra u oculta el menú de navegación (nav del header) al pulsar el botón*/
    #toggle() {
        this.#nav.style.display =  this.#nav.checkVisibility()?"none":"flex"
    }

    /** Muestra u oculta el menú de navegación al redimensionar la ventana */
    #resize(e) {
        // e.matches devuelve true si el documento cumple la mediaquery inicial
        this.#nav.style.display =  e.matches ? "none" : "flex"
    }
}
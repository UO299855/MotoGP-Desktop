class Plegar {
    #button
    #nav
    #expanded
    
    constructor() {
        this.#nav = document.querySelector("header > nav")
        this.#button = document.querySelector("header button")
        this.#button.addEventListener("click", this.#toggle.bind(this))
        // Garantizamos la adaptabilidad si se redimensiona la ventana
        let matchMedia = window.matchMedia("(min-width: 320px) and (max-width: 799px)")
        matchMedia.addEventListener("change", this.#resize.bind(this))

        this.#expanded = matchMedia.matches
        this.#toggle()
    }

    /** Muestra u oculta el menú de navegación (nav del header) al pulsar el botón*/
    #toggle() {
        this.#expanded = !this.#expanded
        this.#nav.setAttribute("aria-expanded", this.#expanded)
    }

    /** Muestra u oculta el menú de navegación al redimensionar la ventana */
    #resize(e) {
        // e.matches devuelve true si el documento cumple la mediaquery
        this.#expanded =  e.matches
        this.#toggle()
    }
}
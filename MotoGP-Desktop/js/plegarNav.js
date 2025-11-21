class Plegar {
    #button
    #nav
    constructor() {
        this.#nav = document.querySelector("header > nav")
        this.#button = document.querySelector("header > button")
        this.#button.addEventListener("click", this.#toggle.bind(this))
    }

    #toggle() {
        console.log("Se ha pulsado")
    }
}
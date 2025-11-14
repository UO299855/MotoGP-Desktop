class Noticias {
    #busqueda
    #url
    #apiToken

    constructor() {
        this.#busqueda = "motogp"
        //fijamos los parámetros que no cambian
        this.#url = "https://api.thenewsapi.com/v1/news/top?language=es&locale=es&api_token=UGm8GawUbdgZgltP4aZ7oGUsyNDlvy4fkxEY2Jvc"
        this.#apiToken = "DfRz2479o3NkwfZrUmhJwbyxrll6RaBUXuDhFlgm"
    }

    async buscar() {
        try {
            const respuesta = await fetch(`${this.#url}&search=${this.#busqueda}`)
            if (!respuesta.ok) {
                this.#procesarError
            }
            this.#procesarInformacion(await respuesta.json())
        } catch(error) {
            this.#procesarError()
        }

    }

    #procesarError() {
        console.log("se ha producido un error")
        header.after(section)
    }

    #procesarInformacion(newsAnswer) {
        let section = $("<section></section>").appendTo($("main"))
        $("<h2>Noticias de MotoGP</h2>").appendTo(section)
        for(let news of newsAnswer.data)  {
            $(`<h3>${news.title}</h3>`).appendTo(section)
            $(`<p>${news.description}</p>`).appendTo(section)
            $(`<p><a href=${news.url} title="Fuente de la noticia">Leer más</a></p>`).appendTo(section)
        }
    }
}
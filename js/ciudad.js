class Ciudad {
    //Hemos de declarar los atributos primero si queremos hacerlos privados
    #nombre
    #pais
    #gentilicio
    #poblacion
    #latitud
    #longitud

    /**
     * Constructor de la clase Ciudad
     * @param {string} nombre 
     * @param {string} pais 
     * @param {string} gentilicio 
     */
    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre
        this.#pais = pais
        this.#gentilicio = gentilicio
    }

    /**
     * @returns Devuelve el nombre de la ciudad
     */
    getNombre() {
        return this.#nombre
    }

    /**
     * 
     * @returns Devuelve el nombre del país
     */
    getPais() {
        return this.#pais
    }

    /**
     * Rellena los siguientes campos
     * @param {number} poblacion
     * @param {number} latitud 
     * @param {number} longitud 
     */
    setSecondaryInfo(poblacion, latitud, longitud) {
        this.#poblacion = poblacion
        this.#latitud = latitud
        this.#longitud = longitud
    }

    /**
     * Devuelve la información secundaria de la ciudad
     * @returns <ul><li>*gentilicio*</li><li>*población*</li></ul>
     */
    getSecondaryInfo() {
        return `<ul><li>Gentilicio: ${this.#gentilicio}</li><li>Población: ${this.#poblacion}</li></ul>`
    }

    /**
     * Convierte unas coordenadas en grados (decimal) a grados, minutos y segundos
     * Los grados y minutos se truncan, mientras que los segundos se redondean
     * El signo viene determinado por el de los grados (afecta a las tres componentes)
     * @param {number} coords Coordenadas en formato decimal
     * @returns [degrees, minutes, seconds]
     */
    #parseCoords(coords) {
        //TODO leer cómo tenemos que hacerlo en el guion (por si hay una función ya hecha para esto)
        const degs = Math.trunc(coords)
        const mins = 60*(Math.abs(coords - degs)) //Usamos Math.abs para que mins y secs sean positivos
        const secs = 60 * (mins - Math.trunc(mins))
        return [degs, Math.trunc(mins), Math.round(secs)]
    }

    /**
     * Escribe las coordenadas del punto elegido en el documento
     * Sigue el formato '<p>*longitud* *latitud*</p>'
     */
    writeCoords() {
        const [degsLat, minsLat, secsLat] = this.#parseCoords(this.#latitud)
        const letraLat = degsLat > 0 ? "N" : "S"
        const [degsLong, minsLong, secsLong] = this.#parseCoords(this.#longitud)
        const letraLong = degsLong > 0 ? "E" : "W"
        // Como ahora usamos letras para determinar el signo de los grados,
        // usamos Math.abs en degsLat y degsLong
        let parrafo = document.createElement("p")
        parrafo.textContent = `Está localizada en las coordenadas ${Math.abs(degsLat)}°${minsLat}'${secsLat}''${letraLat} ${Math.abs(degsLong)}°${minsLong}'${secsLong}''${letraLong}.`
        document.querySelector("main").lastChild.appendChild(parrafo)
    }

// Métodos relativos a consultar la API de meteorología    

    getMeteorologiaCarrera() {
        const url = "https://archive-api.open-meteo.com/v1/archive"
        $.ajax({
            dataType: "json",
            url: url,
            method: 'GET',
            data: {
                latitude: this.#latitud,
                longitude: this.#longitud,
                start_date: "2025-10-05",
                end_date: "2025-10-05",
                hourly: "temperature_2m,apparent_temperature,relative_humidity_2m,rain,wind_direction_10m,wind_speed_10m",
                daily: "sunrise,sunset",
                timezone: "Asia/Singapore" //Es la misma que la de Indonesia para la región del circuito
            },
            success: this.#procesarJSONCarrera.bind(this),
            error: () => {
                const title = "Información sobre la carrera"
                const errorMsg = "No se ha podido cargar la información sobre la carrera."
                $(`<h3>${title}</h3><section><h4>Error</h4><p>${errorMsg}</p></section>`).appendTo($("main"))
            }
        })
    }

    /**
     * La carrera tuvo lugar el día 5 de octubre de 2025 de 15:00 a 16:00 hora GMT+8
     * Usamos "after" para asegurarnos de que los contenidos se insertan adecuadamente en el DOM
     */
    #procesarJSONCarrera(data) {
        const header = $("<h3> Información meteorológica de la carrera </h3>")
        header.appendTo($("main"))

        //Procesamos las magnitudes diarias
        let dailySection = $("<section></section>")
        header.after(dailySection)
        $("<h4>Información global del día</h4>").appendTo(dailySection)
        let dailyList = $("<ul></ul>").appendTo(dailySection)
        let sunrise = $("<li></li>")
        sunrise.text(`Salida del sol: ${new Date(data.daily.sunrise[0]).toLocaleTimeString("es-ES", {hour12: false, hour:"2-digit", minute:"2-digit"})} (${data.timezone_abbreviation})`)
        sunrise.appendTo(dailyList)
        let sunset = $("<li></li>")
        sunset.text(`Puesta de sol: ${new Date(data.daily.sunset[0]).toLocaleTimeString("es-ES", {hour12: false, hour:"2-digit", minute:"2-digit"})} (${data.timezone_abbreviation})`)
        sunset.appendTo(dailyList)

        //Procesamos las magnitudes por horas
        let hourlySection = $(`<section><h4>Información por horas (${data.timezone_abbreviation})</h4></section>`)
        dailySection.after(hourlySection)
        this.#tablaDatosCarrera(data, hourlySection)
    }

    #tablaDatosCarrera(data, section) {
        const params = {
            "apparent_temperature" : "Temperatura ambiente",
            "rain" : "Lluvia",
            "relative_humidity_2m" : "Humedad relativa",
            "temperature_2m" : "Temperatura",
            "wind_direction_10m" : "Dirección del viento",
            "wind_speed_10m" : "Velocidad del viento"
        }
        const hours = [15]

        let table = $("<table></table>").appendTo(section)
        let headRow = $("<tr></tr>").appendTo(table)
        $("<th id='magnitud_carrera' scope='col'>Magnitud</th>").appendTo(headRow)

        for(let hour of hours) {
            $(`<th id='${hour}h' scope='col'>${hour}h</th>`).appendTo(headRow)
        }

        for(let key in params) {
            let row = $("<tr></tr>").appendTo(table)
            let value = params[key]
            $(`<th id='${value.replaceAll(" ", "_")}_carrera' scope='row' headers='magnitud_carrera'>${value} (${data.hourly_units[key]})</th>`).appendTo(row)
            for(let hour of hours) {
                $(`<td headers='${value.replaceAll(" ", "_")}_carrera ${hour}h'>${data.hourly[key][hour]}</td>`).appendTo(row)
            }
        }
    }  


    getMeteorologiaEntrenos() {
        const url = "https://archive-api.open-meteo.com/v1/archive"
        $.ajax({
            dataType: "json",
            url: url,
            method: 'GET',
            data: {
                latitude: this.#latitud,
                longitude: this.#longitud,
                start_date: "2025-10-02",
                end_date: "2025-10-04",
                hourly: "temperature_2m,relative_humidity_2m,rain,wind_speed_10m",
                timezone: "Asia/Singapore" //Es la misma que la de Indonesia para la región del circuito
            },
            success: this.#procesarJSONEntrenos.bind(this),
            error: () => {
                const title = "Información sobre los entrenamientos"
                const errorMsg = "No se ha podido cargar la información sobre los entrenamientos."
                $(`<h3>${title}</h3><section><h4>Error</h4><p>${errorMsg}</p></section>`).appendTo($("main"))
            }
        })
    }

    #procesarJSONEntrenos(data) {
        let header = $(`<h3>Información sobre los entrenamientos</h3>`).appendTo($("main"))
        const dayTimes = [[15, 16], [9, 19], [8, 15]] //Franjas horarias para cada día (hora de Indonesia)
        const params = {
            "temperature_2m": "Temperatura",
            "relative_humidity_2m": "Humedad relativa",
            "rain" : "Lluvia",
            "wind_speed_10m" : "Velocidad del viento"
        }

        //  Información para cada día de entreno
        for (let day = dayTimes.length - 1; day >= 0; day--) {
            let section = $("<section></section>")
            header.after(section)
            // Sacamos las fecha del JSON
            let dayDate = new Date(data.hourly.time[24*day]).toLocaleDateString("es-ES", {"day": "numeric", "month" : "long"})
            $(`<h4>${dayDate}</h4>`).appendTo(section)
            let list = $("<ul></ul>").appendTo(section)
            for(let key in params) {
                const units = data.hourly_units[key]
                let average = this.#promedioEntrenos(data, key, dayTimes[day][0] + 24 * day, dayTimes[day][1] + 24 * day)
                $(`<li>${params[key]}: ${average}${units}</li>`).appendTo(list)
            }
        }
    }

    // Promedio con dos decimales
    #promedioEntrenos(data, key, startIndex, endIndex) {
        let sum = 0
        for(let i = startIndex; i <= endIndex; i++) {
            sum += data.hourly[key][i]
        }
        return (sum/(endIndex - startIndex + 1)).toFixed(2)
    }
}

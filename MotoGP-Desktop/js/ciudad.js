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
        parrafo.textContent = `Está localizada en las coordenadas ${Math.abs(degsLat)}°${minsLat}'${secsLat}''${letraLat} ${Math.abs(degsLong)}°${minsLong}'${secsLong}''${letraLong}`
        document.querySelector("main").lastChild.appendChild(parrafo)
    }

    
    
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
            error: () => {console.log("no se ha podido cargar el JSON")} //TODO
        })
    }

    /**
     * La carrera tuvo lugar el día 5 de octubre de 2025 de 15:00 a 16:00 hora GMT+8
     */
    #procesarJSONCarrera(data) {
        //TODO refactorizar con 'after' en lugar de unir al main
        $("<h2> Información meteorológica de la carrera </h2>").appendTo($("main"))

        //Procesamos las magnitudes diarias
        let dailySection = $("<section></section>").appendTo($("main"))
        $("<h3>Información global del día</h3>").appendTo(dailySection)
        let dailyList = $("<ul></ul>").appendTo(dailySection)
        let sunrise = $("<li></li>")
        sunrise.text(`Salida del sol: ${new Date(data.daily.sunrise[0]).toLocaleTimeString("es-ES", {hour12: false, hour:"2-digit", minute:"2-digit"})} (${data.timezone_abbreviation})`)
        sunrise.appendTo(dailyList)
        let sunset = $("<li></li>")
        sunset.text(`Puesta de sol: ${new Date(data.daily.sunset[0]).toLocaleTimeString("es-ES", {hour12: false, hour:"2-digit", minute:"2-digit"})} (${data.timezone_abbreviation})`)
        sunset.appendTo(dailyList)

        //Procesamos las magnitudes por horas
        this.#tablaDatosCarrera(data, $(`<section><h3>Información por horas (${data.timezone_abbreviation})</h3></section>`).appendTo($("main")))
    }

    #tablaDatosCarrera(data, section) {
        //TODO refactorizar con 'after' en lugar de unir al main
        const params = {
            "apparent_temperature" : "Temperatura ambiente",
            "rain" : "Lluvia",
            "relative_humidity_2m" : "Humedad relativa",
            "temperature_2m" : "Temperatura",
            "wind_direction_10m" : "Dirección del viento",
            "wind_speed_10m" : "Velocidad del viento"
        }
        const hours = [14, 15, 16]

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
            error: () => {console.log("no se ha podido cargar el JSON")} //TODO
        })
    }

    #procesarJSONEntrenos(data) {
        let header = $(`<h2>Información sobre los entrenamientos</h2>`).appendTo($("main"))
        let section = ($("<section></section>"))
        header.after(section)
        let h3 = ($("<h3>Promedios por horas para los días de entrenamiento</h3>")).appendTo(section)
        const dayTimes = [[15, 16], [9, 19], [8, 15]]
        const params = {
            "temperature_2m": "Temperatura",
            "relative_humidity_2m": "Humedad relativa",
            "rain" : "Lluvia",
            "wind_speed_10m" : "Velocidad del viento"
        }
        let table = $("<table></table>")

        //Cabeceras de la tabla
        let headerRow = $("<tr></tr>").appendTo(table)
        $(`<th id='magnitud_entreno' scope='col'>Magnitud/Fecha</th>`).appendTo(headerRow)
        headerRow.appendTo(table)
        let dayHeaders = []
        for (let day in dayTimes) { // Usamos in para sacar los índices, no los arrays
            // Sacamos las fechas del JSON
            dayHeaders[day] = new Date(data.hourly.time[24*day]).toLocaleDateString("es-ES", {"day": "2-digit", "month" : "2-digit"})
            $(`<th id='dia_${dayHeaders[day].replaceAll("/", "_")}' scope='col'>${dayHeaders[day]}</th>`).appendTo(headerRow)
        }

        //Entradas con datos
        for (let key in params) {
            let row = $("<tr></tr>").appendTo(table)
            //Magnitud a medir
            $(`<th id='${params[key].replaceAll(" ", "_")}_entreno' scope='row' headers='magnitud_entreno'>${params[key]} (${data.hourly_units[key]})</th>`).appendTo(row)
            for(let day in dayTimes) {
                let sum = 0
                let bound = dayTimes[day][1] + 24 * day
                // Hacemos la media de la magnitud en la franja horaria del día
                for(let i = dayTimes[day][0] + 24 * day; i <= bound; i++) {
                    sum += data.hourly[key][i]
                }
                //Promedio con dos decimales
                let average = (sum/(dayTimes[day][1] - dayTimes[day][0])).toFixed(2)
                //Unimos la fila
                $(`<td headers='${params[key].replaceAll(" ", "_")}_entreno dia_${dayHeaders[day].replaceAll("/", "_")}'>${average}</td>`).appendTo(row)
            }
        }

        //Insertamos la tabla una vez rellena
        h3.after(table)
    }
}

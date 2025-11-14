class Circuito {

    constructor() {
        this.comprobarApiFile()
    }

    comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob)  {
            //SOPORTA LA API
        } else {
            //no la soporta
            //TODO mostrar mensaje al usuario
        }
    }

    leerArchivoHTML() {
        let reader = new FileReader()
        reader.onload = this.procesarArchivo.bind(reader)
        reader.readAsText("")
    }

    procesarArchivo(event) {
        console.log(this.result)
    }
}
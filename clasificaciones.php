<?php
    class Clasificacion {

        private function errorMessage($headerType, $headerText, $pText) {
            return "<section><$headerType>$headerText</$headerType><p>$pText</p></section>";
        }

        private function clasificaciones($xml) {
            $winner = $xml->vencedor['nombre'];
            $timeRaw = (string)$xml->{'vencedor'}->{'tiempo-victoria'};

            preg_match('/PT([\d\.]+)S/', $timeRaw, $m);
            $seconds = floatval($m[1]);

            $minutes = floor($seconds / 60);
            $remaining = $seconds - $minutes * 60;

            echo "<h3>Ganador: $winner</h3>";
            echo "<p>Tiempo: {$minutes} min " . number_format($remaining, 3) . " s</p>";

            echo "<h3>Clasificación</h3>";
            $i = 1;
            foreach ($xml->clasificados->clasificado as $pilot) {
                echo "<p>{$i}º - $pilot\n</p>";
                $i++;
            }
        }

        public function consultar() {
            $archivo = "./xml/circuitoEsquema.xml";
            if(!file_exists($archivo)) {
                return $this->errorMessage("h3", "Error", "Archivo con información la clasificación no encontrado.");
            }

            $datos = file_get_contents($archivo);
            if($datos==null) {
               return $this->errorMessage("h3", "Error", "No se ha podido procesar la clasificación.");
            }
            try {
                $xml = @new SimpleXMLElement($datos);                
                return $this->clasificaciones($xml);      
            } catch (\Throwable $th) {
                return $this->errorMessage("h3", "Error", "No se ha podido procesar la clasificación.");
            }
        }
    }

?>


<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>

    <meta name="author" content="Javier Ortín Rodenas"/>
    <meta name="description" content="Información sobre la clasificación de los pilotos que forman parte de la competición"/> <!--Cambiar si fuese necesario-->
    <meta name="keywords" content="clasificación,puntuación,pilotos,moto,premio,competición"/> <!--Cambiar si fuese necesario-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.ico" type="image/ico"/>
    <script src="js/plegarNav.js"></script>
</head>

<body>
    <header>
    <section>
        <button>☰</button>
        <h1><a href="index.html" title="Volver a la página de inicio">MotoGP Desktop</a></h1>
    </section>
    <nav>
        <a href="index.html" title="Volver al menú de inicio">Inicio</a>
        <a href="piloto.html" title="Información sobre el piloto (Joan Mir)">Piloto</a>
        <a href="circuito.html" title="Información sobre el circuito">Circuito</a>
        <a href="meteorologia.html" title="Información sobre la meteorología del circuito">Meteorología</a>
        <a href="clasificaciones.php" class="active" title="Acceder a las clasificaciones de la competición">Clasificaciones</a>
        <a href="juegos.html" title="Acceder a la plataforma de juegos sobre la competición">Juegos</a>
        <a href="ayuda.html" title="Ir al menú de ayuda del proyecto MotoGP-Desktop">Ayuda</a>
    </nav>
    <script>
        new Plegar()
    </script>
    </header>
    <!--Migas de navegación-->
    <p>Estás en <a href="index.html" title="Volver a la página de inicio">Inicio</a> >> <strong><a href="clasificaciones.php" title="Información sobre las clasificaciones">Clasificaciones</a></strong></p>
    <main>
        <h2>Clasificaciones de los pilotos tras la carrera de indonesia</h2>
        
        <?php
            //TODO eliminar (es una prueba)
            echo (new Clasificacion())->consultar();
        ?>
    </main>
</body>
</html>
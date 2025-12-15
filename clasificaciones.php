<?php
    class Clasificacion {

        private function errorMessage($headerType, $headerText, $pText) {
            return "<section><$headerType>$headerText</$headerType><p>$pText</p></section>";
        }

        private function clasificaciones($xml) {
            $vencedor = $xml->vencedor['nombre'];
            $duracion = $xml->{'vencedor'}->{'tiempo-victoria'};

            // Empieza por "PT" sigue con un número y acaba en "S"
            // Capturamos las coincidencias de patrones en $matches
            // Ponemos paréntesis para capturar el número por separado
            preg_match('/PT(\d+(\.\d+)?)S/', $duracion, $matches);
            
            // $matches[0] tiene el texto completo, y $matches[1] el primer subpatrón entre paréntesis
            $seconds = floatval($matches[1]); // Pasamos de string a float
            $minutes = floor($seconds / 60);
            $remaining = $seconds - $minutes * 60;
            echo "<section><h3>Ganador de la carrera: $vencedor</h3>";
            echo "<p>Tiempo: {$minutes}min " .number_format($remaining, 3) ."s</p></section>";


            echo "<section><h3>Clasificación global</h3><ol>";
            $resultadosPilotos = [];
            $i = 1;

            // Ordenamos los pilotos por puesto en caso de que no lo estén en el XML
            foreach ($xml->clasificados->clasificado as $piloto) {
                $puntos = $piloto["puntos"];
                $resultado = "$piloto: $puntos puntos";
                $resultadosPilotos[$i] = $resultado;
                $i++;
            }
            // Pasamos a lista ordenada en HTML
            foreach ($resultadosPilotos as $resultado) {
                echo "<li>$resultado</li>";
            }
            echo "</ol></section>";
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
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>

    <meta name="author" content="Javier Ortín Rodenas"/>
    <meta name="description" content="Clasificación de los pilotos inmediatamente después de la carrera de Indonesia"/>
    <meta name="keywords" content="clasificación,puntuación,pilotos,moto,premio,competición,pertamina,mandalika,Indonesia"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.ico" type="image/ico"/>
    <script src="js/plegarNav.js"></script>
</head>

<body>
    <header>
    <button aria-controls="menu">☰</button>
        <h1><a href="index.html" title="Volver a la página de inicio">MotoGP Desktop</a></h1>
    <nav id="menu">
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
    <p>Estás en <a href="index.html" title="Volver a la página de inicio">Inicio</a> >> <strong>Clasificaciones</strong></p>
    <main>
        <h2>Clasificaciones de los pilotos tras la carrera de Indonesia</h2>
        
        <?php
            echo (new Clasificacion())->consultar();
        ?>
    </main>
</body>
</html>
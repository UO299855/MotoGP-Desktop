<?php
    session_start();

    class Cronometro {
        private $tiempo;
        private $inicio;

        public function __construct() {
            $this->tiempo = 0;
        }

        public function arrancar() {
            // para que lo devuelva como número y no como array
            // da el resultado en nanosegundos
            $this->inicio = hrtime(true);
        }

        public function parar() {
            $this->tiempo = hrtime(true) - $this->inicio;
        }
        
        public function mostrar()  {
            $mins = $this->tiempo/(6e10);
            $seconds = $this->tiempo/(1e9) - 60 * $mins;
            $tenths = $this->tiempo/1e8 -10*$seconds;
            echo "<p>" .$mins .":" .$mins .":" .$seconds .".".$tenths ."</p>";
        }
    }
    
    if(!isset( $_SESSION['cronometro'] ) ) {
        $_SESSION['cronometro'] = new Cronometro();
    }
    $cronometro = $_SESSION['cronometro'];

    if (count($_POST)>0) { 
        if(isset($_POST['arrancar'])) $cronometro->arrancar();
        if(isset($_POST['parar'])) $cronometro->parar();
        if(isset($_POST['mostrar'])) $cronometro->mostrar();
    }

    
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP</title>

    <meta name="author" content="Javier Ortín Rodenas"/>
    <meta name="description" content="Índice de la página web"/> <!--Cambiar si fuese necesario-->
    <meta name="keywords" content="moto,premio,competición"/> <!--Cambiar si fuese necesario-->
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
        <a href="clasificaciones.html" title="Acceder a las clasificaciones de la competición">Clasificaciones</a>
        <a href="juegos.html" class="active" title="Acceder a la plataforma de juegos sobre la competición">Juegos</a>
        <a href="ayuda.html" title="Ir al menú de ayuda del proyecto MotoGP-Desktop">Ayuda</a>
    </nav>
    <script>
        new Plegar()
    </script>
    </header>
    <p>Estás en <a href="index.html" title="Página principal">Inicio</a>>><a href="juegos.html" title="Menú de juegos">Juegos</a>>><strong>Cronómetro en PHP</strong></p>
    <main>
        <h2>Cronómetro</h2>
        <form action="#" method="post" name="botones">
            <input type="submit" name="arrancar" value ="Arrancar"/>
            <input type="submit" name="parar" value="Parar"/>
            <input type="submit" name="mostrar" value="Mostrar"/>
        </form>
    </main>
</body>
</html>
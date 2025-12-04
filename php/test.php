<?php
    include "cronometro.php"; 
    //La clase cronómetro ya inicia la sesión, no es necesario hacerlo de nuevo
    class Test {
        private $host;
        private $user;
        private $password;
        private $database;

        public function __construct() {
            $this->host = "localhost";
            $this->user = "DBUSER2025";
            $this->password = "DBPSWD2025";
            $this->database = "UO299855_DB";
        }

        public function proceed() {
            if(isset($_POST["endSurvey"])) return $this->endSurvey();
            if(isset($_SESSION["cronometroTest"])) return $this->showUsabilitySurvey();
            if(count($_POST) == 0) return $this->showUserForm();
            if(isset($_POST["beginTest"])) return $this->beginTest();
            if(isset($_POST["registrarUsuario"])) return $this->registerNewUser();
            if(isset($_POST["usuarioExistente"])) return $this->chooseExistingUser();
        }

        private function showAvailableUsers() {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if ($db->connect_errno) {
                echo "<p>Error al conectarse a la base de datos</p>";
                return;
            }
            $query = "SELECT ID, TIPO FROM usuarios, dispositivos WHERE PERICIA_INFORMATICA = 10 AND (ID, TIPO) NOT IN (
	                    SELECT id_usuario, dispositivo from resultados_test where id_usuario = id and dispositivo = tipo
                    );";
            $availableUsers = $db->query($query);
            if($availableUsers->num_rows > 0) {
                echo '<form action="#" method="post" name="usuarioExistente">';
                echo '<label>Escoja la combinación de identificador y dispositivo que corresponda: <select name="existingUserID">';
                while($user = $availableUsers->fetch_array()) {
                    $id = $user[0];
                    $device = $user[1];
                    echo sprintf('<option value="%s-%s">Usuario %s - %s</option>', $id, $device, $id, $device);
                }
                echo "</select></label>";
                echo '<input type="submit" name="usuarioExistente" value="Continuar con usuario existente"/>';
                echo"</form>";
            } else {
                echo "<p>No hay usuarios existentes que puedan realizar más pruebas.</p>";
            }
            $db->close();
        }

        private function showUserForm() {
            require "forms/registerUser.html";
            echo "<section><h2>Seleccionar un usuario ya existente</h2>";
            $this->showAvailableUsers();
            echo "</section>";
        }
     
        private function registerNewUser() {
            $success = false;
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if ($db->connect_errno) {
                echo "<p>Error al conectarse a la base de datos</p>";
                return $this->showUserForm();
            }
            $query = "INSERT INTO USUARIOS (`profesion`, `edad`, `genero`, `pericia_informatica`) VALUES (?,?,?,?)";
            $preparedQuery = $db->prepare($query);
            $preparedQuery->bind_param("sisi", $_POST["profesion"], $_POST["edad"], $_POST["genero"], $_POST["pericia"]);
            $preparedQuery->execute();
            if( $preparedQuery->affected_rows > 0) {
                $_SESSION["currentUserID"] = $db->insert_id;
                $_SESSION["currentDevice"] = $_POST["dispositivo"];
                $success = true;
            }
            $db->close();
            if(!$success) return $this->showUserForm();
            $this->showAwaitingScreen();
        }

        private function chooseExistingUser() {
            $tokens = explode("-",$_POST["existingUserID"]);
            $_SESSION["currentUserID"] = $tokens[0];
            $_SESSION["currentDevice"] = $tokens[1];
            $this->showAwaitingScreen();
        }

        private function showAwaitingScreen() {
            include "forms/awaiting.php";
        }

        private function beginTest() {
            $_SESSION["cronometroTest"] = new Cronometro();
            $_SESSION["cronometroTest"]->arrancar();
            $this->showUsabilitySurvey();
        }

        private function showUsabilitySurvey() {
            include "forms/survey.html";
        }

        private function checkPostKey($key) {
            if(isset($_POST[$key])) return $_POST[ $key ];
            return null;
        }

        private function endSurvey() {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if($db->connect_errno) {
                echo "<p> Error al registrar sus respuestas. Vuelva a intentarlo.</p>";
                return $this->showUsabilitySurvey();
            }
            $success = false;
            $query = "INSERT INTO `respuestas_test`(`id_usuario`, `dispositivo`, `VUELTAS`,
                `AÑO_NACIMIENTO_MIR`, `EQUIPO_MIR`, `HEMISFERIO`, `GANADOR_INDONESIA`,
                `AÑO_VICTORIA_MIR`, `GRADOS_CIRCUITO`, `NUM_CARTAS`, `LIDER_CLASIFICACION`,
                `VICTORIAS_MIR_2024`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
            $preparedQuery = $db->prepare($query);
            $types = "isiisssidisi";
            $params = [
                $_SESSION["currentUserID"],
                $_SESSION["currentDevice"],
                $this->checkPostKey("vueltas"),
                $this->checkPostKey("nacimientoMir"),
                $this->checkPostKey("equipoMir"),
                $this->checkPostKey("hemisferio"),
                $this->checkPostKey("ganadorIndonesia"),
                $this->checkPostKey("añoGanadorMir"),
                $this->checkPostKey("temperaturaCircuito"),
                $this->checkPostKey("numeroCartas"),
                $this->checkPostKey("liderClasificacion"),
                $this->checkPostKey("victoriasMir")
            ];
            $preparedQuery->bind_param( $types,...$params);
            $preparedQuery->execute();
            if( $preparedQuery->affected_rows > 0) {
                $_SESSION["currentUserID"] = $db->insert_id;
                $success = true;
            }
            $db->close();
            if($success) return $this->askUserFeedback();
            echo "<p>Error al registrar sus respuestas. Por favor, inténtelo de nuevo.</p>";
            return $this->showUsabilitySurvey();
        }

        private function askUserFeedback() {
            $_SESSION["cronometroTest"]->parar();
            include "forms/feedback.html";
        }
    }
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Test de usabilidad</title>

    <meta name="author" content="Javier Ortín Rodenas"/>
    <meta name="description" content="Pruebas de usabilidad del proyecto"/>
    <meta name="keywords" content="test,control,pruebas,usabilidad"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon.ico" type="image/ico"/>
</head>
<body>
    <h1>Pruebas de usabilidad</h1>
    <main>
        <?php
           (new Test())->proceed();
        ?>
    </main>
</body>
</html>
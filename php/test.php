<?php
   include "cronometro.php"; 
   session_start();
    class Test {
        private $host;
        private $user;
        private $password;
        private $database;

        private $completed;

        public function __construct() {
            $this->host = "localhost";
            $this->user = "DBUSER2025";
            $this->password = "DBPSWD2025";
            $this->database = "UO299855_DB";
            $this->completed = true;
        }

        public function proceed() {
            if(isset($_POST["registrarUsuario"])) return $this->registerNewUser();
            if(isset($_POST["usuarioExistente"])) return $this->chooseExistingUser();
            if(count($_POST) == 0 || !isset($_SESSION["currentUserID"])) return $this->showUserForm();
            if(isset($_POST["sendObservations"])) return $this->logObservations();
            if(isset($_POST["sendFeedback"])) return $this->logFeedback();
            if(isset($_POST["endSurvey"])) return $this->endSurvey();
            if(isset($_POST["beginTest"])) return $this->beginTest();
            if(isset($_SESSION["cronometroTest"])) return $this->showUsabilitySurvey();
        }

        /*
        * Intenta preparar y ejecutar un prepared statement
        * Devuelve true si afecta a la base de datos o false en caso contrario
        */
        private function runPreparedStatement($query, $dataTypes, $params, &$insertID = null) {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if ($db->connect_errno) {
                echo "<p>Error al conectarse a la base de datos.</p>";
                return $this->showUserForm();
            }
            $preparedQuery = $db->prepare($query);
            $preparedQuery->bind_param( $dataTypes,...$params);
            $preparedQuery->execute();
            $success = $preparedQuery->affected_rows > 0;
            if($success && $insertID !== null) {
                $insertID = $db->insert_id;
            }
            $preparedQuery->close();
            $db->close();
            return $success;
        }

        private function showAvailableUsers() {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if ($db->connect_errno) {
                $db->close();
                echo "<p>Error al conectarse a la base de datos</p>";
                return;
            }
            $query = "SELECT ID, TIPO FROM usuarios, dispositivos WHERE PERICIA_INFORMATICA = 10 AND (ID, TIPO) NOT IN (
	                    SELECT id_usuario, dispositivo from resultados_test where id_usuario = id and dispositivo = tipo
                    );";
            $availableUsers = $db->query($query);
            if($availableUsers->num_rows > 0) {
                echo '<form action="#" method="post" name="usuarioExistente">';
                echo '<label for="existingUserID">Escoja la combinación de identificador y dispositivo que corresponda: <select id="existingUserID" name="existingUserID">';
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
            if($this->isBlank($_POST["profesion"])) {
                echo '<p>El campo "Profesión" es obligatorio.</p>';
                return $this->showUserForm();
            }

            $query = "INSERT INTO USUARIOS (`profesion`, `edad`, `genero`, `pericia_informatica`) VALUES (?,?,?,?)";
            $types = "sisi";
            $params = [$_POST["profesion"], $_POST["edad"], $_POST["genero"], $_POST["pericia"]];
            $newID = -1;
            if($this->runPreparedStatement($query, $types, $params, $newID)) {
                $_SESSION["currentUserID"] = $newID;
                $_SESSION["currentDevice"] = $_POST["dispositivo"];
                $_SESSION["currentProwess"] = $_POST["pericia"];                
                $this->showAwaitingScreen();
            } else {
                $this->showUserForm();
            }        
        }

        private function chooseExistingUser() {
            $tokens = explode("-",$_POST["existingUserID"]);
            $_SESSION["currentUserID"] = $tokens[0];
            $_SESSION["currentDevice"] = $tokens[1];
            $_SESSION["currentProwess"] = 10; // El usuario es informático
            $this->showAwaitingScreen();
        }

        private function showAwaitingScreen() {
            include "forms/awaiting.php";
        }

        private function beginTest() {
            $_SESSION["cronometroTest"] = new Cronometro();
            $_SESSION["cronometroTest"]->arrancar();
            unset($_POST["beginTest"]);
            $this->showUsabilitySurvey();
        }

        private function showUsabilitySurvey() {
            include "forms/survey.html";
        }

        private function isBlank($string) {
            if (!isset($string) || $string == null) return true;
            if (trim($string) === '') return true;
            return false;
        }

        private function checkStringAnswer($key) {
            if(!$this->isBlank($_POST[$key])) return $_POST[$key];
            $this->completed=false;
            return null;
        }

        private function endSurvey() {
            $query = "INSERT INTO `respuestas_test`(`id_usuario`, `dispositivo`, `VUELTAS`,
                `AÑO_NACIMIENTO_MIR`, `EQUIPO_MIR`, `HEMISFERIO`, `GANADOR_INDONESIA`,
                `AÑO_VICTORIA_MIR`, `GRADOS_CIRCUITO`, `NUM_CARTAS`, `LIDER_CLASIFICACION`,
                `VICTORIAS_MIR_2024`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
            $types = "isiisssidisi";
            $params = [
                $_SESSION["currentUserID"],
                $_SESSION["currentDevice"],
                $this->checkStringAnswer("vueltas"),
                $this->checkStringAnswer("nacimientoMir"),
                $this->checkStringAnswer("equipoMir"),
                $this->checkStringAnswer("hemisferio"),
                $this->checkStringAnswer("ganadorIndonesia"),
                $this->checkStringAnswer("añoGanadorMir"),
                $this->checkStringAnswer("temperaturaCircuito"),
                $this->checkStringAnswer("numeroCartas"),
                $this->checkStringAnswer("liderClasificacion"),
                $this->checkStringAnswer("victoriasMir")];
             
            if($this->runPreparedStatement($query, $types, $params)) {
                $_SESSION["cronometroTest"]->parar();
                $this->askUserFeedback();
            } else {
                echo "<p>Error al registrar sus respuestas. Por favor, inténtelo de nuevo.</p>";
                return $this->showUsabilitySurvey();
            }
        }

        private function askUserFeedback() {
            include "forms/feedback.html";
        }

        private function logFeedback() {
            $query = "INSERT INTO `resultados_test`(`id_usuario`, `dispositivo`, `tiempo`, `completada`, `comentarios`, `propuestas`, `valoracion`) VALUES (?,?,?,?,?,?,?)";
            $types = "isisssi";
            $params = [$_SESSION["currentUserID"], $_SESSION["currentDevice"], $_SESSION["cronometroTest"]->getMillis(),
                $this->completed, $_POST["comentarios"], $_POST["propuestas"], $_POST["valoracion"]];
            if( $this->runPreparedStatement($query, $types, $params)) {
                $this->askModObservations();
            } else {
                echo "<p>Error al registrar su valoración. Por favor, inténtelo de nuevo.</p>";
                $this->askUserFeedback();
            }
        }

        private function askModObservations() {
            include "forms/observations.php";
        }

        private function logObservations() {
            $query = "INSERT INTO `observaciones_test`(`id_usuario`, `dispositivo`, `comentarios`) VALUES (?,?,?)";
            $types = "iss";
            $params = [$_SESSION["currentUserID"], $_SESSION["currentDevice"], $_POST["observaciones"]];
            
            if( $this->runPreparedStatement($query, $types, $params)) {
                    if($_SESSION["currentProwess"] != $_POST["correctProwess"]) {
                        $query = "UPDATE `usuarios` SET `pericia_informatica` = ? WHERE id = ?";
                        $this->runPreparedStatement($query, "ss", [$_POST["correctProwess"], $_SESSION["currentUserID"]]);
                    } 
                    return $this->showFinalScreen();
            } else {
                echo "<p>Error al registrar sus observaciones. Por favor, inténtelo de nuevo.</p>";
                $this->askModObservations();
            }
        }

        public function showProwessSelector() {
            echo '<p>El nivel de pericia del usuario es el siguiente: ' .$_SESSION["currentProwess"] .'</p>';
            echo '<p>¿Desea corregirlo en vista de los reultados?</p>';
            echo '<label for="correctProwess"> Seleccionar pericia </label>';
            echo '<input type="number" id="correctProwess" name="correctProwess" min="0" max="10" value="' .$_SESSION["currentProwess"] .'"/>';
        }

        private function showFinalScreen() {
            unset($_SESSION["currentUserID"]);
            unset($_SESSION["currentDevice"]);
            unset($_SESSION["cronometroTest"]);
            unset($_SESSION["test"]);
            unset($_SESSION["currentProwess"]);            
            unset($_POST);
            include "forms/completed.html";
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
</head>
<body>
    <h1>Pruebas de usabilidad</h1>
    <main>
        <?php
            if(!isset($_SESSION["test"])) {
                $_SESSION["test"] = new Test();
            }
            $_SESSION["test"]->proceed();
        ?>
    </main>
</body>
</html>
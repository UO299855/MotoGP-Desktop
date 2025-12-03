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
            $query = "select id from usuarios where exists(
	                select tipo from dispositivos where not EXISTS(
                        select * from resultados_test where id_usuario = id and dispositivo = tipo
                    )
                );";
            $availableUsers = $db->query($query);
            if($availableUsers->num_rows > 0) {
                echo '<form action="#" method="post" name="usuarioExistente">';
                echo '<label>Escoja un identificador: <select name="existingUserID">';
                while($user = $availableUsers->fetch_array()) {
                    $id = $user[0];
                    echo '<option value="'.$id .'">Usuario ' .$id .'</option>';
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
                $success = true;
            }
            $db->close();
            if(!$success) return $this->showUserForm();
            $this->showAwaitingScreen();
        }

        private function chooseExistingUser() {
            $_SESSION["currentUserID"] = $_POST["existingUserID"];
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
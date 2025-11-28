<?php
    class Configuracion {
        private $message;

        public function runSqlSript($path) {
            $db = new mysqli("localhost", "DBUSER2025", "DBPSWD2025", "UO299855_DB");
            if ($db->connect_errno) {
                $message = "Error al conectarse a la base de datos";
                return false;
            }
            $sql = file_get_contents($path);
            if ($db->multi_query($sql)) {
                do {
                    if ($result = $db->store_result()) {
                        $result->free();
                    }
                } while ($db->next_result());
                
                echo "Script ejecutado correctamente.";
            } else {
                echo "Error ejecutando script: " . $db->error;
            }
            $db->close();
        }

        public function getMessage() {
            return $this->message;
        }
    }
?>


<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Panel de configuración</title>

    <meta name="author" content="Javier Ortín Rodenas"/>
    <meta name="description" content="Panel de configuración de las pruebas de accesibilidad del proyecto"/>
    <meta name="keywords" content="panel,control,test,usabilidad"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon.ico" type="image/ico"/>
</head>
<body>
    <h1>Configuración de las pruebas de usabilidad</h1>
    <main>
    </main>
</body>
</html>
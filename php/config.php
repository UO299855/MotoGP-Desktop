<?php
    class Configuracion {
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

        public function runSqlScript($path) {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if ($db->connect_errno) {
                echo "<p>Error al conectarse a la base de datos</p>";
                return;
            }
            $sql = file_get_contents($path);
            if ($db->multi_query($sql)) {
                do {
                    if ($result = $db->store_result()) {
                        $result->free();
                    }
                } while ($db->next_result());
                
                echo "<p>Acción ejecutada correctamente</p>";
            } else {
                echo "Error ejecutando script: " . $db->error;
            }
            $db->close();
        }

        private function exportTable($tableName) {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            $csvFile = fopen("export/$tableName.csv", "w");
            $results = $db->query("SELECT * FROM $tableName");
            $fieldsInfo = $results->fetch_fields();
            $headers = [];

            foreach ($fieldsInfo as $field) {
                $headers[] = $field->orgname;
            }
            fputcsv($csvFile, $headers, ";");
            while($row=$results->fetch_assoc()) {
                fputcsv($csvFile, $row, ";");
            }
            fclose($csvFile);
            $db->close();
        }

        public function exportDB() {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            $tables = $db->query("SHOW TABLES");
            if($tables->num_rows > 0) {
                while($table = $tables->fetch_array()) {
                    $this->exportTable($table[0]) ;
                }
                echo "<p>Base de datos exportada exitosamente.</p>";
            } else {
                echo "<p>La base de datos no dispone de tablas para exportar.</p>";
            }
            $db->close();
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
</head>
<body>
    <h1>Configuración de las pruebas de usabilidad</h1>
    <main>
        <section>
            <h2>Configuración de la base de datos</h2>
            <form action="#" method="post" name="botones">
                <input type = 'submit' class='button' name = 'vaciar' value = 'Vaciar base de datos' title="Borra los datos pero mantiene las tablas"/>
                <input type = 'submit' class='button' name = 'reiniciar' value = 'Reiniciar base de datos' title="Borra y crea de nuevo las tablas"/>
                <input type = 'submit' class='button' name = 'exportar' value = 'Exportar base de datos' title="Exporta los datos de cada tabla a un archivo CSV"/>
            </form>
            <?php
                if(count($_POST) > 0) {
                    $config = new Configuracion();
                    if(isset($_POST["vaciar"])) $config->runSqlScript("scripts-sql/vaciarTablas.sql");
                    if(isset($_POST["reiniciar"])) $config->runSqlScript("scripts-sql/reiniciarTablas.sql");
                    if(isset($_POST["exportar"])) $config->exportDB();
                }
            ?>
        </section>
    </main>
</body>
</html>
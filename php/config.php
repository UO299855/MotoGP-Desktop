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

        public function runSqlScript($path, $verbose = true) {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if ($db->connect_errno) {
                if ($verbose) echo "<p>Error al conectarse a la base de datos</p>";
                return false;
            }
            $success = false;
            $sql = file_get_contents($path);
            if ($db->multi_query($sql)) {
                do {
                    if ($result = $db->store_result()) {
                        $result->free();
                    }
                } while ($db->next_result());
                
                if ($verbose) echo "<p>Acción ejecutada correctamente</p>";
                $success = true;
            } else {
                if ($verbose) echo "Error ejecutando script: " . $db->error;
            }
            $db->close();
            return $success;
        }

        private function exportTable($tableName) {
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if($db->connect_errno) {
                echo "<p>Error al conectarse a la base de datos</p>";
                return;
            }
            $csvFile = fopen("export/$tableName.csv", "w");
            if($csvFile == false) {
                echo "<p>Error al escribir en el archivo al exportar la tabla " .$tableName ." </p>";
            }

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
            if($db->connect_errno) {
                echo "<p>Error al conectarse a la base de datos</p>";
                return;
            }
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

        public function importDB() {
            $directory = "import/";
            if(!is_dir($directory)) {
                echo "<p>No se pudo encontrar la carpeta para importar archivos.</p>";
                return;
            }
            $tablesToImport = ["usuarios", "respuestas_test", "resultados_test", "observaciones_test"];
            $anyPresent = false;
            foreach ($tablesToImport as $tableName) {
                $fileName = $directory . $tableName .".csv";
                if(file_exists($fileName)) {
                    if(!$anyPresent) {
                        if(!$this->runSqlScript("scripts-sql/vaciarTablas.sql", false)) {
                            echo "<p>Error reiniciando la base de datos, no se procederá a importar</p>";
                            return;
                        }    
                        $anyPresent = true;
                    }
                    $this->importTable($tableName, $directory);
                }
            }
            if(!$anyPresent) {
                echo "<p>No hay datos para importar.</p>";
            }
        }


        private function importTable($tableName, $directory) {
            $fileName = $directory . $tableName .".csv";
            $db = new mysqli($this->host, $this->user, $this->password, $this->database);
            if($db->connect_errno) {
                echo "<p>Error al conectarse a la base de datos</p>";
                return;
            }
            $csvFile = fopen($fileName, "r");
            if($csvFile == false) {
                echo "<p>Error al leer del archivo " .$fileName ." </p>";
            }
            preg_match('/import\/(.*).csv/', $fileName,$tableName);
            $tableName = $tableName[1];
            $fields = fgetcsv( $csvFile,0,";");
            $columns = implode(",",$fields);
            $fieldN = count($fields);
            $types = str_repeat("s", $fieldN);
            $placeholders = "(" . str_repeat("?,", $fieldN -1) ."?)";
            $query = "INSERT INTO `" . $this->database ."`.`" .$tableName ."` ($columns) VALUES $placeholders;";
            $prepared = $db->prepare($query);
            // Iteramos por cada fila del CSV
            while(($entry = fgetcsv( $csvFile,0,";")) != false) {
                if(count($entry) != $fieldN) {
                    continue;
                }
                $prepared->bind_param($types, ...$entry);
                $prepared->execute();
            }
            $prepared->close();

            fclose($csvFile);
            $db->close();
            echo "<p>Se ha importado correctamente desde $fileName.</p>";
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
                <input type = 'submit' class='button' name = 'importar' value = 'Importar base de datos' title="Reinicia las tablas y luego importa desde un CSV"/>
            </form>
            <?php
                if(count($_POST) > 0) {
                    $config = new Configuracion();
                    if(isset($_POST["vaciar"])) $config->runSqlScript("scripts-sql/vaciarTablas.sql");
                    if(isset($_POST["reiniciar"])) $config->runSqlScript("scripts-sql/reiniciarTablas.sql");
                    if(isset($_POST["exportar"])) $config->exportDB();
                    if(isset($_POST["importar"])) $config->importDB();                    
                }
            ?>
        </section>
    </main>
</body>
</html>
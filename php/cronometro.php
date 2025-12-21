<?php
    class Cronometro {
        private $tiempo;
        private $inicio;

        public function __construct() {
            $this->tiempo = 0;
        }

        public function arrancar() {
            // da el resultado en nanosegundos
            // usamos true que lo devuelva como número y no como array
            $this->inicio = hrtime(true);
        }

        public function parar() {
            $this->tiempo = hrtime(true) - $this->inicio;
        }
        
        public function mostrar() {
            $nanos = $this->tiempo;
            $mins = intdiv($nanos, 60000000000);
            $nanos -= $mins * 60000000000;
            $seconds = $nanos / 1000000000;

            // Formato mm:ss.s
            return sprintf("%02d:%04.1f", $mins, $seconds);
        }

        public function getMillis() {
            return intdiv($this->tiempo, 1000000);
        }
    }
?>
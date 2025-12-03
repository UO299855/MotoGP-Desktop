<?php
    session_start();

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
            // Usamos _ para que sean float
            $mins = intdiv($nanos, 60_000_000_000);
            $nanos -= $mins * 60_000_000_000;
            $seconds = $nanos / 1_000_000_000;

            // Formato mm:ss.s
            return sprintf("%02d:%04.1f", $mins, $seconds);
        }
    }
?>
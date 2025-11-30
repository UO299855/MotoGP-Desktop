DROP TABLE IF EXISTS `uo299855_db`.`observaciones_test`;
DROP TABLE IF EXISTS `uo299855_db`.`resultados_test`;
DROP TABLE IF EXISTS `uo299855_db`.`usuarios`;

CREATE TABLE `uo299855_db`.`usuarios` (
    id INT NOT NULL,
    profesion VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    genero ENUM('masculino', 'femenino', 'otro') NOT NULL,
    pericia_informatica ENUM('muy baja', 'baja', 'media', 'alta', 'informatico') NOT NULL,

    CONSTRAINT PK_USUARIOS PRIMARY KEY(id),
    CONSTRAINT CHECK_EDAD CHECK(edad BETWEEN 0 AND 120)
);

CREATE TABLE `uo299855_db`.`resultados_test` (
    id_usuario INT NOT NULL,
    dispositivo ENUM('ordenador', 'tablet', 'telefono') NOT NULL,
    tiempo INT NOT NULL,
    completada BOOLEAN NOT NULL,
    comentarios TEXT,
    propuestas TEXT,
    valoracion INT NOT NULL,

    CONSTRAINT PK_RESULTADOS PRIMARY KEY(id_usuario),
    CONSTRAINT FK_RESULTADOS FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
    CONSTRAINT CHECK_VALORACION CHECK(valoracion BETWEEN 0 AND 10)
);

CREATE TABLE `uo299855_db`.`observaciones_test` (
    id_usuario INT NOT NULL,
    comentarios TEXT,

    CONSTRAINT PK_OBSERVACIONES PRIMARY KEY(id_usuario),
    CONSTRAINT FK_OBSERVACIONES FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
);

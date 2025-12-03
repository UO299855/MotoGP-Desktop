DROP TABLE IF EXISTS `uo299855_db`.`observaciones_test`;
DROP TABLE IF EXISTS `uo299855_db`.`resultados_test`;
DROP TABLE IF EXISTS `uo299855_db`.`dispositivos`;
DROP TABLE IF EXISTS `uo299855_db`.`usuarios`;

CREATE TABLE `uo299855_db`.`usuarios` (
    id INT NOT NULL AUTO_INCREMENT,
    profesion VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    genero ENUM('masculino', 'femenino', 'otro') NOT NULL,
    pericia_informatica INT NOT NULL,

    CONSTRAINT PK_USUARIOS PRIMARY KEY(id),
    CONSTRAINT CHECK_EDAD CHECK(edad BETWEEN 0 AND 120),
    CONSTRAINT CHECK_PERICIA CHECK(pericia_informatica BETWEEN 0 AND 10)
);

CREATE TABLE `uo299855_db`.`dispositivos` (
    tipo ENUM('ordenador', 'tablet', 'telefono') NOT NULL,
    CONSTRAINT PK_DISPOSITIVO PRIMARY KEY(tipo)    
);

CREATE TABLE `uo299855_db`.`resultados_test` (
    id_usuario INT NOT NULL,
    dispositivo ENUM('ordenador', 'tablet', 'telefono') NOT NULL,
    tiempo INT NOT NULL,
    completada BOOLEAN NOT NULL,
    comentarios TEXT,
    propuestas TEXT,
    valoracion INT NOT NULL,

    CONSTRAINT PK_RESULTADOS PRIMARY KEY(id_usuario, dispositivo),
    CONSTRAINT FK_RESULTADOS_USUARIOS FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
    CONSTRAINT FK_RESULTADOS_DISPOSITIVOS FOREIGN KEY(dispositivo) REFERENCES dispositivos(tipo),
    CONSTRAINT CHECK_VALORACION CHECK(valoracion BETWEEN 0 AND 10)
);

CREATE TABLE `uo299855_db`.`observaciones_test` (
    id_usuario INT NOT NULL,
    comentarios TEXT,

    CONSTRAINT PK_OBSERVACIONES PRIMARY KEY(id_usuario),
    CONSTRAINT FK_OBSERVACIONES FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
);


INSERT INTO `uo299855_db`.`dispositivos` (`tipo`) VALUES ('ordenador');
INSERT INTO `uo299855_db`.`dispositivos` (`tipo`) VALUES ('telefono');
INSERT INTO `uo299855_db`.`dispositivos` (`tipo`) VALUES ('tablet');
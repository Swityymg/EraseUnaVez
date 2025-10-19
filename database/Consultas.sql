USE eraseUnaVez;

-- Verificar login del tutor
SELECT idUsuario, contraseña, nombreInfante, idAvatar 
FROM usuarios 
WHERE email = 'garcia.ana@mail.com';

-- Obtener el avatar del niño
SELECT 
    u.nombreInfante, 
    a.urlAvatar
FROM usuarios AS u
JOIN avatars AS a ON u.idAvatar = a.idAvatar
WHERE u.idUsuario = 1;

-- Continuar leyendo 
SELECT 
    c.idCuento, 
    c.tituloCuento, 
    c.urlPortada,
    p.ultimaPaginaLeida
FROM progresoLectura AS p
JOIN cuentos AS c ON p.idCuento = c.idCuento
WHERE p.idUsuario = 1 AND p.completado = FALSE;


-- Cuentos recomendados por edad
SELECT idCuento, tituloCuento, urlPortada 
FROM cuentos
WHERE edadRecomentada <= 5 -- poner la edad que se busca
ORDER BY fechaPublicacion DESC;

-- Ver favs
SELECT 
    c.idCuento, 
    c.tituloCuento, 
    c.urlPortada
FROM favoritos AS f
JOIN cuentos AS c ON f.idCuento = c.idCuento
WHERE f.idUsuario = 1;

-- Cargar página específca
SELECT texto, urlImagen, urlAudio, numeroPagina
FROM paginas
WHERE idCuento = 3 AND numeroPagina = 1;

-- Update progreso 
UPDATE progresoLectura
SET ultimaPaginaLeida = 2, fechaActualizacion = CURRENT_TIMESTAMP
WHERE idUsuario = 1 AND idCuento = 3;

-- Cuento completado 
UPDATE progresoLectura
SET completado = TRUE, fechaActualizacion = CURRENT_TIMESTAMP
WHERE idUsuario = 1 AND idCuento = 3;


-- Vista ver info guardada
CREATE VIEW vistaInfoCuentos AS
SELECT 
    c.idCuento, 
    c.tituloCuento, 
    c.descripcion, 
    c.urlPortada, 
    c.edadRecomentada,
    GROUP_CONCAT(cat.nombreCategoria SEPARATOR ', ') AS categorias 
FROM cuentos AS c
LEFT JOIN cuentoCategoria AS cc ON c.idCuento = cc.idCuento
LEFT JOIN categoriasCuentos AS cat ON cc.idCategoria = cat.idCategoria
GROUP BY c.idCuento;


SELECT * FROM vistaInfoCuentos WHERE idCuento = 1;






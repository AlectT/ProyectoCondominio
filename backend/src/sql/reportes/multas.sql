SELECT
    LA.id_llamado,
    PR.numero_propiedad,
    U.nombre || ' ' || U.apellido AS administrador,
    TC.nombre AS tipo_multa,
    TC.monto,
    LA.descripcion,
    LA.fecha_emision
FROM LLAMADO_ATENCION LA
INNER JOIN PROPIEDAD PR
    ON PR.id_propiedad = LA.id_propiedad
INNER JOIN USUARIO U
    ON U.id_usuario = LA.id_admin
INNER JOIN TIPO_CARGO TC
    ON TC.id_tipo_cargo = LA.id_tipo_cargo
WHERE TC.es_multa = 1
ORDER BY LA.fecha_emision DESC
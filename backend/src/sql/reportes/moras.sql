SELECT
    C.id_cargo,
    PR.numero_propiedad,
    TC.nombre AS tipo_cargo,
    C.monto,
    C.estado,
    C.fecha_emision,
    C.fecha_vencimiento,
    TRUNC(SYSDATE - C.fecha_vencimiento) AS dias_mora
FROM CARGO C
INNER JOIN PROPIEDAD PR
    ON PR.id_propiedad = C.id_propiedad
INNER JOIN TIPO_CARGO TC
    ON TC.id_tipo_cargo = C.id_tipo_cargo
WHERE
    C.estado = 'PENDIENTE'
    AND C.fecha_vencimiento < SYSDATE
ORDER BY dias_mora DESC
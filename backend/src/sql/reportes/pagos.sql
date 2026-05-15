SELECT
    P.id_pago,
    U.nombre || ' ' || U.apellido AS usuario,
    PR.numero_propiedad,
    P.numero_boleta,
    P.monto_total,
    P.fecha_pago,
    P.observaciones
FROM PAGO P
INNER JOIN USUARIO U
    ON U.id_usuario = P.id_usuario
INNER JOIN PROPIEDAD PR
    ON PR.id_propiedad = P.id_propiedad
ORDER BY P.fecha_pago DESC
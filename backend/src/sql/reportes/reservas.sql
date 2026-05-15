SELECT
    R.id_reserva,
    U.nombre || ' ' || U.apellido AS usuario,
    A.nombre AS area_social,
    R.fecha_reserva,
    R.hora_inicio,
    R.hora_fin,
    R.estado,
    P.monto_total
FROM RESERVA R
INNER JOIN USUARIO U
    ON U.id_usuario = R.id_usuario
INNER JOIN AREA_SOCIAL A
    ON A.id_area = R.id_area
INNER JOIN PAGO P
    ON P.id_pago = R.id_pago
ORDER BY R.fecha_reserva DESC
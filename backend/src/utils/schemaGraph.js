export const schemaGraph = {
    USUARIO: {
        ROL: { condition: 'USUARIO.id_rol = ROL.id_rol' },
        USUARIO_PROPIEDAD: { condition: 'USUARIO.id_usuario = USUARIO_PROPIEDAD.id_usuario' },
        PAGO: { condition: 'USUARIO.id_usuario = PAGO.id_usuario' },
        RESERVA: { condition: 'USUARIO.id_usuario = RESERVA.id_usuario' },
        INVITACION: { condition: 'USUARIO.id_usuario = INVITACION.id_usuario' },
        TICKET: { condition: 'USUARIO.id_usuario = TICKET.id_asignado_a' },
        LLAMADO_ATENCION: { condition: 'USUARIO.id_usuario = LLAMADO_ATENCION.id_admin' }
    },
    PROPIEDAD: {
        CATEGORIA_PROPIEDAD: { condition: 'PROPIEDAD.id_categoria = CATEGORIA_PROPIEDAD.id_categoria' },
        PARQUEO: { condition: 'PROPIEDAD.id_propiedad = PARQUEO.id_propiedad' },
        USUARIO_PROPIEDAD: { condition: 'PROPIEDAD.id_propiedad = USUARIO_PROPIEDAD.id_propiedad' },
        CARGO: { condition: 'PROPIEDAD.id_propiedad = CARGO.id_propiedad' },
        PAGO: { condition: 'PROPIEDAD.id_propiedad = PAGO.id_propiedad' },
        LLAMADO_ATENCION: { condition: 'PROPIEDAD.id_propiedad = LLAMADO_ATENCION.id_propiedad' }
    },
    ROL: {
        USUARIO: { condition: 'ROL.id_rol = USUARIO.id_rol' }
    },
    CATEGORIA_PROPIEDAD: {
        PROPIEDAD: { condition: 'CATEGORIA_PROPIEDAD.id_categoria = PROPIEDAD.id_categoria' }
    },
    PARQUEO: {
        PROPIEDAD: { condition: 'PARQUEO.id_propiedad = PROPIEDAD.id_propiedad' }
    },
    USUARIO_PROPIEDAD: {
        USUARIO: { condition: 'USUARIO_PROPIEDAD.id_usuario = USUARIO.id_usuario' },
        PROPIEDAD: { condition: 'USUARIO_PROPIEDAD.id_propiedad = PROPIEDAD.id_propiedad' }
    },
    TIPO_CARGO: {
        CARGO: { condition: 'TIPO_CARGO.id_tipo_cargo = CARGO.id_tipo_cargo' },
        LLAMADO_ATENCION: { condition: 'TIPO_CARGO.id_tipo_cargo = LLAMADO_ATENCION.id_tipo_cargo' }
    },
    CARGO: {
        PROPIEDAD: { condition: 'CARGO.id_propiedad = PROPIEDAD.id_propiedad' },
        TIPO_CARGO: { condition: 'CARGO.id_tipo_cargo = TIPO_CARGO.id_tipo_cargo' },
        PAGO_DETALLE: { condition: 'CARGO.id_cargo = PAGO_DETALLE.id_cargo' }
    },
    PAGO: {
        PROPIEDAD: { condition: 'PAGO.id_propiedad = PROPIEDAD.id_propiedad' },
        USUARIO: { condition: 'PAGO.id_usuario = USUARIO.id_usuario' },
        PAGO_DETALLE: { condition: 'PAGO.id_pago = PAGO_DETALLE.id_pago' },
        RESERVA: { condition: 'PAGO.id_pago = RESERVA.id_pago' }
    },
    PAGO_DETALLE: {
        PAGO: { condition: 'PAGO_DETALLE.id_pago = PAGO.id_pago' },
        CARGO: { condition: 'PAGO_DETALLE.id_cargo = CARGO.id_cargo' }
    },
    AREA_SOCIAL: {
        RESERVA: { condition: 'AREA_SOCIAL.id_area = RESERVA.id_area' }
    },
    RESERVA: {
        USUARIO: { condition: 'RESERVA.id_usuario = USUARIO.id_usuario' },
        AREA_SOCIAL: { condition: 'RESERVA.id_area = AREA_SOCIAL.id_area' },
        PAGO: { condition: 'RESERVA.id_pago = PAGO.id_pago' }
    },
    TIPO_INVITACION: {
        INVITACION: { condition: 'TIPO_INVITACION.id_tipo = INVITACION.id_tipo' }
    },
    INVITACION: {
        USUARIO: { condition: 'INVITACION.id_usuario = USUARIO.id_usuario' },
        TIPO_INVITACION: { condition: 'INVITACION.id_tipo = TIPO_INVITACION.id_tipo' }
    },
    LLAMADO_ATENCION: {
        PROPIEDAD: { condition: 'LLAMADO_ATENCION.id_propiedad = PROPIEDAD.id_propiedad' },
        USUARIO_PROPIEDAD: { condition: 'LLAMADO_ATENCION.id_propiedad = USUARIO_PROPIEDAD.id_propiedad' },
        TIPO_CARGO: { condition: 'LLAMADO_ATENCION.id_tipo_cargo = TIPO_CARGO.id_tipo_cargo' }
    },
    PRIORIDAD_TICKET: {
        TICKET: { condition: 'PRIORIDAD_TICKET.id_prioridad = TICKET.id_prioridad' }
    },
    TICKET: {
        USUARIO: { condition: 'TICKET.id_asignado_a = USUARIO.id_usuario' }, 
        PRIORIDAD_TICKET: { condition: 'TICKET.id_prioridad = PRIORIDAD_TICKET.id_prioridad' }
    }
};

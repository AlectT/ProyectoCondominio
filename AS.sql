-- =============================================================================
-- SCRIPT DE LIMPIEZA (corregido para SQL Developer)
-- =============================================================================

BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_ticket_historial'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_ticket_rol_valido'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_tercer_llamado_multa'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_desactivar_inv_normal'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_validar_invitacion'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_area_disponible'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_reserva_usuario_activo'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_reserva_sin_deuda'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_cargo_pagado'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_pago_todos_los_cargos'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_pago_usuario_vinculado'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_max_usuarios_propiedad'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_max_parqueos'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TRIGGER trg_llamado_solo_multas'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE TICKET_HISTORIAL CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE TICKET CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE LLAMADO_ATENCION CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ACCESO_VISITANTE CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE INVITACION CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE AUDITORIA_RESERVA CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE RESERVA CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PAGO_DETALLE CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PAGO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CARGO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE USUARIO_PROPIEDAD CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PARQUEO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PROPIEDAD CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE USUARIO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CONFIGURACION CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PRIORIDAD_TICKET CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE TIPO_INVITACION CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE TIPO_CARGO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE AREA_SOCIAL CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CATEGORIA_PROPIEDAD CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ROL CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP PROCEDURE prc_generar_cuotas_mensuales'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- =============================================================================
-- ESQUEMA DE BASE DE DATOS - SISTEMA DE GESTION DE CONDOMINIO
-- Motor: Oracle Database
-- Version: 3.0 (corregido para SQL Developer)
-- =============================================================================


-- =============================================================================
-- NIVEL 0: TABLAS BASE
-- =============================================================================

CREATE TABLE ROL (
    id_rol      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR2(50)  NOT NULL,
    descripcion VARCHAR2(200),
    activo      NUMBER(1)     DEFAULT 1 NOT NULL,
    CONSTRAINT chk_rol_activo CHECK (activo IN (0,1)),
    CONSTRAINT uq_rol_nombre  UNIQUE (nombre)
)
/

CREATE TABLE CATEGORIA_PROPIEDAD (
    id_categoria  NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre        VARCHAR2(50)  NOT NULL,
    descripcion   VARCHAR2(200),
    max_parqueos  NUMBER(2)     NOT NULL,
    cuota_mensual NUMBER(10,2)  NOT NULL,
    CONSTRAINT chk_cat_parqueos CHECK (max_parqueos >= 0),
    CONSTRAINT chk_cat_cuota    CHECK (cuota_mensual > 0),
    CONSTRAINT uq_cat_nombre    UNIQUE (nombre)
)
/

CREATE TABLE AREA_SOCIAL (
    id_area         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre          VARCHAR2(100)  NOT NULL,
    descripcion     VARCHAR2(300),
    hora_apertura   VARCHAR2(5)    DEFAULT '08:00' NOT NULL,
    hora_cierre     VARCHAR2(5)    DEFAULT '22:00' NOT NULL,
    precio_por_hora NUMBER(10,2)   NOT NULL,
    activo          NUMBER(1)      DEFAULT 1 NOT NULL,
    CONSTRAINT chk_area_activo CHECK (activo IN (0,1)),
    CONSTRAINT chk_area_precio CHECK (precio_por_hora >= 0),
    CONSTRAINT uq_area_nombre  UNIQUE (nombre)
)
/

CREATE TABLE TIPO_CARGO (
    id_tipo_cargo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre        VARCHAR2(50)  NOT NULL,
    descripcion   VARCHAR2(200),
    monto         NUMBER(10,2)  DEFAULT 0 NOT NULL,
    es_multa      NUMBER(1)     DEFAULT 0 NOT NULL,
    activo        NUMBER(1)     DEFAULT 1 NOT NULL,
    CONSTRAINT uq_tipo_cargo_nombre  UNIQUE (nombre),
    CONSTRAINT chk_tipo_cargo_monto  CHECK (monto >= 0),
    CONSTRAINT chk_tipo_cargo_multa  CHECK (es_multa IN (0,1)),
    CONSTRAINT chk_tipo_cargo_activo CHECK (activo IN (0,1))
)
/

CREATE TABLE TIPO_INVITACION (
    id_tipo     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR2(50)  NOT NULL,
    descripcion VARCHAR2(200),
    CONSTRAINT uq_tipo_inv_nombre UNIQUE (nombre)
)
/

CREATE TABLE PRIORIDAD_TICKET (
    id_prioridad NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre       VARCHAR2(30) NOT NULL,
    nivel        NUMBER(1)    NOT NULL,
    CONSTRAINT uq_prio_nombre UNIQUE (nombre),
    CONSTRAINT uq_prio_nivel  UNIQUE (nivel)
)
/

CREATE TABLE CONFIGURACION (
    id_config   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clave       VARCHAR2(100) NOT NULL,
    valor       VARCHAR2(500) NOT NULL,
    descripcion VARCHAR2(300),
    tipo_dato   VARCHAR2(20)  DEFAULT 'STRING' NOT NULL,
    fecha_mod   DATE          DEFAULT SYSDATE  NOT NULL,
    CONSTRAINT uq_config_clave UNIQUE (clave),
    CONSTRAINT chk_config_tipo CHECK (tipo_dato IN ('STRING','NUMBER','DATE','BOOLEAN'))
)
/


-- =============================================================================
-- NIVEL 1: USUARIO
-- =============================================================================

CREATE TABLE USUARIO (
    id_usuario      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol          NUMBER         NOT NULL,
    nombre_usuario  VARCHAR2(50)   NOT NULL,
    nombre          VARCHAR2(100)  NOT NULL,
    apellido        VARCHAR2(100)  NOT NULL,
    correo          VARCHAR2(150)  NOT NULL,
    contrasena_hash VARCHAR2(300)  NOT NULL,
    telefono        VARCHAR2(20),
    activo          NUMBER(1)      DEFAULT 1      NOT NULL,
    fecha_creacion  DATE           DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_usuario_rol        FOREIGN KEY (id_rol) REFERENCES ROL(id_rol),
    CONSTRAINT uq_usuario_nombre_usu UNIQUE (nombre_usuario),
    CONSTRAINT uq_usuario_correo     UNIQUE (correo),
    CONSTRAINT chk_usuario_activo    CHECK (activo IN (0,1))
)
/


-- =============================================================================
-- NIVEL 2: PROPIEDAD y PARQUEO
-- =============================================================================

CREATE TABLE PROPIEDAD (
    id_propiedad     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria     NUMBER         NOT NULL,
    numero_propiedad VARCHAR2(20)   NOT NULL,
    descripcion      VARCHAR2(300),
    activo           NUMBER(1)      DEFAULT 1      NOT NULL,
    fecha_registro   DATE           DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_propiedad_cat FOREIGN KEY (id_categoria) REFERENCES CATEGORIA_PROPIEDAD(id_categoria),
    CONSTRAINT uq_propiedad_num UNIQUE (numero_propiedad),
    CONSTRAINT chk_prop_activo  CHECK (activo IN (0,1))
)
/

CREATE TABLE PARQUEO (
    id_parqueo     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad   NUMBER         NOT NULL,
    numero_parqueo VARCHAR2(20)   NOT NULL,
    descripcion    VARCHAR2(200),
    activo         NUMBER(1)      DEFAULT 1 NOT NULL,
    CONSTRAINT fk_parqueo_prop    FOREIGN KEY (id_propiedad) REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT uq_parqueo_num     UNIQUE (numero_parqueo),
    CONSTRAINT chk_parqueo_activo CHECK (activo IN (0,1))
)
/

CREATE OR REPLACE TRIGGER trg_max_parqueos
BEFORE INSERT ON PARQUEO
FOR EACH ROW
DECLARE
    v_max_parqueos NUMBER;
    v_actuales     NUMBER;
BEGIN
    SELECT cp.max_parqueos INTO v_max_parqueos
    FROM PROPIEDAD p
    JOIN CATEGORIA_PROPIEDAD cp ON p.id_categoria = cp.id_categoria
    WHERE p.id_propiedad = :NEW.id_propiedad;

    SELECT COUNT(*) INTO v_actuales
    FROM PARQUEO
    WHERE id_propiedad = :NEW.id_propiedad AND activo = 1;

    IF v_actuales >= v_max_parqueos THEN
        RAISE_APPLICATION_ERROR(-20001,
            'RN-P5: La propiedad ya alcanzo el maximo de parqueos permitidos por su categoria.');
    END IF;
END;
/


-- =============================================================================
-- NIVEL 3: VINCULACION USUARIO-PROPIEDAD
-- =============================================================================

CREATE TABLE USUARIO_PROPIEDAD (
    id_usuario_propiedad NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario           NUMBER         NOT NULL,
    id_propiedad         NUMBER         NOT NULL,
    tipo_vinculo         VARCHAR2(20)   NOT NULL,
    fecha_inicio         DATE           DEFAULT SYSDATE NOT NULL,
    fecha_fin            DATE,
    activo               NUMBER(1)      DEFAULT 1 NOT NULL,
    CONSTRAINT fk_up_usuario   FOREIGN KEY (id_usuario)   REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_up_propiedad FOREIGN KEY (id_propiedad) REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT chk_up_vinculo  CHECK (tipo_vinculo IN ('Propietario','Inquilino')),
    CONSTRAINT chk_up_activo   CHECK (activo IN (0,1)),
    CONSTRAINT uq_up_tipo      UNIQUE (id_propiedad, tipo_vinculo)
)
/

CREATE OR REPLACE TRIGGER trg_max_usuarios_propiedad
BEFORE INSERT ON USUARIO_PROPIEDAD
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM USUARIO_PROPIEDAD
    WHERE id_propiedad = :NEW.id_propiedad AND activo = 1;

    IF v_count >= 2 THEN
        RAISE_APPLICATION_ERROR(-20002,
            'RN-U5: Una propiedad no puede tener mas de 2 usuarios vinculados.');
    END IF;
END;
/


-- =============================================================================
-- NIVEL 4: CARGOS
-- =============================================================================

CREATE TABLE CARGO (
    id_cargo          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad      NUMBER        NOT NULL,
    id_tipo_cargo     NUMBER        NOT NULL,
    monto             NUMBER(12,2)  NOT NULL,
    descripcion       VARCHAR2(300),
    estado            VARCHAR2(10)  DEFAULT 'PENDIENTE' NOT NULL,
    fecha_emision     DATE          DEFAULT SYSDATE NOT NULL,
    fecha_vencimiento DATE,
    CONSTRAINT fk_cargo_propiedad FOREIGN KEY (id_propiedad)  REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT fk_cargo_tipo      FOREIGN KEY (id_tipo_cargo) REFERENCES TIPO_CARGO(id_tipo_cargo),
    CONSTRAINT chk_cargo_estado   CHECK (estado IN ('PENDIENTE','PAGADO')),
    CONSTRAINT chk_cargo_monto    CHECK (monto >= 0)
)
/


-- =============================================================================
-- NIVEL 5: PAGOS
-- =============================================================================

CREATE TABLE PAGO (
    id_pago       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad  NUMBER        NOT NULL,
    id_usuario    NUMBER        NOT NULL,
    numero_boleta VARCHAR2(100) NOT NULL,
    monto_total   NUMBER(12,2)  NOT NULL,
    fecha_pago    DATE          DEFAULT SYSDATE NOT NULL,
    observaciones VARCHAR2(300),
    CONSTRAINT fk_pago_propiedad FOREIGN KEY (id_propiedad) REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT fk_pago_usuario   FOREIGN KEY (id_usuario)   REFERENCES USUARIO(id_usuario),
    CONSTRAINT uq_pago_boleta    UNIQUE (numero_boleta),
    CONSTRAINT chk_pago_monto    CHECK (monto_total > 0)
)
/

CREATE TABLE PAGO_DETALLE (
    id_detalle     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pago        NUMBER       NOT NULL,
    id_cargo       NUMBER       NOT NULL,
    monto_aplicado NUMBER(12,2) NOT NULL,
    CONSTRAINT fk_pd_pago   FOREIGN KEY (id_pago)  REFERENCES PAGO(id_pago),
    CONSTRAINT fk_pd_cargo  FOREIGN KEY (id_cargo) REFERENCES CARGO(id_cargo),
    CONSTRAINT uq_pd_cargo  UNIQUE (id_cargo),
    CONSTRAINT chk_pd_monto CHECK (monto_aplicado > 0)
)
/

CREATE OR REPLACE TRIGGER trg_pago_usuario_vinculado
BEFORE INSERT ON PAGO
FOR EACH ROW
DECLARE
    v_count NUMBER;
    v_rol   VARCHAR2(50);
BEGIN
    SELECT R.NOMBRE INTO v_rol
    FROM USUARIO U
    JOIN ROL R ON U.ID_ROL = R.ID_ROL
    WHERE U.ID_USUARIO = :NEW.id_usuario;

    IF v_rol = 'Administrador' THEN
        RETURN;
    END IF;

    SELECT COUNT(*) INTO v_count
    FROM USUARIO_PROPIEDAD
    WHERE id_usuario   = :NEW.id_usuario
      AND id_propiedad = :NEW.id_propiedad
      AND activo       = 1;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003,
            'RN-F4: Solo usuarios vinculados a la propiedad pueden registrar pagos.');
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_pago_todos_los_cargos
BEFORE INSERT ON PAGO_DETALLE
FOR EACH ROW
DECLARE
    v_pendientes_totales NUMBER;
    v_incluidos_en_pago  NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_pendientes_totales
    FROM CARGO c
    JOIN PAGO p ON p.id_propiedad = c.id_propiedad
    WHERE p.id_pago  = :NEW.id_pago
      AND c.estado   = 'PENDIENTE'
      AND c.id_cargo <> :NEW.id_cargo;

    SELECT COUNT(*) INTO v_incluidos_en_pago
    FROM PAGO_DETALLE
    WHERE id_pago = :NEW.id_pago;

    IF v_pendientes_totales > v_incluidos_en_pago THEN
        RAISE_APPLICATION_ERROR(-20004,
            'RN-F7: El pago debe incluir todos los cargos pendientes de la propiedad.');
    END IF;
END;
/
ALTER TRIGGER trg_pago_todos_los_cargos DISABLE
/

CREATE OR REPLACE TRIGGER trg_cargo_pagado
AFTER INSERT ON PAGO_DETALLE
FOR EACH ROW
BEGIN
    UPDATE CARGO SET estado = 'PAGADO'
    WHERE id_cargo = :NEW.id_cargo;
END;
/


-- =============================================================================
-- NIVEL 6: RESERVAS
-- =============================================================================

CREATE TABLE RESERVA (
    id_reserva     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario     NUMBER        NOT NULL,
    id_area        NUMBER        NOT NULL,
    id_pago        NUMBER        NOT NULL,
    fecha_reserva  DATE          NOT NULL,
    hora_inicio    VARCHAR2(5)   NOT NULL,
    hora_fin       VARCHAR2(5)   NOT NULL,
    estado         VARCHAR2(15)  DEFAULT 'APARTADA' NOT NULL,
    fecha_creacion DATE          DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_reserva_area    FOREIGN KEY (id_area)    REFERENCES AREA_SOCIAL(id_area),
    CONSTRAINT fk_reserva_pago    FOREIGN KEY (id_pago)    REFERENCES PAGO(id_pago),
    CONSTRAINT chk_reserva_estado CHECK (estado IN ('APARTADA','CANCELADA'))
)
/

CREATE TABLE AUDITORIA_RESERVA (
    id_auditoria NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reserva   NUMBER        NOT NULL,
    id_admin     NUMBER        NOT NULL,
    motivo       VARCHAR2(300),
    fecha_accion DATE          DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_audit_reserva FOREIGN KEY (id_reserva) REFERENCES RESERVA(id_reserva),
    CONSTRAINT fk_audit_admin   FOREIGN KEY (id_admin)   REFERENCES USUARIO(id_usuario)
)
/

CREATE OR REPLACE TRIGGER trg_reserva_sin_deuda
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_deuda     NUMBER;
    v_propiedad NUMBER;
BEGIN
    BEGIN
        SELECT id_propiedad INTO v_propiedad
        FROM USUARIO_PROPIEDAD
        WHERE id_usuario = :NEW.id_usuario
          AND activo     = 1
          AND ROWNUM     = 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN v_propiedad := NULL;
    END;

    IF v_propiedad IS NOT NULL THEN
        SELECT COUNT(*) INTO v_deuda
        FROM CARGO
        WHERE id_propiedad = v_propiedad AND estado = 'PENDIENTE';

        IF v_deuda > 0 THEN
            RAISE_APPLICATION_ERROR(-20005,
                'RN-R5: No puede reservar mientras tenga cargos pendientes de pago.');
        END IF;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_reserva_usuario_activo
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_activo NUMBER;
BEGIN
    SELECT activo INTO v_activo
    FROM USUARIO
    WHERE id_usuario = :NEW.id_usuario;

    IF v_activo = 0 THEN
        RAISE_APPLICATION_ERROR(-20006,
            'RN-X3: Un usuario inactivo no puede realizar reservas.');
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_area_disponible
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_conflicto NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_conflicto
    FROM RESERVA
    WHERE id_area       = :NEW.id_area
      AND fecha_reserva = :NEW.fecha_reserva
      AND estado        = 'APARTADA'
      AND :NEW.hora_inicio < hora_fin
      AND :NEW.hora_fin    > hora_inicio;

    IF v_conflicto > 0 THEN
        RAISE_APPLICATION_ERROR(-20007,
            'RN-R3: El area ya esta reservada en ese horario.');
    END IF;
END;
/


-- =============================================================================
-- NIVEL 7: INVITACIONES
-- =============================================================================

CREATE TABLE INVITACION (
    id_invitacion    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario       NUMBER        NOT NULL,
    id_tipo          NUMBER        NOT NULL,
    nombre_visitante VARCHAR2(150) NOT NULL,
    codigo_qr        VARCHAR2(500) NOT NULL,
    fecha_generacion DATE          DEFAULT SYSDATE NOT NULL,
    fecha_expiracion DATE,
    activo           NUMBER(1)     DEFAULT 1 NOT NULL,
    CONSTRAINT fk_inv_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_inv_tipo    FOREIGN KEY (id_tipo)    REFERENCES TIPO_INVITACION(id_tipo),
    CONSTRAINT uq_inv_qr      UNIQUE (codigo_qr),
    CONSTRAINT chk_inv_activo CHECK (activo IN (0,1))
)
/


-- =============================================================================
-- NIVEL 8: CONTROL DE ACCESO
-- =============================================================================

CREATE TABLE ACCESO_VISITANTE (
    id_acceso            NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_invitacion        NUMBER        NOT NULL,
    id_guardia           NUMBER        NOT NULL,
    tipo_documento       VARCHAR2(20)  NOT NULL,
    numero_documento     VARCHAR2(50)  NOT NULL,
    nombre_completo_real VARCHAR2(150) NOT NULL,
    hora_ingreso         DATE          DEFAULT SYSDATE NOT NULL,
    observaciones        VARCHAR2(300),
    CONSTRAINT fk_acceso_inv     FOREIGN KEY (id_invitacion) REFERENCES INVITACION(id_invitacion),
    CONSTRAINT fk_acceso_guardia FOREIGN KEY (id_guardia)    REFERENCES USUARIO(id_usuario),
    CONSTRAINT chk_acceso_doc    CHECK (tipo_documento IN ('DPI','Licencia'))
)
/

CREATE OR REPLACE TRIGGER trg_validar_invitacion
BEFORE INSERT ON ACCESO_VISITANTE
FOR EACH ROW
DECLARE
    v_activo     NUMBER;
    v_expiracion DATE;
    v_tipo       VARCHAR2(50);
BEGIN
    SELECT i.activo, i.fecha_expiracion, ti.nombre
    INTO v_activo, v_expiracion, v_tipo
    FROM INVITACION i
    JOIN TIPO_INVITACION ti ON i.id_tipo = ti.id_tipo
    WHERE i.id_invitacion = :NEW.id_invitacion;

    IF v_activo = 0 THEN
        RAISE_APPLICATION_ERROR(-20008,
            'RN-I5: Esta invitacion ha sido desactivada.');
    END IF;

    IF v_tipo = 'Normal' AND TRUNC(SYSDATE) > TRUNC(v_expiracion) THEN
        RAISE_APPLICATION_ERROR(-20009,
            'RN-I3: Esta invitacion ha expirado.');
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_desactivar_inv_normal
AFTER INSERT ON ACCESO_VISITANTE
FOR EACH ROW
DECLARE
    v_tipo VARCHAR2(50);
BEGIN
    SELECT ti.nombre INTO v_tipo
    FROM INVITACION i
    JOIN TIPO_INVITACION ti ON i.id_tipo = ti.id_tipo
    WHERE i.id_invitacion = :NEW.id_invitacion;

    IF v_tipo = 'Normal' THEN
        UPDATE INVITACION SET activo = 0
        WHERE id_invitacion = :NEW.id_invitacion;
    END IF;
END;
/


-- =============================================================================
-- NIVEL 9: LLAMADOS DE ATENCION
-- =============================================================================

CREATE TABLE LLAMADO_ATENCION (
    id_llamado    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_propiedad  NUMBER        NOT NULL,
    id_admin      NUMBER        NOT NULL,
    id_tipo_cargo NUMBER        NOT NULL,
    descripcion   VARCHAR2(500) NOT NULL,
    fecha_emision DATE          DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_llamado_prop  FOREIGN KEY (id_propiedad)  REFERENCES PROPIEDAD(id_propiedad),
    CONSTRAINT fk_llamado_admin FOREIGN KEY (id_admin)      REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_llamado_tipo  FOREIGN KEY (id_tipo_cargo) REFERENCES TIPO_CARGO(id_tipo_cargo)
)
/

CREATE OR REPLACE TRIGGER trg_llamado_solo_multas
BEFORE INSERT ON LLAMADO_ATENCION
FOR EACH ROW
DECLARE
    v_es_multa NUMBER;
BEGIN
    SELECT es_multa INTO v_es_multa
    FROM TIPO_CARGO
    WHERE id_tipo_cargo = :NEW.id_tipo_cargo;

    IF v_es_multa = 0 THEN
        RAISE_APPLICATION_ERROR(-20010,
            'Un llamado de atencion solo puede referenciar un tipo de cargo de tipo multa.');
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_tercer_llamado_multa
FOR INSERT ON LLAMADO_ATENCION
COMPOUND TRIGGER

    TYPE t_llamado IS RECORD (
        id_propiedad  LLAMADO_ATENCION.id_propiedad%TYPE,
        id_tipo_cargo LLAMADO_ATENCION.id_tipo_cargo%TYPE
    );
    TYPE t_llamados_tab IS TABLE OF t_llamado INDEX BY PLS_INTEGER;
    v_llamados t_llamados_tab;

    AFTER EACH ROW IS
        v_idx PLS_INTEGER;
    BEGIN
        v_idx := v_llamados.COUNT + 1;
        v_llamados(v_idx).id_propiedad  := :NEW.id_propiedad;
        v_llamados(v_idx).id_tipo_cargo := :NEW.id_tipo_cargo;
    END AFTER EACH ROW;

    AFTER STATEMENT IS
        v_count       NUMBER;
        v_monto       NUMBER;
        v_nombre      VARCHAR2(50);
        v_nombre_norm VARCHAR2(100);
    BEGIN
        FOR i IN 1 .. v_llamados.COUNT LOOP
            SELECT COUNT(*) INTO v_count
            FROM LLAMADO_ATENCION
            WHERE id_propiedad  = v_llamados(i).id_propiedad
              AND id_tipo_cargo = v_llamados(i).id_tipo_cargo;

            SELECT monto, nombre, LOWER(REPLACE(nombre, ' ', ''))
            INTO v_monto, v_nombre, v_nombre_norm
            FROM TIPO_CARGO
            WHERE id_tipo_cargo = v_llamados(i).id_tipo_cargo;

            IF v_nombre_norm IN ('multaexcesodevelocidad', 'multaperros', 'multaalquiler') THEN
                IF v_count > 0 AND MOD(v_count, 3) = 0 THEN
                    INSERT INTO CARGO (id_propiedad, id_tipo_cargo, monto, descripcion, estado)
                    VALUES (
                        v_llamados(i).id_propiedad,
                        v_llamados(i).id_tipo_cargo,
                        v_monto,
                        'Multa automatica: 3er llamado por ' || v_nombre,
                        'PENDIENTE'
                    );
                END IF;
            END IF;
        END LOOP;
    END AFTER STATEMENT;

END trg_tercer_llamado_multa;
/


-- =============================================================================
-- NIVEL 10: TICKETS
-- =============================================================================

CREATE TABLE TICKET (
    id_ticket       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_asignado_a   NUMBER         NOT NULL,
    id_asignado_por NUMBER         NOT NULL,
    id_prioridad    NUMBER         NOT NULL,
    titulo          VARCHAR2(150)  NOT NULL,
    descripcion     VARCHAR2(1000) NOT NULL,
    estado          VARCHAR2(20)   DEFAULT 'ABIERTO' NOT NULL,
    fecha_creacion  DATE           DEFAULT SYSDATE NOT NULL,
    fecha_limite    DATE,
    fecha_cierre    DATE,
    notas_cierre    VARCHAR2(500),
    CONSTRAINT fk_ticket_asig_a   FOREIGN KEY (id_asignado_a)   REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_ticket_asig_por FOREIGN KEY (id_asignado_por) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_ticket_prio     FOREIGN KEY (id_prioridad)    REFERENCES PRIORIDAD_TICKET(id_prioridad),
    CONSTRAINT chk_ticket_estado  CHECK (estado IN ('ABIERTO','EN_PROGRESO','RESUELTO','CERRADO','CANCELADO'))
)
/

CREATE TABLE TICKET_HISTORIAL (
    id_historial    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ticket       NUMBER        NOT NULL,
    id_usuario      NUMBER        NOT NULL,
    estado_anterior VARCHAR2(20),
    estado_nuevo    VARCHAR2(20)  NOT NULL,
    comentario      VARCHAR2(500),
    fecha_cambio    DATE          DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_th_ticket  FOREIGN KEY (id_ticket)  REFERENCES TICKET(id_ticket),
    CONSTRAINT fk_th_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
)
/

CREATE OR REPLACE TRIGGER trg_ticket_rol_valido
BEFORE INSERT ON TICKET
FOR EACH ROW
DECLARE
    v_rol_receptor VARCHAR2(50);
    v_rol_emisor   VARCHAR2(50);
BEGIN
    SELECT r.nombre INTO v_rol_receptor
    FROM USUARIO u JOIN ROL r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = :NEW.id_asignado_a;

    SELECT r.nombre INTO v_rol_emisor
    FROM USUARIO u JOIN ROL r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = :NEW.id_asignado_por;

    IF v_rol_receptor NOT IN ('Guardia','Colaborador') THEN
        RAISE_APPLICATION_ERROR(-20011,
            'Los tickets solo pueden asignarse a Guardias o Colaboradores.');
    END IF;

    IF v_rol_emisor <> 'Administrador' THEN
        RAISE_APPLICATION_ERROR(-20012,
            'Solo el Administrador puede crear y asignar tickets.');
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_ticket_historial
AFTER UPDATE OF estado ON TICKET
FOR EACH ROW
BEGIN
    INSERT INTO TICKET_HISTORIAL
        (id_ticket, id_usuario, estado_anterior, estado_nuevo, comentario)
    VALUES
        (:NEW.id_ticket, :NEW.id_asignado_por, :OLD.estado, :NEW.estado, :NEW.notas_cierre);
END;
/

CREATE OR REPLACE PROCEDURE prc_generar_cuotas_mensuales IS
    v_id_tipo_cuota NUMBER;
BEGIN
    SELECT id_tipo_cargo INTO v_id_tipo_cuota
    FROM TIPO_CARGO
    WHERE LOWER(nombre) = 'cuota condominio';

    FOR rec IN (
        SELECT p.id_propiedad, cp.cuota_mensual
        FROM PROPIEDAD p
        JOIN CATEGORIA_PROPIEDAD cp ON p.id_categoria = cp.id_categoria
        WHERE p.activo = 1
    ) LOOP
        INSERT INTO CARGO (id_propiedad, id_tipo_cargo, monto, descripcion, estado)
        VALUES (rec.id_propiedad, v_id_tipo_cuota, rec.cuota_mensual,
                'Cuota mensual de condominio (Manual)', 'PENDIENTE');
    END LOOP;
    COMMIT;
END;
/


-- =============================================================================
-- DATOS SEMILLA
-- =============================================================================

INSERT INTO ROL (nombre, descripcion) VALUES ('Residente', 'Propietario o inquilino de una unidad')
/
INSERT INTO ROL (nombre, descripcion) VALUES ('Administrador', 'Gestiona el condominio')
/
INSERT INTO ROL (nombre, descripcion) VALUES ('Guardia', 'Control de acceso y seguridad')
/
INSERT INTO ROL (nombre, descripcion) VALUES ('Colaborador', 'Limpieza y mantenimiento')
/

INSERT INTO TIPO_INVITACION (nombre, descripcion) VALUES ('Normal', 'Visita personal de un solo uso, expira a las 23:59 del dia')
/
INSERT INTO TIPO_INVITACION (nombre, descripcion) VALUES ('Servicio', 'Empleado domestico o proveedor, reutilizable hasta desactivacion')
/

INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Cuota condominio', 'Pago mensual obligatorio por propiedad', 0, 0)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Mora', 'Recargo automatico por cuota no pagada al dia 11', 0, 0)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Reserva de area', 'Pago por uso de area social', 0, 0)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Multa ruido excesivo', 'Ruido fuera de horario permitido', 200.00, 1)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Multa dano areas comunes', 'Dano a instalaciones del condominio', 500.00, 1)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Multa mascotas sin correa', 'Mascota sin correa en areas comunes', 150.00, 1)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Multa basura incorrecta', 'Deposito incorrecto de basura', 100.00, 1)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Multa exceso de velocidad', 'Exceso de velocidad dentro del condominio', 300.00, 1)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Multa perros', 'Perros sueltos o sin control', 200.00, 1)
/
INSERT INTO TIPO_CARGO (nombre, descripcion, monto, es_multa) VALUES ('Multa alquiler', 'Alquiler no autorizado o subarrendamiento', 400.00, 1)
/

INSERT INTO CATEGORIA_PROPIEDAD (nombre, descripcion, max_parqueos, cuota_mensual) VALUES ('Basica', 'Unidad residencial estandar', 1, 375.00)
/
INSERT INTO CATEGORIA_PROPIEDAD (nombre, descripcion, max_parqueos, cuota_mensual) VALUES ('Intermedia', 'Unidad con espacio adicional', 2, 800.00)
/
INSERT INTO CATEGORIA_PROPIEDAD (nombre, descripcion, max_parqueos, cuota_mensual) VALUES ('Completa', 'Unidad amplia con todas las amenidades', 3, 1200.00)
/

INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora) VALUES ('Salon Social', 'Salon para eventos y reuniones', '08:00', '22:00', 50.00)
/
INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora) VALUES ('Cancha de Futbol', 'Cancha de futbol 7', '08:00', '22:00', 30.00)
/
INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora) VALUES ('Cancha de Basketball', 'Cancha de basketball techada', '08:00', '22:00', 25.00)
/
INSERT INTO AREA_SOCIAL (nombre, descripcion, hora_apertura, hora_cierre, precio_por_hora) VALUES ('Piscina', 'Piscina con area de descanso', '08:00', '22:00', 20.00)
/

INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Baja', 1)
/
INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Media', 2)
/
INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Alta', 3)
/
INSERT INTO PRIORIDAD_TICKET (nombre, nivel) VALUES ('Urgente', 4)
/

INSERT INTO CONFIGURACION (clave, valor, descripcion, tipo_dato) VALUES ('DIA_GENERACION_CUOTA', '1', 'Dia del mes en que se genera la cuota mensual', 'NUMBER')
/
INSERT INTO CONFIGURACION (clave, valor, descripcion, tipo_dato) VALUES ('DIA_GENERACION_MORA', '11', 'Dia del mes en que se genera la mora si hay deuda', 'NUMBER')
/
INSERT INTO CONFIGURACION (clave, valor, descripcion, tipo_dato) VALUES ('PORCENTAJE_MORA', '5', 'Porcentaje de mora sobre la cuota mensual', 'NUMBER')
/

COMMIT
/

-- =============================================================================
-- FIN DEL ESQUEMA v3.0 (corregido)
-- =============================================================================
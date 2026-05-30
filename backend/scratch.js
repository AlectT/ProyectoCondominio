import { conectar } from './src/config/db.js';

// ==========================================
// SCRIPT PARA ELIMINACIÓN MANUAL FORZADA
// ==========================================

async function forzarEliminacionPropiedad(idPropiedad) {
    const conexion = await conectar();
    try {
        console.log(`Intentando eliminar forzosamente la propiedad ID: ${idPropiedad}`);
        
        // 1. Eliminar vínculos con usuarios
        await conexion.execute('DELETE FROM USUARIO_PROPIEDAD WHERE ID_PROPIEDAD = :1', [idPropiedad], { autoCommit: true });
        console.log('✅ Vínculos con residentes eliminados');

        // 2. Eliminar cargos financieros de esta propiedad
        await conexion.execute('DELETE FROM CARGO WHERE ID_PROPIEDAD = :1', [idPropiedad], { autoCommit: true });
        console.log('✅ Cargos financieros eliminados');

        // 3. Eliminar la propiedad
        await conexion.execute('DELETE FROM PROPIEDAD WHERE ID_PROPIEDAD = :1', [idPropiedad], { autoCommit: true });
        console.log('✅ Propiedad eliminada por completo');

    } catch (error) {
        console.error('❌ Error al eliminar:', error.message);
    } finally {
        await conexion.close();
    }
}

async function forzarEliminacionUsuario(idUsuario) {
    const conexion = await conectar();
    try {
        console.log(`Intentando eliminar forzosamente el usuario ID: ${idUsuario}`);
        
        // 1. Eliminar vínculos con propiedades
        await conexion.execute('DELETE FROM USUARIO_PROPIEDAD WHERE ID_USUARIO = :1', [idUsuario], { autoCommit: true });
        
        // 2. Eliminar pases de visita (invitaciones) que generó
        await conexion.execute('DELETE FROM INVITACION WHERE ID_USUARIO = :1', [idUsuario], { autoCommit: true });
        
        // 3. Eliminar usuario
        await conexion.execute('DELETE FROM USUARIO WHERE ID_USUARIO = :1', [idUsuario], { autoCommit: true });
        console.log('✅ Usuario eliminado por completo');

    } catch (error) {
        console.error('❌ Error al eliminar:', error.message);
    } finally {
        await conexion.close();
    }
}

async function limpiarPasesVisita() {
    const conexion = await conectar();
    try {
        await conexion.execute('DELETE FROM INVITACION', [], { autoCommit: true });
        console.log('✅ Todos los pases de visita han sido eliminados');
    } catch (error) {
        console.error('❌ Error al eliminar pases:', error.message);
    } finally {
        await conexion.close();
    }
}

async function limpiarTodasLasPropiedades() {
    const conexion = await conectar();
    try {
        console.log('Intentando eliminar TODAS las propiedades (excepto ADMIN-00)...');
        // Eliminar vínculos y cargos de propiedades (excepto ID 1 que es ADMIN-00)
        await conexion.execute('DELETE FROM USUARIO_PROPIEDAD WHERE ID_PROPIEDAD > 1', [], { autoCommit: true });
        await conexion.execute('DELETE FROM CARGO WHERE ID_PROPIEDAD > 1', [], { autoCommit: true });
        // Eliminar propiedades excepto la de administración
        await conexion.execute('DELETE FROM PROPIEDAD WHERE ID_PROPIEDAD > 1', [], { autoCommit: true });
        
        console.log('✅ Todas las propiedades han sido eliminadas por completo (se conservó ADMIN-00)');
    } catch (error) {
        console.error('❌ Error al eliminar propiedades:', error.message);
    } finally {
        await conexion.close();
    }
}

async function limpiarTodosLosResidentes() {
    const conexion = await conectar();
    try {
        console.log('Intentando eliminar TODOS los residentes...');
        // Rol 1 = Residente
        
        // 1. Eliminar vínculos
        await conexion.execute('DELETE FROM USUARIO_PROPIEDAD WHERE ID_USUARIO IN (SELECT ID_USUARIO FROM USUARIO WHERE ID_ROL = 1)', [], { autoCommit: true });
        
        // 2. Eliminar pases generados por residentes
        await conexion.execute('DELETE FROM INVITACION WHERE ID_USUARIO IN (SELECT ID_USUARIO FROM USUARIO WHERE ID_ROL = 1)', [], { autoCommit: true });
        
        // 3. Eliminar usuarios con rol de residente
        await conexion.execute('DELETE FROM USUARIO WHERE ID_ROL = 1', [], { autoCommit: true });
        
        console.log('✅ Todos los residentes han sido eliminados por completo (los usuarios de sistema se conservaron)');
    } catch (error) {
        console.error('❌ Error al eliminar residentes:', error.message);
    } finally {
        await conexion.close();
    }
}

async function listarPropiedades() {
    const conexion = await conectar();
    try {
        const resultado = await conexion.execute(`SELECT ID_PROPIEDAD, NUMERO_PROPIEDAD, DESCRIPCION FROM PROPIEDAD ORDER BY ID_PROPIEDAD`);
        console.table(resultado.rows);
    } finally {
        await conexion.close();
    }
}

async function listarUsuarios() {
    const conexion = await conectar();
    try {
        const resultado = await conexion.execute(`SELECT u.ID_USUARIO, u.NOMBRE_USUARIO, r.NOMBRE as ROL FROM USUARIO u JOIN ROL r ON u.ID_ROL = r.ID_ROL ORDER BY u.ID_USUARIO`);
        console.table(resultado.rows);
    } catch(e) {
        console.error(e);
    } finally {
        await conexion.close();
    }
}

// ==========================================
// INSTRUCCIONES:
// Descomenta la función que quieras usar y
// pon el ID correspondiente dentro del paréntesis.
// Luego ejecuta este archivo usando "node scratch.js" en la consola.
// ==========================================

// listarPropiedades();         // Descomenta esto para ver todos los IDs de propiedades
// listarUsuarios();            // Descomenta esto para ver todos los IDs de usuarios

// forzarEliminacionPropiedad(20);  // Cambia el 15 por el ID de la propiedad
// forzarEliminacionUsuario(20);    // Cambia el 20 por el ID del usuario
// limpiarPasesVisita();

// limpiarTodasLasPropiedades();  // Elimina todas las propiedades (conserva ADMIN-00)
// limpiarTodosLosResidentes();  // Elimina todos los residentes (conserva usuarios de sistema)


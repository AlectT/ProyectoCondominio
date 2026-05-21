import { schemaGraph } from './schemaGraph.js';

/**
 * Encuentra el camino más corto (JOINs) entre la tabla origen y la tabla destino usando BFS.
 */
export const findPath = (startTable, endTable) => {
    if (startTable === endTable) return [];
    
    if (!schemaGraph[startTable] || !schemaGraph[endTable]) {
        throw new Error(`Tabla desconocida en el grafo: ${startTable} o ${endTable}`);
    }

    const queue = [[startTable]];
    const visited = new Set([startTable]);

    while (queue.length > 0) {
        const path = queue.shift();
        const currentTable = path[path.length - 1];

        const neighbors = schemaGraph[currentTable];
        if (!neighbors) continue;

        for (const [neighbor, relation] of Object.entries(neighbors)) {
            if (!visited.has(neighbor)) {
                const newPath = [...path, neighbor];
                if (neighbor === endTable) {
                    return buildJoinsFromPath(newPath);
                }
                visited.add(neighbor);
                queue.push(newPath);
            }
        }
    }
    
    throw new Error(`No se encontró una ruta de unión entre ${startTable} y ${endTable}`);
};

/**
 * Convierte un path de tablas en una lista de definiciones de JOIN
 */
const buildJoinsFromPath = (path) => {
    const joins = [];
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const condition = schemaGraph[from][to].condition;
        
        // Dividir la condición (ej: "PAGO.id_usuario = USUARIO.id_usuario")
        const [left, right] = condition.split('=').map(s => s.trim());
        
        joins.push({
            table: to,
            left: left,
            operator: '=',
            right: right
        });
    }
    return joins;
};

/**
 * Obtiene todos los JOINs necesarios para satisfacer un conjunto de tablas requeridas.
 * Se asegura de no duplicar JOINs.
 */
export const getRequiredJoins = (baseTable, requiredTables) => {
    const allJoins = [];
    const joinedTables = new Set([baseTable]);

    for (const targetTable of requiredTables) {
        if (!joinedTables.has(targetTable)) {
            const pathJoins = findPath(baseTable, targetTable);
            
            for (const join of pathJoins) {
                if (!joinedTables.has(join.table)) {
                    allJoins.push(join);
                    joinedTables.add(join.table);
                }
            }
        }
    }

    return allJoins;
};

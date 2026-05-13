import fs from 'fs/promises';

async function updateFile(path, replacements) {
    try {
        let content = await fs.readFile(path, 'utf8');
        let modified = false;
        for (const [search, replace] of replacements) {
            if (content.includes(search)) {
                content = content.replace(search, replace);
                modified = true;
            }
        }
        if (modified) {
            await fs.writeFile(path, content, 'utf8');
            console.log('Modified', path);
        }
    } catch (e) {
        console.error(e);
    }
}

async function main() {
    // 1. usuarioPropiedadPagina
    await updateFile('c:/Users/andresz/Documents/ProyectoCondominio/frontend/src/paginas/usuarioPropiedadPagina.jsx', [
        [
            "import { usuariosApi } from '../api/usuariosApi.js';",
            "import { usuariosApi } from '../api/usuariosApi.js';\nimport { propiedadesApi } from '../api/propiedadesApi.js';"
        ],
        [
            "const [personal, setPersonal] = useState([]);",
            "const [personal, setPersonal] = useState([]);\n\tconst [propiedades, setPropiedades] = useState([]);"
        ],
        [
            "const filtrados = res.data.filter(\n\t\t\t\t\t(u) => (u.ROL === 'Guardia' || u.ROL === 'Colaborador') && u.ACTIVO === 1,\n\t\t\t\t);",
            "const filtrados = res.data.filter((u) => u.ACTIVO === 1);"
        ],
        [
            ".catch(() => setPersonal([]));\n\t}, []);",
            ".catch(() => setPersonal([]));\n\n\t\tpropiedadesApi\n\t\t\t.obtenerTodas()\n\t\t\t.then((res) => {\n\t\t\t\tsetPropiedades(res.data);\n\t\t\t})\n\t\t\t.catch(() => setPropiedades([]));\n\t}, []);"
        ],
        [
            `<Campo etiqueta="Propiedad">\r\n\t\t\t\t\t\t\t\t<Selector\r\n\t\t\t\t\t\t\t\t\trequired\r\n\t\t\t\t\t\t\t\t\tvalue={form.idPropiedad}\r\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}\r\n\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t<option value="">Seleccionar...</option>\r\n\t\t\t\t\t\t\t\t\t{personal.map((u) => (\r\n\t\t\t\t\t\t\t\t\t\t<option key={u.ID_USUARIO} value={u.ID_USUARIO}>\r\n\t\t\t\t\t\t\t\t\t\t\t{u.NOMBRE_USUARIO} — {u.NOMBRE} {u.APELLIDO} ({u.ROL})\r\n\t\t\t\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t\t\t\t))}\r\n\t\t\t\t\t\t\t\t</Selector>\r\n\t\t\t\t\t\t\t</Campo>`,
            `<Campo etiqueta="Propiedad">\r\n\t\t\t\t\t\t\t\t<Selector\r\n\t\t\t\t\t\t\t\t\trequired\r\n\t\t\t\t\t\t\t\t\tvalue={form.idPropiedad}\r\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}\r\n\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t<option value="">Seleccionar...</option>\r\n\t\t\t\t\t\t\t\t\t{propiedades.map((p) => (\r\n\t\t\t\t\t\t\t\t\t\t<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>\r\n\t\t\t\t\t\t\t\t\t\t\t{p.NUMERO_PROPIEDAD}\r\n\t\t\t\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t\t\t\t))}\r\n\t\t\t\t\t\t\t\t</Selector>\r\n\t\t\t\t\t\t\t</Campo>`
        ],
        [
            `<Campo etiqueta="Propiedad">\n\t\t\t\t\t\t\t\t<Selector\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tvalue={form.idPropiedad}\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<option value="">Seleccionar...</option>\n\t\t\t\t\t\t\t\t\t{personal.map((u) => (\n\t\t\t\t\t\t\t\t\t\t<option key={u.ID_USUARIO} value={u.ID_USUARIO}>\n\t\t\t\t\t\t\t\t\t\t\t{u.NOMBRE_USUARIO} — {u.NOMBRE} {u.APELLIDO} ({u.ROL})\n\t\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t))}\n\t\t\t\t\t\t\t\t</Selector>\n\t\t\t\t\t\t\t</Campo>`,
            `<Campo etiqueta="Propiedad">\n\t\t\t\t\t\t\t\t<Selector\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tvalue={form.idPropiedad}\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<option value="">Seleccionar...</option>\n\t\t\t\t\t\t\t\t\t{propiedades.map((p) => (\n\t\t\t\t\t\t\t\t\t\t<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>\n\t\t\t\t\t\t\t\t\t\t\t{p.NUMERO_PROPIEDAD}\n\t\t\t\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t\t\t\t))}\n\t\t\t\t\t\t\t\t</Selector>\n\t\t\t\t\t\t\t</Campo>`
        ],
        [
            `type="text"\r\n\t\t\t\t\t\t\t\t\trequired\r\n\t\t\t\t\t\t\t\t\tvalue={form.fechaFin}\r\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, fechaFin: e.target.value })}\r\n\t\t\t\t\t\t\t\t\tplaceholder="Fecha de pago"`,
            `type="date"\r\n\t\t\t\t\t\t\t\t\trequired\r\n\t\t\t\t\t\t\t\t\tvalue={form.fechaFin}\r\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, fechaFin: e.target.value })}`
        ],
        [
            `type="text"\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tvalue={form.fechaFin}\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, fechaFin: e.target.value })}\n\t\t\t\t\t\t\t\t\tplaceholder="Fecha de pago"`,
            `type="date"\n\t\t\t\t\t\t\t\t\trequired\n\t\t\t\t\t\t\t\t\tvalue={form.fechaFin}\n\t\t\t\t\t\t\t\t\tonChange={(e) => setForm({ ...form, fechaFin: e.target.value })}`
        ]
    ]);

    // 2. TicketsPagina
    await updateFile('c:/Users/andresz/Documents/ProyectoCondominio/frontend/src/paginas/TicketsPagina.jsx', [
        [
            'placeholder="Descripción corta del ticket"',
            'placeholder="Ej: Fuga de agua en área de piscina"'
        ],
        [
            'placeholder="Detalle del problema o tarea"',
            'placeholder="Ej: Se reporta una fuga considerable en el tubo principal cerca de las duchas. Requiere atención inmediata."'
        ],
        [
            'placeholder="Resumen de la resolución"',
            'placeholder="Ej: Se cambió la tubería dañada y se probó la presión"'
        ]
    ]);

    // 3. ParqueosPagina
    await updateFile('c:/Users/andresz/Documents/ProyectoCondominio/frontend/src/paginas/ParqueosPagina.jsx', [
        [
            'placeholder="Detalle del parqueo"\r\n\t\t\t\t\t\t\t\t\tclassName="w-full',
            'placeholder="Ej: P-101"\r\n\t\t\t\t\t\t\t\t\tclassName="w-full'
        ],
        [
            'placeholder="Detalle del parqueo"\n\t\t\t\t\t\t\t\t\tclassName="w-full',
            'placeholder="Ej: P-101"\n\t\t\t\t\t\t\t\t\tclassName="w-full'
        ],
        [
            'placeholder="Detalle del parqueo"\r\n\t\t\t\t\t\t\t\trows={3}',
            'placeholder="Ej: Parqueo techado en sótano 1"\r\n\t\t\t\t\t\t\t\trows={3}'
        ],
        [
            'placeholder="Detalle del parqueo"\n\t\t\t\t\t\t\t\trows={3}',
            'placeholder="Ej: Parqueo techado en sótano 1"\n\t\t\t\t\t\t\t\trows={3}'
        ]
    ]);
}

main();

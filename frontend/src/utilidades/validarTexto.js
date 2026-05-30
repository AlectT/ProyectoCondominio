export const validarTextoConSentido = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim();
	if (txt.length < 5) return false;

	// 1. Validar que contenga al menos 3 letras (evita puros números o símbolos)
	const soloLetras = txt.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
	if (soloLetras.length < 3) return false;

	// 2. Debe contener al menos una vocal
	if (!/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/.test(soloLetras)) return false;

	// 3. Evitar secuencias idénticas (ej. aaa)
	if (/(.)\1{2,}/.test(txt)) return false;

	// 4. Evitar muchas consonantes seguidas (ej. jklmn)
	if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/i.test(txt)) return false;

	// 5. Patrones de teclado comunes (asdf, qwer, etc.)
	const txtLower = txt.toLowerCase();
	const patronesTeclado = [
		'qwert',
		'werty',
		'ertyu',
		'rtyui',
		'tyuio',
		'yuiop',
		'asdfg',
		'sdfgh',
		'dfghj',
		'fghjk',
		'ghjkl',
		'zxcvb',
		'xcvbn',
		'cvbnm',
		'qwer',
		'asdf',
		'zxcv',
		'hjkl',
		'uiop',
		'vbnm',
	];
	if (patronesTeclado.some((p) => txtLower.includes(p))) return false;

	// 6. Validar que no haya palabras gigantes sin sentido (más de 25 caracteres sin espacios)
	const palabras = txt.split(/\s+/);
	if (palabras.some((p) => p.length > 25 && !p.startsWith('http'))) return false;

	return true;
};

// Mapa de coordenadas de un teclado QWERTY para detectar tecleo aleatorio (mashing)
const coordsTeclado = {
	q: [0,0], w: [0,1], e: [0,2], r: [0,3], t: [0,4], y: [0,5], u: [0,6], i: [0,7], o: [0,8], p: [0,9],
	a: [1,0], s: [1,1], d: [1,2], f: [1,3], g: [1,4], h: [1,5], j: [1,6], k: [1,7], l: [1,8], 'ñ': [1,9],
	z: [2,0], x: [2,1], c: [2,2], v: [2,3], b: [2,4], n: [2,5], m: [2,6]
};

const esTecleoAleatorio = (palabra) => {
	// Palabras cortas no se penalizan
	if (palabra.length < 4) return false;
	
	let distanciaTotal = 0;
	let teclasValidas = 0;
	
	for (let i = 0; i < palabra.length - 1; i++) {
		const c1 = palabra[i];
		const c2 = palabra[i+1];
		if (coordsTeclado[c1] && coordsTeclado[c2]) {
			const dx = coordsTeclado[c1][0] - coordsTeclado[c2][0];
			const dy = coordsTeclado[c1][1] - coordsTeclado[c2][1];
			distanciaTotal += Math.sqrt(dx*dx + dy*dy);
			teclasValidas++;
		}
	}
	
	if (teclasValidas > 0) {
		const promedio = distanciaTotal / teclasValidas;
		// Si el viaje promedio entre teclas es menor a 1.5, el usuario está "aplastando" teclas juntas (ej. adsas)
		if (promedio < 1.5) return true; 
	}
	return false;
};

export const validarNombrePersona = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim().toLowerCase();
	if (txt.length < 3) return false;

	// Si contiene CUALQUIER COSA que no sea letra, espacio o punto, es inválido
	if (/[^a-záéíóúñü\s.]/.test(txt)) return false;

	const palabras = txt.split(/\s+/);
	for (const palabra of palabras) {
		const soloLetras = palabra.replace(/[^a-záéíóúñü]/g, '');
		if (soloLetras.length === 0) continue;

		// Debe contener al menos una vocal
		if (!/[aeiouyáéíóúü]/.test(soloLetras)) return false;

		// Heurística de diversidad (destruye ababab)
		const unicos = new Set(soloLetras.split('')).size;
		if (soloLetras.length >= 5 && unicos < 3) return false; 
		if (soloLetras.length >= 7 && unicos < 4) return false; 

		// ALGORITMO AVANZADO: Detección de Mashing (destruye "adsas", "qweqwe", "zxcvb")
		if (esTecleoAleatorio(soloLetras)) return false;

		// Evitar repeticiones raras de consonantes (ej. zzez, xx, qq)
		if (/[hjqvwxyzñ]\1/.test(soloLetras)) return false;

		// Evitar 4 consonantes o 4 vocales seguidas
		if (/[bcdfghjklmnpqrstvwxyzñ]{4,}/.test(soloLetras)) return false;
		if (/[aeiouáéíóúü]{4,}/.test(soloLetras)) return false;
	}

	// Evitar 3 caracteres idénticos seguidos en cualquier parte
	if (/(.)\1{2,}/.test(txt)) return false;

	// Patrones de teclado comunes
	const patronesTeclado = [
		'qwert', 'werty', 'ertyu', 'rtyui', 'tyuio', 'yuiop',
		'asdfg', 'sdfgh', 'dfghj', 'fghjk', 'ghjkl',
		'zxcvb', 'xcvbn', 'cvbnm', 'qwer', 'asdf', 'zxcv', 'hjkl', 'uiop', 'vbnm'
	];
	if (patronesTeclado.some((p) => txt.includes(p))) return false;

	return true;
};

export const limpiarNombre = (texto) => {
	if (!texto) return '';
	// Mantiene solo letras, espacios y puntos. Elimina todo lo demás en tiempo real.
	// También reemplaza múltiples espacios por uno solo.
	return texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.]/g, '').replace(/\s{2,}/g, ' ');
};

export const limpiarAlfanumerico = (texto) => {
	if (!texto) return '';
	// Mantiene solo letras, números y guiones.
	return texto.replace(/[^a-zA-Z0-9-]/g, '');
};

export const validarNumeroPropiedad = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim();
	if (txt.length < 1) return false;
	// Solo permite letras, números y guiones
	if (/[^a-zA-Z0-9-]/.test(txt)) return false;
	return true;
};

export const corregirCodificacion = (texto) => {
	if (!texto) return '';
	// Corrige posibles errores de codificación en BBDD (ej: BÃ¡sica)
	return texto.replace(/B[Ã¡a-zA-Z]*sica/gi, 'Básica');
};

export const extraerNumeroPropiedad = (texto) => {
	if (!texto) return 0;
	const partes = texto.split('-');
	if (partes.length > 1) {
		const num = parseInt(partes[1].replace(/[^0-9]/g, ''), 10);
		return isNaN(num) ? 0 : num;
	}
	const num = parseInt(texto.replace(/[^0-9]/g, ''), 10);
	return isNaN(num) ? 0 : num;
};

export const validarNombreUsuario = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim().toLowerCase();
	if (txt.length < 4) return false;

	if (!/^[a-z0-9._-]+$/.test(txt)) return false;

	// Evitar 3 caracteres idénticos seguidos
	if (/(.)\1{2,}/.test(txt)) return false;

	// Heurística de diversidad
	const soloLetras = txt.replace(/[^a-z]/g, '');
	if (soloLetras.length >= 5) {
		const unicos = new Set(soloLetras.split('')).size;
		if (unicos < 3) return false;
	}

	// Detección de mashing de teclado
	if (esTecleoAleatorio(soloLetras)) return false;

	return true;
};

export const validarTelefono = (telefono) => {
	if (!telefono) return true;
	const num = telefono.trim();
	if (num.length === 0) return true;

	const digits = num.replace(/\D/g, '');
	if (digits.length < 8 || digits.length > 15) return false;

	if (!/^[+\-\d\s()]+$/.test(num)) return false;

	return true;
};

export const validarMontoEntero = (monto) => {
	if (monto === null || monto === undefined || monto === '') return false;
	const num = Number(monto);
	if (isNaN(num)) return false;
	if (!Number.isInteger(num)) return false;
	if (num <= 0) return false;
	return true;
};

export const validarParqueo = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim();
	// Validar formato LETRA-NUMERO (ej. A-105)
	return /^[a-zA-Z]-\d+$/.test(txt);
};

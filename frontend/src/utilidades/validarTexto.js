export const validarTextoConSentido = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim();
	if (txt.length < 5) return false;

	// 1. Validar que contenga al menos 3 letras (evita puros números o símbolos)
	const soloLetras = txt.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
	if (soloLetras.length < 3) return false;

	// 2. Debe contener al menos una vocal
	if (!/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/.test(soloLetras)) return false;

	// 3. Evitar secuencias idénticas (ej. aaaaa)
	if (/(.)\1{3,}/.test(txt)) return false;

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

export const validarNombrePersona = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim();
	if (txt.length < 2) return false;

	// Validar que contenga al menos 2 letras (evita puros números o símbolos)
	const soloLetras = txt.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
	if (soloLetras.length < 2) return false;

	// Debe contener al menos una vocal si es de 3 letras o más
	if (soloLetras.length >= 3 && !/[aeiouyáéíóúüAEIOUYÁÉÍÓÚÜ]/.test(soloLetras)) return false;

	// Evitar secuencias idénticas (ej. aaaaa)
	if (/(.)\1{3,}/.test(txt)) return false;

	// Evitar muchas consonantes seguidas (ej. jklmn)
	if (/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{5,}/i.test(txt)) return false;

	// Patrones de teclado comunes
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

	return true;
};

export const validarNombreUsuario = (texto) => {
	if (!texto || typeof texto !== 'string') return false;
	const txt = texto.trim();
	if (txt.length < 3) return false;

	// Permitir letras, números, puntos, guiones bajos y medios
	if (!/^[a-zA-Z0-9._-]+$/.test(txt)) return false;

	// Evitar secuencias idénticas largas
	if (/(.)\1{3,}/.test(txt)) return false;

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

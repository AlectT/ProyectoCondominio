import z from 'zod';

const esquemaUsuario = z.object({
	idRol: z
		.number({
			required_error: 'El campo idRol es requerido.',
			invalid_type_error: 'idRol debe ser un número.',
		})
		.int()
		.positive(),

	nombreUsuario: z
		.string({
			required_error: 'El nombre de usuario es requerido.',
			invalid_type_error: 'El nombre de usuario debe ser una cadena de texto.',
		})
		.min(3)
		.max(50),

	nombre: z
		.string({
			required_error: 'El nombre es requerido.',
			invalid_type_error: 'El nombre debe ser una cadena de texto.',
		})
		.min(1)
		.max(100),

	apellido: z
		.string({
			required_error: 'El apellido es requerido.',
			invalid_type_error: 'El apellido debe ser una cadena de texto.',
		})
		.min(1)
		.max(100),

	correo: z
		.string({
			required_error: 'El correo es requerido.',
			invalid_type_error: 'El correo debe ser una cadena de texto.',
		})
		.email({ message: 'El correo no tiene un formato válido.' }),

	contrasena: z
		.string({
			required_error: 'La contraseña es requerida.',
			invalid_type_error: 'La contraseña debe ser una cadena de texto.',
		})
		.min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),

	telefono: z.string().max(20).optional().nullable(),
});

const esquemaLogin = z.object({
	nombreUsuario: z.string({
		required_error: 'El nombre de usuario es requerido.',
	}),
	contrasena: z.string({
		required_error: 'La contraseña es requerida.',
	}),
});

export function validarUsuario(entrada) {
	return esquemaUsuario.safeParse(entrada);
}

export function validarUsuarioParcial(entrada) {
	return esquemaUsuario.partial().safeParse(entrada);
}

export function validarLogin(entrada) {
	return esquemaLogin.safeParse(entrada);
}

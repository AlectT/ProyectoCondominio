import z from 'zod';

const esquemaAccesoGarita = z.object({
	idInvitacion: z
		.number({
			required_error: 'El campo idInvitacion es requerido.',
			invalid_type_error: 'idInvitacion debe ser un número.',
		})
		.int()
		.positive(),
	idGuardia: z
		.number({
			required_error: 'El campo idGuardia es requerido.',
			invalid_type_error: 'idGuardia debe ser un número.',
		})
		.int()
		.positive(),

	tipoDocumento: z
		.string({
			required_error: 'El campo tipoDocumento es requerido.',
			invalid_type_error: 'tipoDocumento debe ser una cadena de texto.',
		})
		.min(1)
		.max(20),

	numeroDocumento: z
		.string({
			required_error: 'El campo numeroDocumento es requerido.',
			invalid_type_error: 'numeroDocumento debe ser una cadena de texto.',
		})
		.min(1)
		.max(50),

	nombreCompletoReal: z
		.string({
			required_error: 'El campo nombreCompleto es requerido.',
			invalid_type_error: 'nombreCompleto debe ser una cadena de texto.',
		})
		.min(2)
		.max(150),

	observaciones: z
		.string({
			required_error: 'El campo observaciones es requerido.',
			invalid_type_error: 'observaciones debe ser una cadena de texto.',
		})
		.max(300),
});

export function validarAccesoGarita(entrada) {
	return esquemaAccesoGarita.safeParse(entrada);
}

export function validarAccesoGaritaParcial(entrada) {
	return esquemaAccesoGarita.partial().safeParse(entrada);
}

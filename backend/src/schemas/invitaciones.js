import Joi from 'joi';

export const schemaCrear = Joi.object({
	nombreVisitante: Joi.string().min(3).max(100).required(),
	tipo: Joi.string().valid('Normal', 'Servicio').required(),
	idPropiedad: Joi.number().integer().required(),
	idUsuario: Joi.number().integer().required(),
});

export const schemaActualizar = Joi.object({
	nombreVisitante: Joi.string().min(3).max(100),
	tipo: Joi.string().valid('Normal', 'Servicio'),
	idPropiedad: Joi.number().integer(),
});

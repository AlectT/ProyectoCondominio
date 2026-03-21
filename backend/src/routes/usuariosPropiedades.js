import { Router } from 'express';
import { vinculacionesController } from '../controllers/usuariosPropiedades.js';

export const enrutadorVinculaciones = Router();

enrutadorVinculaciones.get('/', vinculacionesController.obtenerTodas);
enrutadorVinculaciones.post('/', vinculacionesController.crear);
enrutadorVinculaciones.patch('/:id', vinculacionesController.actualizar);
enrutadorVinculaciones.delete('/:id', vinculacionesController.eliminar);

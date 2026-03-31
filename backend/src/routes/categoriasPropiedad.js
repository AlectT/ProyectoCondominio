import { Router } from 'express';
import { categoriasController } from '../controllers/categoriasPropiedad.js';

export const enrutadorCategorias = Router();

enrutadorCategorias.get('/', categoriasController.obtenerTodas);
enrutadorCategorias.get('/:id', categoriasController.obtenerPorId);
enrutadorCategorias.post('/', categoriasController.crear);
enrutadorCategorias.patch('/:id', categoriasController.actualizar);
enrutadorCategorias.delete('/:id', categoriasController.eliminar);

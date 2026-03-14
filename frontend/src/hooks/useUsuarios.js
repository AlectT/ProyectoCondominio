import { useState, useEffect, useCallback } from 'react'
import { usuariosApi } from '../api/usuariosApi.js'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await usuariosApi.obtenerTodos()
      setUsuarios(res.data)
    } catch (err) {
      setError(err.response?.data?.mensaje ?? 'Error al cargar usuarios.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const crear = async (datos) => {
    const res = await usuariosApi.crear(datos)
    setUsuarios((prev) => [...prev, res.data])
    return res.data
  }

  const actualizar = async (id, datos) => {
    const res = await usuariosApi.actualizar(id, datos)
    setUsuarios((prev) => prev.map((u) => (u.ID_USUARIO === id ? res.data : u)))
    return res.data
  }

  const desactivar = async (id) => {
    const res = await usuariosApi.desactivar(id)
    setUsuarios((prev) => prev.map((u) => (u.ID_USUARIO === id ? res.data : u)))
    return res.data
  }

  return { usuarios, cargando, error, cargar, crear, actualizar, desactivar }
}

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({ baseURL: API_BASE_URL })

export async function getDatos(limit = 500, offset = 0, filtros = {}) {
  const res = await api.get('datos', { params: { limit, offset, ...filtros } })
  return res.data
}

export async function getResumen(filtros = {}) {
  const res = await api.get('resumen', { params: filtros })
  return res.data
}

export async function getFiltros() {
  const res = await api.get('filtros')
  return res.data
}

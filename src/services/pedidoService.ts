import axios from 'axios'
import type { Produto } from './produtoService'

const API_URL = 'http://localhost:5063/api/pedido'

export type PedidoItem = {
  pedidoItemId: number
  pedidoId: number
  produtoId: number
  quantidade: number
  pedidoObservacao: string
  produto?: Produto
}

export type Pedido = {
  pedidoId: number
  mesa: number
  dataAbertura: string
  status: number 
  usuarioId: number
  itens?: PedidoItem[]
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listarPedidos = async (status?: number, mesa?: number, usuarioId?: number) => {
  const params: any = {}
  if (status !== undefined) params.status = status
  if (mesa !== undefined) params.mesa = mesa
  if (usuarioId !== undefined) params.usuarioId = usuarioId

  const response = await axios.get<Pedido[]>(`${API_URL}/pedido`, {
    params,
    headers: getAuthHeader()
  })
  return response.data
}

export const obterPedido = async (id: number) => {
  const response = await axios.get<Pedido>(`${API_URL}/pedido/${id}`, {
    headers: getAuthHeader()
  })
  return response.data
}

export const criarPedido = async (mesa: number) => {
  const response = await axios.post<Pedido>(
    `${API_URL}/pedido`, 
    { mesa },
    { headers: getAuthHeader() }
  )
  return response.data
}

export const adicionarItem = async (
  pedidoId: number, 
  produtoId: number, 
  quantidade: number, 
  pedidoObservacao: string
) => {
  const response = await axios.post<PedidoItem>(
    `${API_URL}/${pedidoId}/itens`, 
    {
      produtoId,
      quantidade,
      pedidoObservacao
    },
    { headers: getAuthHeader() }
  )
  return response.data
}

export const adicionarItemPedidoAberto = async (
  pedidoId: number,
  produtoId: number,
  quantidade: number,
  pedidoObservacao: string
) => {

  const response = await axios.put(
    `${API_URL}/pedido/${pedidoId}`,
    {
      produtoId,
      quantidade,
      pedidoObservacao
    },
    { headers: getAuthHeader() }
  )
  return response.data
}

export const removerItemPedidoAberto = async (pedidoId: number, itemId: number) => {
  const response = await axios.delete(
    `${API_URL}/pedido/${pedidoId}/itens`,
    {
      params: { itemId },
      headers: getAuthHeader()
    }
  )
  return response.data
}

import axios from 'axios'

const API_URL = 'http://localhost:5063/api/pedido'

export type PedidoItem = {
  pedidoItemId: number
  pedidoId: number
  produtoId: number
  quantidade: number
  pedidoObservacao: string
}

export type Pedido = {
  pedidoId: number
  mesa: number
  dataAbertura: string
  status: number // Enum no backend
  usuarioId: number
  itens?: PedidoItem[]
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
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

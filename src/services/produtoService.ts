import axios from "axios";

const API_URL = "http://localhost:5063/api/produto";

export type Produto = {
  produtoId: number;
  nomeProduto: string;
  precoProduto: number;
  descricao: string;
  categoriaId: number;
};

export const cadastrar = async (produto: {
  nomeProduto: string;
  descricao: string;
  precoProduto: number;
  categoriaId: number;
}) => {
  const response = await axios.post(`${API_URL}/produto`, produto);
  return response.data;
};

export const listarProdutos = async () => {
  const response = await axios.get<Produto[]>(`${API_URL}/produto`);
  return response.data;
};

export const atualizar = async (
  id: number,
  nomeProduto: string,
  precoProduto: number,
  descricao: string,
  categoriaId: number
) => {
  const response = await axios.put(`${API_URL}/produto/${id}`, {
    nomeProduto,
    precoProduto,
    descricao,
    categoriaId,
  });
  return response.data;
};

export const desativar = async (id: number) => {
  await axios.delete(`${API_URL}/produto/${id}`);
};


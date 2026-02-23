import axios from "axios";

const API_URL = "http://localhost:5063/api/produto";

export const cadastrar = async (categoria: {
  nomeCategoria: string;
}) => {
  const response = await axios.post(`${API_URL}/categoria`, categoria);
  return response.data;
};

export type Categoria = {
  categoriaId: number;
  nomeCategoria: string;
};

export const listarCategorias = async () => {
  const response = await axios.get<Categoria[]>(`${API_URL}/categoria`);
  return response.data;
};

export const atualizar = async (id: number, nomeCategoria: string) => {
  const response = await axios.put(`${API_URL}/categoria/${id}`, {
    nomeCategoria,
  });
  return response.data;
};

export const desativar = async (id: number) => {
  await axios.delete(`${API_URL}/categoria/${id}`);
};


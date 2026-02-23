import axios from "axios";

const API_URL = "http://localhost:5063/api/auth";

export const cadastrar = async (usuario: {
  nome: string;
  email: string;
  senha: string;
  cargo: number;
}) => {
  const response = await axios.post(`${API_URL}/cadastro`, usuario);
  return response.data;
};

export const login = async (email: string, senha: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    senha
  });

  return response.data;
};
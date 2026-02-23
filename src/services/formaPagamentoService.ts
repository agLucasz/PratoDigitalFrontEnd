import axios from "axios";

const API_URL = "http://localhost:5063/api/financeiro";

export const cadastrar = async (formadepagamento: {
  descricaoPagamento: string;
}) => {
  const response = await axios.post(`${API_URL}/forma de pagamento`, formadepagamento);
  return response.data;
};

export type FormaPagamento = {
  formaPagamentoId: number;
  descricaoPagamento: string;
};
export const listarFormasPagamento = async () => {
  const response = await axios.get<FormaPagamento[]>(`${API_URL}/forma de pagamento`);
  return response.data;
};

export const atualizar = async (id: number, descricaoPagamento: string) => {
  const response = await axios.put(`${API_URL}/forma de pagamento/${id}`, {
    descricaoPagamento,
  });
  return response.data;
};

export const desativar = async (id: number) => {
  await axios.delete(`${API_URL}/forma de pagamento/${id}`);
};


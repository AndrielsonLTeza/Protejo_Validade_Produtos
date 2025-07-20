import axios from 'axios';

const API_BASE_URL = 'http://100.96.93.80:8080/api/produtos';



export const fetchProdutos = () => axios.get(`${API_BASE_URL}`);


export const criarProduto = (produto) => axios.post(`${API_BASE_URL}`, produto);
export const atualizarProduto = (id, produto) => axios.put(`${API_BASE_URL}/${id}`, produto);
export const excluirProduto = (id) => axios.delete(`${API_BASE_URL}/${id}`);

//imagem upload
export function uploadImagem(file, sessao) {
  const formData = new FormData();
  formData.append('file', file);

  // Sessão na URL
  return axios.post(`http://100.96.93.80:8080/api/uploads/${sessao}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
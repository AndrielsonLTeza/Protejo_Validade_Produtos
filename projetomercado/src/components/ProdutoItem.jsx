import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { excluirProduto } from '../api/produtoService';
import { uploadImagem } from '../api/produtoService';
import React, { useState } from 'react';


export default function ProdutoItem({ produto, onDelete }) {
  const navigate = useNavigate();

  // Ajuste conforme seu backend
  const BASE_URL_IMAGENS = 'http://localhost:8080';

  // Usa o campo correto
  const imagemPath = produto.imagem;
  const imagemURL = imagemPath
    ? imagemPath.startsWith('http')
      ? imagemPath
      : `${BASE_URL_IMAGENS}${imagemPath}`
    : null;

  const handleDelete = () => {
    if (window.confirm(`Excluir "${produto.nome}"?`)) {
      excluirProduto(produto.id)
        .then(onDelete)
        .catch(err => console.error('Erro ao excluir:', err));
    }
  };

 
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Escolha um arquivo primeiro!");
      return;
    }

    uploadImagem(file)
      .then(res => {
        console.log('Upload OK:', res.data);
      })
      .catch(err => {
        console.error('Erro upload:', err.response ? err.response.data : err.message);
      });
  };



  const validadeFormatada = produto.validade
    ? dayjs(produto.validade).format('DD/MM/YYYY')
    : '';

  const vencido = produto.validade && dayjs(produto.validade).isBefore(dayjs(), 'day');
  const bgColor = vencido ? '#f8d7da' : '#fff8dc';

  return (
    <div style={{
      display: 'flex',
      padding: 8,
      borderBottom: '1px solid #eee',
      alignItems: 'center',
      backgroundColor: bgColor
    }}>
      {/* Imagem */}
      <div style={{ flex: 2 }}>
        {imagemURL ? (
          <img
            src={imagemURL}
            alt={produto.nome}
            style={{
              width: 60,
              height: 60,
              objectFit: 'cover',
              borderRadius: 4,
              border: '1px solid #ccc'
            }}
            onError={(e) => { e.target.src = '/sem-imagem.png'; }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#ccc',
              color: '#666',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 12,
              borderRadius: 4,
            }}
          >
            Sem imagem
          </div>
        )}
      </div>

      <div style={{ flex: 2 }}>{produto.nome}</div>
      <div style={{ flex: 2 }}>{produto.marca}</div>
      <div style={{ flex: 2 }}>{validadeFormatada}</div>
      <div style={{ flex: 2 }}>{produto.codigoBarras}</div>
      <div style={{ flex: 2 }}>
        <button
          onClick={() => navigate(`/editar/${produto.id}`)}
          style={{ marginRight: 8 }}
        >
          Editar
        </button>
        <button onClick={handleDelete}>
          Excluir
        </button>
      </div>
    </div>
  );
}

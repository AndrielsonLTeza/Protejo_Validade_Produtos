import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarProduto, atualizarProduto, fetchProdutos, uploadImagem } from '../api/produtoService';

export default function ProdutoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [produto, setProduto] = useState({
    nome: '',
    marca: '',
    validade: '',
    codigoBarras: '',
    tipo: '',
    sessao: '',
  imagem: ''
  });

  const [uploading, setUploading] = useState(false);

  // Carrega dados se for edição
  useEffect(() => {
    if (id) {
      fetchProdutos()
        .then(res => {
          const encontrado = res.data.find(p => p.id === id);
          if (encontrado) {
            setProduto(encontrado);
          } else {
            alert('Produto não encontrado!');
            navigate('/');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Erro ao carregar produto para edição');
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      atualizarProduto(id, produto)
        .then(() => navigate('/'))
        .catch(err => alert('Erro ao atualizar: ' + err));
    } else {
      criarProduto(produto)
        .then(() => navigate('/'))
        .catch(err => alert('Erro ao cadastrar: ' + err));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadImagem(file);
      setProduto(prev => ({ ...prev, imagem: res.data }));
      alert('Imagem enviada com sucesso!');
    } catch (err) {
      alert('Erro ao enviar imagem: ' + err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>{id ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" value={produto.nome} onChange={handleChange} required />
        <input name="marca" placeholder="Marca" value={produto.marca} onChange={handleChange} />
        <input name="sessao" placeholder="Sessão" value={produto.sessao} onChange={handleChange} />
        <input type="date" name="validade" value={produto.validade} onChange={handleChange} required />
        <input name="codigoBarras" placeholder="Código de Barras" value={produto.codigoBarras} onChange={handleChange} required />
        <input name="tipo" placeholder="Tipo" value={produto.tipo} onChange={handleChange} />

        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />

        {/* Mostra preview da imagem já enviada */}
        {produto.imagem && (
          <div style={{ marginTop: 10 }}>
            <img
              src={produto.imagem}
              alt="Imagem do Produto"
              style={{ width: 150, height: 150, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 4 }}
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: 10 }}>
          {id ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </form>

      <button onClick={() => navigate('/')} style={{ marginTop: 10 }}>Cancelar</button>
    </div>
  );
}

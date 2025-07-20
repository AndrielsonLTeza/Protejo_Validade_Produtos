import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  criarProduto,
  atualizarProduto,
  fetchProdutos,
  uploadImagem
} from '../api/produtoService';

export default function ProdutoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [produto, setProduto] = useState({
    nome: '',
    marca: '',
    validade: '',
    codigoBarras: '',
    tipo: '',
    sessaoId: '',
    imagem: ''
  });

  const [sessoes, setSessoes] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Carrega sessões
  useEffect(() => {
    fetch('/api/sessoes')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar sessões');
        return res.json();
      })
      .then(data => setSessoes(data))
      .catch(err => {
        console.error(err);
        alert('Erro ao carregar lista de sessões!');
      });
  }, []);

  // Carrega produto (edição)
  useEffect(() => {
    if (id) {
      fetchProdutos()
        .then(res => {
          const encontrado = res.data.find(p => String(p.id) === String(id));
          if (encontrado) {
            if (encontrado.validade?.includes('/')) {
              const [d, m, y] = encontrado.validade.split('/');
              encontrado.validade = `${y}-${m}-${d}`;
            } else if (encontrado.validade?.includes('T')) {
              encontrado.validade = encontrado.validade.split('T')[0];
            }

            setProduto({
              ...encontrado,
              sessaoId: encontrado.sessao?.id ?? ''
            });
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

    const payload = {
      ...produto,
      sessao: produto.sessaoId ? { id: parseInt(produto.sessaoId) } : null
    };
    delete payload.sessaoId;

    const promise = id
      ? atualizarProduto(id, payload)
      : criarProduto(payload);

    promise
      .then(() => navigate('/'))
      .catch(err => {
        console.error(err);
        alert('Erro ao salvar produto: ' + (err?.response?.data || err.message));
      });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!produto.sessaoId) {
      alert('Selecione uma sessão antes de enviar imagem!');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadImagem(file, produto.sessaoId);
      let imagemUrl = res.data.url || res.data;
      imagemUrl = normalizarCaminhoImagem(imagemUrl);
      setProduto(prev => ({ ...prev, imagem: imagemUrl }));
      alert('Imagem enviada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar imagem: ' + (err?.response?.data || err.message));
    } finally {
      setUploading(false);
    }
  };

  function normalizarCaminhoImagem(url) {
    if (!url) return '';
    try {
      const u = new URL(url);
      return u.pathname;
    } catch {
      return url;
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>{id ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          placeholder="Nome"
          value={produto.nome || ''}
          onChange={handleChange}
          required
        />
        <input
          name="marca"
          placeholder="Marca"
          value={produto.marca || ''}
          onChange={handleChange}
        />

        <select
          name="sessaoId"
          value={produto.sessaoId || ''}
          onChange={handleChange}
          required
        >
          <option value="">Selecione a Sessão</option>
          {sessoes.map(sessao => (
            <option key={sessao.id} value={sessao.id}>
              {sessao.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="validade"
          value={produto.validade || ''}
          onChange={handleChange}
          required
        />
        <input
          name="codigoBarras"
          placeholder="Código de Barras"
          value={produto.codigoBarras || ''}
          onChange={handleChange}
          required
        />
        <input
          name="tipo"
          placeholder="Tipo"
          value={produto.tipo || ''}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {produto.imagem && (
          <div style={{ marginTop: 10 }}>
            <img
              src={produto.imagem}
              alt="Imagem do Produto"
              style={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                border: '1px solid #ccc',
                borderRadius: 4
              }}
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: 10 }}>
          {id ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </form>

      <button onClick={() => navigate('/')} style={{ marginTop: 10 }}>
        Cancelar
      </button>
    </div>
  );
}

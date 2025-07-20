import React, { useEffect, useState } from 'react';
import { fetchProdutos } from '../api/produtoService';
import ProdutoItem from './ProdutoItem';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function ProdutoList() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [sessaoSelecionada, setSessaoSelecionada] = useState('Todas');
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  const carregar = () => {
    fetchProdutos()
      .then(res => setProdutos(res.data))
      .catch(err => console.error(err));
  };

  // 🔹 Gerar lista única de sessões disponíveis
  const sessoesUnicas = Array.from(
    new Set(produtos.map(p => p.sessao || 'Sem Sessão'))
  ).sort();

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // 🔹 Agrupar por sessão
  const produtosPorSessao = produtosFiltrados.reduce((acc, produto) => {
    const sessao = produto.sessao || 'Sem Sessão';
    if (!acc[sessao]) acc[sessao] = [];
    acc[sessao].push(produto);
    return acc;
  }, {});

  const sessoesOrdenadas = Object.keys(produtosPorSessao).sort();

  // 🔹 Definir sessões para exibir
  const sessoesParaExibir = sessaoSelecionada === 'Todas'
    ? sessoesOrdenadas
    : [sessaoSelecionada];

  const gerarPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório de Produtos por Sessão', 105, 20, { align: 'center' });

  let currentY = 30;

  sessoesParaExibir.forEach((sessao, index) => {
  const produtosSessao = produtosPorSessao[sessao];
  if (!produtosSessao || produtosSessao.length === 0) {
    return; // pula sessões vazias
  }

  if (index > 0) {
    currentY += 10; // espaço entre sessões
  }

  doc.setFontSize(12);
  doc.text(`Sessão: ${sessao}`, 14, currentY);
  currentY += 6;

  // ✅ Usa retorno direto
 const result = autoTable(doc, {
  startY: currentY,
  head: [['Nome', 'Marca', 'Validade', 'Código de Barras']],
  body: produtosSessao
    .sort((a, b) => a.marca.localeCompare(b.marca))
    .map(p => [
      p.nome,
      p.marca,
      dayjs(p.validade).format('DD/MM/YYYY'),
      p.codigoBarras
    ]),
  styles: { fontSize: 10 },
  headStyles: { fillColor: [41, 128, 185] },
  margin: { left: 14, right: 14 }
});

// AQUI está a diferença:
const finalY = result?.finalY ?? doc.previousAutoTable?.finalY ?? (currentY + 30);
currentY = finalY + 15;

});

  doc.save('produtos-por-sessao.pdf');
};


  return (
    <div style={{ display: 'flex', padding: 20, gap: 20 }}>
      
      {/* COLUNA ESQUERDA - AÇÕES */}
      <div style={{
        flex: 1,
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 16,
        height: 'fit-content',
        alignSelf: 'flex-start',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>Ações</h3>
        <button onClick={gerarPDF} style={{ display: 'block', width: '100%', marginBottom: 10 }}>
          Gerar PDF
        </button>
        <button onClick={() => navigate('/novo')} style={{ display: 'block', width: '100%' }}>
          Cadastrar Novo
        </button>
      </div>

      {/* COLUNA DIREITA - LISTA AGRUPADA */}
      <div style={{ flex: 3, border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
        <h2>Produtos por Sessão</h2>

        {/* 🔽 BUSCA E FILTRO DE SESSÃO */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Buscar por nome"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              flex: 2,
              padding: 10,
              fontSize: 14,
              borderRadius: 4,
              border: '1px solid #ccc'
            }}
          />

          <select
            value={sessaoSelecionada}
            onChange={e => setSessaoSelecionada(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              fontSize: 14,
              borderRadius: 4,
              border: '1px solid #ccc'
            }}
          >
            <option value="Todas">Todas as Sessões</option>
            {sessoesUnicas.map(sessao => (
              <option key={sessao} value={sessao}>{sessao}</option>
            ))}
          </select>
        </div>

        {/* 🔹 LISTA AGRUPADA POR SESSÃO */}
        {sessoesParaExibir.map(sessao => (
          produtosPorSessao[sessao] && produtosPorSessao[sessao].length > 0 && (
            <div key={sessao} style={{ marginBottom: 30 }}>
              <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: 4 }}>
                🔹 Sessão: {sessao}
              </h4>

              {/* Cabeçalho estilo tabela */}
              <div style={{ display: 'flex', fontWeight: 'bold', backgroundColor: '#eee', padding: '8px 0' }}>
                <div style={{ flex: 2, paddingLeft: 8 }}>Imagem</div>
                <div style={{ flex: 2 }}>Nome</div>
                <div style={{ flex: 2 }}>Marca</div>
                <div style={{ flex: 2 }}>Validade</div>
                <div style={{ flex: 3 }}>Código</div>
                <div style={{ flex: 2 }}>Ações</div>
              </div>

              {produtosPorSessao[sessao]
                .sort((a, b) => a.marca.localeCompare(b.marca))
                .map(p => (
                  <ProdutoItem key={p.id} produto={p} onDelete={carregar} />
                ))}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

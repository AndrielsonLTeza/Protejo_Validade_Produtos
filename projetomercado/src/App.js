import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProdutoList from './components/ProdutoList';
import ProdutoForm from './components/ProdutoForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProdutoList />} />
        <Route path="/novo" element={<ProdutoForm />} />
        <Route path="/editar/:id" element={<ProdutoForm />} />

      </Routes>
    </BrowserRouter>
  );
}

package com.mercado.validade.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mercado.validade.model.Produto;
import com.mercado.validade.repository.ProdutoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repo;

    public Produto save(Produto produto) {
        return repo.save(produto);
    }

    public List<Produto> listAll() {
        return repo.findAll();
    }

    public Page<Produto> listAllPaginado(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public List<Produto> searchByNome(String nome) {
        return repo.findByNomeContainingIgnoreCase(nome);
    }

    public Optional<Produto> searchByCodigoBarras(String codigo) {
        return repo.findByCodigoBarras(codigo);
    }

    public List<Produto> listVencidos() {
        return repo.findVencidos();
    }

    public List<Produto> listProximosVencer() {
        return repo.findProximosVencer();
    }

    public void delete(UUID id) {
        repo.deleteById(id);
    }
}

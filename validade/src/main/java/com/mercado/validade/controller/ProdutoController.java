package com.mercado.validade.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.mercado.validade.model.Produto;
import com.mercado.validade.service.ProdutoService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://100.96.93.80:3000")
@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;

    @PostMapping
    public ResponseEntity<Produto> criar(@RequestBody Produto produto) {
        Produto criado = service.save(produto);
        return new ResponseEntity<>(criado, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable UUID id, @RequestBody Produto produto) {
        produto.setId(id);
        Produto atualizado = service.save(produto);
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/paginado")
    public ResponseEntity<Page<Produto>> listarPaginado(Pageable pageable) {
        return ResponseEntity.ok(service.listAllPaginado(pageable));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Produto>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.searchByNome(nome));
    }

    @GetMapping("/codigo")
    public ResponseEntity<Produto> buscarPorCodigo(@RequestParam String codigo) {
        return service.searchByCodigoBarras(codigo)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    @GetMapping("/vencidos")
    public ResponseEntity<List<Produto>> vencidos() {
        return ResponseEntity.ok(service.listVencidos());
    }

    @GetMapping("/proximos-vencer")
    public ResponseEntity<List<Produto>> proximosVencer() {
        return ResponseEntity.ok(service.listProximosVencer());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

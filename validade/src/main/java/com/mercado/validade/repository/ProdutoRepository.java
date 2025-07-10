package com.mercado.validade.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercado.validade.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findByNomeContainingIgnoreCase(String nome);
    Optional<Produto> findByCodigoBarras(String codigoBarras);

    @Query("SELECT p FROM Produto p WHERE p.validade < CURRENT_DATE")
    List<Produto> findVencidos();

    @Query(value = """
        SELECT * FROM produto 
        WHERE validade BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
        """, nativeQuery = true)
    List<Produto> findProximosVencer();
}


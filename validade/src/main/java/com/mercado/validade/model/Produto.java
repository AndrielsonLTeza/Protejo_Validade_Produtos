package com.mercado.validade.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue
    private UUID id;

    private String nome;
    private String marca;
    private String imagem;
    private LocalDate validade;
    private String sessao;
    private String tipo;
    private String codigoBarras;
}

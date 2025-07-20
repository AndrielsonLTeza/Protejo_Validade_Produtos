package com.mercado.validade.controller;

import com.mercado.validade.model.Sessao;
import com.mercado.validade.repository.SessaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sessoes")
public class SessaoController {

    private final SessaoRepository sessaoRepository;

    @Autowired
    public SessaoController(SessaoRepository sessaoRepository) {
        this.sessaoRepository = sessaoRepository;
    }

    @GetMapping
    public List<Sessao> listarTodas() {
        return sessaoRepository.findAll();
    }
}

package com.mercado.validade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://100.96.93.80:3000")
public class UploadController {

    private static final String UPLOAD_BASE_DIR = "C:/Users/andri/Downloads/validade/uploads/";

    private static final Set<String> SESSOES_VALIDAS = Set.of(
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "padaria", "frios"
    );

    @PostMapping("/{sessao}")
    public ResponseEntity<?> uploadImagem(
            @PathVariable String sessao,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Arquivo vazio.");
        }

        if (!SESSOES_VALIDAS.contains(sessao)) {
            return ResponseEntity.badRequest().body("Sessão inválida: " + sessao);
        }

        try {
            String folderPath = UPLOAD_BASE_DIR + sessao + "/";
            Files.createDirectories(Paths.get(folderPath));

            String filename = UUID.randomUUID() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
            Path filepath = Paths.get(folderPath, filename);
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);

            String url = "http://100.96.93.80:8080/uploads/" + sessao + "/" + filename;
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    
}

package com.atmosfera.controller;

import com.atmosfera.model.Registro;
import com.atmosfera.repository.RegistroRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registros")
@CrossOrigin(origins = "*")
public class RegistroController {

    private final RegistroRepository repository;

    public RegistroController(RegistroRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/ultimas-24h")
    public List<Registro> listarUltimas24h() {
        return repository.findUltimas24Horas();
    }

    @GetMapping
    public List<Registro> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Registro salvarRegistro(@RequestBody Registro registro) {
        return repository.save(registro);
    }
}
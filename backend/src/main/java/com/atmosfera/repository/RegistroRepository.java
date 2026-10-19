package com.atmosfera.repository;

import com.atmosfera.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, Long> {

    @Query(value = "SELECT * FROM registros WHERE data_hora >= NOW() - INTERVAL 24 HOUR ORDER BY data_hora ASC", nativeQuery = true)
    List<Registro> findUltimas24Horas();
}
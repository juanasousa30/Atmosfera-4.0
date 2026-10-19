package com.atmosfera.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registros")
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_registro;

    @Column(name = "id_dispositivo_fk", nullable = false)
    private Integer idDispositivoFk;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    private Float temperatura;
    private Float umidade;
    private Float pressao;
    private Float altitude;
    private Float luminosidade;

    @Column(name = "velocidade_vento")
    private Float velocidadeVento;

    @Column(name = "direcao_vento")
    private Integer direcaoVento;

    @Column(name = "intensidade_wifi")
    private Integer intensidadeWifi;

    @PrePersist
    public void prePersist() {
        if (this.dataHora == null) {
            this.dataHora = LocalDateTime.now();
        }
    }

    // Getters e Setters
    public Long getId_registro() { return id_registro; }
    public void setId_registro(Long id_registro) { this.id_registro = id_registro; }

    public Integer getIdDispositivoFk() { return idDispositivoFk; }
    public void setIdDispositivoFk(Integer idDispositivoFk) { this.idDispositivoFk = idDispositivoFk; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public Float getTemperatura() { return temperatura; }
    public void setTemperatura(Float temperatura) { this.temperatura = temperatura; }

    public Float getUmidade() { return umidade; }
    public void setUmidade(Float umidade) { this.umidade = umidade; }

    public Float getPressao() { return pressao; }
    public void setPressao(Float pressao) { this.pressao = pressao; }

    public Float getAltitude() { return altitude; }
    public void setAltitude(Float altitude) { this.altitude = altitude; }

    public Float getLuminosidade() { return luminosidade; }
    public void setLuminosidade(Float luminosidade) { this.luminosidade = luminosidade; }

    public Float getVelocidadeVento() { return velocidadeVento; }
    public void setVelocidadeVento(Float velocidadeVento) { this.velocidadeVento = velocidadeVento; }

    public Integer getDirecaoVento() { return direcaoVento; }
    public void setDirecaoVento(Integer direcaoVento) { this.direcaoVento = direcaoVento; }

    public Integer getIntensidadeWifi() { return intensidadeWifi; }
    public void setIntensidadeWifi(Integer intensidadeWifi) { this.intensidadeWifi = intensidadeWifi; }
}
const URL_API = 'http://localhost:8080/api/registros';
let idIntervalo = null;

/* Configuração do Gráfico */

const ctx = document.getElementById('graficoSimulacao').getContext('2d');
const graficoSimulacao = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Temperatura (°C)', data: [], borderColor: '#38bdf8', fill: false, tension: 0.3 },
            { label: 'Umidade (%)', data: [], borderColor: '#4ade80', fill: false, tension: 0.3 },
            { label: 'Vento (km/h)', data: [], borderColor: '#a855f7', fill: false, tension: 0.3 }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#f8fafc' } } },
        scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } }
    }
});

/* Atualizar Dados */

function atualizarInterfaceVisual(dados) {
    document.getElementById('cardTemp').innerText = `${dados.temperatura} °C`;
    document.getElementById('cardUmidade').innerText = `${dados.umidade} %`;
    document.getElementById('cardPressao').innerText = `${dados.pressao} hPa`;
    document.getElementById('cardAltitude').innerText = `${dados.altitude} m`;
    document.getElementById('cardLuminosidade').innerText = `${dados.luminosidade} Lux`;
    document.getElementById('cardVento').innerText = `${dados.velocidadeVento} km/h`;
    document.getElementById('cardDirecao').innerText = `${dados.direcaoVento} °`;
    document.getElementById('cardWifi').innerText = `${dados.intensidadeWifi} dBm`;

    const horaFormatada = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (graficoSimulacao.data.labels.length >= 10) {
        graficoSimulacao.data.labels.shift();
        graficoSimulacao.data.datasets[0].data.shift();
        graficoSimulacao.data.datasets[1].data.shift();
        graficoSimulacao.data.datasets[2].data.shift();
    }

    graficoSimulacao.data.labels.push(horaFormatada);
    graficoSimulacao.data.datasets[0].data.push(dados.temperatura);
    graficoSimulacao.data.datasets[1].data.push(dados.umidade);
    graficoSimulacao.data.datasets[2].data.push(dados.velocidadeVento);
    graficoSimulacao.update();
}

/* Atualizar Console */

function adicionarLog(mensagem, tipo = '') {
    const elementoLog = document.getElementById('painelLog');
    const hora = new Date().toLocaleTimeString();
    const classe = tipo === 'ok' ? 'sucesso' : (tipo === 'erro' ? 'erro' : '');
    
    elementoLog.innerHTML += `<div class="${classe}">[${hora}] ${mensagem}</div>`;
    elementoLog.scrollTop = elementoLog.scrollHeight;
}

/* Enviar Requisição API */

async function dispararRequisicao(dados) {
    try {
        const resposta = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            adicionarLog(`✅ [POST ${resposta.status}] Gravado no MySQL com Sucesso!`, 'ok');
            atualizarInterfaceVisual(dados);
        } else {
            adicionarLog(`⚠️ [Erro ${resposta.status}] Falha ao gravar no banco.`, 'erro');
        }
    } catch (erro) {
        adicionarLog(`❌ Erro ao conectar na API Java: ${erro.message}`, 'erro');
    }
}

/* Envio Manual de Dados */

function enviarEnvioManual() {
    const dados = {
        idDispositivoFk: parseInt(document.getElementById('idDispositivoFk').value),
        temperatura: parseFloat(document.getElementById('temperatura').value),
        umidade: parseFloat(document.getElementById('umidade').value),
        pressao: parseFloat(document.getElementById('pressao').value),
        altitude: parseFloat(document.getElementById('altitude').value),
        luminosidade: parseFloat(document.getElementById('luminosidade').value),
        velocidadeVento: parseFloat(document.getElementById('velocidadeVento').value),
        direcaoVento: parseInt(document.getElementById('direcaoVento').value),
        intensidadeWifi: parseInt(document.getElementById('intensidadeWifi').value)
    };

    adicionarLog('Enviando medição manual...');
    dispararRequisicao(dados);
}

/* Envio Aleatorio de Dados*/

function gerarDadosAleatorios() {
    return {
        idDispositivoFk: 2,
        temperatura: parseFloat((Math.random() * (35 - 18) + 18).toFixed(1)),
        umidade: parseFloat((Math.random() * (90 - 40) + 40).toFixed(1)),
        pressao: parseFloat((Math.random() * (1020 - 1005) + 1005).toFixed(1)),
        altitude: 750.0,
        luminosidade: parseFloat((Math.random() * (1000 - 100) + 100).toFixed(1)),
        velocidadeVento: parseFloat((Math.random() * (30 - 2) + 2).toFixed(1)),
        direcaoVento: Math.floor(Math.random() * 360),
        intensidadeWifi: Math.floor(Math.random() * (-50 - (-85) + 1)) - 85
    };
}

/* Envio Automatico de Dados */

function iniciarAutomacao() {
    const tempoSegundos = parseInt(document.getElementById('intervaloSegundos').value) || 3;
    const tempoMilissegundos = tempoSegundos * 1000;

    document.getElementById('btnIniciarAuto').style.display = 'none';
    document.getElementById('btnPararAuto').style.display = 'block';
    document.getElementById('intervaloSegundos').disabled = true;

    adicionarLog(`▶️ Modo Automático iniciado (a cada ${tempoSegundos}s)...`, 'ok');

    dispararRequisicao(gerarDadosAleatorios());

    idIntervalo = setInterval(() => {
        dispararRequisicao(gerarDadosAleatorios());
    }, tempoMilissegundos);
}

/* Parar Envio Automatico de Dados */

function pararAutomacao() {
    clearInterval(idIntervalo);
    document.getElementById('btnIniciarAuto').style.display = 'block';
    document.getElementById('btnPararAuto').style.display = 'none';
    document.getElementById('intervaloSegundos').disabled = false;
    adicionarLog('⏹️ Modo Automático parado.', 'erro');
}
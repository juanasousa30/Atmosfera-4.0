/* Declaração de Gráficos */

const canvasTempUmidade = document.getElementById('graficoTempUmidade').getContext('2d');
const canvasAmbiente = document.getElementById('graficoAmbiente').getContext('2d');

/* Configuração do Gráfico de Temperatura, Umidade e Vento */

let graficoTempUmidade = new Chart(canvasTempUmidade, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Temperatura (°C)', data: [], borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', fill: true, tension: 0.3 },
            { label: 'Umidade (%)', data: [], borderColor: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', fill: true, tension: 0.3 },
            { label: 'Vento (km/h)', data: [], borderColor: '#a855f7', fill: true, tension: 0.3 }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#f8fafc' } } },
        scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } }
    }
});

/* Configurações do Gráfico de Pressão e Luminosidade */

let graficoAmbiente = new Chart(canvasAmbiente, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Pressão (hPa)', data: [], borderColor: '#facc15', fill: true, tension: 0.3 },
            { label: 'Luminosidade (Lux)', data: [], borderColor: '#f97316', fill: true, tension: 0.3 }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#f8fafc' } } },
        scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } }
    }
});

/* Carrega os Dados do Banco */

async function carregarDadosDaAPI() {
    try {
        const resposta = await fetch('http://localhost:8080/api/registros/ultimas-24h');
        const registros = await resposta.json();

        if (!registros || registros.length === 0) return;

        const horarios = registros.map(item => {
            const data = new Date(item.dataHora);
            return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        });

        const u = registros[registros.length - 1];
        document.getElementById('valTemperatura').innerText = u.temperatura !== null ? `${u.temperatura} °C` : '--';
        document.getElementById('valUmidade').innerText = u.umidade !== null ? `${u.umidade} %` : '--';
        document.getElementById('valPressao').innerText = u.pressao !== null ? `${u.pressao} hPa` : '--';
        document.getElementById('valAltitude').innerText = u.altitude !== null ? `${u.altitude} m` : '--';
        document.getElementById('valLuminosidade').innerText = u.luminosidade !== null ? `${u.luminosidade} Lux` : '--';
        document.getElementById('valVelocidadeVento').innerText = u.velocidadeVento !== null ? `${u.velocidadeVento} km/h` : '--';
        document.getElementById('valDirecaoVento').innerText = u.direcaoVento !== null ? `${u.direcaoVento} °` : '--';
        if (u.direcaoVento !== null) {
            document.getElementById('agulhaBussola').style.transform = `rotate(${u.direcaoVento}deg)`
        }
        document.getElementById('valIntensidadeWifi').innerText = u.intensidadeWifi !== null ? `${u.intensidadeWifi} dBm` : '--';

        /* Coloca os Dados no Gráfico */

        graficoTempUmidade.data.labels = horarios;
        graficoTempUmidade.data.datasets[0].data = registros.map(r => r.temperatura);
        graficoTempUmidade.data.datasets[1].data = registros.map(r => r.umidade);
        graficoTempUmidade.data.datasets[2].data = registros.map(r => r.velocidadeVento);
        graficoTempUmidade.update();

        graficoAmbiente.data.labels = horarios;
        graficoAmbiente.data.datasets[0].data = registros.map(r => r.pressao);
        graficoAmbiente.data.datasets[1].data = registros.map(r => r.luminosidade);
        graficoAmbiente.update();

    } catch (erro) {
        console.error('Erro ao conectar com a API Java:', erro);
    }
}

carregarDadosDaAPI();
setInterval(carregarDadosDaAPI, 3000);
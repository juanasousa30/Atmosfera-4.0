const elementoCanvas = document.getElementById('grafico-temperatura').getContext('2d');

let meuGrafico = new Chart(elementoCanvas, {
    type: 'line',
    data: {
        labels: horarios,
        datasets: [{
            label: 'Temperatura (°C)',
            data: temperaturas,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#f8fafc'}
            }
        },
        scales: {
            x: { ticks: { color: '#94a3b8' }},
            y: { ticks: { color: '#94a3b8' }}
        }
    }
});

async function carregarDadosDaAPI() {
    try {
        const resposta = await fetch('http://localhost:8080/api/registros/ultimas-24h')
        const registros = await resposta.json();

        if (registros.length === 0) return;

        const horarios = registros.map(item => {
            const data = new Date(item.dataHora);
            return data.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        });

        const temperaturas = registros.map(item => item.temperatura);

        const ultimoRegistro = registros[registros.length - 1];
        document.querySelectorAll('.cartao .valor')[0].innerText = `${ultimoRegistro.temperatura} °C`;
        document.querySelectorAll('.cartao .valor')[1].innerText = `${ultimoRegistro.umidade} %`;
        document.querySelectorAll('.cartao .valor')[2].innerText = `${ultimoRegistro.pressao} hPa`;
        document.querySelectorAll('.cartao .valor')[3].innerText = `${ultimoRegistro.luminosidade} Lux`;

        meuGrafico.data.labels = horarios;
        meuGrafico.data.datasets[0].data = temperaturas;
        meuGrafico.update();
    } catch (erro) {
        console.error('Erro ao conectar ao backend:', erro);
    }
}

carregarDadosDaAPI();
setInterval(carregarDadosDaAPI, 5000);
const elementoCanvas = document.getElementById('grafico-temperatura').getContext('2d');
const horarios = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
const temperaturas = [21.5, 23.0, 26.4, 25.8, 24.5];
const meuGrafico = new Chart(elementoCanvas, {
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

async function carregarDadosDoBanco() {
    const resposta = await fetch('http://localhost:3000/api/registros');
    const dados = await resposta.json();

    meuGrafico.data.labels = dados.map(item => item.data_hora);
    meuGrafico.data.datasets[0].data = dados.map(item => item.temperatura);
    meuGrafico.update();
}
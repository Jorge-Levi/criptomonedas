// Variables globales para Chart.js
let priceChart = null; // Inicializamos como null

// Lista de criptomonedas populares
const criptomonedasPopulares = [
    { id: 'bitcoin', name: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'cardano', name: 'Cardano' },
    { id: 'binancecoin', name: 'Binance Coin' },
    { id: 'ripple', name: 'Ripple' },
    { id: 'solana', name: 'Solana' },
    { id: 'polkadot', name: 'Polkadot' },
    { id: 'dogecoin', name: 'Dogecoin' },
    { id: 'litecoin', name: 'Litecoin' },
    { id: 'chainlink', name: 'Chainlink' }
];

// Función para inicializar el selector de criptomonedas con una lista limitada de criptomonedas populares
function inicializarSelectorCriptos() {
    const select = document.getElementById('crypto-select');

    // Añadir opciones al selector de criptomonedas populares
    criptomonedasPopulares.forEach(cripto => {
        const option = document.createElement('option');
        option.value = cripto.id;
        option.textContent = cripto.name;
        select.appendChild(option);
    });

    // Configurar evento para actualizar datos cuando se seleccione una criptomoneda
    select.addEventListener('change', () => {
        obtenerDatosCripto(select.value);
        obtenerDatosHistoricos(select.value);
    });

    // Seleccionar la primera criptomoneda al cargar
    obtenerDatosCripto(select.value);
    obtenerDatosHistoricos(select.value);
}

// Función para obtener datos de precios de una criptomoneda seleccionada
async function obtenerDatosCripto(idCripto = 'bitcoin') {
    try {
        const respuesta = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(`https://api.coingecko.com/api/v3/simple/price?ids=${idCripto}&vs_currencies=usd`));
        if (!respuesta.ok) {
            throw new Error('Error en la solicitud a la API');
        }
        const datos = await respuesta.json();
        const contenido = JSON.parse(datos.contents);
        mostrarDatosCripto(contenido);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        const contenedor = document.getElementById('data-container');
        contenedor.innerHTML = '<p>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</p>';
    }
}

// Función para mostrar los datos de una criptomoneda en la interfaz de usuario
function mostrarDatosCripto(datos) {
    const contenedor = document.getElementById('data-container');
    contenedor.innerHTML = '';
    for (const [moneda, valores] of Object.entries(datos)) {
        contenedor.innerHTML += `<p>${moneda.toUpperCase()}: $${valores.usd.toFixed(2)}</p>`;
    }
}

// Función para obtener datos históricos de una criptomoneda y mostrar un gráfico
async function obtenerDatosHistoricos(idCripto = 'bitcoin') {
    try {
        const respuesta = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(`https://api.coingecko.com/api/v3/coins/${idCripto}/market_chart?vs_currency=usd&days=7`));
        if (!respuesta.ok) {
            throw new Error('Error en la solicitud de datos históricos');
        }
        const datos = await respuesta.json();
        const contenido = JSON.parse(datos.contents);
        
        // Asegurarse de que los datos se procesen correctamente
        const precios = contenido.prices.map(price => ({
            x: new Date(price[0]),
            y: price[1]
        }));
        
        mostrarGraficoPrecios(precios);
    } catch (error) {
        console.error('Error al obtener datos históricos:', error);
    }
}

// Función para mostrar el gráfico de precios
function mostrarGraficoPrecios(datos) {
    const canvas = document.getElementById('priceChart');
    const ctx = canvas.getContext('2d');

    // Verificar si el gráfico ya existe antes de destruirlo
    if (priceChart !== null) {
        priceChart.destroy(); // Destruir gráfico anterior si existe
        priceChart = null; // Asegurarse de que priceChart se reinicie

        // Reiniciar el canvas para evitar problemas de reutilización
        canvas.width = canvas.width;
    }

    // Crear un nuevo gráfico
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Precio en USD',
                data: datos, // Asegúrate de que los datos están en formato [{x: Date, y: Number}]
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'dd MMM yyyy'
                    },
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Precio (USD)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// Inicializar selector y cargar datos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarSelectorCriptos();
    setInterval(() => {
        const criptoSeleccionada = document.getElementById('crypto-select').value;
        obtenerDatosCripto(criptoSeleccionada);
        obtenerDatosHistoricos(criptoSeleccionada);
    }, 10000); // Actualiza cada 10 segundos
});

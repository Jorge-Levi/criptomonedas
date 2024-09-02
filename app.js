// Variables globales para Chart.js
let priceChart = null; // Inicializamos como null
const cache = {}; // Caché para almacenar los resultados de la API

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
        const criptoSeleccionada = select.value;
        obtenerDatosCripto(criptoSeleccionada);
        obtenerDatosHistoricos(criptoSeleccionada);
    });

    // Seleccionar la primera criptomoneda al cargar
    const criptoInicial = select.value;
    obtenerDatosCripto(criptoInicial);
    obtenerDatosHistoricos(criptoInicial);
}

// Función para obtener datos de precios de una criptomoneda seleccionada
async function obtenerDatosCripto(idCripto = 'bitcoin') {
    try {
        if (cache[idCripto]) {
            mostrarDatosCripto(cache[idCripto]);
            return;
        }

        const respuesta = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(`https://api.coingecko.com/api/v3/simple/price?ids=${idCripto}&vs_currencies=usd`));
        if (!respuesta.ok) {
            throw new Error('Error en la solicitud a la API');
        }
        const datos = await respuesta.json();
        const contenido = JSON.parse(datos.contents);

        // Verificar si la respuesta contiene un error de límite de tasa
        if (contenido.status && contenido.status.error_code === 429) {
            throw new Error('Has excedido el límite de solicitudes. Por favor, espera un momento antes de intentar nuevamente.');
        }

        // Verificar que los datos existen antes de usarlos
        if (!contenido || !contenido[idCripto] || typeof contenido[idCripto].usd === 'undefined') {
            throw new Error('Datos no disponibles para la criptomoneda seleccionada');
        }

        cache[idCripto] = contenido; // Guardar en caché
        mostrarDatosCripto(contenido);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        const contenedor = document.getElementById('data-container');
        contenedor.innerHTML = `<p>${error.message}</p>`;
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

        // Verificar que los datos existen antes de usarlos
        if (!contenido || !contenido.prices || contenido.prices.length === 0) {
            throw new Error('Datos históricos no disponibles para la criptomoneda seleccionada');
        }

        const precios = contenido.prices.map(price => ({
            x: new Date(price[0]),
            y: price[1]
        }));

        mostrarGraficoPrecios(precios);
    } catch (error) {
        console.error('Error al obtener datos históricos:', error);
        const contenedor = document.getElementById('data-container');
        contenedor.innerHTML += `<p>${error.message}</p>`;
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
            responsive: true, // Hacer que el gráfico sea responsive
            maintainAspectRatio: false, // Permitir que la altura del gráfico cambie para ajustarse al contenedor
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
    }, 60000); // Actualiza cada 60 segundos
});

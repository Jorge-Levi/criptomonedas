# Visualizador de Precios de Criptomonedas en Tiempo RealVisualizador de Precios de Criptomonedas en Tiempo Real
Este proyecto es una página web que muestra los precios actuales de varias criptomonedas populares y gráficos de su evolución histórica. La información se obtiene de la API de CoinGecko y se actualiza automáticamente en intervalos regulares.

## Enlaces
- Página Web: https://criptomonedascurrency.netlify.app/
- Repositorio en GitHub: https://github.com/Jorge-Levi/criptomonedas
## Características
- Visualización en Tiempo Real: Muestra los precios actuales de criptomonedas como Bitcoin, Ethereum, Cardano, y más.
- Gráficos Históricos: Incluye gráficos interactivos que muestran la evolución del precio de cada criptomoneda en los últimos 7 días.
- Interfaz Responsive: La página es completamente responsive, asegurando una visualización óptima en dispositivos móviles y de escritorio.
- Manejo de Errores: Implementa manejo de errores robusto para lidiar con límites de solicitud y datos faltantes.
## Requisitos Previos
Para ejecutar este proyecto, necesitas:
- Un navegador web moderno (Chrome, Firefox, Edge, etc.)
- Conexión a Internet para acceder a la API de CoinGecko
## InstalaciónInstalación
1. Clona el repositorio:
```bash
git clone https://github.com/Jorge-Levi/criptomonedas.git
```
2. Navega al directorio del proyecto:
```bash
cd criptomonedas
```
3. Abre el archivo index.html en tu navegador:
Puedes hacerlo haciendo doble clic en el archivo index.html o ejecutando un servidor local si prefieres.
```bash
open index.html
```
## Uso
1. Selector de Criptomonedas:
- Usa el menú desplegable en la parte superior de la página para seleccionar una criptomoneda específica.
- La página mostrará el precio actual de la criptomoneda seleccionada junto con un gráfico de su evolución en los últimos 7 días.
2. Actualización Automática:
- Los precios y los gráficos se actualizan automáticamente cada 60 segundos.
## Tecnologías Utilizadas
- HTML5: Estructura básica de la página.
- CSS3: Estilos y diseño responsive.
- JavaScript (ES6+): Lógica de la aplicación y manejo de la API.
- Chart.js: Librería para gráficos interactivos.
- CoinGecko API: Fuente de datos de criptomonedas.
- AllOrigins: Proxy para manejar restricciones CORS en solicitudes API.
## Estructura del Proyecto
- index.html - Estructura principal de la página.
- styles.css - Estilos para la interfaz de usuario.
- app.js - Lógica de la aplicación y manejo de la API.
- README.md - Descripción del proyecto y cómo utilizarlo.
## Limitaciones
- Límites de la API: La API de CoinGecko tiene límites de solicitudes. Si se exceden, las solicitudes futuras serán bloqueadas temporalmente.
- Datos Incompletos: Algunas criptomonedas pueden no tener datos históricos disponibles, lo que resulta en errores o gráficos vacíos.
## Contribuciones
Las contribuciones son bienvenidas. Por favor, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza tus cambios y haz commit (git commit -am 'Añadir nueva funcionalidad').
4. Envía tu rama (git push origin feature/nueva-funcionalidad).
5. Abre un Pull Request.
## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Créditos
Este proyecto utiliza datos de la API de CoinGecko. Gracias a CoinGecko por proporcionar esta API gratuita.


// URL del endpoint de la API para obtener datos de la bomba
const API_URL = '/api/pump_data';

// Intervalo de tiempo en milisegundos para refrescar los datos (3 segundos).
const REFRESH_INTERVAL = 5000;

// --- Referencias a elementos del DOM para actualizar ---
const pumpModel = document.getElementById('pumpModel');
const pumpSerial = document.getElementById('pumpSerial');
const pumpSoftwareVersion = document.getElementById('pumpSoftwareVersion');

const alarmsList = document.getElementById('alarmsList');

const systemPressure = document.getElementById('systemPressure');
const battery1Voltage = document.getElementById('battery1Voltage');
const battery2Voltage = document.getElementById('battery2Voltage');
const startCount = document.getElementById('startCount');
const cutInPressure = document.getElementById('cutInPressure');
const cutOutPressure = document.getElementById('cutOutPressure');

// --- Lógica del Modal de Detalle de Alarma ---
const alarmDetailModal = document.getElementById('alarmDetailModal');
const closeButton = document.querySelector('.close-button');

const modalDescription = document.getElementById('modalDescription');
const modalTimestamp = document.getElementById('modalTimestamp');
const modalLocation = document.getElementById('modalLocation');
const modalPlant = document.getElementById('modalPlant');
const modalCoordinates = document.getElementById('modalCoordinates');
const modalSolution = document.getElementById('modalSolution');

// Función para abrir el modal y mostrar los detalles de la alarma
function openAlarmDetailModal(alarmData) {
    modalDescription.textContent = alarmData.description || 'N/A';
    modalTimestamp.textContent = alarmData.timestamp ? new Date(alarmData.timestamp).toLocaleString() : 'N/A';
    modalLocation.textContent = alarmData.location || 'N/A';
    modalPlant.textContent = alarmData.plant || 'N/A';
    modalCoordinates.textContent = alarmData.coordinates || 'N/A';
    modalSolution.textContent = alarmData.solution || 'N/A';
    alarmDetailModal.style.display = 'flex'; // Usar flex para centrar
}

// Función para cerrar el modal
function closeAlarmDetailModal() {
    alarmDetailModal.style.display = 'none';
}

// --- Función principal para obtener y renderizar datos ---
async function fetchAndRenderPumpData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Actualizar Información del Controlador
        if (pumpModel) pumpModel.textContent = data.model || 'N/A';
        if (pumpSerial) pumpSerial.textContent = data.serial_number || 'N/A';
        if (pumpSoftwareVersion) pumpSoftwareVersion.textContent = data.software_version || 'N/A';

        // Actualizar Estado del Sistema
        if (systemPressure) systemPressure.textContent = `${data.status.system_pressure || 'N/A'} PSI`;
        if (battery1Voltage) battery1Voltage.textContent = `${data.status.battery_1_voltage || 'N/A'} V`;
        if (battery2Voltage) battery2Voltage.textContent = `${data.status.battery_2_voltage || 'N/A'} V`;
        if (startCount) startCount.textContent = data.status.start_count || 'N/A';
        if (cutInPressure) cutInPressure.textContent = `${data.status.cut_in || 'N/A'} PSI`;
        if (cutOutPressure) cutOutPressure.textContent = `${data.status.cut_out || 'N/A'} PSI`;

        // Actualizar Alarmas Activas
        alarmsList.innerHTML = ''; // Limpiar lista actual
        if (data.alarms && data.alarms.length > 0) {
            data.alarms.forEach(alarm => {
                const listItem = document.createElement('li');
                listItem.className = 'alarm-item';
                listItem.dataset.alarm = JSON.stringify(alarm); // Guardar datos completos en el dataset
                listItem.innerHTML = `
                    <strong>${alarm.description}</strong>
                    <br><small>${alarm.timestamp ? new Date(alarm.timestamp).toLocaleString() : 'N/A'}</small>
                `;
                alarmsList.appendChild(listItem);
            });
        } else {
            const noAlarmsItem = document.createElement('li');
            noAlarmsItem.className = 'no-alarms';
            noAlarmsItem.textContent = 'No hay alarmas activas.';
            alarmsList.appendChild(noAlarmsItem);
        }

        // Re-adjuntar event listeners a las nuevas alarmas
        attachAlarmItemListeners();

    } catch (error) {
        console.error("Error al obtener o renderizar los datos de la bomba:", error);
        // Opcional: Mostrar un mensaje de error en el UI
        // dashboardContainer.innerHTML = `<p class="error-message">No se pudieron cargar los datos. Verifique la conexión con la API.</p>`;
    }
}

// URL del endpoint de la API para obtener datos históricos
const HISTORICAL_API_URL = '/api/historical_pump_data';

// Referencia a la tabla de datos históricos
const historicalDataTableBody = document.querySelector('#historicalDataTable tbody');

// Variables de paginación
let currentPage = 1;
const recordsPerPage = 20; // Mostrar 20 registros por página

// Referencias a los controles de paginación
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfoSpan = document.getElementById('pageInfo');

// Referencias para el gráfico
const historicalChartContainer = document.getElementById('historicalChartContainer');
let historicalChart; // Variable para almacenar la instancia del gráfico


// Función para obtener y renderizar datos históricos con paginación
async function fetchAndRenderHistoricalData(page = currentPage) {
    currentPage = page; // Actualizar la página actual

    try {
        const response = await fetch(`${HISTORICAL_API_URL}?page=${currentPage}&limit=${recordsPerPage}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // La API ahora devuelve un objeto con data y total_count
        const data = result.data;
        const totalCount = result.total_count;
        const totalPages = Math.ceil(totalCount / recordsPerPage);

        historicalDataTableBody.innerHTML = ''; // Limpiar tabla actual

        if (data.length > 0) {
            data.forEach(log => {
                const row = historicalDataTableBody.insertRow();
                row.insertCell().textContent = `${log.log_date} ${log.log_time}`;
                row.insertCell().textContent = `${log.discharge_pressure || 'N/A'} ${log.discharge_pressure_unit || ''}`;
                row.insertCell().textContent = `${log.battery1_voltage || 'N/A'} ${log.battery1_voltage_unit || ''}`;
                row.insertCell().textContent = `${log.battery1_current || 'N/A'} ${log.battery1_current_unit || ''}`;
                row.insertCell().textContent = log.motor_running === 1 ? 'Sí' : 'No';
                row.insertCell().textContent = log.message || 'N/A';
            });
        } else {
            const row = historicalDataTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6; // Span across all columns
            cell.textContent = 'No hay datos históricos disponibles.';
            cell.style.textAlign = 'center';
        }

        // Actualizar información de paginación
        pageInfoSpan.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

        // Renderizar el gráfico con los datos actuales
        renderHistoricalChart(data);

    } catch (error) {
        console.error("Error al obtener o renderizar los datos históricos:", error);
        pageInfoSpan.textContent = 'Error de carga';
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
    }
}

// Función para renderizar el gráfico histórico
function renderHistoricalChart(data) {
    // Destruir el gráfico existente si lo hay
    if (historicalChart) {
        historicalChart.destroy();
    }

    // Preparar datos para el gráfico
    const labels = data.map(log => `${log.log_date} ${log.log_time}`);
    const dischargePressureData = data.map(log => log.discharge_pressure);
    const battery1VoltageData = data.map(log => log.battery1_voltage);

    // Crear un canvas si no existe
    let chartCanvas = document.getElementById('historicalChartCanvas');
    if (!chartCanvas) {
        chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'historicalChartCanvas';
        historicalChartContainer.innerHTML = ''; // Limpiar cualquier contenido previo
        historicalChartContainer.appendChild(chartCanvas);
    }

    const ctx = chartCanvas.getContext('2d');
    historicalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Presión de Descarga (PSI)',
                    data: dischargePressureData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Voltaje Batería 1 (V)',
                    data: battery1VoltageData,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Fecha y Hora'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor'
                    }
                }
            }
        }
    });
}


// --- Lógica de Modo Oscuro ---
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Función para adjuntar listeners a los elementos de alarma
function attachAlarmItemListeners() {
    const alarmItems = document.querySelectorAll('.alarm-item');
    alarmItems.forEach(item => {
        item.removeEventListener('click', handleAlarmItemClick); // Evitar duplicados
        item.addEventListener('click', handleAlarmItemClick);
    });
}

// Manejador de clic para elementos de alarma
function handleAlarmItemClick(event) {
    try {
        const alarmData = JSON.parse(event.currentTarget.dataset.alarm);
        openAlarmDetailModal(alarmData);
    } catch (e) {
        console.error("Error parsing alarm data:", e);
    }
}

// URL del endpoint de la API para obtener todas las alarmas
const ALL_ALARMS_API_URL = '/api/all_alarms';

// Referencia a la tabla de todas las alarmas
const allAlarmsTableBody = document.getElementById('allAlarmsTableBody');

async function fetchAndRenderAllAlarms() {
    try {
        const response = await fetch(ALL_ALARMS_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        allAlarmsTableBody.innerHTML = ''; // Limpiar tabla actual

        if (data.length > 0) {
            data.forEach(alarm => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${alarm.log_date}</td>
                    <td>${alarm.log_time}</td>
                    <td>${alarm.event_id}</td>
                    <td>${alarm.message}</td>
                `;
                allAlarmsTableBody.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4">No hay alarmas disponibles.</td>`;
            allAlarmsTableBody.appendChild(tr);
        }

    } catch (error) {
        console.error("Error al obtener o renderizar todas las alarmas:", error);
        allAlarmsTableBody.innerHTML = `<tr><td colspan="4">Error al cargar las alarmas.</td></tr>`;
    }
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que el modal de detalle de alarma esté oculto al cargar la página
    alarmDetailModal.style.display = 'none';

    // Cargar preferencia de tema guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'dark-mode') {
            darkModeToggle.textContent = 'Modo Claro';
        } else {
            darkModeToggle.textContent = 'Modo Oscuro';
        }
    }

    // Alternar modo oscuro al hacer clic en el botón
    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
            darkModeToggle.textContent = 'Modo Oscuro';
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            darkModeToggle.textContent = 'Modo Claro';
        }
    });

    // Iniciar la carga de datos y el intervalo
    fetchAndRenderPumpData(); // Carga inicial
    setInterval(fetchAndRenderPumpData, REFRESH_INTERVAL);

    // Carga inicial de datos del historial reciente
    fetchAndRenderRecentHistoryData();

    // Carga inicial de todas las alarmas
    fetchAndRenderAllAlarms();

    // Event listeners para paginación del historial reciente
    prevPageRecentBtn.addEventListener('click', () => {
        if (currentPageRecent > 1) {
            fetchAndRenderRecentHistoryData(currentPageRecent - 1);
        }
    });

    nextPageRecentBtn.addEventListener('click', () => {
        fetchAndRenderRecentHistoryData(currentPageRecent + 1);
    });

    // Event listeners para paginación (old, remove later)
    // prevPageBtn.addEventListener('click', () => {
    //     if (currentPage > 1) {
    //         fetchAndRenderHistoricalData(currentPage - 1);
    //     }
    // });

    // nextPageBtn.addEventListener('click', () => {
    //     fetchAndRenderHistoricalData(currentPage + 1);
    // });

    // Referencias a los controles de exportación
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const exportDataBtn = document.getElementById('exportDataBtn');

    // Event listener para el botón de exportar
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            let exportUrl = '/api/export_historical_data';

            if (startDate && endDate) {
                exportUrl += `?start_date=${startDate}&end_date=${endDate}`;
            } else if (startDate) {
                exportUrl += `?start_date=${startDate}`;
            } else if (endDate) {
                exportUrl += `?end_date=${endDate}`;
            }
            
            window.location.href = exportUrl; // Trigger download
        });
    }

    const filterDataBtn = document.getElementById('filterDataBtn');
    let pressureHistogramChart; // Variable to hold the chart instance

    async function fetchAndRenderHistogram() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            alert('Por favor, selecciona un rango de fechas.');
            return;
        }

        try {
            const response = await fetch(`/api/historical_pressure_histogram?start_date=${startDate}&end_date=${endDate}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pressureData = await response.json();
            renderPressureHistogram(pressureData);
        } catch (error) {
            console.error('Error fetching or rendering pressure histogram:', error);
        }
    }

    function renderPressureHistogram(data) {
        if (pressureHistogramChart) {
            pressureHistogramChart.destroy();
        }

        // Simple histogram calculation
        const binSize = 5; // Group pressures in bins of 5 PSI
        const bins = {};
        let minPressure = Infinity;
        let maxPressure = -Infinity;

        data.forEach(pressure => {
            if (pressure < minPressure) minPressure = pressure;
            if (pressure > maxPressure) maxPressure = pressure;
        });

        const startBin = Math.floor(minPressure / binSize) * binSize;
        const endBin = Math.ceil(maxPressure / binSize) * binSize;

        for (let i = startBin; i <= endBin; i += binSize) {
            bins[i] = 0;
        }

        data.forEach(pressure => {
            const bin = Math.floor(pressure / binSize) * binSize;
            if (bins[bin] !== undefined) {
                bins[bin]++;
            }
        });

        const labels = Object.keys(bins).map(bin => `${bin}-${parseInt(bin) + binSize} PSI`);
        const counts = Object.values(bins);

        const ctx = document.getElementById('pressureHistogram').getContext('2d');
        pressureHistogramChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Frecuencia de Presión',
                    data: counts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Rango de Presión (PSI)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frecuencia (Nº de registros)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (filterDataBtn) {
        filterDataBtn.addEventListener('click', fetchAndRenderHistogram);
    }

    // Cerrar modal al hacer clic en el botón de cerrar
    closeButton.addEventListener('click', closeAlarmDetailModal);

    // Cerrar modal al hacer clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target == alarmDetailModal) {
            closeAlarmDetailModal();
        }
    });
});

function filterTable() {
  // Declare variables
  var eventInput, hourInput, eventFilter, hourFilter, table, tr, tdEvent, tdHour, i, eventTxtValue, hourTxtValue;
  eventInput = document.getElementById("eventFilter");
  hourInput = document.getElementById("hourFilter");
  eventFilter = eventInput.value.toUpperCase();
  hourFilter = hourInput.value.toUpperCase();
  table = document.getElementById("recentHistoryTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    tdEvent = tr[i].getElementsByTagName("td")[6]; // 6 is the index of the "ID Evento" column
    tdHour = tr[i].getElementsByTagName("td")[1]; // 1 is the index of the "Hora" column
    if (tdEvent && tdHour) {
      eventTxtValue = tdEvent.textContent || tdEvent.innerText;
      hourTxtValue = tdHour.textContent || tdHour.innerText;
      if (eventTxtValue.toUpperCase().indexOf(eventFilter) > -1 && hourTxtValue.toUpperCase().indexOf(hourFilter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


"""
Módulo para interactuar con la API de la bomba de incendios.
Simula la respuesta de la API con datos de ejemplo y lógica de alarmas persistente.
"""
import random
import datetime
import time

# Estado global para simular la persistencia de las alarmas
# alarm_key: { 'status': 'active'/'cleared', 'last_change_time': datetime, 'alarm_info': {...} }
_alarm_states = {}

# Definición de las alarmas que queremos simular con duración y re-trigger
# Usamos un subconjunto del ALARM_MAP para simplificar la simulación
SIMULATED_ALARMS = {
    "41001_6": { # Engine Trouble
        "register": "41001",
        "bit": 6,
        "description": "Engine Trouble",
        "location": "Sala de Bombas Principal",
        "plant": "Planta A",
        "coordinates": "-33.4489,-70.6693",
        "solution": "Verificar nivel de combustible y aceite."
    },
    "41004_6": { # Low Fuel Level
        "register": "41004",
        "bit": 6,
        "description": "Low Fuel Level",
        "location": "Tanque de Combustible",
        "plant": "Planta A",
        "coordinates": "-33.4489,-70.6693",
        "solution": "Rellenar tanque de combustible."
    },
    "41001_0": { # AC Failure
        "register": "41001",
        "bit": 0,
        "description": "AC Failure",
        "location": "Panel Eléctrico",
        "plant": "Planta B",
        "coordinates": "-33.4489,-70.6693",
        "solution": "Verificar suministro eléctrico principal."
    }
}

# Duraciones en segundos
ALARM_DURATION = 3 * 60  # 3 minutos
RETRIGGER_INTERVAL = 5 * 60 # 5 minutos

def get_data(api_url: str):
    """
    Realiza una petición a la API para obtener los datos de la bomba.
    Simula la respuesta de la API con datos de ejemplo y lógica de alarmas persistente.
    
    Args:
        api_url: La URL de la API a la que se conectará.

    Returns:
        Un diccionario con los datos de la bomba, simulando una respuesta JSON.
    """
    print(f"Conectando a la API (simulado): {api_url}")
    
    current_datetime = datetime.datetime.now()

    # Simular cambio en la presión y voltajes
    system_pressure = round(random.uniform(75.0, 85.0), 2)
    battery_1_voltage = round(random.uniform(13.5, 14.0), 2)
    battery_2_voltage = round(random.uniform(13.5, 14.0), 2)

    active_alarms_mock = []

    # Forzar todas las alarmas simuladas a estar activas siempre
    for alarm_key, alarm_details in SIMULATED_ALARMS.items():
        active_alarms_mock.append({
            **alarm_details,
            "timestamp": current_datetime.isoformat()
        })

    mock_data = {
        "serial_number": "Z1347732",
        "model": "GPD-12-220",
        "package_name": "Diesel Firepump",
        "software_version": "2.9.1.1",
        "status": {
            "nominal_ac_voltage": 220,
            "nominal_battery_voltage": 12,
            "battery_1_voltage": battery_1_voltage,
            "battery_2_voltage": battery_2_voltage,
            "battery_1_current": round(random.uniform(0.5, 1.5), 2),
            "battery_2_current": round(random.uniform(0.5, 1.5), 2),
            "system_pressure": system_pressure,
            "start_count": 3,
            "hours_since_last_run": 13395,
            "cut_in": 90,
            "cut_out": 110
        },
        "alarms": active_alarms_mock
    }
    
    return mock_data

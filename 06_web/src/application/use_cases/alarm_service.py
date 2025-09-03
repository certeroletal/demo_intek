"""
Servicio para procesar y traducir los datos de la bomba, especialmente las alarmas.
"""

# Mapeo completo de registros y bits a descripciones de alarmas
# Extraído de la información proporcionada por el usuario, ahora con soluciones.
ALARM_MAP = {
    "41001": {
        0: {"description": "AC Failure", "solution": "Verificar suministro eléctrico principal."},
        1: {"description": "DC Failure", "solution": "Revisar fuente de alimentación DC."},
        2: {"description": "Battery 1 Failure", "solution": "Inspeccionar batería 1 y conexiones."},
        3: {"description": "Battery 2 Failure", "solution": "Inspeccionar batería 2 y conexiones."},
        4: {"description": "Charger 1 Failure", "solution": "Revisar cargador de batería 1."},
        5: {"description": "Charger 2 Failure", "solution": "Revisar cargador de batería 2."},
        6: {"description": "Engine Trouble", "solution": "Verificar nivel de combustible y aceite."},
        7: {"description": "Pump Room Alarm", "solution": "Investigar causa de alarma en sala de bombas."},
        8: {"description": "Controller Trouble", "solution": "Contactar soporte técnico del controlador."},
        9: {"description": "Service Required", "solution": "Programar mantenimiento preventivo."},
        10: {"description": "Weak Battery 1", "solution": "Cargar o reemplazar batería 1."},
        11: {"description": "Weak Battery 2", "solution": "Cargar o reemplazar batería 2."},
        12: {"description": "Loss of Continuity (Contactor 1)", "solution": "Revisar contactor 1 y cableado."},
        13: {"description": "Loss of Continuity (Contactor 2)", "solution": "Revisar contactor 2 y cableado."},
        14: {"description": "Weekly Test Cut-In not reached", "solution": "Ajustar presión de corte de prueba semanal."},
        15: {"description": "Weekly Test Check Solenoid Valve", "solution": "Verificar válvula solenoide de prueba semanal."},
    },
    "41002": {
        0: {"description": "Faulty Pressure Transducer", "solution": "Reemplazar transductor de presión."},
        1: {"description": "Weekly Test Required", "solution": "Realizar prueba semanal de la bomba."},
        2: {"description": "Cooling No Flow", "solution": "Verificar flujo de refrigeración del motor."},
        3: {"description": "Engine Fail When Running", "solution": "Diagnosticar falla del motor en operación."},
        4: {"description": "Engine Fail to Start", "solution": "Revisar sistema de encendido del motor."},
        5: {"description": "Engine Overspeed (3)", "solution": "Ajustar regulador de velocidad del motor."},
        6: {"description": "I/O Diesel Board Communication Loss", "solution": "Revisar comunicación con placa I/O Diesel."},
        7: {"description": "I/O Expansion 1 Communication Loss", "solution": "Revisar comunicación con expansión I/O 1."},
        8: {"description": "I/O Expansion 2 Communication Loss", "solution": "Revisar comunicación con expansión I/O 2."},
        9: {"description": "I/O Expansion 3 Communication Loss", "solution": "Revisar comunicación con expansión I/O 3."},
        10: {"description": "I/O Expansion 4 Communication Loss", "solution": "Revisar comunicación con expansión I/O 4."},
        11: {"description": "I/O Alarm Communication Loss", "solution": "Revisar comunicación de alarmas I/O."},
        12: {"description": "Low Ambient Temperature (Internal Sensor)", "solution": "Verificar temperatura ambiente de la sala."},
        13: {"description": "Engine Run", "solution": "Motor en funcionamiento normal."},
        14: {"description": "CANBUS Communication System Failure", "solution": "Diagnosticar falla de comunicación CANBUS."},
        15: {"description": "Pump On Demand", "solution": "Confirmar demanda de presión en el sistema."},
    },
    "41003": {
        0: {"description": "Invalid Cut-In", "solution": "Ajustar punto de arranque de la bomba."},
        1: {"description": "Test Mode", "solution": "Bomba en modo de prueba."},
        2: {"description": "Pneumatic Fail to Start", "solution": "Revisar sistema neumático de arranque."},
        3: {"description": "Auto-mode Bypass", "solution": "Verificar bypass de modo automático."},
        4: {"description": "Hydraulic Fail to Start", "solution": "Revisar sistema hidráulico de arranque."},
        5: {"description": "Bell Silenced", "solution": "Alarma sonora silenciada."},
        6: {"description": "APSAD General Default", "solution": "Diagnosticar falla general APSAD."},
        7: {"description": "Overpressure", "solution": "Verificar presión del sistema, posible válvula de alivio."},
        8: {"description": "Underpressure", "solution": "Verificar presión del sistema, posible fuga."},
        9: {"description": "Low Suction Pressure", "solution": "Revisar suministro de agua a la succión."},
        10: {"description": "Flow Start", "solution": "Bomba arrancó por detección de flujo."},
        11: {"description": "Battery 1 Overvoltage", "solution": "Revisar cargador de batería 1, posible sobrecarga."},
        12: {"description": "Battery 2 Overvoltage", "solution": "Revisar cargador de batería 2, posible sobrecarga."},
        13: {"description": "High Ambient Temperature (Internal Sensor)", "solution": "Ventilar sala de bombas."},
        14: {"description": "NA", "solution": "No aplica."},
        15: {"description": "Low Raw Water Flow", "solution": "Verificar flujo de agua cruda."},
    },
    "41004": {
        0: {"description": "Low Spare Temperature", "solution": "Verificar temperatura de repuesto."},
        1: {"description": "Water Reservoir Low", "solution": "Rellenar depósito de agua."},
        2: {"description": "Water Reservoir Empty", "solution": "Rellenar depósito de agua urgentemente."},
        3: {"description": "Water Reservoir High", "solution": "Verificar nivel de depósito de agua."},
        4: {"description": "Flow Meter On", "solution": "Medidor de flujo activado."},
        5: {"description": "Fuel Tank Leak", "solution": "Inspeccionar tanque de combustible por fugas."},
        6: {"description": "Low Fuel Level", "solution": "Rellenar tanque de combustible."},
        7: {"description": "High Fuel Level", "solution": "Verificar nivel de combustible."},
        8: {"description": "Electronic Control Module in Alternate Position", "solution": "Revisar posición de módulo de control electrónico."},
        9: {"description": "Fuel Injection Malfunction", "solution": "Diagnosticar falla en inyección de combustible."},
        10: {"description": "Engine High Temperature", "solution": "Verificar sistema de refrigeración del motor."},
        11: {"description": "Engine Low Temperature", "solution": "Revisar termostato y nivel de refrigerante."},
        12: {"description": "Engine Electronic Control Module Warning", "solution": "Diagnosticar advertencia de módulo de control electrónico."},
        13: {"description": "Engine Electronic Control Module Fault", "solution": "Diagnosticar falla de módulo de control electrónico."},
        14: {"description": "Engine Low Oil Pressure", "solution": "Verificar nivel y presión de aceite del motor."},
        15: {"description": "Low Pneumatic Pressure", "solution": "Revisar presión del sistema neumático."},
    },
    "41005": {
        0: {"description": "Main Relief Valve Open", "solution": "Cerrar válvula de alivio principal."},
        1: {"description": "User Alarm 1", "solution": "Verificar alarma de usuario 1."},
        2: {"description": "User Alarm 2", "solution": "Verificar alarma de usuario 2."},
        3: {"description": "User Alarm 3", "solution": "Verificar alarma de usuario 3."},
        4: {"description": "User Alarm 4", "solution": "Verificar alarma de usuario 4."},
        5: {"description": "User Alarm 5", "solution": "Verificar alarma de usuario 5."},
        6: {"description": "User Alarm 6", "solution": "Verificar alarma de usuario 6."},
        7: {"description": "User Alarm 7", "solution": "Verificar alarma de usuario 7."},
        8: {"description": "User Alarm 8", "solution": "Verificar alarma de usuario 8."},
        9: {"description": "User Alarm 9", "solution": "Verificar alarma de usuario 9."},
        10: {"description": "User Alarm 10", "solution": "Verificar alarma de usuario 10."},
        11: {"description": "User Alarm 11", "solution": "Verificar alarma de usuario 11."},
        12: {"description": "User Alarm 12", "solution": "Verificar alarma de usuario 12."},
        13: {"description": "User Alarm 13", "solution": "Verificar alarma de usuario 13."},
        14: {"description": "User Alarm 14", "solution": "Verificar alarma de usuario 14."},
        15: {"description": "User Alarm 15", "solution": "Verificar alarma de usuario 15."},
    },
    "41006": {
        0: {"description": "User Alarm 16", "solution": "Verificar alarma de usuario 16."},
        1: {"description": "User Alarm 17", "solution": "Verificar alarma de usuario 17."},
        2: {"description": "User Alarm 18", "solution": "Verificar alarma de usuario 18."},
        3: {"description": "User Alarm 19", "solution": "Verificar alarma de usuario 19."},
        4: {"description": "User Alarm 20", "solution": "Verificar alarma de usuario 20."},
        9: {"description": "High Raw Water Temperature", "solution": "Verificar temperatura del agua cruda."},
        10: {"description": "PLD Low Suction Pressure", "solution": "Revisar presión de succión PLD."},
        11: {"description": "Low Hydraulic Pressure", "solution": "Verificar presión hidráulica."},
        12: {"description": "I/O Expansion 5 Communication Loss", "solution": "Revisar comunicación con expansión I/O 5."},
        13: {"description": "I/O Expansion 6 Communication Loss", "solution": "Revisar comunicación con expansión I/O 6."},
        14: {"description": "I/O Expansion 7 Communication Loss", "solution": "Revisar comunicación con expansión I/O 7."},
        15: {"description": "I/O Expansion 8 Communication Loss", "solution": "Revisar comunicación con expansión I/O 8."},
    },
    "42012": {
        0: {"description": "Minimum run delay timing high", "solution": "Ajustar retardo mínimo de funcionamiento."},
        4: {"description": "Engine running high", "solution": "Motor en funcionamiento normal."},
        6: {"description": "Low suction alarm high", "solution": "Revisar alarma de baja succión."},
        7: {"description": "Low suction shutdown active high", "solution": "Verificar apagado por baja succión."},
        8: {"description": "System over pressure alarm high", "solution": "Revisar alarma de sobrepresión del sistema."},
        9: {"description": "Overspeed alarm high", "solution": "Revisar alarma de sobrevelocidad."},
        10: {"description": "Weekly test demand active high", "solution": "Verificar demanda de prueba semanal."},
        11: {"description": "Failure to start alarm high", "solution": "Revisar alarma de falla de arranque."},
        12: {"description": "Lockout active high", "solution": "Verificar bloqueo activo."},
        13: {"description": "Crank on battery #1 high", "solution": "Revisar arranque en batería 1."},
        14: {"description": "Crank on battery #2 high", "solution": "Revisar arranque en batería 2."},
        15: {"description": "Resting high", "solution": "Bomba en reposo."},
    },
    "42013": {
        0: {"description": "Pressure start demand high", "solution": "Verificar demanda de arranque por presión."},
        1: {"description": "Remote start demand high", "solution": "Verificar demanda de arranque remoto."},
        2: {"description": "Deluge start demand high", "solution": "Verificar demanda de arranque por diluvio."},
        3: {"description": "Weekly test start demand high", "solution": "Verificar demanda de arranque por prueba semanal."},
        4: {"description": "Start contactor #1 fail high", "solution": "Revisar contactor de arranque 1."},
        5: {"description": "Start contactor #2 fail high", "solution": "Revisar contactor de arranque 2."},
        6: {"description": "Audible alarm high", "solution": "Alarma sonora activa."},
        9: {"description": "Pump demand high", "solution": "Verificar demanda de bomba."},
        10: {"description": "Control switch in auto high", "solution": "Interruptor de control en automático."},
        11: {"description": "Control switch in manual high", "solution": "Interruptor de control en manual."},
        12: {"description": "Pressure transducer fault high", "solution": "Revisar transductor de presión."},
        14: {"description": "AC power fail start high", "solution": "Verificar arranque por falla de energía AC."},
    },
    "42014": {
        0: {"description": "Battery #1 failure alarm high", "solution": "Revisar alarma de falla de batería 1."},
        1: {"description": "Battery #2 failure alarm high", "solution": "Revisar alarma de falla de batería 2."},
        2: {"description": "Pump trouble group alarm high", "solution": "Revisar alarma de grupo de problemas de bomba."},
        3: {"description": "System trouble #1 alarm high", "solution": "Revisar alarma de problema de sistema 1."},
        4: {"description": "AC power fail alarm high", "solution": "Revisar alarma de falla de energía AC."},
        5: {"description": "Battery #1 over voltage alarm high", "solution": "Revisar alarma de sobrevoltaje de batería 1."},
        6: {"description": "Battery #2 over voltage alarm high", "solution": "Revisar alarma de sobrevoltaje de batería 2."},
        7: {"description": "Electronic control module in alternate position high", "solution": "Revisar módulo de control electrónico en posición alternativa."},
        8: {"description": "Fuel injection malfunction high", "solution": "Revisar mal funcionamiento de inyección de combustible."},
        9: {"description": "Electronic control module warning high", "solution": "Revisar advertencia de módulo de control electrónico."},
        10: {"description": "Electronic control module fault high", "solution": "Revisar falla de módulo de control electrónico."},
        11: {"description": "High raw water temperature high", "solution": "Revisar alta temperatura de agua cruda."},
        12: {"description": "Low raw water flow high", "solution": "Revisar bajo flujo de agua cruda."},
        13: {"description": "Low engine temperature high", "solution": "Revisar baja temperatura del motor."},
        14: {"description": "Low oil pressure alarm high", "solution": "Revisar alarma de baja presión de aceite."},
    },
    "42015": {
        0: {"description": "Pump trouble #1 input high", "solution": "Revisar entrada de problema de bomba 1."},
        1: {"description": "Pump trouble #2 input high", "solution": "Revisar entrada de problema de bomba 2."},
        2: {"description": "Pump trouble #3 input high", "solution": "Revisar entrada de problema de bomba 3."},
        3: {"description": "Pump trouble #4 input high", "solution": "Revisar entrada de problema de bomba 4."},
        4: {"description": "Pump trouble #5 input high", "solution": "Revisar entrada de problema de bomba 5."},
        5: {"description": "Pump trouble #6 input high", "solution": "Revisar entrada de problema de bomba 6."},
        6: {"description": "Pump trouble #7 input high", "solution": "Revisar entrada de problema de bomba 7."},
        7: {"description": "Pump trouble #8 input high", "solution": "Revisar entrada de problema de bomba 8."},
        8: {"description": "Battery #1 in equalize high", "solution": "Batería 1 en ecualización."},
        9: {"description": "Battery #2 in equalize high", "solution": "Batería 2 en ecualización."},
        10: {"description": "Battery #1 OK high", "solution": "Batería 1 OK."},
        11: {"description": "Battery #2 OK high", "solution": "Batería 2 OK."},
        12: {"description": "Charger #1 fail alarm high", "solution": "Revisar alarma de falla de cargador 1."},
        13: {"description": "Charger #2 fail alarm high", "solution": "Revisar alarma de falla de cargador 2."},
        14: {"description": "System trouble #2 alarm high", "solution": "Revisar alarma de problema de sistema 2."},
    }
}

def parse_active_alarms(raw_alarms: list[dict]) -> list[dict]:
    """
    Toma la lista de alarmas crudas de la API y las enriquece con descripciones y soluciones.

    Args:
        raw_alarms: Una lista de diccionarios, donde cada diccionario representa una alarma activa
                    con al menos 'register', 'bit', y 'description'.

    Returns:
        Una lista de diccionarios, donde cada diccionario es una alarma enriquecida con su solución.
    """
    enriched_alarms = []
    for alarm in raw_alarms:
        register = alarm.get("register")
        bit = alarm.get("bit")
        
        if register and bit is not None and register in ALARM_MAP:
            alarm_info = ALARM_MAP[register].get(bit)
            if alarm_info:
                # Crear una copia para no modificar el diccionario original de la API
                enriched_alarm = alarm.copy()
                # Añadir la descripción y solución del mapeo si no vienen de la API o para asegurar consistencia
                enriched_alarm["description"] = alarm_info["description"]
                enriched_alarm["solution"] = alarm_info["solution"]
                enriched_alarms.append(enriched_alarm)
            else:
                # Si no se encuentra en el mapeo, añadir la alarma tal cual viene de la API
                enriched_alarms.append(alarm)
        else:
            # Si el registro o bit no son válidos, añadir la alarma tal cual viene de la API
            enriched_alarms.append(alarm)
            
    return enriched_alarms
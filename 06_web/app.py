from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from functools import wraps
import os

# Importar los nuevos servicios
from src.adapters.secondary.api import pump_api_client
from src.application.use_cases import alarm_service
from src.config.di_config import container
from datetime import date, time # Added time import for serialization

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.urandom(24)

# --- Simulación de Base de Datos de Usuarios ---
USERS = {
    'admin': {'password': 'admin123', 'role': 'admin'},
    'basic_user': {'password': 'basic123', 'role': 'basico'},
    'medium_user': {'password': 'medium123', 'role': 'intermedio'},
    'advanced_user': {'password': 'advanced123', 'role': 'avanzado'},
    'maint_user': {'password': 'maint123', 'role': 'mantenimiento'}
}

# --- Decorador para proteger rutas ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Por favor, inicia sesión para acceder a esta página.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# --- Función de simulación de envío de correo ---
def send_alarm_notification_email(alarm_details: dict):
    print(f"\n--- SIMULANDO ENVÍO DE CORREO DE ALARMA ---")
    print(f"Alarma: {alarm_details.get('description', 'N/A')}")
    print(f"Hora: {alarm_details.get('timestamp', 'N/A')}")
    print(f"Ubicación: {alarm_details.get('location', 'N/A')}, Planta: {alarm_details.get('plant', 'N/A')}")
    print(f"Solución: {alarm_details.get('solution', 'N/A')}")
    print(f"----------------------------------------\n")

# --- Rutas de la aplicación ---

@app.route('/')
@login_required
def index():
    # Fetch recent historical data for the mini-history table
    historical_data_service = container.get_historical_data_service()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int) # Default 20 items per page

    recent_data, total_count = historical_data_service.get_recent_historical_data(page=page, limit=limit)
    print("RECENT DATA:", recent_data)

    # Convert date and time objects to string for JSON serialization in template
    serialized_recent_data = []
    for row in recent_data:
        new_row = row.copy()
        if 'log_date' in new_row and isinstance(new_row['log_date'], date):
            new_row['log_date'] = new_row['log_date'].isoformat()
        if 'log_time' in new_row and isinstance(new_row['log_time'], time):
            new_row['log_time'] = new_row['log_time'].isoformat()
        serialized_recent_data.append(new_row)

    return render_template('index.html',
                           recent_historical_data=serialized_recent_data,
                           page=page,
                           limit=limit,
                           total_count=total_count)

@app.route('/historical_dashboard')
@login_required
def historical_dashboard():
    if session.get('role') not in ['avanzado', 'admin']:
        flash('Acceso denegado. No tienes permisos para ver esta página.', 'danger')
        return redirect(url_for('index'))
    return render_template('historical_dashboard.html')

@app.route('/api/pump_data')
@login_required
def get_pump_data():
    api_url = "http://api.example.com/pump/1"
    pump_data = pump_api_client.get_data(api_url)
    
    # Procesar las alarmas
    # La función parse_active_alarms ahora espera una lista de alarmas crudas
    # que ya vienen con descripción, bit, registro, etc. desde el mock.
    # Solo necesitamos enriquecerlas con la solución del ALARM_MAP.
    enriched_alarms = alarm_service.parse_active_alarms(pump_data['alarms'])
    
    # Reemplazar la lista de alarmas crudas con las enriquecidas
    pump_data['alarms'] = enriched_alarms

    # Simular envío de notificación si hay alarmas activas (solo la primera por simplicidad)
    if enriched_alarms:
        send_alarm_notification_email(enriched_alarms[0]) # Notifica la primera alarma

    return jsonify(pump_data)

@app.route('/api/historical_pump_data')
@login_required
def get_historical_pump_data():
    historical_data_service = container.get_historical_data_service()
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)

    if start_date_str and end_date_str:
        try:
            start_date = date.fromisoformat(start_date_str)
            end_date = date.fromisoformat(end_date_str)
            data, total_count = historical_data_service.get_historical_data_by_date_range(start_date, end_date, page=page, limit=limit)
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    else:
        data, total_count = historical_data_service.get_all_historical_data(page=page, limit=limit)

    # Convert date and time objects to string for JSON serialization
    serialized_data = []
    for row in data:
        new_row = row.copy()
        if 'log_date' in new_row and isinstance(new_row['log_date'], date):
            new_row['log_date'] = new_row['log_date'].isoformat()
        if 'log_time' in new_row and isinstance(new_row['log_time'], time):
            new_row['log_time'] = new_row['log_time'].isoformat()
        serialized_data.append(new_row)

    return jsonify({
        "data": serialized_data,
        "total_count": total_count,
        "page": page,
        "limit": limit
    })

@app.route('/api/recent_historical_data')
# @login_required
def get_recent_historical_data_api():
    historical_data_service = container.get_historical_data_service()
    recent_data = historical_data_service.get_recent_historical_data()

    serialized_data = []
    for row in recent_data:
        new_row = row.copy()
        if 'log_date' in new_row and isinstance(new_row['log_date'], date):
            new_row['log_date'] = new_row['log_date'].isoformat()
        if 'log_time' in new_row and isinstance(new_row['log_time'], time):
            new_row['log_time'] = new_row['log_time'].isoformat()
        serialized_data.append(new_row)
    return jsonify(serialized_data)

@app.route('/api/all_alarms')
@login_required
def get_all_alarms_api():
    historical_data_service = container.get_historical_data_service()
    all_alarms = historical_data_service.get_all_alarms()

    serialized_alarms = []
    for alarm in all_alarms:
        new_alarm = alarm.copy()
        if 'log_date' in new_alarm and isinstance(new_alarm['log_date'], date):
            new_alarm['log_date'] = new_alarm['log_date'].isoformat()
        if 'log_time' in new_alarm and isinstance(new_alarm['log_time'], time):
            new_alarm['log_time'] = new_alarm['log_time'].isoformat()
        serialized_alarms.append(new_alarm)
    return jsonify(serialized_alarms)

import io
import csv
from flask import make_response # Added make_response

@app.route('/api/export_historical_data')
@login_required
def export_historical_data():
    historical_data_service = container.get_historical_data_service()
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if start_date_str and end_date_str:
        try:
            start_date = date.fromisoformat(start_date_str)
            end_date = date.fromisoformat(end_date_str)
            # Fetch all data for export, no pagination
            data, _ = historical_data_service.get_historical_data_by_date_range(start_date, end_date, page=1, limit=float('inf'))
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    else:
        # Fetch all data for export, no pagination
        data, _ = historical_data_service.get_all_historical_data(page=1, limit=float('inf'))

    # Prepare CSV data
    si = io.StringIO()
    cw = csv.writer(si)

    # Write header
    if data:
        header = data[0].keys()
        cw.writerow(header)
    
    # Write data rows
    for row in data:
        # Convert date and time objects to string for CSV
        new_row = row.copy()
        if 'log_date' in new_row and isinstance(new_row['log_date'], date):
            new_row['log_date'] = new_row['log_date'].isoformat()
        if 'log_time' in new_row and isinstance(new_row['log_time'], time):
            new_row['log_time'] = new_row['log_time'].isoformat()
        cw.writerow(new_row.values())

    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=historical_pump_data.csv"
    output.headers["Content-type"] = "text/csv"
    return output


@app.route('/api/historical_pressure_histogram')
@login_required
def get_historical_pressure_histogram():
    historical_data_service = container.get_historical_data_service()
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if start_date_str and end_date_str:
        try:
            start_date = date.fromisoformat(start_date_str)
            end_date = date.fromisoformat(end_date_str)
            data = historical_data_service.get_pressure_data_for_histogram(start_date, end_date)
            return jsonify(data)
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    else:
        return jsonify({"error": "start_date and end_date are required."}), 400


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = USERS.get(username)
        if user and user['password'] == password:
            session['logged_in'] = True
            session['username'] = username
            session['role'] = user['role']
            flash(f'Has iniciado sesión como {username}.', 'success')
            return redirect(url_for('index'))
        else:
            flash('Credenciales incorrectas. Inténtalo de nuevo.', 'danger')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Has cerrado la sesión.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)

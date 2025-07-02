from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from config import Config
from services.database import DatabaseService
from services.wms_integration import WMSIntegration
from services.data_processor import DataProcessor
import json
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize services
db_service = DatabaseService()
wms_integration = WMSIntegration()
data_processor = DataProcessor()

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard view"""
    return render_template('dashboard.html')

@app.route('/inventory')
def inventory():
    """Inventory management view"""
    return render_template('inventory.html')

@app.route('/orders')
def orders():
    """Order management view"""
    return render_template('orders.html')

@app.route('/locations')
def locations():
    """Location heatmap view"""
    return render_template('locations.html')

@app.route('/integration')
def integration():
    """Data integration view"""
    return render_template('integration.html')

# API Routes
@app.route('/api/metrics')
def get_metrics():
    """Get warehouse performance metrics"""
    try:
        metrics = db_service.get_warehouse_metrics()
        return jsonify({
            'success': True,
            'data': metrics
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/inventory')
def get_inventory():
    """Get inventory data"""
    try:
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        
        inventory = db_service.get_inventory_data(search, category)
        return jsonify({
            'success': True,
            'data': inventory
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/orders')
def get_orders():
    """Get order data"""
    try:
        status = request.args.get('status', '')
        priority = request.args.get('priority', '')
        
        orders = db_service.get_orders_data(status, priority)
        return jsonify({
            'success': True,
            'data': orders
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/locations')
def get_locations():
    """Get location utilization data"""
    try:
        locations = db_service.get_location_data()
        return jsonify({
            'success': True,
            'data': locations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/integration/status')
def get_integration_status():
    """Get data integration status"""
    try:
        status = {
            'database': db_service.check_connection(),
            'wms_app': wms_integration.check_connection(),
            'last_sync': data_processor.get_last_sync_time(),
            'total_records': db_service.get_total_records()
        }
        return jsonify({
            'success': True,
            'data': status
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sync', methods=['POST'])
def sync_data():
    """Trigger data synchronization"""
    try:
        # Sync data from C WMS application
        wms_data = wms_integration.fetch_latest_data()
        
        # Process and store in database
        processed_data = data_processor.process_wms_data(wms_data)
        db_service.update_data(processed_data)
        
        return jsonify({
            'success': True,
            'message': 'Data synchronized successfully',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analytics/charts')
def get_analytics_charts():
    """Get chart data for analytics"""
    try:
        chart_type = request.args.get('type', 'inventory_trends')
        chart_data = data_processor.generate_chart_data(chart_type)
        
        return jsonify({
            'success': True,
            'data': chart_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
# Warehouse Management System Data Visualization Tool

A comprehensive Flask-based data integration and visualization tool for warehouse management systems. This application connects to your existing C-based WMS application and MS SQL database to provide real-time analytics, inventory tracking, and operational insights.

## Features

### 🏭 **Warehouse Dashboard**
- Real-time performance metrics
- Key performance indicators (KPIs)
- Interactive charts and visualizations
- System status monitoring

### 📦 **Inventory Management**
- Real-time stock levels
- Low stock alerts
- Search and filtering capabilities
- Inventory value tracking

### 📋 **Order Management**
- Order status tracking
- Priority-based filtering
- Progress monitoring
- Customer order details

### 🗺️ **Location Management**
- Warehouse layout visualization
- Location utilization heatmap
- Capacity management
- Zone-based organization

### 🔄 **Data Integration**
- MS SQL Database connectivity
- C WMS application integration
- Real-time data synchronization
- Multiple integration methods (HTTP, Socket, File-based)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   C WMS App     │    │  MS SQL Server  │    │  Flask Web App  │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Warehouse   │ │    │ │ Inventory   │ │    │ │ Dashboard   │ │
│ │ Operations  │ │◄──►│ │ Orders      │ │◄──►│ │ Analytics   │ │
│ │ Management  │ │    │ │ Locations   │ │    │ │ Reports     │ │
│ └─────────────┘ │    │ │ Users       │ │    │ └─────────────┘ │
└─────────────────┘    │ └─────────────┘ │    └─────────────────┘
                       └─────────────────┘
```

## Installation

### Prerequisites
- Python 3.8+
- MS SQL Server
- ODBC Driver 17 for SQL Server
- Your existing C WMS application

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd warehouse-management-tool
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and WMS configuration
   ```

5. **Set up database connection**
   - Ensure MS SQL Server is running
   - Update database credentials in `.env`
   - Test connection with your WMS database

6. **Configure C WMS integration**
   - Update WMS application host/port in `.env`
   - Set up API key or authentication method
   - Choose integration method (HTTP/Socket/File)

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_SERVER` | MS SQL Server hostname | localhost |
| `DB_DATABASE` | Database name | warehouse_management |
| `DB_USERNAME` | Database username | sa |
| `DB_PASSWORD` | Database password | - |
| `WMS_APP_HOST` | C WMS application host | localhost |
| `WMS_APP_PORT` | C WMS application port | 8080 |
| `WMS_API_KEY` | API key for WMS integration | - |
| `SYNC_INTERVAL` | Data sync interval (seconds) | 300 |

### Database Schema

The application expects the following tables in your MS SQL database:

- `inventory` - Product inventory data
- `orders` - Order information
- `order_items` - Order line items
- `locations` - Warehouse location data
- `transactions` - Warehouse transactions

## Usage

### Starting the Application

```bash
python run.py
```

The application will be available at `http://localhost:5000`

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/metrics` | GET | Warehouse performance metrics |
| `/api/inventory` | GET | Inventory data with filtering |
| `/api/orders` | GET | Order data with status filtering |
| `/api/locations` | GET | Location utilization data |
| `/api/sync` | POST | Trigger data synchronization |
| `/api/integration/status` | GET | Integration status check |

### Data Synchronization

The application supports multiple methods for integrating with your C WMS:

1. **HTTP API Integration**
   - RESTful API calls to your WMS
   - JSON data exchange
   - Authentication via API keys

2. **Socket Communication**
   - Direct TCP socket connection
   - Custom protocol support
   - Real-time data streaming

3. **File-based Integration**
   - Monitor files written by WMS
   - JSON/CSV file processing
   - Scheduled file polling

## Integration with C WMS Application

### Method 1: HTTP API
If your C WMS exposes HTTP endpoints:

```c
// Example C WMS endpoint
GET /api/inventory
GET /api/orders
POST /api/command
```

### Method 2: Socket Communication
For direct socket communication:

```c
// Example C WMS socket server
// Listen on port 8080
// Accept JSON commands
// Return JSON responses
```

### Method 3: File-based
For file-based integration:

```c
// C WMS writes data files
// /tmp/wms_inventory.json
// /tmp/wms_orders.json
// /tmp/wms_transactions.json
```

## Customization

### Adding New Metrics
1. Update `services/database.py` to add new queries
2. Modify `services/data_processor.py` for data processing
3. Update templates to display new metrics

### Custom Charts
1. Add chart generation in `services/data_processor.py`
2. Update templates with new chart containers
3. Add JavaScript for chart rendering

### New Integration Methods
1. Extend `services/wms_integration.py`
2. Add new communication protocols
3. Update configuration options

## Monitoring and Logging

The application includes comprehensive logging:

- Application logs: `wms_app.log`
- Database operations
- WMS integration status
- Error tracking and debugging

## Security Considerations

- Use strong database passwords
- Secure API keys for WMS integration
- Enable HTTPS in production
- Implement proper authentication
- Regular security updates

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MS SQL Server status
   - Verify credentials in `.env`
   - Ensure ODBC driver is installed

2. **WMS Integration Not Working**
   - Verify WMS application is running
   - Check host/port configuration
   - Test API key authentication

3. **Data Not Updating**
   - Check sync interval settings
   - Verify WMS data format
   - Review application logs

### Debug Mode

Enable debug mode for detailed error information:

```bash
export FLASK_DEBUG=true
python run.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review application logs
- Create an issue in the repository
- Contact the development team

---

**Note**: This tool is designed to integrate with existing warehouse management systems. Ensure proper testing in a development environment before deploying to production.
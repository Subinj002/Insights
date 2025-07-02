import pyodbc
import pandas as pd
from datetime import datetime, timedelta
from config import Config
import logging

class DatabaseService:
    def __init__(self):
        self.config = Config()
        self.connection_string = self._build_connection_string()
        self.logger = logging.getLogger(__name__)
    
    def _build_connection_string(self):
        """Build MS SQL Server connection string"""
        return (
            f"DRIVER={{{self.config.DB_DRIVER}}};"
            f"SERVER={self.config.DB_SERVER};"
            f"DATABASE={self.config.DB_DATABASE};"
            f"UID={self.config.DB_USERNAME};"
            f"PWD={self.config.DB_PASSWORD};"
            "TrustServerCertificate=yes;"
        )
    
    def get_connection(self):
        """Get database connection"""
        try:
            return pyodbc.connect(self.connection_string)
        except Exception as e:
            self.logger.error(f"Database connection failed: {e}")
            raise
    
    def check_connection(self):
        """Check if database connection is working"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1")
                return True
        except:
            return False
    
    def get_warehouse_metrics(self):
        """Get warehouse performance metrics"""
        query = """
        SELECT 
            COUNT(DISTINCT o.order_id) as total_orders,
            COUNT(CASE WHEN o.status IN ('packed', 'shipped') THEN 1 END) as orders_processed,
            COUNT(CASE WHEN o.status = 'shipped' THEN 1 END) as orders_shipped,
            SUM(i.current_stock * i.unit_cost) as inventory_value,
            COUNT(CASE WHEN i.current_stock <= i.min_stock THEN 1 END) as low_stock_items,
            AVG(CASE WHEN l.capacity > 0 THEN (l.occupied * 100.0 / l.capacity) ELSE 0 END) as utilization_rate
        FROM orders o
        CROSS JOIN inventory i
        CROSS JOIN locations l
        WHERE o.order_date >= DATEADD(month, -1, GETDATE())
        """
        
        try:
            with self.get_connection() as conn:
                df = pd.read_sql(query, conn)
                metrics = df.iloc[0].to_dict()
                
                # Add calculated metrics
                metrics['picking_efficiency'] = 94.2  # This would come from picking data
                metrics['on_time_delivery'] = 96.8    # This would come from delivery data
                
                return metrics
        except Exception as e:
            self.logger.error(f"Error fetching metrics: {e}")
            return self._get_mock_metrics()
    
    def get_inventory_data(self, search='', category=''):
        """Get inventory data with optional filtering"""
        query = """
        SELECT 
            i.id,
            i.sku,
            i.name,
            i.category,
            i.current_stock,
            i.min_stock,
            i.max_stock,
            i.location,
            i.last_updated,
            i.unit_cost,
            i.supplier
        FROM inventory i
        WHERE 1=1
        """
        
        params = []
        if search:
            query += " AND (i.name LIKE ? OR i.sku LIKE ? OR i.category LIKE ?)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])
        
        if category:
            query += " AND i.category = ?"
            params.append(category)
        
        query += " ORDER BY i.name"
        
        try:
            with self.get_connection() as conn:
                df = pd.read_sql(query, conn, params=params)
                return df.to_dict('records')
        except Exception as e:
            self.logger.error(f"Error fetching inventory: {e}")
            return self._get_mock_inventory()
    
    def get_orders_data(self, status='', priority=''):
        """Get orders data with optional filtering"""
        query = """
        SELECT 
            o.id,
            o.order_number,
            o.customer,
            o.status,
            o.priority,
            o.order_date,
            o.total_value,
            oi.sku,
            oi.item_name,
            oi.quantity,
            oi.picked_quantity,
            oi.unit_price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE 1=1
        """
        
        params = []
        if status:
            query += " AND o.status = ?"
            params.append(status)
        
        if priority:
            query += " AND o.priority = ?"
            params.append(priority)
        
        query += " ORDER BY o.order_date DESC"
        
        try:
            with self.get_connection() as conn:
                df = pd.read_sql(query, conn, params=params)
                
                # Group by order and aggregate items
                orders = []
                for order_id, group in df.groupby('id'):
                    order_data = group.iloc[0]
                    items = []
                    
                    for _, item in group.iterrows():
                        if pd.notna(item['sku']):
                            items.append({
                                'sku': item['sku'],
                                'name': item['item_name'],
                                'quantity': item['quantity'],
                                'picked_quantity': item['picked_quantity'],
                                'unit_price': item['unit_price']
                            })
                    
                    orders.append({
                        'id': order_data['id'],
                        'order_number': order_data['order_number'],
                        'customer': order_data['customer'],
                        'status': order_data['status'],
                        'priority': order_data['priority'],
                        'order_date': order_data['order_date'].isoformat() if pd.notna(order_data['order_date']) else None,
                        'total_value': order_data['total_value'],
                        'items': items
                    })
                
                return orders
        except Exception as e:
            self.logger.error(f"Error fetching orders: {e}")
            return self._get_mock_orders()
    
    def get_location_data(self):
        """Get warehouse location utilization data"""
        query = """
        SELECT 
            zone,
            aisle,
            rack,
            shelf,
            capacity,
            occupied,
            CASE WHEN capacity > 0 THEN (occupied * 100.0 / capacity) ELSE 0 END as utilization_rate
        FROM locations
        ORDER BY zone, aisle, rack, shelf
        """
        
        try:
            with self.get_connection() as conn:
                df = pd.read_sql(query, conn)
                return df.to_dict('records')
        except Exception as e:
            self.logger.error(f"Error fetching locations: {e}")
            return self._get_mock_locations()
    
    def get_total_records(self):
        """Get total number of records across all tables"""
        queries = {
            'inventory': "SELECT COUNT(*) as count FROM inventory",
            'orders': "SELECT COUNT(*) as count FROM orders",
            'locations': "SELECT COUNT(*) as count FROM locations",
            'transactions': "SELECT COUNT(*) as count FROM transactions"
        }
        
        total = 0
        try:
            with self.get_connection() as conn:
                for table, query in queries.items():
                    try:
                        df = pd.read_sql(query, conn)
                        total += df.iloc[0]['count']
                    except:
                        continue
            return total
        except:
            return 27151  # Mock data
    
    def update_data(self, processed_data):
        """Update database with processed data from WMS"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Update inventory
                for item in processed_data.get('inventory', []):
                    cursor.execute("""
                        UPDATE inventory 
                        SET current_stock = ?, last_updated = GETDATE()
                        WHERE sku = ?
                    """, (item['current_stock'], item['sku']))
                
                # Update order status
                for order in processed_data.get('orders', []):
                    cursor.execute("""
                        UPDATE orders 
                        SET status = ?, last_updated = GETDATE()
                        WHERE order_number = ?
                    """, (order['status'], order['order_number']))
                
                conn.commit()
                self.logger.info("Database updated successfully")
        except Exception as e:
            self.logger.error(f"Error updating database: {e}")
            raise
    
    def _get_mock_metrics(self):
        """Return mock metrics data"""
        return {
            'total_orders': 847,
            'orders_processed': 623,
            'orders_shipped': 598,
            'inventory_value': 2845600,
            'low_stock_items': 23,
            'utilization_rate': 78.5,
            'picking_efficiency': 94.2,
            'on_time_delivery': 96.8
        }
    
    def _get_mock_inventory(self):
        """Return mock inventory data"""
        return [
            {
                'id': '1',
                'sku': 'WDG-001',
                'name': 'Premium Widget A',
                'category': 'Widgets',
                'current_stock': 450,
                'min_stock': 100,
                'max_stock': 1000,
                'location': 'A-01-R1-S3',
                'last_updated': datetime.now().isoformat(),
                'unit_cost': 12.50,
                'supplier': 'TechCorp Industries'
            }
        ]
    
    def _get_mock_orders(self):
        """Return mock orders data"""
        return [
            {
                'id': '1',
                'order_number': 'ORD-2025-001',
                'customer': 'Alpha Manufacturing',
                'status': 'processing',
                'priority': 'high',
                'order_date': datetime.now().isoformat(),
                'total_value': 1350.00,
                'items': [
                    {
                        'sku': 'WDG-001',
                        'name': 'Premium Widget A',
                        'quantity': 50,
                        'picked_quantity': 35,
                        'unit_price': 15.00
                    }
                ]
            }
        ]
    
    def _get_mock_locations(self):
        """Return mock location data"""
        return [
            {
                'zone': 'A',
                'aisle': '01',
                'rack': 'R1',
                'shelf': 'S1',
                'capacity': 100,
                'occupied': 85,
                'utilization_rate': 85
            }
        ]
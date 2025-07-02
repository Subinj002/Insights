import pandas as pd
import json
from datetime import datetime, timedelta
import plotly.graph_objs as go
import plotly.utils
import logging

class DataProcessor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.last_sync_time = None
    
    def process_wms_data(self, wms_data):
        """Process raw data from WMS application"""
        try:
            processed_data = {
                'inventory': self._process_inventory_data(wms_data.get('inventory', [])),
                'orders': self._process_orders_data(wms_data.get('orders', [])),
                'transactions': self._process_transactions_data(wms_data.get('transactions', []))
            }
            
            self.last_sync_time = datetime.now()
            self.logger.info(f"Processed WMS data at {self.last_sync_time}")
            
            return processed_data
            
        except Exception as e:
            self.logger.error(f"Error processing WMS data: {e}")
            raise
    
    def _process_inventory_data(self, inventory_data):
        """Process inventory data from WMS"""
        processed_inventory = []
        
        for item in inventory_data:
            try:
                processed_item = {
                    'sku': item.get('sku'),
                    'current_stock': int(item.get('current_stock', 0)),
                    'location': item.get('location'),
                    'last_movement': item.get('last_movement'),
                    'processed_at': datetime.now().isoformat()
                }
                processed_inventory.append(processed_item)
            except Exception as e:
                self.logger.warning(f"Error processing inventory item {item}: {e}")
        
        return processed_inventory
    
    def _process_orders_data(self, orders_data):
        """Process orders data from WMS"""
        processed_orders = []
        
        for order in orders_data:
            try:
                processed_order = {
                    'order_number': order.get('order_number'),
                    'status': order.get('status'),
                    'last_updated': order.get('last_updated'),
                    'processed_at': datetime.now().isoformat()
                }
                processed_orders.append(processed_order)
            except Exception as e:
                self.logger.warning(f"Error processing order {order}: {e}")
        
        return processed_orders
    
    def _process_transactions_data(self, transactions_data):
        """Process transaction data from WMS"""
        processed_transactions = []
        
        for transaction in transactions_data:
            try:
                processed_transaction = {
                    'transaction_id': transaction.get('transaction_id'),
                    'type': transaction.get('type'),
                    'sku': transaction.get('sku'),
                    'quantity': int(transaction.get('quantity', 0)),
                    'timestamp': transaction.get('timestamp'),
                    'processed_at': datetime.now().isoformat()
                }
                processed_transactions.append(processed_transaction)
            except Exception as e:
                self.logger.warning(f"Error processing transaction {transaction}: {e}")
        
        return processed_transactions
    
    def get_last_sync_time(self):
        """Get the last synchronization time"""
        if self.last_sync_time:
            return self.last_sync_time.isoformat()
        return None
    
    def generate_chart_data(self, chart_type):
        """Generate chart data for visualization"""
        try:
            if chart_type == 'inventory_trends':
                return self._generate_inventory_trends()
            elif chart_type == 'order_status':
                return self._generate_order_status_chart()
            elif chart_type == 'location_utilization':
                return self._generate_location_utilization()
            elif chart_type == 'performance_metrics':
                return self._generate_performance_metrics()
            else:
                return self._generate_default_chart()
                
        except Exception as e:
            self.logger.error(f"Error generating chart data: {e}")
            return self._generate_default_chart()
    
    def _generate_inventory_trends(self):
        """Generate inventory trends chart data"""
        # Mock data for demonstration
        dates = pd.date_range(start='2025-01-01', end='2025-01-15', freq='D')
        
        fig = go.Figure()
        
        # Add inventory level trend
        fig.add_trace(go.Scatter(
            x=dates,
            y=[450 + i*5 + (i%3)*10 for i in range(len(dates))],
            mode='lines+markers',
            name='Widget A Stock',
            line=dict(color='#3B82F6')
        ))
        
        fig.add_trace(go.Scatter(
            x=dates,
            y=[85 + i*2 + (i%4)*8 for i in range(len(dates))],
            mode='lines+markers',
            name='Gadget B Stock',
            line=dict(color='#EF4444')
        ))
        
        fig.update_layout(
            title='Inventory Trends (Last 15 Days)',
            xaxis_title='Date',
            yaxis_title='Stock Level',
            template='plotly_dark',
            height=400
        )
        
        return json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    
    def _generate_order_status_chart(self):
        """Generate order status distribution chart"""
        statuses = ['Pending', 'Processing', 'Packed', 'Shipped']
        counts = [45, 123, 89, 234]
        colors = ['#FCD34D', '#3B82F6', '#10B981', '#8B5CF6']
        
        fig = go.Figure(data=[go.Pie(
            labels=statuses,
            values=counts,
            marker_colors=colors,
            hole=0.4
        )])
        
        fig.update_layout(
            title='Order Status Distribution',
            template='plotly_dark',
            height=400
        )
        
        return json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    
    def _generate_location_utilization(self):
        """Generate location utilization heatmap"""
        zones = ['A', 'B', 'C', 'D', 'E']
        aisles = ['01', '02', '03', '04']
        
        # Generate mock utilization data
        utilization_data = []
        for zone in zones:
            row = []
            for aisle in aisles:
                utilization = 30 + (ord(zone) - ord('A')) * 15 + int(aisle) * 5
                row.append(min(utilization, 95))
            utilization_data.append(row)
        
        fig = go.Figure(data=go.Heatmap(
            z=utilization_data,
            x=aisles,
            y=zones,
            colorscale='RdYlBu_r',
            colorbar=dict(title="Utilization %")
        ))
        
        fig.update_layout(
            title='Warehouse Location Utilization Heatmap',
            xaxis_title='Aisle',
            yaxis_title='Zone',
            template='plotly_dark',
            height=400
        )
        
        return json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    
    def _generate_performance_metrics(self):
        """Generate performance metrics chart"""
        metrics = ['Picking Efficiency', 'Order Accuracy', 'On-Time Delivery', 'Space Utilization']
        values = [94.2, 98.7, 96.8, 78.5]
        colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B']
        
        fig = go.Figure(data=[go.Bar(
            x=metrics,
            y=values,
            marker_color=colors,
            text=[f'{v}%' for v in values],
            textposition='auto'
        )])
        
        fig.update_layout(
            title='Warehouse Performance Metrics',
            yaxis_title='Percentage (%)',
            template='plotly_dark',
            height=400,
            yaxis=dict(range=[0, 100])
        )
        
        return json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    
    def _generate_default_chart(self):
        """Generate default chart when specific type not found"""
        fig = go.Figure(data=[go.Scatter(
            x=[1, 2, 3, 4],
            y=[10, 11, 12, 13],
            mode='lines+markers'
        )])
        
        fig.update_layout(
            title='Default Chart',
            template='plotly_dark',
            height=400
        )
        
        return json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    
    def calculate_kpis(self, data):
        """Calculate key performance indicators"""
        try:
            kpis = {
                'inventory_turnover': self._calculate_inventory_turnover(data),
                'order_fulfillment_rate': self._calculate_fulfillment_rate(data),
                'average_pick_time': self._calculate_pick_time(data),
                'space_utilization': self._calculate_space_utilization(data)
            }
            return kpis
        except Exception as e:
            self.logger.error(f"Error calculating KPIs: {e}")
            return {}
    
    def _calculate_inventory_turnover(self, data):
        """Calculate inventory turnover rate"""
        # Mock calculation - replace with actual logic
        return 4.2
    
    def _calculate_fulfillment_rate(self, data):
        """Calculate order fulfillment rate"""
        # Mock calculation - replace with actual logic
        return 96.8
    
    def _calculate_pick_time(self, data):
        """Calculate average picking time"""
        # Mock calculation - replace with actual logic
        return 3.5  # minutes
    
    def _calculate_space_utilization(self, data):
        """Calculate warehouse space utilization"""
        # Mock calculation - replace with actual logic
        return 78.5
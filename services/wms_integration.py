import requests
import json
import socket
import struct
from datetime import datetime
from config import Config
import logging

class WMSIntegration:
    def __init__(self):
        self.config = Config()
        self.logger = logging.getLogger(__name__)
        self.wms_host = self.config.WMS_APP_HOST
        self.wms_port = int(self.config.WMS_APP_PORT)
        self.api_key = self.config.WMS_API_KEY
    
    def check_connection(self):
        """Check if C WMS application is reachable"""
        try:
            # Try to connect to the WMS application
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            result = sock.connect_ex((self.wms_host, self.wms_port))
            sock.close()
            return result == 0
        except Exception as e:
            self.logger.error(f"WMS connection check failed: {e}")
            return False
    
    def fetch_latest_data(self):
        """Fetch latest data from C WMS application"""
        try:
            # Method 1: HTTP API (if your C app has REST endpoints)
            data = self._fetch_via_http()
            if data:
                return data
            
            # Method 2: Socket communication (if using custom protocol)
            data = self._fetch_via_socket()
            if data:
                return data
            
            # Method 3: File-based communication (if WMS writes to files)
            data = self._fetch_via_files()
            return data
            
        except Exception as e:
            self.logger.error(f"Error fetching WMS data: {e}")
            return self._get_mock_wms_data()
    
    def _fetch_via_http(self):
        """Fetch data via HTTP API from C WMS application"""
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            endpoints = {
                'inventory': f'http://{self.wms_host}:{self.wms_port}/api/inventory',
                'orders': f'http://{self.wms_host}:{self.wms_port}/api/orders',
                'transactions': f'http://{self.wms_host}:{self.wms_port}/api/transactions'
            }
            
            wms_data = {}
            for data_type, url in endpoints.items():
                try:
                    response = requests.get(url, headers=headers, timeout=10)
                    if response.status_code == 200:
                        wms_data[data_type] = response.json()
                    else:
                        self.logger.warning(f"HTTP {response.status_code} for {data_type}")
                except requests.RequestException as e:
                    self.logger.warning(f"HTTP request failed for {data_type}: {e}")
            
            return wms_data if wms_data else None
            
        except Exception as e:
            self.logger.error(f"HTTP fetch failed: {e}")
            return None
    
    def _fetch_via_socket(self):
        """Fetch data via socket communication with C WMS application"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(10)
            sock.connect((self.wms_host, self.wms_port))
            
            # Send request for data (customize based on your C app protocol)
            request = {
                'action': 'get_data',
                'api_key': self.api_key,
                'timestamp': datetime.now().isoformat()
            }
            
            request_data = json.dumps(request).encode('utf-8')
            request_length = struct.pack('!I', len(request_data))
            
            sock.send(request_length + request_data)
            
            # Receive response
            response_length = struct.unpack('!I', sock.recv(4))[0]
            response_data = b''
            
            while len(response_data) < response_length:
                chunk = sock.recv(response_length - len(response_data))
                if not chunk:
                    break
                response_data += chunk
            
            sock.close()
            
            if response_data:
                return json.loads(response_data.decode('utf-8'))
            
        except Exception as e:
            self.logger.error(f"Socket communication failed: {e}")
            return None
    
    def _fetch_via_files(self):
        """Fetch data from files written by C WMS application"""
        try:
            import os
            
            # Define file paths where C WMS writes data
            data_files = {
                'inventory': '/tmp/wms_inventory.json',
                'orders': '/tmp/wms_orders.json',
                'transactions': '/tmp/wms_transactions.json'
            }
            
            wms_data = {}
            for data_type, file_path in data_files.items():
                try:
                    if os.path.exists(file_path):
                        with open(file_path, 'r') as f:
                            wms_data[data_type] = json.load(f)
                except Exception as e:
                    self.logger.warning(f"Failed to read {file_path}: {e}")
            
            return wms_data if wms_data else None
            
        except Exception as e:
            self.logger.error(f"File-based fetch failed: {e}")
            return None
    
    def send_command(self, command, parameters=None):
        """Send command to C WMS application"""
        try:
            if self._send_via_http(command, parameters):
                return True
            
            if self._send_via_socket(command, parameters):
                return True
            
            return False
            
        except Exception as e:
            self.logger.error(f"Error sending command to WMS: {e}")
            return False
    
    def _send_via_http(self, command, parameters):
        """Send command via HTTP"""
        try:
            url = f'http://{self.wms_host}:{self.wms_port}/api/command'
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'command': command,
                'parameters': parameters or {},
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            return response.status_code == 200
            
        except Exception as e:
            self.logger.error(f"HTTP command send failed: {e}")
            return False
    
    def _send_via_socket(self, command, parameters):
        """Send command via socket"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(10)
            sock.connect((self.wms_host, self.wms_port))
            
            request = {
                'action': 'execute_command',
                'command': command,
                'parameters': parameters or {},
                'api_key': self.api_key,
                'timestamp': datetime.now().isoformat()
            }
            
            request_data = json.dumps(request).encode('utf-8')
            request_length = struct.pack('!I', len(request_data))
            
            sock.send(request_length + request_data)
            
            # Wait for acknowledgment
            ack_length = struct.unpack('!I', sock.recv(4))[0]
            ack_data = sock.recv(ack_length)
            
            sock.close()
            
            response = json.loads(ack_data.decode('utf-8'))
            return response.get('success', False)
            
        except Exception as e:
            self.logger.error(f"Socket command send failed: {e}")
            return False
    
    def _get_mock_wms_data(self):
        """Return mock WMS data for testing"""
        return {
            'inventory': [
                {
                    'sku': 'WDG-001',
                    'current_stock': 445,
                    'location': 'A-01-R1-S3',
                    'last_movement': datetime.now().isoformat()
                },
                {
                    'sku': 'GDG-002',
                    'current_stock': 82,
                    'location': 'B-03-R2-S1',
                    'last_movement': datetime.now().isoformat()
                }
            ],
            'orders': [
                {
                    'order_number': 'ORD-2025-001',
                    'status': 'processing',
                    'last_updated': datetime.now().isoformat()
                }
            ],
            'transactions': [
                {
                    'transaction_id': 'TXN-001',
                    'type': 'pick',
                    'sku': 'WDG-001',
                    'quantity': 5,
                    'timestamp': datetime.now().isoformat()
                }
            ]
        }
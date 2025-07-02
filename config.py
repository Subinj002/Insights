import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # MS SQL Database Configuration
    DB_SERVER = os.environ.get('DB_SERVER') or 'localhost'
    DB_DATABASE = os.environ.get('DB_DATABASE') or 'warehouse_management'
    DB_USERNAME = os.environ.get('DB_USERNAME') or 'sa'
    DB_PASSWORD = os.environ.get('DB_PASSWORD') or 'your_password'
    DB_DRIVER = os.environ.get('DB_DRIVER') or 'ODBC Driver 17 for SQL Server'
    
    # Connection string for MS SQL Server
    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}@{DB_SERVER}/{DB_DATABASE}"
        f"?driver={DB_DRIVER.replace(' ', '+')}"
    )
    
    # C WMS Application Configuration
    WMS_APP_HOST = os.environ.get('WMS_APP_HOST') or 'localhost'
    WMS_APP_PORT = os.environ.get('WMS_APP_PORT') or '8080'
    WMS_API_KEY = os.environ.get('WMS_API_KEY') or 'your_wms_api_key'
    
    # Data Processing Configuration
    SYNC_INTERVAL = int(os.environ.get('SYNC_INTERVAL', 300))  # 5 minutes
    MAX_RECORDS_PER_SYNC = int(os.environ.get('MAX_RECORDS_PER_SYNC', 10000))
    
    # Application Settings
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    TESTING = False
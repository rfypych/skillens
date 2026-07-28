import sys
import os

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
import models

def reset_database():
    print("Dropping all tables from Neon PostgreSQL database...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables in Neon PostgreSQL database...")
    Base.metadata.create_all(bind=engine)
    print("Database reset successfully! All tables re-created clean.")

if __name__ == "__main__":
    reset_database()

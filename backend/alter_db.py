import os
import sys
from sqlalchemy import text
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import engine

try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE jobs ADD COLUMN max_questions INTEGER DEFAULT 5;"))
    print("Column added successfully.")
except Exception as e:
    print(f"Error: {e}")

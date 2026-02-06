from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from pathlib import Path

# 1. robustly find the .env file
# This gets the absolute path to the 'backend' folder
# (which is 2 levels up from this file: backend/app/database.py -> backend)
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the .env file using the absolute path
load_dotenv(BASE_DIR / ".env")

# 2. Get the Database URL from the loaded variables
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Check if the URL was actually loaded (Good for debugging)
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL not found. Check your .env file or path.")

# 3. Create the Database Engine
# This acts as the bridge to your PostgreSQL database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 4. Create a SessionLocal class
# Each time a user makes a request, we create a new session from this class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Create a Base class
# All your database models (tables) will inherit from this
Base = declarative_base()

# 6. Dependency Function
# We will use this in our API routes to get a database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from app.database import SessionLocal
from app import models, crud, schemas
from app.models import DoctorProfile

# 1. Initialize the Database Session
db = SessionLocal()

def seed_data():
    print("Checking for existing data...")
    # Check if Ali already exists so we don't duplicate him
    existing_user = crud.get_user_by_email(db, "ali@doctor.com")
    if existing_user:
        print("Doctors already exist! Skipping seed.")
        return

    print("Creating doctors...")

    # --- DOCTOR 1: DR. ALI ---
    # A. Create the User (Handles password hashing automatically!)
    ali_data = schemas.UserCreate(
        email="ali@doctor.com", 
        password="password123", 
        role="doctor"
    )
    user_ali = crud.create_user(db, ali_data)
    
    # B. Create the Doctor Profile (Uses the ID from step A)
    profile_ali = DoctorProfile(
        user_id=user_ali.id,
        specialty="Cardiologist",
        bio="Expert in heart surgery with 10 years experience.",
        fee=2000,
        verified=True
    )
    db.add(profile_ali)

    # --- DOCTOR 2: DR. SARA ---
    sara_data = schemas.UserCreate(
        email="sara@doctor.com", 
        password="password123", 
        role="doctor"
    )
    user_sara = crud.create_user(db, sara_data)
    
    profile_sara = DoctorProfile(
        user_id=user_sara.id,
        specialty="Dermatologist",
        bio="Specialist in skin care and laser treatments.",
        fee=1500,
        verified=True
    )
    db.add(profile_sara)

    # 3. Save everything to the database
    db.commit()
    print("Success! Dr. Ali and Dr. Sara have been added.")

if __name__ == "__main__":
    seed_data()
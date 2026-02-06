from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

# 1. Setup Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# 2. Get User by Email (To check if email already exists)
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# 3. Create New User (The Signup Logic)
def create_user(db: Session, user: schemas.UserCreate):
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create the database model
    db_user = models.User(
        email=user.email, 
        password_hash=hashed_password, 
        role=user.role
    )
    
    # Add to DB and Commit
    db.add(db_user)
    db.commit()
    db.refresh(db_user) # Refresh to get the new ID
    return db_user

# ... keep your existing code ...

# 4. Verify Password (Check if plain password matches the hash)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 5. Authenticate User (Find user and check password)
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

# ... keep existing code ...

# 6. Get All Doctors (With optional Search filter)
def get_doctors(db: Session, search: str = None):
    # Start looking at DoctorProfiles
    query = db.query(models.DoctorProfile).join(models.User)
    
    # If the user typed a search term, filter by specialty
    if search:
        # ilike means "case-insensitive search" (Dentist = dentist)
        query = query.filter(models.DoctorProfile.specialty.ilike(f"%{search}%"))
        
    return query.all()

# ... existing code ...

# 7. Create Appointment
def create_appointment(db: Session, appointment: schemas.AppointmentCreate, patient_id: int):
    db_appointment = models.Appointment(
        patient_id=patient_id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        notes=appointment.notes,
        status="Pending"
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment
# ... existing code ...

# 8. Get Appointments for a specific patient
def get_patient_appointments(db: Session, patient_id: int):
    return db.query(models.Appointment).filter(models.Appointment.patient_id == patient_id).all()
# ... existing code ...

# 9. Get Appointments for a specific DOCTOR
def get_doctor_appointments(db: Session, doctor_id: int):
    # Order by time so they see the earliest appointment first
    return db.query(models.Appointment)\
             .filter(models.Appointment.doctor_id == doctor_id)\
             .order_by(models.Appointment.appointment_time.asc())\
             .all()
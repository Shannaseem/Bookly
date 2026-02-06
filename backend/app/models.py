from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from .database import Base

# 1. User Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # "patient" or "doctor"
    profile_image = Column(String, nullable=True)

    # Relationships
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)

# 2. Doctor Profile Table
class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialty = Column(String)
    bio = Column(Text)
    fee = Column(Integer)
    verified = Column(Boolean, default=False)

    # Relationship back to User
    user = relationship("User", back_populates="doctor_profile")

# 3. Appointments Table
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("users.id")) 
    appointment_time = Column(String, nullable=False)
    status = Column(String, default="Pending")
    notes = Column(Text, nullable=True)

    # Relationships
    patient = relationship("User", foreign_keys=[patient_id])
    
    # --- CRITICAL FIX IS HERE ---
    # This tells Python: "When I ask for the doctor, fetch the DoctorProfile, not just the User."
    doctor = relationship(
        "DoctorProfile", 
        foreign_keys=[doctor_id], 
        primaryjoin="DoctorProfile.user_id == Appointment.doctor_id",
        viewonly=True
    )
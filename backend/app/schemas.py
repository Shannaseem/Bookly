from pydantic import BaseModel, EmailStr
from typing import Optional

# 1. Base Schema (Shared properties)
class UserBase(BaseModel):
    email: EmailStr

# 2. Schema for CREATING a user (Signup)
# We need the password here
class UserCreate(UserBase):
    password: str
    role: str = "patient"  # Default role is patient

# 3. Schema for RETURNING a user (Response)
# We NEVER return the password to the frontend!
class UserOut(UserBase):
    id: int
    role: str
    profile_image: Optional[str] = None

    class Config:
        # This tells Pydantic to read data even if it's not a dictionary
        # (It allows it to read from the ORM model we created earlier)
        from_attributes = True

# ... keep your existing code ...

# 4. Token Schema (The Wristband)
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str # <--- Add this!

class TokenData(BaseModel):
    email: Optional[str] = None

# ... keep existing code ...

# 5. Schema for RETURNING a Doctor (Public View)
class DoctorOut(BaseModel):
    id: int
    specialty: str
    fee: int
    bio: Optional[str] = None
    user: UserOut  # <--- Nested! Includes name (email) and profile_image

    class Config:
        from_attributes = True

# ... existing code ...

# 6. Schema for CREATING an Appointment
class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_time: str # Format: "2025-10-20 10:00 AM"
    notes: Optional[str] = None

# 7. Schema for RETURNING an Appointment
class AppointmentOut(BaseModel):
    id: int
    appointment_time: str
    status: str
    doctor: DoctorOut # Nested to show doctor details!
    
    class Config:
        from_attributes = True
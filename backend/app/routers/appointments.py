from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, database, crud, auth, models

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)

@router.post("/", response_model=schemas.AppointmentOut)
def book_appointment(
    appointment: schemas.AppointmentCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user) # <--- Security Check!
):
    # 1. Prevent Doctors from booking appointments (optional logic)
    if current_user.role == "doctor":
        raise HTTPException(status_code=400, detail="Doctors cannot book appointments.")

    # 2. Save to DB
    return crud.create_appointment(db=db, appointment=appointment, patient_id=current_user.id)

from typing import List
# ... existing imports ...

# GET /appointments/my-appointments
@router.get("/my-appointments", response_model=List[schemas.AppointmentOut])
def read_my_appointments(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Security: Only allow patients to call this
    if current_user.role != "patient":
        raise HTTPException(status_code=400, detail="Only patients can view this list.")
        
    return crud.get_patient_appointments(db=db, patient_id=current_user.id)

# ... existing code ...

# GET /appointments/doctor-queue (For Doctors Only)
@router.get("/doctor-queue", response_model=List[schemas.AppointmentOut])
def read_doctor_queue(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=400, detail="Only doctors can view this queue.")
        
    return crud.get_doctor_appointments(db=db, doctor_id=current_user.id)
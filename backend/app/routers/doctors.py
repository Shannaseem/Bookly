from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, database, crud

router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)

# GET /doctors?search=Dentist
@router.get("/", response_model=List[schemas.DoctorOut])
def read_doctors(search: str = None, db: Session = Depends(database.get_db)):
    doctors = crud.get_doctors(db, search=search)
    return doctors
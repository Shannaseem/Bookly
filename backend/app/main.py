from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, doctors  # <--- 1. Import doctors
from .routers import auth, doctors, appointments

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (Keep this section exactly as you have it)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ... app setup ...

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(appointments.router) # <--- Add this line

@app.get("/")
def read_root():
    return {"message": "MediConnect API is running!"}
// ===========================
// GLOBAL CONFIG
// ===========================
const API_URL = "http://127.0.0.1:8000";

// ===========================
// UI ELEMENTS
// ===========================
const loginBtn = document.getElementById("loginBtn");
const authModal = document.getElementById("authModal");
const closeBtn = document.querySelector(".close-btn");
const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const modalTitle = document.getElementById("modalTitle");

// 1. OPEN MODAL
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    // If logged in, this button acts as Logout. Handled below.
    if (!localStorage.getItem("token")) {
      authModal.style.display = "flex";
    }
  });
}

// 2. CLOSE MODAL (X Button)
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    authModal.style.display = "none";
  });
}

// 3. CLOSE MODAL (Click outside)
window.addEventListener("click", (e) => {
  if (e.target === authModal) {
    authModal.style.display = "none";
  }
});

// 4. SWITCH TO SIGNUP
if (switchToSignup) {
  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    modalTitle.innerText = "Create Account";
  });
}

// 5. SWITCH TO LOGIN
if (switchToLogin) {
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    modalTitle.innerText = "Welcome Back";
  });
}

// ===========================
// 6. FETCH AND DISPLAY DOCTORS
// ===========================
const doctorsGrid = document.getElementById("doctorsGrid");

async function loadDoctors(searchQuery = "") {
  if (!doctorsGrid) return; // Guard clause

  try {
    let url = `${API_URL}/doctors/`;
    if (searchQuery) {
      url += `?search=${searchQuery}`;
    }

    const response = await fetch(url);
    const doctors = await response.json();

    doctorsGrid.innerHTML = "";

    if (doctors.length === 0) {
      doctorsGrid.innerHTML = "<p>No doctors found.</p>";
      return;
    }

    doctors.forEach((doc) => {
      const card = document.createElement("div");
      card.classList.add("doctor-card");

      // Robust Image Handling
      const imageSrc =
        doc.user.profile_image ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

      // Extract name safely
      const docName = doc.user.email ? doc.user.email.split("@")[0] : "Doctor";

      card.innerHTML = `
        <div class="doc-img" style="background-image: url('${imageSrc}'); background-size: cover;"></div>
        <h3>Dr. ${docName}</h3> 
        <p style="color: #EE6C4D; font-weight: bold;">${doc.specialty}</p>
        <p>${doc.bio || "No bio available."}</p>
        <p><strong>Fee:</strong> $${doc.fee}</p>
<button class="btn-secondary" onclick="bookAppointment(${doc.user.id}, 'Dr. ${docName}')">Book Now</button>      `;

      doctorsGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading doctors:", error);
    doctorsGrid.innerHTML =
      '<p style="color:red">Failed to load doctors. Is backend running?</p>';
  }
}

// Load doctors initially
loadDoctors();

// ===========================
// 7. HANDLE SEARCH
// ===========================
const searchBtn = document.querySelector(".btn-search");
const searchInput = document.querySelector(".search-bar input");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value;
    loadDoctors(query);
  });
}

// ===========================
// 8. BOOKING LOGIC
// ===========================
const bookingModal = document.getElementById("bookingModal");
const closeBooking = document.getElementById("closeBooking");
const bookingForm = document.getElementById("bookingForm");
const bookingDoctorId = document.getElementById("bookingDoctorId");
const bookingDoctorName = document.getElementById("bookingDoctorName");

if (bookingModal) {
  // Close Booking Modal
  if (closeBooking) {
    closeBooking.addEventListener("click", () => {
      bookingModal.style.display = "none";
    });
  }

  // Handle Form Submit
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const doctorId = bookingDoctorId.value;
      const time = document.getElementById("appointmentTime").value;
      const notes = document.getElementById("appointmentNotes").value;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/appointments/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctor_id: doctorId,
            appointment_time: time.replace("T", " "),
            notes: notes,
          }),
        });

        if (response.ok) {
          alert("Success! Your appointment is booked.");
          bookingModal.style.display = "none";
          bookingForm.reset();
        } else {
          const data = await response.json();
          alert("Error: " + data.detail);
        }
      } catch (error) {
        alert("Server error. Is backend running?");
      }
    });
  }
}

// Global function to open modal
window.bookAppointment = function (doctorId, doctorName) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please Login to book an appointment!");
    if (loginBtn) loginBtn.click(); // Trigger login modal
    return;
  }

  if (bookingModal && bookingDoctorId && bookingDoctorName) {
    bookingDoctorId.value = doctorId;
    bookingDoctorName.innerText = "Booking with " + doctorName;
    bookingModal.style.display = "flex";
  } else {
    console.error("Booking Modal elements are missing from HTML!");
  }
};

// ===========================
// 9. DASHBOARD & NAVIGATION LOGIC
// ===========================
const navMyAppointments = document.getElementById("navMyAppointments");
// Create Doctor Dashboard Link Dynamically
const navDoctorQueue = document.createElement("a");
navDoctorQueue.innerText = "Doctor Dashboard";
navDoctorQueue.href = "#";
navDoctorQueue.style.display = "none"; // Hidden by default
// Insert it before the login button in the navbar
const navContainer = document.querySelector(".nav-links");
if (navContainer && loginBtn) {
  navContainer.insertBefore(navDoctorQueue, loginBtn);
}

const patientDashboard = document.getElementById("patientDashboard");
const doctorDashboard = document.getElementById("doctorDashboard");
const doctorsSection = document.getElementById("doctorsContent");
const heroSection = document.getElementById("mainContent");
const appointmentsGrid = document.getElementById("appointmentsGrid");
const doctorQueueGrid = document.getElementById("doctorQueueGrid");
const backToHomeBtn = document.getElementById("backToHomeBtn");
const docBackToHomeBtn = document.getElementById("docBackToHomeBtn");

// --- CHECK LOGIN STATUS ---
function checkLoginStatus() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    if (loginBtn) loginBtn.innerText = "Logout";

    // Show correct dashboard link based on Role
    if (role === "doctor") {
      navDoctorQueue.style.display = "inline-block";
      if (navMyAppointments) navMyAppointments.style.display = "none";
    } else {
      // Default to Patient
      if (navMyAppointments) navMyAppointments.style.display = "inline-block";
      navDoctorQueue.style.display = "none";
    }
  } else {
    if (loginBtn) loginBtn.innerText = "Login / Sign Up";
    if (navMyAppointments) navMyAppointments.style.display = "none";
    navDoctorQueue.style.display = "none";
  }
}

// Run check immediately
checkLoginStatus();

// --- HANDLE LOGOUT ---
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Logout Logic
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("Logged out successfully.");
      location.reload();
    }
    // Else: The Open Modal logic at the top handles the login click
  });
}

// --- LOAD PATIENT DASHBOARD ---
async function loadMyAppointments() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/appointments/my-appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const appointments = await response.json();
    appointmentsGrid.innerHTML = "";

    if (appointments.length === 0) {
      appointmentsGrid.innerHTML = "<p>No upcoming appointments found.</p>";
      return;
    }

    appointments.forEach((appt) => {
      const card = document.createElement("div");
      card.classList.add("doctor-card");
      const statusColor = appt.status === "Pending" ? "orange" : "green";

      // Try to get doctor specialty safely
      const docSpecialty = appt.doctor ? appt.doctor.specialty : "General";

      card.innerHTML = `
        <h3>Dr. ${docSpecialty}</h3> 
        <p><strong>Date:</strong> ${appt.appointment_time}</p>
        <p><strong>Status:</strong> <span style="color:${statusColor}">${appt.status}</span></p>
        <button class="btn-secondary" style="background-color: grey;">Cancel</button>
      `;
      appointmentsGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);
  }
}

// --- LOAD DOCTOR DASHBOARD ---
async function loadDoctorQueue() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/appointments/doctor-queue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const appointments = await response.json();
    doctorQueueGrid.innerHTML = "";

    if (appointments.length === 0) {
      doctorQueueGrid.innerHTML = "<p>No patients in queue.</p>";
      return;
    }

    appointments.forEach((appt) => {
      const card = document.createElement("div");
      card.classList.add("doctor-card");

      card.innerHTML = `
                <h3>Patient ID: ${appt.patient_id || "Unknown"}</h3>
                <p><strong>Time:</strong> ${appt.appointment_time}</p>
                <p><strong>Notes:</strong> ${appt.notes || "None"}</p>
                <p><strong>Status:</strong> ${appt.status}</p>
                <button class="btn-primary" onclick="alert('Mark as Done feature coming soon!')">Mark Done</button>
            `;
      doctorQueueGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading queue:", error);
  }
}

// --- NAVIGATION EVENTS ---

// 1. Patient Dashboard Click
if (navMyAppointments) {
  navMyAppointments.addEventListener("click", (e) => {
    e.preventDefault();
    heroSection.style.display = "none";
    doctorsSection.style.display = "none";
    if (doctorDashboard) doctorDashboard.style.display = "none";

    patientDashboard.style.display = "block";
    loadMyAppointments();
  });
}

// 2. Doctor Dashboard Click
navDoctorQueue.addEventListener("click", (e) => {
  e.preventDefault();
  heroSection.style.display = "none";
  doctorsSection.style.display = "none";
  if (patientDashboard) patientDashboard.style.display = "none";

  if (doctorDashboard) {
    doctorDashboard.style.display = "block";
    loadDoctorQueue();
  }
});

// 3. Back to Home (Patient)
if (backToHomeBtn) {
  backToHomeBtn.addEventListener("click", () => {
    heroSection.style.display = "flex";
    doctorsSection.style.display = "block";
    patientDashboard.style.display = "none";
  });
}

// 4. Back to Home (Doctor)
if (docBackToHomeBtn) {
  docBackToHomeBtn.addEventListener("click", () => {
    heroSection.style.display = "flex";
    doctorsSection.style.display = "block";
    doctorDashboard.style.display = "none";
  });
}

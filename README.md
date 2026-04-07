# 🏥 HospitalApp — Appointment Booking & Queue Management System

A full-stack web application that digitizes hospital appointment booking and manages patient queues efficiently, reducing waiting times and improving the overall healthcare experience.

---

---

## 🌐 Live Demo  
[Visit the App](https://hospital-app-snowy.vercel.app/)

---

---

## 📸 Screenshots

| Login Page | Patient Dashboard | Doctor Dashboard |
|---|---|---|
| ![Login](https://github.com/user-attachments/assets/bade115b-fbc4-419a-9e2f-b7ce7120500d) | ![Patient](https://github.com/user-attachments/assets/f92be8f9-6f66-4812-a149-8abfeef1101a) | ![Doctor](https://github.com/user-attachments/assets/bce459c1-5c75-4fc4-bd1c-16ebb5fd7519) |

---

## 🎯 Features

### 🔐 Authentication
- Secure register and login for patients and doctors
- JWT-based authentication
- Password encryption using bcrypt
- Role-based routing (patient/doctor)

### 📅 Appointment Booking
- View all available doctors with specializations
- Book time slots with preferred doctors
- Auto-generated token numbers per day
- Slot conflict prevention
- Cancel appointments

### 🎫 Queue Management
- Real-time queue dashboard for doctors
- Token-based patient ordering
- Status tracking: Waiting → In Progress → Done
- Call next patient functionality
- Today's patient count and pending queue stats

### 📋 Medical Records
- Doctor can add diagnosis, medicines and notes after consultation
- Patient can view complete medical history
- All past visits stored digitally
- Secure access — patients can only view their own records

### 🚶 Walk-in Support
- Receptionist/Doctor can add walk-in patients directly
- Walk-in patients join the same queue as online patients

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT + Bcrypt |
| HTTP Client | Axios |
| Routing | React Router DOM |
| Version Control | Git + GitHub |
| AI Assistant | GitHub Copilot |

---

## 🗂️ Project Structure
```
hospital-app/
├── frontend/                  # React Application
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── PatientDashboard.jsx
│       │   ├── DoctorDashboard.jsx
│       │   ├── BookAppointment.jsx
│       │   ├── MyAppointments.jsx
│       │   └── MedicalRecords.jsx
│       ├── components/
│       │   └── Navbar.jsx
│       └── App.js
│
└── backend/                   # Node.js + Express API
    ├── models/
    │   ├── User.js
    │   ├── Doctor.js
    │   └── Appointment.js
    ├── routes/
    │   ├── auth.js
    │   ├── doctors.js
    │   └── appointments.js
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/anirudhg-07/hospital-app.git
cd hospital-app
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Run the backend:
```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm start
```

**4. Open your browser**
```
Frontend: https://hospital-app-snowy.vercel.app/
Backend:  http://localhost:8000
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Doctor Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/:id` | Get single doctor |
| POST | `/api/doctors/create` | Create doctor profile |

### Appointment Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/appointments/book` | Book appointment |
| GET | `/api/appointments/patient/:id` | Get patient appointments |
| GET | `/api/appointments/doctor/:id` | Get doctor's queue |
| PUT | `/api/appointments/status/:id` | Update status |
| PUT | `/api/appointments/cancel/:id` | Cancel appointment |

---

## 🎓 Academic Details

| Field | Details |
|---|---|
| Name | G Anirudh |
| Institution | SRM Institute of Science and Technology |
| Project Type | Full Stack Web Development |

---

## 📊 Development Phases

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Setup & Installation | Complete |
| Phase 1 | Authentication & Dashboards | Complete |
| Phase 2 | Appointment Booking & Queue | Complete |
| Phase 3 | Doctor Queue Management | Complete |
| Phase 4 | Medical Records | Complete |
| Phase 5 | Polish & Deployment | Complete |

---

## 📝 License
This project is for educational purposes only.

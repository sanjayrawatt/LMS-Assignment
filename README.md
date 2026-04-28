# LMS Pro: Advanced Loan Management System

LMS Pro is a full-stack, enterprise-grade Loan Management System designed to handle the end-to-end lifecycle of a loan—from borrower application and automated eligibility verification to disbursement and collection.

## 🚀 Key Features

### 1. Borrower Application Portal
- **4-Step Wizard**: Seamless application flow with real-time validation.
- **Business Rule Engine (BRE)**: Server-side eligibility check (Age: 23-50, Salary: >₹25,000, valid PAN, Employment status).
- **Loan Calculator**: Interactive math panel for Simple Interest calculation and repayment estimation.
- **Document Management**: Interactive file selection for salary slips.

### 2. Operations Dashboard (RBAC)
- **Role-Based Access Control**: Secure access for Admin, Sales, Sanction, Disbursement, and Collection roles.
- **Sales Module**: Lead tracking for registered users who haven't applied.
- **Sanction Module**: Approving/Rejecting loans with automated state transitions.
- **Disbursement Module**: Managing fund releases and activation.
- **Collection Module**: Recording repayments with unique UTR tracking and **Auto-closure** logic.

### 3. Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion (Animations), Axios.
- **Backend**: Node.js, Express, TypeScript, JWT, Bcrypt.
- **Database**: MongoDB + Mongoose.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
# Update .env with your MONGODB_URI and JWT_SECRET
npm run seed  # This creates the demo accounts
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials (Password: `password123`)

| Role | Email | Access |
| :--- | :--- | :--- |
| **Admin** | `admin@lms.com` | All Modules |
| **Sales** | `sales@lms.com` | Sales (Leads) |
| **Sanction** | `sanction@lms.com` | Sanction (Approval) |
| **Disbursement**| `disburse@lms.com` | Disbursement (Release) |
| **Collection** | `collect@lms.com` | Collection (Repayment)|
| **Borrower** | `borrower@lms.com` | Application Portal |

---

## 🏗️ Architecture & Design Decisions

### Business Rule Engine (BRE)
The BRE is implemented as a utility on the backend to ensure security. It validates:
- **Age**: Calculated from DOB, must be between 23 and 50.
- **Income**: Monthly salary must be at least ₹25,000.
- **PAN**: Validated against a strict Regex pattern (`[A-Z]{5}[0-9]{4}[A-Z]{1}`).

### State Machine
Loans transition through the following states:
`Applied` → `Sanctioned` → `Disbursed` → `Closed` (or `Rejected`).

### UI/UX
- **Smooth Transitions**: Used `Framer Motion` for module switching to prevent flickering and layout shifts.
- **Responsive Design**: Clean, dark-themed dashboard inspired by modern fintech applications.

---

## 📄 Submission Requirements Check
- [x] Full-stack application working end-to-end.
- [x] Role-Based Access Control implemented on both frontend and backend.
- [x] Automated BRE logic on the server.
- [x] Seed script for pre-created accounts.
- [x] README with setup instructions and credentials.
- [x] `.env.example` included.

---
*Developed as part of the LMS Developer Assignment.*

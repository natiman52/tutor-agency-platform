# 🛠️ System Documentation - Tutor Marketplace Backend

This document explains the core features implemented, the technical architecture, and how to interact with the various systems.

---

## 🚀 Key Features

### 1. 🔍 Optimized Discovery & Filtering
Users can search for tutors, subjects, and specific expertise.
- **Expertise List**: `GET /api/auth/expertise/` (Searchable via `?name__icontains=math`)
- **Tutors**: `GET /api/auth/users/?role=tutor`
- **Filtering**: Integrated `django-filter` with `icontains` support for names, locations, and expertise.

### 2. 📁 Qualification System (Refactored from Portfolio)
A structured system for tutors to showcase Education, Awards, Certificates, and Work Experience.
- **Models**: `Qualification` and `QualificationImage`.
- **Status**: Qualifications have a `status` (Pending, Approved, Rejected) for admin moderation.
- **Access**: 
    - `POST /api/auth/users/qualifications/` -> Create (Multipart).
    - `GET /api/auth/users/<user_id>/qualifications/` -> Public view of **Approved** items only.

### 3. 👤 Profile & Identity Verification
- **Identity photo**: Tutors can upload an `id_photo` for verification.
- **Title**: Professional titles (e.g., "Physics Specialist").
- **Expertise**: A list of tagged expertise from the global Expertise model.
- **Endpoints**: `api/auth/users/me/update/` (Handles updates).

### 4. 📅 Availability & Scheduling
Tutors can set their weekly working hours.
- **Endpoints**: 
    - `GET /api/auth/users/availabilities/` -> Manage my slots.
    - `GET /api/auth/users/<user_id>/availabilities/` -> View a tutor's schedule.

### 5. 💳 Wallet & Chapa Integration
A secure financial system using Chapa as the payment gateway for deposits and withdrawals.
- **Balance**: `MyUser.balance` tracks available funds.
- **Transactions**: Logged in the `Transaction` model.

---

## 🔐 Admin Verification Endpoints
Dedicated endpoints for administrators (superusers) to manage platform integrity.
- **Base Path**: `/api/admin/verifications/`
- **Identity Verification**:
    - `GET users/` -> List all users with a pending ID verification (has `id_photo` but `is_id_verified=False`).
    - `PATCH users/<int:id>/` -> Update verification status (`{"is_id_verified": true}`).
- **Qualification Verification**:
    - `GET qualifications/` -> List all pending qualifications.
    - `PATCH qualifications/<int:id>/` -> Approve/Reject (`{"status": "approved"}`).

---

## 📖 API Usage Guide

### **Qualification Creation (Multipart)**
**Endpoint**: `POST /api/auth/users/qualifications/`
**Body**:
- `title`: "MSc in Advanced Physics"
- `type`: "education"
- `description`: "Studied at XYZ University"
- `uploaded_images`: [File1, File2]

### **Setting Availability**
**Endpoint**: `POST /api/auth/users/availabilities/`
**Body**:
- `day_of_week`: 1 (Tuesday)
- `start_time`: "10:00:00"
- `end_time`: "12:00:00"

---

## 🧹 Automated Maintenance
The system uses `django-crontab` for periodic tasks.
- **Cleanup Tokens**: Every 30 minutes, the `cleanup_tokens` management command runs to delete expired OTPs and Password Reset Tokens.
- **Management**:
    - `python manage.py crontab add` -> Install scheduled jobs to system crontab.
    - `python manage.py crontab show` -> View scheduled jobs.
    - `python manage.py crontab remove` -> Remove jobs.

---

## ⚙️ Configuration
The system relies on `CHAPA_SECRET_KEY` in the environment and standard media storage for ID photos and qualification documents.

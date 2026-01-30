# Mini EMR + Patient Portal

A full-stack mini electronic medical record (EMR) system with an admin dashboard and patient portal.

Built with Next.js App Router + Prisma + PostgreSQL.

This project demonstrates CRUD patient management, appointment scheduling, prescription tracking, and session-based authentication.

---

## Features

### Admin EMR
- Create new patients
- View patient records
- Manage appointments (create / update / delete)
- Manage prescriptions (create / update / delete)
- Recurring appointment support
- Clean dashboard-style UI

### Patient Portal
- Secure login with session cookies
- View upcoming appointments
- View prescription refills
- Personal dashboard experience

---

## Tech Stack

- **Next.js 16** (App Router, Server Components)
- **React 19**
- **Prisma ORM**
- **PostgreSQL**
- **Tailwind CSS**
- **bcrypt** for password hashing
- **JWT sessions** via cookies
- **Vercel** deployment

---

## Live Demo

Admin dashboard:
/admin

Patient portal:
/portal


Live deployment:
https://mini-emr-portal.vercel.app

---

## Local Setup

### 1. Clone repository

git clone https://github.com/RJoshi141/mini-emr-portal
cd mini-emr-portal


## Install dependencies

npm install


## Environment variables

Create a .env.local file:

DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="your-random-secret"


## Database setup

Run migrations:

npx prisma migrate dev




## Run locally

npm run dev



## Run Prisma

npx prisma generate
npx prisma db push
npx prisma db seed

## Start development server

npm run dev

### Open:
http://localhost:3000


## Deployment

Deploy to Vercel:

vercel



## Authentication

The patient portal uses JWT sessions stored in HTTP-only cookies.

Login creates a signed session

Portal routes require authentication

Logout clears the session cookie

Sessions expire automatically


## Database Schema
Core models:

Patient

Appointment

Prescription

MedicationOption

DosageOption

Appointments support recurrence rules and end dates.


##  Seed Data
The seed script creates demo:

patients

appointments

prescriptions

medication options

dosage options

Run:

npx prisma db seed

## Project Structure

src/app/admin/ - Admin dashboard
src/app/portal/ - Patient portal
src/app/api/admin/ - Admin API routes
src/app/api/auth/ - Auth routes
src/lib/db.ts - Prisma client
src/lib/auth.ts - Auth helpers
src/prisma/schema.prisma - Database schema
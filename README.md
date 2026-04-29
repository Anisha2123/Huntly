# Huntly — Premium Doctor Directory Platform

A full-stack, production-ready doctor listing platform inspired by JustDial, built with **Next.js 14**, **Node.js/Express**, and **MongoDB**.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Fonts     | Cormorant Garamond (display) + DM Sans (body) |
| State     | Zustand (auth) + SWR (data fetching) |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose ODM              |
| Auth      | JWT (JSON Web Tokens) + bcrypt      |

---

## Features

- 🔍 **Full-text search** — by name, specialization, clinic
- 🗂️ **Advanced filtering** — city, area, specialization, fee range, rating, availability
- 🏥 **Doctor profiles** — qualifications, clinics, timings, services, fees
- ⭐ **Review system** — verified patient reviews with ratings
- 📅 **Appointment booking** — clinic & online with time slot selection
- 👤 **User dashboard** — manage bookings, saved doctors, profile
- 🛡️ **Admin panel** — add/edit/remove doctors, manage categories
- 📱 **Fully responsive** — mobile-first design
- 🔐 **JWT auth** — secure login/register for patients and admins

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET

# Seed with sample data (40 doctors, categories, reviews)
npm run seed

# Start the API server
npm run dev
# → Running on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start Next.js dev server
npm run dev
# → Running on http://localhost:3000
```

---

## Project Structure

```
Huntly/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT protect + authorize
│   ├── models/
│   │   ├── User.js              # Patient & Admin users
│   │   ├── Doctor.js            # Main listing model
│   │   ├── Category.js          # Specializations
│   │   ├── Location.js          # Cities & Areas
│   │   ├── Review.js            # Ratings & feedback
│   │   └── Booking.js           # Appointments
│   ├── routes/
│   │   ├── auth.js              # Login, register, profile
│   │   ├── doctors.js           # CRUD + full-text search
│   │   ├── reviews.js           # Reviews per doctor
│   │   ├── bookings.js          # Book / cancel
│   │   └── categories.js        # Categories + locations
│   ├── scripts/
│   │   └── seed.js              # Sample data seeder
│   ├── .env.example
│   └── server.js                # Express app entry point
│
└── frontend/
    ├── app/
    │   ├── page.tsx             # Homepage (hero, categories, featured)
    │   ├── doctors/
    │   │   ├── page.tsx         # Listing with filters + pagination
    │   │   └── [slug]/page.tsx  # Doctor profile with booking
    │   ├── auth/
    │   │   ├── login/page.tsx   # Sign in
    │   │   └── register/page.tsx# Sign up
    │   ├── dashboard/page.tsx   # User dashboard
    │   ├── layout.tsx           # Root layout + fonts
    │   └── globals.css          # Design tokens + utilities
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx       # Sticky nav with auth state
    │   │   └── Footer.tsx       # Links + branding
    │   ├── doctor/
    │   │   ├── DoctorCard.tsx   # Listing card
    │   │   └── FilterSidebar.tsx# Desktop + mobile filters
    │   └── ui/
    │       ├── SearchBar.tsx    # Hero search with city picker
    │       └── StarRating.tsx   # Interactive star widget
    ├── lib/
    │   ├── api.ts               # Axios client + all API calls
    │   ├── store.ts             # Zustand auth store
    │   └── utils.ts             # Helpers, formatters, constants
    └── tailwind.config.js
```

---

## API Endpoints

### Auth
| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| POST   | `/api/auth/register`   | Create account         |
| POST   | `/api/auth/login`      | Sign in, returns JWT   |
| GET    | `/api/auth/me`         | Get current user       |
| PUT    | `/api/auth/me`         | Update profile         |
| POST   | `/api/auth/save-doctor/:id` | Toggle save doctor|

### Doctors
| Method | Endpoint                       | Description                  |
|--------|--------------------------------|------------------------------|
| GET    | `/api/doctors`                 | List with filters + pagination |
| GET    | `/api/doctors/featured`        | Featured doctors             |
| GET    | `/api/doctors/top-rated`       | Top rated by city            |
| GET    | `/api/doctors/:slug`           | Doctor profile               |
| POST   | `/api/doctors`                 | Create (admin only)          |
| PUT    | `/api/doctors/:id`             | Update (admin only)          |
| DELETE | `/api/doctors/:id`             | Deactivate (admin only)      |

### Reviews
| Method | Endpoint                              | Description         |
|--------|---------------------------------------|---------------------|
| GET    | `/api/doctors/:id/reviews`            | List reviews        |
| POST   | `/api/doctors/:id/reviews`            | Submit review       |
| PUT    | `/api/doctors/:id/reviews/:rid/helpful` | Mark helpful     |

### Bookings
| Method | Endpoint                    | Description         |
|--------|-----------------------------|---------------------|
| POST   | `/api/bookings`             | Create booking      |
| GET    | `/api/bookings/my`          | User's bookings     |
| PUT    | `/api/bookings/:id/cancel`  | Cancel booking      |

---

## Filter Parameters (GET /api/doctors)

| Param           | Type    | Description                        |
|-----------------|---------|------------------------------------|
| `search`        | string  | Full-text search                   |
| `city`          | string  | Filter by city                     |
| `area`          | string  | Filter by area                     |
| `specialization`| string  | Category slug                      |
| `minFee`        | number  | Minimum consultation fee           |
| `maxFee`        | number  | Maximum consultation fee           |
| `minRating`     | number  | Minimum average rating             |
| `availableOnline` | bool  | Online consultation available      |
| `availableToday`| bool    | Available today                    |
| `sortBy`        | string  | rating / fee_asc / fee_desc / experience / reviews / newest |
| `page`          | number  | Page number (default: 1)           |
| `limit`         | number  | Results per page (default: 12)     |

---

## Color Palette

| Token         | Hex       | Usage                    |
|---------------|-----------|--------------------------|
| Primary Dark  | `#1F6F5F` | Main brand, CTA buttons  |
| Primary Mid   | `#2FA084` | Links, accents           |
| Primary Light | `#6FCF97` | Highlights, tags         |
| Surface       | `#EEEEEE` | Page backgrounds         |

---

## Demo Credentials

- **Patient:** `rahul@test.com` / `test123`
- **Admin:** `admin@Huntly.com` / `admin123`

---

## Production Deployment

### Backend (Render / Railway / EC2)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.render.com/api
```

---

## License
MIT — Free to use, modify and deploy.

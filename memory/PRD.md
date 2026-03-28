# Atera Landing Page - PRD

## Original Problem Statement
Build a one-page landing site for atera.com.tr similar to laptop.co.nz. Business sells IT equipment, laptops, gaming desks, and monitor arms.

## User Personas
1. **Site Visitors** - Turkish/English speaking customers looking for IT equipment
2. **Admin Users** - Atera staff managing content (banners, brands, messages)

## Core Requirements
- Hero section with carousel/banners (admin manageable)
- Brand partners logos section (HP, Lenovo, Dell, VIYERO)
- Contact form with email integration
- Turkish/English language support
- Admin panel for content management

## What's Been Implemented (Dec 2025)

### Landing Page
- [x] Hero carousel with auto-slide (5s interval)
- [x] Navigation with smooth scroll to sections
- [x] Language switcher (TR/EN) with localStorage persistence
- [x] Products section (Laptops, Gaming Desk, Monitor Arms)
- [x] Brand partners marquee (HP, Lenovo, Dell, VIYERO)
- [x] Contact form with validation
- [x] Mobile responsive with hamburger menu
- [x] Glassmorphism header design

### Admin Panel
- [x] JWT cookie authentication
- [x] Banner CRUD (add, edit, delete, toggle active)
- [x] Brand CRUD (add, edit, delete, toggle active)
- [x] Contact messages view (mark as read, delete)
- [x] Logout functionality

### Backend
- [x] FastAPI with MongoDB
- [x] JWT authentication with httpOnly cookies
- [x] Auto-seeding admin user and default content
- [x] Public and protected API routes

## Prioritized Backlog

### P0 (Critical) - DONE
- All core features implemented

### P1 (High Priority)
- [ ] Resend email integration for contact form
- [ ] Admin image upload (currently using URL)
- [ ] Atera logo replacement (user to provide)

### P2 (Medium Priority)
- [ ] Product categories management
- [ ] SEO meta tags optimization
- [ ] Analytics integration

## Tech Stack
- Frontend: React + TailwindCSS + Shadcn UI
- Backend: FastAPI + MongoDB
- Auth: JWT with httpOnly cookies

## Admin Credentials
- Email: admin@atera.com.tr
- Password: admin123

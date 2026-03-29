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
- Full visual customization from Admin Dashboard

## What's Been Implemented

### Landing Page
- [x] Hero carousel with auto-slide (5s interval)
- [x] Navigation with smooth scroll (Ürünler, Markalar, İletişim - no Yönetim link)
- [x] Language switcher (TR/EN) with localStorage persistence
- [x] Products section (Laptops, Gaming Desk, Monitor Arms)
- [x] Brand partners marquee (HP, Lenovo, Dell, VIYERO) - HP & Dell 35% larger
- [x] Contact form (name, email, message - phone removed)
- [x] Contact info with editable address (phone removed)
- [x] Mobile responsive with hamburger menu
- [x] Glassmorphism header design
- [x] Dynamic color, font, and text shadow support from Admin settings

### Admin Panel
- [x] JWT localStorage authentication (Bearer token)
- [x] Banner CRUD (add, edit, delete, toggle active)
- [x] Brand CRUD (add, edit, delete, toggle active)
- [x] Contact messages view (mark as read, delete)
- [x] Color settings: background, surface, header, header_text_color, primary, text, secondary
- [x] Font settings: heading font, body font
- [x] Text shadow settings: banner text shadow, menu shadow/bold, brands subtitle shadow/bold
- [x] Burger menu color control, Logo URL/text, Menu text editing (TR/EN)
- [x] Contact section settings: title TR/EN, subtitle TR/EN, address, title/subtitle/address colors

### Backend
- [x] FastAPI with MongoDB (Motor async)
- [x] JWT authentication with localStorage Bearer token
- [x] Auto-seeding admin user and default content
- [x] Public and protected API routes
- [x] UptimeRobot /api/uptime/ping endpoint

### Deployment
- [x] Render (Static Site for Frontend, Web Service for Backend)
- [x] MongoDB Atlas integration
- [x] GitHub auto-deploy from main branch

## Prioritized Backlog

### P1 (High Priority)
- [ ] Resend email integration for contact form
- [ ] Admin image upload (currently using URL)

### P2 (Medium Priority)
- [ ] Product categories management
- [ ] SEO meta tags optimization
- [ ] Analytics integration

## Tech Stack
- Frontend: React + TailwindCSS + Shadcn UI
- Backend: FastAPI + MongoDB (Motor)
- Auth: JWT with localStorage Bearer tokens
- Deployment: Render + MongoDB Atlas + GitHub

## Admin Credentials
- Email: ozan.yolcu@atera.com.tr
- Password: admin123

## Key API Endpoints
- POST /api/auth/login (returns access_token)
- GET /api/auth/me
- GET /api/public/settings
- PUT /api/admin/settings
- GET /api/uptime/ping

## Database Collections
- users, settings, banners, brands, contacts

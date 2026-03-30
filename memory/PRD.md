# Atera Landing Page - PRD

## Original Problem Statement
Build a one-page landing site for atera.com.tr similar to laptop.co.nz. Business sells IT equipment, laptops, gaming desks, and monitor arms.

## User Personas
1. **Site Visitors** - Turkish/English speaking customers looking for IT equipment
2. **Admin Users** - Atera staff managing content (banners, brands, messages)

## What's Been Implemented

### Landing Page
- [x] Hero carousel with auto-slide (5s interval)
- [x] Navigation with smooth scroll (Ürünler, Markalar, İletişim)
- [x] Language switcher (TR/EN) with localStorage persistence
- [x] Products section (Laptops, Gaming Desk, Monitor Arms)
- [x] Brand partners marquee (HP, Lenovo, Dell, VIYERO) - HP & Dell 35% larger
- [x] Contact form (name, email, message - phone removed)
- [x] Contact info with editable address (phone removed)
- [x] Mobile responsive with hamburger menu
- [x] Dynamic color, font, text shadow, font size support from Admin settings

### Admin Panel - Settings
- [x] Colors: background, surface, header, header_text_color, primary, text, secondary
- [x] Fonts: heading font, body font
- [x] Banner: text shadow (active, color, opacity, blur, x, y), subtitle bold/shadow
- [x] Menu: shadow/bold, burger color
- [x] Brands Title: text TR/EN, color, font size (small/normal/large/xlarge), bold, shadow (color/blur/opacity)
- [x] Brands Subtitle: text TR/EN, color, font size, bold, shadow (color/blur/opacity)
- [x] Contact Section: title TR/EN, subtitle TR/EN, address, title/subtitle/address colors
- [x] Logo URL/text, header logo height 95%

### Admin Panel - CRUD
- [x] Banner CRUD (add, edit, delete, toggle active)
- [x] Brand CRUD (add, edit, delete, toggle active)
- [x] Contact messages view (mark as read, delete)

### Backend
- [x] FastAPI with MongoDB (Motor async)
- [x] JWT localStorage Bearer token auth
- [x] Auto-seeding admin user and default content
- [x] UptimeRobot /api/uptime/ping endpoint

### Deployment
- [x] Render (Static Site + Web Service) + MongoDB Atlas + GitHub

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

# Atera Landing Page - PRD

## Original Problem Statement
Build a one-page landing site for atera.com.tr similar to laptop.co.nz. Business sells IT equipment, laptops, gaming desks, and monitor arms.

## What's Been Implemented

### Landing Page
- [x] Hero carousel with auto-slide
- [x] Navigation (conditionally shows Ürünler)
- [x] Language switcher (TR/EN)
- [x] Products section (hideable via admin toggle)
- [x] Brand partners marquee
- [x] Contact form (name, email, subject, message) with Resend email
- [x] Contact info with editable address
- [x] Mobile responsive

### Admin Panel - Settings
- [x] Colors, Fonts, Logo, Menu, Banner shadow/subtitle
- [x] Brands Title/Subtitle: text, color, font size, bold, shadow
- [x] Contact Section: title/subtitle TR/EN, address, colors
- [x] Products Visibility toggle
- [x] Header text color, burger color

### Admin Panel - CRUD
- [x] Banner, Brand, Contact messages CRUD

### Email Integration (Resend)
- [x] Contact form sends email via Resend API
- [x] From: Atera İletişim Formu <info@atera.com.tr>
- [x] To: satis@atera.com.tr
- [x] Subject: [Name] , [Subject]
- [x] Body: HTML formatted with sender info + message
- [x] Reply-To set to sender's email

### Backend & Deployment
- [x] FastAPI + MongoDB Atlas + JWT localStorage auth
- [x] Render deployment via GitHub + Resend email

## Prioritized Backlog
### P1: Admin image upload (currently using URL)
### P2: Product categories, SEO, Analytics

## Admin Credentials
- Email: ozan.yolcu@atera.com.tr
- Password: admin123

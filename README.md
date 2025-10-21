# ClassroomConnect Frontend

Frontend application for ClassroomConnect - A personalized classroom engagement system for elementary students.

## Features

- **Student Survey** - One-time learning profile questionnaire
- **Mood Check-In** - Daily emotional state tracking
- **Personalized Activities** - Tailored 2-6 minute activities based on profile and mood
- **Progress Tracking** - Streaks, check-ins, and achievements
- **Kid-Friendly Design** - Designed for 7-8 year olds on iPad

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls to backend

## Quick Start

### Prerequisites

- Node.js 18+ (you have v22.19.0 ✅)
- npm 10+ (you have v10.9.3 ✅)

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/classroomconnect-frontend.git
cd classroomconnect-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app!

## Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Full page components (Survey, Home, etc.)
├── services/       # API calls to backend
├── types/          # TypeScript type definitions
├── App.tsx         # Main app component
└── main.tsx        # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Backend Integration

This frontend connects to the ClassroomConnect backend API.

**Backend repository:** [Link to backend repo]

**API Base URL:** `http://localhost:8000/api` (development)

## Team

**Frontend Developers:**
- Kole
- Dayu

**Backend Developers:**
- Michael
- Tommy

## Week 1 Goals

- ✅ Project setup
- ✅ GitHub repository
- 🔄 Build survey page with fake data
- 🔄 Connect survey POST to backend API

## License

CS5500 Final Project
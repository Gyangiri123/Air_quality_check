# 🌍 SkyQuery chat

[![NASA TEMPO](https://img.shields.io/badge/NASA%20TEMPO-Satellite%20Data-0B3D91?logo=nasa&logoColor=white)](https://tempo.si.edu/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](./backend)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Real-time & predictive air quality intelligence platform combining NASA TEMPO satellite observations, ground monitoring networks, and weather context — delivered via an installable Progressive Web App (PWA) with smart health recommendations.**

🌐 **Live Demo:** [https://airwatchpro.vercel.app](https://airwatchpro.vercel.app)  
🏆 **NASA Space Apps Challenge 2025 Submission**

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Frontend Setup (Quickest)](#1-frontend-setup-quickest)
  - [2. Backend Setup (Optional FastAPI Server)](#2-backend-setup-optional-fastapi-server)
  - [3. Full-Stack Setup (Frontend + Backend)](#3-full-stack-setup-frontend--backend)
- [Environment Configuration](#-environment-configuration)
- [Available npm / pnpm Scripts](#-available-npm--pnpm-scripts)
- [Project Directory Structure](#-project-directory-structure)
- [Key Features](#-key-features)
- [Progressive Web App (PWA) Features](#-progressive-web-app-pwa-features)
- [Deployment](#-deployment)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [Contributing & License](#-contributing--license)

---

## 🔍 Project Overview

**Sky Query chat** is an AI-powered air quality monitoring dashboard built to transform atmospheric Earth observation data into actionable public health intelligence.

### Key Highlights:
- **Zero-Config First Run**: Includes an intelligent mock/fallback data engine. You can clone the repo and run it immediately **without needing any API keys**.
- **Multi-Source Data Integration**: Designed to ingest from NASA TEMPO satellite data, EPA AirNow ground sensors, OpenAQ global stations, and OpenWeather meteorological data.
- **Interactive Geospatial Visualization**: High-performance interactive maps built on Leaflet with customizable layer overlays.
- **Personalized Health Insights**: Vulnerability-aware notifications (for asthma, elderly, children, and outdoor athletes) with real-time activity suggestions.
- **Progressive Web App**: Offline capability via service workers, installable on mobile/desktop, with native notification support.

---

## 🏗 System Architecture

The platform is designed with a modern, decoupled architecture:

```
┌────────────────────────────────────────────────────────┐
│                   User Interface                       │
│        React 19 + TypeScript + Tailwind CSS            │
│         Radix UI primitives + Lucide Icons             │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│     Client Services     │ │   Standalone Mock &     │
│   (Vite / TanStack /    │ │     Fallback Engine     │
│       Zustand)          │ │ (Auto-active if offline │
└────────────┬────────────┘ │   or API keys missing)  │
             │              └─────────────────────────┘
    ┌────────┴──────────────────────────┐
    ▼                                   ▼
┌────────────────────────┐  ┌─────────────────────────┐
│ Vercel Serverless / Edge│  │ FastAPI Backend Server  │
│      (`api/*.js`)      │  │      (`backend/`)       │
│  - /api/air-quality    │  │  - Python 3.11+ async   │
│  - /api/health         │  │  - EPA & OpenAQ clients │
└────────────────────────┘  │  - REST API & Swagger   │
                            └─────────────────────────┘
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine:

| Requirement | Recommended Version | Verification Command |
|-------------|---------------------|----------------------|
| **Node.js** | `v18.x`, `v20.x`, or `v22.x` | `node -v` |
| **npm** or **pnpm** | `npm v9+` or `pnpm v8+` | `npm -v` or `pnpm -v` |
| **Python** *(Optional - only for FastAPI backend)* | `Python 3.10+` or `3.11+` | `python --version` |

---

## 🚀 Quick Start Guide

### 1. Frontend Setup (Quickest)

You can run the frontend independently in under a minute. The frontend includes automatic fallback data, so external API keys are optional.

#### Step 1: Clone and Navigate to Directory
```bash
git clone https://github.com/codewithtanvir/airwatch-pro.git
cd airwatch-pro
```

#### Step 2: Install Dependencies
```bash
npm install
# or if you use pnpm:
pnpm install
```

> **Windows Note:** If you downloaded the repository as a ZIP, always run `npm install` (or `pnpm install`) so Windows generates proper command binaries (`vite.cmd`) in `node_modules/.bin`.

#### Step 3: (Optional) Set Up Environment Variables
```bash
# On Windows (PowerShell):
Copy-Item .env.example .env

# On Linux / macOS:
cp .env.example .env
```
*(The default configuration runs out of the box with mock data; see [Environment Configuration](#-environment-configuration) for custom API keys).*

#### Step 4: Start the Development Server
```bash
npm run dev
# or:
pnpm dev
```

The Vite development server will start and display the local URL:
```text
  VITE v5.4.1  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **`http://localhost:5173`** in your browser.

---

### 2. Backend Setup (Optional FastAPI Server)

If you wish to run the modular Python FastAPI backend locally:

#### Step 1: Open a Terminal in the `backend/` Directory
```bash
cd backend
```

#### Step 2: Create and Activate a Virtual Environment

- **On Windows (PowerShell):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```

- **On Windows (Command Prompt):**
  ```cmd
  python -m venv venv
  venv\Scripts\activate.bat
  ```

- **On macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

#### Step 3: Install Python Dependencies
```bash
# Upgrade pip
pip install --upgrade pip

# Minimal installation (recommended for fast start):
pip install -r requirements_minimal.txt

# Or full installation with all optional data science tools:
pip install -r requirements.txt
```

#### Step 4: Configure Backend Environment
```bash
# Windows
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

#### Step 5: Start the Backend Server
```bash
python start_server.py
# or using uvicorn directly:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will be live at:
- **API Root:** `http://localhost:8000/`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Alternative ReDoc:** `http://localhost:8000/redoc`
- **Health Check:** `http://localhost:8000/api/v1/health`

---

### 3. Full-Stack Setup (Frontend + Backend)

To connect the frontend to your local FastAPI backend:

1. In the **root directory**, open or create `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
2. Start the backend in Terminal 1:
   ```bash
   cd backend
   python start_server.py
   ```
3. Start the frontend in Terminal 2:
   ```bash
   npm run dev
   ```
4. Access the full application at **`http://localhost:5173`**.

---

## 🔧 Environment Configuration

### Frontend (`/.env`)

Create a `.env` file in the project root based on `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL of backend API or proxy | `""` (relative for Vercel) or `http://localhost:8000` |
| `VITE_API_TIMEOUT` | Request timeout in milliseconds | `30000` |
| `VITE_EPA_API_KEY` | EPA AirNow API Key | *(Optional - falls back to mock)* |
| `VITE_OPENAQ_API_KEY` | OpenAQ API Key | *(Optional - falls back to mock)* |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API Key | *(Optional - falls back to mock)* |
| `VITE_NASA_API_KEY` | NASA EarthData API Key | *(Optional)* |
| `VITE_ENABLE_SATELLITE_DATA` | Enable satellite layer toggles | `true` |
| `VITE_ENABLE_HISTORICAL_DATA`| Enable historical trend analysis | `true` |
| `VITE_ENABLE_FORECASTS` | Enable air quality forecasting | `true` |
| `VITE_ENABLE_ALERTS` | Enable personalized alerts system | `true` |
| `VITE_DEFAULT_MAP_CENTER_LAT`| Default map latitude | `40.7128` (New York) |
| `VITE_DEFAULT_MAP_CENTER_LNG`| Default map longitude | `-74.0060` |
| `VITE_DEFAULT_MAP_ZOOM` | Default map zoom level | `10` |

### Backend (`/backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Enable debug logs & reload | `True` |
| `PORT` | Port for uvicorn server | `8000` |
| `ALLOWED_HOSTS` | CORS allowed origins | `http://localhost:3000,http://localhost:5173` |
| `EPA_API_EMAIL` | Registered email for EPA AirNow | `your.email@example.com` |
| `NASA_API_KEY` | NASA EarthData access key | *(Optional)* |
| `CACHE_TTL` | Cache duration in seconds | `300` |

---

## 📜 Available npm / pnpm Scripts

In the root folder, the following scripts are available via `npm run <script>` or `pnpm <script>`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and creates an optimized production bundle in `dist/`. |
| `npm run preview` | Locally serves the production build from `dist/` to test before deployment. |
| `npm run lint` | Runs ESLint to check for code quality and style violations across `src/`. |
| `npm run build:pwa` | Creates a production build configured for Progressive Web App deployment. |
| `npm run generate-icons` | Executes `generate-icons.js` to create all standard PWA icon resolutions. |

---

## 📂 Project Directory Structure

```text
airwatch-pro/
├── api/                        # Vercel Serverless API functions
│   ├── air-quality.js          # Serverless air quality endpoint
│   └── health.js               # Serverless health check endpoint
├── backend/                    # Python FastAPI modular backend (optional)
│   ├── app/
│   │   ├── api/v1/endpoints/   # Air quality, health & location routes
│   │   ├── core/               # Configuration & structured logging
│   │   ├── services/           # EPA, OpenAQ & NASA service adapters
│   │   └── main.py             # FastAPI entrypoint
│   ├── requirements_minimal.txt# Fast dependency install
│   ├── requirements.txt        # Full dependencies
│   ├── start_server.py         # Backend startup script
│   └── README.md               # Backend-specific documentation
├── docs/                       # Architecture and compliance documents
│   ├── API.md
│   ├── ARCHITECTURE_OVERVIEW.md
│   └── NASA_CHALLENGE_COMPLIANCE.md
├── public/                     # Static assets served as-is
│   ├── icons/                  # PWA icons
│   ├── manifest.json           # PWA Web App Manifest
│   └── sw.js                   # Service worker for offline caching
├── src/                        # Frontend source code
│   ├── components/             # React UI components
│   │   ├── AirQualityMap.tsx   # Interactive Leaflet map
│   │   ├── AlertsPanel.tsx     # Health advisories & warning system
│   │   ├── Dashboard.tsx       # Main monitoring dashboard
│   │   ├── DataAnalysisDashboard.tsx # Historical & statistical charts
│   │   ├── EnhancedDashboard.tsx # Real-time metrics with animations
│   │   ├── ForecastMaps.tsx    # Predictive map views
│   │   ├── HistoricalTrends.tsx# Time-series graphs
│   │   ├── NavigationDrawer.tsx# Responsive drawer navigation
│   │   ├── PersonalizedAlerts.tsx # Health profile configuration
│   │   └── ui/                 # shadcn/ui Radix component library
│   ├── contexts/               # React Contexts (e.g., LocationContext)
│   ├── hooks/                  # Custom hooks (e.g., useLocation, usePWAInstall)
│   ├── lib/                    # Utilities, config, and resilient apiClient
│   ├── pages/                  # Page route views (Index.tsx, NotFound.tsx)
│   ├── services/               # Satellite & external API integration services
│   ├── types/                  # TypeScript data interfaces & types
│   ├── App.tsx                 # Root application component
│   └── main.tsx                # React DOM mounting entry point
├── .env.example                # Example environment file template
├── index.html                  # HTML entry point with PWA meta tags
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.ts          # Tailwind CSS styling configuration
├── tsconfig.json               # TypeScript compiler settings
├── vercel.json                 # Vercel deployment routing configuration
└── vite.config.ts              # Vite bundler, PWA chunking, and alias rules
```

---

## ✨ Key Features

1. **Real-Time Air Quality Index (AQI)**:
   - Live calculations for US AQI standards.
   - Breakdown of critical pollutants: **PM2.5, PM10, O₃ (Ozone), NO₂ (Nitrogen Dioxide), SO₂ (Sulfur Dioxide), and CO**.
2. **Interactive Mapping**:
   - Geolocation auto-detection with custom location search.
   - Color-coded pollution markers, heatmaps, and station info popups.
3. **Health Sensitivity Profiles**:
   - Customizable user profiles: general public, asthmatic, elderly, children, outdoor workers, and athletes.
   - Dynamic activity recommendations (e.g., outdoor workout safety, window ventilation status).
4. **Data Analytics & Historical Trends**:
   - 24-hour and 7-day trend visualizations powered by Recharts.
   - Comparative multi-pollutant overlays.
5. **Resilient Data Architecture**:
   - If network or external APIs fail, the built-in fallback layer immediately supplies statistically plausible measurements, preventing UI crashes.

---

## 📱 Progressive Web App (PWA) Features

This project meets full PWA specifications:
- **Installable**: Prompt appears automatically or via browser address bar to install as a desktop/mobile app.
- **Offline Support**: Caches static assets and recent observations via `public/sw.js`.
- **Custom Branding**: App icons, splash screens, and dark-mode glassmorphic interface.

To test PWA locally over HTTPS:
```bash
npm run build
npx serve dist -s
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Atmosphere Analyzer includes native `vercel.json` and serverless endpoints in `api/`:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. The build command (`npm run build`) and output directory (`dist`) will be automatically detected.
4. Add any production environment variables in the Vercel dashboard.
5. Deploy!

### Manual Production Build

```bash
# Build the production bundle
npm run build

# Preview locally
npm run preview
```
The optimized static files will be generated in the `dist/` directory and can be hosted on Nginx, Apache, Netlify, AWS S3/CloudFront, or any static file host.

---

## ❓ Troubleshooting & FAQ

### 1. `'vite' is not recognized as an internal or external command`
- **Cause**: On Windows, unzipping pre-existing `node_modules` from Linux/Mac does not include `.cmd` executable wrappers.
- **Solution**: Run `npm install` (or `pnpm install`) directly in your terminal to regenerate all binary links.

### 2. Location permissions denied in browser
- **Fix**: The application defaults to New York City (`40.7128, -74.0060`) if GPS permissions are denied. You can manually search for any city in the search bar or update default coordinates in `.env`.

### 3. "Failed to fetch" external data
- **Fix**: Check your network connection. If no external API keys are configured, this is expected: the app will automatically fall back to its internal mock generator and display realistic data without interrupting your session.

### 4. FastAPI Backend: `ModuleNotFoundError`
- **Fix**: Ensure your virtual environment is activated (`venv\Scripts\activate` on Windows or `source venv/bin/activate` on Linux) before running `pip install -r requirements_minimal.txt`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built for the NASA Space Apps Challenge 2025 • Advancing atmospheric observation for public health</sub>
</div>

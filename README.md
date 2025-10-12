# 🌳 Kitui Reforest AI - Land ReGen Hackathon 2025

**Regenerating Kitui with AI + Drones**

A comprehensive platform for community-driven reforestation in Kitui County, Kenya, combining satellite data analysis, AI-powered recommendations, and real-time project tracking.

![Land ReGen Hackathon 2025](https://img.shields.io/badge/Hackathon-Land%20ReGen%202025-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## 🚀 Features

### 🏠 Landing Page

- Mission statement and hackathon branding
- Overview of platform capabilities
- Call-to-action to get started

### 🗺️ Interactive GIS Map

- Visualize degraded zones using NDVI satellite data
- View active and completed reforestation projects
- Color-coded degradation levels
- Click-through popups with detailed zone information

### 🤖 AI Tree Recommender

- Input soil type, rainfall, and NDVI score
- Get personalized native species recommendations
- View survival rates, growth rates, and benefits
- AI-generated planting strategies

### 📊 Community Dashboard

- Track total trees planted across all projects
- Monitor hectares restored
- View average survival rates
- Interactive charts showing:
  - Trees planted by species
  - Projects by status
  - Carbon sequestration estimates

### 📋 Project Management

- Create new reforestation projects
- Track project status (planning, active, completed)
- Record tree planting activities
- Monitor survival rates over time

### 👥 User Authentication

- Secure user registration and login
- Role-based access control (Viewer, Contributor, Admin)
- User profile management
- Session persistence

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript 5.5.3 + Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with PKCE flow
- **Maps**: Leaflet.js 1.9.4 + React-Leaflet 4.2.1
- **Charts**: Recharts 2.12.7
- **AI**: Google Generative AI (Gemini) + Logic-based recommendations
- **Icons**: Lucide React 0.460.0
- **Notifications**: React Hot Toast 2.6.0

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- Supabase project created
- Environment variables configured

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LandReGenHackathon2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google AI (Optional - for enhanced recommendations)
VITE_GOOGLE_AI_API_KEY=your-google-ai-key

# OpenWeather API (Optional - for weather data)
VITE_OPENWEATHER_API_KEY=your-openweather-key
```

### 4. Database Setup

Run the database migration in your Supabase project:

```sql
-- The migration file is located at:
-- supabase/migrations/001_initial_schema.sql
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Database Schema

### Core Tables

#### `tree_species`

- Native tree species data with scientific names
- Rainfall requirements (min/max)
- Soil compatibility arrays
- Survival rates and growth characteristics
- Benefits and planting methods

#### `degraded_zones`

- Identified degraded areas with coordinates
- NDVI scores and degradation levels
- Soil type and rainfall data
- Polygon data for mapping

#### `reforestation_projects`

- Community project details
- Organization information
- Target metrics and status tracking
- Geographic coordinates

#### `planting_records`

- Tree planting events and quantities
- Species and location data
- Survival monitoring over time
- Notes and observations

#### `user_profiles`

- User account information
- Role-based access control
- Profile metadata

#### `ai_recommendations`

- AI-generated species suggestions
- Input parameters and scoring
- Planting strategies

## 🏗️ Project Structure

```
LandReGenHackathon2025/
├── src/
│   ├── components/
│   │   ├── Auth/                 # Authentication components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── guards/
│   │   │   └── RoleGuard.tsx     # Role-based access control
│   │   ├── AIImageVerification.tsx
│   │   ├── AIRecommendations.tsx
│   │   ├── ChatAssistant.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LandingPage.tsx
│   │   ├── MapView.tsx
│   │   ├── PlantingRecordForm.tsx
│   │   ├── ProjectForm.tsx
│   │   └── WeatherPanel.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── lib/
│   │   ├── cors-utils.ts         # CORS utilities
│   │   └── supabase.ts           # Supabase client
│   ├── types/
│   │   └── auth.ts               # TypeScript definitions
│   ├── data/
│   │   └── fallbackRecommendations.ts
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint

# Test Supabase connection
node src/test-cors-node.js
```

## 🌍 Environment Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy your Project URL and anon key
4. Configure authentication settings:
   - Site URL: `http://localhost:5173` (development)
   - Additional redirect URLs: `http://localhost:5173`

### Optional APIs

- **Google AI**: For enhanced AI recommendations
- **OpenWeather**: For weather data integration

## 🎨 Design System

### Color Palette

- **Primary**: Emerald green (#10b981) - growth and restoration
- **Secondary**: Teal (#14b8a6) - water and sustainability  
- **Accent**: Green (#22c55e) - nature and life
- **Neutral**: Slate grays - professional and clean

### Typography

- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: JetBrains Mono

## 🔐 Authentication & Security

- **PKCE Flow**: Secure authentication with Supabase
- **Role-Based Access**: Viewer, Contributor, Admin roles
- **CORS Configuration**: Properly configured for cross-origin requests
- **Environment Variables**: Secure credential management

## 🚀 Deployment

### Render.com (Recommended)

The project includes a `render.yaml` configuration file for easy deployment:

1. Connect your GitHub repository to Render
2. Render will automatically detect the configuration
3. Set environment variables in Render dashboard
4. Deploy with one click

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 📊 Key Features Explained

### NDVI Integration

- Uses Normalized Difference Vegetation Index scores
- Identifies degraded areas automatically
- Color-coded visualization on maps

### AI Recommendation Engine

- Considers rainfall compatibility
- Matches soil types with species
- Optimizes survival rates
- Provides planting strategies

### Community Tracking

- Public project visibility
- Collaborative impact tracking
- Transparent progress monitoring

## 🎯 Hackathon Alignment

This MVP demonstrates:

- ✅ **AI Integration**: Species recommendation engine
- ✅ **GIS Technology**: Interactive mapping with Leaflet
- ✅ **Community Engagement**: Collaborative project tracking
- ✅ **Data-Driven**: NDVI analysis and survival monitoring
- ✅ **Climate Resilience**: Drought-tolerant species selection
- ✅ **Scalability**: Modular architecture for future expansion

## 🔮 Future Enhancements

- [ ] Drone imagery processing for real-time NDVI
- [ ] Mobile app for field data collection
- [ ] Real-time notifications and alerts
- [ ] Species identification using computer vision
- [ ] Community forums and knowledge sharing
- [ ] Gamification and leaderboards
- [ ] Carbon credit tracking
- [ ] Integration with IoT sensors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Built for Land ReGen Hackathon 2025

## 📞 Support

For questions or support:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Regenerating Kitui, one tree at a time** 🌳

*Built with ❤️ for the Land ReGen Hackathon 2025*

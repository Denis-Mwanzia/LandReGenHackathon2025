# 🌳 Kitui Reforest AI - Land ReGen Hackathon 2025

**Regenerating Kitui with AI + Drones**

A comprehensive platform for community-driven reforestation in Kitui County, Kenya, combining satellite data analysis, AI-powered recommendations, and real-time project tracking.

![Land ReGen Hackathon 2025](https://img.shields.io/badge/Hackathon-Land%20ReGen%202025-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Deployment](https://img.shields.io/badge/Deployment-Live%20on%20Render-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌐 Live Application

**🚀 [View Live Demo](https://kitui-reforest-ai.onrender.com)** - Experience the full platform in action

**📊 [Pitch Deck](https://gamma.app/docs/Kitui-ReForest-AI-Regeneration-Through-Innovation-nmul39zas8i0zba)** - Comprehensive project overview and presentation

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Database Schema](#️-database-schema)
- [Project Structure](#️-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### 🏠 Landing Page

- Mission statement and hackathon branding
- Overview of platform capabilities
- Call-to-action to get started
- Responsive design for all devices

### 🗺️ Interactive GIS Map

- Visualize degraded zones using NDVI satellite data
- View active and completed reforestation projects
- Color-coded degradation levels
- Click-through popups with detailed zone information
- Real-time weather integration

### 🤖 AI Tree Recommender

- Input soil type, rainfall, and NDVI score
- Get personalized native species recommendations
- View survival rates, growth rates, and benefits
- AI-generated planting strategies
- Powered by Google Gemini AI

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
- Role-based access control

### 🌡️ Climate Insights

- Real-time weather data and forecasts for Kitui County
- Location-specific climate information for optimal planting decisions
- Weather-based planting recommendations and timing guidance
- Integration with OpenWeather API for accurate meteorological data
- Historical climate patterns and seasonal planting advice

### 💬 AI Chat Assistant

- Interactive chatbot for reforestation guidance
- Ask questions about tree species, planting techniques, and project management
- Get instant answers about Kitui County's environmental conditions
- AI-powered support for community members and project coordinators
- Available 24/7 for community support

### 👥 User Authentication & Role Management

- Secure user registration and login
- Role-based access control with 4 user types:
  - **Viewer**: Read-only access to maps, weather, and AI recommendations
  - **Volunteer**: Can record planting activities and view project data
  - **Manager**: Can create projects and manage teams
  - **Admin**: Full system access including AI verification
- User profile management
- Session persistence

### 🔍 AI Image Verification

- Upload before/after drone photos
- AI-powered vegetation growth analysis
- Progress validation and verification
- Quality assurance for reforestation projects

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1** - Modern UI library
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.2** - Fast build tool
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### Backend & Database

- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Data protection

### Maps & Visualization

- **Leaflet.js 1.9.4** - Interactive maps
- **React-Leaflet 4.2.1** - React integration
- **Recharts 2.12.7** - Data visualization

### AI & APIs

- **Google Generative AI (Gemini)** - AI recommendations and chat
- **OpenWeather API** - Weather data
- **Sentinel Hub API** - Satellite imagery

### Development Tools

- **Lucide React 0.460.0** - Icon library
- **React Hot Toast 2.6.0** - Notifications
- **ESLint & Prettier** - Code quality

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

## 🔧 Development

### Development Commands

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
```

### Environment Configuration

#### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy your Project URL and anon key
4. Configure authentication settings:
   - Site URL: `http://localhost:5173` (development)
   - Additional redirect URLs: `http://localhost:5173`

#### Optional APIs

- **Google AI**: For enhanced AI recommendations
- **OpenWeather**: For weather data integration

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

### Climate Insights

- Real-time weather integration using OpenWeather API
- Location-specific forecasts for optimal planting timing
- Weather-based recommendations for irrigation scheduling
- Historical climate data analysis for long-term planning
- Seasonal planting calendars tailored to Kitui County

### AI Chat Assistant

- Powered by advanced AI technology
- Context-aware responses about Kitui County's conditions
- Supports multiple languages for accessibility
- Provides expert advice on tree species and techniques
- Available 24/7 for community support

## 🎯 Hackathon Alignment

This MVP demonstrates:

- ✅ **AI Integration**: Species recommendation engine + AI chat assistant
- ✅ **GIS Technology**: Interactive mapping with Leaflet
- ✅ **Climate Intelligence**: Real-time weather data + climate-based guidance
- ✅ **Community Engagement**: Collaborative project tracking + 24/7 AI support
- ✅ **Data-Driven**: NDVI analysis and survival monitoring
- ✅ **Climate Resilience**: Drought-tolerant species selection + weather optimization
- ✅ **Scalability**: Modular architecture for future expansion
- ✅ **Role-Based Access**: Secure user management with different permission levels

## 🔮 Future Enhancements

- [ ] Drone imagery processing for real-time NDVI
- [ ] Mobile app for field data collection
- [ ] Real-time notifications and alerts
- [ ] Species identification using computer vision
- [ ] Community forums and knowledge sharing
- [ ] Gamification and leaderboards
- [ ] Carbon credit tracking
- [ ] Integration with IoT sensors
- [ ] Multi-language support
- [ ] Offline functionality

## 🧪 Testing

### Manual Testing

- User registration and authentication
- Role-based access control
- Feature accessibility by role
- Mobile responsiveness
- AI recommendations functionality
- Weather data integration

### Test Accounts

- **Admin**: Full access to all features
- **Manager**: Project creation and team management
- **Volunteer**: Planting activity recording
- **Viewer**: Read-only access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is built for the Land ReGen Hackathon 2025. All rights reserved.

## 📞 Support

For questions or support:

- Create an issue in the repository
- Contact the development team
- Check the documentation
- Review the code comments

## 🙏 Acknowledgments

- **Land ReGen Hackathon 2025** for the platform and opportunity
- **Kitui County** for the environmental context and data
- **Open source community** for the amazing tools and libraries
- **Supabase** for the backend infrastructure
- **Google AI** for the powerful AI capabilities

---

**Regenerating Kitui, one tree at a time** 🌳

*Built with ❤️ for the Land ReGen Hackathon 2025*

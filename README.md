# Kitui Reforest AI - Land ReGen Hackathon 2025

**Regenerating Kitui with AI + Drones**

A comprehensive platform for community-driven reforestation in Kitui County, Kenya, combining satellite data analysis, AI-powered recommendations, and real-time project tracking.

## Features

### 1. Landing Page
- Mission statement and hackathon branding
- Overview of platform capabilities
- Call-to-action to get started

### 2. Interactive GIS Map
- Visualize degraded zones using NDVI satellite data
- View active and completed reforestation projects
- Color-coded degradation levels
- Click-through popups with detailed zone information

### 3. AI Tree Recommender
- Input soil type, rainfall, and NDVI score
- Get personalized native species recommendations
- View survival rates, growth rates, and benefits
- AI-generated planting strategies

### 4. Community Dashboard
- Track total trees planted across all projects
- Monitor hectares restored
- View average survival rates
- Interactive charts showing:
  - Trees planted by species
  - Projects by status
  - Carbon sequestration estimates

### 5. Project Management
- Create new reforestation projects
- Track project status (planning, active, completed)
- Record tree planting activities
- Monitor survival rates over time

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet.js + React-Leaflet
- **Charts**: Recharts
- **AI**: Logic-based recommendation engine (extensible to Claude/OpenAI)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase project created
- Environment variables configured

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. Run database migrations:
The migration file is already created at `supabase/migrations/20251009170352_create_reforestation_schema.sql`

### Seeding the Database

To populate the database with sample data from the Kitui dataset:

```bash
npm run seed
```

This will:
- Load data from `data/kitui_reforest_dataset.csv`
- Create tree species records with full details
- Add degraded zones with NDVI scores and soil information
- Set up relationships between species and zones

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Database Schema

### Tables

1. **tree_species** - Native tree species data
   - Name, scientific name, description
   - Rainfall requirements (min/max)
   - Soil compatibility
   - Survival rates and growth rates
   - Benefits and planting methods

2. **degraded_zones** - Identified degraded areas
   - Location coordinates
   - NDVI scores
   - Degradation levels
   - Soil type and rainfall data

3. **reforestation_projects** - Community projects
   - Project details and status
   - Organization information
   - Target trees and area coverage
   - Contact information

4. **planting_records** - Tree planting events
   - Species and quantity planted
   - Location and date
   - Survival monitoring data
   - Notes and observations

5. **ai_recommendations** - AI-generated suggestions
   - Input parameters (soil, rainfall, degradation)
   - Recommended species with scores
   - Planting strategies

## Project Structure

```
kitui-reforest-ai/
├── data/
│   └── kitui_reforest_dataset.csv    # Sample data
├── scripts/
│   └── seed-database.ts              # Database seeding script
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx          # Home page
│   │   ├── MapView.tsx              # Interactive map
│   │   ├── Dashboard.tsx            # Analytics
│   │   ├── AIRecommendations.tsx    # AI recommender
│   │   ├── ProjectForm.tsx          # Create projects
│   │   └── PlantingRecordForm.tsx   # Log plantings
│   ├── lib/
│   │   └── supabase.ts              # Supabase client
│   ├── App.tsx                       # Main app component
│   └── main.tsx                      # Entry point
├── supabase/
│   └── migrations/                   # Database migrations
└── package.json
```

## Key Features Explained

### NDVI Integration
The platform uses Normalized Difference Vegetation Index (NDVI) scores to identify degraded areas. NDVI ranges from -1 to 1, where:
- Values close to 1 indicate healthy vegetation
- Values close to 0 indicate bare soil or degraded land
- The CSV data includes degradation scores that are inverted to NDVI

### AI Recommendation Engine
The recommendation system considers:
- Rainfall compatibility (species min/max vs. site rainfall)
- Soil type matching
- Survival rate optimization
- Growth rate selection based on degradation severity
- Drought resistance for low rainfall areas
- Soil improvement capabilities for degraded sites

### Community Tracking
All projects and planting records are publicly visible to:
- Encourage transparency
- Enable collaboration between communities
- Track collective impact
- Share success stories and lessons learned

## Color Scheme

The platform uses an earthy, natural palette:
- **Primary**: Emerald green (#10b981) - growth and restoration
- **Secondary**: Teal (#14b8a6) - water and sustainability
- **Accent**: Green (#22c55e) - nature and life
- **Neutral**: Slate grays - professional and clean

## Hackathon Alignment

This MVP demonstrates:
- **AI Integration**: Species recommendation engine
- **GIS Technology**: Interactive mapping with Leaflet
- **Community Engagement**: Collaborative project tracking
- **Data-Driven**: NDVI analysis and survival monitoring
- **Climate Resilience**: Drought-tolerant species selection
- **Scalability**: Modular architecture for future expansion

## Future Enhancements

- Integration with Claude/OpenAI API for advanced recommendations
- Drone imagery processing for NDVI calculation
- Mobile app for field data collection
- Real-time notifications for planting activities
- Species identification using computer vision
- Weather data integration
- Community forums and knowledge sharing
- Gamification and leaderboards

## Contributing

This is a hackathon MVP. For production deployment:
1. Add authentication for project creation
2. Implement RLS policies for data ownership
3. Add email notifications
4. Set up continuous monitoring
5. Optimize bundle size with code splitting

## License

Built for Land ReGen Hackathon 2025

## Contact

For questions about this project or the hackathon submission, please contact the development team.

---

**Regenerating Kitui, one tree at a time** 🌳

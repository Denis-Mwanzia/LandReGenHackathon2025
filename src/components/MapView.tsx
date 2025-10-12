import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase, DegradedZone, ReforestationProject } from '../lib/supabase';
import { TreePine, MapPin, AlertTriangle } from 'lucide-react';
import MarkerClusterGroup from 'react-leaflet-cluster';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

type MapViewProps = {
  onLocationSelect?: (lat: number, lng: number) => void;
  allowPinDrop?: boolean;
};

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>New location selected</Popup>
    </Marker>
  );
}

export default function MapView({
  onLocationSelect,
  allowPinDrop = false,
}: MapViewProps) {
  const [degradedZones, setDegradedZones] = useState<DegradedZone[]>([]);
  const [projects, setProjects] = useState<ReforestationProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      const [zonesResult, projectsResult] = await Promise.all([
        supabase.from('degraded_zones').select('*'),
        supabase.from('reforestation_projects').select('*'),
      ]);

      if (zonesResult.data) setDegradedZones(zonesResult.data);
      if (projectsResult.data) setProjects(projectsResult.data);
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDegradationColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'severe':
        return '#ef4444';
      case 'moderate':
        return '#f59e0b';
      case 'mild':
        return '#eab308';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10b981';
      case 'active':
        return '#3b82f6';
      case 'planning':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  // Center on Kitui County, Kenya
  const center: [number, number] = [-1.3667, 38.01];

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-slate-600">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={9}
        className="w-full h-full"
        style={{ background: '#f1f5f9' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* NDVI Overlay Layer - To add satellite imagery overlay:
            Option 1: Use Leaflet's ImageOverlay with pre-generated NDVI tiles
            Option 2: Use a custom WMS layer component
            Option 3: Integrate with Sentinel Hub's Process API for dynamic NDVI generation
            
            Example implementation:
            <ImageOverlay
              url="path-to-ndvi-tiles/{z}/{x}/{y}.png"
              bounds={[[-2.0, 37.0], [-1.0, 39.0]]}
              opacity={0.6}
            />
        */}

        {degradedZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.latitude, zone.longitude]}
            radius={zone.area_hectares * 50}
            pathOptions={{
              color: getDegradationColor(zone.degradation_level),
              fillColor: getDegradationColor(zone.degradation_level),
              fillOpacity: 0.3,
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-orange-600" />
                  <h3 className="font-bold text-sm">{zone.zone_name}</h3>
                </div>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Degradation:</strong> {zone.degradation_level}
                  </p>
                  <p>
                    <strong>Area:</strong> {zone.area_hectares} hectares
                  </p>
                  <p>
                    <strong>NDVI Score:</strong> {zone.ndvi_score}
                  </p>
                  <p>
                    <strong>Soil:</strong> {zone.soil_type}
                  </p>
                  <p>
                    <strong>Rainfall:</strong> {zone.avg_rainfall}mm/year
                  </p>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

        {projects.length > 0 && (
          <MarkerClusterGroup>
            {projects.map((project) => (
              <Marker
                key={project.id}
                position={[project.latitude, project.longitude]}
                icon={
                  new Icon({
                    iconUrl: `data:image/svg+xml;base64,${btoa(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${getStatusColor(
                        project.status
                      )}" stroke="white" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3" fill="white"></circle>
                      </svg>
                    `)}`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                  })
                }
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <TreePine size={16} className="text-green-600" />
                      <h3 className="font-bold text-sm">
                        {project.project_name}
                      </h3>
                    </div>
                    <div className="text-xs space-y-1">
                      <p>
                        <strong>Organization:</strong> {project.organization}
                      </p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className="capitalize">{project.status}</span>
                      </p>
                      <p>
                        <strong>Target Trees:</strong>{' '}
                        {project.target_trees.toLocaleString()}
                      </p>
                      <p>
                        <strong>Area:</strong> {project.area_hectares} hectares
                      </p>
                      {project.description && (
                        <p className="mt-2 italic">{project.description}</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}

        {allowPinDrop && <LocationMarker onLocationSelect={onLocationSelect} />}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
        <h3 className="font-bold text-sm mb-3">Map Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Severe Degradation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Moderate Degradation</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            <span>Active Project</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            <span>Completed Project</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-purple-600" />
            <span>Planning Project</span>
          </div>
        </div>
      </div>
    </div>
  );
}

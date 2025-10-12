import { useState, useEffect } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react';

type WeatherData = {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  dt_txt: string;
};

type ForecastResponse = {
  list: WeatherData[];
  city: {
    name: string;
    country: string;
  };
};

export default function WeatherPanel({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun className="text-yellow-500" size={24} />;
      case 'clouds':
        return <Cloud className="text-gray-500" size={24} />;
      case 'rain':
        return <CloudRain className="text-blue-500" size={24} />;
      default:
        return <Cloud className="text-gray-500" size={24} />;
    }
  };

  const getPlantingRecommendation = (weatherData: WeatherData) => {
    const { temp, humidity } = weatherData.main;
    const { main: weatherMain } = weatherData.weather[0];

    if (weatherMain.toLowerCase() === 'rain') {
      return {
        status: 'excellent',
        message:
          'Perfect planting conditions! Rain will help new seedlings establish.',
        color: 'text-green-600 bg-green-50 border-green-200',
      };
    } else if (temp > 25 && temp < 35 && humidity > 40) {
      return {
        status: 'good',
        message:
          'Good conditions for planting. Consider early morning or late afternoon.',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
      };
    } else if (temp > 35 || humidity < 30) {
      return {
        status: 'poor',
        message:
          'Hot and dry conditions. Delay planting or ensure adequate irrigation.',
        color: 'text-red-600 bg-red-50 border-red-200',
      };
    } else {
      return {
        status: 'fair',
        message: 'Moderate conditions. Monitor soil moisture carefully.',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      };
    }
  };

  const getForecast = async () => {
    if (!import.meta.env.VITE_OPENWEATHER_KEY) {
      setError('OpenWeather API key not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${
          import.meta.env.VITE_OPENWEATHER_KEY
        }&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setForecast(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch weather data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lng) {
      getForecast();
    }
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Thermometer className="text-blue-600" size={20} />
          Climate Insights
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-slate-600">Loading weather data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Thermometer className="text-blue-600" size={20} />
          Climate Insights
        </h3>
        <div className="text-red-600 text-sm">{error}</div>
        <button
          onClick={getForecast}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Thermometer className="text-blue-600" size={20} />
          Climate Insights
        </h3>
        <div className="text-slate-600 text-sm">
          No weather data available for this location.
        </div>
      </div>
    );
  }

  const currentWeather = forecast.list[0];
  const recommendation = getPlantingRecommendation(currentWeather);
  const next5Days = forecast.list.slice(0, 8); // Next 24-40 hours in 3-hour intervals

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Thermometer className="text-blue-600" size={20} />
        Climate Insights - {forecast.city.name}
      </h3>

      {/* Current Conditions */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {getWeatherIcon(currentWeather.weather[0].main)}
            <div>
              <div className="font-semibold text-lg">
                {Math.round(currentWeather.main.temp)}°C
              </div>
              <div className="text-sm text-slate-600 capitalize">
                {currentWeather.weather[0].description}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-slate-600">
            <div className="flex items-center gap-1 mb-1">
              <Droplets size={14} />
              {currentWeather.main.humidity}%
            </div>
            <div className="flex items-center gap-1">
              <Wind size={14} />
              {Math.round(currentWeather.wind.speed)} m/s
            </div>
          </div>
        </div>

        {/* Planting Recommendation */}
        <div className={`p-3 rounded-lg border ${recommendation.color}`}>
          <div className="font-medium text-sm mb-1">Planting Conditions:</div>
          <div className="text-sm">{recommendation.message}</div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-3">Next 5 Days</h4>
        <div className="space-y-2">
          {next5Days.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-slate-700">
                  {new Date(day.dt_txt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    hour: '2-digit',
                  })}
                </div>
                {getWeatherIcon(day.weather[0].main)}
                <div className="text-sm text-slate-600 capitalize">
                  {day.weather[0].description}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Droplets size={12} />
                  {day.main.humidity}%
                </div>
                <div className="font-medium">{Math.round(day.main.temp)}°C</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Data provided by OpenWeatherMap
      </div>
    </div>
  );
}

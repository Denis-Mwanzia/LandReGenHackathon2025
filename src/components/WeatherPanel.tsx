// src/components/WeatherPanel.tsx
export default function WeatherPanel({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const [forecast, setForecast] = useState(null);

  const getForecast = async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${
        import.meta.env.VITE_OPENWEATHER_KEY
      }`
    );
    const data = await response.json();
    setForecast(data);
  };

  // Weather display implementation...
}

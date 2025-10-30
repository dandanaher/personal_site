import { useState, useEffect } from 'react';
import './LondonWidget.css';

interface WeatherData {
  temp: string;
  condition: string;
}

export const LondonWidget = () => {
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const londonTime = new Date().toLocaleString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setTime(londonTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://wttr.in/London?format=j1');
        const data = await response.json();

        const currentCondition = data.current_condition[0];
        setWeather({
          temp: currentCondition.temp_C,
          condition: currentCondition.weatherDesc[0].value,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="london-widget">
      <div className="widget-location">London</div>
      <div className="widget-time">{time}</div>
      {loading ? (
        <div className="widget-weather">Loading...</div>
      ) : weather ? (
        <div className="widget-weather">
          {weather.temp}°C · {weather.condition}
        </div>
      ) : null}
    </div>
  );
};

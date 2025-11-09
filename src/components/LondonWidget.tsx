import { useState, useEffect, memo } from 'react';

interface WeatherData {
  temp: string;
  condition: string;
}

const LondonWidgetComponent = () => {
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

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
      console.log('[LondonWidget] Starting weather fetch...');
      try {
        // Use plain format endpoint with mode: 'cors' to avoid HTTP/2 issues
        // Add ?m to force metric (Celsius) units
        const url = 'https://wttr.in/London?format=%t+%C&m';
        console.log('[LondonWidget] Fetching from:', url);

        const response = await fetch(url, {
          mode: 'cors',
          cache: 'no-cache',
        });

        console.log('[LondonWidget] Response status:', response.status);
        console.log('[LondonWidget] Response ok:', response.ok);

        if (!response.ok) {
          throw new Error(`Weather API returned status ${response.status}`);
        }

        const text = await response.text();
        console.log('[LondonWidget] Raw response text:', text);

        // Parse the format: "+8°C Partly cloudy" or handle both C and F
        const match = text.trim().match(/([+-]?\d+)°[CF]\s+(.+)/);
        console.log('[LondonWidget] Regex match:', match);

        if (match) {
          const weatherData = {
            temp: match[1].replace(/^\+/, ''), // Remove leading + sign for positive temps
            condition: match[2],
          };
          console.log('[LondonWidget] Setting weather data:', weatherData);
          setWeather(weatherData);
        } else {
          console.error('[LondonWidget] Failed to parse weather text:', text);
          setWeather(null);
        }
      } catch (error) {
        console.error('[LondonWidget] Weather fetch error:', error);
        console.error('[LondonWidget] Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
        });
        setWeather(null);
      }
    };

    console.log('[LondonWidget] Weather effect initializing...');
    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => {
      console.log('[LondonWidget] Weather effect cleanup');
      clearInterval(interval);
    };
  }, []);

  console.log('[LondonWidget] Rendering with weather:', weather);

  return (
    <div className="fixed top-16 right-4 z-[500] text-right md:top-16 md:right-32">
      <div className="mb-1 text-sm text-secondary">London</div>
      <div className="mb-1 text-2xl md:text-[2rem] font-normal leading-tight text-primary">{time}</div>
      {weather && (
        <div className="text-sm text-secondary">
          {weather.temp}°C · {weather.condition}
        </div>
      )}
    </div>
  );
};

export const LondonWidget = memo(LondonWidgetComponent);

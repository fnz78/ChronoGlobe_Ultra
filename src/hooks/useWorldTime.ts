import { useState, useEffect } from 'react';
import { TIMEZONES } from '../data/timezones';

interface TimeState {
  time: Date;
  formattedTime: string;
  formattedDate: string;
  isDay: boolean;
  offset: string;
  sunrise?: string;
  sunset?: string;
}

// Simple sunrise/sunset calculation (Sunrise Equation)
function getSunTimes(date: Date, lat: number, lng: number) {
  const times = { sunrise: null as Date | null, sunset: null as Date | null };
  
  const radians = Math.PI / 180;
  const degrees = 180 / Math.PI;

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

  // Fractional year in radians
  const Y = (2 * Math.PI / 365) * (dayOfYear - 1 + (date.getHours() - 12) / 24);

  // Equation of time in minutes
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(Y) - 0.032077 * Math.sin(Y) - 0.014615 * Math.cos(2 * Y) - 0.040849 * Math.sin(2 * Y));

  // Solar declination angle in radians
  const decl = 0.006918 - 0.399912 * Math.cos(Y) + 0.070257 * Math.sin(Y) - 0.006758 * Math.cos(2 * Y) + 0.000907 * Math.sin(2 * Y) - 0.002697 * Math.cos(3 * Y) + 0.00148 * Math.sin(3 * Y);

  // Hour angle
  // cos(HA) = (cos(90.833) / (cos(lat) * cos(decl))) - tan(lat) * tan(decl)
  const zenith = 90.833 * radians;
  const latRad = lat * radians;
  
  const haCos = (Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl))) - Math.tan(latRad) * Math.tan(decl);

  if (haCos > 1 || haCos < -1) {
    return times; // Midnight sun or polar night
  }

  const ha = Math.acos(haCos) * degrees;

  // Sunrise/Sunset in UTC minutes from midnight
  const sunriseUTC = 720 - 4 * (lng + ha) - eqTime;
  const sunsetUTC = 720 - 4 * (lng - ha) - eqTime;

  // Convert to Date objects
  const createDate = (minutesUTC: number) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCMinutes(minutesUTC);
    return d;
  };

  times.sunrise = createDate(sunriseUTC);
  times.sunset = createDate(sunsetUTC);

  return times;
}

export function useWorldTime(timezone: string, options: { use24Hour: boolean, showSeconds: boolean } = { use24Hour: false, showSeconds: true }) {
  const [timeState, setTimeState] = useState<TimeState>({
    time: new Date(),
    formattedTime: '',
    formattedDate: '',
    isDay: true,
    offset: '',
  });

  const [localCoords, setLocalCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (timezone === 'local' && !localCoords) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocalCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log("Geolocation error:", error);
            // Default to 0,0 or just don't show sunrise/sunset
          }
        );
      }
    }
  }, [timezone, localCoords]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format Time
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: options.showSeconds ? '2-digit' : undefined,
        hour12: !options.use24Hour,
        timeZone: timezone === 'local' ? undefined : timezone,
      };
      // Use en-US for 12h format to get AM/PM correctly if needed, or en-GB for 24h.
      // Actually, hour12 option overrides locale defaults usually.
      const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);

      // Format Date
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone === 'local' ? undefined : timezone,
      };
      const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);

      // Calculate Offset
      let offset = '';
      if (timezone !== 'local') {
        try {
          const targetStr = now.toLocaleString('en-US', { timeZone: timezone });
          const localStr = now.toLocaleString('en-US');
          
          const targetDate = new Date(targetStr);
          const localDate = new Date(localStr);
          
          const diffMs = targetDate.getTime() - localDate.getTime();
          const diffHours = Math.round(diffMs / (1000 * 60 * 60));
          
          const sign = diffHours >= 0 ? '+' : '';
          offset = `${sign}${diffHours}h`;
        } catch (e) {
          console.error("Error calculating offset", e);
          offset = '';
        }
      } else {
        offset = '+0h';
      }

      // Sunrise / Sunset Calculation
      let sunriseStr = undefined;
      let sunsetStr = undefined;
      let isDayCalculated = true;

      let lat: number | undefined;
      let lng: number | undefined;

      if (timezone === 'local') {
        if (localCoords) {
          lat = localCoords.lat;
          lng = localCoords.lng;
        }
      } else {
        const tzData = TIMEZONES.find(t => t.value === timezone);
        if (tzData) {
          lat = tzData.lat;
          lng = tzData.lng;
        }
      }

      if (lat !== undefined && lng !== undefined) {
        const sunTimes = getSunTimes(now, lat, lng);
        
        if (sunTimes.sunrise && sunTimes.sunset) {
          const formatSunTime = (date: Date) => {
            return new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: !options.use24Hour,
              timeZone: timezone === 'local' ? undefined : timezone,
            }).format(date);
          };

          sunriseStr = formatSunTime(sunTimes.sunrise);
          sunsetStr = formatSunTime(sunTimes.sunset);

          const nowTs = now.getTime();
          const sunriseTs = sunTimes.sunrise.getTime();
          const sunsetTs = sunTimes.sunset.getTime();
          
          isDayCalculated = nowTs >= sunriseTs && nowTs < sunsetTs;
        }
      } else {
        // Fallback to simple hour-based if no coords
        // We need to parse 24h hour for this calculation
        const hour24 = parseInt(new Intl.DateTimeFormat('en-GB', {
          hour: 'numeric',
          hour12: false,
          timeZone: timezone === 'local' ? undefined : timezone,
        }).format(now), 10);
        
        isDayCalculated = hour24 >= 6 && hour24 < 18;
      }

      setTimeState({
        time: now,
        formattedTime,
        formattedDate,
        isDay: isDayCalculated,
        offset,
        sunrise: sunriseStr,
        sunset: sunsetStr,
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [timezone, localCoords, options.use24Hour, options.showSeconds]);

  return timeState;
}

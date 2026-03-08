export interface Timezone {
  label: string;
  value: string;
  lat?: number;
  lng?: number;
}

export const TIMEZONES: Timezone[] = [
  { label: 'Local Time', value: 'local' }, // Will use browser geolocation if available
  { label: 'UTC', value: 'UTC', lat: 51.4779, lng: 0 }, // Greenwich
  { label: 'New York (EST)', value: 'America/New_York', lat: 40.7128, lng: -74.0060 },
  { label: 'London (GMT)', value: 'Europe/London', lat: 51.5074, lng: -0.1278 },
  { label: 'Dubai (GST)', value: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
  { label: 'India (IST)', value: 'Asia/Kolkata', lat: 22.5726, lng: 88.3639 }, // Kolkata as representative
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
  { label: 'Sydney (AEDT)', value: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
  { label: 'Paris (CET)', value: 'Europe/Paris', lat: 48.8566, lng: 2.3522 },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore', lat: 1.3521, lng: 103.8198 },
  { label: 'Los Angeles (PST)', value: 'America/Los_Angeles', lat: 34.0522, lng: -118.2437 },
  { label: 'Chicago (CST)', value: 'America/Chicago', lat: 41.8781, lng: -87.6298 },
  { label: 'Berlin (CET)', value: 'Europe/Berlin', lat: 52.5200, lng: 13.4050 },
  { label: 'Moscow (MSK)', value: 'Europe/Moscow', lat: 55.7558, lng: 37.6173 },
  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong', lat: 22.3193, lng: 114.1694 },
  { label: 'Seoul (KST)', value: 'Asia/Seoul', lat: 37.5665, lng: 126.9780 },
  { label: 'Shanghai (CST)', value: 'Asia/Shanghai', lat: 31.2304, lng: 121.4737 },
  { label: 'Sao Paulo (BRT)', value: 'America/Sao_Paulo', lat: -23.5505, lng: -46.6333 },
  { label: 'Toronto (EST)', value: 'America/Toronto', lat: 43.6510, lng: -79.3470 },
  { label: 'Vancouver (PST)', value: 'America/Vancouver', lat: 49.2827, lng: -123.1207 },
  { label: 'Mexico City (CST)', value: 'America/Mexico_City', lat: 19.4326, lng: -99.1332 },
  { label: 'Buenos Aires (ART)', value: 'America/Argentina/Buenos_Aires', lat: -34.6037, lng: -58.3816 },
  { label: 'Cape Town (SAST)', value: 'Africa/Johannesburg', lat: -33.9249, lng: 18.4241 },
  { label: 'Cairo (EET)', value: 'Africa/Cairo', lat: 30.0444, lng: 31.2357 },
  { label: 'Istanbul (TRT)', value: 'Europe/Istanbul', lat: 41.0082, lng: 28.9784 },
  { label: 'Riyadh (AST)', value: 'Asia/Riyadh', lat: 24.7136, lng: 46.6753 },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok', lat: 13.7563, lng: 100.5018 },
  { label: 'Jakarta (WIB)', value: 'Asia/Jakarta', lat: -6.2088, lng: 106.8456 },
  { label: 'Auckland (NZDT)', value: 'Pacific/Auckland', lat: -36.8485, lng: 174.7633 },
  { label: 'Honolulu (HST)', value: 'Pacific/Honolulu', lat: 21.3069, lng: -157.8583 },
];

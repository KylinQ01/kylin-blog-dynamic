"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  wind: string;
  icon: string;
}

// 模块级缓存：切换页面时组件会重新挂载，缓存可避免重复请求慢速外部 API 和地理位置授权
const CACHE_TTL = 30 * 60 * 1000; // 30 分钟
let weatherCache: { data: WeatherData; time: number } | null = null;

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weatherCache && Date.now() - weatherCache.time < CACHE_TTL) {
      setWeather(weatherCache.data);
      setLoading(false);
      return;
    }
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);

      // 获取用户位置
      let lat = 22.5431; // 默认深圳
      let lon = 114.0579;

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch {
          // 使用默认位置
        }
      }

      // 使用 Open-Meteo API 获取天气
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      // 使用 BigDataCloud API 反向地理编码获取城市名（免费）
      let cityName = "";
      try {
        const geoResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`
        );
        const geoData = await geoResponse.json();
        cityName = geoData.city || geoData.locality || geoData.principalSubdivision || "";
      } catch {
        cityName = "";
      }

      if (weatherData.current) {
        const weatherCode = weatherData.current.weather_code;
        const weatherInfo = getWeatherDescription(weatherCode);

        const data: WeatherData = {
          city: cityName,
          temperature: Math.round(weatherData.current.temperature_2m),
          description: weatherInfo.description,
          humidity: weatherData.current.relative_humidity_2m,
          wind: `${Math.round(weatherData.current.wind_speed_10m)} km/h`,
          icon: weatherInfo.icon,
        };
        weatherCache = { data, time: Date.now() };
        setWeather(data);
      }
    } catch {
      // 使用默认数据
      setWeather({
        city: "",
        temperature: 28,
        description: "多云",
        humidity: 65,
        wind: "东南风 3级",
        icon: "cloud",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number): { description: string; icon: string } => {
    const weatherMap: Record<number, { description: string; icon: string }> = {
      0: { description: "晴朗", icon: "sun" },
      1: { description: "大部晴朗", icon: "sun" },
      2: { description: "多云", icon: "cloud" },
      3: { description: "阴天", icon: "cloud" },
      45: { description: "雾", icon: "fog" },
      48: { description: "雾凇", icon: "fog" },
      51: { description: "小毛毛雨", icon: "rain" },
      53: { description: "毛毛雨", icon: "rain" },
      55: { description: "大毛毛雨", icon: "rain" },
      61: { description: "小雨", icon: "rain" },
      63: { description: "中雨", icon: "rain" },
      65: { description: "大雨", icon: "rain" },
      71: { description: "小雪", icon: "snow" },
      73: { description: "中雪", icon: "snow" },
      75: { description: "大雪", icon: "snow" },
      80: { description: "阵雨", icon: "rain" },
      81: { description: "强阵雨", icon: "rain" },
      82: { description: "暴雨", icon: "rain" },
      95: { description: "雷暴", icon: "storm" },
      96: { description: "雷暴伴冰雹", icon: "storm" },
      99: { description: "强雷暴伴冰雹", icon: "storm" },
    };
    return weatherMap[code] || { description: "未知", icon: "cloud" };
  };

  const getWeatherIcon = (icon: string) => {
    const iconStyle = "w-8 h-8";
    switch (icon) {
      case "sun":
        return (
          <svg className={iconStyle} style={{ color: "#f59e0b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case "rain":
        return (
          <svg className={iconStyle} style={{ color: "#3b82f6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 16.2A4.5 4.5 0 0017.5 8h-1.832c-.856-2.954-3.568-5-6.768-5a7 7 0 00-7 7v.5A4.5 4.5 0 006.5 21h11a4.5 4.5 0 002.5-4.8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v2m4-2v2m4-2v2" />
          </svg>
        );
      case "snow":
        return (
          <svg className={iconStyle} style={{ color: "#60a5fa" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m12.728 0L6.343 6.343" />
          </svg>
        );
      case "storm":
        return (
          <svg className={iconStyle} style={{ color: "#6366f1" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className={iconStyle} style={{ color: "#94a3b8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
    }
  };

  return (
    <div className="card-base card-padding">
      <h4 className="font-bold text-sm mb-3">天气预报</h4>
      {loading ? (
        <p className="text-sm text-[var(--muted)]">加载中...</p>
      ) : weather ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              {weather.city && <p className="text-sm font-medium">{weather.city}</p>}
              <p className="text-xs text-[var(--muted)]">{weather.description}</p>
            </div>
            {getWeatherIcon(weather.icon)}
          </div>
          <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
            {weather.temperature}°
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span>湿度 {weather.humidity}%</span>
            <span>风速 {weather.wind}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">无法获取天气</p>
      )}
    </div>
  );
}

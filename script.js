async function fetchWeather(city) {
  try {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('weatherCard').classList.add('hidden');

    // Step 1: City peru tho latitude, longitude teesukovali
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    if (!geoRes.ok) throw new Error('Geocoding failed');
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found! Check spelling.');
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Aa lat/lon tho weather teesukovali
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`);
    if (!weatherRes.ok) throw new Error('Weather fetch failed');
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    // Display
    document.getElementById('cityName').textContent = `${name}, ${country}`;
    document.getElementById('temp').textContent = current.temperature_2m + '°C';
    document.getElementById('desc').textContent = getWeatherDesc(current.weather_code);
    document.getElementById('humidity').textContent = current.relative_humidity_2m + '%';
    document.getElementById('wind').textContent = current.wind_speed_10m + ' km/h';
    document.getElementById('feelsLike').textContent = current.apparent_temperature + '°C';
    document.getElementById('updated').textContent = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)} | ${new Date().toLocaleTimeString()}`;
    document.getElementById('weatherCard').classList.remove('hidden');

  } catch (err) {
    document.getElementById('error').textContent = err.message + ' (Check internet)';
    document.getElementById('error').classList.remove('hidden');
  } finally {
    document.getElementById('loader').classList.add('hidden');
  }
}

function getWeatherDesc(code) {
  const map = {0:'Clear Sky',1:'Mainly Clear',2:'Partly Cloudy',3:'Overcast',45:'Fog',51:'Light Drizzle',61:'Slight Rain',71:'Slight Snow',80:'Slight Showers',95:'Thunderstorm'};
  return map[code] || 'Weather Code: ' + code;
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  if(city) fetchWeather(city);
});
document.getElementById('cityInput').addEventListener('keypress', e => { if(e.key==='Enter') document.getElementById('searchBtn').click(); });
window.addEventListener('load', () => fetchWeather('Vijayawada'));
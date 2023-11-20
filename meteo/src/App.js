import React, { useState, useEffect } from "react";

function App() {
  const [lat, setLat] = useState(45.69);
  const [lon, setLon] = useState(9.67);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [preferite, setPreferite] = useState([]);

  const apiKey = 'cb276b5c376d0746d7e9e78ac7eec9f0';

  const handleLatChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLat(value);
    }
  };

  const handleLonChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLon(value);
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=it&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=it&units=metric`;

      try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();
        setCurrentWeather(currentWeatherData);

        // Fetch 5-day forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Process forecast data to show only 1 entry per day
        const filteredForecastData = forecastData.list.filter((item, index) => {
          // Show only one entry per day (assuming the data is ordered chronologically)
          return index % 8 === 0; // 8 corresponds to the data for every 24 hours (3-hour intervals)
        });

        setForecastData(filteredForecastData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [lat, lon, apiKey]);

  useEffect(() => {
    // Carica le preferite salvate quando la componente viene montata
    const preferiteSalvate = JSON.parse(localStorage.getItem("preferite")) || [];
    setPreferite(preferiteSalvate);
  }, []);

  const aggiungiPreferita = () => {
    // Aggiungi la località corrente alle preferite
    const nuovaPreferita = {
      nome: currentWeather.name,
      latitudine: lat,
      longitudine: lon,
    };

    // Aggiorna lo stato delle preferite
    setPreferite([...preferite, nuovaPreferita]);

    // Salva le preferite nel localStorage
    localStorage.setItem("preferite", JSON.stringify([...preferite, nuovaPreferita]));
  };

  const svuotaPreferite = () => {
    // Rimuovi tutte le località preferite
    setPreferite([]);

    // Svuota il localStorage
    localStorage.removeItem("preferite");
  };

  return (
    <div className="App">
      <div className="search">
        <input
          className="lat"
          onChange={handleLatChange}
          placeholder="Inserisci Latitudine"
          type="text"
        />
        <input
          className="lon"
          onChange={handleLonChange}
          placeholder="Inserisci Longitudine"
          type="text"
        />
      </div>
      <div className="container">
        {currentWeather && forecastData && (
          <>
            <div className="header">
              <div className="location">
                <h2>{currentWeather.name}</h2>
              </div>
              <div className="temp">
                <h1>{currentWeather.main.temp} °C</h1>
              </div>
              <div className="description">
                <p>{currentWeather.weather[0].description}</p>
              </div>
            </div>

            <div className="forecast">
              {forecastData.map((forecast) => (
                <div key={forecast.dt} className="forecast-item">
                  <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                  <p>{forecast.main.temp} °C</p>
                  <p>{forecast.weather[0].description}</p>
                </div>
              ))}
            </div>

            <div className="footer">
              <div className="feels">
                <p>Percepiti: {currentWeather.main.feels_like} °C</p>
              </div>
              <div className="humidity">
                <p>Umidità: {currentWeather.main.humidity}%</p>
              </div>
              <div className="wind">
                <p>Vento: {currentWeather.wind.speed} km/h</p>
              </div>
            </div>

            <button className="style-button" onClick={aggiungiPreferita}>Aggiungi alle preferite</button>
            <button className="style-button" onClick={svuotaPreferite}>Svuota Preferite</button>

            <div className="preferite">
              <h3>Località Preferite:</h3>
              {preferite.map((preferita, index) => (
                <p key={index}>
                  {preferita.nome}: Latitudine {preferita.latitudine}, Longitudine {preferita.longitudine}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

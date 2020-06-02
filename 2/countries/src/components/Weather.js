import React from 'react';

const Weather = ({ country, weather }) => {
    if (weather.current) {
        return (
            <div>
                <h3>Weather in {country.capital}</h3>
                <p>Temperature: {weather.current.temperature}°C</p>
                <img src={weather.current.weather_icons[0]} alt="weather" width="100vw"/>
                <p>Wind: {weather.current.wind_speed}km/h {weather.current.wind_dir}</p>
            </div>
        )
    }
    return null;
}

export default Weather;

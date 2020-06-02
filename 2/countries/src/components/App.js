import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import Result from './Result';
import Country from './Country';

const App = () => {
    const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const [ search, setSearch ] = useState('');
    const [ countries, setCountries ] = useState([]);
    const [ weather, setWeather ] = useState({});

    useEffect(() => {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                setCountries(response.data);
            })
    }, [])

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const handleClick = (event) => {
        event.preventDefault();
        setSearch(event.target.name);
    }

    const countriesToShow = countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase()));

    const countriesFound = () => {
        if (countriesToShow.length === 1) {
            const country = countriesToShow[0];
            axios
                .get(`http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${country.capital}`)
                .then(response => {
                    setWeather(response.data);
                })
        }
    }

    countriesFound();

    return (
        <div>
            <Search search={search} handleChange={handleChange} />
            {countriesToShow.length !== 1 ? <Result countriesToShow={countriesToShow} handleClick={handleClick} /> : <Country country={countriesToShow[0]} weather={weather} />}
        </div>
    )

}

export default App;

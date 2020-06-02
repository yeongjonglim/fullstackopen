import React from 'react';
import CountryDetails from './CountryDetails';
import Weather from './Weather';

const Country = ({ country, weather }) => {
    return (
        <div>
            <CountryDetails country={country} />
            <Weather country={country} weather={weather} />
        </div>
    )
}

export default Country;

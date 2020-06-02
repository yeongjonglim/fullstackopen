import React from 'react';

const Result = ({ countriesToShow, handleClick }) => {
    if (countriesToShow.length <= 10) {
        return (
            <div>
                {countriesToShow.map(country => (
                    <div key={country.name}>
                        {country.name}<button type="button" name={country.name} onClick={handleClick}>Show</button>
                    </div>
                ))}
            </div>
        )
    } else {
        return <p>Please input more characters in your search.</p>
    }
}

export default Result;

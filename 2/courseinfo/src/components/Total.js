import React from 'react';

const Total = (props) => {
    let total = props.parts.reduce((accumulator, current) => {
        accumulator += current.exercises;
        return accumulator;
    }, 0);

    return (
        <div>
            <strong>Total of {total} exercises</strong>
        </div>
    )
}

export default Total;

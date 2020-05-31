import React from 'react';
import Part from './Part';

const Content = (props) => {
    const parts = props.parts.map((part, index) => <Part key={index} part={part.name} exercise={part.exercises} />)

    return (
        <div>
            {parts}
        </div>
    )
}

export default Content;

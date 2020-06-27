import React from 'react';
import Part from './Part';
import { CoursePart } from '../types';

const Total: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => {
    return (
        <div>
            {courseParts.map(part => <Part key={part.name} coursePart={part} />)}
        </div>
    );
};

export default Total;

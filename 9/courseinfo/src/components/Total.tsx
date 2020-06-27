import React from 'react';

const Total: React.FC<{ courseParts: { name: string; exerciseCount: number }[] }> = ({ courseParts }) => {
    return (
        <p>
            Number of exercises{" "}
            {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
        </p>
    );
};

export default Total;

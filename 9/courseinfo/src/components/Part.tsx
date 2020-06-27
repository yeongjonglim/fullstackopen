import React from 'react';
import { CoursePart } from '../types';

const Part: React.FC<{ coursePart: CoursePart }> = ({ coursePart }) => {
    return (
        <div>
            {Object.entries(coursePart).map(([key, value]) => <p key={key}>{ key }: { value }</p>
            )}
        </div>
    );
};

export default Part;

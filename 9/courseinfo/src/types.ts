interface CoursePartBase {
    name: string;
    exerciseCount: number;
    description?: string;
}

interface CoursePartOne extends CoursePartBase {
    name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
    name: "Using props to pass data";
    groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBase {
    name: "Deeper type usage";
    exerciseSubmissionLink: string;
}

interface CoursePartFour extends CoursePartBase {
    name: "Part 4";
}

export type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CoursePartFour;

export const courseParts: CoursePart[] = [
    {
        name: "Fundamentals",
        exerciseCount: 10,
        description: "This is an awesome course part"
    },
    {
        name: "Using props to pass data",
        exerciseCount: 7,
        groupProjectCount: 3
    },
    {
        name: "Deeper type usage",
        exerciseCount: 14,
        description: "Confusing description",
        exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
    },
    {
        name: "Part 4",
        exerciseCount: 17,
        description: "Dummy description"
    }
];

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

courseParts.forEach(part => {
    switch(part.name) {
        case "Fundamentals":
            break;
        case "Using props to pass data":
            break;
        case "Deeper type usage":
            break;
        case "Part 4":
            break;
        default:
            return assertNever(part);
    }
})

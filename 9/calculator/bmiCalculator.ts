interface InputBmi {
    value1: number;
    value2: number;
}

const parseArgumentsBmi = (args: Array<string>): InputBmi => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            value1: Number(args[2]),
            value2: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

const calculateBmi = (height: number, weight: number): string => {
    const bmi = weight / ((height/100) ** 2);
    switch (true) {
        case (bmi < 15):
            return "Very severely underweight";
        case (bmi < 16):
            return "Severely underweight";
        case (bmi < 18.5):
            return "Underweight";
        case (bmi < 25):
            return "Normal (healthy weight)";
        case (bmi < 30):
            return "Overweight";
        case (bmi < 35):
            return "Obese Class I (Moderately obese)";
        case (bmi < 40):
            return "Obese Class II (Severely obese)";
        case (bmi >= 40):
            return "Obese Class III (Very severely obese)";
        default:
            return "Default Statement";
    }
};

if (require.main === module) {
    try {
        const { value1, value2 } = parseArgumentsBmi(process.argv);
        console.log(calculateBmi(value1, value2));
    } catch (e) {
        const error:Error = Error(e);
        console.log('Error, something bad happened, message: ', error.message);
    }
}

export { calculateBmi };

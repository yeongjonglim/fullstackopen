import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { ApiInputExercises, calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    if ((req.query.height && req.query.weight) && !isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
        res.status(200).send({
            weight: Number(req.query.weight),
            height: Number(req.query.height),
            bmi: calculateBmi(Number(req.query.height), Number(req.query.weight))
        });
    } else {
        res.status(400).send({
            error: "malformatted parameters"
        });
    }
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request: ApiInputExercises = req.body;

    if (!request.daily_exercises || !request.target) {
        return res.status(400).send({
            error: "parameters missing"
        });
    }

    if (!request.daily_exercises.every(i => (typeof i === "number")) || isNaN(Number(request.target))) {
        return res.status(400).send({
            error: "malformatted parameters"
        });
    }

    try {
        const exercises = calculateExercises(request.daily_exercises, request.target);
        return res.status(200).send(exercises);
    } catch(e) {
        return res.status(400).send({
            error: "malformatted parameters"
        });
    }


});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

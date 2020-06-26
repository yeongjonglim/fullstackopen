import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../src/utils';

const router = express.Router();

router.get('/', (_req, res) => {
    res.status(200).send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);

        const addedEntry = patientService.addEntry(newPatientEntry);
        res.status(201).json(addedEntry);
    } catch (e) {
        const error:Error = Error(e);
        res.status(400).send(error.message);
    }
});

export default router;

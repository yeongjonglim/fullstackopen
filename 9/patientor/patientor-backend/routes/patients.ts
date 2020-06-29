import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../src/utils';
import { NewEntry } from '../src/types';

const router = express.Router();

router.get('/', (_req, res) => {
    res.status(200).send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
    res.status(200).send(patientService.getEntry(req.params.id));
});

router.post('/', (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);

        const addedEntry = patientService.addPatientEntry(newPatientEntry);
        res.status(201).json(addedEntry);
    } catch (e) {
        const error:Error = Error(e);
        res.status(400).send(error.message);
    }
});

router.post('/:id/entries', (req, res) => {
    try {
        const newEntry = req.body as NewEntry;

        const addedEntry = patientService.addEntry(req.params.id, newEntry);
        if (addedEntry) {
            res.status(201).json(addedEntry);
        } else {
            res.status(400).send('missing fields or patient not found');
        }
    } catch (e) {
        const error:Error = Error(e);
        res.status(400).send(error.message);
    }
});

export default router;

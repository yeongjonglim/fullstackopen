import patientData from '../data/patients.json';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry, Patient, Entry } from '../src/types';
import toNewPatientEntry from "../src/utils";

let patientEntries: PatientEntry[] = patientData.map(obj => {
    const object = toNewPatientEntry(obj) as PatientEntry;
    object.id = obj.id;
    return object;
});


const getEntries = (): PatientEntry[] => {
    return patientEntries;
};

const getEntry = (id: string): Patient | undefined => {
    const patientEntry = patientEntries.find(patient => patient.id === id);

    const newEntry: Entry[] = [];

    const patient = {
        ...patientEntry,
        entries: newEntry
    } as Patient;

    return patient;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
    const nonSensitive = patientEntries.map(p => {
        const newP = {...p};
        delete newP.ssn;
        return newP;
    });
    // Omit is not actually stopping the key from being present in the object
    return nonSensitive;
};

const addEntry = ( entry: NewPatientEntry ): PatientEntry => {
    const newPatientEntry = {
        id: uuid(),
        ...entry
    };
    patientEntries = patientEntries.concat(newPatientEntry);
    return newPatientEntry;
};

export default {
    getEntries,
    getEntry,
    getNonSensitiveEntries,
    addEntry
};

import patientData from '../data/patients.json';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry } from '../src/types';
import toNewPatientEntry from "../src/utils";

let patientEntries: PatientEntry[] = patientData.map(obj => {
    const object = toNewPatientEntry(obj) as PatientEntry;
    object.id = obj.id;
    return object;
});


const getEntries = (): PatientEntry[] => {
    return patientEntries;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
    patientEntries.forEach(p => delete p.ssn);
    // Omit is not actually stopping the key from being present in the object
    return patientEntries;
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
    getNonSensitiveEntries,
    addEntry
};

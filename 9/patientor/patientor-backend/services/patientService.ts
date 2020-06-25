import patientEntries from '../data/patients';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry } from '../src/types';

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
    return newPatientEntry;
};

export default {
    getEntries,
    getNonSensitiveEntries,
    addEntry
};

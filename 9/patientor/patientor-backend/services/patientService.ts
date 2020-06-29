import patientData from '../data/patients.json';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry, Patient, Entry, NewEntry } from '../src/types';
import toNewPatientEntry from "../src/utils";

let patientEntries: PatientEntry[] = patientData.map(obj => {
    const object = toNewPatientEntry(obj) as PatientEntry;
    object.id = obj.id;
    return object;
});

let patients: Patient[] = patientData as Patient[];

const getEntries = (): PatientEntry[] => {
    return patientEntries;
};

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const getEntry = (id: string): Patient | undefined => {
    const patientEntry: Patient | undefined = patients.find(patient => patient.id === id);

    patientEntry?.entries.forEach(entry => {
        switch(entry.type) {
            case "HealthCheck":
                break;
            case "Hospital":
                break;
            case "OccupationalHealthcare":
                break;
            default:
                assertNever(entry);
        }
    });

    const patient = {
        ...patientEntry,
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

const addPatientEntry = ( entry: NewPatientEntry ): PatientEntry => {
    const newPatientEntry = {
        id: uuid(),
        ...entry
    };
    patientEntries = patientEntries.concat(newPatientEntry);
    return newPatientEntry;
};

const checkEntry = (entry: NewEntry): boolean => {
    if (!entry.description || !entry.date || !entry.diagnosisCodes || !entry.type) {
        return false;
    }
    switch(entry.type) {
        case 'Hospital':
            if (!entry.discharge || !entry.discharge.date || !entry.discharge.criteria) {
                return false;
            }
            return true;
        case 'HealthCheck':
            if (entry.healthCheckRating === undefined) {
                console.log(entry.healthCheckRating);
                return false;
            }
            return true;
        case 'OccupationalHealthcare':
            if (!entry.sickLeave || !entry.sickLeave.startDate || !entry.sickLeave.endDate) {
                return false;
            }
            return true;
        default:
            return assertNever(entry);
    }
};

const addEntry = ( id: string, entry: NewEntry ): Patient | null => {
    if (!checkEntry(entry)) {
        return null;
    }
    const newEntry = {
        id: uuid(),
        ...entry
    } as Entry;
    const editingPatient = patients.find(p => p.id === id);
    if (!editingPatient) {
        return null;
    }
    const editedPatient = {
        ...editingPatient,
        entries: editingPatient.entries.concat(newEntry)
    };
    patients = patients.map(p => p.id === id ? editedPatient : p);
    return editedPatient;
};

export default {
    getEntries,
    getEntry,
    getNonSensitiveEntries,
    addPatientEntry,
    addEntry
};

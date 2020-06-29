import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export type Action =
    | {
        type: "SET_PATIENT_LIST";
        payload: Patient[];
    }
    | {
        type: "ADD_PATIENT";
        payload: Patient;
    }
    | {
        type: "GET_PATIENT";
        payload: Patient;
    }
    | {
        type: "SET_DIAGNOSIS_LIST";
        payload: Diagnosis[];
    }
    | {
        type: "UPDATE_PATIENT";
        payload: Patient;
    };


export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_PATIENT_LIST":
            return {
                ...state,
                patients: {
                    ...action.payload.reduce(
                        (memo, patient) => ({ ...memo, [patient.id]: patient }),
                        {}
                    ),
                    ...state.patients
                }
            };
        case "ADD_PATIENT":
            return {
                ...state,
                patients: {
                    ...state.patients,
                    [action.payload.id]: action.payload
                }
            };
        case "GET_PATIENT":
            return {
                ...state,
                patient: {
                    [action.payload.id]: action.payload
                }
            };
        case "SET_DIAGNOSIS_LIST":
            return {
                ...state,
                diagnoses: {
                    ...action.payload.reduce(
                        (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
                        {}
                    ),
                    ...state.diagnoses
                }
            };
        default:
            return state;
    }
};

export const setPatientList = (payload: Patient[]): Action => {
    return {
        type: "SET_PATIENT_LIST",
        payload
    };
};

export const addPatient = (payload: Patient): Action => {
    return {
        type: "ADD_PATIENT",
        payload
    };
};

export const getPatient = (payload: Patient): Action => {
    return {
        type: "GET_PATIENT",
        payload
    };
};

export const setDiagnosisList = (payload: Diagnosis[]): Action => {
    return {
        type: "SET_DIAGNOSIS_LIST",
        payload
    };
};

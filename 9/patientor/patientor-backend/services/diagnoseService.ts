import diagnoseData from '../data/diagnoses.json';
import { DiagnoseEntry } from '../src/types';

const getEntries = (): DiagnoseEntry[] => {
    return diagnoseData;
};

export default {
    getEntries
};

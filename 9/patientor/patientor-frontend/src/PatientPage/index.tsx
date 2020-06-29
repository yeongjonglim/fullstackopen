import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Header, Icon, Card, Grid, Button } from "semantic-ui-react";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";

import { apiBaseUrl } from "../constants";
import { Patient, Entry, NewEntry } from "../types";
import { useStateValue } from "../state";
import { getPatient } from "../state/reducer";

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const PatientPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [{ patient, diagnoses }, dispatch] = useStateValue();

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    const submitNewEntry = async (values: EntryFormValues) => {
        const newEntry = (): NewEntry => {
            const base = {
                description: values.description,
                date: values.date,
                specialist: values.specialist,
                diagnosisCodes: values.diagnosisCodes,
                type: values.type,
            };
            switch(values.type) {
                case "HealthCheck":
                    return {
                        ...base,
                        healthCheckRating: values.healthCheckRating
                    } as NewEntry;
                case "Hospital":
                    return {
                        ...base,
                        discharge: values.discharge
                    } as NewEntry;
                case "OccupationalHealthcare":
                    return {
                        ...base,
                        sickLeave: values.sickLeave
                    } as NewEntry;
                default:
                    // Not supposed to reach this part
                    return base as NewEntry;
            }
        };

        try {
            console.log(newEntry());
            const { data: newPatient } = await axios.post<Patient>(
                `${apiBaseUrl}/patients/${id}/entries`,
                newEntry()
            );
            dispatch(getPatient(newPatient));
            closeModal();
        } catch (e) {
            console.error(e.response.data);
            setError(e.response.data.error);
        }
    };

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const { data: patientFromApi } = await axios.get<Patient>(
                    `${apiBaseUrl}/patients/${id}`
                );
                dispatch(getPatient(patientFromApi));
            } catch (e) {
                console.error(e);
            }
        };
        if (!patient[id]) {
            fetchPatient();
        }
    }, [dispatch, id, patient]);

    const iconMap = () => {
        if (patient[id]) {
            if (patient[id]?.gender === 'male') {
                return 'man';
            } else if (patient[id]?.gender === 'female') {
                return 'woman';
            } else {
                return 'other gender';
            }
        }
    };

    const entryType = ( entry: Entry ) => {
        switch(entry.type) {
            case 'Hospital':
                return <Icon name='hospital' />;
            case 'OccupationalHealthcare':
                return <Icon name='user md' />;
            case 'HealthCheck':
                return <Icon name='heartbeat' />;
            default:
                return assertNever(entry);
        }
    };

    const verifyDiagnosisCodes = (entry: Entry) => {
        if (entry && entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && entry.diagnosisCodes[0] !== "") {
            return (
                <ul>
                    {entry.diagnosisCodes?.map(code => <li key={code}>{code} {diagnoses[code] && diagnoses[code].name}</li>)}
                </ul>
            );
        }
        return undefined;
    };

    return (
        <div>
            { patient[id] && 
            <>
                <Header as="h2">{patient[id]?.name}<Icon name={iconMap()} /></Header>
                <p>ssn: {patient[id]?.ssn}</p>
                <p>occupation: {patient[id]?.occupation}</p>
                <AddEntryModal
                    modalOpen={modalOpen}
                    onSubmit={submitNewEntry}
                    error={error}
                    onClose={closeModal}
                />
                <Button onClick={() => openModal()}>Add New Entry</Button>
                <Header as="h3">entries</Header>
                <Grid>
                    {patient[id]?.entries.map(entry => {
                        return (
                            <Grid.Row key={entry.id}>
                                <Card fluid
                                    header={
                                        <Header as="h3">
                                            {entry.date} {entryType(entry)}
                                        </Header>
                                    }
                                    meta={entry.specialist}
                                    description={entry.description}
                                    extra={verifyDiagnosisCodes(entry)}
                                />
                            </Grid.Row>
                        );
                    })}
                </Grid>
            </>
            }
        </div>
    );
};

export default PatientPage;

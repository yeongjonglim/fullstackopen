import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Header, Icon } from "semantic-ui-react";

import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { useStateValue } from "../state";
import { getPatient } from "../state/reducer";

const PatientPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [{ patient }, dispatch] = useStateValue();

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

    return (
        <div>
            { patient[id] && 
            <>
                <Header as="h2">{patient[id]?.name}<Icon name={iconMap()} /></Header>
                <p>ssn: {patient[id]?.ssn}</p>
                <p>occupation: {patient[id]?.occupation}</p>
            </>
            }
        </div>
    );
};

export default PatientPage;

import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, yupToFormErrors } from "formik";
import * as Yup from 'yup';

import { TextField, SelectField, DiagnosisSelection, HealthCheckOption, TypeOption } from "./FormField";
import { Diagnosis, HealthCheckRating } from "../types";
import { useStateValue } from "../state";

export type EntryFormValues = {
    type: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes: Array<Diagnosis['code']>;
    discharge: {
        date: string; 
        criteria: string;
    };
    healthCheckRating: HealthCheckRating;
    sickLeave: {
        startDate: string;
        endDate: string;
    };
};

interface Props {
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
}

const healthCheckRatingOptions: HealthCheckOption[] = [
    { value: HealthCheckRating.Healthy, label: "Healthy" },
    { value: HealthCheckRating.LowRisk, label: "Low Risk" },
    { value: HealthCheckRating.HighRisk, label: "High Risk" },
    { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" }
];

const typeOptions: TypeOption[] = [
    { value: "HealthCheck", label: "Health Check" },
    { value: "Hospital", label: "Hospital" },
    { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
];

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
    const [{ diagnoses }] = useStateValue();

    const initialValues = {
        type: "HealthCheck",
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [""],
        discharge: {
            date: "",
            criteria: ""
        },
        healthCheckRating: HealthCheckRating.Healthy,
        sickLeave: {
            startDate: "",
            endDate: ""
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={values => {
                const requiredError = "Field is required";
                const dischargeSchema = () => {
                    if (values.type === "Hospital") {
                        return Yup.object().shape({
                            date: Yup.string().required(requiredError),
                            criteria: Yup.string().required(requiredError)
                        });
                    }
                    return Yup.object().shape({
                        date: Yup.mixed().notRequired(),
                        criteria: Yup.mixed().notRequired()
                    });
                };

                const healthCheckSchema = () => {
                    if (values.type === "HealthCheck") {
                        return Yup.number().required();
                    }
                    return Yup.mixed().notRequired();
                };

                const sickLeaveSchema = () => {
                    if (values.type === "OccupationalHealthcare") {
                        return Yup.object().shape({
                            startDate: Yup.string().required(requiredError),
                            endDate: Yup.string().required(requiredError)
                        });
                    }
                    return Yup.object().shape({
                        startDate: Yup.mixed().notRequired(),
                        endDate: Yup.mixed().notRequired(),
                    });
                };

                const validationSchema = Yup.object().shape({
                    type: Yup.string().required(requiredError),
                    description: Yup.string().required(requiredError),
                    date: Yup.string().required(requiredError),
                    specialist: Yup.string().required(requiredError),
                    discharge: dischargeSchema(),
                    healthCheckRating: healthCheckSchema(),
                    sickLeave: sickLeaveSchema()
                });

                return validationSchema.validate(values)
                    .then(function() {
                        return {};
                    })
                    .catch(function(err) {
                        return yupToFormErrors(err);
                    });

            }}
    >
    {({ values, isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
            <Form className="form ui">
                <SelectField
                    label="Type"
                    name="type"
                    options={typeOptions}
                />
                <Field
                    label="Description"
                    placeholder="Entry Description"
                    name="description"
                    component={TextField}
                />
                <Field
                    label="Date"
                    placeholder="YYYY-MM-DD"
                    name="date"
                    component={TextField}
                />
                <Field
                    label="Specialist"
                    placeholder="Specialist"
                    name="specialist"
                    component={TextField}
                />
                <DiagnosisSelection
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    diagnoses={Object.values(diagnoses)}
                />
                {values.type === "HealthCheck" &&
                <SelectField
                    label="Health Check Rating"
                    name="healthCheckRating"
                    options={healthCheckRatingOptions}
                />
                }
                {values.type === "Hospital" &&
                <>
                    <Field
                        label="Discharge Date"
                        placeholder="YYYY-MM-DD"
                        name="discharge.date"
                        component={TextField}
                    />
                    <Field
                        label="Discharge Criteria"
                        placeholder="Criteria"
                        name="discharge.criteria"
                        component={TextField}
                    />
                </>
                }
                {values.type === "OccupationalHealthcare" &&
                <>
                    <Field
                        label="Start of Sick Leave"
                        placeholder="YYYY-MM-DD"
                        name="sickLeave.startDate"
                        component={TextField}
                    />
                    <Field
                        label="End of Sick Leave"
                        placeholder="YYYY-MM-DD"
                        name="sickLeave.endDate"
                        component={TextField}
                    />
                </>
                }
                <Grid>
                    <Grid.Column floated="left" width={5}>
                        <Button type="button" onClick={onCancel} color="red">
                            Cancel
                        </Button>
                    </Grid.Column>
                    <Grid.Column floated="right" width={5}>
                        <Button
                            type="submit"
                            floated="right"
                            color="green"
                            disabled={!dirty || !isValid}
                        >
                            Add
                        </Button>
                    </Grid.Column>
                </Grid>
            </Form>
        );
    }}
        </Formik>
);
};

export default AddEntryForm;

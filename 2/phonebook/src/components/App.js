import React, { useState, useEffect } from 'react';
import personService from '../services/persons';
import Persons from './Persons';
import PersonForm from './PersonForm';
import Filter from './Filter';

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ search, setSearch ] = useState('')

    useEffect(() => {
        personService
            .getAll()
            .then(initialPerson => {
                setPersons(initialPerson);
            })
    }, [])

    const handleChange = (event) => {
        if (event.target.name === "name") {
            setNewName(event.target.value);
        } else if (event.target.name === "number") {
            setNewNumber(event.target.value);
        } else if (event.target.name === "search") {
            setSearch(event.target.value);
        }
    }

    const handleDelete = (person) => {
        const result = window.confirm(`Delete ${person.name} from your phonebook?`);
        if (result) {
            personService
                .remove(person.id)
                .then(() => {
                    setPersons(persons.filter(pers => pers.id !== person.id))
                });
        }
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()));

    const addPerson = (event) => {
        event.preventDefault();
        const exists = (person) => person.name === newName;

        if (persons.some(exists)) {
            const person = persons.find(pers => pers.name === newName);
            const result = window.confirm(`${person.name} is already in your phonebook, do you want to replace the old phone number?`);
            if (result) {
                const changedPerson = {
                    ...person,
                    number: newNumber
                }
                personService
                    .update(person.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(pers => pers.id !== returnedPerson.id ? pers : returnedPerson));
                    })
            }
        } else if (newName === '' || newNumber === '') {
            alert('Missing Name or Number');
        } else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                });

            setNewName('');
            setNewNumber('');
        }
    }


    return (
        <div>
            <h2>Phonebook</h2>
            <h3>Search</h3>
            <Filter search={search} onChange={handleChange} />
            <h3>Add a Number</h3>
            <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} onChange={handleChange} />
            <h3>Numbers</h3>
            <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
        </div>
    )
}

export default App

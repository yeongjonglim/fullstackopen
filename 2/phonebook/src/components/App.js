import React, { useState } from 'react'
import Persons from './Persons';
import PersonForm from './PersonForm';
import Filter from './Filter';

const App = () => {
    const initialPersons = [
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ]
    const [ persons, setPersons ] = useState(initialPersons)

    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ search, setSearch ] = useState('')

    const handleChange = (event) => {
        if (event.target.name === "name") {
            setNewName(event.target.value);
        } else if (event.target.name === "number") {
            setNewNumber(event.target.value);
        } else if (event.target.name === "search") {
            setSearch(event.target.value);
        }
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()));

    const addPerson = (event) => {
        event.preventDefault();
        const exists = (person) => person.name === newName;
        if (persons.some(exists)) {
            alert(`${newName} is already added to phonebook`);
        } else if (newName === '' || newNumber === '') {
            alert('Missing Name or Number');
        } else {
            setPersons(persons.concat({
                name: newName,
                number: newNumber
            }));
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
            <Persons personsToShow={personsToShow} />
        </div>
    )
}

export default App

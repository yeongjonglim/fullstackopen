import React from 'react'
import { useDispatch } from 'react-redux'
import { filterList } from '../reducers/filterReducer'

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        // input-field value is in variable event.target.value
        const filterText = event.target.value
        dispatch(filterList(filterText))
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter

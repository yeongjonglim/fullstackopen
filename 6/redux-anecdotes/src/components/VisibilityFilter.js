import React from 'react'
//import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { filterList } from '../reducers/filterReducer'

const VisibilityFilter = ({ filterList }) => {
    //const dispatch = useDispatch()

    const handleChange = (event) => {
        // input-field value is in variable event.target.value
        const filterText = event.target.value
        filterList(filterText)
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

const mapDispatchToProps = {
    filterList,
}

const ConnectedVisibilityFilter = connect(
    null,
    mapDispatchToProps
)(VisibilityFilter)

export default ConnectedVisibilityFilter

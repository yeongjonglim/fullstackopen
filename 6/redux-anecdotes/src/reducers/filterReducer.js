const initialState = ''

const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FILTER':
            return action.data.filterText

        default:
            return state
    }

}

export const filterList = (filterText) => {
    return {
        type: 'FILTER',
        data: {filterText}
    }
}

export default filterReducer

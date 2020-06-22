import React, { useEffect } from 'react'

const Notify = ({ error, setError }) => {
    useEffect(() => {
        if(error !== null){
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }, [error, setError])

    return (
        <div>
            <p>{error}</p>
        </div>
    )
}

export default Notify

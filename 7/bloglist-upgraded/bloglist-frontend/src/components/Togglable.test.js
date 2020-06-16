import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
    let component

    beforeEach(() => {
        component = render(
            <Togglable buttonLabel="show">
                <div className="testDiv" />
            </Togglable>
        )
    })


    test('toggled content can be shown', () => {
        const button = component.container.querySelector('button')
        fireEvent.click(button)

        const closeButton = component.container.querySelector(
            'button:nth-child(2)'
        )
        fireEvent.click(closeButton)

        const div = component.container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })
})

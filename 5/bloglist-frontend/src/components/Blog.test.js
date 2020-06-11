import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
    let blog
    let component
    let mockHandler

    beforeEach(() => {
        blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'voltendron',
            url: 'https://reactjs.org/docs/testing.html',
            user: {
                id: '5edd963302867443824f0ad4',
                name: 'Superuser',
                username: 'root'
            }
        }

        mockHandler = jest.fn()

        component = render(
            <Blog blog={blog} updateBlog={mockHandler} removeBlog={mockHandler} />
        )
    })

    test('renders content', () => {
        expect(component.container).toHaveTextContent(
            'Component testing is done with react-testing-library', 'voltendron'
        )

        expect(component.container).not.toHaveTextContent(
            'https://reactjs.org/docs/testing.html', 'likes'
        )
    })

    test('expand and collapse of blogs', () => {
        const button = component.container.querySelector('button')
        fireEvent.click(button)

        expect(component.container).toHaveTextContent(
            'Component testing is done with react-testing-library', 'voltendron'
        )

        expect(component.container).toHaveTextContent(
            'https://reactjs.org/docs/testing.html', 'likes'
        )

        fireEvent.click(button)

        expect(component.container).toHaveTextContent(
            'Component testing is done with react-testing-library', 'voltendron'
        )

        expect(component.container).not.toHaveTextContent(
            'https://reactjs.org/docs/testing.html', 'likes'
        )
    })

    test('clicking the button calls event handler once', () => {
        const button = component.container.querySelector('button')
        fireEvent.click(button)

        const likeButton = component.getByText('like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })

})


import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
    let blog
    let component
    let mockHandler

    beforeEach(() => {
        blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'voltendron',
            url: 'https://reactjs.org/docs/testing.html',
        }

        mockHandler = jest.fn()

        component = render(
            <BlogForm createBlog={mockHandler} />
        )
    })

    test('when blog content is posted for create', async () => {
        // Checking if all fields are present
        expect(component.container.querySelector('#input--create-title')).toBeDefined()
        expect(component.container.querySelector('#input--create-author')).toBeDefined()
        expect(component.container.querySelector('#input--create-url')).toBeDefined()

        // Filling up all fields
        const title = component.container.querySelector('#input--create-title')
        const author = component.container.querySelector('#input--create-author')
        const url = component.container.querySelector('#input--create-url')

        fireEvent.change(title, {
            target: {
                value: blog.title
            }
        })

        fireEvent.change(author, {
            target: {
                value: blog.author
            }
        })

        fireEvent.change(url, {
            target: {
                value: blog.url
            }
        })

        // Checking if all fields contain the right value
        expect(title.value).toBe('Component testing is done with react-testing-library')
        expect(author.value).toBe('voltendron')
        expect(url.value).toBe('https://reactjs.org/docs/testing.html')

        // Checking if all fields are received by mockHandler
        const submit = component.container.querySelector('button')
        fireEvent.click(submit)

        const result = mockHandler.mock.calls[0][0]
        expect(result.title).toBe('Component testing is done with react-testing-library')
        expect(result.author).toBe('voltendron')
        expect(result.url).toBe('https://reactjs.org/docs/testing.html')
    })

})


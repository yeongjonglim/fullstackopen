describe('Blog app', function() {
    beforeEach(function() {
        const root = {
            username: 'root',
            name: 'Superuser',
            password: 'toor'
        }

        const testUser = {
            username: 'testuser',
            name: 'testuser',
            password: 'test'
        }
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        cy.request('POST', 'http://localhost:3001/api/users', root)
        cy.request('POST', 'http://localhost:3001/api/users', testUser)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('log in to application')
        cy.contains('username')
        cy.contains('password')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.get('#input--username').type('root')
            cy.get('#input--password').type('toor')
            cy.get('#button--login').click()
            cy.contains('Superuser logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#input--username').type('root')
            cy.get('#input--password').type('root')
            cy.get('#button--login').click()

            cy.get('.error')
                .should('contain', 'Wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')
            cy.get('html').should('not.contain', 'Superuser logged in')
        })
    })

    describe.only('When logged in', function() {
        beforeEach(function() {
            // Log in a user using backend
            cy.login({ username: 'root', password: 'toor' })

            cy.createBlog({
                title: 'Giant offshore wind turbines could help Vietnam tackle immense climate change challenges',
                author: 'Jack Board',
                url: 'https://www.channelnewsasia.com/news/asia/vietnam-offshore-wind-turbines-climate-change-12808712',
                likes: 18
            })

            cy.createBlog({
                title: 'EC: Over 80,000 applied to register as voters in Q1 by Bernama',
                author: 'Bername',
                url: 'https://www.nst.com.my/news/nation/2020/06/599311/ec-over-80000-applied-register-voters-q1',
                likes: 25
            })

            cy.createBlog({
                title: 'Full sales tax exemption for locally-assembled passenger cars',
                author: 'Ayisy Yusof',
                url: 'https://www.nst.com.my/news/nation/2020/06/598240/full-sales-tax-exemption-locally-assembled-passenger-cars-nsttv',
                likes: 5
            })
        })

        it('A blog can be created', function() {
            // Get the form
            cy.contains('create new blog').click()

            // Fill the form
            cy.get('#input--create-title').type('Various benefits in store for SMEs under Penjana')
            cy.get('#input--create-author').type('Adib Povera')
            cy.get('#input--create-url').type('https://www.nst.com.my/news/nation/2020/06/598248/various-benefits-store-smes-under-penjana')

            // Create the blog
            cy.get('#button--create').click()

            cy.get('html').should('contain', 'Various benefits in store for SMEs under Penjana by Adib Povera')
        })

        it('A blog can be liked', function() {
            cy.contains('show').click()
            cy.contains('like').click()

            cy.contains('26 likes')
        })

        it('A blog can be deleted', function() {
            cy.contains('show').click()
            cy.contains('remove').click()

            cy.get('Giant offshore wind turbines could help Vietnam tackle immense climate change challenges').should('not.exist')
        })

        it('A blog cannot be deleted by another user', function() {
            cy.clearLocalStorage()
            cy.login({ username: 'testuser', password: 'test' })

            cy.contains('show').click()
            cy.contains('remove').click()

            cy.get('html').should('contain', 'Unauthorised to delete blog')
        })

        it('A blog is sorted by number of likes', function() {
            // Think of a way to get all likes
            cy.contains('show').click()
            cy.contains('show').click()
            cy.contains('show').click()
            cy.get('.likes').first().invoke('text').then(function(elem0) {
                cy.get('.likes').eq(1).invoke('text')
                    .then(function(elem1) {
                        const like0 = parseInt(elem0)
                        const like1 = parseInt(elem1)
                        expect(like1).not.to.be.greaterThan(like0)
                        //cy.get('.likes').eq(1).invoke('text')
                        //    .should('not.be.gt', parseInt(elem0))

                        cy.get('.likes').eq(2).invoke('text')
                            .then(parseInt)
                            .should('not.be.gt', like0)
                            .and('not.be.gt', like1)
                    })
            })
        })
    })
})

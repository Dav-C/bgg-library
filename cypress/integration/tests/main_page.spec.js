describe('test the main app page', () => {
    beforeEach (() => {
        cy.visit('/')
    })
    it('page loads with the correct components in the expected state', () => {
        cy.contains('h1', 'Board Game Library')
        cy.get('input').invoke('attr', 'placeholder').should('equal', 'bgg username')
        cy.get('[data-cy=userSearchForm-submitButton-disabled]').should('contain', 'Load Library').should('be.disabled')
        cy.get('[data-cy=userSearchForm-submitButton-active]').should('not.exist')
        cy.get('[data-cy=mainPage-helpContentBox-openButton]').should('be.visible')
        cy.get('[data-cy=mainPage-helpContentBox]').should('not.exist')
    })
    it('open and close the help box', () => {
        cy.get('[data-cy=mainPage-helpContentBox-openButton]').should('be.visible').click()
        cy.get('[data-cy=mainPage-helpContentBox]').should('be.visible')
        cy.get('[data-cy=mainPage-helpContentBox-closeButton]').click()
        cy.get('[data-cy=mainPage-helpContentBox]').should('not.exist')
    })
    it('submit a username with and receive a 200 response along with a user collection', () => {
        cy.intercept('GET', 'https://bgg.cc/xmlapi2/collection?username=username', (req) =>{
            req.reply({
                statusCode: 200,
                fixture: 'collection.xml',
            })
        });
        cy.get('[data-cy=userSearchForm-usernameInput]').type('username')
        cy.get('[data-cy=userSearchForm-submitButton-active]').should('be.visible')
        cy.get('[data-cy=userSearchForm-submitButton-disabled]').should('not.exist')
        cy.get('[data-cy=userSearchForm-submitButton-active]').click()
        cy.url().should('include', 'gallery_view');
    })
    it('submit a username with UserSearchForm that returns 400', () => {
        cy.intercept('GET', 'https://bgg.cc/xmlapi2/collection?username=invalidUsername', {
            statusCode: 400,
        });
        cy.get('[data-cy=userSearchForm-usernameInput]').type('invalidUsername')
        cy.get('[data-cy=userSearchForm-submitButton-active]').should('be.visible')
        cy.get('[data-cy=userSearchForm-submitButton-disabled]').should('not.exist')
        cy.get('[data-cy=userSearchForm-submitButton-active]').click()
        cy.get('[data-cy=userSearchForm-fetchErrorMessage]').invoke('text').should('equal', 'error, response from server: 400')
    })
    // the api returns 202 while the requested collection is being processed. This test
    // simulates a process request that takes longer than 4 fetch attempts by the app
    // (approx. 18 seconds)
    it('submit a username with UserSearchForm, submit, and receive 202 responses', () => {
        cy.intercept('GET', 'https://bgg.cc/xmlapi2/collection?username=username', {
            statusCode: 202,
        });
        cy.get('[data-cy=userSearchForm-usernameInput]').type('username')
        cy.get('[data-cy=userSearchForm-submitButton-active]').should('be.visible')
        cy.get('[data-cy=userSearchForm-submitButton-disabled]').should('not.exist')
        cy.get('[data-cy=userSearchForm-submitButton-active]').click()
        cy.get('[data-cy=userSearchForm-fetchErrorMessage]').should('not.exist')
        cy.wait(20000);
        cy.get('[data-cy=userSearchForm-fetchErrorMessage]').should('be.visible')
        cy.get('[data-cy=userSearchForm-error-closeButton]').click()
        cy.url().should('equal', 'http://localhost:3000/')
    })
});

describe('test the gallery_view page', () => {
    beforeEach (() => {
        cy.intercept('GET', 'https://bgg.cc/xmlapi2/collection?*', (req) =>{
            req.reply({
                statusCode: 200,
                fixture: 'collection.xml',
            })
        });
        cy.intercept('GET', 'https://bgg.cc/xmlapi2/thing?*', (req) =>{
            req.reply({
                statusCode: 200,
                fixture: 'thing.xml',
            })
        });
        cy.visit('/')
        cy.get('[data-cy=userSearchForm-usernameInput]').type('username')
        cy.get('[data-cy=userSearchForm-submitButton-active]').click()
    })
    it('test the SideBar', () => {
        cy.log('open sidebar and expand filter section')
        cy.get('[data-cy=galleryView-openSideBarButton]').click()
        cy.get('[data-cy=sideBar-wrapper]').should('be.visible')
        cy.get('[data-cy=sideBar-openFilterSection]').click()

        cy.log('verify the number of switches')
        cy.get('[data-cy=sideBar-wrapper]').find('label').should('have.length', 9)

        cy.log('collapse the filter section')
        cy.get('[data-cy=sideBar-closeFilterSection]').click()
        cy.get('[data-cy=sideBar-closeFilterSection]').should('not.exist')

        cy.log('close the sidebar')
        cy.get('[data-cy=galleryView-closeSideBarButton]').click()
        cy.get('[data-cy=sideBar-wrapper]').should('not.be.visible')
    })

    it('test the options and filters available in the SideBar', () => {
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 2)

        cy.log('open sidebar and expand filter section')
        cy.get('[data-cy=galleryView-openSideBarButton]').click()
        cy.get('[data-cy=sideBar-openFilterSection]').click()

        cy.log('activate display game titles option')
        cy.get('[data-cy=optionsSwitch-displayGameTitles]').click()
        cy.get('[data-cy=galleryCard-gameTitleDiv-30549]').should('be.visible')

        cy.log('activate previously owned filter')
        cy.get('[data-cy=filterSwitch-prevowned]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 4)

        cy.log('activate previously for trade filter')
        cy.get('[data-cy=filterSwitch-fortrade]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 6)

        cy.log('activate want filter')
        cy.get('[data-cy=filterSwitch-want]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 8)

        cy.log('activate want to buy')
        cy.get('[data-cy=filterSwitch-wanttobuy]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 10)

        cy.log('activate want to play filter')
        cy.get('[data-cy=filterSwitch-wanttoplay]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 12)

        cy.log('activate wishlist filter')
        cy.get('[data-cy=filterSwitch-wishlist]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 14)

        cy.log('activate pre-ordered filter')
        cy.get('[data-cy=filterSwitch-preordered]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 16)

        cy.log('deactivate all switches and options')
        cy.get('[data-cy=optionsSwitch-displayGameTitles]').click()
        cy.get('[data-cy=galleryCard-gameTitleDiv-30549]').should('not.exist')
        cy.get('[data-cy=filterSwitch-owned]').click()
        cy.get('[data-cy=filterSwitch-prevowned]').click()
        cy.get('[data-cy=filterSwitch-fortrade]').click()
        cy.get('[data-cy=filterSwitch-want]').click()
        cy.get('[data-cy=filterSwitch-wanttobuy]').click()
        cy.get('[data-cy=filterSwitch-wanttoplay]').click()
        cy.get('[data-cy=filterSwitch-wishlist]').click()
        cy.get('[data-cy=filterSwitch-preordered]').click()
        cy.get('[data-cy=galleryView-imageContainer]').find('div').should('have.length', 0)
    })

    it('test the InfoBox', () => {
        cy.log('click on the first game in the map()')
        cy.get('[data-cy=infoBox-wrapper]').should('not.exist')
        cy.get('[data-cy=galleryView-imageContainer]').find('div').first().click()
        cy.get('[data-cy=infoBox-modal]').should('be.visible')
        cy.get('[data-cy=infoBox-wrapper]').should('be.visible')
        cy.get('[data-cy=infoBox-closeButton]').should('be.visible')
        cy.get('[data-cy=infoBox-rating]').invoke('text').should('equal', '7.6')
        cy.get('[data-cy=infoBox-closeButton]').click()
        cy.get('[data-cy=infoBox-wrapper]').should('not.exist')
    })
    it('reload the page', () => {
        cy.reload()
        cy.url().should('equal', 'http://localhost:3000/')
    })
});
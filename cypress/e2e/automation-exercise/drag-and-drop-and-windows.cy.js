describe('Drag and drop and windows', () => {

    it('Multiple windows', () => {
        cy.visit('https://the-internet.herokuapp.com/windows')

        cy.contains('Click Here').invoke('removeAttr', 'target').click()

        cy.get('h3').should('have.text', 'New Window')
    })

    it('Drag and Drop', () => {
        cy.visit('https://the-internet.herokuapp.com/drag_and_drop')
        
        const dataTransfer = new DataTransfer()

        cy.contains('A').trigger('dragstart', { dataTransfer})
        cy.contains('B').trigger('drop', { dataTransfer})
    })

});
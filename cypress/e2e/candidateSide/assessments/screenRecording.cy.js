import 'cypress-real-events/support';

describe(("Screen recording test"), ()=>{
    before(()=>{
        cy.visit('https://pod1.wecp.app/quizzes/eb79d377-66d5-41a4-8c8d-e114dd4fdb76');
        cy.contains('button', 'Start Test').click();
    });

    it("Checking screen recording with cypress", ()=>{
        cy.wait(5000);

        // cy.get('#share-screen-btn').realClick();
        cy.contains('.button', 'Next').click();
        cy.get('input[type=text]').type('sachin');
        cy.get('input[type=email]').type('sachin@wecp.in');

        cy.contains('.button', 'Next').click();
        cy.get('.ng-untouched').check();

        cy.contains('.button', 'Start Test').click();

        cy.wait(20000);

        cy.contains('Submit').click();

        cy.get('.blue-button').click({force: true});
    })
});
const adminCredentials = require('../../fixtures/login.fixture.json');
const orgDetails = require('../../fixtures/orgDetails.fixture.json');
const { randomString } = require('../../helpers/utils.helper');

describe('Testing interaction with combined report settings', () => {
	beforeEach(() => {
		cy.login(adminCredentials);
		cy.get('[data-tooltip="Settings"]').click();
		cy.get('.justify-end > .button').should('be.disabled');
		cy.contains('.margin-bottom-24 > .padding-vertical-12', 'Organization Description');
		cy.get('[name="combined-report"]').click().should('have.class', 'active');
	});

	it('Check logged in email', () => {
		cy.contains('#addedEmailList > :nth-child(1)', adminCredentials.email).should('be.visible');
	});

	it('Enter invalid email', () => {
		const invalidEmail = randomString(15, 'aA0');
		cy.get('input[name="emailId"]').should('be.empty').clear().type(`${invalidEmail}`).type('{enter}');
		cy.contains('#addedEmailList > :nth-child(2)', invalidEmail.toLowerCase()).should('be.visible');
	});

	it('Enter valid email', () => {
		const validEmail = randomString(15, 'aA0') + '@gmail.com';
		cy.get('input[name="emailId"]').should('be.empty').clear().type(`${validEmail}`).type('{enter}');
		cy.contains('#addedEmailList > :nth-child(2)', validEmail.toLowerCase()).should('be.visible');
	});

	it('Enter email with Enter key', () => {
		const validEmail = randomString(15, 'aA0') + '@gmail.com';
		cy.get('input[name="emailId"]').should('be.empty').clear().type(`${validEmail}`).type('{enter}');
		cy.contains('#addedEmailList > :nth-child(2)', validEmail.toLowerCase()).should('be.visible');
	});

	it('Enter email with comma key', () => {
		const validEmail = randomString(15, 'aA0') + '@gmail.com';
		cy.get('input[name="emailId"]').should('be.empty').clear().type(`${validEmail}`).type(',');
		cy.contains('#addedEmailList > :nth-child(2)', validEmail.toLowerCase()).should('be.visible');
	});

	it('Enter email with space key', () => {
		const validEmail = randomString(15, 'aA0') + '@gmail.com';
		cy.get('input[name="emailId"]').should('be.empty').clear().type(`${validEmail}`).type(' ');
		cy.contains('#addedEmailList > :nth-child(2)', validEmail.toLowerCase()).should('be.visible');
	});

	// TODO: Complete the below test case
	it('Check selected report type', () => {
		cy.get('[data-content="Candidates who have taken the test"]')
			.should('be.visible')
			.contains('Test Reports')
			.should('not.have.class', 'inactiveListItem');
		cy.get('[data-content="Candidates who have been invited"]')
			.should('be.visible')
			.should('have.class', 'inactiveListItem')
			.contains('Invite Reports');
		cy.get('[data-content="Candidates who have given feedback for the test"]')
			.should('be.visible')
			.should('have.class', 'inactiveListItem')
			.contains('Candidate Feedback');
	});
});

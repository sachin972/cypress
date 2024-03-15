const adminCredentials = require('../../fixtures/login.fixture.json');
const orgDetails = require('../../fixtures/orgDetails.fixture.json');
const { randomString } = require('../../helpers/utils.helper');

describe('Testing interaction with organization general settings', () => {
	const saveButton = '.justify-end > .button'

	beforeEach(() => {
		cy.login(adminCredentials);
		cy.get('[data-tooltip="Settings"]').click();
		cy.get(saveButton).should('be.disabled');
		cy.contains('.margin-bottom-24 > .padding-vertical-12', 'Organization Description');
		cy.get('[name="general"]').should('have.class', 'active');
	});

	it('Editing org display name', () => {
		cy.get('[name="orgDisplayName"]').click().clear().type(randomString(32, 'aA 0!'));
		cy.get(saveButton).should('be.not.disabled').click();
		cy.get('#toast-container').should('be.visible');
		cy.get(saveButton).should('be.disabled');
	});

	it('Editing hide display name', () => {
		cy.get('[name="hideDisplayName"]').should('be.not.checked').click().should('be.checked');
		cy.get(saveButton).should('be.not.disabled').click();
		cy.get('#toast-container').should('be.visible');
		cy.get(saveButton).should('be.disabled');
	});

	it('Editing level 1 definition', () => {
		cy.get('[name="nomenclatureGroup"]').click().clear().type(randomString(10, 'aA 0!'));
		cy.get(saveButton).should('be.not.disabled').click();
		cy.get('#toast-container').should('be.visible');
		cy.get(saveButton).should('be.disabled');
	});

	it('Editing level 2 definition', () => {
		cy.get('[name="nomenclatureQuiz"]').click().clear().type(randomString(10, 'aA 0!'));
		cy.get(saveButton).should('be.not.disabled').click();
		cy.get('#toast-container').should('be.visible');
		cy.get(saveButton).should('be.disabled');
	});

	it('Editing public visibility', () => {
		cy.get('[name="orgPublic"]').should('be.not.checked').click().should('be.checked');
		cy.get(saveButton).should('be.not.disabled').click();
		cy.get('#toast-container').should('be.visible');
		cy.get(saveButton).should('be.disabled');
	});

	it('Editing active status', () => {
		cy.get('[name="orgActive"]')
			.should('have.class', 'button indigo-button')
			.click()
			.should('have.class', 'button indigo-button');
		cy.get('#toast-container').contains('Please contact WeCP Admin').should('be.visible');
		cy.get(saveButton).should('be.disabled');
	});

	it('Reverting all changes', () => {
		cy.get('[name="orgDisplayName"]').click().clear().type(orgDetails.displayName);
		cy.get('[name="hideDisplayName"]').should('be.checked').click().should('be.not.checked');
		cy.get('[name="nomenclatureGroup"]').click().clear().type(orgDetails.nomenclatureGroup);
		cy.get('[name="nomenclatureQuiz"]').click().clear().type(orgDetails.nomenclatureQuiz);
		cy.get('[name="orgPublic"]').should('be.checked').click().should('be.not.checked');
		cy.get(saveButton).should('be.not.disabled').click();
		cy.get('#toast-container').should('be.visible');
		cy.get(saveButton).should('be.disabled');
		cy.get('#toast-container').should('be.visible');
		cy.get(saveButton).should('be.disabled');
	});
});

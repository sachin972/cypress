const adminCredentials = require('../../fixtures/login.fixture.json');

/**
 * TODO:
 * What should happen if a existing collaborator is added with different access level?
 */

describe('Testing interaction with organization members', () => {
	const accessDropdown = '[style="margin-left: auto; display: flex;"] > :nth-child(1) > .ui';

	beforeEach(() => {
		cy.login(adminCredentials);
		cy.get('[data-tooltip="Settings"]').click();
		cy.get('.justify-end > .button').should('be.disabled');
		cy.contains('.margin-bottom-24 > .padding-vertical-12', 'Organization Description');
		cy.get('[name="org-member"]').click().should('have.class', 'active');
	});

	it('Add new collaborator - Default access level', () => {
		const email = generateEmail('default');
		cy.get('#newCollaborator').type(email);
		cy.get('[name="inviteMemberCTA"]').click();
		cy.get('.ng-trigger', { timeout: 10000 }).contains('Successfully added collaborator');
		cy.get('#org-members-settings').contains(email).siblings().contains('Invited');
		cy.reload();
		cy.get('#org-members-settings').contains(`${email} Invited`).siblings().eq(0).contains('Read').should('be.visible');
	});

	it('Add new collaborator - Write access level', () => {
		const email = generateEmail('write');
		cy.get('#newCollaborator').type(email);
		cy.get(accessDropdown).click();
		cy.get('.menu.transition.visible', { timeout: 10000 }).should('be.visible');
		cy.get('[name="Write"]').click();
		cy.get('[name="inviteMemberCTA"]').click();
		cy.get('.ng-trigger', { timeout: 10000 }).contains('Successfully added collaborator');
		cy.get('#org-members-settings').contains(email).siblings().contains('Invited');
		cy.reload();
		cy.get('#org-members-settings')
			.contains(`${email} Invited`)
			.siblings()
			.eq(0)
			.contains('Write')
			.should('be.visible');
	});

	it('Add new collaborator - Questions access level', () => {
		const email = generateEmail('questions');
		cy.get('#newCollaborator').type(email);
		cy.get(accessDropdown).click();
		cy.get('.menu.transition.visible', { timeout: 10000 }).should('be.visible');
		cy.get('[name="Questions"]').click();
		cy.get('[name="inviteMemberCTA"]').click();
		cy.get('.ng-trigger', { timeout: 10000 }).contains('Successfully added collaborator');
		cy.get('#org-members-settings').contains(email).siblings().contains('Invited');
		cy.reload();
		cy.get('#org-members-settings')
			.contains(`${email} Invited`)
			.siblings()
			.eq(0)
			.contains('Questions')
			.should('be.visible');
	});


	// TODO: Fix test case
	// it('Check if existing user is being added', () => {
	// 	const email = generateEmail('default');
	// 	cy.get('#newCollaborator').type(email);
	// 	cy.get('[style="margin-left: auto; display: flex;"] > :nth-child(1) > .ui').click();
	// 	cy.get('.menu.transition.visible', { timeout: 10000 }).should('be.visible');
	// 	cy.get('[name="Write"]').click();
	// 	cy.get('button').contains('+ Invite member').click();
	// 	cy.get('.ng-trigger').contains('User already exist').should('be.visible');
	// 	cy.get('#org-members-settings')
	// 		.contains(`${email} Invited`)
	// 		.siblings()
	// 		.eq(0)
	// 		.contains('Write')
	// 		.should('not.be.visible');
	// });

	// TODO: Fix test case
	// it('Update access level of existing user', () => {
	// 	const email = generateEmail('default');
	// 	cy.get('#org-members-settings').contains(`${email} Invited`).siblings().eq(0).contains('Read').click();
	// 	cy.get('#access-level-dropdown-menu.visible', { timeout: 10000 }).should('be.visible').contains('Admin');
	// 	cy.get('#access-level-dropdown-menu.visible > [data-value="2"]', { timeout: 10000 }).click()
	// 	cy.get('#org-members-settings')
	// 		.contains(`${email} Invited`)
	// 		.siblings()
	// 		.eq(0)
	// 		.contains('Admin')
	// 		.should('be.visible');
	// 	cy.reload();
	// 	cy.get('#org-members-settings')
	// 		.contains(`${email} Invited`)
	// 		.siblings()
	// 		.eq(0)
	// 		.contains('Admin')
	// 		.should('be.visible');
	// });

	it('Revert changes', () => {
		deleteCollaborator(generateEmail('default'));
		deleteCollaborator(generateEmail('write'));
		deleteCollaborator(generateEmail('questions'));
	});
});

const deleteCollaborator = (email) => {
	cy.get('#org-members-settings').contains(`${email} Invited`).siblings().eq(1).children().eq(1).invoke('show').click();
	cy.wait(500);
	cy.get('button').contains('Delete').click();
	cy.get('#org-members-settings').contains(email).should('not.exist');
};

const generateEmail = (accessLevel) => {
	return `cypress+${accessLevel}@wecp.in`;
};

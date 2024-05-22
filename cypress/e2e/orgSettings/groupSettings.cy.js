const adminCredentials = require('../../fixtures/login.fixture.json');

describe('Testing interaction with group settings', () => {
	const initialGroupName = 'TBD';
	const groupName = 'To Be Delete';

	const saveSettings = () => {
		cy.get('.justify-between > .justify-end > .button').click();
	};

	beforeEach(() => {
		cy.login(adminCredentials);
		cy.get('[data-tooltip="Settings"]').click();
		cy.get('.justify-end > .button').should('be.disabled');
		cy.contains('.margin-bottom-24 > .padding-vertical-12', 'Organization Description');
		cy.get('[name="groups"]').click().should('have.class', 'active');
	});

	it('Adding a new group', () => {
		cy.get('.ui.three.column.grid.margin-top-16', { timeout: 10000 }).should('be.visible');
		cy.get('button').contains('Create Group').click();
		cy.get('textarea').click().type(initialGroupName);
		cy.get('.button.bg-wecp-blue.text-white').contains('Create').click();
		cy.get('.ng-trigger').contains('Successfully created new group').should('be.visible');
	});

	it('Update group name', () => {
		cy.get('.ui.three.column.grid.margin-top-16', { timeout: 10000 }).should('be.visible');
		cy.contains(initialGroupName).click();
		cy.get('input[name="groupName"]').click().clear().type(groupName);
		saveSettings();
		cy.reload();
		cy.contains(groupName).click();
		cy.get('input[name="groupName"]').should('have.value', groupName);
	});

	it('Add group Members', () => {
		const email = 'cypress+group@wecp.in';
		cy.contains(groupName).click();
		cy.get('#newCollaborator').type(email);
		cy.get('#inviteGroupMember').click();
		cy.get('.ng-trigger', { timeout: 10000 }).contains('Successfully added collaborator');
		cy.get('#org-group-settings').contains(email).siblings().contains('Invited');
		cy.reload();
		cy.contains(groupName).click();
		cy.get('#org-group-settings').contains(`${email} Invited`).siblings().eq(0).contains('Read').should('be.visible');
	});

	it('Update group Members', () => {
		const email = 'cypress+group@wecp.in';
		cy.contains(groupName).click();
		cy.get('#org-group-settings').contains(`${email} Invited`).siblings().eq(0).contains('Read').click();
		cy.get('.menu.transition.visible', { timeout: 10000 }).should('be.visible').contains('Admin').click();
		cy.get('.ng-trigger', { timeout: 10000 }).contains('Successfully changed access level');
		cy.get('#org-group-settings').contains(`${email} Invited`).siblings().eq(0).contains('Admin').should('be.visible');
		cy.reload();
		cy.contains(groupName).click();
		cy.get('#org-group-settings').contains(`${email} Invited`).siblings().eq(0).contains('Admin').should('be.visible');
	});

	it('Update public visibility', () => {
		cy.contains(groupName).click();
		cy.get('[name="groupPublic"]').should('be.not.checked').click().should('be.checked');
		saveSettings();
		cy.reload();
		cy.contains(groupName).click();
		cy.get('[name="groupPublic"]').should('be.checked');
	});

	it('Deactivate Group', () => {
		cy.contains(groupName).click();
		cy.contains('[name="toggleActiveGroup"]', 'Deactivate').click();
		cy.contains('[name="toggleActiveGroup"]', 'Activate');
		cy.reload();
		cy.contains(groupName).click();
		cy.contains('[name="toggleActiveGroup"]', 'Activate');
	});

	it('Deleting group', () => {
		cy.get('.ui.three.column.grid.margin-top-16', { timeout: 10000 }).should('be.visible');
		cy.contains(groupName, { timeout: 10000 }).click();
		cy.get('button').contains('Delete Group').click();
		cy.get('.button.red-button.flex.items-center.margin-0-important').eq(1).click();
	});
});

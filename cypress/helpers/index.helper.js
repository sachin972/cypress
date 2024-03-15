

export const signIn = (id, password) => {

	cy.get('#loginButton').should('be.disabled');

	cy.get('input[type=text]').type(id);
	cy.get('input[type=password]').type(password);
	cy.get('#loginButton').click();

	// utils.checkNetworkStatus('POST', '**/user/signin', 200, '#login');
	return true;
};

export const signOut = () => {
	cy.visit('/auth/signout');
};

export const checkWindowAlert = (expectedText) => {
	cy.on('window:alert', (txt) => {
		expect(txt).to.contains(expectedText);
	});
};
export const checkWindowAlert = (expectedText) => {
	cy.on('window:alert', (alertText) => {
		expect(alertText).to.contains(expectedText);
	});
};

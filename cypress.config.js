const { defineConfig } = require('cypress');

module.exports = defineConfig({
	projectId: "h7b2g9",
	defaultCommandTimeout: 40000,
	viewportWidth: 1920,
	viewportHeight: 1080,
	headless: true

	e2e: {
		baseUrl: 'https://d.assess.wecreateproblems.com/'
	},

	component: {
		devServer: {
			framework: 'angular',
			bundler: 'webpack'
		},
		specPattern: '**/*.cy.ts'
	}
});

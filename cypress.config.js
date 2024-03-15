const { defineConfig } = require('cypress');

module.exports = defineConfig({
	projectId: "7cmk1q",
	defaultCommandTimeout: 40000,
	viewportWidth: 1920,
	viewportHeight: 1080,

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

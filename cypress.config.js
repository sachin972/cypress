const { defineConfig } = require('cypress');

module.exports = defineConfig({
	projectId: "h7b2g9",
	defaultCommandTimeout: 40000,
	viewportWidth: 1920,
	viewportHeight: 1080,
	e2e: {
		baseUrl: 'https://assess.wecreateproblems.com/'
	},
	component: {
		devServer: {
			framework: 'angular',
			bundler: 'webpack'
		},
		specPattern: '**/*.cy.ts'
	}
});
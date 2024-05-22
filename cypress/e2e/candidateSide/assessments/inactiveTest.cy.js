import * as candidateHelper from '../../../helpers/candidate.helper';
import * as indexHelper from '../../../helpers/index.helper';
const adminCredentials = require('../../../fixtures/login.fixture.json');

describe('Inactive Test', () => {
	let testDetails = {};
	beforeEach(() => {
		cy.fixture('/testPortal/inactiveTest.fixture.json').then((details) => {
			testDetails = details;
		});
	});

	it('Non Admin user', () => {
		cy.visit(`/quizzes/${testDetails._id}`);
		candidateHelper.checkLandingPage(testDetails);
	});

	it('Admin user', () => {
		Object.keys(testDetails.admin).forEach((key) => {
			testDetails[key] = testDetails.admin[key];
		});
		cy.login(adminCredentials, { callback: `/quizzes/${testDetails._id}` });
		testDetails.isAdmin = true;

		candidateHelper.checkLandingPage(testDetails);
		candidateHelper.enterInstructions();
		candidateHelper.checkInstructionsPage(testDetails);
		indexHelper.checkWindowAlert('Quiz is not active');
	});
});

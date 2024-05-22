import * as candidateHelper from '../../../helpers/candidate.helper';
const adminCredentials = require('../../../fixtures/login.fixture.json');

describe('Past Test', () => {
	let testDetails = {};
	beforeEach(() => {
		cy.fixture('/testPortal/pastTest.fixture.json').then((details) => {
			testDetails = details;
		});
	});

	it('Non admin user', () => {
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
		candidateHelper.startTest();
		candidateHelper.checkQuestionsPage(testDetails);

		candidateHelper.checkSingleChoice(4);
		candidateHelper.checkProgress(1, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(4);
		candidateHelper.checkProgress(2, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(4);
		candidateHelper.checkProgress(3, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(4);
		candidateHelper.checkProgress(4, testDetails.questionsCount);

		candidateHelper.manuallySubmitTest(4, 4);
	});
});

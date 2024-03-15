import * as testHelper from '../../helpers/test.helper';
import * as indexHelper from '../../helpers/index.helper';

describe('Future test', () => {
	let testDetails = {};
	beforeEach(() => {
		cy.fixture('/test_portal/future_test.fixture.json').then((details) => {
			testDetails = details;
		});
	});

	it('Non Admin user', () => {
		cy.visit(`/quizzes/${testDetails._id}`);
		testHelper.checkLandingPage(testDetails);
	});

	// it('Admin user', () => {
	// 	Object.keys(testDetails.admin).forEach((key) => {
	// 		testDetails[key] = testDetails.admin[key];
	// 	});
	// 	testDetails.isAdmin = true;
	// 	cy.visit(`/auth/signin?callbackUrl=%2Ftests%2F${testDetails._id}%2Finstructions`);
	// 	indexHelper.signIn(testDetails.admin.email, testDetails.admin.password);
	// 	testHelper.checkLandingPage(testDetails);
	// 	testHelper.enterInstructions();
	// 	testHelper.checkInstructionsPage(testDetails);
	// 	testHelper.checkQuestionsPage(testDetails);
	// 	testHelper.checkProgress((testDetails.numAnswered * 126) / testDetails.questionsCount);
	// 	testHelper.manuallySubmitTest(testDetails);
	// });
});

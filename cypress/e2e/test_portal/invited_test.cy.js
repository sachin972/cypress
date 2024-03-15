// const testHelper = require('../../helpers/test.helper');
import * as testHelper from '../../helpers/test.helper';
import * as indexHelper from '../../helpers/index.helper';

describe('Invited Tests', () => {
	let testDetails = {};
	beforeEach(() => {
		cy.fixture('/test_portal/invited_test.fixture.json').then((details) => {
			testDetails = details;
		});
	});

	it('Invited test, candidate invited', () => {
		Object.keys(testDetails.invited_user).forEach((key) => {
			testDetails[key] = testDetails.invited_user[key];
		});
		cy.visit(`/quizzes/${testDetails._id}/?inviteId=${testDetails.invite_id}`);
		testHelper.checkLandingPage(testDetails);
		testHelper.enterInstructions();
		testHelper.checkInstructionsPage(testDetails);
		testHelper.checkQuestionsPage(testDetails);

		// const val = (testDetails.numAnswered == 0 ? 0 : 126/testDetails.numAnswered);
		testHelper.checkProgress((testDetails.numAnswered * 126) / testDetails.questionsCount);

		testHelper.manuallySubmitTest(testDetails);
	});

	it('Invited test, not invited user', () => {
		Object.keys(testDetails.non_invited_user).forEach((key) => {
			testDetails[key] = testDetails.non_invited_user[key];
		});
		cy.visit(`/quizzes/${testDetails._id}`);
		testHelper.checkLandingPage(testDetails);
	});

	// it('Invited test, Signed In(not invited) user', () => {
	// 	Object.keys(testDetails.signed_in_user).forEach((key) => {
	// 		testDetails[key] = testDetails.signed_in_user[key];
	// 	});
	// 	cy.visit(`/auth/signin?callbackUrl=%2Fquizzes%2F${testDetails._id}`);
	// 	// indexHelper.newSignIn(testDetails.email, testDetails.password);

	// 	// cy.visit(`/quizzes/${testDetails._id}`);
	// 	testHelper.checkLandingPage(testDetails);
	// });

	// it('Invited test, Admin', () => {
	// 	Object.keys(testDetails.admin_user).forEach((key) => {
	// 		testDetails[key] = testDetails.admin_user[key];
	// 	});
	// 	cy.visit(`/auth/signin?callbackUrl=%2Fquizzes%2F${testDetails._id}`);
	// 	indexHelper.signIn(testDetails.email, testDetails.password);
	// 	testDetails.isAdmin = true;
	// 	// cy.visit(`/quizzes/${testDetails._id}?preview=true`);
	// 	testHelper.checkLandingPage(testDetails);
	// 	testHelper.enterInstructions();
	// 	testHelper.checkInstructionsPage(testDetails);
	// 	testHelper.checkQuestionsPage(testDetails);

	// 	// const val = (testDetails.numAnswered == 0 ? 0 : 126/testDetails.numAnswered);
	// 	testHelper.checkProgress((testDetails.numAnswered * 126) / testDetails.questionsCount);

	// 	testHelper.manuallySubmitTest(testDetails);
	// });

	// TODO: Add test for admin to go through invite link

	afterEach(() => {
		// indexHelper.signOut();
	});
});

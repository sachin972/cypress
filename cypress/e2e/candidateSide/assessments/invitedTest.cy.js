import * as candidateHelper from '../../../helpers/candidate.helper';

describe('Invite only assessment', () => {
	let testDetails = {};
	beforeEach(() => {
		cy.fixture('/testPortal/invitedTest.fixture.json').then((details) => {
			testDetails = details;
		});
	});

	it('Candidate with invite', () => {
		Object.keys(testDetails.invited_user).forEach((key) => {
			testDetails[key] = testDetails.invited_user[key];
		});
		cy.visit(`/quizzes/${testDetails._id}/?inviteId=${testDetails.invite_id}`);
		candidateHelper.checkLandingPage(testDetails);
		candidateHelper.enterInstructions();
		candidateHelper.checkInstructionsPage(testDetails);
		candidateHelper.startTest();
		candidateHelper.checkQuestionsPage(testDetails);

		candidateHelper.checkSubjective();
		candidateHelper.checkProgress(1, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSubjective();
		candidateHelper.checkProgress(2, testDetails.questionsCount);

		candidateHelper.manuallySubmitTest(2, 2);
	});

	it('Candidate without invite', () => {
		Object.keys(testDetails.non_invited_user).forEach((key) => {
			testDetails[key] = testDetails.non_invited_user[key];
		});
		cy.visit(`/quizzes/${testDetails._id}`);
		candidateHelper.checkLandingPage(testDetails);
	});

	it('Signed In user - No access', () => {
		Object.keys(testDetails.signed_in_user).forEach((key) => {
			testDetails[key] = testDetails.signed_in_user[key];
		});
		cy.login(testDetails.signed_in_user, { callback: `/quizzes/${testDetails._id}` });
		candidateHelper.checkLandingPage(testDetails);
	});

	it('Signed In user - Admin access', () => {
		Object.keys(testDetails.admin_user).forEach((key) => {
			testDetails[key] = testDetails.admin_user[key];
		});
		cy.login(testDetails.admin_user, { callback: `/quizzes/${testDetails._id}` });
		testDetails.isAdmin = true;

		candidateHelper.checkLandingPage(testDetails);
		candidateHelper.enterInstructions();
		candidateHelper.checkInstructionsPage(testDetails);
		candidateHelper.startTest();
		candidateHelper.checkQuestionsPage(testDetails);

		candidateHelper.checkSubjective();
		candidateHelper.checkProgress(1, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSubjective();
		candidateHelper.checkProgress(2, testDetails.questionsCount);

		candidateHelper.manuallySubmitTest(2, 2);
	});

	it('Signed In user - Admin access with invite', () => {
		// TODO: Add test for admin to go through invite link
	});

	afterEach(() => {
		cy.logout();
	});
});

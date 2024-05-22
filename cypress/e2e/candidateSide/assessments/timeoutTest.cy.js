import * as candidateHelper from '../../../helpers/candidate.helper';
import * as utils from '../../../helpers/utils.helper';

describe('Timeout test', () => {
	let testDetails = {};
	beforeEach(() => {
		cy.fixture('/testPortal/timeoutTest.fixture.json').then((details) => {
			testDetails = details;
			cy.visit(`/quizzes/${testDetails._id}`);
		});
	});

	it('Unauthenticated timeout test', () => {
		const email = utils.randomString(10, 'aA') + '@gmail.com';
		const username = utils.randomString(15, 'aA ');
		testDetails.email = email;
		testDetails.user_name = username;
		testDetails.formDetails[0].value = email;
		testDetails.formDetails[1].value = username;

		candidateHelper.checkLandingPage(testDetails);
		candidateHelper.enterInstructions();
		candidateHelper.checkInstructionsPage(testDetails);
		candidateHelper.startTest();
		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(1, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(2, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(3, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(4, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		cy.wait(22000);

		candidateHelper.checkSubmitModal(4, testDetails.questionsCount, 0, {autoSubmit : true});
	});
});

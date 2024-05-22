import * as candidateHelper from '../../../helpers/candidate.helper';
import * as utils from '../../../helpers/utils.helper';

describe('Adaptive Test', () => {
	let testDetails = {};
	before(() => {
		cy.fixture('/testPortal/adaptiveTest.fixture.json').then((details) => {
			testDetails = details;
			cy.visit(`/quizzes/${testDetails._id}`);
		});
	});

	it('Take adaptive test', () => {
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

		candidateHelper.checkAdaptiveComponents(testDetails.questionsCount, 0);

		// Single choice questions
		candidateHelper.checkSingleChoice(5, 2);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkSingleChoice(5);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkSingleChoice(5);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkSingleChoice(5, 2);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkSingleChoice(5);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkSingleChoice(5);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkSingleChoice(5);
		candidateHelper.nextAdaptiveQuestion();

		// Multiple Correct questions
		candidateHelper.checkAdaptiveComponents(testDetails.questionsCount, 7);
		candidateHelper.checkMultipleChoice(4, 3);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkMultipleChoice(8, 3);
		candidateHelper.nextAdaptiveQuestion();

		// Subjective type questions
		candidateHelper.checkAdaptiveComponents(testDetails.questionsCount, 9);
		candidateHelper.checkSubjective();
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.checkSubjective();
		candidateHelper.nextAdaptiveQuestion();

		// No questions in section 4

		// Programming questions
		candidateHelper.checkAdaptiveComponents(testDetails.questionsCount, 11);
		candidateHelper.answerCodingType([
			{
				name: 'JavaScript',
				searchTerm: '// Write your code here',
				testLine: 'return "Working!";'
			}
		]);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.answerCodingType([
			{
				name: 'C',
				searchTerm: '// Write your code here',
				testLine: 'printf("Working!");'
			},
			{
				name: 'Python 2',
				searchTerm: '# Write your code here',
				testLine: 'print("Working!");'
			},
			{
				name: 'Python 3',
				searchTerm: '# Write a code to print the list.',
				testLine: 'print("Working!");'
			}
		]);
		candidateHelper.nextAdaptiveQuestion();
		candidateHelper.answerCodingType([
			{
				name: 'Node JS',
				searchTerm: '// Write your code here',
				testLine: 'return "Working!";'
			}
		]);
		candidateHelper.nextAdaptiveQuestion();

		// ML questions -- Done
		candidateHelper.checkAdaptiveComponents(testDetails.questionsCount, 14);
		candidateHelper.checkMLQuestions(testDetails.AIUploadFiles);
		candidateHelper.nextAdaptiveQuestion();

		// No questions in section 7

		// No questions in section 8

		// No questions in section 9

		// Project type questions
		candidateHelper.checkAdaptiveComponents(testDetails.questionsCount, 15);
		candidateHelper.checkProjectQuestions();
		candidateHelper.nextAdaptiveQuestion();
		// candidateHelper.checkProjectQuestions();
		// candidateHelper.nextAdaptiveQuestion();

		// No questions in section 11

		// Work sample upload questions
		candidateHelper.checkWorkSample();

		// TODO: Update this to work as expected
		candidateHelper.manuallySubmitTest(16, testDetails.questionsCount, true); // Not correct should be 17 answered
	});
});

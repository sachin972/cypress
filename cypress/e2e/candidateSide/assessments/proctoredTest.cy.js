import * as candidateHelper from '../../../helpers/candidate.helper';
import * as utils from '../../../helpers/utils.helper';

describe("Proctoring Violations Test", () => {

    let testDetails = {};
    beforeEach(() => {
        cy.fixture('/testPortal/proctoredTest.fixture.json').then((details) => {
            testDetails = details;
            cy.visit(`/quizzes/${testDetails._id}`);
        });
    });

    it("Take proctored test", ()=>{
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
        cy.wait(5000);

        candidateHelper.triggerTabViolation();
        // candidateHelper.checkTabViolation();
        // candidateHelper.checkClipboardViolation();
        // candidateHelper.continueTest();

        candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(1, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(2, testDetails.questionsCount);
        candidateHelper.switchQuestion(1, 3);

		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(3, testDetails.questionsCount);
		candidateHelper.nextQuestion();


        candidateHelper.triggerTabViolation();
        // candidateHelper.checkTabViolation();
        // candidateHelper.checkClipboardViolation();
        // candidateHelper.continueTest();

		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(4, testDetails.questionsCount);
        candidateHelper.switchQuestion(1, 5);

        candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(5, testDetails.questionsCount);
		candidateHelper.nextQuestion();

		candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(6, testDetails.questionsCount);
        candidateHelper.switchQuestion(1, 7);

        candidateHelper.checkSingleChoice(5);
		candidateHelper.checkProgress(7, testDetails.questionsCount);

        candidateHelper.triggerTabViolation();
        // candidateHelper.checkTabViolation();
        // candidateHelper.checkClipboardViolation();
        // candidateHelper.continueTest();

        candidateHelper.manuallySubmitTest(7, testDetails.questionsCount);
    });
})
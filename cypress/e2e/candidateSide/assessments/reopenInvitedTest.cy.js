import * as candidateHelper from '../../../helpers/candidate.helper';

describe("Reopen Invited Test", () => {
    let testDetails = {};

    beforeEach(() => {
		cy.fixture('/testPortal/invitedTest.fixture.json').then((details) => {
			testDetails = details;
            Object.keys(testDetails.invited_user).forEach((key) => {
                testDetails[key] = testDetails.invited_user[key];
            })
		});
	});

    it("Start Test", ()=>{
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
    })

    it("Reopen Test", ()=>{
        cy.visit(`/quizzes/${testDetails._id}/?inviteId=${testDetails.invite_id}`);
        candidateHelper.checkParallelSessionPage(testDetails);

        candidateHelper.checkProgress(2, testDetails.questionsCount);
        candidateHelper.checkSubjective();

        candidateHelper.checkProgress(2, testDetails.questionsCount);

        candidateHelper.manuallySubmitTest(2, 2);
    })
})
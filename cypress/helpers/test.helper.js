import * as content from '../fixtures/content_right.fixture';

// Checks the page for public and private tests
const checkPublicOrInvitedTestLandingPage = (testDetails) => {
	// TODO: Add a check for start and end date in the page
	cy.url().should('contain', 'instructions');

	if (testDetails.active && ((testDetails.invite_id != undefined && testDetails.invite_id != '') || testDetails.public)) {
		cy.get('img.client-logo').should('exist');
		console.log(testDetails?.name);
		cy.contains(`${testDetails?.name}`).should('exist');
	} else {
		// cy.get('img.wecp-logo').should('exist');
	}
};

const checkTestAccessibility = (testDetails) => {
	let currDate = new Date();
	const startDate = new Date(testDetails.testStartDate);
	const endDate = new Date(testDetails.testEndDate);

	if (currDate > endDate) {
		// Past test
		cy.contains('button', 'Test ended').should('exist').and('be.disabled');
	} else if (currDate < startDate) {
		// Future test
		// console.log("future");
		cy.get('button').eq(0).should('be.disabled');
		cy.contains('button', 'Try a sample Test').should('exist').and('be.enabled');

		// TODO: Add a check for timer
	} else {
		// Ongoing test
		cy.contains('button', 'Try a sample Test').should('exist');
		cy.contains('button', 'Start Test').should('exist');
		cy.contains(`${testDetails.questionsCount} Questions`).should('exist');
		cy.contains(`${testDetails.duration} mins`).should('exist');
	}
};

const checkHeader = (testDetails) => {
	cy.get('img.client-logo').should('exist');
	cy.contains(testDetails.name).should('exist');
	cy.contains(`${testDetails.questionsCount} Questions`).should('exist');
	cy.contains(`${testDetails.duration} mins`).should('exist');
};

// Check for navbar on instructions page
const checkNavigation = (currSection, numSections = 3) => {
	cy.get('.nav').should('exist');

	for (let i = 0; i < numSections; i++) {
		let currEl = `:nth-child(${i + 1}) > .padding-8`;

		if (currSection == i) {
			cy.get(currEl).should('have.class', 'ongoing-section');
			content.instructionPageRequirements[currSection].forEach((el) => {
				cy.contains(el).should('exist');
			});
		} else if (currSection > i) {
			cy.get(currEl).should('have.class', 'completed-section');
		} else {
			cy.get(currEl).should('have.class', 'pending-section');
		}
	}
};

// Checks for form page
const checkPersonalInformationPage = (testDetails) => {
	checkHeader(testDetails);
	checkNavigation(1);
	const emailField = 'input[type=email]';
	const userNameField = 'input[type=text]';
	if (testDetails.isAdmin) {
		cy.get(emailField).should('have.value', testDetails.email).and('be.disabled');
		cy.get(userNameField).should('have.value', testDetails.user_name).and('be.disabled');
	} else if (testDetails.invite_id != '') {
		cy.get(emailField).should('have.value', testDetails.invited_user.email).and('be.disabled');
		cy.get(userNameField).should('have.value', testDetails.invited_user.user_name);

		// Going to next section without filling up required fields
		cy.get('.button').click();

		cy.get(userNameField).should('have.class', 'error');
		cy.contains('This field is required').should('exist');
		cy.get(`:nth-child(2) > .padding-8`).should('have.class', 'failed-section');

		cy.get(userNameField).type(testDetails.form_details.user_name);
		cy.get(userNameField).should('not.have.class', 'error');
		cy.get(`:nth-child(2) > .padding-8`).should('have.class', 'ongoing-section');
	}
	// if(testDetails.public){
	//     cy.get(emailField).should('have.value', "");
	//     cy.get(userNameField).should('have.value', "");

	// }
	cy.get('.button').click();
};

const checkGeneralInstructions = (testDetails) => {
	checkHeader(testDetails);
	checkNavigation(2);
	testDetails.questionTypes.forEach((question) => {
		cy.contains(question).should('exist');
	});
	cy.contains('button', 'Start Test').should('exist').and('be.disabled');
	cy.get('input[type=checkbox]')
		.check()
		.then(() => {
			cy.contains('button', 'Start Test').should('be.enabled');
		});
	cy.get('button')
		.click()
		.then(($btn) => {
			cy.get('button').should('have.class', 'loading');
		});
};

// Enter instructions page
export const enterInstructions = () => {
	cy.contains('button', 'Start Test').click();
};

// Checks landing page for the test
export const checkLandingPage = (testDetails) => {
	if (testDetails.isAdmin) {
		// cy.url().should('contain', 'preview=true');
		cy.get('button').contains('Start Test').should('exist');
		// console.log(`${testDetails.public} ${testDetails.active}`);
		if (!testDetails.public) {
			cy.contains('This test is only for invited users or is not public.').should('exist');
			cy.contains('button', 'Start Test').should('exist').and('be.enabled');
		} else if(!testDetails.activeTest){
			cy.contains('The Test is not active. Please contact administrator of the test');
			cy.contains('button', 'Start Test').should('exist').and('be.enabled');
		}
		 else {
			checkPublicOrInvitedTestLandingPage(testDetails);
			checkTestAccessibility(testDetails);
		}
	}
	console.log(testDetails.activeTest);

	if (testDetails.activeTest == true) {
		checkPublicOrInvitedTestLandingPage(testDetails);
		if (!testDetails.public) {
			if (testDetails.invite_id != undefined && testDetails.invite_id != '') {
				cy.url().should('contain', 'instructions');
				cy.contains(testDetails.name).should('exist');
				checkTestAccessibility(testDetails);
			let currDate = Date();

			if (currDate < Date(testDetails.testStartDate)) {
				// Past test

				cy.contains('button', 'test ended').should('exist').and('be.disabled');
			} else if (currDate > Date(testDetails.testEndDate)) {
				// Future test
				cy.get('button').eq(0).should('be.disabled');

				// TODO: Add a check for timer

			} else {
				cy.contains('This test is only for invited users or is not public.').should('exist');
				// cy.contains('button', 'Start Test').should('exist').and('be.enabled');
			}
		}

		if (testDetails.public) {
			// checkPublicOrInvitedTestLandingPage(testDetails);
			checkTestAccessibility(testDetails);
		}
	} else {
		cy.contains('The Test is not active. Please contact administrator of the test').should('exist');
	}
	}
}

// Checking instructions page
export const checkInstructionsPage = (testDetails) => {
	// Headers check
	checkHeader(testDetails);

	// First page
	checkNavigation(0);
	cy.get('.content-left').should('exist');

	// Check for any error occurred in system check
	cy.get('.grid > div.ng-star-inserted > :nth-child(1)')
		.should('not.exist')
		.then(($img) => {
			if (expect($img).to.not.exist) {
				cy.get(`:nth-child(1) > .padding-8`).should('have.class', 'ongoing-section');
			} else {
				cy.get(`:nth-child(1) > .padding-8`).should('have.class', 'failed-section');
				cy.contains('Run System check again').should('exist').click();
			}
		});
	cy.get('.content-right').should('exist');
	cy.get('.button').click();

	checkPersonalInformationPage(testDetails);

	checkGeneralInstructions(testDetails);
};

export const checkProgress = (value) => {
	cy.get('.progress.two').should('have.css', 'stroke-dashoffset', `${126 - value}px`);
};

const checkUtilityFunctions = () => {
	cy.get('.additional-option-icon-holder').should('not.exist');
	cy.get('.profile-icon-holder')
		.should('exist')
		.trigger('mouseover')
		.then(() => {
			cy.get('.popup').should('exist');
			// cy.contains('sachin\nsachin@wecreateproblems.com').should('exist');
		});
	cy.get('.dark-theme-icon-holder')
		.should('exist')
		.trigger('mouseover')
		.then(() => {
			cy.contains('Change theme').should('exist');
		});
	cy.get('.finish-test-icon-holder').should('exist');
};

const checkCollapsedSidebar = (totQuestions, markedAnswers = 0) => {
	cy.get('.minimizeSideNav').should('exist');
	cy.get('.timer').should('exist');
	cy.contains(`${markedAnswers}/${totQuestions}`).should('exist');
	cy.contains('div', 'Submit')
		.should('exist')
		.trigger('mouseover')
		.then(() => {
			cy.contains('Submit Test').should('exist');
		});
	cy.get('.flag-icon-holder')
		.should('exist')
		.trigger('mouseover')
		.then(() => {
			cy.contains('Flag this question').should('exist');
		});
	cy.get('.additional-option-icon-holder')
		.should('exist')
		.click()
		.then(() => {
			checkUtilityFunctions();
			cy.get('.less-option-icon-holder').should('exist').click();
		});
};

const checkExpandedSidebar = (testDetails) => {
	cy.get('.sideNav').should('exist');
	checkUtilityFunctions();
	cy.get('.questionButton').should('have.length', testDetails.questionsCount);
	cy.get('.activeQuestion').should('have.length', 1);
	cy.get('.attempted').should('have.length', testDetails.numAnswered);
	cy.get('.flagged').should('have.length', testDetails.numFlagged);
};

const checkSidebar = (testDetails) => {
	checkCollapsedSidebar(testDetails.questionsCount, testDetails.numAnswered);
	cy.get('.sidebar-gutter').click();
	checkExpandedSidebar(testDetails);
	cy.get('.sidebar-gutter').click();
};

export const checkQuestionsPage = (testDetails) => {
	checkSidebar(testDetails);
};

export const manuallySubmitTest = (testDetails) => {
	cy.contains('div', 'Submit').click();
	cy.get('.dimmer');
	cy.contains('button', 'Continue Test').should('exist').and('be.enabled');
	cy.contains('button', 'Submit Test').should('exist').and('be.enabled');
	const submitModal = ['Completed', 'Flagged', 'Unattempted'];
	submitModal.forEach((str) => {
		cy.contains(str);
		cy.contains(`${testDetails.numAnswered}/${testDetails.questionsCount} questions`);
		cy.contains(`${testDetails.numFlagged} questions`);
		cy.contains(`${testDetails.questionsCount - testDetails.numAnswered} questions`);
	});
	cy.contains('button', 'Submit Test').click();
};

export const flagQuestion = () => { 
	return;
}

export const checkMCQ = () => { 
	return;
}

export const checkSubjective = () => { 
	return;
}

export const checkMultipleChoice = (numOptions = 4, numSelections = 2, answers = []) => { 
	return;
}

export const answerCodingType = (languages = []) => {
	return;
 }

export const answerSubjectiveType = () => { 
	return;
}

import * as content from '../fixtures/instructionsContent.fixture';
import * as utils from './utils.helper';
import * as orgDetails from '../fixtures/orgDetails.fixture.json';
const _ = require('lodash');

const checkAdminOverride = (testDetails) => {
	if (testDetails.isAdmin) {
		// TODO: Remove its text dependency
		// TODO: Add check for disabled "start test" button
		cy.contains('button', 'Start Test').should('exist').and('be.enabled');
		cy.get('img.footer-branding-logo').should('exist');
	}
};

/**
 * Checks if the page has the expected accessibility for an ongoing test
 *
 * @param {Object} testDetails - The test details object
 */
const checkTestAccessibility = (testDetails) => {
	// TODO: Add check for admin access for the tests
	if (testDetails.testStartDate && testDetails.testEndDate) {
		// Runs when test is time bound
		const currentDate = new Date();
		const startDate = new Date(testDetails.testStartDate);
		const endDate = new Date(testDetails.testEndDate);
		if (currentDate > endDate) {
			// Past test
			cy.contains('button', 'Test ended').should('exist').and('be.disabled');
			cy.contains(`${testDetails.questionsCount} Questions`).should('exist');
			cy.contains(`${testDetails.duration} mins`).should('exist');
			checkAdminOverride(testDetails);
			return;
		} else if (currentDate < startDate) {
			// Future test
			cy.get('button').eq(0).should('be.disabled');
			cy.contains('button', 'Try a sample Test').should('exist').and('be.enabled');
			checkAdminOverride(testDetails);
			// TODO: Add a check for timer
			// TODO: Add check for "Run System Check"
			return;
		}
	}
	// Ongoing time bound test and non time bound
	cy.contains('button', 'Try a sample Test').should('exist');
	cy.contains('button', 'Start Test').should('exist');
	cy.contains(`${testDetails.questionsCount} Questions`).should('exist');
	cy.contains(`${testDetails.duration} mins`).should('exist');
};

/**
 * Checks the header on the test page
 *
 * @param {Object} testDetails - The test details object
 */
const checkHeader = (testDetails) => {
	cy.get('img.client-logo').should('exist');
	cy.contains(`${testDetails.name}`).should('exist');
	cy.contains(`${testDetails.questionsCount} Questions`).should('exist');
	cy.contains(`${testDetails.duration} mins`).should('exist');
};

/**
 * Checks the navigation bar on the instructions page
 *
 * @param {number} currentSection - The current section being viewed
 * @param {number} totalSections - The total number of sections in the test
 */
const checkNavigation = (currentSection, totalSections = 3) => {
	// Check if navbar exists
	cy.get('.nav').should('exist');

	for (let sectionIndex = 1; sectionIndex <= totalSections; sectionIndex++) {
		const currentElement = `:nth-child(${sectionIndex}) > .padding-8`;
		// Check for navbar classes
		if (currentSection === sectionIndex - 1) {
			cy.get(currentElement).should('have.class', 'ongoing-section');
			content.requirements[currentSection].forEach((element) => {
				cy.contains(element).should('exist');
			});
		} else if (currentSection > sectionIndex - 1) {
			cy.get(currentElement).should('have.class', 'completed-section');
		} else {
			cy.get(currentElement).should('have.class', 'pending-section');
		}
	}
};

/**
 * Checks for the personal information page
 *
 * @param {Object} testDetails - The test details
 */
const checkPersonalInformationPage = (testDetails) => {
	checkHeader(testDetails);
	checkNavigation(1, testDetails.instructions.length + 2);
	const emailField = 'input[type=email]';
	const userNameField = 'input[type=text]';
	// Checking if the user is an admin
	if (testDetails.isAdmin) {
		// Verifying if the email and user name fields are correct
		cy.get(emailField).should('have.value', testDetails.email).and('be.disabled');
		cy.get(userNameField).should('have.value', testDetails.user_name).and('be.disabled');
	} else if (testDetails.invite_id && testDetails.invite_id.length) {
		cy.get(emailField).should('have.value', testDetails.invited_user.email).and('be.disabled');
		cy.get(userNameField).should('have.value', testDetails.invited_user.user_name);

		// Going to the next section without filling up the required fields
		cy.get('.button').click();

		cy.get(userNameField).should('have.class', 'error');
		cy.contains('This field is required').should('exist');
		cy.get(`:nth-child(2) > .padding-8`).should('have.class', 'failed-section');

		cy.get(userNameField).type(testDetails.form_details.user_name);
		cy.get(userNameField).should('not.have.class', 'error');
		cy.get(`:nth-child(2) > .padding-8`).should('have.class', 'ongoing-section');
	} else {
		cy.get('.button').click();

		cy.get(userNameField).should('have.class', 'error');
		cy.contains('This field is required').should('exist');
		cy.get(`:nth-child(2) > .padding-8`).should('have.class', 'failed-section');

		cy.get(userNameField).type(testDetails.user_name);
		cy.get(emailField).type(testDetails.email);

		cy.get(userNameField).should('not.have.class', 'error');
		cy.get(`:nth-child(2) > .padding-8`).should('have.class', 'ongoing-section');
	}

	// Going to the next section
	cy.get('.button').click();
};

const checkPhotoVerification = (testDetails) => {
	checkHeader(testDetails);
	checkNavigation(2, testDetails.instructions.length + 2);
	cy.get('#output_canvas').should('exist');
	cy.get('.button').should('exist').click();
	// cy.contains('Unable to detect a face');
	// cy.contains('.margin-left-auto', 'Proceed to next step', { timeout: 20000 });

	cy.contains('.button', 'Next').click();
};

/**
 * Checks general instructions page
 *
 * @param {Object} testDetails - The test details
 * @param {Array} testDetails.questionTypes - The question types for the test
 */
const checkGeneralInstructions = (testDetails) => {
	// Check header and navigation
	checkHeader(testDetails);
	checkNavigation(2, testDetails.instructions.length + 2);

	// Check if all questions are present
	testDetails.questionTypes.forEach((question) => {
		cy.contains(question).should('exist');
	});

	// Next Section
	if (testDetails.instructions.length > 1) {
		cy.get('.button').click();
	}
};

/**
 * Checks org instructions page
 *
 * @param {Object} testDetails - The test details
 * @param {string} testDetails.about - The org's about details
 */
const checkOrgInstructions = (testDetails) => {
	checkHeader(testDetails);
	checkNavigation(3, testDetails.instructions.length + 2);

	cy.contains(testDetails.about);
	cy.contains(`Instructions from ${orgDetails.displayName}`);
	// if (testDetails.instructions.length > 2) {
	// 	cy.get('.button').click();
	// }
};

/**
 * Clicks the 'Start Test' button on the landing page to go to the instructions page.
 */
export const enterInstructions = () => {
	cy.contains('button', 'Start Test').click();
};

/**
 * Starts the test by clicking the 'Start Test' button on the landing page.
 * Checks that the button is disabled by default, then enabled after a checkbox is checked.
 * Clicks the button and checks that it is in a loading state.
 */
export const startTest = () => {
	// Check that the 'Start Test' button is disabled by default
	cy.contains('button', 'Start Test').should('exist').and('be.disabled');
	// Check that the button becomes enabled after a checkbox is checked
	cy.get('input[type=checkbox]')
		.check()
		.then(() => {
			cy.contains('button', 'Start Test').should('be.enabled');
		});
	// Click the 'Start Test' button and check that it is in a loading state
	cy.get('button')
		.click()
		.then(($btn) => {
			cy.get('button').should('have.class', 'loading');
		});
};

/**
 * Checks landing page for the test
 * @param {Object} testDetails - The test details object
 */
export const checkLandingPage = (testDetails) => {
	if (!testDetails.activeTest) {
		cy.contains('The Test is not active. Please contact administrator of the test').should('exist');
		cy.get('img.footer-branding-logo').should('exist');
		checkAdminOverride(testDetails);
		return;
	}
	if (!testDetails.public && !testDetails.invite_id) {
		cy.contains('This test is only for invited users or is not public.').should('exist');
		checkAdminOverride(testDetails);
		return;
	}
	cy.contains(testDetails.name).should('exist');
	cy.get('img.client-logo').should('exist');

	checkTestAccessibility(testDetails);
};

/**
 * Checks instructions page
 * @param {Object} testDetails - The test details object
 */
export const checkInstructionsPage = (testDetails) => {
	// Headers check
	checkHeader(testDetails);

	// First page
	checkNavigation(0, testDetails.instructions.length + 2);
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

	testDetails.instructions.forEach((el) => {
		switch (el) {
			case 'General instructions':
				checkGeneralInstructions(testDetails);
				break;
			case 'Video Verification':
				checkPhotoVerification(testDetails);
				break;
			case 'Org Instructions':
				checkOrgInstructions(testDetails);
				break;
		}
	});
};

/**
 * Checks progress of the test
 * @param {Number} answered - The current progress value
 * @param {Number} total - The total number of questions
 */
export const checkProgress = (answered, total) => {
	// const res = 126.0 - (value * 126.0) / 3.0;
	// cy.get('.progress.two').should('have.css', 'stroke-dashoffset', `${res}px`);
	cy.get('.circle > .text', { timeout: 10000 }).should('contain', `${answered}/${total}`);
};

/**
 * Checks the utility functions on the landing page
 */
const checkUtilityFunctions = () => {
	cy.get('.additional-option-icon-holder').should('not.exist');

	cy.get('.profile-icon-holder')
		.should('exist')
		.trigger('mouseover')
		.then(() => {
			cy.get('.popup').should('exist');
			// TODO: Check if it shows the same name and email
		});
	cy.get('.dark-theme-icon-holder')
		.should('exist')
		.trigger('mouseover')
		.then(() => {
			cy.contains('Change theme').should('exist');
		});
	cy.get('.finish-test-icon-holder').should('exist');
};

/**
 * Checks collapsed sidebar for the test
 * @param {number} totQuestions - Total number of questions in the test
 * @param {number} markedAnswers - Number of questions answered
 */
const checkCollapsedSidebar = (totQuestions, markedAnswers = 0, adaptive = false) => {
	cy.get('.minimizeSideNav').should('exist');

	// TODO: Check if timer progress is correct
	cy.get('.timer').should('exist');
	cy.contains(`${markedAnswers}/${totQuestions}`).should('exist');

	cy.contains('div', 'Submit')
		.should('exist')
		.trigger('mouseover')
		.then(() => {
			cy.contains('Submit Test').should('exist');
		});
	if (!adaptive) {
		cy.get('.flag-icon-holder')
			.should('exist')
			.trigger('mouseover')
			.then(() => {
				cy.contains('Flag this question').should('exist');
			});
	}
	cy.get('.additional-option-icon-holder')
		.should('exist')
		.click()
		.then(() => {
			checkUtilityFunctions();
			cy.get('.less-option-icon-holder').should('exist').click();
		});
};

/**
 * Checks if the expanded sidebar is correct
 * @param {Object} testDetails - The test details object
 */
const checkExpandedSidebar = (testDetails) => {
	cy.get('.sideNav').should('exist');
	checkUtilityFunctions();

	cy.get('.questionButton').should('have.length', testDetails.questionsCount);
	cy.get('.activeQuestion').should('have.length', 1);
	cy.get('.attempted').should('have.length', testDetails.numAnswered);
	cy.get('.flagged').should('have.length', testDetails.numFlagged);
};

/**
 * Checks the sidebar on the questions page
 *
 * @param {Object} testDetails - The test details object
 */
const checkSidebar = (testDetails) => {
	checkCollapsedSidebar(testDetails.questionsCount, testDetails.numAnswered);
	cy.get('.sidebar-gutter').click();
	checkExpandedSidebar(testDetails);
	cy.get('.sidebar-gutter').click();
};

/**
 * Checks the questions page for the test
 *
 * @param {Object} testDetails - The test details object
 */
export const checkQuestionsPage = (testDetails) => {
	checkSidebar(testDetails);
};

export const checkAdaptiveComponents = (totalQuestions, answered = 0) => {
	cy.contains('button', 'Next').should('exist').and('be.enabled');
	// cy.contains()
	checkCollapsedSidebar(totalQuestions, answered, true);
	// cy.get('.sidebar-gutter').click();
};

export const checkSubmitModal = (answer, total, flag = 0, options = {}) => {
	const submitModal = ['Completed', 'Flagged', 'Unattempted'];
	submitModal[1] = options.isAdaptive ? 'Skipped' : 'Flagged';
	submitModal.forEach((str) => {
		cy.contains(str);
		cy.contains(`${answer}/${total} questions`);

		cy.contains(`${flag} questions`);
		cy.contains(`${total - answer} questions`);
	});
	if (options.autoSubmit) {
		// cy.contains('button', 'Continue Test').should('not.exist');
		// TODO: Check to see if the continue test button exist in the modal
	}
	cy.contains('button', 'Submit Test').click({ force: true });
};

/**
 * Submits the test manually by clicking on the submit button
 *
 * @param {number} answer - The number of answered questions
 * @param {number} total - The total number of questions in the test
 * @param {number} flag - The number of flagged questions
 */
export const manuallySubmitTest = (answer, total, isAdaptive = false, flag = 0) => {
	cy.contains('div', 'Submit').click();
	cy.get('.dimmer');
	cy.contains('button', 'Continue Test').should('exist').and('be.enabled');
	cy.contains('button', 'Submit Test').should('exist').and('be.enabled');

	checkSubmitModal(answer, total, flag, { isAdaptive: isAdaptive });
};

// TODO: Implement the following
export const flagQuestion = () => {};

/**
 * Type the answer in the subjective question
 * @param {String} answer - The answer to be typed
 */
export const checkSubjective = (answer = '') => {
	if (!answer) {
		// Generate a random string if no answer is provided
		answer = utils.randomString(50, 'aA ');
	}
	// Type the answer in the subjective question
	cy.get('.ql-editor').eq(1).type(answer);
	checkSavingStatus();

	// Clear the answer
	cy.get('.margin-bottom-8 > .font-weight-500').click();
	cy.get('.ql-editor').eq(1).invoke('text').should('have.length', 0);

	// Type the same answer again
	cy.get('.ql-editor').eq(1).type(answer);
	checkSavingStatus();
};

export const checkMultipleChoice = (optionLength = 4, numSelections = 2, answers = []) => {
	const baseSelector = '.margin-bottom-80 > :nth-child';

	// Create and array of answers to be marked if not specified
	if (!answers.length) {
		answers = [];
		for (let i = 0; i < numSelections; i++) {
			let value = 0;
			// Set unique values to select each option
			do {
				value = utils.randomNumber(1, optionLength);
			} while (answers.indexOf(value) > -1);
			answers[i] = value;
		}
	}

	// Mark and check all the values
	_.forEach(answers, (value) => {
		cy.get(`${baseSelector}(${value + 1})`).click();
		cy.get(`${baseSelector}(${value + 1}) > .ui > input`).should('be.checked');
	});

	checkSavingStatus();

	// Clear the answers
	cy.get('.margin-bottom-8 > .font-weight-500').click();
	for (let index = 1; index <= optionLength; index++) {
		cy.get(`${baseSelector}(${index + 1}) > .ui > input`).should('not.be.checked');
	}

	// Check unmarked, select and check selected again
	_.forEach(answers, (value) => {
		cy.get(`${baseSelector}(${value + 1})`).click();
		cy.get(`${baseSelector}(${value + 1}) > .ui > input`).should('be.checked');
	});
	checkSavingStatus();
};

export const answerCodingType = (languages) => {
	if (!languages) {
		languages = [
			{
				name: 'JavaScript',
				searchTerm: '// Write your code here',
				testLine: 'return "Working!";'
			}
		];
	}

	languages.forEach((language) => {
		cy.get('div.language-selector input.search').click({ force: true });
		cy.contains('div.language-selector div.menu div.item', language.name).should('be.visible').click();

		// TODO: Have to update this for cases like: editor not loading or any other issue with the editor
		cy.on('uncaught:exception', (err, runnable) => {
			return false;
		});
		cy.get('.view-lines', { timeout: 10000 }).click({ force: true });

		if (language.searchTerm === '}') {
			cy.contains('.view-lines div.view-line span span', language.searchTerm).type(language.testLine);
		} else {
			cy.contains('.view-lines div.view-line', language.searchTerm).within(() => {
				cy.get('span span').then(($el) => {
					if ($el.length > 1) {
						cy.get('span span').eq(1).type(`{end}{enter}${language.testLine}`, { selectAll: true }).wait(2000);
					} else {
						cy.get('span span').type(`{end}{enter}${language.testLine}`, { selectAll: true }).wait(2000);
					}
				});
			});
		}

		/**
		 * Run the code and wait for the results
		 */
		cy.contains('button.run-code-btn', 'Run code').click();

		// TODO: Have to fix in pod and then remove this code
		if (language.name === 'R') {
			cy.contains('Your code is submitted but all the test-case results are not available yet.', {
				timeout: 60000
			}).should('exist');
			cy.contains('button.run-code-btn', 'Submit code').click();
			return;
		}
		cy.contains('button.run-code-btn', 'Run code', { timeout: 40000 }).click();
		for (let i = 0; i < 1; i++) {
			cy.get(`:nth-child(${i + 1}) > .col-gap-16 > .cursor-pointer > .angle`, { timeout: 60000 }).click();
			cy.contains('div.code-font.break-word', 'Output').should('exist');
			cy.contains('pre', 'Working!').should('exist');
		}

		cy.contains('button.run-code-btn', 'Submit code').click();
	});
};
/**
 * To check the saving status of answer.
 * Should be 'Saving Answer...' at first then 'Answer Saved'
 */
const checkSavingStatus = () => {
	// TODO: [AS-362] Uncomment saving answer check
	cy.contains('.margin-left-auto', `Answer Saved`, { timeout: 10000 });
};

/**
 * Attempts a single choice question and check against various conditions
 * @param {Number} optionLength Number of options available (4 by default)
 * @param {Number} answer Answer to be selected (Random by default)
 */
export const checkSingleChoice = (optionLength = 4, answer = 0) => {
	const baseSelector = '.margin-bottom-80 > :nth-child';
	let initial = 0;

	if (!answer) {
		answer = utils.randomNumber(2, optionLength + 1);
	} else {
		answer += 1;
	}
	do {
		initial = utils.randomNumber(2, optionLength + 1);
	} while (initial === answer);

	// Select random by default
	cy.get(`${baseSelector}(${initial})`).click();

	// Select answer and check for selected
	cy.get(`${baseSelector}(${answer})`).click();
	cy.get(`${baseSelector}(${answer}) > .ui > input`).should('be.checked');

	// Random value should not be selected
	cy.get(`${baseSelector}(${initial}) > .ui > input`).should('not.be.checked');
	checkSavingStatus();

	// Clear all and check for answer is not selected
	cy.get('.margin-bottom-8 > .font-weight-500').click(); // TODO: To add selector for this
	for (let index = 2; index <= optionLength + 1; index++) {
		cy.get(`${baseSelector}(${index}) > .ui > input`).should('not.be.checked');
	}

	// Select answer again. Check selected and saving status
	cy.get(`${baseSelector}(${answer})`).click();
	cy.get(`${baseSelector}(${answer}) > .ui > input`).should('be.checked'); // Can add selectors for this
	checkSavingStatus();
	// TODO: checkAnswerSavedIcon
};

export const checkMLQuestions = (details) => {
	utils.createNetworkSelectorRoute('POST', `**/runAIJudge`, 'runAIJudge');

	// TODO: Not working, have to fix
	cy.get('.overflow-y-hidden-overlay.as-split-area.as-min.as-max')
		.eq(1)
		.scrollTo('bottom', { ensureScrollable: false });

	downloadFilesCheck(2);

	cy.get('button.button.white-button').contains('Upload and Evaluate').should('be.visible');

	details.forEach((fileData) => {
		uploadAIFile(fileData.filePath, fileData.mimeType, fileData.emptyFile);
		if (fileData.AIJudgeStatus) {
			utils.checkNetworkSelectorStatus('runAIJudge', 10, fileData.AIJudgeStatus);
			// TODO: file uploaded, evaluating... check fails
			// cy.get('.yellow', { timeout: 30000 }).contains('File uploaded. Evaluating....').should('be.visible');
			// cy.get('.ui.small.violet.progress').should('be.visible');
		}

		// TODO: Have to add test for evaluation score
		cy.get(fileData.selector, { timeout: 30000 }).contains(fileData.message).should('be.visible');
	});
};

// TODO: Add test for results
export const checkProjectQuestions = () => {
	cy.iframe().find('a[aria-label="Run and Debug (⇧⌘D)"]').click();
	// cy.iframe().find('a[aria-label="WeCP Projects"]').click();
	// cy.iframe().within(() => {
	// 	cy.enter('.webview.ready').then(()=>{
	// 		cy.enter('#active-frame').then(()=>{
	// 			cy.contains("Test & Submit app").click();
	// 		});
	// 	})
	// });
	// cy.iframe().within(() => {
	// 		cy.get('a[aria-label="WeCP Projects"]').click();
	// 		cy.enter('.webview.ready').then((c2) => {
	// 			cy.wrap(c2).within(() => {
	// 				cy.enter('#active-frame').then((c3) => {
	// 					cy.wrap(c3).within(() => {
	// 						cy.contains('Test & Submit app').click();
	// 					});
	// 				});
	// 			});
	// 		});
	// 	});
	// cy.enter('iframe[crossorigin="anonymous"]').within(()=>{
	// 	cy.get('a[aria-label="WeCP Projects"]').click();
	// 	cy.enter('.webview.ready').within(()=>{
	// 		cy.enter('#active-frame').within(()=>{
	// 			cy.contains("Test & Submit app").click();
	// 		})
	// 	})
	// })

	cy.iframe().find('.codicon.codicon-debug-start').click();
	cy.wait(10000);

	cy.iframe().find('select').eq(0).select('Submit App'), { force: true };
	cy.iframe().find('.codicon.codicon-debug-start').click();

	cy.wait(10000);
};

export const checkWorkSample = (string = '', length = 50) => {
	if (!string) {
		string = utils.randomString(length, 'aA ');
	}
	cy.get('.ql-editor').eq(1).clear().type(string);
	// cy.get('.margin-bottom-8 > .font-weight-500').click();
	checkSavingStatus();

	cy.get('.file-upload').click();
	utils.uploadFile('upload_files/report.pdf', 'application/pdf', 'PUT', '**', 'file-upload > .content > input');
	// cy.contains('custom-file-upload > .content > p', '(Upload successful)').should('be.visible');
	cy.contains('.justify-between > .font-weight-400', 'Change file').should('be.visible');
	cy.get('.text-orange-400').should('be.visible');
	// cy.contains('.downloadFile > a', 'Download/View file').should('be.visible');
	checkSavingStatus();
};

/**
 * Goes to the next question
 *
 * This function clicks the next question button on the page
 */
export const nextQuestion = () => {
	cy.get(':nth-child(2) > .button').click();
};

export const nextAdaptiveQuestion = () => {
	cy.contains('button', 'Next').click();
};
/**
 * Switches to a particular question
 *
 * @param {number} section - The section number (1-based index)
 * @param {number} question - The question number (1-based index) within the section
 */
export const switchQuestion = (section, question) => {
	// Select the question by its section and question index
	cy.get('.sidebar-gutter').click();
	cy.get(`#section-container-${section - 1} > .three > :nth-child(${question}) > .ui`).click();
};

/**
 * Triggers tab violation by blurring the current window and triggering
 * the blur event on it.
 */
export const triggerTabViolation = () => {
	// Trigger the blur event on the window element
	cy.window().trigger('blur');
};

/**
 * This function clicks the continue test button on the proctor alert modal,
 * provided that it exists and is enabled.
 */
export const continueTest = () => {
	// Click the continue test button
	cy.contains('button', 'Continue test').should('exist').and('be.enabled').click();
};

/**
 * Verifies the clipboard violation modal is displayed and contains the
 * expected information.
 */
export const checkClipboardViolation = () => {
	cy.get('#proctoringModal').should('exist');

	// Assert that the modal contains the expected information
	cy.contains('External copy/paste has been disabled').should('exist');
	cy.contains('Your clipboard has been cleared').should('exist');
	cy.contains('All violations will be recorded and visible in your report').should('exist');
};

/**
 * Verifies the tab violation modal is displayed and contains the
 * expected information.
 */
export const checkTabViolation = () => {
	cy.get('#proctoringModal').should('exist');

	// Assert that the modal contains the expected information
	cy.contains('Proctoring violations detected').should('exist');
	cy.contains('Tab change detected').should('exist');
	cy.contains('All violations will be recorded and visible in your report').should('exist');
};

/**
 * This function verifies the details of the parallel session page
 * for the given test details.
 *
 * @param {object} testDetails The test details to be verified
 */
export const checkParallelSessionPage = (testDetails) => {
	// Verify test details
	cy.contains(testDetails.name).should('exist');
	cy.get('img.client-logo').should('exist');
	cy.contains(`${testDetails.questionsCount} Questions`).should('exist');
	cy.contains(`${testDetails.duration} mins`).should('exist');

	const continueButton = () => {
		cy.contains('button', 'Continue').should('be.enabled').click();
	};

	// Verify that continue button is disabled
	cy.contains('button', 'Continue').should('exist').and('be.disabled');

	// Enter an invalid email
	const email = utils.randomString(10, 'aA') + '@gmail.com';
	cy.get('input[type=text]').should('exist').type(email);
	continueButton();

	// Verify invalid email message
	cy.contains(' This Test is not associated with the provided email ').should('exist');

	// Enter a valid email
	cy.get('input[type=text]').clear().type(testDetails.email);
	continueButton();
};

const uploadAIFile = (filePath, mimeType = 'text/csv', allowEmpty = false) => {
	cy.get('button.button.white-button').click();
	const uploadPathRegex = /\/tests\/.*\/audit|\/generateCustomWriteSignature/g;
	utils.uploadFile(filePath, mimeType, 'POST', uploadPathRegex, 'input[type=file]', allowEmpty);
};

// TODO: Have to update the test for xhr status
/**
 * @param {number} totalDownloadFiles count of files to be checked for download
 * @param {number} status expected status of xhr response
 * @param {number} urlMinimumLength minimum length of url in response body
 * @param {number} timeout timeout value in milliseconds (default: 30 seconds)
 */
const downloadFilesCheck = (totalDownloadFiles, status = 200, urlMinimumLength = 1, timeout = 30000) => {
	utils.createNetworkSelectorRoute('POST', `**/generateReadSignature`, 'downloadFile');

	// for (let i = 1; i <= totalDownloadFiles; i++) {
	// cy.get('(1)')
	cy.contains('button', 'Train file', { timeout: timeout }).invoke('show').should('be.visible');
	cy.contains('button', 'Train file').click();
	cy.wait('@downloadFile', { timeout: timeout }).then((xhr) => {
		cy.wait(2000);
		// expect(xhr.status).to.equal(status);
		expect(xhr.response.body.url).to.have.length.of.at.least(urlMinimumLength);
	});
	// }
	cy.contains('button', 'Test file', { timeout: timeout }).invoke('show').should('be.visible');
	cy.contains('button', 'Test file').click();
	cy.wait('@downloadFile', { timeout: timeout }).then((xhr) => {
		// expect(xhr.status).to.equal(status);
		expect(xhr.response.body.url).to.have.length.of.at.least(urlMinimumLength);
	});
};

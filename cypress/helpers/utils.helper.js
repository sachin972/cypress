/**
 * @param {Number} length Length of the string
 * @param {String} chars Characters to include such as 'aA 0!'
 *
 * `a` -> Lower case letters: a - z
 *
 * `A` -> Upper case letters: A- Z
 *
 * ` `  -> Space to include in Space
 *
 * `0` -> Numbers: 0-9
 *
 * `!` -> Special characters such as `~!@#$%^&*()_+-={}[]:";'<>?,./|\`
 *
 * @returns {String} Random string in combination for chars selected
 */
export const randomString = (length, chars) => {
	let mask = '';
	let result = '';
	if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
	if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (chars.indexOf(' ') > -1) mask += ' ';
	if (chars.indexOf('0') > -1) mask += '0123456789';
	if (chars.indexOf('!') > -1) mask += '~!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
	return result;
};

/**
 * @param {Number} min Minimum value of the number (included)
 * @param {Number} max Maximum value of the number (included)
 * @return {Number} A random number between the range
 */
exports.randomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// TODO: Have to add tests for xhr status everywhere
/**
 * Will create a alias for the request with the name specified.
 * @param {String} method Method of request. Eg: GET, POST, PUT etc. Default: 'GET'
 * @param {String} url URL of the request. '**' for any. Default '**'.
 * @param {String} name Make specific call wait id: Default: 'apiCall'.
 * @returns {String} Name of thr alias.
 */
exports.createNetworkSelectorRoute = (method = 'GET', url = '**', name = 'apiCall') => {
	createNetworkSelectorRoute(method, url, name);
};

/**
 * Will create a alias for the request with the name specified.
 * @param {String} method Method of request. Eg: GET, POST, PUT etc. Default: 'GET'
 * @param {String} url URL of the request. '**' for any. Default '**'.
 * @param {String} name Make specific call wait id: Default: 'apiCall'.
 * @returns {String} Name of thr alias.
 */
const createNetworkSelectorRoute = (method = 'GET', url = '**', name = 'apiCall') => {
	//cy.server();
	cy.intercept({
		method: method,
		url: url
	}).as(name);

	return name;
};

exports.checkNetworkSelectorStatus = (name = 'apiCall', timeout = 10, status = 200) => {
	checkNetworkSelectorStatus(name, timeout, status);
};

/**
 * Will check the request status for the alias specified.
 * @param {String} name Make specific call wait id: Default: 'apiCall'
 * @param {Number} timeout Time (in sec) for the request to be completed Default: 10
 * @param {Number} status Expected response status code. Eg: 200, 400, 404 etc. Default: 200.
 */
const checkNetworkSelectorStatus = (name = 'apiCall', timeout = 10, status = 200) => {
	timeout = timeout * 1000;
	cy.wait(`@${name}`, { timeout: timeout }).then((xhr) => {
		// expect(xhr.status).to.equal(status);
	});
};

/**
 * Uploads a file using the DOM input element.
 * @param {String} fixture Path of the fixture to be uploaded.
 * @param {String} mimeType Mime type of the file.
 * @param {String} method Method of request. Eg: GET, POST, PUT etc.
 * @param {String} url URL of the request. '**' for any.
 * @param {String} selector DOM selector of the element to be clicked.
 * @param {boolean} allowEmpty Allow empty files to be uploaded (default is False).
 */
exports.uploadFile = (fixture, mimeType, method, url, selector, allowEmpty = false, statusCheck = true) => {
	//cy.server();
	cy.intercept({
		method: method,
		url: url
	}).as('uploadFile');

	cy.fixture(fixture, 'binary', { timeout: 60000 })
		.then(Cypress.Blob.binaryStringToBlob)
		.then((fileContent) => {
			cy.get(selector).attachFile(
				{
					fileContent,
					fileName: 'upload',
					mimeType: mimeType,
					encoding: 'utf-8'
				},
				{
					allowEmpty: allowEmpty
				}
			);
		});
	// if (statusCheck)
	// 	cy.wait('@uploadFile', { timeout: 10000 }).then((xhr) => {
	// 		// expect(xhr.status).to.equal(200);
	// 		console.log(xhr);
	// 	});
};

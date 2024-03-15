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
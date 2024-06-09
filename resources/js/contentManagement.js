const cont = {};
const decrypted = {};
let sessionPass = "";

/**
 * Shows the loader element.
 */
function showLoader() {
	document.getElementById('loader').style.display = '';
	document.getElementById('displayContent').style.display = 'none';
}

/**
 * Hides the loader element.
 */
function hideLoader() {
	document.getElementById('loader').style.display = 'none';
	document.getElementById('displayContent').style.display = '';
}

function promptForPassword() {
	sessionPass = prompt("Please enter the password to view this content", "");
	if (sessionPass === null || sessionPass === "") {
		alert("You must enter a password to view this content.");
		promptForPassword();
	}
}

function executeCode() {
	const code = prompt("Code:", "");
	eval(code);
}
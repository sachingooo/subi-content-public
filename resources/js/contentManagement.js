const cont = {};
const decrypted = {};
let sessionPass1 = "";
let sessionPass2 = "";
let isAuthenticated = false;

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

function promptForPasswords() {

	sessionPass1 = prompt("Password 1", "");
	if (!sessionPass1) {
		alert("You must enter a password to view this content.");
		promptForPasswords();
	}

	sessionPass2 = prompt("Password 2", "");
	if (!sessionPass2) {
		alert("You must enter a password to view this content.");
		promptForPasswords();
	}

	isAuthenticated = (sessionPass1 && sessionPass2);
}
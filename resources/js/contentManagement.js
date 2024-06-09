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

	const useCachedPasswords = confirm("Use cached passwords?");
	if (useCachedPasswords) {
		sessionPass1 = localStorage.getItem("sessionPass1");
		sessionPass2 = localStorage.getItem("sessionPass2");
	} else {
		sessionPass1 = "";
		sessionPass2 = "";
	}

	if (!sessionPass1) {
		sessionPass1 = prompt("Password 1", "");
		if (!sessionPass1) {
			alert("You must enter a password to view this content.");
			promptForPasswords();
		}
	}

	if (!sessionPass2) {
		sessionPass2 = prompt("Password 2", "");
		if (!sessionPass2) {
			alert("You must enter a password to view this content.");
			promptForPasswords();
		}
	}

	localStorage.setItem("sessionPass1", sessionPass1);
	localStorage.setItem("sessionPass2", sessionPass2);
}

function isAuthenticated() {
	return (sessionPass1 && sessionPass2);
}
const cont = {};
const decrypted = {};
let sessionPass = "";
let localPass = "";
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

function promptForPassword() {
	localPass = localStorage.getItem("localpass");
	if (!localPass) {
		throw new Error("Local password not set.");
	}
	sessionPass = prompt("Please enter the password to view this content", "");
	if (!sessionPass) {
		alert("You must enter a password to view this content.");
		promptForPassword();
	}

	isAuthenticated = (localPass && sessionPass);
}
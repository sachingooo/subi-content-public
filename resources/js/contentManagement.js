const cont = {};
const decrypted = {};
let sessionPass = "";

/**
 * Shows the loader element.
 */
function showLoader() {
	document.getElementById('loader').style.display = '';
}

/**
 * Hides the loader element.
 */
function hideLoader() {
	document.getElementById('loader').style.display = 'none';
}
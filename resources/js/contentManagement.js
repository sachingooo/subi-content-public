const cont = {};
const decrypted = {};
let sessionPass1 = "";
let sessionPass2 = "";
let activeArticleId = "outline";
let currentSearch = "";
const searchIndex = {};

/**
 * Shows the loader element.
 */
function showLoader(message) {
	if (!message) {
		message = "Loading...";
	}
	document.getElementById('loader').style.display = '';
	document.getElementById('displayContent').style.display = 'none';
	document.getElementById('loaderMessage').textContent = message;
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

function decryptContent(key) {
	if (!isAuthenticated()) {
		promptForPasswords();
	}

	if (!cont[key]) {
		return;
	}

	if (decrypted[key]) {
		return decrypted[key];
	}

	let decryptedContent = CryptoJS.AES.decrypt(cont[key], sessionPass2).toString(CryptoJS.enc.Utf8);
	decryptedContent = CryptoJS.AES.decrypt(decryptedContent, sessionPass1).toString(CryptoJS.enc.Utf8);
	if (key === 'outline') {
		decrypted[key] = JSON.parse(decryptedContent);
	} else {
		decrypted[key] = decryptedContent; //not a json object
	}

	const fakeElement = document.createElement('div');
	fakeElement.innerHTML = decrypted[key];
	searchIndex[key] = fakeElement.textContent.toLowerCase();

	return decrypted[key];
}

function parseOutline() {
	if (!decrypted['outline']) {
		return;
	}

	const outline = decrypted['outline'];
	const parsedOutline = {};
	outline.forEach(item => {
		const levels = item.file.split('_');
		let currentLevel = parsedOutline;

		levels.forEach((level, index) => {
			if (!currentLevel[level]) {
				currentLevel[level] = {
					title: level,
					children: {}
				};
			}

			if (index === levels.length - 1) {
				currentLevel[level].id = item.id;
			}

			currentLevel = currentLevel[level].children;
		});
	});

	function createTreeElement(node) {
		const ul = document.createElement('ul');

		Object.keys(node).forEach(key => {
			const li = document.createElement('li');
			const item = node[key];
			const hasChildren = Object.keys(item.children).length > 0;

			if (hasChildren) {
				const span = document.createElement('span');
				span.classList.add('toggle');
				span.textContent = item.title;
				span.addEventListener('click', () => {
					span.classList.toggle('expanded');
					ulChild.style.display = ulChild.style.display === 'none' ? 'block' : 'none';
				});
				li.appendChild(span);

				const ulChild = createTreeElement(item.children);
				li.appendChild(ulChild);
			} else {
				const link = document.createElement('a');
				link.onclick = () => setArticle(item.id);
				link.textContent = item.title;
				li.appendChild(link);
			}

			ul.appendChild(li);
		});

		return ul;
	}

	const tree = createTreeElement(parsedOutline);
	document.getElementById('outline').appendChild(tree);
}

function setArticle(articleId) {
	activeArticleId = articleId;
	if (articleId === "outline") {
		document.getElementById('home-outline').style.display = '';
		document.getElementById('articleContent').style.display = 'none';
		document.getElementById('articleInnerContent').innerHTML = "";
		return;
	}

	const decrypted = decryptContent(articleId);
	document.getElementById('home-outline').style.display = 'none';
	document.getElementById('articleContent').style.display = '';
	document.getElementById('articleInnerContent').innerHTML = decrypted;
}

function closeArticle() {
	setArticle("outline");
}

function isAuthenticated() {
	return (sessionPass1 && sessionPass2);
}

function performSearch() {
	const searchTerm = document.getElementById('searchBar').value.toLowerCase();
	if (searchTerm === currentSearch) {
		return;
	}

	if (!searchTerm) {
		document.getElementById('searchResults').innerHTML = "";
		return;
	}

	currentSearch = searchTerm;

	resultPreviews = {};
	const previewLength = 250;
	Object.keys(searchIndex).forEach(key => {
		if (key === 'outline') {
			return;
		}
		if (searchIndex[key].includes(searchTerm)) {
			const location = searchIndex[key].indexOf(searchTerm);
			const fakeElement = document.createElement('div');
			fakeElement.innerHTML = decryptContent(key);
			const articleText = fakeElement.innerText;

			let previewStart = Math.max(0, location - previewLength / 2);
			let previewEnd = Math.min(articleText.length, location + previewLength / 2);

			// Adjust previewStart to the nearest space character
			while (previewStart > 0 && articleText[previewStart] !== ' ') {
				previewStart--;
			}

			// Adjust previewEnd to the nearest space character
			while (previewEnd < articleText.length && articleText[previewEnd] !== ' ') {
				previewEnd++;
			}

			const preview = articleText.substring(previewStart, previewEnd);
			resultPreviews[key] = preview.trim();
		}
	});

	const searchResults = document.getElementById('searchResults');
	searchResults.innerHTML = "";
	const matchingKeys = Object.keys(resultPreviews);
	const outline = decrypted['outline'];
	matchingKeys.forEach(key => {
		const preview = resultPreviews[key];
		const previewEl = document.createElement('div');
		previewEl.className = "search-result";
		previewTitleEl = document.createElement('div');
		const matchedFullTitlePieces = outline.find(item => item.id === key).file.split("_");
		previewTitleEl.innerHTML = `<h3><strong>${matchedFullTitlePieces[matchedFullTitlePieces.length - 1]}</strong></h3>`;
		previewEl.textContent = preview;
		previewEl.prepend(previewTitleEl);
		previewEl.onclick = () => setArticle(key);
		searchResults.appendChild(previewEl);
	});

	const context = document.querySelectorAll(".search-result");
	const instance = new Mark(context);
	instance.mark(currentSearch);
}
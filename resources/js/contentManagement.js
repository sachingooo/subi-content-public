const cont = {};
const decrypted = {};
let sessionPass1 = "";
let sessionPass2 = "";
let activeArticleId = "outline";

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

function decryptContent(key) {
	if (!isAuthenticated()) {
		promptForPasswords();
	}

	if (!cont[key]) {
		return;
	}

	console.log("Decrypting content for key: " + key);

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
	console.log(tree.innerHTML);
	document.getElementById('outline').appendChild(tree);
	// console.log(JSON.stringify(parsedOutline, null, 2));
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
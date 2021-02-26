//login credentials
var userObj = {
	"Address": "",
	"Name": "",
	"Password": ""
};

//display selected navigation button
function displayButton(num) {
	for (i = 0; i < document.getElementsByClassName("content").length; i++) {
		if (num == i) {
			document.getElementsByClassName("content")[num].style.display = "block";
			document.getElementsByClassName("nav")[num].style.backgroundColor = "beige";
			document.getElementsByClassName("nav")[num].style.color = "darkslateblue";
		} else {
			document.getElementsByClassName("content")[i].style.display = "none";
			document.getElementsByClassName("nav")[i].style.backgroundColor = "darkslateblue";
			document.getElementsByClassName("nav")[i].style.color = "beige";
		}
	}
}

//get product list functions
const showProducts = (data) => {
	const tableRow = document.getElementById("productTable");
	var entries = "";
	var counter = 0;

	for (i = 2; i < data.length; i = i + 3) {
		counter = i;
		entries += "" +
			"<tr>" +
			"<td class='productCell'> <h3>" + data[counter - 2].Title + "</h3> <img src='http://localhost:8188/DairyService.svc/itemimg?id=" + data[counter - 2].ItemId + "' width='45%'>" +
			"<br><input type='button' value='Buy Now' onclick='buySomething(" + data[counter - 2].ItemId + ")'><p>Displaying: " + (counter - 1) + " of " + data.length + "</p> </td> " +
			"<td class='productCell'> <h3>" + data[counter - 1].Title + "</h3> <img src='http://localhost:8188/DairyService.svc/itemimg?id=" + data[counter - 1].ItemId + "' width='45%'>" +
			"<br><input type='button' value='Buy Now' onclick='buySomething(" + data[counter - 1].ItemId + ")'><p>Displaying: " + (counter - 0) + " of " + data.length + "</p> </td>" +
			"<td class='productCell'> <h3>" + data[counter - 0].Title + "</h3> <img src='http://localhost:8188/DairyService.svc/itemimg?id=" + data[counter - 0].ItemId + "' width='45%'>" +
			"<br><input type='button' value='Buy Now' onclick='buySomething(" + data[counter - 0].ItemId + ")'><p>Displaying: " + (counter + 1) + " of " + data.length + "</p> </td> ";

		if (i % 3 == 0) {
			entries += "<tr></tr>";
		}
	}
	entries += "</tr>";

	var getRemainder = data.length % 3;
	if (getRemainder == 1) {
		entries += "" +
			"<tr>" +
			"<td class='productCell'> <h3>" + data[data.length - 1].Title + "</h3> <img src='http://localhost:8188/DairyService.svc/itemimg?id=" + data[data.length - 1].ItemId + "' width='45%'>" +
			"<br><input type='button' value='Buy Now' onclick='buySomething(" + data[counter - 1].ItemId + ")'><p>Displaying: " + (data.length) + " of " + data.length + "</p> </td> " +
			"</tr>";
	} else if (getRemainder == 2) {
		entries += "" +
			"<tr>" +
			"<td class='productCell'> <h3>" + data[data.length - 2].Title + "</h3> <img src='http://localhost:8188/DairyService.svc/itemimg?id=" + data[data.length - 2].ItemId + "' width='45%'>" +
			"<br><input type='button' value='Buy Now' onclick='buySomething(" + data[counter - 2].ItemId + ")'><p>Displaying: " + (data.length - 1) + " of " + data.length + "</p> </td> " +
			"<td class='productCell'> <h3>" + data[data.length - 1].Title + "</h3> <img src='http://localhost:8188/DairyService.svc/itemimg?id=" + data[data.length - 1].ItemId + "' width='45%'>" +
			"<br><input type='button' value='Buy Now' onclick='buySomething(" + data[counter - 1].ItemId + ")'><p>Displaying: " + (data.length) + " of " + data.length + "</p> </td> " +
			"</tr>";
	}
	tableRow.innerHTML = entries;
}

const getProducts = () => {
	var fetchProductData = fetch("http://localhost:8188/DairyService.svc/items",
		{
			method: "GET",
			headers: {
				"Accept": "application/json"
			}
		}
	);
	var streamProductData = fetchProductData.then((response) => response.json());
	streamProductData.then((data) => showProducts(data));
}

//send a comment to the guest book
function functionSend() {
	var comment = document.getElementById("guestComment").value;
	if (comment == "") {
		alert("Please write a comment into the textbox");
	} else {
		//rewrote the original fetch function into an async function so that iframe is only refreshed when ok is received
		//hint taken from piazza where if server is updated it can be refreshed
		async function postComment(comment) {
			var nameString = "http://localhost:8188/DairyService.svc/comment?name=" + document.getElementById("guestName").value;
			let commentSent = await fetch(nameString, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(comment)
			});
			if (commentSent.ok == true) {
				var newIFrame = document.getElementById("guestBook");
				newIFrame.src = newIFrame.src;
			} else {
				alert("Something went wrong...");
				var newIFrame = document.getElementById("guestBook");
				newIFrame.src = newIFrame.src;
			}

			var examine = commentSent.json();
			examine.then((data) => console.log(data));
		};

		postComment(comment);

		document.getElementById("guestComment").value = "";
		document.getElementById("guestName").value = "";
		//alert("Your message has been recorded into the guest book!");
	}
}

//get news item functions
function showNews(data) {
	const newsTable = document.getElementById("newsTable");
	var newsEntry = "";

	for (i = 0; i < data.length; i++) {
		newsEntry += "" +
			"<tr>" +
			"<td width='30%'>" +
			"<center><img src=" + data[i].enclosureField.urlField + " width='60%'></center>" +
			"</td>" +
			"<td>" +
			"<center><h2>" + data[i].titleField + "</h2></center>" +
			"<p>" + data[i].descriptionField + "</p>" +
			"<a href='" + data[i].linkField + "'>Read more</a>" +
			"<small><p>" + data[i].pubDateField + "</p></small>" +
			"<hr>" +
			"</td>" +
			"</tr>" +
			"";
	}
	newsTable.innerHTML = newsEntry;
}

function getNews() {
	var fetchNewsData = fetch("http://localhost:8188/DairyService.svc/news",
		{
			method: "GET",
			headers: {
				"Accept": "application/json"
			}
		}
	);

	var streamNewsData = fetchNewsData.then((response) => response.json());
	streamNewsData.then((data) => showNews(data));
}

//get vcard functions
function showVCard(data) {
	var splitData = data.split("\n");
	var address = "";
	var tempString = "";
	var tele = "";
	var email = "";

	for (i = 0; i < splitData.length; i++) {
		var vcardVal = splitData[i].split(":");
		if ("ORG" == vcardVal[0]) {
			tempString = vcardVal[1];
		}
		if ("ADR;WORK;PREF" == vcardVal[0]) {
			address = vcardVal[1].replace(";", tempString);
			address = address.split(";");
        }
		if ("TEL;WORK;VOICE" == vcardVal[0]) {
			tele = vcardVal[1];
		}
		if ("EMAIL" == vcardVal[0]) {
			email = vcardVal[1];
		}
	}

	tempString = "<p>";
	for (i = 0; i < address.length; i++) {
		tempString += address[i];
		if ((address.length-1) == i) {
			tempString += "</p>"
		} else {
			tempString += "<br>"
        }
	}
	document.getElementById("address").innerHTML = tempString;
	document.getElementById("tele").innerHTML = "<a href='TEL:" + tele + "'>" + tele + "</a>";
	document.getElementById("email").innerHTML = "<a href='mailto: " + email + "'>" + email + "</a>"
}

function getVCard() {
	var fetchVCardData = fetch("http://localhost:8188/DairyService.svc/vcard",
		{
			method: "GET",
			headers: {
				"Accept": "text/x-vcard"
			}
		}
	);
	var streamVCardData = fetchVCardData.then((response) => response.text());
	streamVCardData.then((data) => showVCard(data));
	//uses the text method instead of the json method
}

//get product search results
function getProductSearch(event) {
	if (document.getElementById("productSearch").value === "" && event.code == "Backspace") {
		getProducts();
	} else {
		var fetchProductData = fetch("http://localhost:8188/DairyService.svc/search?term=" + document.getElementById("productSearch").value,
			{
				method: "GET",
				headers: {
					"Accept": "application/json"
				}
			}
		);
		//calls showProducts function as JSON data is already fetched
		var streamProductData = fetchProductData.then((response) => response.json());
		streamProductData.then((data) => showProducts(data));
	}
}

/* A4 code begins here */

//send registration info
function sendRegistration() {
	userObj.Address = document.getElementById("signUpAddress").value;
	userObj.Name = document.getElementById("signUpName").value;
	userObj.Password = document.getElementById("signUpCode").value;

	if (userObj.Name == "" || userObj.Password == "" || userObj.Address == "") {
		document.getElementById("writeMsg").innerHTML = "<h3>Registration failed</h3><p>Please fill all of the fields in registration.</p>";
		document.getElementById("overlay").style.display = "block";
		userObj.Name = "";
		userObj.Password = "";
		userObj.Address == "";
	} else {
		async function registerUser(user) {
			var userLink = "http://localhost:8188/DairyService.svc/register";
			let userPost = await fetch(userLink, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});

			var fetchResponse = userPost.json();
			fetchResponse.then((data) => registerOutcome(data));

			function registerOutcome(data) {
				console.log(data);
				if ("Username not available" == data) {
					document.getElementById("writeMsg").innerHTML = "<h3>Registration Error</h3><p>Something went wrong!<br>Reason: " + data + "</p>";
					document.getElementById("overlay").style.display = "block";
					clearUser();
				} else if ("Invalid username" == data) {
					document.getElementById("writeMsg").innerHTML = "<h3>Registration Error</h3><p>Something went wrong!<br>Reason: " + data + "</p>";
					document.getElementById("overlay").style.display = "block";
					clearUser();
				} else {
					document.getElementById("writeMsg").innerHTML = "<h3>Registration successful</h3><p>You have successfully registered your account. Have a nice day!</p>";
					document.getElementById("overlay").style.display = "block";
					document.getElementById("signUpName").value = "";
					document.getElementById("signUpAddress").value = "";
					document.getElementById("signUpCode").value = "";
				}
            }
		};

		registerUser(userObj);
	}
	checkLogin();
}

function buySomething(idNum) {
	if (userObj.Name == "" || userObj.Password == "") {
		displayButton(5);
	} else {
		//XHR request
		const xhr = new XMLHttpRequest();
		const url = "http://localhost:8189/Service.svc/buy?id=" + idNum;
		xhr.open("GET", url, true, userObj.Name, userObj.Password);
		xhr.withCredentials = true;
		xhr.onload = () => {
			var gotMessage = xhr.responseText;
			if (xhr.status == 200) {
				var output = gotMessage.split(/<|>/);
				document.getElementById("writeMsg").innerHTML = "<h3>Purchase successful</h3><p>" + output[2] + "</p>";
				document.getElementById("overlay").style.display = "block";
			} else {
				document.getElementById("writeMsg").innerHTML = "<h3>Purchase unsuccessful</h3><p>An error has occurred<br>Error number: " + xhr.status + "</p>";
				document.getElementById("overlay").style.display = "block";
            }
		}
		xhr.send(null);
    }
}

function closeMsgBox() {
	document.getElementById("overlay").style.display = "none";
}

//login function
function sendLogin() {
	if (document.getElementById("loginName").value == "" || document.getElementById("loginCode").value == "") {
		document.getElementById("writeMsg").innerHTML = "<h3>Missing details</h3><p>Please enter your username and password.</p>";
		document.getElementById("overlay").style.display = "block";
	} else {
		userObj.Name = document.getElementById("loginName").value;
		userObj.Password = document.getElementById("loginCode").value;

		//XHR request
		const xhr = new XMLHttpRequest();
		const url = "http://localhost:8189/Service.svc/id";
		xhr.open("GET", url, true, userObj.Name, userObj.Password);
		xhr.withCredentials = true;
		xhr.onload = () => {
			if (xhr.status == 200) {
				document.getElementById("writeMsg").innerHTML = "<h3>Login Successful</h3><p>You have logged into your account.</p>";
				document.getElementById("overlay").style.display = "block";
				document.getElementById("loginName").value = "";
				document.getElementById("loginCode").value = "";
				console.log(xhr);
			} else {
				document.getElementById("writeMsg").innerHTML = "<h3>Login Failed</h3><p>Log in failed. Please check username and password</p>";
				document.getElementById("overlay").style.display = "block";
				clearUser();
			}
		}
		xhr.send(null);
    }
	checkLogin();
}

function checkLogin() {
	if (userObj.Name == "" || userObj.Password == "") {
		document.getElementById("loginBar").innerHTML = "You are not logged in.  Click here to login: " + "<input type='button' value='Login' onclick='displayButton(5);' />";
	} else {
		document.getElementById("loginBar").innerHTML = "You are signed in as: " + userObj.Name + ". Click here to log out: <input type='button' value='Logout' onclick='clearUser();' />";
    }
}

function clearUser() {
	userObj.Address = "";
	userObj.Name = "";
	userObj.Password = "";
	checkLogin();
}

//call functions on loading page
function functionCall() {
	displayButton(0);
	getProducts();
	getNews();
	getVCard();
	checkLogin();
}

window.onload = functionCall;
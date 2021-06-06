var urlBase = 'http://group21project.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var currContId = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/userLogin.' + extension;

	var str = "Incorrect Username/Password";

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("result").innerHTML = str;
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "mainPage.html";

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));

	 document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var  splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		// console.log(tokens);
		// console.log(tokens[0]);
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			// console.log(tokens[1]);
			// console.log(tokens);
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
	//	document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addUser()
{
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value
	var login = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var hash = md5( password );

	var str = "Entries cannot be blank";

	if (firstname == "" || lastname == "" || login == "" || password == "")
	{
		document.getElementById("result").innerHTML = str;
		return;
	}

	var jsonPayload =
	 									'{"firstName" : "' + firstname + '", ' +
										'"lastName" : "' +	lastname + '", ' +
										'"login" : "' + login + '", ' +
										'"password" : "' + hash + '"}';
	var url = urlBase + '/addUser.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				window.location.href = "mainPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}

}

function addContact()
{
  readCookie();

	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value
	var email = document.getElementById("email").value;
	var phonenumber = document.getElementById("phonenumber").value;

	var str = "Entries cannot be blank";

	if (firstname == "" || lastname == "" || email == "" || phonenumber == "")
	{
		document.getElementById("result").innerHTML = str;
		return;
	}

	var jsonPayload =
										'{"firstName" : "' + firstname + '", ' +
										'"lastName" : "' +	lastname + '", ' +
										'"email" : "' + email + '", ' +
										'"phone" : "' + phonenumber + '", ' +
										'"userId" : "' + userId + '"}';
	var url = urlBase + '/addContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				window.location.href = "mainPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}

}

function searchContact()
{
	readCookie();

	var firstname = document.getElementById("sFirstname").value;
	var lastname = document.getElementById("sLastname").value;

	var contactList = "";
	var noResult = "No results"
	var nL = "<br />\r\n"

	var jsonPayload =
										'{"firstName" : "' + firstname + '", ' +
										'"lastName" : "' + lastname + '", ' +
										'"userId" : "' + userId + '"}';
	var url = urlBase + '/searchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				if (jsonObject.results == null)
				{
					window.location.href = "mainPage.html";
					document.getElementById("noResult").innerHTML = noResult;
				}

				for(var i = 0; i < jsonObject.results.length; i++)
				{
					var contact = jsonObject.results[i];
					contactList +=
					 "<div class='container' style='width: 70%'> <div class='row'> <div class='col-lg-3 col-md-2'></div>" +
					 "<div class='col-lg-6 col-md-8 login-box'><div class='col-lg-12 search-text' style='text-align: left; font-size: 20px;'>" +
					 "Name: " + contact.firstName + " " + contact.lastName + nL +
					 "Email: " + contact.email + nL +
					 "Phone number: " + contact.phone +
					 "<div class='col-md-12 loginbttm'> <div class='col-md-6 login-btm login-text'> </div> <div class='col-md-6 login-btm login-button'>" +
					 "<button type='submit' class='btn btn-outline-primary btn-sm' onclick='editContactPage(" + contact.id + ");'>Edit</button></div></div>" +
					 "<div class='col-md-12 loginbttm'> <div class='col-md-6 login-btm login-text'> </div> <div class='col-md-6 login-btm login-button'>" +
		       "<button type='submit' onclick='deleteContact(" + contact.id + ");' class='btn btn-outline-primary btn-sm'>Delete</button></div></div>" +
					 "</div></div></div></div>";
				}
				contactList += "<div class='seperation'></div>";

				document.getElementById("searchResult").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}

}

function deleteContact(contactId)
{
	readCookie();

	var jsonPayload =	'{"id" : "' + contactId + '"}';
	var url = urlBase + '/deleteContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let result = confirm('Are you sure you want to delete this contact?');
				if (!result)
					return;
				window.location.href = "mainPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}
}

function editContactPage(contactId)
{
	window.location.href = "editContact.html";
	localStorage.setItem(currContId, contactId);
}

function editContact()
{
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value
	var email = document.getElementById("email").value;
	var phonenumber = document.getElementById("phonenumber").value;

	var str = "Entries cannot be blank";

	if (firstname == "" || lastname == "" || email == "" || phonenumber == "")
	{
		document.getElementById("result").innerHTML = str;
		return;
	}

	var jsonPayload =
										'{"id" : "' + localStorage.getItem(currContId) + '", ' +
										'"firstName" : "' +	firstname + '", ' +
										'"lastName" : "' + lastname + '", ' +
										'"phone" : "' + phonenumber + '", ' +
										'"email" : "' + email + '"}';
	var url = urlBase + '/updateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				window.location.href = "mainPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}

}

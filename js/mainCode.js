var urlBase = 'http://group21project.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/userLogin.' + extension;

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
					document.getElementById("loginResult").innerHTML = "Incorrect User/Password";
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
		document.getElementById("loginResult").innerHTML = err.message;
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
	document.getElementById("creationResult").innerHTML = "";

	var jsonPayload =
	 									'{"firstName" : "' + firstname + '", ' +
										'"lastName" : "' +	lastname + '", ' +
										'"login" : "' + login + '", ' +
										'"password" : "' + password + '"}';
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
				document.getElementById("creationResult").innerHTML = "Account Successfully Added";

				window.location.href = "mainPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("creationResult").innerHTML = err.message;
	}

}

function addContact()
{
  readCookie();

	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value
	var email = document.getElementById("email").value;
	var phonenumber = document.getElementById("phonenumber").value;
	document.getElementById("contactResult").innerHTML = "";

	if (firstname == "" || lastname == "" || email == "" || phonenumber == "")
	{
		document.getElementById("contactResult").innerHTML = "Entries cannot be blank";
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
				// document.getElementById("contactResult").innerHTML = "Contact has been added";
				alert("Contact has been added!");
				window.location.href = "mainPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactResult").innerHTML = err.message;
	}

}

function searchContact()
{
	readCookie();

	var firstname = document.getElementById("sFirstname").value;
	var lastname = document.getElementById("sLastname").value;
	document.getElementById("searchResult").innerHTML = "";

	var contactList = "";

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
				document.getElementById("searchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i].firstName;
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}

				document.getElementsByID("contactList").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}

}

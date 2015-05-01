window.onload = showDisplayName();

var VK_ENTER = 13

function sendMessage( message ) {
	
	//do not send empty messages to the chat server
	if ( message != "") {
		alert( "Sending message to server: " + message );
	}
}

function txtMessage_KeyPress( e ) {
	if ( !e ) {
		e = window.event;
	}
	keycode = e.which || e.keycode;
	if ( keycode === VK_ENTER ) {
		cmdSend_Click();
	}
}

function cmdSend_Click() {
	var message = document.getElementById( "txtMessage" ).value;
	sendMessage( message );
	
	//clear the message text box
	txtMessage.value = ""
}

function cmdLogout_Click() {
	window.location.href = "login.html"
}

function showDisplayName() {
	var formInput = window.location.search;
	
	//replace all "+"s with " "s
	while( formInput.indexOf( "+" ) != -1 ) {
		formInput = formInput.replace( "+" , " " );
	}
	
	var displayName = formInput.substring( formInput.indexOf( "displayName=" )+12 , formInput.length );
	var lblDisplayName = document.getElementById( "lblDisplayName" );
	lblDisplayName.innerHTML = "Logged in as <span class=\"displayNameText\">" + displayName + "</span>";
}

function privateMessage( username ) {
	alert( "Private messaging " + username );
}

function addUserToUserList( username ) {
	/*var newUser = document.createElement( "input" );
	newUser.type = "button";
	newUser.value = username;
	newUser.name = username;
	newUser.onclick = function() {
		privateMessage( username );
	}
	
	var lineBreak = document.createElement( "br" );
	//br.id = "br" + username;
	
	var userList = document.getElementById( "pnlUserList" );
	userList.appendChild( newUser );
	userList.appendChild( lineBreak );*/
	
	var div = document.createElement( "div" );
	div.setAttribute( "id" , username );
	div.setAttribute( "class" , "userlistElement" );
	
	var button = document.createElement( "input" );
	button.type = "button";
	button.value = username;
	button.onclick = function() {
		privateMessage( username );
	}
	div.appendChild( button );
	
	var userList = document.getElementById( "pnlUserList" );
	userList.appendChild( div );
	
}

function removeUserFromUserList( username ) {
	var toRemove = document.getElementById( username );
	toRemove.parentNode.removeChild( toRemove );
}

var nextId=2;
function test() {
	addUserToUserList( "User" + nextId );
	nextId += 1;
}

function test2() {
	var username = prompt( "Enter Username to remove from list: " );
	removeUserFromUserList( username );
}
var VK_ENTER = 13
var displayName = "???";

/**
 * Sends the given message to the server.
 * 
 * @param message the message to send to the server
 */
function sendChatMessage( message ) {
	
	//do not send empty messages to the chat server
	if ( message != "") {
		sendMessage( "<CHAT> " + displayName + ": " + message );
	}
}

/**
 * Triggered when the user presses a key with the message box
 * in focus. If the user pressed "Enter", then the message in the
 * message box will be sent to the server as a chatroom message.
 * 
 * @param e properties regarding the keypress event
 */
function txtMessage_KeyPress( e ) {
	if ( !e ) {
		e = window.event;
	}
	keycode = e.which || e.keycode;
	if ( keycode === VK_ENTER ) {
		cmdSend_Click();
	}
}

/**
 * Triggered when the user clicks "Send". Sends the user's message to the server.
 */
function cmdSend_Click() {
	var message = document.getElementById( "txtMessage" ).value;
	sendChatMessage( message );
	txtMessage.value = ""
}

/**
 * Logs the user out of the chatroom.
 */
function cmdLogout_Click() {
	window.location.href = "login.html"
	websocket.disconnect();
}

/**
 * Loads the user's display name onto the web page.
 */
function loadDisplayName() {
	var formInput = window.location.search;
	
	//replace all "+"s with " "s
	while( formInput.indexOf( "+" ) != -1 ) {
		formInput = formInput.replace( "+" , " " );
	}
	
	var username = formInput.substring( formInput.indexOf( "displayName=" )+12 , formInput.length );
	var lblDisplayName = document.getElementById( "lblDisplayName" );
	lblDisplayName.innerHTML = "Logged in as <span class=\"displayNameText\">" + username + "</span>";
	displayName = username;
	validateLogin();
}

/**
 * Allows the user to private message the given user.
 * 
 * @param username the user to private message
 */
function privateMessage( username ) {
	//TODO put "/[username]" in the message box
	alert( "Private messaging " + username );
}

/**
 * Adds the given user to the list of active users in the chatroom.
 * 
 * @param username a user to add to the user list
 */
function addUserToUserList( username ) {	
	var userBox = document.createElement( "div" );
	userBox.setAttribute( "id" , username );
	userBox.setAttribute( "class" , "userlistElement" );
	
	var userButton = document.createElement( "input" );
	userButton.type = "button";
	userButton.value = username;
	userButton.onclick = function() {
		privateMessage( username );
	}
	userBox.appendChild( userButton );
	
	var userList = document.getElementById( "pnlUserList" );
	userList.appendChild( userBox );
}

/**
 * Removes the given user from the user list.
 * 
 * @param username the user to remove from the user list
 */
function removeUserFromUserList( username ) {
	var toRemove = document.getElementById( username );
	toRemove.parentNode.removeChild( toRemove );
}

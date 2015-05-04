var websocket = new WebSocket( 'ws://localhost:8080/Chatroom/websocket' );
var users = new Array();

websocket.onerror = function( event ) {
	onError( event );
}

websocket.onopen = function( event ) {
	onOpen( event );
}

websocket.onclose = function( event ) {
	onClose( event );
}

websocket.onmessage = function( event ) {
	onMessage( event );
}

function onError( event ) {
	alert( "Failed to connect to server" );
}

function onOpen( event ) {
	alert( "Successfully connected to server" );
	
	loadDisplayName();
	requestUserList();
}

function onClose( event ) {
	//do nothing
}

function sendMessage( message ) {
	websocket.send( message );
}

function onMessage( event ) {
	var message = event.data;
	processMessage( message );
}

function processMessage( message ) {
	console.log( "Received message: " + message );
	var messageTokens = message.split( " " );
	var messageTag = messageTokens[ 0 ];
	if ( messageTag == "<ID>" ) {
		var success = (messageTokens[ 1 ] == "SUCCESS" ? true : false );
		if ( !success ) {
			alert( "Display name not valid or already in use." );
			websocket.disconnect();
		}
	}
	else if ( messageTag == "<CHAT>" ) {
		var txtChatHistory = document.getElementById( "txtChatHistory" );
		var messageContents = message.substring( 7 , message.length );
		txtChatHistory.value += messageContents + "\n";
	}
	else if ( messageTag == "<ADD_USER>" ) {
		
		//this is quite inefficient, but it will suffice for this prototype
		var usernameToAdd = message.substring( message.indexOf( "<ADD_USER>" )+11 , message.length );
		users[ users.length ] = usernameToAdd;
		console.log( "Added " + usernameToAdd );
		
		clearUserList();
		users.sort();
		for ( var i=0 ; i<users.length ; i++ ) {
			addUserToUserList( users[ i ] );
		}
	}
	else if ( messageTag == "<REMOVE_USER>" ) {
		
		var usernameToRemove = message.substring( message.indexOf( "<REMOVE_USER>" )+14 , message.length );
		var idxToRemove = users.indexOf( usernameToRemove );
		if ( idxToRemove != -1 ) {
			users.splice( idxToRemove , 1 );
		}

		removeUserFromUserList( usernameToRemove );
	}
}

function validateDisplayName( displayName ) {
	sendMessage( "<ID> " + displayName );
}

function validateLogin() {
	validateDisplayName( displayName );
	return false;
}

function requestUserList() {
	sendMessage( "<USER_LIST>" );
}

function clearUserList() {
	
	var userList = document.getElementById( "pnlUserList" );
	
	while( userList.childNodes.length > 2 ) {
		userList.removeChild( userList.lastChild );
	}
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
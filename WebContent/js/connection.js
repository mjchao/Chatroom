var websocket = new WebSocket( 'ws://localhost:8080/Chatroom/websocket' );

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
	//alert( "Received message: " + message );
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
}

function validateDisplayName( displayName ) {
	sendMessage( "<ID> " + displayName );
}

function validateLogin() {
	validateDisplayName( displayName );
	return false;
}
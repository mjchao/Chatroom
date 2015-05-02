package mjchao.chatroom.server;

import java.io.IOException;
import java.util.ArrayList;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;


@ServerEndpoint("/websocket")
public class Server {

	
	private class ClientData {
		public Session s;
		public String displayName = "";
		
		public void write( String message ) {
			try {
				s.getBasicRemote().sendText( message );
				System.out.println( "Wrote to " + displayName + ": " + message );
			}
			catch ( IOException e ) {
				//ignore
			}
		}
	}
	private static ArrayList< ClientData > clients = new ArrayList< ClientData >();
	
	@OnMessage
	public void onMessage( String message , Session s ) {
		processMessage( message , s );
	}
	
	public void processMessage( String message , Session s ) {
		System.out.println( "Processing message: " + message );
		String messageType = message.substring( 0 ,  message.indexOf( " " ) );
		String[] messageTokens = message.split( " " );
		if ( messageType.equals( "<CHAT>" ) ) {
			synchronized( clients ) {
				for ( ClientData client : clients ) {
					client.write( message );
				}
			}
		}
		else if ( messageType.equals( "<PM>" ) ) {
			String sender = "";
			for ( ClientData client : clients ) {
				if ( client.s.equals( s ) ) {
					sender = client.displayName;
					break;
				}
			}
			String recipient = messageTokens[ 1 ];
			StringBuffer messageContent = new StringBuffer( "" );
			for ( String str : messageTokens ) {
				messageContent.append( str );
			}
			synchronized( clients ) {
				for ( ClientData client : clients ) {
					if ( client.displayName.equals( recipient ) ) {
						client.write( "<PM> " + sender + " " + messageContent.toString() );
					}
				}
			}
		}
		else if ( messageType.equals( "<ID>" ) ) {
			if ( messageTokens.length <= 1 ) {
				try {
					s.getBasicRemote().sendText( "<ID> FAILED" );
				}
				catch ( IOException e ) {
					//ignore
				}
			}
			else {
				String displayName = message.substring( message.indexOf( " " )+1 , message.length() );
				
				boolean isDuplicate = false;
				for ( ClientData client : clients ) {
					if ( client.displayName.equals( displayName ) ) {
						isDuplicate = true;
						break;
					}
				}
				if ( !isDuplicate && displayName.length() <= 20 ) {
					try {
						s.getBasicRemote().sendText( "<ID> SUCCESS" );
					}
					catch ( IOException e ) {
						//ignore
					}
					for ( ClientData client : clients ) {
						if ( client.s.equals( s ) ) {
							client.displayName = displayName;
						}
					}
				}
				else {
					try {
						s.getBasicRemote().sendText( "<ID> FAILED" );
					}
					catch ( IOException e ) {
						//ignore
					}
				}

			}
		}
	}
	
	@OnOpen
	public void onOpen( Session s ) {
		ClientData data = new ClientData();
		data.s = s;
		clients.add( data );
		System.out.println( "Accepted a client" );
	}
	
	@OnClose
	public void onClose( Session s ) {
		System.out.println( "Lost a client" );
		for ( int i=0 ; i<clients.size() ; i++ ) {
			if ( clients.get( i ).s.equals( s ) ) {
				clients.remove( i );
				return;
			}
		}
	}
}

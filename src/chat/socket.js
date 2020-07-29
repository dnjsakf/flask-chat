/**
 * Socket.io
 * Life Cycle 
 **/
 
// Create Socket Instance
const socket = io(
  NAMESPACE_CHAT, {
    reconnection: SOCKET_RECONNECTION,
    timeout: SOCKET_TIMEOUT,
  }
);

// Connect
socket.on(SOCKET_CONNECT, ()=>{
  const sid = socket.id.replace(socket.nsp+"#", "");
  
  dispatch( userActions.setUser({
    sid,
    loggedIn: new Date(),
  }));

  console.log(SOCKET_CONNECT, { sid, socket } );
});

// Custom Reconnect
socket.on(SOCKET_CONNECT_ERROR, error => {
  console.group(SOCKET_CONNECT_ERROR);
  console.log({ 
    error,
    reconnect: {
      delay: SOCKET_RECONNECT_DELAY
    }
  });
  console.groupEnd(SOCKET_CONNECT_ERROR);
  
  // Do Reconnection
  setTimeout(() => {
    socket.connect();
  }, SOCKET_RECONNECT_DELAY);
});

// Error
socket.on(SOCKET_ERROR, error => {
  console.log(SOCKET_ERROR, { error });
});

// Disconnect
socket.on(SOCKET_DISCONNECT, disconnected => {
  dispatch( userActions.clearUser() );
  
  console.log(SOCKET_DISCONNECT, { disconnected });
});
const store = CreateStore( rootReducer );

const socket = CreateSocket({
  namespace: NAMESPACE_CHAT,
  handler: HandleMessageEvent,
  options: {
    reconnection: SOCKET_RECONNECTION,
    timeout: SOCKET_TIMEOUT,
  }
});
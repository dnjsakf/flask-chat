/** Grobal Variables **/
const store = CreateStore( rootReducer );

/** Initialize **/
const MyChat = ( options ) => {
  /** Variables **/
  let socket = null;
  let events = null;
  let handlers = null;

  /** Redux **/
  const { dispatch } = store;
  
  /** Reducers **/
  const {
    selectors: userSelector,
    actions: userActions
  } = UserReducer;

  /** Set Username **/
  const init_username = ( username ) => {
    const cookies = MyUtils.getCookies();
    const el_username = document.querySelector("#username");
    const val_username = ( username || cookies.username || DEFAULT_USER_NAME )

    el_username.value = val_username;
    
    dispatch( userActions.setName( val_username ) );
  }
  
  /** Set Socket **/
  const init_socket = () => {
    const username = userSelector.getName(store.getState());

    console.log( username );

    const __socket = MySocket({
      //host: "http://localhost:3000",
      namespace: NAMESPACE_CHAT,
      options: {
        path: "/socket.io/",
        reconnection: SOCKET_RECONNECTION,
        timeout: SOCKET_TIMEOUT,
      },
      params: {
        username: username
      }
    });

    __socket.init();
    
    return __socket;
  }

  const __initialize = () => {
    init_username();

    socket = init_socket();
    events = socket.getEvents();
    handlers = MyHandlers(events);
  }
  
  return {
    init: ()=>{
      __initialize();
    },
  }
}

const myChat = MyChat();
myChat.init()
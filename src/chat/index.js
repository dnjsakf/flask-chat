/** Grobal Variables **/
const store = CreateStore( rootReducer );

/** Initialize **/
const MyChat = ( options ) => {  
  /** Set Cookies **/
  const cookies = {}
  const init_cookies = () => {
    unescape(document.cookie).replace(/\s/g, "").split(";").forEach(( cookie )=>{ 
      const splited = cookie.split("=");
      cookies[splited[0]] = splited[1];
    });
  }
  
  /** Set Username **/
  const init_username = () => {
    const el_username = document.querySelector("#username");
    el_username.value = ( cookies.username || DEFAULT_USER_NAME );
    
    console.log( el_username, el_username.value );
  }
  
  /** Set Socket **/
  const init_socket = () => {
    const socket = MySocket({
      namespace: NAMESPACE_CHAT,
      options: {
        reconnection: SOCKET_RECONNECTION,
        timeout: SOCKET_TIMEOUT,
      },
    });
    socket.init()
    const events = socket.getEvents();
    console.log( events );
  }
  
  return {
    init: ()=>{
      init_cookies();
      init_username();
      init_socket();      
    },
  }
}

const myChat = MyChat();
myChat.init()
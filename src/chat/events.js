/**
 * Socket.io
 * Event Handlers 
 **/

const HandleMessageEvent = socket => {
  /** Reudx **/
  const { dispatch } = store;
  
  /** Reducers **/
  const {
    selectors: userSelector,
    actions: userActions
  } = UserReducer;
  
  /** Make Message **/
  const makeMessageItem = ({ sid, sender, message }) => {
    const state = store.getState();
    const isMine = ( sid == userSelector.getSid(state) );
    const text = [];
    
    if( !isMine ){
      text.push( sender );
    }
    text.push( message );

    const el_viewer = document.querySelector(".chat-msg-container > .chat-msg-wrapper");
    const el_msg_list = el_viewer.querySelector(".chat-msg-list");
    const el_msg_item = document.createElement("li");
    const el_msg_item_wrapper = document.createElement("div");
    const el_msg_item_text = document.createElement("a");
    
    el_msg_item_wrapper.className = "chat-msg-item-wrapper";
    el_msg_item.classList.add("chat-msg-item", (isMine ? 'msg-mine' : 'msg-other'));
    
    el_msg_item_text.appendChild(document.createTextNode(text.join(":")));
    el_msg_item_wrapper.appendChild(el_msg_item_text);
    el_msg_item.appendChild(el_msg_item_wrapper);
    el_msg_list.appendChild(el_msg_item);
    
    el_viewer.scrollTop = el_viewer.scrollHeight;
  }

  /** Socket Emit Event: Send Message **/
  const emitSendMessage = ( message, cb ) => {
    socket.emit(EVENT_EMIT_SEND_MESSAGE, message, cb);
  }

  /** Socket Emit Event: Set Username **/
  const emitSetUsername = ( username, cb ) => {
    socket.emit(EVENT_EMIT_SET_USERNAME, username, cb);
  }

  /** Socket On Event: Receive Message **/
  socket.on(EVENT_EMIT_RECV_MESSAGE, makeMessageItem);

  /** Socket On Event: Connected **/
  socket.on(EVENT_ON_CONNECTED, ({ sid })=>{
    const name = userSelector.getName(store.getState());
    
    const el_username = document.querySelector("#username");
    
    el_username.value = name;
    
    console.log( EVENT_ON_CONNECTED, { sid, name } );
  });

  /** Handle Send **/
  const el_send = document.querySelector("#send");
  const handleSendMessage = event => {
    event.preventDefault();
    
    const el_message = document.querySelector("#message");
    const message = el_message.value;

    if( message ){
      emitSendMessage(message, (success, retval) => {
        el_message.value = "";
        el_message.focus();
      });
    }
  }
  el_send.addEventListener('click', handleSendMessage, false);

  /** Handle Enter Message **/
  const el_message = document.querySelector("#message");
  const handleEnter = event => {
    if( event.key === "Enter" || event.keyCode === 13 ){
      handleSendMessage( event );
    }
  }
  el_message.addEventListener('keypress', handleEnter, false);

  /** Handle Change Username **/
  const el_username = document.querySelector("#username");
  const handleChangeUsername = event => {
    const username = event.target.value;
    
    emitSetUsername(username, ( success, s_username )=>{
      if( success ){
        dispatch( userActions.setName(s_username) );
      }
    });
  }
  el_username.addEventListener('blur', handleChangeUsername, false);

}
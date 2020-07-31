/**
 * Socket.io
 * Event Handlers 
 **/

const MyHandlers = events => {
  /** Reudx **/
  const { dispatch } = store;
  
  /** Reducers **/
  const {
    selectors: userSelector,
    actions: userActions
  } = UserReducer;
  
  /** Save Cookie **/
  const saveCookie = ( cookies ) => {
      fetch('/cookie', {
        method: 'POST',
        body: JSON.stringify(cookies),
        headers: new Headers({
          "content-type": "application/json; charset=utf-8"
        })
    }).then(function(response) {
        console.log( arguments )
    });
  }
  
  /** Make Message Element **/
  const makeMessageItem = props => {
    const {
      className,
      text,
    } = props;

    const el_viewer = document.querySelector(".chat-msg-container > .chat-msg-wrapper");
    const el_msg_list = el_viewer.querySelector(".chat-msg-list");
    const el_msg_item = document.createElement("li");
    const el_msg_item_wrapper = document.createElement("div");
    const el_msg_item_text = document.createElement("a");
    
    el_msg_item_wrapper.className = "chat-msg-item-wrapper";
    el_msg_item.className = className;
    el_msg_item.classList.add("chat-msg-item");
    
    el_msg_item_text.appendChild(document.createTextNode(text));
    el_msg_item_wrapper.appendChild(el_msg_item_text);
    el_msg_item.appendChild(el_msg_item_wrapper);
    el_msg_list.appendChild(el_msg_item);
    
    el_viewer.scrollTop = el_viewer.scrollHeight;
  }
  
  /** Make Message **/
  const makeMessage = props => {
    const { 
      user: sender,
      message,
    } = props;
    
    const client_sid = userSelector.getSid(store.getState());
    const isMine = ( sender.sid == client_sid );
    
    const options = {
      className: (isMine ? 'msg-mine' : ["msg-other", sender.name].join(" ")),
      text: (isMine ? [message] : [sender.name, message]).join(":"),
    }
    
    makeMessageItem( options );
  }

  /** Handle Send **/
  const el_send = document.querySelector("#send");
  const handleSendMessage = event => {
    event.preventDefault();
    
    const el_message = document.querySelector("#message");
    
    const data = {
      message: el_message.value,
      room: userSelector.getRoom(store.getState())
    }
    
    if( data.message ){

      events.emitSendMessage(data);
      
      el_message.value = "";
      el_message.focus();
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
    const { value: username } = event.target;
    
    saveCookie([
      { "key": "username", "value": escape(username) },
      { "key": "limit", "value": "30" },
    ]);
    
    events.emitSetUsername(username);
  }
  el_username.addEventListener('blur', handleChangeUsername, false);

  /** Handle Enter Rooms **/
  const el_nav_items = document.querySelectorAll(".chat-nav-item > a");
  const handleEnterRoom = event => {
    event.preventDefault();
    
    const room = event.target.getAttribute("room");

    events.emitEnterRoom(room);
  }
  Array.from(el_nav_items).forEach( nav_item => {
    nav_item.addEventListener('click', handleEnterRoom, false);
  });
}
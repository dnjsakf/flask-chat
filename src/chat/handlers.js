/**
 * Socket.io
 * Event Handlers 
 **/

const MyHandlers = events => {
  /** Redux **/
  const { dispatch } = store;
  
  /** Reducers **/
  const {
    selectors: userSelector,
    actions: userActions
  } = UserReducer;

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
      el_message.value = "";
      el_message.focus();

      events.emitSendMessage(data);
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

    MyUtils.saveCookie({
      username: username,
      limit: 30,
    })
    
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
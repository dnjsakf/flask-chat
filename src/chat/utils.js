
const MyUtils = (() => {
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
      sid: client_sid,
      user: sender,
      message,
    } = props;
    
    //const client_sid = userSelector.getSid(store.getState());
    const isMine = ( sender.sid == client_sid );
    
    const options = {
      className: (isMine ? 'msg-mine' : ["msg-other", sender.name].join(" ")),
      text: (isMine ? [message] : [sender.name, message]).join(":"),
    }
    
    makeMessageItem( options );
  }
  return {
    saveCookie,
    makeMessage,
  }
})();
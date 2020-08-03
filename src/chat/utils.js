const MyUtils = (() => {
  /** Get Cookies **/
  const getCookies = () => {
    const __cookies = {}
    unescape(document.cookie).replace(/\s/g, "").split(";").forEach(( cookie )=>{ 
      const splited = cookie.split("=");

      __cookies[splited[0]] = splited[1];
    });

    return __cookies;
  }

  /** Save Cookie **/
  const saveCookie = ( cookies ) => {
    if( cookies && cookies instanceof Object ){
      const __cookies = JSON.stringify(
        Object.keys(cookies).map( key => ({
          key: key,
          value: escape(cookies[key]).toString()
        }))
      );
      
      if( __cookies.length > 0 ){
        fetch('/cookie', {
          method: 'POST',
          body: __cookies,
          headers: new Headers({
            "content-type": "application/json; charset=utf-8"
          })
        }).then(function(response) {
            console.log( arguments )
        });
      }
    }
  }

  /** Serialize Object **/
  const serialize = ( obj ) => {
    let datas = [];
    if( obj instanceof Object ){
      datas = Object.keys( obj ).map( key => (
        [encodeURIComponent(key), encodeURIComponent(obj[key])].join("=")
      ));
    }
    return datas.join("&");
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
    
    const isMine = ( sender.sid == client_sid );
    
    const options = {
      className: (isMine ? 'msg-mine' : ["msg-other", sender.name].join(" ")),
      text: (isMine ? [message] : [sender.name, message]).join(":"),
    }
    
    makeMessageItem( options );
  }

  return {
    getCookies,
    saveCookie,
    serialize,
    makeMessageItem,
    makeMessage,
  }
})();
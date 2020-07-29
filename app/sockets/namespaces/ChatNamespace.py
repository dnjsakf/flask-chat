from socketio import Namespace

class ChatNamespace(Namespace):
  def __init__(self, sio, namespace, *args, **kwrags):
    super(Namespace, self).__init__(namespace)
    
    self.sio = sio    

  def on_connect(self, sid, env):
    import pprint
    
    pprint.pprint( dir(self) )
  
    print('connect', sid, env["REMOTE_ADDR"])

    self.emit("connected", { "sid": sid })
    
  def on_disconnect(self, sid):
    print('disconnect', sid)

  def on_set_username(self, sid, username):
    print('set username', sid, username)
    
    self.sio.save_session(sid, { "username": username })

    return ( True, username )

  def on_send_message(self, sid, message):
    session = self.sio.get_session(sid)
    username = session.get("username", "Unknown")
    
    print('message: ', username, message )
    
    self.emit("recv_message", {
      "sid":sid, 
      "sender": username,
      "message": message
    })
    
    return (True, "sended", )
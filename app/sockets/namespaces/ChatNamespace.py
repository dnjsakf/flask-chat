from socketio import Namespace
import datetime

class ChatNamespace(Namespace):
  def __init__(self, sio, namespace, *args, **kwrags):
    super(Namespace, self).__init__(namespace)
    
    self.sio = sio

    self.dummy_user = {
      "sid": None,
      "username": "Unknown",
      "room": "lobby",
      "auth": "normal",
      "loggedIn": None
    }

  def on_connect(self, sid, env):
    print('connect', sid, env["REMOTE_ADDR"])

    user = self.dummy_user
    user["sid"] = sid

    self.sio.save_session(sid, { "user": user })

    self.emit("connected", { "sid": sid })
    
  def on_disconnect(self, sid):
    print('disconnect', sid)

  def on_set_username(self, sid, username):
    session = self.sio.get_session(sid)

    user = session.get("user")
    user["username"] = username

    print('set username', sid, username)

    session.update({ "user": user })
    return ( True, username )

  def on_send_message(self, sid, message):
    session = self.sio.get_session(sid)
    user = session.get("user")
    
    self.emit("recv_message", { 
      "sender": user,
      "message": message
    })

    print( sid, user["sid"])

    print('message: ', user.get("username"), message )
    return (True, "sended", )

  def on_enter_room(self, sid, room):
    self.enter_room(sid=sid, room=room)

    session = self.sio.get_session(sid)
    user = session.get("user")
    user["room"] = room
    session.update({ "user": user })

    print( f"enter { user }." )
    return ( True, f"enter { user }.", )

  def on_leave_room(self, sid, room):
    self.leave_room(sid=sid, room=room)

    session = self.sio.get_session(sid)
    user = session.get("user")
    user["room"] = self.dummy_user.get("room", "lobby")
    session.update({ "user": user })

    print( f"leave { user }." )
    return ( True, f"leave { user }.", )
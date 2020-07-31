from flask import current_app as app
from socketio import Namespace

import datetime
import pprint

class ChatUtils(object):
  def __init__(self, sio, *args, **kwargs):
    self.sio = sio
    self.args = args
    self.kwargs = kwargs

  def get_session_user(self, _sid, attr=None, attrs=None):
    session = self.sio.get_session(_sid)
    
    user = session.get("user", self.dummy_user.copy())
    
    if isinstance( attr, str ):
      return user[attr]
    
    elif isinstance( attrs, list ):
      temp = dict()
      for key in attrs:
        temp[key] = user[key]
      return temp

    return user.copy()
    
  def set_session_user(self, _sid, **kwargs):
    session = self.sio.get_session(_sid)
    
    user = session.get("user", None)
    if user is None:
      user = self.dummy_user.copy()
    user.update( kwargs )
      
    session.update({ "user": user })
    

class ChatNamespace(Namespace, ChatUtils):
  def __init__(self, sio, namespace, *args, **kwargs):
    super(Namespace, self).__init__(namespace)
    
    self.sio = sio
    self.args = args
    self.kwargs = kwargs
    
    self.logger = app.logger
    
    self.default_room = "lobby"    
    self.dummy_user = {
      "sid": None,
      "name": "Unknown",
      "room": "lobby",
      "auth": "normal",
      "loggedIn": None
    }

  def on_connect(self, sid, env):
    self.logger.info(f'[SCONNECT] { env["REMOTE_ADDR"] } { sid }')
    
    self.set_session_user(sid, sid=sid)    
    self.enter_room(sid, self.default_room)
    
    emit_data = {
      "user": self.get_session_user(sid)
    }
    
    self.emit("room_hello", emit_data, room=self.default_room)
    self.emit("connected", emit_data, room=self.default_room)
    
  def on_disconnect(self, sid):
    self.logger.info(f"[DISCONNECT] { sid }")

  def on_set_username(self, sid, username):
    user = self.get_session_user(sid);
    
    self.set_session_user(sid, name=username)

    self.logger.info( f'[SET_USERNAME] { user["name"] } -> { username }')
    
    return (True, )

  def on_send_message(self, sid, send_data):
    user = self.get_session_user(sid)
    
    self.logger.info(f'[SEND_MESSAGE][room={ user["room"] }] { user["name"] }: { send_data["message"] }')
    
    emit_data = send_data.copy()
    emit_data.update({
      "user": user,
    })
    
    self.emit("receive_message", emit_data, room=send_data["room"])

  def on_enter_room(self, sid, enter_room):
    prev_room = self.get_session_user(sid, attr="room")
    
    if prev_room != enter_room:
      leave_emit_data = {
        "user": self.get_session_user(sid)
      }
      self.emit("room_bye", leave_emit_data, room=prev_room)
      self.leave_room(sid, prev_room)
      
      self.logger.info(f'[LEAVE_ROOM][room={ prev_room }]')
    
    self.enter_room(sid, enter_room)
    self.set_session_user(sid, room=enter_room)
    
    enter_emit_data = {
      "user": self.get_session_user(sid)
    }
    
    self.logger.info(f'[ENTER_ROOM][room={ enter_room }]')
    print( self.rooms(sid) )
    
    self.emit("room_hello", enter_emit_data, room=enter_room)
    
    return (True, )

  def on_leave_room(self, sid, leave_room):
    self.leave_room(sid, leave_room)
    self.set_session_user(sid, room=self.default_room)
    
    emit_data = {
      "user": self.get_session_user(sid)
    }
    
    self.emit("room_bye", emit_data, room=leave_room)
    
    return (True, )
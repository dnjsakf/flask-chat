import socketio

from .namespaces import ChatNamespace

def create_sio(**kwargs):
  sio = socketio.Server(**kwargs)
  sio.register_namespace(ChatNamespace(sio, '/chat'))
  
  return sio
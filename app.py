import dotenv
from flask import Flask, send_from_directory

import socketio

app = Flask(
  __name__,
  static_url_path="/static/",
  static_folder="./src",
  )
  
sio = socketio.Server(async_mode='threading')

class ChatNamespace(socketio.Namespace):
  def on_connect(self, sid, env):
    print('connect', sid)
    
    return (True, sid, )
    
  def on_disconnect(self, sid):
    print('disconnect', sid)
    
  def on_my_event(self, sid, data):
    print('my_event: ', sid, data)
    
    self.emit('message', data)

  def on_send_message(self, sid, message):
    print('message: ', sid, message)
    
    self.emit("recv_message", {"sid":sid, "message": message})
    
    return (True, "sended", )

sio.register_namespace(ChatNamespace('/chat'))

'''
@sio.event
def connect(sid, environ):
  print('connect ', sid)

@sio.event
def disconnect(sid):
  print('disconnect ', sid)
  
@sio.event
def my_event(sid, data):
  print('my_event:', data)
      
  return ( "OK", "I'm my_event",  )
  
@sio.on('custom event')
def custom_event(sid, data):
  print('custom event:', data);
      
  # return result
  return ( "OK", "I'm custom_event", )
'''

@app.route('/', methods=["GET","POST"])
def index():
  return send_from_directory(app.static_folder, "index.html")

app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

if __name__ == '__main__':
  dotenv.load_dotenv(dotenv_path=".env")

  app.run(host="localhost", port=3000, threaded=True)
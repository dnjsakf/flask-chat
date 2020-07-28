import os
import dotenv
import socketio
import pprint

from flask import Flask, url_for, render_template

app = Flask(
  __name__,
  static_url_path="/static/",
  static_folder="src",
  template_folder="src"
)

@app.context_processor
def override_url_for():
  return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
  if endpoint == 'static':
    print( values )
    filename = values.get('filename', None)
    if filename:
      file_path = os.path.join(app.static_folder, filename)
      values['q'] = int(os.stat(file_path).st_mtime)
  return url_for(endpoint, **values)

@app.route('/', methods=["GET","POST"])
def index():
  return render_template("index.html")

sio = socketio.Server(async_mode='threading')

class ChatNamespace(socketio.Namespace):
  def on_connect(self, sid, env):
    print('connect', sid, env["REMOTE_ADDR"])

    self.emit("connected", { "sid": sid })
    
  def on_disconnect(self, sid):
    print('disconnect', sid)

  def on_set_username(self, sid, username):
    print('set username', sid, username)
    
    sio.save_session(sid, { "username": username })

    return ( True, username )

  def on_send_message(self, sid, message):
    session = sio.get_session(sid)
    username = session.get("username", "Unknown")
    
    print('message: ', username, message )
    
    self.emit("recv_message", {
      "sid":sid, 
      "sender": username,
      "message": message
    })
    
    return (True, "sended", )

sio.register_namespace(ChatNamespace('/chat'))

app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

if __name__ == '__main__':
  dotenv.load_dotenv(dotenv_path=".env")

  app.run(host="0.0.0.0", port=3000, threaded=True)
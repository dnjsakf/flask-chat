from flask import Flask
from flask_cors import CORS

def create_app(option={}, socket_option=None):
  app = Flask( __name__, **option )
  
  with app.app_context():
    # Set Socektio
    if socket_option is not None:
      from socketio import WSGIApp
      from .sockets import create_sio

      sio = create_sio(**socket_option)
      app.wsgi_app = WSGIApp(sio, app.wsgi_app)

    # Set CORS
    CORS(app=app, resources={
      r"*": { "origin": "*" }
    })
    
    # Set Routes
    from .routes import routes
  
  return app
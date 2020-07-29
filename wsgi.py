import dotenv
import os
import socketio
from app import create_app

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))

app_option = {
  "static_url_path": "/static/",
  "static_folder": os.path.join(ROOT_PATH, "src"),
  "template_folder": os.path.join(ROOT_PATH, "src"),
}
socket_option = {
  "async_mode": "threading"
}

app = create_app(option=app_option, socket_option=socket_option)

if __name__ == '__main__':
  dotenv.load_dotenv(dotenv_path=".env")

  app.run(host="0.0.0.0", port=3000, threaded=True)
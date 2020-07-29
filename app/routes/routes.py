import os

from flask import (
  current_app as app,
  render_template,
  url_for
)

DEFAULT_DATAS = {
  "username": "Unknwon",
  "rooms": [
    {
      "title": "First",
      "password": None,
      "limit": 4
    },
    {
      "title": "Seconds",
      "password": None,
      "limit": 4
    },
  ]
}

@app.route('/', methods=["GET","POST"])
def index():
  return render_template("index.html", **DEFAULT_DATAS)

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
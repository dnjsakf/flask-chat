import json
import os
import datetime

from flask import (
  current_app as app,
  make_response,
  render_template,
  url_for,
  request
)

DEFAULT_DATAS = {
  "username": "Unknwon",
  "rooms": [
    {
      "title": "lobby",
      "password": None,
      "limit": 0
    },
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

@app.route("/", methods=["GET"])
def get_index():
  return render_template("index.html", **DEFAULT_DATAS)
  
@app.route("/cookie", methods=["POST"])
def post_index():
  cookies = request.get_json()
  
  print( cookies )
  
  resp = make_response()
  
  if isinstance(cookies, list):
    expire_date = datetime.datetime.now()
    expire_date = expire_date + datetime.timedelta(days=90)
    
    for cookie in cookies:
      resp.set_cookie(str(cookie["key"]), str(cookie["value"]), expires=expire_date)

  return resp
  

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
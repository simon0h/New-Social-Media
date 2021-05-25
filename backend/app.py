from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import sys
sys.path.insert(1, '/api')
from api.backend import backend

app = Flask(__name__, static_url_path='', static_folder='../frontend')
CORS(app) #comment this on deployment
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

api.add_resource(backend, '/flask/hello')

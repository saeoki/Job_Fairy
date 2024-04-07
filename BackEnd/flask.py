from flask import Flask
from flask import request, jsonify
from flask_cors import CORS

import openai
import os

app = Flask(__name__)

CORS(app)
from werkzeug.debug import DebuggedApplication
from flask import Flask

app = Flask(__name__, template_folder="../template")

from app import routes
from app import filters
app.env = 'development'
app.debug = True
app.config['TESTING'] = True
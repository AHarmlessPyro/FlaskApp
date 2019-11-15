from app import app
from flask import render_template
import requests


@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/persons/<word>')
def ret(word):
    response = requests.get('https://www.dictionaryapi.com/api/v3/references/collegiate/json/' +
                            word+'?key=721730b3-70ba-4169-9a3c-d170a41d49c3')
    # print(response.json())
    val = response.json()
    print(val)
    val = val[0]  # [0][0][0] #['def'][0]['sseq']
    #while val.size() == 0:

    return render_template('body.html', list_item=val)

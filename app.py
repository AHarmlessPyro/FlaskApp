from flask import Flask
from flask import render_template
import re
import os
#import routes
#import filters
import requests

from werkzeug.debug import DebuggedApplication
app = Flask(__name__, template_folder="template")

app.env = 'development'
app.debug = True
app.static_folder = 'static'
app.static_url_path = 'static'
app.config['TESTING'] = True


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
    # while val.size() == 0:

    return render_template('body.html', list_item=val)


@app.route('/test')
def testTemplateNesting():
    return render_template('MainBody.html')


@app.template_filter('search')
def match(inputStr):
    try:
        regex = r"[^\|\{\}\'][a-zA-Z \,]+[^\|\{\}\']"
        print(inputStr)
        matches = re.findall(regex, inputStr, re.MULTILINE)
        print(matches)
        if(matches == None or matches == []):
            print("Formatting not accepted" + str(inputStr))
            return 'Input format weird.Can\'t process input ' + input
        else:
            print('DONE')
            return str(matches[0])
    except:
        print("Formatting not accepted" + str(inputStr))
        return 'Input format weird.Can\'t process input \n' + str(inputStr)

from app import app
import re


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

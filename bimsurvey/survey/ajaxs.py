from services import *
from django.http import HttpResponse

def jresponse(resjson):
    return HttpResponse(json.dumps(resjson))

def jexception(exp):
    return jresponse(err_json(exp))

def ajax_login(request):
    from django.contrib.auth import authenticate, login
    try:
        user = None
        if request.user and request.user.is_authenticated():
            user = request.user
        else:
            objson = set_to_jsondata(request.GET)
            
            username = objson[T_USERNAME]
            password = objson[T_PASSWORD]
            
            userauth = authenticate(username=username, password=password)
            if userauth:
                user = userauth
                login(request, userauth)
            else:
                return jexception('Invalid username or password.')

        userinfo = UserInfo.objects.get(ruser = user)

        json = make_json(True, '', userinfo.to_json())
            
        return jresponse(json)
        
    except Exception as e:
        return jexception(e)
    
def ajax_logout(request):
    from django.contrib.auth import logout
    try:
        if request.user and request.user.is_authenticated():
            logout(request)
            
        return jresponse(make_json(True, '', None))
    except Exception as e:
        return jexception(e)
         

def ajax_topics(request):
    
    objson = set_to_jsondata(request.GET)
    
    try:
        userinfoid = UserInfo.objects.get(ruser=request.user).id
        objson[T_USERINFOID] = userinfoid
    except Exception as e:
        print(e)
    
    return jresponse(topics_service(objson))
    
    
def ajax_topic(request, cmd):
    
    cmd = int(cmd)
    
    objson = set_to_jsondata(request.GET)
    
    return jresponse(topic_service(objson, cmd))
    
def ajax_survey(request, cmd):
    
    cmd = int(cmd)
    
    objson = set_to_jsondata(request.GET)
    
    return jresponse(survey_service(objson, cmd))
    
def ajax_question(request, cmd):
    
    cmd = int(cmd)

    objson = set_to_jsondata(request.GET)
    
    return jresponse(question_service(objson, cmd))

def ajax_option(request, cmd):
    
    cmd = int(cmd)
    
    objson = set_to_jsondata(request.GET)
    
    return jresponse(option_service(objson, cmd))
    
def ajax_commit(request, cmd):
    
    cmd = int(cmd)

    objson = set_to_jsondata(request.GET)
    
    return jresponse(commit_service(objson, cmd)) 
    
def ajax_statistics(request):
    
    return jresponse(statistics_service())
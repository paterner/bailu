from django.shortcuts import render
from services import *
from json import JSONEncoder

# Create your views here.

def test(request):
    import datetime
    message = u'This is a message from django backend.(%s)' % datetime.datetime.now()
    return render(request, 'backend_test.html', locals())

def topics(request):
    objson = set_to_jsondata(request.GET)
    jtopics = JSONEncoder().encode(topics_service(objson))
    return render(request, 'topics.html', locals())

def topic(request, id):
    objson = set_to_jsondata(request.GET)
    objson[T_ID] = id
    jtopic = JSONEncoder().encode(topic_service(objson, CMD_QUERY_CHILDREN))
    return render(request, 'topic.html', locals())

def survey(request, id):
    objson = set_to_jsondata(request.GET)
    objson[T_ID] = id
    jsurvey = JSONEncoder().encode(survey_service(objson, CMD_QUERY_CHILDREN))
    return render(request, 'survey.html', locals())

def edit(request, id):
    objson = set_to_jsondata(request.GET)
    objson[T_ID] = id
    jsurvey = JSONEncoder().encode(survey_service(objson, CMD_QUERY_CHILDREN))
    return render(request, 'edit.html', locals())

def statistics(request):
    jstatistics = JSONEncoder().encode(statistics_service())
    return render(request, 'statistics.html', locals())
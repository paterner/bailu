import json
from survey.models import *
from django.db.models import Q

# Create your views here.

def set_to_jsondata(get):
    jsondata = {}
    
    for k in get:
        if k!=u'_' and get[k]==u'':
            try:
                jsondata = json.loads(k)
                break
            except Exception as e:
                print(e)
    
    return jsondata

def make_json(success, message, content):
    json = {T_SUCCESS:success, T_MESSAGE:message}
    if content:
        json[T_CONTENT] = content
    return json

def ok_json(content):
    return make_json(True, '', content)

def err_json(exp):
    return make_json(False, '%s' % exp, None)

FLAG_ALL = 0
FLAG_MY = 1
FLAG_PAR = 2

def topics_service(objson):
    
    topics = []
    
    flag = int(objson[T_FLAG]) if T_FLAG in objson else FLAG_ALL
    
    if flag == FLAG_ALL:
        topics = Topic.objects.all()
    elif flag == FLAG_MY:
        try:
            userinfoid = objson[T_USERINFOID]
            topics = Topic.objects.filter(ruserinfo=UserInfo.objects.get(id=userinfoid))
        except Exception as e:
            return err_json(e)
    elif flag == FLAG_PAR:
        try:
            userinfoid = objson[T_USERINFOID]
            topics = Topic.objects.filter(Q(id__in = Survey.objects.filter(ruserinfo=UserInfo.objects.get(id=userinfoid)).values("rtopic"))|Q(ruserinfo=UserInfo.objects.get(id=userinfoid)))
        except Exception as e:
            return err_json(e)
    else:
        return err_json('Flag code (%d) does not exist.' % flag)
    
    if topics and T_KEYWORD in objson and len(objson[T_KEYWORD])>0:
        topics = topics.filter(title__contains=objson[T_KEYWORD])
    
    try:
        topiclist = to_json_list(topics)

        return ok_json(topiclist)
    except Exception as e:
        print(e)
        return err_json(e)
    
def topic_service(objson, cmd):
    
    valid, err = Topic.is_json_ok(objson, cmd)
    
    if not valid:
        return err_json(err)
    
    topic, init = Topic.get_or_init(objson)
    
    if not topic:
        return err_json('Topic %s does not exist.' % objson[T_ID])
    
    if init:
        pass
         
    if cmd == CMD_QUERY or cmd == CMD_QUERY_CHILDREN:
        pass
    elif cmd == CMD_UPDATE or cmd == CMD_NEW:
        try:
            topic.from_json(objson)
            topic.save()
        except Exception as e:
            return err_json(e)
    elif cmd == CMD_DELETE:
        try:
            topic.delete()
            return make_json(True, 'Topic %s has been deleted.' % objson[T_ID], None)
        except Exception as e:
            return err_json(e)
    else:
        return err_json('Command code (%d) does not exist.' % cmd)
    
    return ok_json(topic.to_json(withSurveys = (True if cmd == CMD_QUERY_CHILDREN else False)))

def survey_service(objson, cmd):
    
    valid, err = Survey.is_json_ok(objson, cmd)
    
    if not valid:
        return err_json(err)
    
    survey, init = Survey.get_or_init(objson)
    
    if not survey:
        return err_json('Survey %s does not exist.' % objson[T_ID])
    
    if init:
        pass
    
    if cmd == CMD_QUERY or cmd == CMD_QUERY_CHILDREN:
        pass
    elif cmd == CMD_UPDATE or cmd == CMD_NEW:
        try:
            survey.from_json(objson)
            survey.save()
        except Exception as e:
            return err_json(e)
    elif cmd == CMD_DELETE:
        survey.delete()
        return make_json(True, 'Survey %s has been deleted.' % objson[T_ID], None)
    else:
        return err_json('Command code (%d) does not exist.' % cmd)
    
    return ok_json(survey.to_json(withChildren = (True if cmd == CMD_QUERY_CHILDREN else False)))

def question_service(objson, cmd):
    
    valid, err = Question.is_json_ok(objson, cmd)
    
    if not valid:
        return err_json(err)
    
    question, init = Question.get_or_init(objson)
    
    if not question:
        return err_json('Topic %s does not exist.' % objson[T_ID])
    
    if init:
        pass
    
    if cmd == CMD_QUERY or cmd == CMD_QUERY_CHILDREN:
        pass
    elif cmd == CMD_UPDATE or cmd == CMD_NEW:
        try:
            if cmd == CMD_NEW and (not T_OPTIONS in objson or not objson[T_OPTIONS]):
                return err_json('Cannot create new question without option(s).')
            else:
                joptions = objson[T_OPTIONS] if T_OPTIONS in objson else None
            
                question.from_json(objson)                
                question.save()
                
                if joptions:
                    for joption in joptions:
                        option, init = Option.get_or_init(joption)
                        option.from_json(joption)
                        if init:
                            option.rquestion = question
                        option.save()

        except Exception as e:
            return err_json(e)
    elif cmd == CMD_DELETE:
        question.delete()
        return make_json(True, 'Question %s has been deleted.' % objson[T_ID], None)
    else:
        return err_json('Command code (%d) does not exist.' % cmd)
    
    return ok_json(question.to_json(withOptions = True))

def option_service(objson, cmd):
    
    valid, err = Option.is_json_ok(objson, cmd)
    
    if not valid:
        return err_json(err)
    
    option, init = Option.get_or_init(objson)
    
    if not option:
        return err_json('Option %s does not exist.' % objson[T_ID])
    
    if init:
        pass
    
    if cmd == CMD_QUERY or cmd == CMD_QUERY_CHILDREN:
        pass
    elif cmd == CMD_UPDATE or cmd == CMD_NEW:
        try:
            option.from_json(objson)
            option.save()    
        except Exception as e:
            return err_json(e)
    elif cmd == CMD_DELETE:
        if Option.objects.filter(rquestion=option.rquestion).count()<=1:
            return err_json('Cannot delete Option %s (one question must have at least one option).' % objson[T_ID])
        
        option.delete()
        return make_json(True, 'Option %s has been deleted.' % objson[T_ID], None)
    else:
        return err_json('Command code (%d) does not exist.' % cmd)
    
    return ok_json(option.to_json(withAnswers = (True if cmd == CMD_QUERY_CHILDREN else False)))

def commit_service(objson, cmd):
    
    commit, init = Commit.get_or_init(objson)
    
    if not commit:
        return err_json('Commit %s does not exist.' % objson[T_ID])
    
    if init:
        pass
    
    if cmd == CMD_QUERY or cmd == CMD_QUERY_CHILDREN:
        pass
    elif cmd == CMD_UPDATE or cmd == CMD_NEW:
        try:
            if cmd == CMD_NEW and (not T_ANSWERS in objson or not objson[T_ANSWERS]):
                return err_json('Cannot create new commit without answer(s).')
            else:
                janswers = objson[T_ANSWERS] if T_ANSWERS in objson else None
            
                commit.from_json(objson)
                commit.save()
                
                for janswer in janswers:
                    answer, init = Answer.get_or_init(janswer)
                    answer.from_json(janswer)
                    if init:
                        answer.rcommit = commit
                    answer.save()

        except Exception as e:
            return err_json(e)
    elif cmd == CMD_DELETE:
        commit.delete()
        return make_json(True, 'Commit %s has been deleted.' % objson[T_ID], None)
    else:
        return err_json('Command code (%d) does not exist.' % cmd)
    
    return ok_json(commit.to_json(withAnswers = (True if cmd == CMD_QUERY_CHILDREN else False)))

def statistics_service(topic=True, survey=True, visit=True, commit=True):
    try:
        statistics = {}
        
        if topic:
            statistics[T_TOPICCOUNT] = Topic.statistics()
        if survey:
            statistics[T_SURVEYCOUNT] = Survey.statistics()
        if visit:
            statistics[T_VISITCOUNT] = Visit.statistics()
        if commit:
            statistics[T_COMMITCOUNT] = Commit.statistics()
        
        return ok_json(statistics)
    except Exception as e:
        print(e)
        return err_json(e)

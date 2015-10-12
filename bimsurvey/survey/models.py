# coding=gbk
from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from string import *

# Create your models here.

USERFIELD_LEN = 64

CMD_NEW = 0
CMD_QUERY = 1
CMD_QUERY_CHILDREN = 2
CMD_UPDATE = 3
CMD_DELETE = 4
CMD_QUERY_STATISTICS = 5
CMD_COUNT = 6

PUBLISH_STATUS = (
    (0, 'new'),
    (1, 'running'),
    (2, 'closed'),
)

QUESTION_TYPE = (
    (0, 'choice'),
    (1, 'multiply'),
    (2, 'fill'),
    (3, 'picture'),
    (4, 'correct'),
    (5, 'vote'),
    (6, 'suggest'),
)

def to_json_list(queryset):
    return [row.to_json() for row in queryset]

def validate_json(clazz, objson, cmd):
    if not clazz:
        return False, 'Class should be provided.'
    
    if cmd<0 or cmd>=CMD_COUNT:
        return False, 'Command code (%d) does not exist.' % cmd
    
    if cmd == CMD_NEW:
        if T_ID in objson:
            return False, 'New object should not be provided with id field.'
        
        if clazz.FIELD_VALIDATIONS:
            for v in clazz.FIELD_VALIDATIONS:
                if not v[0] in objson:
                    return False, 'Field \'%s\' should be provided.' % v[0]
                elif not v[1](objson[v[0]]):
                    return False, 'Given value is invalid.(key:"%s\", value:%s)' % (v[0], objson[v[0]])
                else:
                    pass
    else:
        if not T_ID in objson:
            return False, 'Id field should be provided.(command code: %d)' % cmd
        try:
            clazz.objects.get(id=int(objson[T_ID]))
        except Exception as e:
            return False, 'The id provided is invalid.(Exception: %s)' % e
        
        if cmd == CMD_UPDATE and clazz.FIELD_VALIDATIONS:
            for v in clazz.FIELD_VALIDATIONS:
                if v[0] in objson and not v[1](objson[v[0]]):
                    return False, 'Given value is invalid.(field:%s, value:%s)' % (v[0], objson[v[0]])
                else:
                    pass          
    
    return True, ''

def statistics_by_month(clazz):
    import datetime
    today = datetime.date.today()
    yearbegin = datetime.datetime(today.year, 1, 1, 0, 0, 0, 0)
    thismonth = int(today.month)
    ts = clazz.objects.filter(createtime__gte = yearbegin)
    
    statistics = [None if thismonth<i else 0 for i in range(1, 13)]
    for t in ts:
        month = int(t.createtime.month)
        
        if isinstance(statistics[month], int):
            statistics[month-1] += 1
        else:
            statistics[month-1] = 1
            
    return statistics

# class ToJson():
#     def to_json(self):
#         fields = []
#         for field in self._meta.fields:
#             fields.append(field.name)
#     
#         d = {}
#         for attr in fields:
#             d[attr] = getattr(self, attr)
#     
#         import json
#         return json.dumps(d)

class UserInfo(models.Model):
    ruser = models.ForeignKey(User, unique=True)
    realname = models.CharField(max_length=USERFIELD_LEN, verbose_name=u'真实姓名')
    
    def __unicode__(self):
        return u'UserInfo: %s (%s)' % (self.realname, self.ruser.username)
    
    def from_json(self, json):
        self.realname = json[T_REALNAME] if T_REALNAME in json else self.realname
        
    def to_json(self):
        json = {T_ID:self.id, T_REALNAME:self.realname}
        json[T_USERNAME] = self.ruser.username
        json[T_EMAIL] = self.ruser.email
        
        return json
    
admin.site.register(UserInfo)
    
class ItemBase(models.Model):   
    title = models.CharField(max_length=256, verbose_name=u'标题')
    description = models.TextField(verbose_name=u'描述')
    
    class Meta:
        abstract = True
        
    def __unicode__(self):
        return u'%s' % self.title
    
    def from_json(self, json):
        self.title = json[T_TITLE] if T_TITLE in json else self.title
        self.description = json[T_DESCRIPTION] if T_DESCRIPTION in json else self.description
    
class Publishable(models.Model):
    createtime = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间', null=True, blank=True)
    publishtime = models.DateTimeField(verbose_name=u'发布时间', null=True, blank=True)
    closetime = models.DateTimeField(verbose_name=u'关闭时间', null=True, blank=True)
    status = models.IntegerField(choices=PUBLISH_STATUS, verbose_name=u'状态', null=True)
    
    def from_json(self, json):
        self.createtime = json[T_CREATETIME] if T_CREATETIME in json else self.createtime
        self.publishtime = json[T_PUBLISHTIME] if T_PUBLISHTIME in json else self.publishtime
        self.closetime = json[T_CLOSETIME] if T_CLOSETIME in json else self.closetime
        self.status = json[T_STATUS] if T_STATUS in json else self.status
    
    class Meta:
        abstract = True

    
class Topic(ItemBase, Publishable):
    ruserinfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    imgurl = models.CharField(max_length=260, null=True, blank=True)
    ispublic = models.BooleanField(default=True)
    
    @staticmethod
    def get_or_init(objson):
        obj = {}
        initialized = False
        if T_ID in objson and int(objson[T_ID]) >= 0:
            try:
                obj = Topic.objects.get(id=objson[T_ID])
            except Exception as e:
                print(e)
        else:
            obj = Topic()
            initialized = True
        
        return obj, initialized
    
    FIELD_VALIDATIONS = (
        (T_TITLE, lambda val: len(val)>0 and len(val)<256),
        (T_DESCRIPTION, lambda val: True),
        #(T_USERINFOID, lambda val: UserInfo.objects.filter(id=val).count() == 1),
        (T_IMGURL,lambda val: len(val)>0 and len(val)<260),
        (T_ISPUBLIC, lambda val: val == True or val == False),
        )
    
    @staticmethod
    def is_json_ok(objson, cmd):
        return validate_json(Topic, objson, cmd)
    
    @staticmethod
    def statistics():
        return statistics_by_month(Topic)
    
    def __unicode__(self):
        return u'Topic%d: %s' % (self.id, ItemBase.__unicode__(self))
    
    def surveys(self, *args, **kwargs):
        return Survey.objects.filter(rtopic=self, *args, **kwargs)
    
    def visits(self, *args, **kwargs):
        return Visit.objects.filter(rsurvey__in=self.surveys().values("id"), *args, **kwargs)
    
    def commits(self, *args, **kwargs):
        return Commit.objects.filter(rsurvey__in=self.surveys().values("id"), *args, **kwargs)
    
    def from_json(self, json):
        ItemBase.from_json(self, json)
        Publishable.from_json(self, json)
        
        if T_USERINFOID in json:
            try:
                userinfo = UserInfo.objects.get(id=int(json[T_USERINFOID]))
                self.ruserinfo = userinfo
            except Exception as e:
                print(e)
        
        self.imgurl = json[T_IMGURL] if T_IMGURL in json else self.imgurl
        self.ispublic = json[T_ISPUBLIC] if T_ISPUBLIC in json else self.ispublic
    
    def to_json(self, withSurveys = False):
        json = {T_ID:self.id, T_TITLE:self.title, T_DESCRIPTION:self.description}
        json[T_CREATETIME] = '%s' % self.createtime if self.createtime else None
        json[T_SURVEYCOUNT] = self.surveys().count()
        json[T_VISITCOUNT] = self.visits().count()
        json[T_COMMITCOUNT] = self.commits().count()
        json[T_IMGURL] = self.imgurl
        json[T_ISPUBLIC] = self.ispublic
        
        json[T_USERINFOID] = self.ruserinfo.id
        json[T_REALNAME] = self.ruserinfo.realname
        
        if withSurveys:
            json[T_SURVEYS] = to_json_list(self.surveys())
        
        return json        

admin.site.register(Topic)
    
class Survey(ItemBase, Publishable):
    ruserinfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    rtopic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    star = models.BooleanField(verbose_name=u'加星')
    allowanonymous = models.BooleanField(verbose_name=u'允许匿名')
    iprecord = models.BooleanField(verbose_name=u'记录IP')
    usernamerecord = models.BooleanField(verbose_name=u'记录用户名')
    realnameinput = models.BooleanField(verbose_name=u'输入真实姓名')
    mobileinput = models.BooleanField(verbose_name=u'输入手机号')
    emailinput = models.BooleanField(verbose_name=u'输入电子邮箱')
    
    @staticmethod
    def get_or_init(objson):
        obj = {}
        initialized = False
        if T_ID in objson and int(objson[T_ID]) >= 0:
            try:
                obj = Survey.objects.get(id=objson[T_ID])
            except Exception as e:
                print(e)
        else:
            obj = Survey()
            initialized = True
        
        return obj, initialized
    
    FIELD_VALIDATIONS = (
        (T_TITLE, lambda val: len(val)>0 and len(val)<256),
        (T_DESCRIPTION, lambda val: True),
        #(T_USERINFOID, lambda val: UserInfo.objects.filter(id=val).count() == 1),
        #(T_TOPICID, lambda val: Topic.objects.filter(id=val).count() == 1),
        (T_STAR, lambda val: val == True or val == False),
        (T_ALLOWANONYMOUS, lambda val: val == True or val == False),
        (T_IPRECORD, lambda val: val == True or val == False),
        (T_USERNAMERECORD, lambda val: val == True or val == False),
        (T_REALNAMEINPUT, lambda val: val == True or val == False),
        (T_MOBILEINPUT, lambda val: val == True or val == False),
        (T_EMAILINPUT, lambda val: val == True or val == False),
        (T_STATUS, lambda val: val>=0 and val<len(PUBLISH_STATUS)),
        )
    
    @staticmethod
    def is_json_ok(objson, cmd):
        return validate_json(Survey, objson, cmd)
    
    @staticmethod
    def statistics():
        return statistics_by_month(Survey)
    
    def __unicode__(self):
        return u'Survey%d: %s' % (self.id, ItemBase.__unicode__(self))
    
    def questions(self, *args, **kwargs):
        return Question.objects.filter(rsurvey=self, *args, **kwargs)
    
    def visits(self, *args, **kwargs):
        return Visit.objects.filter(rsurvey=self, *args, **kwargs)
    
    def commits(self, *args, **kwargs):
        return Commit.objects.filter(rsurvey=self, *args, **kwargs)
    
    def from_json(self, json):
        ItemBase.from_json(self, json)
        Publishable.from_json(self, json)
        
        if T_USERINFOID in json:
            try:
                userinfo = UserInfo.objects.get(id=int(json[T_USERINFOID]))
                self.ruserinfo = userinfo
            except Exception as e:
                print(e)
        
        if T_TOPICID in json:
            try:
                topic = Topic.objects.get(id=int(json[T_TOPICID]))
                self.rtopic = topic
            except Exception as e:
                print(e)
        
        self.star = json[T_STAR] if T_STAR in json else self.star
        self.allowanonymous = json[T_ALLOWANONYMOUS] if T_ALLOWANONYMOUS in json else self.allowanonymous
        self.iprecord = json[T_IPRECORD] if T_IPRECORD in json else self.iprecord
        self.usernamerecord = json[T_USERNAMERECORD] if T_USERNAMERECORD in json else self.usernamerecord
        self.realnameinput = json[T_REALNAMEINPUT] if T_REALNAMEINPUT in json else self.realnameinput
        self.mobileinput = json[T_MOBILEINPUT] if T_MOBILEINPUT in json else self.mobileinput
        self.emailinput = json[T_EMAILINPUT] if T_EMAILINPUT in json else self.emailinput
        self.status = json[T_STATUS] if T_STATUS in json else self.status
    
    def to_json(self, withChildren = False, withVisits = False, withCommits = False):
        json = {T_ID:self.id, T_TITLE:self.title, T_DESCRIPTION:self.description}
        json[T_CREATETIME] = '%s' % self.createtime if self.createtime else None
        json[T_PUBLISHTIME] = '%s' % self.publishtime if self.publishtime else None
        json[T_CLOSETIME] = '%s' % self.closetime if self.closetime else None
        json[T_STATUS] = self.status
        json[T_VISITCOUNT] = self.visits().count()
        json[T_COMMITCOUNT] = self.commits().count()
        json[T_TOPICID] = self.rtopic.id
        json[T_USERINFOID] = self.ruserinfo.id
        json[T_STAR] = self.star
        json[T_ALLOWANONYMOUS] = self.allowanonymous
        json[T_IPRECORD] = self.iprecord
        json[T_USERNAMERECORD] = self.usernamerecord
        json[T_REALNAMEINPUT] = self.realnameinput
        json[T_MOBILEINPUT] = self.mobileinput
        json[T_EMAILINPUT] = self.emailinput
        
        if withChildren:
            qs = self.questions()
            json[T_QUESTIONS] = [q.to_json(withOptions=True) for q in qs]
        
        if withVisits:
            json[T_VISITS] = to_json_list(self.visits())
            
        if withCommits:
            json[T_COMMITS] = to_json_list(self.commits())
        
        return json
    
admin.site.register(Survey)
    
class Question(ItemBase):
    rsurvey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    orderindex = models.IntegerField()
    notempty = models.BooleanField(verbose_name=u'必填')
    randomorder = models.BooleanField(verbose_name=u'选项顺序随机')
    minvalue = models.IntegerField(verbose_name=u'最小值')
    maxvalue = models.IntegerField(verbose_name=u'最大值')
    type = models.IntegerField(choices=QUESTION_TYPE, verbose_name=u'类型')
    
    @staticmethod
    def get_or_init(objson):
        obj = {}
        initialized = False
        if T_ID in objson and int(objson[T_ID]) >= 0:
            try:
                obj = Question.objects.get(id=objson[T_ID])
            except Exception as e:
                print(e)
        else:
            obj = Question()
            initialized = True
        
        return obj, initialized
    
    FIELD_VALIDATIONS = (
        (T_TITLE, lambda val: len(val)>0 and len(val)<256),
        (T_DESCRIPTION, lambda val: True),
        #(T_SURVEYID, lambda val: Survey.objects.filter(id=val).count() == 1),
        (T_ORDERINDEX, lambda val: val >= 0),
        (T_NOTEMPTY, lambda val: val == True or val == False),
        (T_RANDOMORDER, lambda val: val == True or val == False),
        (T_MINVALUE, lambda val: val>=0),
        (T_MAXVALUE, lambda val: val>=1),
        (T_TYPE, lambda val: val>=0 and val<len(QUESTION_TYPE))
        )
    
    @staticmethod
    def is_json_ok(objson, cmd):
        if T_OPTIONS in objson and objson[T_OPTIONS]:
            for joption in objson[T_OPTIONS]:
                valid, err = validate_json(Option, joption, cmd)
                if not valid:
                    return valid, err 
        return validate_json(Question, objson, cmd)
    
    def __unicode__(self):
        return u'Question%d: %s' % (self.id, ItemBase.__unicode__(self))
    
    def options(self, *args, **kwargs):
        return Option.objects.filter(rquestion=self, *args, **kwargs)
    
    def answers(self, *args, **kwargs):
        return Answer.objects.filter(roption__in = Option.objects.filter(rquestion=self), *args, **kwargs)
    
    def from_json(self, json):
        ItemBase.from_json(self, json)
        
        if T_SURVEYID in json:
            try:
                survey = Survey.objects.get(id=int(json[T_SURVEYID]))
                self.rsurvey = survey
            except Exception as e:
                print(e)
            
        self.orderindex = json[T_ORDERINDEX] if T_ORDERINDEX in json else self.orderindex
        self.notempty = json[T_NOTEMPTY] if T_NOTEMPTY in json else self.notempty
        self.randomorder = json[T_RANDOMORDER] if T_RANDOMORDER in json else self.randomorder
        self.minvalue = json[T_MINVALUE] if T_MINVALUE in json else self.minvalue
        self.maxvalue = json[T_MAXVALUE] if T_MAXVALUE in json else self.maxvalue
        self.type = json[T_TYPE] if T_TYPE in json else self.type
    
    def to_json(self, withOptions = False, withAnswers = False):
        json = {T_ID:self.id, T_TITLE:self.title, T_DESCRIPTION:self.description}
        json[T_SURVEYID] = self.rsurvey.id
        json[T_ORDERINDEX] = self.orderindex
        json[T_NOTEMPTY] = self.notempty
        json[T_RANDOMORDER] = self.randomorder
        json[T_MINVALUE] = self.minvalue
        json[T_MAXVALUE] = self.maxvalue
        json[T_TYPE] = self.type
        
        if withOptions:
            json[T_OPTIONS] = to_json_list(self.options())
            
        if withAnswers:
            json[T_ANSWERS] = to_json_list(self.answers())
        
        return json
    
admin.site.register(Question)
    
class Option(ItemBase):
    rquestion = models.ForeignKey(Question, on_delete=models.CASCADE)
    orderindex = models.IntegerField()
    allowinput = models.BooleanField(verbose_name=u'允许输入')
    
    @staticmethod
    def get_or_init(objson):
        obj = {}
        initialized = False
        if T_ID in objson and int(objson[T_ID]) >= 0:
            try:
                obj = Option.objects.get(id=objson[T_ID])
            except Exception as e:
                print(e)
        else:
            obj = Option()
            initialized = True
        
        return obj, initialized
    
    FIELD_VALIDATIONS = (
        (T_TITLE, lambda val: len(val)>0 and len(val)<256),
        (T_DESCRIPTION, lambda val: True),
        #(T_QUESTIONID, lambda val: Question.objects.filter(id=val).count() == 1),
        (T_ORDERINDEX, lambda val: val >= 0),
        (T_ALLOWINPUT, lambda val: val == True or val == False),
        )
    
    @staticmethod
    def is_json_ok(objson, cmd):
        return validate_json(Option, objson, cmd)
    
    def __unicode__(self):
        return u'Option%d: %s' % (self.id, ItemBase.__unicode__(self))
    
    def answers(self, *args, **kwargs):
        return Answer.objects.filter(roption=self, *args, **kwargs)
    
    def from_json(self, json):
        ItemBase.from_json(self, json)
        
        if T_QUESTIONID in json:
            try:
                question = Question.objects.get(id=int(json[T_QUESTIONID]))
                self.rquestion = question
            except Exception as e:
                print(e)
            
        self.orderindex = json[T_ORDERINDEX] if T_ORDERINDEX in json else self.orderindex
        self.allowinput = json[T_ALLOWINPUT] if T_ALLOWINPUT in json else self.allowinput
            
    
    def to_json(self, withAnswers = False):
        json = {T_ID:self.id, T_TITLE:self.title, T_DESCRIPTION:self.description}
        json[T_QUESTIONID] = self.rquestion.id
        json[T_ORDERINDEX] = self.orderindex
        json[T_ALLOWINPUT] = self.allowinput
        
        if withAnswers:
            json[T_ANSWERS] = to_json_list(self.answers())
            
        if self.rquestion.type == 5: #vote
            total = self.rquestion.answers().count()
            cur = self.answers().count()
            json[T_RATE] = (100.0 * float(cur) / float(total)) if total>0 else float(0)
            
        return json
        
admin.site.register(Option)

"""
TODO: Complete validations from Visit to the end.
"""
    
class Visit(models.Model):
    rsurvey = models.ForeignKey(Survey, null=True, blank=True, on_delete=models.CASCADE)
    rtopic = models.ForeignKey(Topic, null=True, blank=True, on_delete=models.CASCADE)
    ipaddr = models.IPAddressField(verbose_name=u'IP地址', null=True, blank=True)
    referer = models.CharField(max_length=512, verbose_name=u'跳转引用', null=True, blank=True)
    createtime = models.DateTimeField(verbose_name=u'访问时间', auto_now_add=True)
    
    @staticmethod
    def get_or_init(objson):
        obj = {}
        initialized = False
        if T_ID in objson and int(objson[T_ID]) >= 0:
            try:
                obj = Visit.objects.get(id=objson[T_ID])
            except Exception as e:
                print(e)
        else:
            obj = Visit()
            initialized = True
        
        return obj, initialized
    
    def __unicode__(self):
        return u'Visit%d: (%s), (%s) @ %s at %s' % (self.id, self.rtopic, self.rsurvey, self.ipaddr, self.createtime)
    
    def from_json(self, json):
        if T_SURVEYID in json:
            try:
                survey = Survey.objects.get(id=int(json[T_SURVEYID]))
                self.rsurvey = survey
            except:
                pass
            
        if T_TOPICID in json:
            try:
                topic = Topic.objects.get(id=int(json[T_TOPICID]))
                self.rtopic = topic
            except:
                pass
        
        self.ipaddr = json[T_IPADDR] if T_IPADDR in json else self.ipaddr
        self.referer = json[T_REFERER] if T_REFERER in json else self.referer
        
    def to_json(self):
        json = {T_ID:self.id}
        json[T_SURVEYID] = self.rsurvey.id
        json[T_TOPICID] = self.rtopic.id
        json[T_IPADDR] = self.ipaddr
        json[T_REFERER] = self.referer
        json[T_CREATETIME] = '%s' % self.createtime if self.createtime else None
        
        return json
    
    @staticmethod
    def statistics():
        return statistics_by_month(Visit)
    
admin.site.register(Visit)
    
class Commit(Visit):
    timeusesec = models.IntegerField(verbose_name=u'用时（秒）')
    ruserinfo = models.ForeignKey(UserInfo, null=True, on_delete=models.SET_NULL)
    realname = models.CharField(max_length=USERFIELD_LEN, null=True, verbose_name=u'真实姓名')
    mobile = models.CharField(max_length=USERFIELD_LEN, null=True, verbose_name=u'手机号')
    email = models.EmailField(null=True, verbose_name=u'电子邮箱')
    
    @staticmethod
    def get_or_init(objson):
        obj = {}
        initialized = False
        if T_ID in objson and int(objson[T_ID]) >= 0:
            try:
                obj = Commit.objects.get(id=objson[T_ID])
            except Exception as e:
                print(e)
        else:
            obj = Commit()
            initialized = True
        
        return obj, initialized
    
    @staticmethod
    def statistics():
        return statistics_by_month(Commit)
    
    def __unicode__(self):
        return u'Commit%d: (%s), (%s) @ %s at %s' % (self.id, self.rsurvey, self.ipaddr, self.createtime)
    
    def from_json(self, json):
        Visit.from_json(self, json)
        
        if T_USERINFOID in json:
            try:
                userinfo = UserInfo.objects.get(id=int(json[T_USERINFOID]))
                self.ruserinfo = userinfo
            except Exception as e:
                print(e)
        
        self.timeusesec = json[T_TIMEUSESEC] if T_TIMEUSESEC in json else self.timeusesec
        self.realname = json[T_REALNAME] if T_REALNAME in json else self.realname
        self.mobile = json[T_MOBILE] if T_MOBILE in json else self.mobile
        self.email = json[T_EMAIL] if T_EMAIL in json else self.email
        
    
    def to_json(self):
        json = Visit.to_json(self)
        json[T_TIMEUSESEC] = self.timeusesec
        json[T_USERINFOID] = self.ruserinfo.id if self.ruserinfo else None
        json[T_REALNAME] = self.realname if self.ruserinfo == None else self.ruserinfo.realname
        json[T_MOBILE] = self.mobile
        json[T_EMAIL] = self.email
        
        return json

admin.site.register(Commit)
    
class Answer(ItemBase):
    rcommit = models.ForeignKey(Commit, on_delete=models.CASCADE)
    roption = models.ForeignKey(Option, on_delete=models.CASCADE)
    
    @staticmethod
    def get_or_init(objson):
        obj = {}
        initialized = False
        if T_ID in objson and int(objson[T_ID]) >= 0:
            try:
                obj = Answer.objects.get(id=objson[T_ID])
            except Exception as e:
                print(e)
        else:
            obj = Answer()
            initialized = True
        
        return obj, initialized
    
    def __unicode__(self):
        return u'Answer%d: %s, %s (%s)' % (self.id, self.rcommit, self.roption, ItemBase.__unicode__(self))
    
    def from_json(self, json):
        ItemBase.from_json(self, json)
        
        if T_COMMITID in json:
            try:
                commit = Commit.objects.get(id=int(json[T_COMMITID]))
                self.rcommit = commit
            except Exception as e:
                print(e)
        
        if T_OPTIONID in json:
            try:
                option = Option.objects.get(id=int(json[T_OPTIONID]))
                self.roption = option
            except Exception as e:
                print(e)
    
    def to_json(self):
        json = {T_ID:self.id, T_TITLE:self.title, T_DESCRIPTION:self.description}
        json[T_COMMITID] = self.rcommit.id
        json[T_OPTIONID] = self.roption.id
        return json
    
admin.site.register(Answer)
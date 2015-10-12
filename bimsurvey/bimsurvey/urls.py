from django.conf.urls import patterns, include, url
from bimsurvey import settings
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bimsurvey.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^test/$', r'survey.views.test'),
    
    url(r'^topics/$', r'survey.views.topics'),
    url(r'^topic/([0-9]+)/$', r'survey.views.topic'),
    url(r'^survey/([0-9]+)/$', r'survey.views.survey'),
    url(r'^edit/([0-9]+)/$', r'survey.views.edit'),
    url(r'^statistics/$', r'survey.views.statistics'),
    
    url(r'^ajax_login/$', r'survey.ajaxs.ajax_login'),
    url(r'^ajax_logout/$', r'survey.ajaxs.ajax_logout'),
    url(r'^ajax_topics/$', r'survey.ajaxs.ajax_topics'),
    url(r'^ajax_topic/([0-9]+)/$', r'survey.ajaxs.ajax_topic'), 
    url(r'^ajax_survey/([0-9]+)/$', r'survey.ajaxs.ajax_survey'), 
    url(r'^ajax_question/([0-9]+)/$', r'survey.ajaxs.ajax_question'),
    url(r'^ajax_option/([0-9]+)/$', r'survey.ajaxs.ajax_option'),
    url(r'^ajax_commit/([0-9]+)/$', r'survey.ajaxs.ajax_commit'),
    url(r'^ajax_statistics/$', r'survey.ajaxs.ajax_statistics'),
    
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT }),   
    url(r'^static/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT}),
)

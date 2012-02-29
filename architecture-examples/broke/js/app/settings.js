;(function(context, undefined){
    
    todo.settings= {
        MIDDLEWARE_CLASSES: []
        ,DEBUG_PROPAGATE_EXCEPTIONS: true
        ,LANGUAGE_CODE: 'en'
        ,TEMPLATE_LOADERS: [
            'broke.template.loaders.apps'
            ,'broke.template.loaders.remote'
        ]
        ,EVENT_TRIGGERING_METHOD: 'elements'
        ,HIDE_HASH: true
        ,USE_I18N: true
        ,DEBUG: false
        ,GET_LATEST_BY: 'title'
        ,INSTALLED_APPS: [
            'todo'
        ]
        ,ROOT_URLCONF: 'todo.urls'
        ,URL_CHANGING_ELEMENTS: broke.extend(broke.conf.settings.URL_CHANGING_ELEMENTS, {
            'input': {
                events: ['click']
                ,urlAttribute: 'data-href'
            }
            ,'div': {
                events: ['dblclick']
                ,urlAttribute: 'data-href'
            }
        })
        /*,DATABASES: broke.extend(broke.conf.settings.DATABASES, {
            'localStorage': {
                NAME: ''
                ,ENGINE: 'broke.db.engines.LocalStorage'
                ,USER: ''
                ,PASSWORD: ''
            }
        })*/
    };

})(this);
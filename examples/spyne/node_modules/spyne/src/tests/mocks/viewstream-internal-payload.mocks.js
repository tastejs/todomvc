const internalViewStreamPayload = {
  'channel': 'UI',
  'action': 'CHANNEL_UI_CLICK_EVENT',
  'channelPayload': {
    'type': 'link',
    'linkType': 'external',
    'url': 'https://github.com/spynejs/spyne'
  },
  'srcElement': {
    'vsid': 'header',
    'isLocalEvent': false,
    'viewName': 'HeaderView',
    'event': 'click',
    'el': ''
  },
  'event': {
    'isTrusted': true
  }
};

const internvalRouteChannelPayload = {
  'channel': 'CHANNEL_ROUTE',
  'action': 'CHANNEL_ROUTE_CHANGE_EVENT',
  'channelPayload': {
    'isDeepLink': false,
    'routeCount': 1,
    'routeKeyword': 'pageId',
    'routeKeywordsArr': [
      'pageId'
    ],
    'routeData': {
      'pageId': 'guide',
      'section': 'reference',
      'menuItem': ''
    },
    'routeValue': 'guide/reference',
    'isHash': false,
    'isHidden': false,
    'routeType': 'slash'
  },
  'srcElement': {
    'vsid': 'header',
    'isLocalEvent': false,
    'viewName': 'HeaderView',
    'event': 'click',
    'el': {}
  },
  'event': {
    'isTrusted': true
  },
  'location': {
    'href': 'http://10.0.1.34:8080/guide/reference',
    'origin': 'http://10.0.1.34:8080',
    'protocol': 'http:',
    'host': '10.0.1.34:8080',
    'hostname': '10.0.1.34',
    'port': '8080',
    'pathname': '/guide/reference',
    'search': '',
    'hash': ''
  }
};

export { internalViewStreamPayload, internvalRouteChannelPayload };

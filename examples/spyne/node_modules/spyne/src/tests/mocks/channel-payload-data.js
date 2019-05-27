const DeepLinkData = {
  'route': {
    'routedParamsArr': [
      'pageId'
    ],
    'routedParam': 'pageId',
    'params': {
      'pageId': 'page-one'
    },
    'routeValue': '/page-one',
    'routeCount': 0,
    'isDeepLink': true
  },
  'location': {
    'href': 'http://10.0.1.10:8080/page-one',
    'origin': 'http://10.0.1.10:8080',
    'protocol': 'http:',
    'host': '10.0.1.10:8080',
    'hostname': '10.0.1.10',
    'port': '8080',
    'pathname': '/page-one',
    'search': '',
    'hash': ''
  },
  'action': 'CHANNEL_ROUTE_CHANGE_EVENT'
};

const ChannelPayloadUIData = {
  'data': {
    'params': {
      'val': 6,
      'bool' : true,
      'pageId': 'page-one'
    },
    'channel': 'UI',
    'vsid': 'vsid-1703768',
    'viewName': 'AppView',
    'event': 'click',
    'el': 'h6.nav-btn'
  },
  'mouse': {
    'altKey': false,
    'bubbles': true,
    'cancelBubble': false,
    'cancelable': true,
    'clientX': 133,
    'clientY': 24,
    'composed': true,
    'ctrlKey': false,
    'currentTarget': null,
    'defaultPrevented': false,
    'detail': 1,
    'eventPhase': 0,
    'fromElement': null,
    'isTrusted': true,
    'layerX': 68,
    'layerY': 18,
    'metaKey': false,
    'movementX': 0,
    'movementY': 0,
    'offsetX': 69,
    'offsetY': 19,
    'pageX': 133,
    'pageY': 24,
    'path': '',
    'relatedTarget': null,
    'returnValue': true,
    'screenX': 697,
    'screenY': 258,
    'shiftKey': false,
    'sourceCapabilities': '',
    'srcElement': '',
    'target': '',
    'timeStamp': 6963.200000114739,
    'toElement': '',
    'type': 'click',
    'view': '',
    'which': 1,
    'x': 133,
    'y': 24
  }
};

const ChannelPayloadRouteData = {
    'payload': {
      'routeVal': 'page-one',
      'pageId': 'page-one',
      'val' : 6
    },
    'channel': 'ROUTE',
    'vsid': 'vsid-1703768',
    'viewName': 'AppView',
    'event': 'click',
    'el': 'h6.nav-btn',

  'event': {
    'altKey': false,
    'bubbles': true,
    'cancelBubble': false,
    'cancelable': true,
    'clientX': 133,
    'clientY': 24,
    'composed': true,
    'ctrlKey': false,
    'currentTarget': null,
    'defaultPrevented': false,
    'detail': 1,
    'eventPhase': 0,
    'fromElement': null,
    'isTrusted': true,
    'layerX': 68,
    'layerY': 18,
    'metaKey': false,
    'movementX': 0,
    'movementY': 0,
    'offsetX': 69,
    'offsetY': 19,
    'pageX': 133,
    'pageY': 24,
    'path': '',
    'relatedTarget': null,
    'returnValue': true,
    'screenX': 697,
    'screenY': 258,
    'shiftKey': false,
    'sourceCapabilities': '',
    'srcElement': '',
    'target': '',
    'timeStamp': 6963.200000114739,
    'toElement': '',
    'type': 'click',
    'view': '',
    'which': 1,
    'x': 133,
    'y': 24
  }
};

const ChannelPayloadRouteDataRegexOverride = {
  'isDeepLink': false,
  'routeCount': 1,
  'pathInnermost': 'pageId',
  'paths': [
    'pageId'
  ],
  'routeData': {
    'pageId': 'home',
    'pageIdValue': '',
    'section': '',
    'menuItem': ''
  },
  'routeValue': '^$|index.html',
  'isHash': false,
  'isHidden': false,
  'routeType': 'slash',
  'pathsAdded': [],
  'pathsRemoved': [],
  'pathsChanged': [
    'pageId'
  ]
};

export { ChannelPayloadUIData, ChannelPayloadRouteData, DeepLinkData, ChannelPayloadRouteDataRegexOverride };

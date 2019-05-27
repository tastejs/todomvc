const payloadNoEvent = {
  "viewStreamInfo": {
    "payload": {
      "type": "menuItem",
      "menuItem": "channel-payload",
      "contentMenuSection": "4"
    },
    "channel": "UI",
    "srcElement": {
      "id": "channel-payload",
      "vsid": "vsid-4599787",
      "isLocalEvent": false,
      "viewName": "PageGuideSidebarItemView",
      "srcEvent": "click",
      "el": {}
    }
  },
  "uiEvent": {
    "isTrusted": true
  },
  "action": "CHANNEL_UI_CLICK_EVENT"
};

const payloadPreventDefault = {
  "viewStreamInfo": {
    "payload": {
      "type": "link",
      "eventPreventDefault": "true",
      "linkType": "external",
      "url": "https://github.com/spynejs/spyne"
    },
    "srcElement": {
      "id": "header",
      "vsid": "vsid-3248706",
      "isLocalEvent": false,
      "viewName": "HeaderView",
      "srcEvent": "click",
      "el": {}
    }
  },
  "uiEvent": {
    "isTrusted": true
  },
  "action": "CHANNEL_UI_CLICK_EVENT"
};

const payloadTwoEvents =  {
  "viewStreamInfo": {
    "payload": {
      "type": "link",
      "eventPreventDefault": "true",
      "eventStopPropagation": "true",
      "linkType": "external",
      "url": "https://github.com/spynejs/spyne"
    },
    "srcElement": {
      "id": "header",
      "vsid": "vsid-3248706",
      "isLocalEvent": false,
      "viewName": "HeaderView",
      "srcEvent": "click",
      "el": {}
    }
  },
  "uiEvent": {
    "isTrusted": true
  },
  "action": "CHANNEL_UI_CLICK_EVENT"
};


const payloadStopPropagation = {
  "viewStreamInfo": {
    "payload": {
      "type": "link",
      "eventStopPropagation": "true",
      "linkType": "external",
      "url": "https://github.com/spynejs/spyne"
    },
    "srcElement": {
      "id": "header",
      "vsid": "vsid-3248706",
      "isLocalEvent": false,
      "viewName": "HeaderView",
      "srcEvent": "click",
      "el": {}
    }
  },
  "uiEvent": {
    "isTrusted": true
  },
  "action": "CHANNEL_UI_CLICK_EVENT"
};

const payloadEmptyEvent = {
  "viewStreamInfo": {
    "payload": {
      "type": "link",
      "eventTest": "true",
      "linkType": "external",
      "url": "https://github.com/spynejs/spyne"
    },
    "srcElement": {
      "id": "header",
      "vsid": "vsid-3248706",
      "isLocalEvent": false,
      "viewName": "HeaderView",
      "srcEvent": "click",
      "el": {}
    }
  },
  "uiEvent": {
    "isTrusted": true
  },
  "action": "CHANNEL_UI_CLICK_EVENT"
};

export {payloadEmptyEvent, payloadNoEvent,payloadTwoEvents, payloadPreventDefault, payloadStopPropagation}



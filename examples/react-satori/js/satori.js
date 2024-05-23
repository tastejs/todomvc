var app = app || {};
var ENDPOINT = 'wss://gu82di8f.api.satori.com';
var APPKEY = '27dDd95ca394E06db9D917C2932609AD';

(function () {
  'use strict';

  var rtm;
  app.Satori = {
    init: function () {
      rtm = new RTM(ENDPOINT, APPKEY);
      rtm.start();
    },

    subscribe: function (name, cb) {
      var channel = rtm.subscribe(name, RTM.SubscriptionMode.RELIABLE, {
        history: {
          count: 99,
        },
      });
      channel.on('rtm/subscription/data', function (pdu) {
        var messages = pdu.body.messages;
        messages.forEach(function (message) {
          cb(message);
        });
      });
    },

    publish: function (name, msg) {
      rtm.publish(name, msg);
    }
  };
})();

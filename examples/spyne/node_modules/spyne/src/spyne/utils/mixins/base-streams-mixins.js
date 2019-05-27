import { ViewStreamPayload } from '../../views/view-stream-payload';

export function baseStreamsMixins() {
  return {
    testFunc: function(str) {
      console.log('stream mixin is ', str);
    },
    sendRoutePayload: function(obs, data) {
      return new ViewStreamPayload('CHANNEL_ROUTE', obs, data, 'subscribe');
    },
    sendUIPayload: function(obs, data) {
      return new ViewStreamPayload('CHANNEL_UI', obs, data, 'subscribe');
    },
    /*
    sendInfoToChannel: function(channelName, payload) {
      const getProp = str => prop(str, this.props);
      const channel = channelName;
      let srcElement = {
        vsid: getProp('vsid'),
        el: getProp('el'),
        viewName: getProp('name')
      };
      let data = {
        payload, channel, srcElement
      };
      return new ViewStreamPayload(channelName, new of(''), data,
        'subscribe');
    },
    */
/*    sendLifeStreamPayload: function(obs, data) {
      return new ViewStreamPayload('LIFESTREAM', obs, data, 'subscribe');
    },

    createLifeStreamPayload: function(STEP, data = {}, type = 'parent') {
      let viewId = `${this.props.name}: ${this.props.vsid}`;
      return new LifestreamPayload('LIFESTREAM', STEP, type, viewId, data).data;
    }*/
  };
}

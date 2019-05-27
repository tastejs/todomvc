import { Channel } from './channel';
import {prop} from 'ramda';

export class SpyneChannelLifecycle extends Channel {
  /**
   * @module SpyneChannelLifecycle
   * @type core
   *
   * @desc
   * Internal Channel that publishes rendering and disposing events of all ViewStreams whose property, proper.sendLifecycleEvents is set to true.
   *
   * <h3>The two actions that are regsitered for this channel are:</h3>
   * <ul>
   * <li>CHANNEL_LIFECYCLE_RENDERED_EVENT</li>
   * <li>CHANNEL_LIFECYCLE_DISPOSED_EVENT</li>
   *  </ul>
   * @constructor
   * @property {String} CHANNEL_NAME - = 'CHANNEL_LIFECYCLE';
   */

  constructor(props = {}) {
    super('CHANNEL_LIFECYCLE', props);
  }

  addRegisteredActions() {
    return [
      'CHANNEL_LIFECYCLE_RENDERED_EVENT',
      'CHANNEL_LIFECYCLE_DISPOSED_EVENT'
    ];
  }

  onViewStreamInfo(obj) {
    let {data, action, srcElement} = obj.props();
    let payload = srcElement;
    payload['action'] = action;
    this.onSendEvent(action, payload);
  }

  onSendEvent(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    const delayStream = () => this.sendChannelPayload(action, payload, srcElement, event);
    window.setTimeout(delayStream, 0);
  }
}

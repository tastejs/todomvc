import {mergeAll, compose, mergeDeepRight, mergeRight, pathEq, includes, pickAll, __} from 'ramda';

export class ChannelPayload {
  /**
   *
   * All Channel data is published using this interface.
   * @module ChannelPayload
   * @type internal
   *
   * @constructor
   * @param {String} channelName
   * @param {String} action
   * @param {Object} payload
   * @param {Element} srcElement
   * @param {Event} event
   *
   * @property {String} channelName - = undefined; The name of the Channel that is sending the payload.
   * @property {String} action - = undefined; An action string that has been registered within the Channel's addRegisteredActions method.
   * @property {Object} payload - = undefined; The data object.
   * @property {HTMLElement} srcElement - = {}; This is populated when triggered from a ViewStream instance.
   * @property {UIEvent} event - = undefined; The UIEvent, if any.
   * @returns Validated ChannelPayload json object
   */
  constructor(channelName, action, payload, srcElement, event) {
    let channel = channelName;

    let channelPayloadItemObj = { channelName, action, payload, srcElement, event };

    /**
     * This is a convenience method that helps with descructuring by merging all properties.
     *
     * @returns
     * JSON Object
     *
     * @example
     * TITLE['<h4>Destructuring Properties using the ChannelPayload props Method</h4>']
     * let {el, action, myVal} = payload.props();
     *
     *
     */

    const isDebugMode =  pathEq(['Spyne','config', 'debug'], true)(window);

    if (isDebugMode === true){
      if (payload.hasOwnProperty('payload')){
        let payloadStr = JSON.stringify(payload);
        console.warn(`Spyne Warning: the following payload contains a nested payload property which may create conflicts: Action: ${action}, ${payloadStr}`);
      }
    }



    channelPayloadItemObj.props = () => mergeAll([{payload:channelPayloadItemObj.payload},channelPayloadItemObj.payload, { channel }, { event: event }, channelPayloadItemObj.srcElement, { action: channelPayloadItemObj.action }]);


    const channelActionsArr = window.Spyne.getChannelActions(channel);

    ChannelPayload.validateAction(action, channel, channelActionsArr);

    if (channel === 'CHANNEL_ROUTE') {
      channelPayloadItemObj['location'] = ChannelPayload.getLocationData();
    }

    return channelPayloadItemObj;
  }

  static validateAction(action, channel, arr) {
    let isInArr = includes(action, arr);
    if (isInArr === false && window.Spyne !== undefined) {
      console.warn(`warning: Action: '${action}' is not registered within the ${channel} channel!`);
    }
    return isInArr;
  }

  static getLocationData() {
    const locationParamsArr = [
      'href',
      'origin',
      'protocol',
      'host',
      'hostname',
      'port',
      'pathname',
      'search',
      'hash'];
    return pickAll(locationParamsArr, window.location);
  }

  static getStreamItem() {

  }

  static getMouseEventKeys() {
    return ['altKey', 'bubbles', 'cancelBubble', 'cancelable', 'clientX', 'clientY', 'composed', 'ctrlKey', 'currentTarget', 'defaultPrevented', 'detail', 'eventPhase', 'fromElement', 'isTrusted', 'layerX', 'layerY', 'metaKey', 'movementX', 'movementY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'path', 'relatedTarget', 'returnValue', 'screenX', 'screenY', 'shiftKey', 'sourceCapabilities', 'srcElement', 'target', 'timeStamp', 'toElement', 'type', 'view', 'which', 'x', 'y'];
  }
}

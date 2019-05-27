import { Channel } from './channel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {equals, path, compose,prop, filter,replace, lensProp, over, omit, test, keys, either, toUpper} from 'ramda';

export class SpyneChannelUI extends Channel {
  /**
   * @module SpyneChannelUI
   * @type core
   *
   * @desc
   * <p>This Channel listens to all User Events that have been set to broadcast by ViewStream instances, using the broadCastEvents method.</p>
   * <p>HTML Elements that have their data channel property set to "ROUTE" will broadcast their ui event to that channel instead.</p>
   * <div class='btn btn-blue-ref btn-console modal-btn'  data-type='modal-window' data-value='uiEvents'>View UI Events</div></br></br>
   * <p>See LINK['ViewStream', 'view-stream'] for an example on how to bind HTML Elements to the UI Channel.</p>
   *
   * @constructor
   * @property {String} CHANNEL_NAME - = 'CHANNEL_UI';
   *
   *
   */

  constructor(name = 'CHANNEL_UI', props = {}) {
    props.sendCachedPayload = false;
    super(name, props);
    this.keyEventsLoaded = false;
    this.keyCodeArr = [];
    // this.addKeyEvent(13);
  }

  addRegisteredActions() {
    return [
      'CHANNEL_UI_ANIMATIONEND_EVENT',
      'CHANNEL_UI_ANIMATIONITERATION_EVENT',
      'CHANNEL_UI_ANIMATIONSTART_EVENT',
      'CHANNEL_UI_AUDIOEND_EVENT',
      'CHANNEL_UI_AUDIOPROCESS_EVENT',
      'CHANNEL_UI_AUDIOSTART_EVENT',
      'CHANNEL_UI_BLUR_EVENT',
      'CHANNEL_UI_CACHED_EVENT',
      'CHANNEL_UI_CANPLAYTHROUGH_EVENT',
      'CHANNEL_UI_CANPLAY_EVENT',
      'CHANNEL_UI_CHANGE_EVENT',
      'CHANNEL_UI_CHECKBOXSTATECHANGE_EVENT',
      'CHANNEL_UI_CLICK_EVENT',
      'CHANNEL_UI_COMPLETE_EVENT',
      'CHANNEL_UI_COPY_EVENT',
      'CHANNEL_UI_CUT_EVENT',
      'CHANNEL_UI_DBLCLICK_EVENT',
      'CHANNEL_UI_DURATIONCHANGE_EVENT',
      'CHANNEL_UI_EMPTIED_EVENT',
      'CHANNEL_UI_ENDED_EVENT',
      'CHANNEL_UI_EVENT',
      'CHANNEL_UI_FOCUSIN_EVENT',
      'CHANNEL_UI_FOCUSOUT_EVENT',
      'CHANNEL_UI_FOCUS_EVENT',
      'CHANNEL_UI_HASHCHANGE_EVENT',
      'CHANNEL_UI_INPUT_EVENT',
      'CHANNEL_UI_KEYDOWN_EVENT',
      'CHANNEL_UI_KEYPRESS_EVENT',
      'CHANNEL_UI_KEYUP_EVENT',
      'CHANNEL_UI_LOADEDDATA_EVENT',
      'CHANNEL_UI_LOADEDMETADATA_EVENT',
      'CHANNEL_UI_MOUSEDOWN_EVENT',
      'CHANNEL_UI_MOUSEENTER_EVENT',
      'CHANNEL_UI_MOUSELEAVE_EVENT',
      'CHANNEL_UI_MOUSEMOVE_EVENT',
      'CHANNEL_UI_MOUSEOUT_EVENT',
      'CHANNEL_UI_MOUSEOVER_EVENT',
      'CHANNEL_UI_MOUSEUP_EVENT',
      'CHANNEL_UI_PAUSE_EVENT',
      'CHANNEL_UI_PLAYING_EVENT',
      'CHANNEL_UI_PLAY_EVENT',
      'CHANNEL_UI_RADIOSTATECHANGE_EVENT',
      'CHANNEL_UI_RATECHANGE_EVENT',
      'CHANNEL_UI_READYSTATECHANGE_EVENT',
      'CHANNEL_UI_SEEKED_EVENT',
      'CHANNEL_UI_SEEKING_EVENT',
      'CHANNEL_UI_SELECT_EVENT',
      'CHANNEL_UI_STALLED_EVENT',
      'CHANNEL_UI_SUBMIT_EVENT',
      'CHANNEL_UI_SUSPEND_EVENT',
      'CHANNEL_UI_SVGABORT_EVENT',
      'CHANNEL_UI_SVGERROR_EVENT',
      'CHANNEL_UI_SVGLOAD_EVENT',
      'CHANNEL_UI_SVGRESIZE_EVENT',
      'CHANNEL_UI_SVGSCROLL_EVENT',
      'CHANNEL_UI_SVGUNLOAD_EVENT',
      'CHANNEL_UI_SVGZOOM_EVENT',
      'CHANNEL_UI_TIMEUPDATE_EVENT',
      'CHANNEL_UI_TOUCHCANCEL_EVENT',
      'CHANNEL_UI_TOUCHEND_EVENT',
      'CHANNEL_UI_TOUCHMOVE_EVENT',
      'CHANNEL_UI_TOUCHSTART_EVENT',
      'CHANNEL_UI_TRANSITIONEND_EVENT',
      'CHANNEL_UI_VALUECHANGE_EVENT',
      'CHANNEL_UI_VOLUMECHANGE_EVENT',
      'CHANNEL_UI_WAITING_EVENT'
    ];
  }

  loadKeyStream() {
    let keyUps = Observable.fromEvent(document, 'keyup');
    let filterKeys = e => this.keyCodeArr.indexOf(e.keyCode) >= 0;
    this.keyPresses$ = keyUps.groupBy(e => e.keyCode)
      .mergeAll()
      .filter(filterKeys)
      .repeat()
      .subscribe(this.onKeyPressed.bind(this));
  }

  addKeyEvent(num) {
    if (this.keyEventsLoaded === false) {
      this.loadKeyStream();
    }
    this.keyEventsLoaded = true;
    this.registerKey(num);
  }

  registerKey(c) {
    this.keyCodeArr.push(c);
  }

  onKeyPressed(evt) {
    console.log('key is ', evt);
  }
  static removeSSID(pl){
    const routeLens = lensProp(['payload']);
    const omitSSID = over(routeLens, omit(['vsid']));
    return omitSSID(pl);
  }


  onIncomingObservable(obj) {
    let eqsName = equals(obj.name, this.props.name);
    obj.data = SpyneChannelUI.removeSSID(obj.data);
    //console.log("OBJECT DATA ",obj.data);
    let {payload, srcElement} = obj.data;
    let dataObj = obsVal => ({ payload, srcElement, event: obsVal });
    let onSuccess = (obj) => obj.observable.pipe(map(dataObj))
      .subscribe(this.onUIEvent.bind(this));
    let onError = () => {};
    return eqsName === true ? onSuccess(obj) : onError();
  }

  getActionState(val) {
    let typeVal = path(['event', 'type']);
    let typeOverRideVal = path(['event', 'typeOverRide']);
    let eventType = compose(toUpper, either(typeOverRideVal, typeVal));
    let type = eventType(val);
    let mainAction = 'CHANNEL_UI';
    return type !== undefined ? `${mainAction}_${type}_EVENT` : mainAction;
  }

  static checkForEventMethods(obs){
    const re = /^(event)([A-Z].*)([A-Z].*)$/gm;
    const getMethods = compose(filter(test(re)), keys, prop('payload'));
    const methodsArr = getMethods(obs);
    if (methodsArr.length>=1) {
      const evt = prop('event', obs);
      if (evt !== undefined) {
        const methodUpdate = (match,p1,p2,p3,p4)=>String(p2).toLowerCase()+p3+p4;
        const methodStrReplace = replace(/^(event)([A-Z])(.*)([A-Z].*)$/gm, methodUpdate);
        const runMethod = (methodStr)=>{
          const m = methodStrReplace(methodStr);
          if (evt[m]!==undefined && typeof(evt[m])==='function') {evt[m]();}
        };
        methodsArr.forEach(runMethod)
      }
    }

    return obs;
  }



  onUIEvent(obs) {
    SpyneChannelUI.checkForEventMethods(obs);
    obs['action'] = this.getActionState(obs);
    const action = obs.action;// this.getActionState(obs);
    const { payload, srcElement } = obs;
    const event = obs.event;
    this.sendChannelPayload(action, payload, srcElement, event);
  }
}

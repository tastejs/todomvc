import { Channel } from './channel';
import { checkIfObjIsNotEmptyOrNil } from '../utils/frp-tools';
import { SpyneUtilsChannelWindow } from '../utils/spyne-utils-channel-window';
import { merge } from 'rxjs';
import { map, debounceTime, skipWhile } from 'rxjs/operators';
import {curry, pathEq, pick, partialRight, mapObjIndexed} from 'ramda';
import {deepMerge} from '../utils/deep-merge';

const rMap = require('ramda').map;

export class SpyneChannelWindow extends Channel {

  /**
   * @module SpyneChannelWindow
   * @type core
   *
   * @desc
   * The Window Channel will listen to window and document events that are set in its configuration file
   * <div class='btn btn-blue-ref btn-console modal-btn'  data-type='modal-window' data-value='windowEvents'>View Window Events</div></br></br>
   *
   * @constructor
   * @param {String} CHANNEL_NAME
   * @param {Object} config
   * @property {Object} config - = {}; The config has several options used to listen to window and document events.
   * @property {Array} config.events - = []; Any window and document events can be added here.
   * @property {Object} config.mediaQueries - = {}; Media queries are added as key,value pairs; the key is the name of the boolean for the query, the value is the query itself.
   * @property {Boolean} config.listenForResize - = true; This is default listening for resize event.
   * @property {Boolean} config.listenForOrientation - = true; Listen for horizontal and landscape orientation changes on mobile devices.
   * @property {Boolean} config.listenForMouseWheel - = false; If set to true, will listen for mouseWheel and will add direction and distance parameters.
   * @property {Boolean} config.debounceMSTimeForResize - = 200; The time between resize events in milliseconds.
   * @property {Boolean} config.debounceMSTimeForScroll - = 150; The time between scroll events in milliseconds.
   * @property {String} CHANNEL_NAME - = 'CHANNEL_WINDOW';
   *
   *
   */
  constructor(CHANNEL_NAME="CHANNEL_WINDOW") {
    super(CHANNEL_NAME);
    this.bindStaticMethods();
    // this.props.name = 'WINDOW';
  }

  initializeStream() {
    this.domChannelConfig = window.Spyne.config.channels.WINDOW;
    let obs$Arr = this.getActiveObservables();
    let dom$ = merge(...obs$Arr);
    this.dom$ = dom$;
    dom$.subscribe(p => {
      let { action, payload, srcElement, event } = p;
      this.sendChannelPayload(action, payload, srcElement, event);
    });
  }




  static getMouseWheelMapFn(event) {
    let action = this.channelActions.CHANNEL_WINDOW_MOUSEWHEEL_EVENT;
    let scrollDir = event.deltaY <= 0 ? 'up' : 'down';
    let { deltaX, deltaY, deltaZ } = event;
    let payload = { scrollDir, deltaX, deltaY, deltaZ };
    let srcElement = event.srcElement;
    return { action, payload, srcElement, event };
  }

  static createCurriedGenericEvent(actionStr) {
    let action = `CHANNEL_WINDOW_${actionStr.toUpperCase()}_EVENT`;
    let curryFn = curry(SpyneChannelWindow.mapGenericEvent);
    return curryFn(action);
  }

  static mapGenericEvent(actn, event) {
    // console.log("map generic event ",actn);
    let action = actn;
    let payload = event;
    let srcElement = event.srcElement;
    return { action, payload, srcElement, event };
  }

  static getResizeMapFn(event) {
    let action = this.channelActions.CHANNEL_WINDOW_RESIZE_EVENT;
    let payload = pick(
      ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight'], window);
    let srcElement = event.srcElement;
    return { action, payload, srcElement, event };
  }

  static getOrientationMapFn(event) {
    let action = this.channelActions.CHANNEL_WINDOW_ORIENTATION_EVENT;
    const orientationStr = '(orientation: portrait)';
    let isPortraitBool = window.matchMedia(orientationStr).matches;
    let payload = pick(
      ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight'], window);
    payload['orientation'] = isPortraitBool === true
      ? 'portrait'
      : 'landscape';
    let srcElement = event.srcElement;
    return { action, payload, srcElement, event };
  }

  getMediaQueryMapFn(event) {
    let action = this.channelActions.CHANNEL_WINDOW_MEDIA_QUERY_EVENT;
    let payload = pick(['matches', 'media', 'mediaQueryName'], event);
    let srcElement = event.srcElement;
    return { action, payload, srcElement, event };
  }

  createMouseWheelObservable(config) {
    const debounceT = config.debounceMSTimeForScroll;

    return SpyneUtilsChannelWindow.createDomObservableFromEvent('mousewheel',
      SpyneChannelWindow.getMouseWheelMapFn.bind(this))
    .pipe(
        debounceTime(debounceT)
    );
  }

  static getScrollData(){
    let currentScrollY = 0;

    const getScrollData = (scrollY)=>{
      let scrollDistance = currentScrollY - scrollY
      let scrollDir = scrollDistance >= 0 ? 'up' : 'down';
      currentScrollY = scrollY;
      return {scrollY, scrollDistance, scrollDir};
    };
    return getScrollData;
  }


  static getScrollMapFn(event, interval, action, scrollDataFn, scrollElement) {
    let scrollY = scrollElement.pageYOffset !== undefined ? scrollElement.pageYOffset : scrollElement.scrollTop;
    let payload = scrollDataFn(scrollY);
    let {scrollDistance} = payload;
    let srcElement = event.srcElement;
    return { action, payload, srcElement, scrollDistance, event };
  }

  createScrollObservable(config, scrollElement=window) {
    const skipWhenDirIsMissing = evt => evt.scrollDistance === 0;
    const dTime = config.debounceMSTimeForScroll;


    const isWindow = scrollElement === window;

    const scrollElForVals = config.scrollElForVals !== undefined ? config.scrollElForVals : scrollElement;
    const action = isWindow ? 'CHANNEL_WINDOW_SCROLL_EVENT' : 'CHANNEL_WINDOW_ELEMENT_SCROLL_EVENT';


    const scrollDataFn =SpyneChannelWindow.getScrollData();
     // console.log("SCROLL ELEMENT ",action,scrollElement, scrollElForVals);
    const scrollMapFn =partialRight(SpyneChannelWindow.getScrollMapFn, [action, scrollDataFn, scrollElForVals]).bind(this);

    /**
     * TODO: curry createDomObservableFromEvent so that element can be other than window.
     *
     */

    return SpyneUtilsChannelWindow.createDomObservableFromEvent('scroll',
        scrollMapFn)
      .pipe(
          map(p=>{
            if (pathEq(['Spyne', 'config', 'scrollLock'], true)(scrollElement)){
              let x = window.Spyne.config.scrollLockX
              let y = window.Spyne.config.scrollLockY;
              window.scrollTo(x,y);
            }
            return p;
          }),
        debounceTime(dTime),
        skipWhile(skipWhenDirIsMissing)
      );
  }

  createOrientationObservable(config) {
    // console.log("add orientation");orientationchange
    return SpyneUtilsChannelWindow.createDomObservableFromEvent('orientationchange',
      SpyneChannelWindow.getOrientationMapFn.bind(this));
  }

  createResizeObservable(config) {
    const dTime = config.debounceMSTimeForResize;
    // console.log('resize this ', this);

    return SpyneUtilsChannelWindow.createDomObservableFromEvent('resize',
      SpyneChannelWindow.getResizeMapFn.bind(this)).pipe(debounceTime(dTime));
  }

  getEventsFromConfig(config = this.domChannelConfig) {
    let obs$Arr = config.events;

    const addWindowEventToArr = str => {
      let mapFn = SpyneChannelWindow.createCurriedGenericEvent(str);
      return SpyneUtilsChannelWindow.createDomObservableFromEvent(str, mapFn);
    };

    return rMap(addWindowEventToArr, obs$Arr);
  }

  getActiveObservables(config = this.domChannelConfig) {
    let obs$Arr = [];

    // CHECK TO ADD MEDIA QUERY OBSERVABLE
    // ==========================================
    config['listenForMediaQueries'] = checkIfObjIsNotEmptyOrNil(
      config.mediqQueries);

    // =========================================

    // config.listenForResize = false;
    // config.listenForMouseWheel = true;
    // config.listenForScroll = false;
    let methods = {
      'listenForResize': this.createResizeObservable.bind(this),
      'listenForOrientation': this.createOrientationObservable.bind(this),
      'listenForScroll': this.createScrollObservable.bind(this),
      'listenForMouseWheel': this.createMouseWheelObservable.bind(this)
    };

    const addObservableToArr = (method, key, i) => {
      const addObsBool = config[key];
      if (addObsBool) {
        obs$Arr.push(method(config));
      } else {

      }
    };

    mapObjIndexed(addObservableToArr, methods);

    // 'listenForMediaQueries' : this.getMediaQueryObservable.bind(this)
    this.checkForMediaQueries(config.listenForMediaQueries);

    let eventsArr = this.getEventsFromConfig(config);
    obs$Arr = obs$Arr.concat(eventsArr);

    return obs$Arr;
  }

  checkForMediaQueries(bool) {
    const sendMQStream = p => {
      let { action, payload, srcElement, event } = p;
      this.sendChannelPayload(action, payload, srcElement, event,
        this.observer$);
    };

    if (bool === true) {
      this.getMediaQueryObservable(this.domChannelConfig)
        .subscribe(sendMQStream);
    }
  }

  getMediaQueryObservable(config) {
    let arr = this.createMergedObsFromObj(config);
    let obs$ = merge(arr[0], arr[1]);
    return obs$.pipe(map(this.getMediaQueryMapFn.bind(this)));
  }

  addRegisteredActions() {
    return [
      'CHANNEL_WINDOW_ABORT_EVENT',
      'CHANNEL_WINDOW_AFTERPRINT_EVENT',
      'CHANNEL_WINDOW_ANIMATIONEND_EVENT',
      'CHANNEL_WINDOW_ANIMATIONITERATION_EVENT',
      'CHANNEL_WINDOW_ANIMATIONSTART_EVENT',
      'CHANNEL_WINDOW_APPINSTALLED_EVENT',
      'CHANNEL_WINDOW_BEFOREPRINT_EVENT',
      'CHANNEL_WINDOW_BEFOREUNLOAD_EVENT',
      'CHANNEL_WINDOW_BEGINEVENT_EVENT',
      'CHANNEL_WINDOW_BLUR_EVENT',
      'CHANNEL_WINDOW_CACHED_EVENT',
      'CHANNEL_WINDOW_CHANGE_EVENT',
      'CHANNEL_WINDOW_CLICK_EVENT',
      'CHANNEL_WINDOW_CLOSE_EVENT',
      'CHANNEL_WINDOW_COMPOSITIONEND_EVENT',
      'CHANNEL_WINDOW_COMPOSITIONSTART_EVENT',
      'CHANNEL_WINDOW_COMPOSITIONUPDATE_EVENT',
      'CHANNEL_WINDOW_COPY_EVENT',
      'CHANNEL_WINDOW_CUT_EVENT',
      'CHANNEL_WINDOW_DEVICECHANGE_EVENT',
      'CHANNEL_WINDOW_DEVICELIGHT_EVENT',
      'CHANNEL_WINDOW_DEVICEMOTION_EVENT',
      'CHANNEL_WINDOW_DEVICEORIENTATION_EVENT',
      'CHANNEL_WINDOW_DEVICEPROXIMITY_EVENT',
      'CHANNEL_WINDOW_DOMATTRIBUTENAMECHANGED_EVENT',
      'CHANNEL_WINDOW_DOMATTRMODIFIED_EVENT',
      'CHANNEL_WINDOW_DOMCHARACTERDATAMODIFIED_EVENT',
      'CHANNEL_WINDOW_DOMCONTENTLOADED_EVENT',
      'CHANNEL_WINDOW_DOMELEMENTNAMECHANGED_EVENT',
      'CHANNEL_WINDOW_ERROR_EVENT',
      'CHANNEL_WINDOW_FOCUSIN_EVENT',
      'CHANNEL_WINDOW_FOCUS_EVENT',
      'CHANNEL_WINDOW_FULLSCREENCHANGE_EVENT',
      'CHANNEL_WINDOW_FULLSCREENERROR_EVENT',
      'CHANNEL_WINDOW_LOAD_EVENT',
      'CHANNEL_WINDOW_MEDIA_QUERY_EVENT',
      'CHANNEL_WINDOW_MESSAGE_EVENT',
      'CHANNEL_WINDOW_MOUSEWHEEL_EVENT',
      'CHANNEL_WINDOW_OFFLINE_EVENT',
      'CHANNEL_WINDOW_ONLINE_EVENT',
      'CHANNEL_WINDOW_OPEN_EVENT',
      'CHANNEL_WINDOW_ORIENTATION_EVENT',
      'CHANNEL_WINDOW_PAGEHIDE_EVENT',
      'CHANNEL_WINDOW_PAGESHOW_EVENT',
      'CHANNEL_WINDOW_POPSTATE_EVENT',
      'CHANNEL_WINDOW_RESET_EVENT',
      'CHANNEL_WINDOW_RESIZE_EVENT',
      'CHANNEL_WINDOW_ELEMENT_SCROLL_EVENT',
      ['CHANNEL_WINDOW_SET_ELEMENT_TO_SCROLL_EVENT', 'onSetElementToScroll'],
      'CHANNEL_WINDOW_SCROLL_EVENT',
      'CHANNEL_WINDOW_SCROLL_LOCK_EVENT',
     ['CHANNEL_WINDOW_SCROLL_LOCK_EVENT', 'onScrollLockEvent'],
      'CHANNEL_WINDOW_SUBMIT_EVENT',
      'CHANNEL_WINDOW_TRANSITIONCANCEL_EVENT',
      'CHANNEL_WINDOW_TRANSITIONEND_EVENT',
      'CHANNEL_WINDOW_TRANSITIONRUN_EVENT',
      'CHANNEL_WINDOW_TRANSITIONSTART_EVENT',
      'CHANNEL_WINDOW_UNLOAD_EVENT',
      'CHANNEL_WINDOW_WHEEL_EVENT'
    ];
  }

  onScrollLockEvent(e){
    const setScrollPos = ()=>{
      window.Spyne.config.scrollLockX = window.scrollX;
      window.Spyne.config.scrollLockY = window.scrollY;
    };
    let {action, scrollLock} = e.props();
    window.Spyne.config.scrollLock = scrollLock;
    if (scrollLock === true){
      setScrollPos();
    }

    this.sendChannelPayload(action, {scrollLock});
  }

  onSetElementToScroll(e){

    let {config, scrollElement} = e.props();
    config = deepMerge(this.domChannelConfig, config);

    this.createScrollObservable(config, scrollElement)
    .subscribe(p => {
      let { action, payload, srcElement, event } = p;
      this.sendChannelPayload(action, payload, srcElement, event);
    });


  }

  bindStaticMethods() {
    this.createMediaQueryHandler = SpyneUtilsChannelWindow.createMediaQueryHandler.bind(
      this);
    this.createMergedObsFromObj = SpyneUtilsChannelWindow.createMergedObsFromObj.bind(
      this);
  }
}

import { baseCoreMixins } from '../utils/mixins/base-core-mixins';
//import { baseStreamsMixins } from '../utils/mixins/base-streams-mixins';
import { deepMerge } from '../utils/deep-merge';
import {
  findStrOrRegexMatchStr,
  getConstructorName
} from '../utils/frp-tools';
// import {gc} from '../utils/gc';
import { ViewStreamElement } from './view-stream-element';
import { ViewStreamEnhancerLoader } from './view-stream-enhancer-loader';
import { registeredStreamNames } from '../channels/channels-config';
import { ViewStreamBroadcaster } from './view-stream-broadcaster';
import { ViewStreamPayload } from './view-stream-payload';
import { ChannelPayloadFilter } from '../utils/channel-payload-filter';
import { ViewStreamObservable } from '../utils/viewstream-observables';
import {ViewStreamSelector} from './view-stream-selector';
import { Subject, of } from 'rxjs';
import { mergeMap, map, takeWhile, filter, tap, finalize } from 'rxjs/operators';
import {pick, compose, isNil, toLower, either, findIndex, test, flatten ,prop, always, lte, defaultTo, propSatisfies, allPass, curry, is, path, omit, ifElse, clone,  mergeRight, where, equals} from 'ramda';

export class ViewStream {
  /**
   * @module ViewStream
   * @type extendable
   *
   * @desc
   *
   * <p>ViewStream is the interactive-view component, and its core functionality is comprised of two internal components: </p>
   <ul class='basic'>
   <li>LINK['ViewStreamElement', 'view-stream-element']: The “View” in ViewStream. Creates the HTML Element based on values from the props object, and is responsible for rendering and disposing of its view.
   <li>LINK['ViewStreamObservable', 'view-stream-observable']: The “Stream” in ViewStream. Creates an observable that forks into three streams: the first is between ViewStream and its ViewStreamElement, the second stream is to a parent ViewStream instance, and and the third stream is to all appended ViewStream children.</ul>
   <p>Other components used in ViewStream:</p>
   <ul>
   <li>LINK['ViewStreamBroadcaster', 'view-stream-broadcaster']: Takes the nested array from the <i>BroadcastEvents</i> method and creates RxJs observables that are delegated to either the CHANNEL_UI or CHANNEL_ROUTE
   <li>LINK['ViewStreamSelector', 'view-stream-selector']: Provides selector and CSS utility methods.
   <li>LINK['ViewStreamPayload', 'view-stream-payload']: Payload format for sending data to Channels using the <i>sendInfoToChannel</i> method.
    </ul>
   *
   *
   * <h4>Rendering</h4>
   * <p>ViewStream renders its element and any content based on the values within the <i>props</i> property.</p>
   * <ul class='bullet'>
   *     <li>By default ViewStream renders an empty div</li>
   *     <li>Templates can be provided as a String or String literal of HTML tags, or as an HTML Element</li>
   *     <li>ViewStreams will apply any HTML attributes defined within <i>props</i> to the rendered element</li>
   *     <li>An existing element can be assigned to the props.el</li>
   *
   *     </ul>
   *
   * The <i>props</i> property is also used to hold all of the internal values within the ViewStream instance.
   *
   * <h5>Appending to Document</h5>
   * <p>ViewStreams renders an HTML DocumentFragment and only attaches that element to the DOM when appended to another ViewStream instance or to an existing HTML element.</p>
   * <p>Below are the methods that appends the View to the DOM:</p>
   *
   *
   *    <div class='method-section'>
   *        <h5>Appending To Other ViewStreams</h5>
   *
   *        <a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-append-view"  href="/guide/reference/view-stream-append-view" >appendView</a>
   *        <a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-prepend-view"  href="/guide/reference/view-stream-prepend-view" >prependView</a>
   *        <a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-append-view-to-parent"  href="/guide/reference/view-stream-append-view-to-parent" >appendViewToParentEl</a>
   *        <a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-prepend-view-to-parent"  href="/guide/reference/view-stream-prepend-view-to-parent" >prependViewToParentEl</a>
   *        </div>
   *
   *
   *    <div class='method-section'>
   *        <h5>Appending Directly to the DOM</h5>
   *
   *        <a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-append-to-dom"  href="/guide/reference/view-stream-append-to-dom" >appendToDom</a>
   *        <a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-prepend-to-dom"  href="/guide/reference/view-stream-prepend-to-dom" >prependToDom</a>
   *
   *        </div>
   *
   *    <div class='method-section'>
   *        <h5>Appended but hidden</h5>
   *
   *        <a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-append-to-null"  href="/guide/reference/view-stream-append-to-null" >appendToNull</a>
   *
   *        </div>
   *
   * <h4>Broadcasting Events</h4>
   * <p>ViewStreams instances has two methods of broadcasting events:</p>
   *    <div class='method-section'>
   * <h5><a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-broadcast-events"  href="/guide/reference/view-stream-broadcast-events" >1. broadcastEvents Method</a></h5>
   *   <p>  Elements listed here will automatically be published to the UI Channel, and the dataset values for that element will be returned along with the relevant action.</br>The event will be published to the ROUTE Channel when the element's dataset value for channel is set to "ROUTE"</p>
   *  </div>
   *    <div class='method-section'>
   * <h5><a class='linker' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-send-info-to-channel"  href="/guide/reference/view-stream-send-info-channel" >2. sendInfoToChannel Method</a></h5>
   *   <p>Any type of data can be sent to any channel using the sendInfoToChannel method. This can be especially useful to allow global communication of data from third-party libraries and resources.</p>
   * </div>
   *
   *
   * <h4>Binding Data to Maintain State</h4>
   * <p>ViewStream has several methods and features for instances to receive the exact data, at the right time, to maintain state:</p>
   * <ul>
   *     <li>Channel actions are bound to local methods using the <a class='linker no-break' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-add-action-listeners"  href="/guide/reference/view-stream-add=action-listeners" >addActionListeners</a> method.</li>
   *     <li><a class='linker no-break' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="channel-action-filter"  href="/guide/reference/channel-action-filter" >ChannelActionFilters</a> calibrates the flow of data from Channel Actions before that data is sent to its bound local method.</li>
   *     <li>The single <b>props</b> property allows all instances to be evaluated with a consistent interface.</li>
   *     <li><b>props.el$</b> <a class='linker no-break' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="view-stream-selector"  href="/guide/reference/view-stream-selector" >Selector</a> has special methods to adjust state with styles and CSS.</li>
   *    <li><a class='linker no-break' data-channel="ROUTE"  data-event-prevent-default="true" data-menu-item="spyne-trait"  href="/guide/reference/spyne-trait" >SpyneTraits</a> can enhance instances with functionality based on individual actions.</li>

   *
   * @constructor
   * @param {object} props This json object takes in parameters to generate or reference the dom element
   * @property {string} props.tagName - = 'div'; Defines the HTML Element.
   * @property {domItem} props.el - = undefined;  Assigns an existing DOM element. Defined attributes will be added to the element.
   * @property {string|object} props.data - = undefined;  Adds text to the element, or populates a template when defined as JSON.
   * @property {boolean} props.sendLifecyleEvents = false; Broadcast lifecycle events of render and dispose to CHANNEL_LIFECYCLE.
   * @property {string} props.id - = undefined; Generates a random id when undefined.
   * @property {Array|SpyntTrait} props.traits - = undefined; Add a single SpyneTrait or array of SpyneTrait components.
   * @property {template} props.template - = undefined; String, String literal or HTML template.
   * @special {"name": "DomEl", "desc": "ViewStreams uses the DomEl class to render html tags and templates.", "link":"dom-item"}
   * @special {"name": "ViewStreamSelector", "desc": "The <b>props.el$</b> property creates an instance of this class, used to query elements within the props.el element; also has methods to update css classes.", "link":"dom-item-selectors"}
   *
   *
   *
   *
   *
   */
  constructor(props = {}) {
    this.vsnum = Math.random();
    this.addMixins();
    this.defaults = () => {
      const vsid = this.createId();
      const id = props.id ? props.id : vsid;
      return {
        vsid,
        id,
        tagName: 'div',
        el: undefined,
        data: undefined,
        animateIn: false,
        animateInTime: 0.5,
        animateOut: false,
        animateOutTime: 0.5,
        sendLifecyleEvents: false,
        hashId: `#${id}`,
        viewClass: ViewStreamElement,
        extendedSourcesHashMethods: {},
        debug: false,
        template: undefined,
        node: document.createDocumentFragment(),
        name: getConstructorName(this)
      };
    };
    this._state = {};
    this.$dirs = ViewStreamObservable.createDirectionalFiltersObject();
    this.addDefaultDirection = ViewStreamObservable.addDefaultDir;
    this.addDownInternalDir = ViewStreamObservable.addDownInternalDir;
    // this.props = Object.assigREADY_FOR_VS_DETRITUS_COLLECTn({}, this.defaults(), props);
    this.props = deepMerge(this.defaults(), props);
    this.sendLifecycleMethod = this.props.sendLifecyleEvents === true ? this.sendLifecycleMethodActive.bind(this) : this.sendLifecycleMethodInactive.bind(this);
    let attributesArr = this.attributesArray;
    // let attributesArr = ['id', 'class', 'dataset'];
    this.props['domAttributes'] = pick(attributesArr, this.props);
    if (this.props.traits!==undefined){
      this.addTraits(this.props.traits);
    }
    this.loadEnhancers();
    this.loadAllMethods();
    this.props.action = 'LOADED';
    this.sink$ = new Subject();
    const ViewClass = this.props.viewClass;
    this.view = new ViewClass(this.sink$, {}, this.props.vsid,
      this.props.id);// new this.props.viewClass(this.sink$);
    this.sourceStreams = this.view.sourceStreams;
    this._rawSource$ = this.view.getSourceStream();
    this._rawSource$['viewName'] = this.props.name;
    this.sendEventsDownStream = this.sendEventsDownStreamFn;
    this.initViewStream();
    this.isDevMode = ViewStream.isDevMode();
    this.props.addedChannels = [];
    this.checkIfElementAlreadyExists();
  }

  updatePropsToMatchEl() {
    const getTagName = compose(toLower, either(prop('tagName'), always('')));
    this.props.tagName = getTagName(this.props.el);
  }

  checkIfElementAlreadyExists() {
    const elIsDomElement = compose(lte(0), defaultTo(-1), prop('nodeType'));
    const elIsRendered = el => document.body.contains(el);
    const elIsReadyBool = propSatisfies(
      allPass([elIsRendered, elIsDomElement]), 'el');

    if (elIsReadyBool(this.props)) {
      this.updatePropsToMatchEl();
      this.postRender();
    }
  }

  loadEnhancers(arr = []) {
    let enhancerLoader = new ViewStreamEnhancerLoader(this, arr);
    this.props['enhancersMap'] = enhancerLoader.getEnhancersMap();
    enhancerLoader = undefined;
  }

  loadAllMethods() {
    const channelFn = curry(this.onChannelMethodCall.bind(this));
    let createExtraStatesMethod = (arr) => {
      let [action, funcStr, actionFilter] = arr;
      if (is(String, actionFilter)) {
        actionFilter = new ChannelPayloadFilter(actionFilter);
      }
      this.props.extendedSourcesHashMethods[action] = channelFn(funcStr,
        actionFilter);
    };
    this.addActionListeners().forEach(createExtraStatesMethod);
    this.props.hashSourceMethods = this.setSourceHashMethods(
      this.props.extendedSourcesHashMethods);
  }

  /**
   * Binds channel actions to local methods, formatted as array values.
   * <ul>
   * <li><b>First value:</b> Action name, as a string or as a basic Regular Expression.
   * <li><b>Second value:</b> The method to be called when the action is published.
   * <li><b>Third optional value:</b> This is a filter option that can be a selector string. or an instance of the LINK['channelPayloadFilter', 'channel-payload-filter'].
   * </ul>
   * @example
   *   addActionListeners() {
   *     return [
   *     ['CHANNEL_UI_CLICK_EVENT', 'onClickEvent', 'li.myclass'],
   *     ['CHANNEL_MY_CUSTOM_EVENT', 'onActionReturned']
   *            ]
   *           }
   *
   * @returns Nested Array
   */
  addActionListeners() {
    return [];
  }

  onChannelMethodCall(str, actionFilter, p) {
    const runFunc = (payload)=>{
      if (this[str] === undefined){
        console.warn(`Spyne Warning: The method, ${str} does not appear to exist in ${this.constructor.name}!`)
      } else{
        this[str](payload);
      }
    }

    if (p.$dir !== undefined && p.$dir.includes('child') &&
        this.deleted !== true) {
      let obj = deepMerge({}, p);// Object.assign({}, p);
      obj['$dir'] = this.$dirs.C;
      this.sourceStreams.raw$.next(obj);
    }
    let filterPayload =  defaultTo(always(true), actionFilter);
    if (filterPayload(p.props()) === true) {
    //  p = omit(['dir$'],p);
      p = omit(['$dir'], p)
      //console.log(' payload vs ',p);
      runFunc(p);
      //this[str](p);
    }
  }

  setSourceHashMethods(extendedSourcesHashMethods = {}) {
    let hashSourceKeys = {
      'EXTIRPATING': (p) => this.checkParentDispose(p),
      'EXTIRPATE': (p) => this.disposeViewStream(p),
      // 'CHILD_EXTIRPATE'                    : (p) => this.disposeViewStream(p),
      'VS_SPAWNED': (p) => this.onVSRendered(p),
      'VS_SPAWNED_AND_ATTACHED_TO_DOM': (p) => this.onVSRendered(p),
      'VS_SPAWNED_AND_ATTACHED_TO_PARENT': (p) => this.onVSRendered(p),
      // 'CHILD_VS_SPAWNED'                   : (p) => this.attachChildToView(p),
      'READY_FOR_VS_DETRITUS_COLLECT': (p) => this.onReadyToGC(p),
      'VS_NULLITY': () => ({})
    };
    return deepMerge.all([{}, hashSourceKeys, extendedSourcesHashMethods]);
  }

  //  =====================================================================
  // ====================== MAIN STREAM METHODS ==========================
  initViewStream() {
    this._source$ = this._rawSource$.pipe(map(
      (payload) => this.onMapViewSource(payload)), takeWhile(this.notGCSTATE));

    this.initAutoMergeSourceStreams();
    this.updateSourceSubscription(this._source$, true);
  }

  notGCSTATE(p) {
    return !p.action.includes('READY_FOR_VS_DETRITUS_COLLECT');
  }

  eqGCSTATE(p) {
    return !p.action.includes('READY_FOR_VS_DETRITUS_COLLECT');
  }

  notCOMPLETED(p) {
    return !p.action.includes('COMPLETED');
  }

  notGCCOMPLETE(p) {
    return !p.action.includes('GC_COMPLETE');
  }

  testVal(p) {
    console.log('TESTING VALL IS ', p);
  }

  addParentStream(obs, attachData) {
    let filterOutNullData = (data) => data !== undefined && data.action !==
        undefined;
    let checkIfDisposeOrFadeout = (d) => {
      let data = deepMerge({}, d);

      if (data.action === 'EXTIRPATE_AND_READY_FOR_VS_DETRITUS_COLLECT') {
        this.disposeViewStream(data);
        data.action = 'READY_FOR_VS_DETRITUS_COLLECT';
      }
      return data;
    };

    this.parent$ = obs.pipe(
      filter(filterOutNullData),
      map(checkIfDisposeOrFadeout));
    this.updateSourceSubscription(this.parent$, false, 'PARENT');
    this.renderAndAttachToParent(attachData);
  }

  addChildStream(obs$) {
    let filterOutNullData = (data) => data !== undefined && data.action !==
        undefined;
    let child$ = obs$.pipe(
      filter(filterOutNullData),
      tap(p => this.tracer('addChildStraem do ', p)),
      map((p) => {
        return p;
      }),
      finalize(p => this.onChildCompleted(child$.source)));
    this.updateSourceSubscription(child$, true, 'CHILD');
  }

  onChildDisposed(p) {

  }

  onChildCompleted(p) {
    let findName = (x) => {
      let finalDest = (y) => {
        while (y.destination !== undefined) {
          y = finalDest(y.destination);
        }
        return y;
      };
      return pick(['id', 'vsid'], finalDest(x));
    };
    let childCompletedData = findName(p);
    this.tracer('onChildCompleted ', this.vsnum, p);
    // console.log('obj is ',childCompletedName,obj,this.props);
    this.onChildDisposed(childCompletedData, p);
    return childCompletedData;
  }

  initAutoMergeSourceStreams() {
    // ====================== SUBSCRIPTION SOURCE =========================
    let subscriber = {
      next: this.onSubscribeToSourcesNext.bind(this),
      error: this.onSubscribeToSourcesError.bind(this),
      complete: this.onSubscribeToSourcesComplete.bind(this)
    };
    // let takeBeforeGCOld = (val) => val.action !== 'VS_DETRITUS_COLLECTED';
    // let takeBeforeGC = (p) => !p.action.includes('READY_FOR_VS_DETRITUS_COLLECT');
    // let mapToState = (val) => ({action:val});
    //  =====================================================================
    // ========== METHODS TO CHECK FOR WHEN TO COMPLETE THE STREAM =========
    let completeAll = () => {
      this.props.el$ = undefined;
      this.uberSource$.complete();
      this.autoSubscriber$.complete();
      this.sink$.complete();
      this.props = undefined;
      this.deleted = true;
      this.tracer('completeAll', this.deleted, this.props);
    };
    let decrementOnObservableClosed = () => {
      obsCount -= 1;
      if (obsCount === 0) {
        completeAll();
      }
    };
    //  =====================================================================
    // ======================== INIT STREAM METHODS ========================
    let obsCount = 0;
    this.uberSource$ = new Subject();
    // ======================= COMPOSED RXJS OBSERVABLE ======================
    let incrementObservablesThatCloses = () => { obsCount += 1; };
    this.autoMergeSubject$ = this.uberSource$.pipe(mergeMap((obsData) => {
      let branchObservable$ = obsData.observable.pipe(filter(
        (p) => p !== undefined && p.action !== undefined), map(p => {
        // console.log('PAYLOAD IS ', p, this.constructor.name)
        let payload = deepMerge({}, p);
        payload.action = p.action;// addRelationToState(obsData.rel, p.action);
        this.tracer('autoMergeSubject$', payload);
        return payload;
      }));

      if (obsData.autoClosesBool === false) {
        return branchObservable$;
      } else {
        incrementObservablesThatCloses();
        return branchObservable$.pipe(finalize(decrementOnObservableClosed));
      }
    }));
    // ============================= SUBSCRIBER ==============================
    this.autoSubscriber$ = this.autoMergeSubject$
    // .do((p) => console.log('SINK DATA ', this.constructor.name, p))
      .pipe(filter((p) => p !== undefined && p.action !== undefined))
      .subscribe(subscriber);
  }

  // ========================= MERGE STREAMS TO MAIN SUBSCRIBER =================
  updateSourceSubscription(obs$, autoClosesBool = false, rel) {
    // const directionArr = sendDownStream === true ? this.$dirs.DI : this.$dirs.I;
    let obj = {
      observable: obs$,
      autoClosesBool,
      rel
    };
    this.tracer('updateSourceSubscription ', this.vsnum, obj);
    this.uberSource$.next(obj);
  }

  // ============================= SUBSCRIBER METHODS ==============================
  onSubscribeToSourcesNext(payload = {}) {
    let defaultToFn = defaultTo((p) => this.sendExtendedStreams(p));

    // ****USE REGEX AS PREDICATE CHECK FOR PAYLOAD.ACTION IN HASH METHODS OBJ
    // const hashAction = this.props.hashSourceMethods[payload.action];
    const hashActionStr = findStrOrRegexMatchStr(this.props.hashSourceMethods,
      payload.action);
    const hashAction = this.props.hashSourceMethods[hashActionStr];
    // console.log('S PAYLOAD ', this.props.name, typeof (hashAction), payload);

    let fn = defaultToFn(hashAction);

    // console.log('hash methods ', fn, this.props.name, payload.action, hashActionStr, this.props.hashSourceMethods);

    fn(payload);
    // console.log(fn, payload, ' THE PAYLOAD FROM SUBSCRIBE IS ', ' ---- ', ' ---> ', this.props);
    // console.log('EXTIRPATER VS NEXT', this.constructor.name, payload);

    this.tracer('onSubscribeToSourcesNext', { payload });
  }

  onSubscribeToSourcesError(payload = '') {
    console.log('ALL ERROR  ', this.constructor.name, payload);
  }

  onSubscribeToSourcesComplete() {
    // console.log('==== EXTIRPATER ALL COMPLETED ====', this.constructor.name);
    this.tracer('onSubscribeToSourcesComplete', 'VS_DETRITUS_COLLECT');

    this.openSpigot('VS_DETRITUS_COLLECT');
  }

  //  =======================================================================================
  // ============================= HASH KEY AND SPIGOT METHODS==============================
  get source$() {
    return this._source$;
  }

  sendExtendedStreams(payload) {
    this.tracer('sendExtendedStreams', payload);
    // console.log('extended methods ', payload.action, payload);
    this.openSpigot(payload.action, payload);
  }

  // ===================================== VS_SPAWN METHODS ==================================
  renderAndAttachToParent(attachData) {
    // let childRenderData = attachData;
    this.openSpigot('VS_SPAWN_AND_ATTACH_TO_PARENT', attachData);
  }

  renderView() {
    this.openSpigot('VS_SPAWN');
  }

  renderViewAndAttachToDom(node, type, attachType) {
    let attachData = { node, type, attachType };
    this.openSpigot('VS_SPAWN_AND_ATTACH_TO_DOM', { attachData });
  }

/*
  attachChildToView(data) {
    // let childRenderData = data.attachData;
    // console.log('CHILD DATA ', this.constructor.name, childRenderData);
    // this.openSpigot('ATTACH_CHILD_TO_SELF', {childRenderData});
  }
*/

  // ===================================== EXTIRPATE METHODS =================================
  checkParentDispose(p) {
    if (p.from$ === 'parent') {
      this.disposeViewStream(p);
    }
  }

  onBeforeDispose() {

  }

  /**
   *
   * Begins the removal process of the ViewStream instance along with all of its chained ViewStream children.
   */
  disposeViewStream(p) {
    // console.log('EXTIRPATER VS onDispose ', this.constructor.name);
    this.onBeforeDispose();
    this.openSpigot('EXTIRPATE');
  }

  onChildDispose(p) {
  }

  onParentDisposing(p) {
    // this.updateSourceSubscription(this._source$);
    this.openSpigot('EXTIRPATE');
  }

  onReadyToGC(p) {
    const isInternal = p.from$ !== undefined && p.from$ === 'internal';
    if (isInternal) {
      // this.openSpigot('VS_DETRITUS_COLLECT');
    }
    this.tracer('onReadyToGC', isInternal, p);
  }

  // ===================================== SINK$ METHODS =================================

  openSpigot(action, obj = {}) {
    if (this.props !== undefined) {
      this.props.action = action;
      let data = mergeRight(this.props, obj);
      this.sink$.next(Object.freeze(data));
    }
  }

  static isDevMode(){
    return path(['Spyne', 'config', 'debug'], window)===true;
  }

  setAttachData(attachType, query) {
    const checkQuery = ()=>{
      let q = this.props.el.querySelector(query);
      const isDevMode = ViewStream.isDevMode();
      if (isDevMode === true && is(String, query) && isNil(q) ){
        console.warn(`Spyne Warning: The appendView query in ${this.props.name}, '${query}', appears to not exist!`);
      }
      return q;
    }

    return {
      node: this.props.el,
      type: 'ViewStreamObservable',
      attachType,
      query: checkQuery(query)
    };
  }

  getParentEls(el, num) {
    let getElem = el => el.parentElement;
    let iter = 0;
    let parentEl = el;
    while (iter < num) {
      parentEl = getElem(parentEl);
      iter++;
    }
    return parentEl;
  }

  setAttachParentData(attachType, query, level) {
    query = query!=="" ? query : undefined;
    return {
      node: this.getParentEls(this.props.el, level),
      type: 'ViewStreamObservable',
      attachType,
      query: this.props.el.parentElement.querySelector(query)
    };
  }

  onMapViewSource(payload = {}) {
    this.props = mergeRight(this.props, payload);
    return payload;
  }

  // ====================== ATTACH STREAM AND DOM DATA AGGREGATORS==========================
  exchangeViewsWithChild(childView, attachData) {
    this.addChildStream(childView.sourceStreams.toParent$);
    childView.addParentStream(this.sourceStreams.toChild$, attachData);
  }

  /**
   * Appends a ViewStream object to an existing dom element.
   * @param {HTMLElement} node the ViewStream child that is to be attached.
   * @example
   * //  returns
   * <body>
   *    <h2>Hello World</h2>
   * </body>
   *
   * let viewStream = new ViewStream('h2', 'Hello World');
   * viewStream.appendToDom(document.body);
   *
   */
  appendToDom(node) {
    //console.log("append to dom ",this.props.vsid, this.props.el);
    if (this.props.el !== undefined){
      console.warn(`Spyne Warning: The ViewStream, ${this.props.name}, has an element, ${this.props.el}, that is already rendered and does not need to be appendedToDom. This may create unsusual side effects!`)
    }
    this.renderViewAndAttachToDom(node, 'dom', 'appendChild');
  }

  /**
   * Prepends the current ViewStream object to an existing dom element.
   * @param {HTMLElement} node the ViewStream child that is to be attached.
   *
   * @example
   * this.prependToDom(document.body);
   *
   */

  prependToDom(node) {
    if (this.props.el !== undefined){
      console.warn(`Spyne Warning: The ViewStream, ${this.props.name}, has an element, ${this.props.el}, that is already rendered and does not need to be prependedToDom. This may create unsusual side effects!`)
    }
    this.renderViewAndAttachToDom(node, 'dom', 'prependChild');
  }

  /**
   * This method appends a child ViewStream object. <br>After the attachment, rxjs observables are exchanged between the parent and child ViewStream objects.<br><br>
   * @param {ViewStream} v the ViewStream child that is to be attached.
   * @param {string} query a querySelector within this ViewStream.
   *
   * @example
   * //  returns
   * <body>
   *    <main>
   *        <h2>Hello World</h2>
   *    </main>
   * </body>
   *
   *
   * let parentView = new ViewStream('main');
   * parentView.appendToDom(document.body);
   *
   * let childView = new ViewStream({tagName:'h2', data:'Hello World'};
   * parentView.appendView(childView)
   *
   * */
  appendView(v, query) {
    this.exchangeViewsWithChild(v, this.setAttachData('appendChild', query));
  }

  /**
   * This method appends a child ViewStream object to a parent ViewStream object.
   * @param {ViewStream} v the ViewStream parent.
   * @param {string} query a querySelector within this ViewStream.
   * @param {level} this parameters can attach the viewStream's dom element up the dom tree while still maintaining the parent-child relationship of the ViewStream objects.
   *
   * @example
   * //  returns
   * <body>
   *    <main>
   *        <h2>Hello World</h2>
   *    </main>
   * </body>
   *
   *
   * let parentView = new ViewStream('main');
   * parentView.appendToDom(document.body);
   *
   * let childView = new ViewStream({tagName:'h2', data:'Hello World'};
   * childView.appendToParent(parentView)
   *
   * */

  appendViewToParentEl(v, query, level = 1) {
    this.exchangeViewsWithChild(v,
      this.setAttachParentData('appendChild', query, level));
  }

  /**
   * This method prepends a child ViewStream object to a parent ViewStream object.
   * @param {ViewStream} v
   * @param {string} query
   * @param {number} level
   *
   * @property {ViewStream} v - = undefined; the ViewStream parent.
   * @property {string} query - = undefined; a querySelector within this ViewStream.
   * @property {number} level - = 1; this parameter can attach the viewStream's dom element up the dom tree while still maintaining the parent-child relationship of the ViewStream objects.
   *
   * @example
   * let parentView = new ViewStream('main');
   * parentView.prependToDom(document.body);
   *
   * let childView = new ViewStream({tagName:'h2', data:'Hello World'};
   * childView.prependViewToParentEl(parentView)
   *
   * */
  prependViewToParentEl(v, query, level = 1) {
    this.exchangeViewsWithChild(v,
      this.setAttachParentData('prependChild', query, level));
  }

  /**
   *
   *
   * This method prepends a child ViewStream object to the current ViewStream object. <br>After the attachment, rxjs observables are exchanged between the parent and child ViewStream objects.<br><br>
   * @param {ViewStream} v the ViewStream child that is to be attached.
   * @param {string} query a querySelector within this ViewStream.
   *
   * @example
   * //  returns
   * <body>
   *    <main>
   *        <h2>Hello World</h2>
   *    </main>
   * </body>
   *
   * let parentView = new ViewStream('main');
   * parentView.appendToDom(document.body);
   *
   * let childView = new ViewStream({tagName:'h2', data:'Hello World'};
   * parentView.prependView(childView);
   *
   * */

  prependView(v, query) {
    this.exchangeViewsWithChild(v, this.setAttachData('prependChild', query));
  }

  /**
   *  Appends a ViewStream object that are not rendered to the #spyne-null-views div.
   */
  appendToNull() {
    let node = document.getElementById('spyne-null-views');
    this.renderViewAndAttachToDom(node, 'dom', 'appendChild');
  }

  onVSRendered(payload) {
    // console.log('VS_SPAWN: ', this.props.name, payload);
    if (payload.from$ === 'internal') {
      // this.props['el'] = payload.el.el;

      this.postRender();
      // this.broadcaster = new Spyne.ViewStreamBroadcaster(this.props, this.broadcastEvents);
    }
  }

  postRender() {
    this.beforeAfterRender();
    this.afterRender();
    this.onRendered();
    this.viewsStreamBroadcaster = new ViewStreamBroadcaster(this.props,
      this.broadcastEvents.bind(this));
      this.afterBroadcastEvents();
  }

  addTraits(traits){
    if (traits.constructor.name!=='Array'){
      traits = [traits];
    }
    const addTrait=(TraitClass)=>{
      new TraitClass(this);
    };

    traits.forEach(addTrait);
  }

  afterBroadcastEvents(){

      if (this.isDevMode === true ){
        const pullActionsFromList = (arr)=>arr[0];
        let actionsArr = this.addActionListeners().map(pullActionsFromList);
        const delayForProxyChannelResets = ()=>{
          if (path(['props','addedChannels'], this) !== undefined) {
            ViewStream.checkIfActionsAreRegistered.bind(this)(this.props.addedChannels, actionsArr);
          }
        };
        window.setTimeout(delayForProxyChannelResets, 500);
      }
  }
  static checkIfActionsAreRegistered(channelsArr=[], actionsArr){
      //const getActionsFn = path(['Spyne', 'channels', 'getChannelActions'], window);
      if (actionsArr.length>0){
        const getAllActions = (a)=>{
          const getRegisteredActionsArr = (str)=>window.Spyne.channels.getChannelActions(str);
          let arr =  a.map(getRegisteredActionsArr);
          return flatten(arr);
        }
        const checkForMatch = (strMatch) => {
          let re = new RegExp(strMatch);
          let actionIndex = findIndex(test(re), getAllActionsArr)
          if (actionIndex<0){
            let channelSyntax = channelsArr.length === 1 ? "from added channel" : "from added dchannels";
            console.warn(`Spyne Warning: The action, ${strMatch}, in ${this.props.name}, does not match any of the registered actions ${channelSyntax}, ${channelsArr.join(', ')}`)
          }
         //  const vsnum = ()=> R.test(new RegExp(str), "CHANNEL_ROUTE_TEST_EVENT")
        }
        let getAllActionsArr = getAllActions(channelsArr);
        actionsArr.forEach(checkForMatch);

      }

  }

  setDataVSID(){
    this.props.el.dataset.vsid = this.props.vsid;// String(this.props.vsid).replace(/^(vsid-)(.*)$/, '$2');
  }

  beforeAfterRender() {
/*    let dm2 = function(el) {
      return function(str = '') {
        return new DomItemSelectors(el, str);
      };
    };*/

    //this.props.el$ = dm2(this.props.el);
    this.setDataVSID();
    this.props.el$ = ViewStreamSelector(this.props.el);
    // console.log('EL IS ', this.props.el$.elArr);
    // window.theEl$ = this.props.el$;
  }

  // ================================= METHODS TO BE EXTENDED ==============================


  // THIS IS AN EVENT HOLDER METHOD BECAUSE SENDING DOWNSTREAM REQUIRE THE PARENT TO HAVE A METHOD
  downStream() {

  }
  /**
   *
   * This method is called as soon as the element has been rendered.
   *
   */

  onRendered() {
  }



  /**
   *
   * (Deprecated. Use onRendered). This method is called as soon as the element has been rendered.
   *
   */

  afterRender() {
  }

  /**
   *
   * Add any query within the ViewStream's dom and any dom events to automatically be observed by the UI Channel.
   * <br>
   * @example
   *
   *  broadcastEvents() {
     *  // ADD BUTTON EVENTS AS NESTED ARRAYS
     *  return [
     *       ['#my-button', 'mouseover'],
     *       ['#my-input', 'change']
     *     ]
     *   }
   *
   *
   * */

  broadcastEvents() {
    // ADD BUTTON EVENTS AS NESTED ARRAYS
    return [];
  }

  /**
   *
   * Automatically connect to an instance of registered channels, such as 'DOM', 'UI', and 'ROUTE' channels.
   *
   *
   * @example
   *
   * let uiChannel = this.getChannel('UI');
   *
   * uiChannel
   *    .filter((p) => p.data.id==='#my-button')
   *    .subscribe((p) => console.log('my button was clicked ', p));
   *
   * */

  getChannel(channel) {
    let isValidChannel = c => registeredStreamNames().includes(c);
    let error = c => console.warn(
      `channel name ${c} is not within ${registeredStreamNames}`);
    let startSubscribe = (c) => {
      let obs$ = window.Spyne.channels.getStream(c).observer;

      return obs$.pipe(takeWhile(p => this.deleted !== true));
    };// getGlobalParam('streamsController').getStream(c).observer;

    let fn = ifElse(isValidChannel, startSubscribe, error);

    return fn(channel);
  }

  /**
   *
   * Preferred method to connect to instances of registered channels, such as 'DOM', 'UI', and 'ROUTE' channels.
   *
   * Add Channel will automatically unsubscribe to the channel, whereas the getChannel method requires the developer to manually unsubscribe.
   *
   * @param {string} str The name of the registered Channel that was added to the Channels Controller.
   * @param {boolean} bool false, add true if the View should wait for this channel to unsubscribe before removing itself.
   * @param {sendDownStream} bool The direction where the stream is allowed to travel.
   *
   * @example
   *
   * let routeChannel = this.addChannel('ROUTE');
   *
   *      addActionListeners() {
     *           return [
     *             ['CHANNEL_ROUTE_CHANGE_EVENT', 'onMapRouteEvent']
     *           ]
     *       }
   *
   *       onMapRouteEvent(p) {
     *          console.log('the route value is ', p);
     *       }
   *
   *
   * */

  addChannel(str, sendDownStream = false, bool = false) {
    const directionArr = sendDownStream === true ? this.$dirs.CI : this.$dirs.I;
    const mapDirection = p => {
      let p2 = defaultTo({}, clone(p));
      let dirObj = { $dir: directionArr };
      return deepMerge(dirObj, p2);
      // Object.assign({$dir: directionArr}, clone(p))
    };
    const isLocalEventCheck = path(['srcElement', 'isLocalEvent']);
    const cidCheck = path(['srcElement', 'vsid']);
    const cidMatches = p => {
      let vsid = cidCheck(p);
      let isLocalEvent = isLocalEventCheck(p);
      const filterEvent = isLocalEvent !== true || vsid === this.props.vsid;
      // console.log("checks ",vsid,this.props.vsid, isLocalEvent,filterEvent);
      return filterEvent;
    };

    let channel$ = this.getChannel(str).pipe(map(mapDirection), filter(cidMatches));
    this.updateSourceSubscription(channel$, false);
    this.props.addedChannels.push(str);
  }


  checkIfChannelExists(channelName) {
    let channelExists = window.Spyne.channels.map.get(channelName) !== undefined;
    if (channelExists !== true) {
      console.warn(`SPYNE WARNING: The ChannelPayload from ${this.props.name}, has been sent to a channel, ${channelName}, that has not been registered!`);
    }
    return channelExists;
  }


  /**
   *
   * @param {String} channelName
   * @param {Object} payload
   * @param {String} action
   * @property {string} channelName - = undefined; The name of the registered Channel.
   * @property {object} payload - = {}; The main data to send to the channel.
   * @property {string} action - = "VIEWSTREAM_EVENT"; The action sent to the channel.
   * @desc
   * This method creates a versatile and consistent method to communicate with all channels.
   *
   *
   */

  sendInfoToChannel(channelName, payload = {}, action = 'VIEWSTREAM_EVENT') {
    let data = { payload, action };
  //  data['srcElement'] = {};// pick(['vsid','viewName'], data);
   // data.srcElement['vsid'] = path(['props', 'vsid'], this);
   // data.srcElement['id'] = path(['props', 'id'], this);
    data.srcElement = compose(pick(['id','vsid','class','tagName']), prop('props'))(this);
   // data.srcElement['isLocalEvent'] = false;
    //data.srcElement['viewName'] = this.props.name;
    if (this.checkIfChannelExists(channelName) === true) {
      let obs$ = of(data);
      return new ViewStreamPayload(channelName, obs$, data);
    }
  }

  tracer(...args) {
    this.sendLifecycleMethod(...args);
  }
  sendLifecycleMethodInactive() {

  }

  sendLifecycleMethodActive(val, p) {
    let isRendered = where({
      from$: equals('internal'),
      action: equals('VS_SPAWNED_AND_ATTACHED_TO_PARENT')
    }, p);
    let isDisposed = p === 'VS_DETRITUS_COLLECT';
    if (isRendered === true) {
      this.sendInfoToChannel('CHANNEL_LIFECYCLE', { action:'CHANNEL_LIFECYCLE_RENDERED_EVENT' }, 'CHANNEL_LIFECYCLE_RENDERED_EVENT');
    } else if (isDisposed === true) {
      this.sendInfoToChannel('CHANNEL_LIFECYCLE', { action:'CHANNEL_LIFECYCLE_DISPOSED_EVENT' }, 'CHANNEL_LIFECYCLE_DISPOSED_EVENT');
    }
  }

  createActionFilter(selectors, data) {
    return new ChannelPayloadFilter(selectors, data);
  }

  isLocalEvent(channelPayloadItem) {
    const itemEl = path(['srcElement', 'el'], channelPayloadItem);
    return itemEl !== undefined &&
        this.props.el.contains(channelPayloadItem.srcElement.el);
  }

  get attributesArray() {
    return [
      'accept',
      'accept-charset',
      'accesskey',
      'action',
      'align',
      'allow',
      'alt',
      'async',
      'autocapitalize',
      'autocomplete',
      'autofocus',
      'autoplay',
      'bgcolor',
      'border',
      'buffered',
      'challenge',
      'charset',
      'checked',
      'cite',
      'class',
      'code',
      'codebase',
      'color',
      'cols',
      'colspan',
      'content',
      'contenteditable',
      'contextmenu',
      'controls',
      'coords',
      'crossorigin',
      'csp',
      'dataset',
      'datetime',
      'decoding',
      'default',
      'defer',
      'dir',
      'dirname',
      'disabled',
      'download',
      'draggable',
      'dropzone',
      'enctype',
      'for',
      'form',
      'formaction',
      'headers',
      'height',
      'hidden',
      'high',
      'href',
      'hreflang',
      'http-equiv',
      'icon',
      'id',
      'importance',
      'integrity',
      'ismap',
      'itemprop',
      'keytype',
      'kind',
      'label',
      'lang',
      'language',
      'lazyload',
      'list',
      'loop',
      'low',
      'manifest',
      'max',
      'maxlength',
      'minlength',
      'media',
      'method',
      'min',
      'multiple',
      'muted',
      'name',
      'novalidate',
      'open',
      'optimum',
      'pattern',
      'ping',
      'placeholder',
      'poster',
      'preload',
      'radiogroup',
      'readonly',
      'referrerpolicy',
      'rel',
      'required',
      'reversed',
      'rows',
      'rowspan',
      'sandbox',
      'scope',
      'scoped',
      'selected',
      'shape',
      'size',
      'sizes',
      'slot',
      'span',
      'spellcheck',
      'src',
      'srcdoc',
      'srclang',
      'srcset',
      'start',
      'step',
      'style',
      'summary',
      'tabindex',
      'target',
      'title',
      'translate',
      'type',
      'usemap',
      'value',
      'width',
      'wrap'
    ];
  }

  //  =======================================================================================
  addMixins() {
    //  ==================================
    // BASE CORE MIXINS
    //  ==================================
    let coreMixins = baseCoreMixins();
    this.createId = coreMixins.createId;
/*    this.createpropsMap = coreMixins.createpropsMap;
    this.convertDomStringMapToObj = convertDomStringMapToObj;
    this.ifNilThenUpdate = ifNilThenUpdate;*/
    // this.gc = gc.bind(this);
    //  ==================================
    // BASE STREAM MIXINS
    //  ==================================
    //let streamMixins = baseStreamsMixins();
/*    this.sendUIPayload = streamMixins.sendUIPayload;
    this.sendRoutePayload = streamMixins.sendRoutePayload;
    this.createLifeStreamPayload = streamMixins.createLifeStreamPayload;*/
  }
}

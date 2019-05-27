// import {baseCoreMixins} from '../utils/mixins/base-core-mixins';
import { stepValidations, stepUpdateValidations, stepDisposeValidations } from './channels-config';
import { validate } from '../utils/channel-config-validator';
import { gc } from '../utils/gc';
// import {Right, Left, findInObj} from '../utils/frp-tools';
import { findInObj } from '../utils/frp-tools';

// import * as R from 'ramda';
export class LifestreamPayload {
  constructor(name, STEP, type, viewId, data = {}, debug = true) {
    this.addMixins();
    this.options = { name, STEP, type, viewId, data };
    this.getValidationChecks(STEP);
  }
  get data() {
    return this._data;
  }
  getValidationChecks(n) {
    let left  = e => console.warn(e);
    let right = val => this.onRunValidations(val);
    let obj = {
      LOAD:    stepValidations,
      RENDER:  stepValidations,
      MOUNT:   stepValidations,
      DISPOSE: stepDisposeValidations,
      UNMOUNT: stepValidations,
      GARBAGE_COLLECT: stepValidations,
      UPDATE:  stepUpdateValidations
    };
    return findInObj(obj, n, 'lifestream payload Needs a Valid Stream Name!')
      .fold(left, right);
  }
  onRunValidations(checks) {
    validate(checks(), this.options).fold(
      this.onError.bind(this),
      this.onSuccess.bind(this));
  }
  onPayloadValidated(p) {
    this._data = p;
    return p;
  }
  onError(errors) {
    console.error('payload failed due to:\n' + errors.map(e => '* ' + e).join('\n'));
    this.gc();
  }
  onSuccess(payload) {
    this.onPayloadValidated(payload);
  }
  addMixins() {
    //  ==================================
    // BASE CORE MIXINS
    //  ==================================
    // let coreMixins = baseCoreMixins();
    this.gc = gc;
  }
}

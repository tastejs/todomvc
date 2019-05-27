// const assert = require('assert');

import { SpyneUtilsChannelRoute } from '../../spyne/utils/spyne-utils-channel-route';

import {
  SpyneConfigData,
  RouteDataForTests,
  windowLocationData
} from '../mocks/utils-data';
import { SpyneChannelRoute } from '../../spyne/channels/spyne-channel-route';

const ObjtoStr = JSON.stringify;

const routeConfig = SpyneConfigData.channels.ROUTE;

describe('Route Utils', () => {
  it('flattenConfigObjects should return array of params', () => {
    const finalArr = ['pageId', '', 'imageNum', 'author', 'photogNum', 'randomNum'];
    let arr = SpyneUtilsChannelRoute.flattenConfigObject(routeConfig.routes);
    // return true;
    expect(arr).to.deep.equal(finalArr);
  });

  it('get route arr data should remove unused params', () => {
    const paramsArr = ['pageId', '', 'imageNum', 'author', 'photogNum'];
    const arr = ['imageNum', 'pageId', 'author'];
    const routedArr = ['pageId', 'imageNum', 'author'];
    let routeObj = SpyneUtilsChannelRoute.getRouteArrData(arr, paramsArr);
    expect(routeObj.paths).to.deep.equal(routedArr);
  });
});

describe('it should compare two objects for updated keys', () => {
  let obj1 = {
    'pageId': 'guide',
    'section': 'reference'
  };

  let obj2 = {
    'pageId': 'guide',
    'section': 'overview',
    'menuItem': 'intro-sending-channel-payloads',
    'type': 'menuItem',
    'isManualScroll': true
  };

  let obj3 = {
    ya: 1,
    ubu:3,
    lsd:4,
    aesf:'sadfsd',
    a23rff: 23,
    aasdsf: 234
  };

  let routeKeywordsArr = [
    'pageId',
    'section',
    'menuItem'
  ];

  let checkUpdatedKeys = SpyneUtilsChannelRoute.compareRouteKeywords();

  it('first comparison should be done against empty obj', () => {
    let compareStart = checkUpdatedKeys.compare(obj1);
    expect(compareStart.pathsChanged).to.deep.equal(['pageId', 'section']);
  });

  it('should compare second obj against first', () => {
    let compare2 = checkUpdatedKeys.compare(obj2, routeKeywordsArr);
    expect(compare2.pathsChanged).to.deep.equal(['section', 'menuItem']);
  });
});

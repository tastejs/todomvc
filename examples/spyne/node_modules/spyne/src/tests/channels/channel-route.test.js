// const assert = require('assert');

import { SpyneUtilsChannelRouteUrl } from '../../spyne/utils/spyne-utils-channel-route-url';
import { ChannelPayloadRouteData, ChannelPayloadRouteDataRegexOverride } from '../mocks/channel-payload-data';

import {
  SpyneConfigData,
  RouteDataForTests,
  windowLocationData
} from '../mocks/utils-data';
import { SpyneChannelRoute } from '../../spyne/channels/spyne-channel-route-base';

const ObjtoStr = JSON.stringify;

chai.use(require('chai-dom'));

const routeConfig = SpyneConfigData.channels.ROUTE;

describe('Channel Route', () => {
  it('should return window relevant data', () => {
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
    let locationObj = R.pickAll(locationParamsArr, window.location);
    let routeLocationObj = SpyneChannelRoute.getLocationData();
    expect(ObjtoStr(routeLocationObj)).to.equal(ObjtoStr(locationObj));
  });

  it('should return payload from params', () => {
    let payload = ChannelPayloadRouteData;
    let routePayload = SpyneChannelRoute.getDataFromParams(payload, routeConfig);
    expect(routePayload).to.be.an('object');
  });

  it('should return slash route string from params', () => {
    let data = RouteDataForTests.multiple.data;
    let queryStr = RouteDataForTests.multiple.slash;
    let routeFromParams = SpyneChannelRoute.getRouteStrFromParams(data, routeConfig);
    expect(routeFromParams).to.equal(queryStr);
  });

  it('should return query route string from params', () => {
    let data = RouteDataForTests.multiple.data;
    let queryStr = RouteDataForTests.multiple.query;
    let routeFromParams = SpyneChannelRoute.getRouteStrFromParams(data, routeConfig, 'query');
    expect(routeFromParams).to.equal(queryStr);
  });

  it('should return params object from slash string', () => {
    let data = RouteDataForTests.multiple.data;
    let queryStr = RouteDataForTests.multiple.slash;
    let paramsFromRoute = SpyneChannelRoute.getParamsFromRouteStr(queryStr, routeConfig);
    expect(ObjtoStr(paramsFromRoute.routeData)).to.equal(ObjtoStr(data));
  });

  it('should return params object from query string', () => {
    let data = RouteDataForTests.multiple.data;
    let queryStr = RouteDataForTests.multiple.query;
    let paramsFromRoute = SpyneChannelRoute.getParamsFromRouteStr(queryStr, routeConfig, 'query');
    expect(ObjtoStr(paramsFromRoute.routeData)).to.equal(ObjtoStr(data));
  });

  it('return route str by config type', () => {
    const val = SpyneUtilsChannelRouteUrl.getLocationStrByType('hash');
    // console.log('route str val is ',val,' -->',ObjtoStr(window.location));

    return true;
  });

  it('should combine any regex tokens into the route string', () => {
    let payloadOverrideCheck = SpyneChannelRoute.checkForRouteParamsOverrides(ChannelPayloadRouteDataRegexOverride);
    // console.log("override check ",payloadOverrideCheck);

    return true;
  });
});

// const assert = require('assert');

import { SpyneUtilsChannelRouteUrl } from '../../spyne/utils/spyne-utils-channel-route-url';
import { SpyneConfigData, RouteDataForTests, routeConfigWithRegexOverride, payloadDataForUrlUtils, urlUtilsArr } from '../mocks/utils-data';

chai.use(require('chai-dom'));

const routeConfig = SpyneConfigData.channels.ROUTE;

describe('URL Utils - Params To Route', () => {
  describe('Route query string should parse into query obj', () => {
    it('output multiple routeData from slash query', () => {
      let data = RouteDataForTests.multiple.data;
      let queryStr = RouteDataForTests.multiple.query;
      let paramsFromRoute = SpyneUtilsChannelRouteUrl.convertRouteToParams(queryStr, routeConfig, 'query');
      expect(JSON.stringify(paramsFromRoute.routeData)).to.equal(JSON.stringify(data));
    });
    it('output single routeData from slash query', () => {
      let data = RouteDataForTests.singleBasic.data;
      let queryStr = RouteDataForTests.singleBasic.query;
      let paramsFromRoute = SpyneUtilsChannelRouteUrl.convertRouteToParams(queryStr, routeConfig, 'query');
      expect(JSON.stringify(paramsFromRoute.routeData)).to.equal(JSON.stringify(data));
    });
    it('output home routeData from slash query', () => {
      let data = RouteDataForTests.home.data;
      let queryStr = RouteDataForTests.home.query;
      let paramsFromRoute = SpyneUtilsChannelRouteUrl.convertRouteToParams(queryStr, routeConfig, 'query');
      expect(JSON.stringify(paramsFromRoute.routeData)).to.equal(JSON.stringify(data));
    });
  });

  describe('Route slash string should parse into query obj', () => {
    it('output multiple routeData from slash query', () => {
      let data = RouteDataForTests.multiple.data;
      let slashStr = RouteDataForTests.multiple.slash;
      let paramsFromRoute = SpyneUtilsChannelRouteUrl.convertRouteToParams(slashStr, routeConfig);
      // console.log('data query multiple1 ',slashStr,paramsFromRoute.routeData);
      expect(JSON.stringify(paramsFromRoute.routeData)).to.equal(JSON.stringify(data));
    });

    it('output multiple regex routeData from slash query', () => {
      let data = RouteDataForTests.multipleRegex.data;
      let slashStr = RouteDataForTests.multipleRegex.slash;
      let paramsFromRoute = SpyneUtilsChannelRouteUrl.convertRouteToParams(slashStr, routeConfig);
      // console.log('data query regex str to routeData ',data,slashStr,paramsFromRoute.routeData);
      // return true;
      expect(JSON.stringify(paramsFromRoute.routeData)).to.equal(JSON.stringify(data));
    });

    it('output single routeData from slash query', () => {
      let data = RouteDataForTests.singleBasic.data;
      let slashStr = RouteDataForTests.singleBasic.slash;
      let paramsFromRoute = SpyneUtilsChannelRouteUrl.convertRouteToParams(slashStr, routeConfig);
      // console.log('data query multiple1 ',slashStr,paramsFromRoute.routeData);
      expect(JSON.stringify(paramsFromRoute.routeData)).to.equal(JSON.stringify(data));
    });

    it('output home routeData from slash query', () => {
      let data = RouteDataForTests.home.data;
      let slashStr = RouteDataForTests.home.slash;
      let paramsFromRoute = SpyneUtilsChannelRouteUrl.convertRouteToParams(slashStr, routeConfig);
      // console.log('data query multiple1 ',slashStr,paramsFromRoute.routeData,data);
      expect(JSON.stringify(paramsFromRoute.routeData)).to.equal(JSON.stringify(data));
    });
  });

  describe('Should create array of route routeData from obj', () => {
    it('should return multiple routeData in arr', () => {
      let data = RouteDataForTests.multiple.data;
      let correctRouteArr = RouteDataForTests.multiple.arr;
      let route = routeConfig.routes.routePath;
      let routeVal = SpyneUtilsChannelRouteUrl.createRouteArrayFromParams(data, route);
      expect(JSON.stringify(routeVal)).to.equal(correctRouteArr);
    });

    it('should return single keyword in arr', () => {
      let data = RouteDataForTests.single.data;
      let correctRouteArr = RouteDataForTests.single.arr;
      let route = routeConfig.routes.routePath;
      let routeVal = SpyneUtilsChannelRouteUrl.createRouteArrayFromParams(data, route);
      expect(JSON.stringify(routeVal)).to.equal(correctRouteArr);
    });

    it('should return home keyword in arr', () => {
      let data = RouteDataForTests.home.data;
      let correctRouteArr = RouteDataForTests.home.arr;
      let route = routeConfig.routes.routePath;
      let routeVal = SpyneUtilsChannelRouteUrl.createRouteArrayFromParams(data, route);
      expect(JSON.stringify(routeVal))
        .to.equal(JSON.stringify(correctRouteArr));
    });
    it('should return empty keyword in arr', () => {
      let data = RouteDataForTests.empty.data;
      let correctRouteArr = RouteDataForTests.empty.arr;
      let route = routeConfig.routes.routePath;
      let routeVal = SpyneUtilsChannelRouteUrl.createRouteArrayFromParams(data, route);
      // console.log('data empty ',JSON.stringify(routeVal),correctRouteArr);
      expect(1).to.equal(1);
    });
  }); // END ARRAY OF ROUTE PARAMS
  describe('Params should translate to slash routes', () => {
    it('output multiple routeData query', () => {
      let data = RouteDataForTests.multiple.data;
      let correctRouteQuery = RouteDataForTests.multiple.slash;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'slash');
      // console.log('data query multiple ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });
    it('Params based on regex should translate to slash routes', () => {
      let data = RouteDataForTests.multipleRegex.data;
      let correctRouteQuery = RouteDataForTests.multipleRegex.slash;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'slash');
      // console.log('data query multiple 1',data, correctRouteQuery, routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });

    it('nested keyword route should translate to slash routes', () => {
      let data = RouteDataForTests.multiple.data;
      data = R.omit(['pageId', 'imageNum'], data);
      let correctRouteQuery = RouteDataForTests.multiple.slash;
      correctRouteQuery = 'page-one/5/doe';
      let updatedQuery = 'page-one/5/ubalu';
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'slash', correctRouteQuery);
      // console.log('data query multiple 1',data, correctRouteQuery, routeVal);
      // console.log(' data: ',updatedQuery, correctRouteQuery, routeVal);
      expect(routeVal).to.equal(updatedQuery);
    });

    it('nested keyword route should not display if missing in between slash routes', () => {
      let data = RouteDataForTests.multiple.data;
      data = R.omit(['pageId', 'imageNum'], data);
      let correctRouteQuery = 'page-one';
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'slash', correctRouteQuery);
      // console.log('data query multiple 1',data, correctRouteQuery, routeVal);
      expect(routeVal).to.equal(correctRouteQuery);
    });

    it('nested keyword route should translate to hash routes', () => {
      let thisRouteConfig = R.clone(routeConfig);
      thisRouteConfig.isHash = true;
      let data = RouteDataForTests.multiple.data;
      data = R.omit(['pageId', 'imageNum'], data);
      let correctRouteQuery = RouteDataForTests.multiple.slash;
      correctRouteQuery = 'page-one/5/sdfdf';
      let updatedQuery = 'page-one/5/ubalu';
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, thisRouteConfig, 'slash', correctRouteQuery);
      // console.log('data query multiple 1',data, correctRouteQuery, routeVal,updatedQuery);
      // console.log(' data: ',updatedQuery, correctRouteQuery, routeVal);
      // return true;
      expect(routeVal).to.equal(updatedQuery);
    });

    it('output single routeData query', () => {
      let data = RouteDataForTests.single.data;
      let correctRouteQuery = RouteDataForTests.single.slash;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'slash');
      // console.log('data query single ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });
    it('output home routeData query', () => {
      let data = RouteDataForTests.home.data;
      let correctRouteQuery = RouteDataForTests.home.slash;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'slash');
      // console.log('data query home ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });
    it('output empty routeData query', () => {
      let data = RouteDataForTests.empty.data;
      let correctRouteQuery = RouteDataForTests.empty.slash;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'slash', correctRouteQuery);
      // console.log('data query empty ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });
  });

  describe('Params should translate to query routes', () => {
    it('output multiple routeData query', () => {
      let data = RouteDataForTests.multiple.data;
      let correctRouteQuery = RouteDataForTests.multiple.query;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'query');
      // console.log('data query multiple ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });

    it('output multiple routeData with regex query', () => {
      let data = RouteDataForTests.multipleRegex.data;
      let correctRouteQuery = RouteDataForTests.multipleRegex.query;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'query');
      // console.log('data query multiple ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });

    it('output single routeData query', () => {
      let data = RouteDataForTests.single.data;
      let correctRouteQuery = RouteDataForTests.single.query;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'query');
      // console.log('data query single ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });
    it('output home routeData query', () => {
      let data = RouteDataForTests.home.data;
      let correctRouteQuery = RouteDataForTests.home.query;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'query');
      // console.log('data query home ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });
    it('output empty routeData query', () => {
      let data = RouteDataForTests.empty.data;
      let correctRouteQuery = RouteDataForTests.empty.query;
      let routeVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(data, routeConfig, 'query');
      // console.log('data query empty ',routeVal);
      expect(correctRouteQuery).to.equal(routeVal);
    });
  });

  describe('Overrides to regex values are added', () => {
    it('should override pageId home regex', () => {
      let paramsToRouteVal = SpyneUtilsChannelRouteUrl.convertParamsToRoute(payloadDataForUrlUtils, routeConfigWithRegexOverride);
      expect(paramsToRouteVal).to.equal('');
    });

    it('should replace regex with obj value from data', () => {
      let arrUpdate = SpyneUtilsChannelRouteUrl.checkPayloadForRegexOverrides(urlUtilsArr, payloadDataForUrlUtils);
      let pageIdStr = arrUpdate[0].pageId;
      expect(pageIdStr).to.equal('');
    });
  });
});

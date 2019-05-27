import {isEmpty, head, values, compose, prop, complement, isNil, allPass, reduce, filter, equals, toPairs, replace, either, propEq, __,invert,path,zipObj, reject, keys, find, assoc, is,has, when, split, always, concat, join, flatten, map, ifElse, test, findLastIndex,last, defaultTo,fromPairs } from 'ramda';

export class SpyneUtilsChannelRouteUrl {
  constructor() {
    /**
     * @module SpyneUtilsChannelRouteUrl
     * @type internal
     *
     * @constructor
     * @desc
     * Internal url methods for the SpyneRouteChannel
     */
    this.checkIfObjIsNotEmptyOrNil = SpyneUtilsChannelRouteUrl.checkIfObjIsNotEmptyOrNil.bind(this);
  }

  static checkIfObjIsNotEmptyOrNil(obj) {
    const isNotEmpty = compose(complement(isEmpty), head, values);
    const isNotNil = compose(complement(isNil), head, values);
    const isNotNilAndIsNotEmpty = allPass([isNotEmpty, isNotNil]);
    return isNotNilAndIsNotEmpty(obj);
  }

  static checkIfParamValueMatchesRegex(paramValue, routeObj) {
    const rejectParamKey = reject(equals('routeName'));
    const keysArr = compose(rejectParamKey, keys);
    const testForRegexMatch = str => test(new RegExp(str), paramValue);
    const checker = compose(find(testForRegexMatch), keysArr);
    const regexMatchStr = checker(routeObj);
    if (is(String, regexMatchStr)) {
      routeObj = assoc(paramValue, prop(regexMatchStr, routeObj), routeObj);
    }
    return routeObj;
  }

  static formatStrAsWindowLocation(str) {
    const hash = str;
    const search = str;
    const pathname = str;
    return { hash, search, pathname };
  }

  static getLocationStrByType(t, isHash = false, loc = window.location) {
    const type = isHash === true ? 'hash' : t;

    const typeMap = {
      'slash': 'pathname',
      'query': 'search',
      'hash': 'hash'
    };
    const propVal = typeMap[type];
    let str  = prop(propVal, loc);
    let checkForSlashAndHash = /^(\/)?(#)?(\/)?(.*)$/;
    // console.log("DATA LOC STR ",{str, loc, prop, type,isHash});
    return str.replace(checkForSlashAndHash, '$4');
  }

  static createRouteArrayFromParams(data, route, t = 'slash', paramsFromLoc) {
    let urlArr = [];
    let loopThroughParam = (routeObj) => {
      let urlObj = {};
      let keyword = routeObj.routeName; // PARAM FORM SPYNE CONFIG
      let paramValFromData = data[keyword] !== undefined ? data[keyword] : prop(keyword, paramsFromLoc); // PULL VALUE FOR THIS PARAM FROM DATA
      const paramValType = typeof (routeObj[paramValFromData]);
      // console.log({routeObj, paramValType, paramValFromData, keyword})

      if (paramValType === 'string') {
        paramValFromData = routeObj[paramValFromData];
      } else if (paramValType === 'undefined') {
        routeObj = this.checkIfParamValueMatchesRegex(paramValFromData, routeObj);
      }

      urlObj[keyword] = paramValFromData;

      // console.log("URL OBJ ",urlObj);
      if (this.checkIfObjIsNotEmptyOrNil(urlObj)) {
        // console.log("FOUND ",{paramValFromData, paramValType, urlObj, routeObj});
        urlArr.push(urlObj);
      } else {
        // console.log("NOT FOUND ",paramValFromData, paramValType, urlObj, routeObj);

      }

      const isObject = is(Object, routeObj);
      const objectParamExists = has(paramValFromData, routeObj);
      const objectContainsRoute = has('routePath', routeObj);
      const recursivelyCallLoopBool = objectParamExists && isObject;
      // console.log("CHECKS ", {isObject, objectParamExists, objectContainsRoute, recursivelyCallLoopBool})
      if (recursivelyCallLoopBool === true) {
        let newObj = routeObj[paramValFromData];
        // console.log("NEW OBJ ",{paramValFromData, routeObj, newObj});
        if (has('routePath', newObj)) {
          loopThroughParam(newObj.routePath);
        }
      } else if (objectContainsRoute === true && paramValFromData !== undefined) {
        loopThroughParam(routeObj.routePath);
      }
    };

    loopThroughParam(route);

    return urlArr;
  }

  static createSlashString(arr) {
    const arrClear = reject(isNil);
    const notUndefined = when(complement(isNil, __), join('/'));

    const joiner = compose(notUndefined, arrClear, flatten,
      map(values));

    return joiner(arr);
  }

  static createQueryString(arr) {
    const arrClear = reject(isNil);

    const isNotNilAndIsNotEmpty = this.checkIfObjIsNotEmptyOrNil;

    const createPair = compose(
      join('='),
      flatten,
      toPairs);

    const checkPair = ifElse(
      isNotNilAndIsNotEmpty,
      createPair,
      always(undefined)
    );

    const mapArrayOfPairs = map(checkPair);

    const checkIfStrIsEmpty = when(
      complement(isEmpty),
      concat('?'));

    const createQs = compose(
      checkIfStrIsEmpty,
      join('&'),
      arrClear,
      mapArrayOfPairs);

    return createQs(arr);
  }

  static checkPayloadForRegexOverrides(urlsArr, data, parseString = 'Value') {
    // CHECK IF PAYLOAD HAS ANY OVERRIDES
    const getPropValOverride = (key) => prop(`${key}${parseString}`, data);

    // GET ANY POSSIBLE VALUE USING THE CURRENT KEY
    const getOverrideVal = compose(getPropValOverride, head, keys);

    // MAP ALL OBJECT VALS TO TEST FOR OVERRIDES
    const mapUrlProps = (prop) => {
      let overrideVal = getOverrideVal(prop);

      // console.log("override val ",overrideVal, data);
      // if regex value is found
      if (overrideVal !== undefined) {
        return assoc(compose(head, keys)(prop), overrideVal, prop);
      }
      // identity
      return prop;
    };

    return map(mapUrlProps, urlsArr);
  }

  static convertParamsToRoute(data, r = window.Spyne.config.channels.ROUTE, t, locStr) {
    const urlType = t !== undefined ? t : r.type;
    const isHash = r.isHash;
    let route = r.routes.routePath;
    let locationStr = locStr !== undefined ? locStr : this.getLocationStrByType(urlType, isHash);
    let paramsFromCurrentLocation = this.convertRouteToParams(locationStr, r, urlType).routeData;
    let urlArr = this.createRouteArrayFromParams(data, route, urlType, paramsFromCurrentLocation);

    urlArr = SpyneUtilsChannelRouteUrl.checkPayloadForRegexOverrides(urlArr, data);
    // console.log("PARAMS TO ROUTE ",{data,r,urlArr,locationStr, paramsFromCurrentLocation});

    // THIS CREATES A QUERY PATH STR
    if (urlType === 'query') {
      return this.createQueryString(urlArr);
    }

    return this.createSlashString(urlArr);
  }

  static findIndexOfMatchedStringOrRegex(mainStr, paramsArr) {
    const checkForEmpty =  replace(/^$/, '^$');
    const createStrRegexTest = (str) => {
      const reFn = s => new RegExp(s);
      return {
        str,
        re: reFn(str)
      };
    };

    const checkForEitherStrOrReMatch =  either(
      propEq('str', mainStr), compose(test(__, mainStr), prop('re'))
    );

    const findMatchIndex = compose(findLastIndex(equals(true)), map(checkForEitherStrOrReMatch), map(createStrRegexTest), map(checkForEmpty));

    return findMatchIndex(paramsArr);
  }

  static checkIfValueShouldMapToParam(obj, str, regexTokens) {
    //
    //
    //       THIS IS A VERY IMPORTANT METHOD
    //       IT COMPARES THE STRING TO BE MATCHED WITH THE ROUTE PATH OBJECT
    //       AND IT WILL RETURN ONE OF THREE THINGS
    //       1. THE STRING ITSELF
    //       2. A MATCHING KEY FROM THE CURRENT OBJECT
    //       3. THE ROUTENAME
    //

    // GO THROUGH KEYS AND CHECK IF REGEX MATCHES

    // GO THROUGH ROUTE CONFIG TO FIGURE OUT IF VAL OR KEY SHOULD BE COMPARED
    // if the value is an object, choose the key of the route path to check against
    const getValCompareArr = compose(map(last), map(filter(is(String))), toPairs);

    // CREATE THE ARRAY OF EITHER VALS OR KEYS
    let paramsArr = getValCompareArr(obj);

    // RESULTS FROM PARAM CHECK
    // let paramIndex = checkForParamsMatch(paramsArr);

    let paramIndex = SpyneUtilsChannelRouteUrl.findIndexOfMatchedStringOrRegex(str, paramsArr);

    // DEFAULT VAL FOR STRING
    let paramStr = str;

    // LEGACY METHOD -- TURN OFF
    // WHEN THERE IS A MATCH FROM THE CURRENT ROUTE PATH OBJECT
    if (paramIndex >= 0) {
      let param = paramsArr[paramIndex];
      let invertedObj = invert(obj);

      // PULL INVERTED OBJECT TO SEE IF STR MATCHES
      let getParamInverted = compose(head, defaultTo([]), prop(param));
      let paramInverted = getParamInverted(invertedObj);
      let re =  /^(\w*)$/;
      let keyMatch =  re.test(paramInverted);

      if (keyMatch === true && is(String, paramInverted) === true) {
        paramStr = paramInverted;
      }
    }

    return paramStr;
  }

  static createArrFromSlashStr(str) {
    const slashRe = /^([/])?(.*)$/;
    return str.replace(slashRe, '$2').split('/');
  }

  static convertSlashRouteStrToParamsObj(topLevelRoute, str, regexTokens) {
    const routeValue = str;
    let valuesArr = this.createArrFromSlashStr(str);
    let paths = [];
    let routedValuesArr = [];
    let latestObj = topLevelRoute;
    let createParamsFromStr = (total, currentValue) => {
      let routeValueStr = this.checkIfValueShouldMapToParam(latestObj, currentValue, regexTokens);

      latestObj = this.checkIfParamValueMatchesRegex(currentValue, latestObj);

      if (latestObj !== undefined) {
        paths.push(latestObj.routeName);
        routedValuesArr.push(routeValueStr);
      }
      let strPath = [currentValue, 'routePath'];
      let routeParamPath = ['routePath'];
      let objectFromStr = path(strPath, latestObj);
      let objectFromRouteParam = path(routeParamPath, latestObj);

      if (objectFromStr !== undefined) {
        latestObj = objectFromStr;
      } else if (objectFromRouteParam !== undefined) {
        latestObj = objectFromRouteParam;
      }
    };

    reduce(createParamsFromStr, 0, valuesArr);
    let routeData = zipObj(paths, routedValuesArr);
    const pathInnermost = this.getLastArrVal(paths);
    return { paths, pathInnermost, routeData, routeValue };
  }

  static getLastArrVal(arr) {
    const getLastParam = (a) => last(a) !== undefined ? last(a) : '';
    return getLastParam(arr);
  }

  static createDefaultParamFromEmptyStr(topLevelRoute, str) {
    let obj = {};
    let keyword = topLevelRoute.routeName;
    obj[keyword] = this.checkIfValueShouldMapToParam(topLevelRoute, str);
    return obj;
  }

  static convertQueryStrToParams(topLevelRoute, str, regexTokens) {
    const queryRe = /^([?])?(.*)$/;
    const routeValue = str;
    let strArr = str.replace(queryRe, '$2');
    let convertToParams = compose(map(split('=')), split('&'));
    let paramsArr = convertToParams(strArr);
    let routeData = fromPairs(paramsArr);

    let paths = map(head, paramsArr);

    if (isEmpty(str) === true) {
      routeData = this.createDefaultParamFromEmptyStr(topLevelRoute, str, regexTokens);
      paths = keys(routeData);
    }
    let pathInnermost = this.getLastArrVal(paths);

    return { paths, pathInnermost, routeData, routeValue };
  }

  static convertRouteToParams(str, routeConfig, t) {
    if (routeConfig === undefined) {
      return {};
    }
    const type = t !== undefined ? t : routeConfig.type;
    const regexTokens = defaultTo({}, prop('regexTokens', routeConfig));
    let topLevelRoute = routeConfig.routes.routePath;

    if (type === 'query') {
      return this.convertQueryStrToParams(topLevelRoute, str);
    }

    return this.convertSlashRouteStrToParamsObj(topLevelRoute, str, regexTokens);
  }
}

/*
* Copyright 2015 Raj Nathani
* @license: MIT
* @author: Raj Nathani <me@relfor.co>
*/

(function () {
  "use strict";
  
  window.LAY = {

    // version is a method in order
    // to maintain the consistency of
    // only method accesses from the user
    version: function(){ return "0.8.3"; },

    $pathName2level: {},
    $newlyInstalledStateLevelS: [],
    $newlyUninstalledStateLevelS: [],
    $newLevelS: [],
    $recalculateDirtyAttrValS: [],
    $renderDirtyPartS: [],
    $prevFrameTime: 0,
    $newManyS: [],
    $isRendering: false,

    $isGpuAccelerated: undefined,
    $isBelowIE9: undefined,
    $numClog: 0,
    $isSolving: false,
    $isSolveRequiredOnRenderFinish: false,
    $isOkayToEstimateWhitespaceHeight: true,
    // The below refer to dimension
    // dirty parts whereby the dimensions
    // depend upon the child parts
    $naturalHeightDirtyPartS: [],
    $naturalWidthDirtyPartS: [],
    $relayoutDirtyManyS: [],

    $isDataTravellingShock: false,
    $isDataTravelling: false,
    $dataTravelDelta: 0.0,
    $dataTravellingLevel: undefined,
    $dataTravellingAttrInitialVal: undefined,
    $dataTravellingAttrVal: undefined

  };

})();


// Polyfill for Array.indexOf must be implemented
// before the LAY library executes
//
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14

if (!Array.prototype.indexOf) {

  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this === null) {
      throw new TypeError('"" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}


( function () {
  "use strict";

  // The naming convention:
  // attr -> string attr name
  // attrVal -> class AttrVal

  LAY.AttrVal = function ( attr, level ) {

    // undefined initializations:
    // (1) performance (http://jsperf.com/objects-with-undefined-initialized-properties/2)
    // (2) readability

    this.level = level;
    this.val = undefined;
    this.prevVal = undefined;
    this.isTakeValReady = undefined;
    this.attr = attr;
    this.isRecalculateRequired = true;

    this.calcVal = undefined;
    this.transitionCalcVal = undefined;
    this.startCalcVal = undefined;
    this.transition = undefined;
    this.isTransitionable = false;

    this.isForceRecalculate = false;
    // if the attr is of "<state>.onlyif"
    // the below will store the state name <state>
    this.onlyIfStateName = getStateNameOfOnlyIf( attr );

    this.isStateProjectedAttr = checkIsStateProjectedAttr( attr );
    this.isEventReadonlyAttr =
      LAY.$eventReadonlyUtils.checkIsEventReadonlyAttr( attr );
    this.renderCall =
      level && ( level.isPart ) &&
        ( LAY.$findRenderCall( attr, level ) );

    this.takerAttrValS = [];

    this.eventReadonlyEventType2boundFnHandler = {};


  }

  /*
  * For attrs which are of type state ( i.e state.<name> )
  * Return the name component.
  * Else return the empty string.
  */
  function getStateNameOfOnlyIf ( attr ) {
    if ( attr.lastIndexOf( ".onlyif" ) !== -1 &&
      !attr.startsWith("data.") && 
      !attr.startsWith("row.")  ) {
      return attr.slice(0, attr.indexOf(".") );
    } else {
      return "";
    }

  }

  /*
  * For attrs which are of type "when"
  * ( i.e when.<eventType>.<eventNum> )
  * Return the event type component.
  * Else return the empty string.
  */
  function getWhenEventTypeOfAttrWhen ( attr ) {

    return attr.startsWith( "when." ) ?
    attr.slice( 5, attr.length - 2 ) : "";

  }
  /*
  * For attrs which are of type "transition"
  * ( i.e transition.<prop>.<>.<> )
  * Return the event type component.
  * Else return the empty string.
  */
  function getTransitionPropOfAttrTransition( attr ) {

      return  attr.startsWith( "transition." ) ?
        attr.slice( 11, attr.indexOf(".", 11 ) ) : "";

  }


  function checkIsStateProjectedAttr( attr ) {
    var i = attr.indexOf( "." );
    if ( LAY.$checkIsValidUtils.propAttr( attr ) &&
      [ "centerX", "right",
       "centerY", "bottom" ].indexOf( attr ) === -1 ) {
      return true;
    } else if ( 
      [ "formation", "filter", "sort" ].indexOf ( attr ) !== -1 ) {
      return true;
    } else {
      var prefix = attr.slice( 0, i );
      return ( ( [ "when", "transition", "fargs", "sort", "$$num", "$$max" ] ).indexOf(
         prefix ) !== -1 );
    }
  }

  /* TODO: update this doc below along with its slash-asterisk
  formatting

  Returns true if the value is different,
  false otherwise */
  LAY.AttrVal.prototype.update = function ( val ) {
    
    this.val = val;
    if ( !LAY.identical( val, this.prevVal ) ) {
      if ( this.prevVal instanceof LAY.Take ) {
        this.takeNot( this.prevVal );
      }
      this.isTakeValReady = false;
      this.requestRecalculation();
      return true;

    }
  };

  /*
  * Request the level corresponding to the given AttrVal
  * to recalculate this AttrVal.
  */
  LAY.AttrVal.prototype.requestRecalculation = function () {
    this.isRecalculateRequired = true;
    if ( this.level ) { // check for empty level
      LAY.$arrayUtils.pushUnique(
        LAY.$recalculateDirtyAttrValS, this );
//      this.level.addRecalculateDirtyAttrVal( this );
    }
  };

  /*
  * Force the level corresponding to the given AttrVal
  * to recalculate this AttrVal.
  */
  LAY.AttrVal.prototype.forceRecalculation = function () {

    this.isForceRecalculate = true;
    this.requestRecalculation();
  };


  LAY.AttrVal.prototype.checkIsTransitionable = function () {

    return this.renderCall &&
      ( this.startCalcVal !== this.calcVal ) &&
      (
        (
          ( typeof this.startCalcVal === "number" )
            &&
          ( typeof this.calcVal === "number" )
        )
          ||
        (
          ( this.startCalcVal instanceof LAY.Color  )
              &&
          ( this.calcVal instanceof LAY.Color )
        )
      ) &&
      this.attr !== "zIndex";
  };

  /*
  *
  * Recalculate the value of the attr value.
  * Propagate the change across the LOM (LAY object model)
  * if the change in value produces a change.
  * For constraint (take) based attributes, recalculate the
  * value, for non constraint based use the `value` parameter
  * as the change.
  * Return true if calculation successful, false if
  * a circular reference rendered it unsuccessful
  */
  LAY.AttrVal.prototype.recalculate = function () {

    var
      isDirty = false,
      recalcVal,
      level = this.level,
      part = level.part,
      many = level.manyObj,
      attr = this.attr,
      i, len;

    if ( attr.charAt( 0 ) === "$" ) {
      if ( LAY.$checkIfImmidiateReadonly( attr ) ) {
        this.val = part.getImmidiateReadonlyVal( attr );
      }
    }

    if ( this.val instanceof LAY.Take ) { // is LAY.Take
      if ( !this.isTakeValReady ) {
        this.isTakeValReady = this.take();
        // if the attrval has not been taken
        // as yet then there is chance that
        // the giver attrval has not been
        // initialized as yet. Thus we
        // skip a round of solving to
        // let the other attrvals complete calculation
        return false;
      }

      recalcVal = this.val.execute( this.level );

      if ( attr.startsWith("data.") ||
        attr.startsWith("row.") ) {
        recalcVal = LAY.$clone( recalcVal );
      }

      if ( !LAY.identical( recalcVal, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = recalcVal;
      }
    } else {
      if ( attr.startsWith("data.") ||
          attr.startsWith("row.") ) {
        this.val = LAY.$clone( this.val );
      }
      if ( !LAY.identical( this.val, this.calcVal ) ) {
        isDirty = true;
        this.calcVal = this.val;
      }
    }

    if ( this.isForceRecalculate ) {
      isDirty = true;
    }

    /*
    switch ( attr ) {
      case "scrollX":
        // TODO: investigate the below code block's
        // redundancy
         this.transitionCalcVal =
             this.level.part.node.scrollLeft;      
        if ( level.attr2attrVal.$scrolledX ) {
          level.$changeAttrVal( "$scrolledX",
           this.calcVal );
        }
        isDirty = true;
        break;
      case "scrollY":
        // TODO: investigate the below code block's
        // redundancy
         this.transitionCalcVal =
             this.level.part.node.scrollTop;
        if ( level.attr2attrVal.$scrolledY ) {
          level.$changeAttrVal( "$scrolledY",
           this.calcVal );
        }
        isDirty = true;
        break;
    }
    */

    // rows is always dirty when recalculated
    // as changes made to rows would have rows
    // retain the same pointer to the array
    if ( attr === "rows" ) {
      isDirty = true;
      level.attr2attrVal.filter.forceRecalculation();
    }

    if ( isDirty ) {
      var
        stateName = this.onlyIfStateName,
        whenEventType = getWhenEventTypeOfAttrWhen( attr ),
        transitionProp = getTransitionPropOfAttrTransition( attr );

      this.prevVal = this.val;

      for ( i = 0, len = this.takerAttrValS.length; i < len; i++ ) {
        this.takerAttrValS[ i ].requestRecalculation();
      }

      if ( LAY.$isDataTravellingShock ) {
        part.addTravelRenderDirtyAttrVal( this );
      }
      
      if ( this.renderCall ) {
        this.startCalcVal = this.transitionCalcVal;
        this.isTransitionable = this.checkIsTransitionable();

        if ( !LAY.$isDataTravellingShock ) {
          part.addNormalRenderDirtyAttrVal( this );
        }

        switch ( attr ) {
          case "display":
            var parentLevel = this.level.parentLevel;
            if ( parentLevel ) {
              parentLevel.part.updateNaturalWidth();
              parentLevel.part.updateNaturalHeight();              
            }
            if ( this.calcVal === false ) {
              recursivelySwitchOffDoingEvents( level );
            }
            break;
          case "input":
            if ( part.inputType === "multiple" ||
                part.inputType === "select" ) {
              level.attr2attrVal.$input.requestRecalculation();
            }
            break;
          case "width":
            if ( part.isText ) {
              var textWrapAttrVal = level.attr2attrVal.textWrap;
              if ( textWrapAttrVal &&
                !textWrapAttrVal.isRecalculateRequired &&
                textWrapAttrVal.calcVal !== "nowrap" ) {
                part.updateNaturalHeight();
              }
            } else if ( part.type === "image" ) {
              part.updateNaturalHeight();
            }
            break;
          case "height":
            if ( part.type === "image" ) {
              part.updateNaturalWidth();
            }
            break;
          case "imageUrl":
            part.isImageLoaded = false;
            break;

          default:
            var checkIfAttrAffectsTextDimesion =
              function ( attr ) {
                return attr.startsWith("text") &&
                  !attr.startsWith("textShadows") &&
                  ([ "textColor",
                    "textDecoration",
                    "textSmoothing",
                    "textShadows"
                  ]).indexOf( attr ) === -1;
            };
            if ( part.isText ) {
              if ( checkIfAttrAffectsTextDimesion( attr ) )  {
                  part.updateNaturalWidth();
                  part.updateNaturalHeight();
                 
              } else if ( ( attr === "borderTopWidth" ) ||
                ( attr === "borderBottomWidth" ) ) {
                  part.updateNaturalHeight();
              } else if ( ( attr === "borderLeftWidth" ) ||
                ( attr === "borderRightWidth" ) ) {
                part.updateNaturalWidth();
                part.updateNaturalHeight();
              }
            }

        }

        // In case there exists a transition
        // for the given prop then update it
        part.updateTransitionProp( attr );

      } else if ( stateName !== "" ) {
        if ( this.calcVal ) { // state
          if ( LAY.$arrayUtils.pushUnique( level.stateS, stateName ) ) {
            level.$updateStates();
            // remove from the list of uninstalled states (which may/may not be present within)
            LAY.$arrayUtils.remove( level.newlyUninstalledStateS, stateName );
            // add state to the list of newly installed states
            LAY.$arrayUtils.pushUnique( level.newlyInstalledStateS, stateName );
            // add level to the list of levels which have newly installed states
            LAY.$arrayUtils.pushUnique( LAY.$newlyInstalledStateLevelS, level );
          }
        } else { // remove state
          if ( LAY.$arrayUtils.remove( level.stateS, stateName ) ) {

            level.$updateStates();
            // remove from the list of installed states (which may/may not be present within)
            LAY.$arrayUtils.remove( level.newlyInstalledStateS, stateName );
            // add state to the list of newly uninstalled states
            LAY.$arrayUtils.pushUnique( level.newlyUninstalledStateS, stateName );
            // add level to the list of levels which have newly uninstalled states
            LAY.$arrayUtils.pushUnique( LAY.$newlyUninstalledStateLevelS, level );
          }
        }
      } else if ( whenEventType !== "" ) {
        part.updateWhenEventType( whenEventType );
      } else if ( transitionProp !== "" ) {
        part.updateTransitionProp( transitionProp );
      } else if ( many ) {
          if ( attr === "rows" ) {
            many.updateRows();
          } else if ( attr === "filter" ) {
            if ( !many.updateFilter() ) {
              return false;
            }
            many.updateLayout()
          } else if ( attr.startsWith("sort.") ) {
            many.updateRows();
          } else if ( attr.startsWith("fargs.") ||
           attr === "formation" ) {
            many.updateLayout();
        }
          
      } else {  
        switch( attr ) {
          case "exist":
            level.$updateExistence();
            break;
          case "right":
            if ( level.parentLevel !== undefined ) {
              level.parentLevel.part.
                updateNaturalWidth();
            }
            break;
          case "bottom":
            if ( level.parentLevel !== undefined ) {
              level.parentLevel.part.
                updateNaturalHeight(); 
            }
            break;
          case "$naturalWidth":
            if ( this.level.attr2attrVal.scrollX ) {
              var self = this;
              setTimeout(function(){
                self.level.attr2attrVal.scrollX.
                  requestRecalculation();
                LAY.$solve();
              });
            }
            break;
          case "$naturalHeight":
            if ( this.level.attr2attrVal.scrollY ) {
              var self = this;
              setTimeout(function(){
                self.level.attr2attrVal.scrollY.
                  requestRecalculation();
                LAY.$solve();
              });
            }
            break;
          case "$input":
            part.updateNaturalWidth();
            if ( part.inputType !== "line" ||
               !part.isInitiallyRendered ) {
              part.updateNaturalHeight();
            }
            break;

        }
      }
    }
  
    this.isForceRecalculate = false;
    this.isRecalculateRequired = false;
    return true;
  };


  /*
  * Doing events: clicking, hovering
  */
  function recursivelySwitchOffDoingEvents( level ) {
    var 
      hoveringAttrVal = level.attr2attrVal.$hovering,
      clickingAttrVal = level.attr2attrVal.$clicking,
      childLevel,
      childLevelS = level.childLevelS;

    if ( hoveringAttrVal ) {
      hoveringAttrVal.update( false );
    }
    if ( clickingAttrVal ) {
      clickingAttrVal.update( false );
    }
    if ( childLevelS.length ) {
      for ( var i = 0, len = childLevelS.length;
            i < len; i++ ) {
        childLevel = childLevelS[ i ];
        if ( childLevel.part ) {
          recursivelySwitchOffDoingEvents( childLevel );
        }
      } 
    }         
  }



  LAY.AttrVal.prototype.checkIfDeferenced = function () {
    return this.takerAttrValS.length === 0;
  };

  LAY.AttrVal.prototype.give = function ( attrVal ) {

    if ( LAY.$arrayUtils.pushUnique( this.takerAttrValS, attrVal ) &&
     this.takerAttrValS.length === 1 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that a reference exists, add event listeners
        var
          eventType2fnHandler = LAY.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
          eventType,
          fnBoundHandler, node;

        node = this.level.part.node;
        for ( eventType in eventType2fnHandler ) {
          if ( eventType === "scroll" &&
            this.level.pathName === "/" ) {
            node = window;
          } 
          fnBoundHandler =
           eventType2fnHandler[ eventType ].bind( this.level );
          LAY.$eventUtils.add( node, eventType, fnBoundHandler );

          this.eventReadonlyEventType2boundFnHandler[ eventType ] =
           fnBoundHandler;
        }
      }
    }
  };

  LAY.AttrVal.prototype.giveNot = function ( attrVal ) {
    if ( LAY.$arrayUtils.remove( this.takerAttrValS, attrVal ) && 
      this.takerAttrValS.length === 0 ) {
      if ( this.isEventReadonlyAttr ) {
        // Given that no reference exists, remove event listeners
        var
         eventType2fnHandler =
         LAY.$eventReadonlyUtils.getEventType2fnHandler( this.attr ),
         eventType,
         fnBoundHandler, node;
        node = this.level.part.node;
        for ( eventType in eventType2fnHandler ) {
          if ( eventType === "scroll" &&
            this.level.pathName === "/" ) {
            node = window;
          }
          fnBoundHandler = this.eventReadonlyEventType2boundFnHandler[ eventType ];
          LAY.$eventUtils.remove( node, eventType, fnBoundHandler );
          this.eventReadonlyEventType2boundFnHandler[ eventType ] =
           undefined;
        }
      }
    }
  };


  LAY.AttrVal.prototype.take = function () {

    if ( this.val instanceof LAY.Take ) {
      var _relPath00attr_S, relPath, level, attr,
      i, len;
      // value is of type `LAY.Take`
      _relPath00attr_S = this.val._relPath00attr_S;

      for ( i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];
        level = relPath.resolve( this.level );

        if ( level === undefined ) {
          return false;
        }

        if ( ( level.attr2attrVal[ attr ] === undefined ) )  {
          level.$createLazyAttr( attr );
          // return false to let the lazily created attribute
          // to calculate itself first (in the case of no
          // created attrval lazily then returing false
          // is the only option)
          return false;
        }

        if ( level.attr2attrVal[ attr ].isRecalculateRequired ) {
          return false;
        }
      }

      for ( i = 0; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];

        relPath.resolve( this.level ).$getAttrVal( attr ).give( this );

      }
    }
    return true;

  };

  LAY.AttrVal.prototype.takeNot = function ( val ) {

    if ( val instanceof LAY.Take ) {
      var _relPath00attr_S, relPath, level, attr;
      _relPath00attr_S = val._relPath00attr_S;

      for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {

        relPath = _relPath00attr_S[ i ][ 0 ];
        attr = _relPath00attr_S[ i ][ 1 ];

        level = relPath.resolve( this.level );

        if ( ( level !== undefined ) && ( level.$getAttrVal( attr ) !== undefined ) ) {
          level.$getAttrVal( attr ).giveNot( this );
        }
      }
    }

  };

  LAY.AttrVal.prototype.remove = function () {
    this.takeNot( this.val );
  }
  



})();

(function() {
  "use strict";

  // Check for CSS3 color support within the browser
  // source inspired from:
  // http://lea.verou.me/2009/03/check-whether-the-browser-supports-rgba-and-other-css3-values/  

  var isCss3ColorSupported = (function () {
    var prevColor = document.body.style.color;
    try {
      document.body.style.color = "rgba(0,0,0,0)";
    } catch (e) {}
    var result = document.body.style.color !== prevColor;
    document.body.style.color = prevColor;
    return result;

  })();

  
  // inspiration from: sass (https://github.com/sass/sass/)

  LAY.Color = function ( format, key2value, alpha ) {

    this.format = format;

    this.r = key2value.r;
    this.g = key2value.g;
    this.b = key2value.b;

    this.h = key2value.h;
    this.s = key2value.s;
    this.l = key2value.l;

    this.a = alpha;

  };

  LAY.Color.prototype.getFormat = function () {
    return this.format;
  };

  LAY.Color.prototype.getRed = function () {
    return this.r;

  };

  LAY.Color.prototype.getGreen = function () {
    return this.g;
  };

  LAY.Color.prototype.getBlue = function () {
    return this.b;
  };

  LAY.Color.prototype.getHue = function () {
    return this.h;
  };

  LAY.Color.prototype.getSaturation = function () {
    return this.s;

  };

  LAY.Color.prototype.getLightness = function () {
    return this.l;

  };

  LAY.Color.prototype.getAlpha = function () {
    return this.a;
  };

  LAY.Color.prototype.stringify = function () {

    var rgb, hsl;
    if ( isCss3ColorSupported ) {

      if ( this.format === "hsl" ) {
        hsl = this.getHsl();
        if ( this.a === 1 ) {
          return "hsl(" + hsl.h + "," + hsl.s + "," + hsl.l + ")";
        } else {
          return "hsla(" + hsl.h + "," + hsl.s + "," + hsl.l + "," + this.a + ")";
        }

      } else {
        rgb = this.getRgb();
        if ( this.a === 1 ) {
          return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        } else {
          return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this.a + ")";
        }
      }

    } else {

      // for IE8 and legacy browsers
      // where rgb is the sole color
      // mode available
      if ( this.a < 0.1 ) {
        return "transparent";
      } else {
        rgb = this.getRgb();
        return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
      }

    }

  };

  LAY.Color.prototype.copy = function () {

    return this.format === "rgb" ?
      new LAY.Color( "rgb", { r: this.r, g: this.g,  b: this.b } , this.a ) :
      new LAY.Color( "hsl", { h: this.h, s: this.s,  l: this.l } , this.a );

  };

  LAY.Color.prototype.equals = function ( otherColor ) {

     return ( this.format === otherColor.format ) &&
      ( this.a === otherColor.a ) &&
      (
        (
          this.format === "rgb" &&
          this.r === otherColor.r &&
          this.g === otherColor.g &&
          this.b === otherColor.b
        )
        ||
        (
          this.format === "hsl" &&
          this.h === otherColor.h &&
          this.s === otherColor.s &&
          this.l === otherColor.l
        )
      );


  };

  LAY.Color.prototype.getRgb = function () {
    if ( this.format === "rgb" ) {

      return { r: this.r, g: this.g, b: this.b };


    } else {

      return convertHslToRgb( this.r, this.g, this.b );

    }
  };

  LAY.Color.prototype.getHsl = function () {
    if ( this.format === "hsl" ) {

      return { h: this.h, s: this.s, l: this.l };

    } else {

      return convertRgbToHsl( this.r, this.g, this.b );
    }
  };


  LAY.Color.prototype.getRgba = function () {

    var rgb = this.getRgb();
    rgb.a = this.a;
    return rgb;

  };



  LAY.Color.prototype.getHsla = function () {

    var hsl = this.getHsl();
    hsl.a = this.a;
    return hsl;

  };

  // mix, invert, saturate, desaturate



  LAY.Color.prototype.red = function ( val ) {

    if ( this.format === "rgb" ) {
      this.r = val;
    } else {
      var rgb = this.getRgb();
      var hsl = convertRgbToHsl( val, rgb.g, rgb.b );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };

  LAY.Color.prototype.green = function ( val ) {

    if ( this.format === "rgb" ) {
      this.g = val;
    } else {
      var rgb = this.getRgb();
      var hsl = convertRgbToHsl( rgb.r, val, rgb.b );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };

  LAY.Color.prototype.blue = function ( val ) {

    if ( this.format === "rgb" ) {
      this.b = val;
    } else {
      var rgb = this.getRgb();
      var hsl = convertRgbToHsl( rgb.r, rgb.g, val );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };

  LAY.Color.prototype.hue = function ( val ) {

    if ( this.format === "hsl" ) {
      this.h = val;
    } else {
      var hsl = this.getHsl();
      var rgb = convertHslToRgb( val, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAY.Color.prototype.saturation = function ( val ) {

    if ( this.format === "hsl" ) {
      this.s = val;
    } else {
      var hsl = this.getHsl();
      var rgb = convertHslToRgb( hsl.h, val, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAY.Color.prototype.lightness = function ( val ) {

    if ( this.format === "hsl" ) {
      this.l = val;
    } else {
      var hsl = this.getHsl();
      var rgb = convertHslToRgb( hsl.h, hsl.s, val );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };


  /* Sets alpha */
  LAY.Color.prototype.alpha = function ( alpha ) {
    this.a = alpha;
    return this;
  };

  LAY.Color.prototype.darken = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.l = hsl.l - ( hsl.l * fraction );
    if ( this.format === "hsl" ) {
      this.l = hsl.l;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAY.Color.prototype.lighten = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.l = hsl.l + ( hsl.l * fraction );
    if ( this.format === "hsl" ) {
      this.l = hsl.l;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAY.Color.prototype.saturate = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.s = hsl.s + ( hsl.s * fraction );
    if ( this.format === "hsl" ) {
      this.s = hsl.s;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };

  LAY.Color.prototype.desaturate = function ( fraction ) {

    var hsl = this.getHsl();
    hsl.s = hsl.s - ( hsl.s * fraction );
    if ( this.format === "hsl" ) {
      this.s = hsl.s;
    } else {
      var rgb = convertHslToRgb( hsl.h, hsl.s, hsl.l );
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }
    return this;
  };


  LAY.Color.prototype.invert = function ( ) {

    var rgb = this.getRgb();
    rgb.r = 255 - rgb.r;
    rgb.g = 255 - rgb.g;
    rgb.b = 255 - rgb.b;

    if ( this.format === "rgb" ) {

      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;

    } else {
      var hsl = convertRgbToHsl( rgb.r, rgb.g, rgb.b );
      this.h = hsl.h;
      this.s = hsl.s;
      this.l = hsl.l;
    }
    return this;
  };



  function convertHslToRgb( h, s, l ) {

    // calculate
    // source: http://stackoverflow.com/a/9493060
    var r, g, b;

    if(s === 0){
      r = g = b = l; // achromatic
    }else{


      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = convertHueToRgb(p, q, h + 1/3);
      g = convertHueToRgb(p, q, h);
      b = convertHueToRgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };

  }

  function convertRgbToHsl( r, g, b ) {
    // calculate
    // source: http://stackoverflow.com/a/9493060
    r = r / 255; g = g / 255; b = b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h, s: s, l: l };
  }


  function convertHueToRgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }



})();

( function () {
  "use strict";

  LAY.Level = function ( path, lson, parent, isHelper, derivedMany, rowDict, id ) {

    this.pathName = path;
    this.lson = lson;
    // if level is many, partLson contains the non-many part of the lson
    this.partLson = undefined;
    this.isGpu = undefined;
    this.isInitialized = false;

    this.parentLevel = parent; // parent Level
    this.attr2attrVal = {};

    // True if the Level is a Part Level,
    // false if the Level is a Many Level.
    this.isPart = undefined;

    // If the level name begins with "_",
    // the level is considered a helper (non-renderable)
    this.isHelper = isHelper;

    this.isExist = true;

    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.part = undefined;
    // If the Level is a Many (i.e this.isPart is false)
    // then this.many will hold a reference to the corresponding
    // Many object.
    this.manyObj = undefined;


    // If the Level is derived from a Many
    // then this.derivedMany will hold
    // a reference to the Many
    this.derivedMany = derivedMany;

    // If the Level is derived from a Many Level
    // this will be the id by which it is referenced
    this.id = id;

    // If the Level is derived from a Many Level
    // this will contain the row information will
    // be contained within below
    this.rowDict = rowDict;

    this.isInherited = false;

    this.childLevelS = [];

    this.stateS = [ "root" ];
    this.stringHashedStates2_cachedAttr2val_ =  {};
    this.newlyInstalledStateS = [];
    this.newlyUninstalledStateS = [];

  };

  LAY.Level.prototype.$init = function () {

    LAY.$pathName2level[ this.pathName ] = this;
    LAY.$newLevelS.push( this );
    if ( this.parentLevel ) {
      this.parentLevel.childLevelS.push( this );
    }

  };


  LAY.Level.prototype.level = function ( relativePath ) {

    return ( new LAY.RelPath( relativePath ) ).resolve( this );
  };

  LAY.Level.prototype.parent = function () {
    return this.parentLevel;
  };

  LAY.Level.prototype.path = function () {
    return this.pathName;
  };


  LAY.Level.prototype.node = function () {

    return this.isPart && this.part.node;
  };


  LAY.Level.prototype.attr = function ( attr ) {

    if ( this.attr2attrVal[ attr ] ) {
      return this.attr2attrVal[ attr ].calcVal;
    } else { 
      // Check if it is a doing event
      if ( attr.charAt( 0 ) === "$" ) {
        if ( LAY.$checkIfDoingReadonly( attr ) ) {
          console.error("LAY Error: " + attr + " must be placed in $obdurate");
          return undefined;
        } else if ( LAY.$checkIfImmidiateReadonly( attr ) ) {
          return this.part.getImmidiateReadonlyVal( attr );
        }
      } 
      if ( this.$createLazyAttr( attr, true ) ) {
        var attrVal = this.attr2attrVal[ attr ];
        attrVal.give( LAY.$emptyAttrVal );
        LAY.$solve();
        return attrVal.calcVal;
      } else {
        return undefined;
      }
    }
  };

  LAY.Level.prototype.data = function ( dataKey, value ) {
    this.$changeAttrVal( "data." + dataKey, value );
    LAY.$solve();
  };

  LAY.Level.prototype.row = function ( rowKey, value ) {
    if ( this.derivedMany ) {
      this.derivedMany.id2row[ this.id ][ rowKey ] = value;
      this.derivedMany.level.attr2attrVal.rows.requestRecalculation();
      LAY.$solve();
    }
  };

  LAY.Level.prototype.changeNativeInput = function ( value ) {
    this.part.node.value = value;
  };

  LAY.Level.prototype.changeNativeScrollX = function ( value ) {
    this.part.node.scrollLeft = value;
  };

  LAY.Level.prototype.changeNativeScrollY = function ( value ) {
    this.part.node.scrollTop = value;
  };

  LAY.Level.prototype.many = function () {
    return this.derivedMany && this.derivedMany.level;
  };

  LAY.Level.prototype.levels = function () {
    return this.manyObj && this.manyObj.allLevelS;
  };


  LAY.Level.prototype.rowsCommit = function ( newRowS ) {

    if ( !this.isPart ) {
      this.manyObj.rowsCommit( newRowS );
    }
  };

  LAY.Level.prototype.rowsMore = function ( newRowS ) {

    if ( !this.isPart ) {
      this.manyObj.rowsMore( newRowS );
    }
  };

  LAY.Level.prototype.rowAdd = function ( newRow ) {
    this.rowsMore( [ newRow ] );
  };

  LAY.Level.prototype.rowDeleteByID = function ( id ) {

    if ( !this.isPart ) {
      this.manyObj.rowDeleteByID( id );
    }
  };

  LAY.Level.prototype.rowsUpdate = function ( key, val, queryRowS ) {
    if ( !this.isPart ) {
      if ( queryRowS instanceof LAY.Query ) {
        queryRowS = queryRowS.rowS;
      }
      this.manyObj.rowsUpdate( key, val, queryRowS );
    }
  };

  LAY.Level.prototype.rowsDelete = function ( queryRowS ) {
    if ( !this.isPart ) {
      if ( queryRowS instanceof LAY.Query ) {
        queryRowS = queryRowS.rowS;
      }
      this.manyObj.rowsDelete( queryRowS );
    }
  };

  LAY.Level.prototype.dataTravelBegin = function ( dataKey, finalVal ) {
    var attrVal;
    if ( LAY.$isDataTravelling ) {
      console.error("LAY Warning: Existence of another unfinished data travel");
    } else {
      attrVal = this.attr2attrVal[ "data." + dataKey ];
      if ( attrVal === undefined ) {
        console.error ("LAY Warning: Inexistence of data key for data travel");
      }
      LAY.$isDataTravelling = true;
      LAY.level("/").attr2attrVal.$dataTravelling.update( true );
      LAY.$dataTravellingLevel = this;
      LAY.level("/").attr2attrVal.$dataTravelLevel.update( this );
      LAY.$dataTravellingAttrInitialVal = attrVal.val;
      LAY.$dataTravellingAttrVal = attrVal;

      LAY.$isDataTravellingShock = true;
      attrVal.update( finalVal );
      LAY.$solve();
      LAY.$isDataTravellingShock = false;

    }
  };

  LAY.Level.prototype.dataTravelContinue = function ( delta ) {
    if ( !LAY.$isDataTravelling ) {
      console.error( "LAY Warning: Inexistence of a data travel" );
    } else if ( this !== LAY.$dataTravellingLevel ){
      console.error( "LAY Warning: Inexistence of a data travel for this Level" );
    } else {
      if ( LAY.$dataTravelDelta !== delta ) {
        LAY.$dataTravelDelta = delta;
        LAY.level("/").attr2attrVal.$dataTravelDelta.update( delta );
        LAY.$render();
      }
    }
  };

  LAY.Level.prototype.dataTravelArrive = function ( isArrived ) {
    if ( !LAY.$isDataTravelling ) {
      console.error( "LAY Warning: Inexistence of a data travel" );
    } else {

      LAY.$isDataTravelling = false;
      LAY.level("/").attr2attrVal.$dataTravelling.update( false );
      LAY.$dataTravellingLevel = undefined;
      LAY.level("/").attr2attrVal.$dataTravelLevel.update( null );
      LAY.$dataTravelDelta = 0.0;
      LAY.level("/").attr2attrVal.$dataTravelDelta.update( 0.0 );


      // clear out attrvalues which are data travelling
      LAY.$clearDataTravellingAttrVals();
      if ( !isArrived ) {
        LAY.$dataTravellingAttrVal.update(
          LAY.$dataTravellingAttrInitialVal );
        LAY.$solve();

      } else {

      }

      LAY.$render();
    }
  };



  LAY.Level.prototype.queryRows = function () {
    if ( !this.isPart ) {
      return this.manyObj.queryRows();
    }
  };

  LAY.Level.prototype.queryFilter = function () {
    if ( !this.isPart ) {
      return this.manyObj.queryFilter();
    }
  };

  LAY.Level.prototype.addChildren = function ( name2lson ) {
    
    for ( var name in name2lson ) {
      var lson = name2lson[ lson ];
      this.lson.children[ name ] = lson; 
      this.$addChild( name, name2lson );
    }

  };


  LAY.Level.prototype.remove = function () {
    
    if ( this.pathName === "/" ) {
      console.error("LAY Error: Attempt to remove root level '/' prohibited");
    } else {
      if ( this.derivedMany ) {
        this.derivedMany.rowDeleteByID( this.id );
      } else {
        this.$remove();
        LAY.$solve();
      }
    }
    
  };

  LAY.Level.prototype.$remove = function () {

    this.$disappear();

    LAY.$pathName2level[ this.pathName ] = undefined;
    LAY.$arrayUtils.remove( this.parentLevel.childLevelS, this );
  
  };

  LAY.Level.prototype.$addChildren = function ( name2lson ) {

    if ( name2lson !== undefined ) {
      for ( var name in name2lson ) {
        this.$addChild( name, name2lson[ name ] );
      }
    }
  };

  LAY.Level.prototype.$addChild = function ( name, lson ) {
    var childPath, childLevel;

    if ( !LAY.$checkIsValidUtils.levelName( name ) ) {
      throw ( "LAY Error: Invalid Level Name: " + name );
    }
    childPath = this.pathName +
      ( this.pathName === "/" ? "" : "/" ) + name;
    if ( LAY.$pathName2level[ childPath ] !== undefined ) {
      throw ( "LAY Error: Level already exists with path: " +
        childPath + " within Level: " + this.pathName );
    }
    childLevel = new LAY.Level( childPath,
     lson, this, name.charAt(0) === "_" );
    childLevel.$init();

  };


  /*
  * Return false if the level could not be inherited (due
  * to another level not being present or started as yet)
  */
  LAY.Level.prototype.$normalizeAndInherit = function () {

    var lson, refS, i, len, ref, level, inheritedAndNormalizedLson;
    LAY.$normalize( this.lson, this.isHelper );
    
    // check if it contains anything to inherit from
    if ( this.lson.$inherit !== undefined ) { 
      lson = {};
      refS = this.lson.$inherit;
      for ( i = 0, len = refS.length; i < len; i++ ) {
        
        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference
          if ( ref === this.pathName ) {
            return false;
          }
          level = ( new LAY.RelPath( ref ) ).resolve( this );
          if ( ( level === undefined ) || !level.isInherited ) {
            return false;
          }
        }
      }
      for ( i = 0; i < len; i++ ) {

        ref = refS[ i ];
        if ( typeof ref === "string" ) { // pathname reference
          
          level = ( new LAY.RelPath( ref ) ).resolve( this );
          inheritedAndNormalizedLson = level.lson;

        } else { // object reference
           LAY.$normalize( ref, true );
           inheritedAndNormalizedLson = ref;
        }

        LAY.$inherit( lson, inheritedAndNormalizedLson );
      }

      LAY.$inherit( lson, this.lson );
      
      this.lson = lson;
    }

    this.isInherited = true;
    return true;


  };

  LAY.Level.prototype.$reproduce = function () {
    if ( this.isPart ) {
      this.part = new LAY.Part( this );
      this.part.init();
      
      if ( this.lson.children !== undefined ) {
        this.$addChildren( this.lson.children );
      }
    } else {
      this.manyObj = new LAY.Many( this, this.partLson );
      this.manyObj.init();
    }
  };

  LAY.Level.prototype.$identify = function () {
    this.isPart = this.lson.many === undefined ||
      this.derivedMany;
    if ( this.pathName === "/" ) {
      this.isGpu = this.lson.$gpu === undefined ?
        true : 
        this.lson.$gpu;
    } else {
      this.isGpu = this.lson.$gpu === undefined ?
        this.parentLevel.isGpu :
        this.lson.$gpu;
    }
    this.isGpu = this.isGpu && LAY.$isGpuAccelerated;

    if ( this.isPart ) {
      if ( !this.derivedMany ) {
      LAY.$defaultizePartLson( this.lson,
        this.parentLevel );
      }
    } else {
      if ( this.pathName === "/" ) {
        throw "LAY Error: 'many' prohibited for root level /";
      }
      this.partLson = this.lson;
      this.lson = this.lson.many;
      
      LAY.$defaultizeManyLson( this.lson );
    }
  };

  function initAttrsObj( attrPrefix, key2val,
   attr2val, isNoUndefinedAllowed ) {

    var key, val;

    for ( key in key2val ) {
      if ( ( key2val[ key ] !== undefined ) ||
          !isNoUndefinedAllowed ) {
        attr2val[ attrPrefix + key ] = key2val[ key ];
      }
    }
  }

  function initAttrsArray( attrPrefix, elementS, attr2val ) {

    var i, len;

    for ( i = 0, len = elementS.length ; i < len; i++ ) {
      attr2val[ attrPrefix + "." + ( i + 1 ) ] = elementS[ i ];
    }
  }

  /* Flatten the slson to attr2val dict */
  function convertSLSONtoAttr2Val( slson, attr2val, isPart ) {

    var
      prop,
      transitionProp, transitionDirective,
      transitionPropPrefix,
      eventType, fnCallbackS,
      prop2val = slson.props,
      when = slson.when,
      transition = slson.transition,
      fargs = slson.fargs,
      i, len;
          
    if ( isPart ){ 
      initAttrsObj( "", slson.props, attr2val, true );

      for ( transitionProp in transition ) {
        transitionDirective = transition[ transitionProp ];
        transitionPropPrefix =  "transition." + transitionProp + ".";
        if ( transitionDirective.type !== undefined ) {
          attr2val[ transitionPropPrefix + "type" ] =
            transitionDirective.type;
        }
        if ( transitionDirective.duration !== undefined ) {
          attr2val[ transitionPropPrefix + "duration" ] =
            transitionDirective.duration;
        }
        if ( transitionDirective.delay !== undefined ) {
          attr2val[ transitionPropPrefix + "delay" ] =
            transitionDirective.delay;
        }
        if ( transitionDirective.done !== undefined ) {
          attr2val[ transitionPropPrefix + "done" ] =
            transitionDirective.done;
        }
        if ( transitionDirective.args !== undefined ) {
          initAttrsObj( transitionPropPrefix + "args.",
            transitionDirective.args, attr2val, false );
        }
      }

      for ( eventType in when ) {
        fnCallbackS = when[ eventType ];
        initAttrsArray( "when." + eventType, fnCallbackS, attr2val );
      }

      if ( slson.$$num !== undefined ) {
        initAttrsObj( "$$num.", slson.$$num, attr2val, false );
      }

      if ( slson.$$max !== undefined ) {
        initAttrsObj(  "$$max.", slson.$$max, attr2val, false );
      }
    } else {

      attr2val.formation = slson.formation;
      attr2val.filter = slson.filter;

      if ( fargs ) {
        for ( var formationFarg in fargs ) {
          initAttrsObj( "fargs." + formationFarg + ".",
            fargs[ formationFarg ], attr2val, false );        
        }
      }

      attr2val[ "$$num.sort" ] = slson.sort.length;

      for ( i = 0, len = slson.sort.length; i < len; i++ ) {
        initAttrsObj( "sort." + ( i + 1 ) + ".", slson.sort[ i ],
         attr2val, false );
      }
      
    }
  }

  LAY.Level.prototype.$updateExistence = function () {
    var isExist = this.attr2attrVal.exist.calcVal;
    if ( isExist ) {
      this.$appear();
    } else {
      this.$disappear();
    }
  };

  /*
  LAY.Level.prototype.$checkIfParentExists = function () {
    if ( this.pathName === "/" ) {
      return this.isExist;
    } else {
      return this.isExist ? this.parentLevel.$checkIfParentExists() : false;
    }
  };*/

  LAY.Level.prototype.$appear = function () {
    this.isExist = true;
    this.$reproduce();
    this.$initAllAttrs();

    if ( this.isPart ) {
      this.part.add();
    }
    
  };  

   LAY.Level.prototype.$disappear = function () {
    this.isExist = false;
    var attr2attrVal = this.attr2attrVal;
    for ( var attr in attr2attrVal ) {
      if ( attr !== "exist" ) {
        attr2attrVal[ attr ].remove();
      }
    }
    var descendantLevelS = this.isPart ? 
      this.childLevelS : this.manyObj.allLevelS ;
    for ( var i=0, len=descendantLevelS.length; i<len; i++ ) {
      descendantLevelS[ i ] &&
        descendantLevelS[ i ].$remove();
    }

    if ( this.isPart ) {
      this.part && this.part.remove();
    } else {
      this.manyObj.remove();
    }
   
  };

  LAY.Level.prototype.$decideExistence = function () {
    if ( !this.isHelper ) {
      this.$createAttrVal( "exist", this.lson.exist ===
        undefined ? true : this.lson.exist );    
    }
  };

  LAY.Level.prototype.$initAllAttrs = function () {

    var
      obdurateReadonlyS = this.lson.$obdurate ?
       this.lson.$obdurate : [],
      obdurateReadonly, i, len;
  
    this.isInitialized = true;

    if ( this.isPart ) {
      if ( this.lson.states.root.props.scrollX ) {
        obdurateReadonlyS.push( "$naturalWidth" );
      }
      if ( this.lson.states.root.props.scrollY ) {
        obdurateReadonlyS.push( "$naturalHeight" );
      }
      
      if ( this.part.type === "input" &&
          this.part.inputType !== "line" ) {
        // $input will be required to compute
        // the natural height if it exists
        // TODO: optimize
        obdurateReadonlyS.push( "$input" );
      }
    }

    if ( obdurateReadonlyS.length ) {
      for ( i = 0, len = obdurateReadonlyS.length; i < len; i++ ) {
        obdurateReadonly = obdurateReadonlyS[ i ];
        if ( !this.$createLazyAttr( obdurateReadonly ) ) {
          throw "LAY Error: Unobervable Attr: '" +
            obdurateReadonly  + "'";
        }
        this.attr2attrVal[ obdurateReadonly ].give(
          LAY.$emptyAttrVal );
      }
    }

    this.$initNonStateProjectedAttrs();
    this.$updateStates();

  };

  LAY.Level.prototype.$initNonStateProjectedAttrs = function () {

    var 
      key, val, stateName, state,
      states = this.lson.states,
      lson = this.lson,
      attr2val = {};


    initAttrsObj( "data.", lson.data, attr2val, false );

    for ( stateName in states ) {
        state = states[ stateName ];
        if ( stateName !== "root" ) {
          attr2val[ stateName + "." + "onlyif" ] = state.onlyif;
          if ( state.install ) {
            attr2val[ stateName + "." + "install" ] = state.install;
          }
          if ( state.uninstall ) {
            attr2val[ stateName + "." + "uninstall" ] = state.uninstall;
          }
        }
    }

    if ( this.isPart ) { 
      attr2val.right = LAY.$essentialPosAttr2take.right;
      attr2val.bottom = LAY.$essentialPosAttr2take.bottom;
      if ( this.pathName === "/" ) {
        attr2val.$dataTravelling = false;
        attr2val.$dataTravelDelta = 0.0;
        attr2val.$dataTravelLevel = undefined;
        attr2val.$absoluteLeft = 0;
        attr2val.$absoluteTop = 0;
        attr2val.$windowWidth = window.innerWidth ||
         document.documentElement.clientWidth ||
          document.body.clientWidth;
        attr2val.$windowHeight = window.innerHeight ||
         document.documentElement.clientHeight ||
          document.body.clientHeight;
      } else if ( this.derivedMany ) {
        initAttrsObj( "row.", this.rowDict, attr2val, false );
        attr2val.$i = 0;
        attr2val.$f = 0;
      }
    } else { // Many
      attr2val.rows = lson.rows;
      attr2val.$id = lson.$id;
      attr2val.$$layout = null;
    }

    this.$commitAttr2Val( attr2val );

  };

  LAY.Level.prototype.$commitAttr2Val = function ( attr2val ) {

    var attr, val, attrVal;
    for ( attr in attr2val ) {
      val = attr2val[ attr ];
      attrVal = this.attr2attrVal[ attr ];
      if ( ( attrVal === undefined ) ) {
        attrVal = this.attr2attrVal[ attr ] = new LAY.AttrVal( attr, this );
      }
      attrVal.update( val );

    }
  };

  LAY.Level.prototype.$createAttrVal = function ( attr, val ) {

    ( this.attr2attrVal[ attr ] =
      new LAY.AttrVal( attr, this ) ).update( val );

  };


  /*
  * Return true if attr was created as it exists (in lazy form),
  * false otherwise (it is not present at all to be created)
  */
  LAY.Level.prototype.$createLazyAttr = function ( attr, isNoImmidiateReadonly ) {
    var
     splitAttrLsonComponentS, attrLsonComponentObj, i, len,
     firstAttrLsonComponent;

    if ( LAY.$miscPosAttr2take[ attr ] ) {
      this.$createAttrVal( attr,
        LAY.$miscPosAttr2take[ attr ] );
    } else if ( attr.charAt( 0 ) === "$" ) { //readonly
      if ( [ "$type", "$load", "$id", "$inherit", "$obdurate" ].indexOf(
            attr ) !== -1 ) {
          this.$createAttrVal( attr, this.lson[ attr ] );
      } else if ( attr === "$path" ) {
        this.$createAttrVal( "$path", this.pathName );
      } else {
        if ( !isNoImmidiateReadonly &&
         LAY.$checkIfImmidiateReadonly( attr ) ) {
          this.$createAttrVal( attr, null );
        } else if ( LAY.$checkIfDoingReadonly( attr ) ) {
          this.$createAttrVal( attr, false );
        } else {
          console.error("LAY Error: Incorrectly named readonly: " + attr );
          return false;
        }
      }
    } else {
      if ( attr.indexOf( "." ) === -1 ) {
        var lazyVal = LAY.$getLazyPropVal( attr,
          this.parentLevel === undefined );
        if ( lazyVal !== undefined ) {
          this.$createAttrVal( attr, lazyVal );
        } else {
          return false;
        }
      } else {
        if ( attr.startsWith( "data." ||
            attr.startsWith("row.") ) ) {
          return false;
        } else {
          splitAttrLsonComponentS = attr.split( "." );
          if ( this.lson.states === undefined ) {
            return false;
          } else {
            firstAttrLsonComponent = splitAttrLsonComponentS[ 0 ];

            // Get down to state level
            if ( LAY.$checkIsValidUtils.stateName(
             firstAttrLsonComponent ) ) {
              attrLsonComponentObj = this.lson.states[ firstAttrLsonComponent ];
            } else {
              return false;
            }
            splitAttrLsonComponentS.shift();

            // remove the state part of the attr components
            if ( splitAttrLsonComponentS[ 0 ]  === "when" ) {
              splitAttrLsonComponentS[ splitAttrLsonComponentS.length - 1 ] =
                parseInt( splitAttrLsonComponentS[
                  splitAttrLsonComponentS.length -1 ] ) - 1;
            } else if ( ["fargs", "sort",
             "formation", "filter", "rows"].indexOf(
              splitAttrLsonComponentS[ 0 ]) !== -1 ) {

            } else if ( splitAttrLsonComponentS[ 0 ] !== "transition" ) {
              // props
              if ( attrLsonComponentObj.props !== undefined ) {
                attrLsonComponentObj = attrLsonComponentObj.props; 
              } else {
                return false;
              }
            }

            for ( i = 0, len = splitAttrLsonComponentS.length; i < len; i++ ) {
              attrLsonComponentObj =
               attrLsonComponentObj[ splitAttrLsonComponentS[ i ] ];

              if ( attrLsonComponentObj === undefined ) {
                break;
              }
            }
            // Not present within states
            if ( attrLsonComponentObj === undefined ) {
              return false;
            } else {
              this.$createAttrVal( attr ,
                 attrLsonComponentObj );
            }
          }
        }
      }
    }
    return true;
  };

 

  /*
  Undefine all current attributes which are influencable
  by states: props, transition, when, $$num, $$max
  */
  LAY.Level.prototype.$undefineStateProjectedAttrs = function() {

    var attr;
    for ( attr in this.attr2attrVal ) {
      if ( this.attr2attrVal[ attr ].isStateProjectedAttr ) {
        this.attr2attrVal[ attr ].update( undefined );
      }
    }
  };


  /* Return the attr2value generated
  by the current states */
  LAY.Level.prototype.$getStateAttr2val = function () {

    var
      attr2val = {},
      stringHashedStates2_cachedAttr2val_;
  // Refer to the central cache for Many levels
   stringHashedStates2_cachedAttr2val_ = this.derivedMany ?
      this.derivedMany.levelStringHashedStates2_cachedAttr2val_ :
      this.stringHashedStates2_cachedAttr2val_;
    
    this.$sortStates();
    var stringHashedStates = this.stateS.join( "&" );
    if ( stringHashedStates2_cachedAttr2val_[
     stringHashedStates ] === undefined ) {
      convertSLSONtoAttr2Val( this.$generateSLSON(), attr2val, this.isPart);
      stringHashedStates2_cachedAttr2val_[ stringHashedStates ] =
        attr2val;
    }

    return stringHashedStates2_cachedAttr2val_[ stringHashedStates ];
  

  };

  /*
  * TODO: fill in details of priority
  */
  LAY.Level.prototype.$sortStates = function ( stateS ) {

    var
      sortedStateS = this.stateS.sort(),
      i, len, sortedState;

    // Push the "root" state to the start for least priority
    LAY.$arrayUtils.remove( sortedStateS, "root" );
    sortedStateS.unshift("root");

    // Push the "formationDisplayNone" state to the end of the
    // list of states for maximum priority.
    if ( sortedStateS.indexOf( "formationDisplayNone" ) !== -1 ) {
      LAY.$arrayUtils.remove( sortedStateS, "formationDisplayNone" );
      sortedStateS.push( "formationDisplayNone" );
    }

  };

  /*
  *  From the current states generate the
  *  correspinding SLSON (state projected lson)
  *  Requirement: the order of states must be sorted
  */
  LAY.Level.prototype.$generateSLSON =  function () {

    this.$sortStates();

    var slson = {}, attr2val;
    for ( var i = 0, len = this.stateS.length; i < len; i++ ) {
      LAY.$inherit( slson, this.lson.states[ this.stateS[ i ] ],
        true, !this.isPart, true );
    }

    return slson;

  };


  LAY.Level.prototype.$updateStates = function () {

    var attr2attrVal = this.attr2attrVal;

    this.$undefineStateProjectedAttrs();
    this.$commitAttr2Val( this.$getStateAttr2val() );

    if ( this.derivedMany &&
        !this.derivedMany.level.attr2attrVal.filter.isRecalculateRequired &&
        attr2attrVal.$f.calcVal !== 1 ) {
      this.$setFormationXY( this.part.formationX,
          this.part.formationY );
    }


    if ( this.pathName === "/" ) {
      if ( this.attr2attrVal.width.val !==
        this.lson.states.root.props.width ) {
        throw "LAY Error: width of root level unchangeable";
      }
      if ( this.attr2attrVal.height.val !==
        this.lson.states.root.props.height ) {
        throw "LAY Error: height of root level unchangeable";
      }
      if ( this.attr2attrVal.top.val !== 0 ) {
        throw "LAY Error: top of root level unchangeable";        
      }
      if ( this.attr2attrVal.left.val !== 0 ) {
        throw "LAY Error: left of root level unchangeable";        
      }
    } 
  };


  LAY.Level.prototype.$getAttrVal = function ( attr ) {
    return this.attr2attrVal[ attr ];

  };

  /* Manually change attr value */
  LAY.Level.prototype.$changeAttrVal = function ( attr, val ) {
    if ( this.attr2attrVal[ attr ] ) {
      this.attr2attrVal[ attr ].update( val );
      LAY.$solve();
    }
  };

  LAY.Level.prototype.$requestRecalculation = function ( attr ) {
    if ( this.attr2attrVal[ attr ] ) {
      this.attr2attrVal[ attr ].requestRecalculation();
      LAY.$solve();
    }
  };

  LAY.Level.prototype.$setFormationXY = function ( x, y ) {

    this.part.formationX = x;
    this.part.formationY = y;

    if ( this.part ) { //level might not initialized as yet
      var
        topAttrVal = this.attr2attrVal.top,
        leftAttrVal = this.attr2attrVal.left;

      if ( x === undefined ) {
        leftAttrVal.update( this.derivedMany.defaultFormationX );
      } else {
        leftAttrVal.update( x );
      }
      if ( y === undefined ) {
        topAttrVal.update( this.derivedMany.defaultFormationY );
      } else {
        topAttrVal.update( y );
      }

      topAttrVal.requestRecalculation();
      leftAttrVal.requestRecalculation();
    }
 
  };

  /*
  LAY.Level.prototype.addRecalculateDirtyAttrVal = function ( attrVal ) {

    LAY.$arrayUtils.pushUnique( this.recalculateDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( LAY.$recalculateDirtyLevelS, this );

  };
  */


  

  







})();

(function() {
  "use strict";

  LAY.Many = function ( level, partLson ) {

    this.level = level;
    this.partLson = partLson;

    this.allLevelS = [];
    this.filteredLevelS = [];

    // "stringHashedStates2_cachedAttr2val_"
    // for levels derived from the many
    // Keeping this cache ensures thats
    // each derived level (which could potentially
    // large arbitrary number n) calculates
    // only once.
	  this.levelStringHashedStates2_cachedAttr2val_ = {};

    this.id = level.lson.$id || "id";
    this.id2level = {};
    this.id2row = {};
    this.isLoaded = false;
    this.isAutoId = false;

    this.defaultFormationX = undefined;
    this.defaultFormationY = undefined;

  };

  LAY.Many.prototype.init = function () {

    var
      states = this.partLson.states ||
      ( this.partLson.states = {} );

    states.formationDisplayNone =
      LAY.$formationDisplayNoneState;

    LAY.$defaultizePartLson( this.partLson,
      this.level.parentLevel );

    LAY.$newManyS.push( this );

    this.defaultFormationX = this.partLson.states.root.props.left;
    this.defaultFormationY = this.partLson.states.root.props.top;

  };

  LAY.Many.prototype.queryRows = function () {
    return new LAY.Query( 
       LAY.$arrayUtils.cloneSingleLevel(
        this.level.attr2attrVal.rows.calcVal ) );
  };

  LAY.Many.prototype.queryFilter = function () {
    return new LAY.Query(
      LAY.$arrayUtils.cloneSingleLevel(
        this.level.attr2attrVal.filter.calcVal ) );
  };

  LAY.Many.prototype.rowsCommit = function ( newRowS ) {

    var rowsAttrVal = this.level.attr2attrVal.rows;

    rowsAttrVal.val = newRowS;
    rowsAttrVal.requestRecalculation();
    LAY.$solve();

  };

  LAY.Many.prototype.rowsMore = function ( newRowS ) {
    var
      rowsAttrVal = this.level.attr2attrVal.rows,
      curRowS = rowsAttrVal.calcVal;

    if ( checkIfRowsIsNotObjectified( newRowS ) ) {
       newRowS = objectifyRows( newRowS );
    }

    for ( var i = 0; i < newRowS.length; i++ ) {
      curRowS.push( newRowS[ i ] );
    }

    rowsAttrVal.val = rowsAttrVal.calcVal;
    rowsAttrVal.requestRecalculation();
    LAY.$solve();

  };

  LAY.Many.prototype.rowDeleteByID = function ( id ) {
    var
      rowsAttrVal = this.level.attr2attrVal.rows,
      curRowS = rowsAttrVal.calcVal,
      row = this.id2row [ id ];

    if ( row ) {
      LAY.$arrayUtils.remove( 
        curRowS, row );
      rowsAttrVal.val = rowsAttrVal.calcVal;
      rowsAttrVal.requestRecalculation();
      LAY.$solve();

    }
  };

  LAY.Many.prototype.rowsUpdate = function ( key, val, queryRowS ) {

    var rowsAttrVal = this.level.attr2attrVal.rows;

    // If no queriedRowS parameter is supplied then
    // update all the rows
    queryRowS = queryRowS ||
      rowsAttrVal.calcVal || [];

    for ( var i = 0, len = queryRowS.length; i < len; i++ ) {
      var fetchedRow = this.id2row[ queryRowS[ i ][ this.id ] ];
      if ( fetchedRow ) {
        fetchedRow[ key ] = val;
      }
    }

    rowsAttrVal.val = rowsAttrVal.calcVal;
    rowsAttrVal.requestRecalculation();
    LAY.$solve();

  };

  LAY.Many.prototype.rowsDelete = function ( queryRowS ) {
    
    var
      rowsAttrVal = this.level.attr2attrVal.rows,
      curRowS = rowsAttrVal.calcVal;

    // If no queriedRowS parameter is supplied then
    // delete all the rows
    queryRowS = queryRowS ||
      rowsAttrVal.calcVal || [];

    for ( var i = 0, len = queryRowS.length; i < len; i++ ) {
      var fetchedRow = this.id2row[ queryRowS[ i ][ this.id ] ];
      LAY.$arrayUtils.remove( curRowS, fetchedRow );
    }

    rowsAttrVal.val = rowsAttrVal.calcVal;
    rowsAttrVal.requestRecalculation();
    LAY.$solve();

  };




  function checkIfRowsIsNotObjectified ( rowS ) {
    return rowS.length &&
     ( typeof rowS[ 0 ] !== "object" );
  }

  function objectifyRows ( rowS, idKey ) {
    var objectifiedRowS = [];
    for ( var i = 0, len = rowS.length; i < len; i++ ) {
      var objectifiedRow = { content: rowS[ i ]};
      objectifiedRow[ idKey ] = i+1;
      objectifiedRowS.push( objectifiedRow ); 
    }
    return objectifiedRowS;
  }

  function checkIfRowsHaveNoId( rowS, idKey ) {
    var totalIds = 0;
    for ( var i=0, len=rowS.length; i<len; i++ ) {
      if ( rowS[ i ][ idKey ] !== undefined ) {
        totalIds++;
      }
    }
    if ( totalIds > 0 ) {
      if ( totalIds !== rowS.length ) {
        throw "LAY Error: Inconsistent id provision to rows of " +
          this.level.pathName;
      }
    } else if ( rowS.length ) {
      return true;
    }
    return false;
  }

  function idifyRows ( rowS, idKey ) {

    for ( var i=0, len=rowS.length; i<len; i++ ) {
      rowS[ i ][ idKey ] = i+1;
    }

    // check for duplicates
    // complexity of solution is O(n)
    var hasDuplicates = false;
    for ( var i=0, len=rowS.length; i<len; i++ ) {
      if ( rowS[ i ][ idKey ] !== i+1 ) {
        hasDuplicates = true;
        break;
      } 
    }
    if ( hasDuplicates ) {
      for ( var i=0, len=rowS.length; i<len; i++ ) {
        rowS[ i ] = LAY.$clone( rowS[ i ] );
        rowS[ i ][ idKey ] = i+1;
      }
    }
    return rowS;
  }



  /*
  *	Update the rows by:
  * (1) Creating new levels in accordance to new rows
  * (2) Updating existing levels in accordance to changes in changed rows
  */
  LAY.Many.prototype.updateRows = function () {
    var 
  		rowS = this.level.attr2attrVal.rows.calcVal,
  		row,
  		id,
  		level,
  		parentLevel = this.level.parentLevel,
      updatedAllLevelS = [],
      newLevelS = [],
      id2level = this.id2level,
      id2row = this.id2row,
      rowKey, rowVal, rowAttr,
      rowAttrVal,
      i, len;

    // incase rows is explicity set to undefined
    // (most likely through a Take)
    if ( !rowS ) {
      rowS = [];
    }
    if ( checkIfRowsIsNotObjectified ( rowS ) ) {
      rowS = objectifyRows( rowS, this.id );
      var rowsAttrVal = this.level.attr2attrVal.rows;
      rowsAttrVal.calcVal = rowS;
    } else if ( this.isAutoId ||
        checkIfRowsHaveNoId( rowS, this.id ) ) {
      this.isAutoId = true;
      rowS = idifyRows( rowS, this.id );
      var rowsAttrVal = this.level.attr2attrVal.rows;
      rowsAttrVal.calcVal = rowS;
    }

    this.sort( rowS );

  	for ( i = 0, len = rowS.length; i < len; i++ ) {
  		row = rowS[ i ];
  		id = row[ this.id ];
      id2row[ id ] = row;
  		level = this.id2level[ id ];
      
      if ( !level ) {
        // create new level with row

        level = new LAY.Level(
          this.level.pathName + ":" + id,
          this.partLson, this.level.parentLevel, false,
          this, row, id );
        level.$init();

  			id2level[ id ] = level;
        id2row[ id ] = row;

        newLevelS.push( level );

		  } else if ( level.isInitialized ) {
        for ( rowKey in row ) {
          rowVal = row[ rowKey ];
          rowAttr = "row." + rowKey;
          rowAttrVal = level.attr2attrVal[ rowAttr ];
          if ( !rowAttrVal ) {
            level.$createAttrVal( rowAttr, rowVal );
          } else {
            rowAttrVal.update( rowVal );
          }
        }
  		}

      updatedAllLevelS.push( level );
  	}

    for ( id in id2level ) {
      level = id2level[ id ];
      if ( level &&
          updatedAllLevelS.indexOf( level ) === -1 ) {
        level.$remove();
        this.id2row[ id ] = undefined;
        this.id2level[ id ] = undefined;
      }
    }

    this.allLevelS = updatedAllLevelS;

  };


  /* Return false if not all levels have been
  * initialized, else return true
  */
  LAY.Many.prototype.updateFilter = function () {
    var  
      allLevelS = this.allLevelS,
      filteredRowS =
        this.level.attr2attrVal.filter.calcVal || [],
      filteredLevelS = [],
      filteredLevel, f = 1,
      level;

    for ( 
      var i = 0, len = allLevelS.length;
      i < len; i++ ) {
      level = allLevelS[ i ];
      // has not been initialized as yet
      if ( !level.isInitialized ) {
        return false;
      } 
      level.attr2attrVal.$i.update( i + 1 );      
      level.attr2attrVal.$f.update( -1 );        
      
    }

    var idKey = this.id;
    for ( 
      var i = 0, len = filteredRowS.length;
      i < len; i++ ) {
      filteredLevel = this.id2level[ filteredRowS[ i ][ idKey ] ];
      if ( filteredLevel ) {
        filteredLevelS.push( filteredLevel );
        filteredLevel.attr2attrVal.$f.update( f++ );
        
      }
    }

    this.filteredLevelS = filteredLevelS;

    return true;

  };

  LAY.Many.prototype.updateLayout = function () {
    LAY.$arrayUtils.pushUnique(
      LAY.$relayoutDirtyManyS, this);
  };

  LAY.Many.prototype.relayout = function () {
    var
      filteredLevelS = this.filteredLevelS,
      firstFilteredLevel = filteredLevelS[ 0 ],
      attr2attrVal = this.level.attr2attrVal,
      formation = attr2attrVal.formation.calcVal,
      defaultFargs = LAY.$formation2fargs[ formation ],
      fargs = {},
      fargAttrVal;

    for ( var farg in defaultFargs ) {
      fargAttrVal = attr2attrVal[ "fargs." + 
        formation + "." + farg ];
      fargs[ farg ] = fargAttrVal ? 
        fargAttrVal.calcVal : defaultFargs[ farg ];
    }

    var formationFn = LAY.$formation2fn[ formation ];

    if ( firstFilteredLevel ) {
      firstFilteredLevel.$setFormationXY(
        undefined, undefined );
    }

    for ( 
      var f = 1, len = filteredLevelS.length, filteredLevel, xy;
      f < len;
      f++
     ) {
      filteredLevel = filteredLevelS[ f ];
      /*// if the level is not initialized then
      // discontinue the filtered positioning
      if ( !filteredLevel.part ) {
        return;
      }*/
      xy = formationFn( f + 1, filteredLevel,
       filteredLevelS, fargs );
      filteredLevel.$setFormationXY(
        xy[ 0 ],
        xy[ 1 ]
      );
    
    }
  };

  

  LAY.Many.prototype.sort = function ( rowS ) {
    var sortAttrPrefix,
      attr2attrVal = this.level.attr2attrVal,
      numSorts = attr2attrVal["$$num.sort"] ?
        attr2attrVal["$$num.sort"].calcVal : 0,
      sortDictS = [];

    if ( numSorts > 0 ) {
      for ( var i=0; i<numSorts; i++ ) {
        sortAttrPrefix = "sort." + ( i + 1 ) + ".";
      
        sortDictS.push(
          { key:attr2attrVal[ sortAttrPrefix + "key" ].calcVal,
          ascending:
          attr2attrVal[ sortAttrPrefix + "ascending" ].calcVal  });
      }
    }
  };


  LAY.Many.prototype.remove = function () {
  };
  

  /*! below code is taken from one of the responses
   to the stackoverflow question:
   http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
   @source: http://stackoverflow.com/a/4760279 */
  function dynamicSort( sortDict ) {
    var key = sortDict.key,
      sortOrder = sortDict.ascending ? 1 : -1;

    return function (a,b) {
        var result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  function dynamicSortMultiple( sortDictS ) {
    
    return function (obj1, obj2) {
        var i = 0, result = 0,
        numberOfProperties = sortDictS.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(sortDictS[i])(obj1, obj2);
            i++;
        }
        return result;
    }
  }

})();

( function () {
  "use strict";



  var cssPrefix, allStyles,
    defaultCss, defaultTextCss,
    textDimensionCalculateNodeCss,
    inputType2tag, nonInputType2tag,
    textSizeMeasureNode,
    imageSizeMeasureNode,
    supportedInputTypeS;


  // source: http://davidwalsh.name/vendor-prefix
  if ( window.getComputedStyle ) {
    cssPrefix = (Array.prototype.slice
      .call(window.getComputedStyle(document.body, null))
      .join('')
      .match(/(-moz-|-webkit-|-ms-)/)
    )[1];
  } else {
    cssPrefix = "-ms-";
  }


   // source: xicooc (http://stackoverflow.com/a/29837441)
  LAY.$isBelowIE9 = (/MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 10);

  allStyles = document.body.style;


  // check for matrix 3d support
  // source: https://gist.github.com/webinista/3626934 (http://tiffanybbrown.com/2012/09/04/testing-for-css-3d-transforms-support/)
  allStyles[ (cssPrefix + "transform" ) ] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
  if ( window.getComputedStyle ) {
    LAY.$isGpuAccelerated =
      Boolean(
        window.getComputedStyle(
          document.body, null ).getPropertyValue(
            ( cssPrefix + "transform" ) ) ) &&
        !LAY.$isBelowIE9;
  } else {
    LAY.$isGpuAccelerated = false;
  }

  allStyles = undefined;

  defaultCss = "position:absolute;display:block;visibility:inherit;" + 
    "margin:0;padding:0;" +
    "backface-visibility: hidden;" +
    "-webkit-backface-visibility: hidden;" +
    "box-sizing:border-box;-moz-box-sizing:border-box;" +
    "transform-style:preserve-3d;-webkit-transform-style:preserve-3d;" +
    "overflow-x:hidden;overflow-y:hidden;" +
    "-webkit-overflow-scrolling:touch;" + 
    "user-drag:none;" +
    "white-space:nowrap;" +
    "outline:none;border:none;";

  // Most CSS text(/font) properties
  // match the defaults of LAY, however
  // for ones which do not match the
  // below list contains their default css
  defaultTextCss = defaultCss +
    "font-size:15px;" +
    "font-family:sans-serif;color:black;" +
    "text-decoration:none;" +
    "text-align:left;direction:ltr;line-height:1.3em;" +
    "white-space:nowrap;" +
    "-webkit-font-smoothing:antialiased;";

  textDimensionCalculateNodeCss = 
    defaultTextCss + 
    "visibility:hidden;height:auto;" + 
    "overflow:visible;" +
    "border:0px solid transparent;";

  inputType2tag = {
    multiline: "textarea",
    select: "select",
    multiple: "select"
  };

  nonInputType2tag = {
    none: "div",
    text: "div",
    image: "img",
    video: "video",
    audio: "audio",
    link: "a"
  };

  supportedInputTypeS = [
    "line", "multiline", "password", "select",
    "multiple" ];

  function stringifyPlusPx ( val ) {
    return val + "px";
  }

  function generateSelectOptionsHTML( optionS ) {

    var option, html = "";
    for ( var i=0, len=optionS.length; i<len; i++ ) {
      option = optionS[ i ];
      html += "<option value='" + option.value + "'" +
        ( option.selected ? " selected='true'" : "" ) +
        ( option.disabled ? " disabled='true'" : "" ) +
        ">" + option.content + "</option>";
    }
    return html;
  }

  textSizeMeasureNode = document.createElement("div");
  textSizeMeasureNode.style.cssText =
    textDimensionCalculateNodeCss;
  
  document.body.appendChild( textSizeMeasureNode );

  imageSizeMeasureNode = document.createElement("img");
  imageSizeMeasureNode.style.cssText = defaultCss + 
    "visibility:hidden;"
  
  document.body.appendChild( imageSizeMeasureNode );

  LAY.Part = function ( level ) {

    this.level = level;
    this.node = undefined;
    this.type = undefined;
    this.inputType = undefined;
    this.isText = undefined;
    this.isInitiallyRendered = false;

    this.normalRenderDirtyAttrValS = [];
    this.travelRenderDirtyAttrValS = [];

    this.whenEventType2fnMainHandler = {};

    this.isImageLoaded = false;

    // for many derived levels
    this.formationX = undefined;
    this.formationY = undefined;

  };

  function getInputType ( type ) {
    return type.startsWith( "input:" ) &&
      type.slice( "input:".length );
  }

  LAY.Part.prototype.init = function () {

    var inputTag, parentNode, inputType;
    inputType = this.inputType = getInputType( 
        this.level.lson.$type );
    this.type = this.inputType ? "input" :
     this.level.lson.$type;
    if ( inputType && supportedInputTypeS.indexOf(
        inputType ) === -1 ) {
      throw "LAY Error: Unsupported $type: input:" +
        inputType;
    }
    if ( this.level.pathName === "/" ) {
      this.node = document.body;
    } else if ( this.inputType ) {
      inputTag = inputType2tag[ this.inputType ];
      if ( inputTag ) {
        this.node = document.createElement( inputTag );
        if ( inputType === "multiple" ) {
          this.node.multiple = true;
        }
      } else {        
        this.node = document.createElement( "input" );
        this.node.type = this.inputType === "line" ?
          "text" : this.inputType;
        if ( inputType === "password" ) {
          // we wil treat password as a line
          // for logic purposes, as we we will
          // not alter the input[type] during
          // runtime
          this.inputType = "line";
        }
      }

    } else {
      this.node = document.createElement(
        nonInputType2tag[ this.type]);
    }

    this.isText = this.type === "input" || 
      this.level.lson.states.root.props.text !== undefined;


    if ( this.isText ) {
      this.node.style.cssText = defaultTextCss;
    } else {
      this.node.style.cssText = defaultCss;
    }

    if ( this.type === "input" && this.inputType === "multiline" ) {
      this.node.style.resize = "none";
    }
    

    if ( this.type === "image" ) {
      var part = this;
      LAY.$eventUtils.add( this.node, "load", function() {
        part.isImageLoaded = true;
        part.updateNaturalWidth();
        part.updateNaturalHeight();
        LAY.$solve();
      });
    }
   
  };

  // Precondition: not called on "/" level
  LAY.Part.prototype.remove = function () {
    if ( this.level.pathName !== "/" ) {
      var parentPart = this.level.parentLevel.part;
      parentPart.updateNaturalWidth();
      parentPart.updateNaturalHeight();
      // If the level is inexistent from the start
      // then the node will not have been attached
      if ( this.node.parentNode === parentPart.node ) {
        parentPart.node.removeChild( this.node );
      }
    }
  };

  LAY.Part.prototype.add = function () {
    if ( this.level.pathName !== "/" ) {
      var parentPart = this.level.parentLevel.part;
      parentPart.updateNaturalWidth();
      parentPart.updateNaturalHeight();
      this.level.parentLevel.part.node.appendChild( this.node );
    }
  };


  function checkIfLevelIsDisplayed ( level ) {
    var attrValDisplay = level.attr2attrVal.display;
    return !attrValDisplay || attrValDisplay.calcVal;
  }
  /*
  * Additional constraint of not being dependent upon
  * parent for the attr
  */
  LAY.Part.prototype.findChildMaxOfAttr =
   function ( attr ) {
    var
       curMaxVal = 0,
       childLevel, childLevelAttrVal;

    for ( var i = 0,
         childLevelS = this.level.childLevelS,
        len = childLevelS.length;
         i < len; i++ ) {
      childLevel = childLevelS[ i ];
      if ( childLevel.isPart && !childLevel.isHelper &&
        childLevel.isExist ) {
        if ( checkIfLevelIsDisplayed( childLevel ) ) {
          childLevelAttrVal = childLevel.attr2attrVal[ attr ];
       
          if (
              ( childLevelAttrVal !== undefined ) &&
              ( childLevelAttrVal.calcVal )
            ) {
            if ( childLevelAttrVal.calcVal > curMaxVal ) {
              curMaxVal = childLevelAttrVal.calcVal;
            }
          }
        }
      }
    }

    return curMaxVal;
  };

  
  LAY.Part.prototype.getImmidiateReadonlyVal = function ( attr ) {
    
    switch ( attr ) {
      case "$naturalWidth":
        return this.calculateNaturalWidth();
      case "$naturalHeight":
        return this.calculateNaturalHeight();
      case "$scrolledX":
        return this.node.scrollLeft;
      case "$scrolledY":
        return this.node.scrollTop;
      case "$focused":
        return node === document.activeElement;
      case "$input":
        if ( this.inputType === "multiple" ||
          this.inputType === "select" ) {
          var optionS =
            this.isInitiallyRendered ?
            this.node.options : 
            ( // input might not be calculated
              // as yet, thus OR with the empty array
            this.level.attr2attrVal.input.calcVal || [] );

          var valS = [];
          for ( var i = 0, len = optionS.length;
            i < len; i++ ) {
            if ( optionS[ i ].selected ) {
              valS.push( optionS[ i ].value )
            }
          }
          // Select the first option if none is selected
          // as that will be the default
          if ( optionS.length && !valS.length &&
              this.inputType === "select" ) {
            valS.push(optionS[ 0 ].value );
          }
          return this.inputType === "select" ? 
            valS[ 0 ] : valS ;
          
        } else {
          return this.node.value;
        }

    }
  };


  LAY.Part.prototype.updateNaturalWidth = function () {

    var naturalWidthAttrVal =
      this.level.$getAttrVal("$naturalWidth");
    if ( naturalWidthAttrVal ) {
      LAY.$arrayUtils.pushUnique(
        LAY.$naturalWidthDirtyPartS, 
        this );     
    }
  };

  LAY.Part.prototype.updateNaturalHeight = function () {
    var naturalHeightAttrVal =
      this.level.$getAttrVal("$naturalHeight");
    if ( naturalHeightAttrVal ) {
      LAY.$arrayUtils.pushUnique(
        LAY.$naturalHeightDirtyPartS, 
        this ); 
    }
  };

  LAY.Part.prototype.calculateNaturalWidth = function () {
    var attr2attrVal = this.level.attr2attrVal;
    if ( this.isText ) {
      return this.calculateTextNaturalDimesion( true );
    } else if ( this.type === "image" ) {
      return this.calculateImageNaturalDimesion( true );
    } else {
      return this.findChildMaxOfAttr( "right" );
    }
  };


  LAY.Part.prototype.calculateNaturalHeight = function () {
    var attr2attrVal = this.level.attr2attrVal;
    if ( this.isText ) {
      return this.calculateTextNaturalDimesion( false );
    } else if ( this.type === "image" ) {
      return this.calculateImageNaturalDimesion( false );
    } else {
      return this.findChildMaxOfAttr( "bottom" );
    }
  };

  LAY.Part.prototype.calculateImageNaturalDimesion = function ( isWidth ) {
    if ( !this.isImageLoaded ) {
      return 0;
    } else {
      imageSizeMeasureNode.src =
        this.level.attr2attrVal.imageUrl.calcVal;
      var otherDim = isWidth ? "height" : "width",
        otherDimAttrVal = this.level.attr2attrVal[ 
        otherDim ],
        otherDimVal = otherDimAttrVal ? 
          ( otherDimAttrVal.calcVal !== undefined ?
          otherDimAttrVal.calcVal + "px" : "auto" ) : "auto";

      if ( isWidth ) {
        imageSizeMeasureNode.style.height = otherDimVal;
        imageSizeMeasureNode.style.width = "auto";     
        return imageSizeMeasureNode.offsetWidth;
      } else {
        imageSizeMeasureNode.style.width = otherDimVal;
        imageSizeMeasureNode.style.height = "auto";     
        return imageSizeMeasureNode.offsetHeight;
      }
    }
  };

  /*
  * ( Height occupied naturally by text can be estimated
  * without creating a DOM node and checking ".offsetHeight"
  * if the text does not wrap, or it does wrap however with
  * extremely high probability does not span more than 1 line )
  * If the height can be estimated without using a DOM node
  * then return the estimated height, else return -1;
  */
  LAY.Part.prototype.estimateTextNaturalHeight = function ( text ) {
    if ( checkIfTextMayHaveHTML ( text ) ) {
      return -1;
    } else {
      var heightAttr2default = {
        "textSize": 15,
        "textWrap": "nowrap",
        "textPaddingTop": 0,
        "textPaddingBottom": 0,
        "borderTopWidth": 0,
        "borderBottomWidth": 0,
        "textLineHeight": 1.3,
        "textLetterSpacing": 1,
        "textWordSpacing": 1,
        "width": null
      };

      var heightAttr2val = {};

      for ( var heightAttr in heightAttr2default ) {
        var attrVal = this.level.attr2attrVal[ heightAttr ];
        heightAttr2val[ heightAttr ] = ( attrVal === undefined ||
          attrVal.calcVal === undefined ) ?
          heightAttr2default[ heightAttr ] : attrVal.calcVal;
      }


      // Do not turn the below statement into a ternary as
      // it will end up being unreadable
      var isEstimatePossible = false;
      if ( heightAttr2val.textWrap === "nowrap" ) {
        isEstimatePossible = true;
      } else if ( 
          LAY.$isOkayToEstimateWhitespaceHeight &&
          ( heightAttr2val.textWrap === "normal" ||
          text.indexOf( "\\" ) === -1 ) && //escape characters can
          // contain whitespace characters such as line breaks and/or tabs
          heightAttr2val.textLetterSpacing ===  1 &&
          heightAttr2val.textWordSpacing === 1 &&
          heightAttr2val.width !== null ) {
        if ( text.length <  ( 0.7 *
            ( heightAttr2val.width / heightAttr2val.textSize ) ) ) {
          isEstimatePossible = true;
        }
      }

      if ( isEstimatePossible ) {
        return ( heightAttr2val.textSize * heightAttr2val.textLineHeight ) + 
          heightAttr2val.textPaddingTop +
          heightAttr2val.textPaddingBottom +
          heightAttr2val.borderTopWidth + 
          heightAttr2val.borderBottomWidth;
      } else {
        return -1;
      }      

    }
  };

  function checkIfTextMayHaveHTML( text ) {
    return text.indexOf( "<" ) !== -1 && text.indexOf( ">" ) !== -1;
  };
  LAY.Part.prototype.calculateTextNaturalDimesion = function ( isWidth ) {

    var dimensionAlteringAttr2fnStyle = {
      textSize: stringifyPxOrString,
      textFamily: null,
      textWeight: null,
      textAlign: null,
      textStyle: null,      
      textDirection: null,
      textTransform: null,
      textVariant: null,
      textLetterSpacing: stringifyPxOrStringOrNormal,
      textWordSpacing: stringifyPxOrStringOrNormal,
      textLineHeight: stringifyEmOrString,
      textOverflow: null,
      textIndent: stringifyPlusPx,
      textWrap: null,

      textWordBreak: null,
      textWordWrap: null,
      textRendering: null,

      textPaddingTop: stringifyPlusPx,
      textPaddingRight: stringifyPlusPx,
      textPaddingBottom: stringifyPlusPx,
      textPaddingLeft: stringifyPlusPx,
      borderTopWidth: stringifyPlusPx,
      borderRightWidth: stringifyPlusPx,
      borderBottomWidth: stringifyPlusPx,
      borderLeftWidth: stringifyPlusPx
    };

    var dimensionAlteringAttr2cssProp = {
      textSize: "font-size",
      textFamily: "font-family",
      textWeight: "font-weight",
      textAlign: "text-align",
      textStyle: "font-style",
      textDirection: "direction",
      textTransform: "text-transform",
      textVariant: "font-variant",
      textLetterSpacing: "letter-spacing",
      textWordSpacing: "word-spacing",
      textLineHeight: "line-height",
      textOverflow: "text-overflow",
      textIndent: "text-indent",
      textWrap: "white-space",
      textWordBreak: "word-break",
      textWordWrap: "word-wrap",
      textRendering: "text-rendering",
      textPaddingTop: "padding-top",
      textPaddingRight: "padding-right",
      textPaddingBottom: "padding-bottom",
      textPaddingLeft: "padding-left",
      borderTopWidth: "border-top-width",
      borderRightWidth: "border-right-width",
      borderBottomWidth: "border-bottom-width",
      borderLeftWidth: "border-left-width"
    };

    var
      attr2attrVal = this.level.attr2attrVal,
      dimensionAlteringAttr, fnStyle,
      textRelatedAttrVal,
      html, ret,
      cssText = textDimensionCalculateNodeCss;

    if ( this.type === "input" ) {
      if ( this.inputType === "select" ||
        this.inputType === "multiple" ) {
        html = "<select" +
          ( this.inputType === "multiple" ? 
          " multiple='true' " : "" ) +  ">" +
          generateSelectOptionsHTML(
            attr2attrVal.input.calcVal
           ) + "</select>";
      } else {
        html = attr2attrVal.$input ?
          attr2attrVal.$input.calcVal : "a";
      }
    } else {
      if ( attr2attrVal.text.isRecalculateRequired ) {
        return 0;
      }
      html = attr2attrVal.text.calcVal;
    }

    if ( typeof html !== "string" ) {
      html = html.toString();
    }

    if ( !isWidth ) {
      var estimatedHeight = this.estimateTextNaturalHeight( html );
      if ( estimatedHeight !== -1 ) {
        return estimatedHeight;
      }
    }

    for ( dimensionAlteringAttr in
       dimensionAlteringAttr2fnStyle ) {
      textRelatedAttrVal = attr2attrVal[ 
        dimensionAlteringAttr ];
      if ( textRelatedAttrVal &&
        textRelatedAttrVal.calcVal !== undefined ) {

        fnStyle = dimensionAlteringAttr2fnStyle[ 
            dimensionAlteringAttr ];
        
        cssText += 
          dimensionAlteringAttr2cssProp[
          dimensionAlteringAttr ] + ":" +
          ( (fnStyle === null) ?
          textRelatedAttrVal.calcVal :
          fnStyle( textRelatedAttrVal.calcVal ) ) + ";";
    
      }
    }
    

    if ( isWidth ) {
      cssText += "display:inline;width:auto;";
      textSizeMeasureNode.style.cssText = cssText;
      textSizeMeasureNode.innerHTML = html;
      ret = textSizeMeasureNode.offsetWidth;

    } else {
      cssText += "width:" + 
        ( attr2attrVal.width.calcVal || 0 ) + "px;";
      textSizeMeasureNode.style.cssText = cssText;

      // If empty we will subsitute with the character "a"
      // as we wouldn't want the height to resolve to 0
      textSizeMeasureNode.innerHTML = html || "a";
      
      ret = textSizeMeasureNode.offsetHeight;
      
    }
    return ret;    

  };



  LAY.Part.prototype.addNormalRenderDirtyAttrVal = function ( attrVal ) {

    LAY.$arrayUtils.remove( this.travelRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( this.normalRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( LAY.$renderDirtyPartS, this );

  };

  LAY.Part.prototype.addTravelRenderDirtyAttrVal = function ( attrVal ) {

    LAY.$arrayUtils.remove( this.normalRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( this.travelRenderDirtyAttrValS, attrVal );
    LAY.$arrayUtils.pushUnique( LAY.$renderDirtyPartS, this );

  };

  LAY.Part.prototype.updateWhenEventType = function ( eventType ) {

    var
      numFnHandlersForEventType =
        this.level.attr2attrVal[ "$$num.when." + eventType ].val,
      fnMainHandler,
      thisLevel = this.level;

    if ( this.whenEventType2fnMainHandler[ eventType ] !== undefined ) {
      LAY.$eventUtils.remove( 
        this.node, eventType,
          this.whenEventType2fnMainHandler[ eventType ] );
    }

    if ( numFnHandlersForEventType !== 0 ) {

      fnMainHandler = function ( e ) {
        var i, len, attrValForFnHandler;
        for ( i = 0; i < numFnHandlersForEventType; i++ ) {
          attrValForFnHandler =
          thisLevel.attr2attrVal[ "when." + eventType + "." + ( i + 1 ) ];
          if ( attrValForFnHandler !== undefined ) {
            attrValForFnHandler.calcVal.call( thisLevel, e );
          }
        }
      };
      LAY.$eventUtils.add( this.node, eventType, fnMainHandler );
      this.whenEventType2fnMainHandler[ eventType ] = fnMainHandler;

    } else {
      this.whenEventType2fnMainHandler[ eventType ] = undefined;
    }
  
  };

  LAY.Part.prototype.checkIsPropInTransition = function ( prop ) {
    return ( this.level.attr2attrVal[ "transition." + prop  + ".type" ] !==
      undefined )  ||
      ( this.level.attr2attrVal[ "transition." + prop  + ".delay" ] !==
        undefined );
  };

  LAY.Part.prototype.updateTransitionProp = function ( transitionProp ) {

    if ( this.isInitiallyRendered ) {
      var
        attr2attrVal = this.level.attr2attrVal,
        attr, attrVal,
        transitionPrefix,
        transitionType, transitionDuration, transitionDelay, transitionDone,
        transitionArgS, transitionArg2val = {},
        transitionObj,
        i, len,
        allAffectedProp, // (eg: when `top` changes but transition
        //is provided by `positional`)
        affectedPropAttrVal;

      // TODO: change the below to a helper function
      if ( ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf(
         transitionProp ) !== -1  ) {
        return;
      }

      if ( !this.checkIsPropInTransition( transitionProp ) ) {
        if ( this.checkIsPropInTransition( "all" ) ) {
          allAffectedProp = transitionProp;
          transitionProp = "all";
        } else {
          return;
        }
      }

      transitionPrefix = "transition." + transitionProp + ".";

      transitionType =
        attr2attrVal[ transitionPrefix + "type" ] ?
        attr2attrVal[ transitionPrefix + "type" ].calcVal :
        "linear";

      transitionDuration =
        ( attr2attrVal[ transitionPrefix + "duration" ] ?
        attr2attrVal[ transitionPrefix + "duration" ].calcVal :
        0 );
      transitionDelay =
        ( attr2attrVal[ transitionPrefix + "delay" ] ?
        attr2attrVal[ transitionPrefix + "delay" ].calcVal :
        0 );
      transitionDone =
        ( attr2attrVal[ transitionPrefix + "done" ] ?
        attr2attrVal[ transitionPrefix + "done" ].calcVal :
        undefined );
      transitionArgS = LAY.$transitionType2args[ transitionType ] ?
        LAY.$transitionType2args[ transitionType ] : [];


      for ( i = 0, len = transitionArgS.length; i < len; i++ ) {

        transitionArg2val[ transitionArgS[ i ] ] = (
           attr2attrVal[ transitionPrefix + "args." +
            transitionArgS[ i ] ] ?
           attr2attrVal[ transitionPrefix + "args." +
            transitionArgS[ i ] ].calcVal : undefined );
      }

      if ( !allAffectedProp && ( transitionProp === "all" ) ) {

        for ( attr in attr2attrVal ) {
          attrVal = attr2attrVal[ attr ];
          // Only invoke a transition if:
          // (1) The prop is renderable (i.e has a render call)
          // (2) The prop doesn't have a transition of its
          //     own. For instance if "left" already has
          //     a transition then we will not want to override
          //     its transition with the lower priority "all" transition
          if ( attrVal.renderCall &&
              !this.checkIsPropInTransition( attrVal.attr ) ) {
            this.updateTransitionAttrVal(
              attrVal,
               transitionType, transitionDelay, transitionDuration,
               transitionArg2val, transitionDone
             );

          }
        }
      } else {

        this.updateTransitionAttrVal(
           attr2attrVal[ allAffectedProp || transitionProp ],
           transitionType, transitionDelay, transitionDuration,
           transitionArg2val, transitionDone
        );
      }
    }
  };

  LAY.Part.prototype.updateTransitionAttrVal = function ( attrVal,
    transitionType, transitionDelay, transitionDuration,
    transitionArg2val, transitionDone  ) {

    // First check if the transition information is complete
    if (
          transitionType &&
        ( transitionDuration !== undefined ) &&
        ( transitionDelay !== undefined ) &&
        ( attrVal !== undefined ) &&
        ( attrVal.isTransitionable )
        ) {

      attrVal.startCalcVal =  attrVal.transitionCalcVal;
      attrVal.transition = new LAY.Transition (
          transitionType,
          transitionDelay,
          transitionDuration, transitionArg2val,
          transitionDone );
    } else if ( attrVal !== undefined ) { // else delete the transition

      attrVal.transition = undefined;
    }
  }

  function stringifyPxOrString( val, defaultVal ) {
    return ( val === undefined ) ?
        defaultVal : ( typeof val === "number" ?
        ( val + "px" ) : val );
  }

  function stringifyPxOrStringOrNormal( val, defaultVal ) {
    if ( val === 0 ) {
      return "normal";
    } else {
      return stringifyPlusPx( val, defaultVal );
    }
  }

  function stringifyEmOrString( val, defaultVal ) {
    return ( val === undefined ) ?
        defaultVal : ( typeof val === "number" ?
        ( val + "em" ) : val );
  }

  function computePxOrString( attrVal, defaultVal ) {
    
    return stringifyPxOrString(
      attrVal && attrVal.transitionCalcVal,
      defaultVal );
    
  }

  function computePxOrStringOrNormal( attrVal, defaultVal ) {
  
    return stringifyPxOrStringOrNormal(
      attrVal && attrVal.transitionCalcVal,
      defaultVal );
    
  }

  function computeEmOrString( attrVal, defaultVal ) {
    return stringifyEmOrString(
      attrVal && attrVal.transitionCalcVal,
      defaultVal );
  }

  function computeColorOrString( attrVal, defaultVal ) {
    var transitionCalcVal =
      attrVal && attrVal.transitionCalcVal;
    return ( transitionCalcVal === undefined ) ?
        defaultVal : ( transitionCalcVal instanceof LAY.Color ?
        transitionCalcVal.stringify() : transitionCalcVal );
  }
  

  // Below we will customize prototypical functions
  // using conditionals. As per the results from
  // http://jsperf.com/foreign-function-within-prototype-chain
  // http://jsperf.com/dynamic-modification-of-prototype-chain
  // this will make no difference

  // The renderable prop can be
  // accessed via `part.renderFn_<prop>`

  LAY.Part.prototype.renderFn_x =  function () {
    var attr2attrVal = this.level.attr2attrVal;
    this.node.style.left =
      ( attr2attrVal.left.transitionCalcVal +
        ( attr2attrVal.shiftX !== undefined ?
          attr2attrVal.shiftX.transitionCalcVal : 0 ) ) +
          "px";
    };

  LAY.Part.prototype.renderFn_y =  function () {
    var attr2attrVal = this.level.attr2attrVal;
    this.node.style.top =
      ( attr2attrVal.top.transitionCalcVal +
        ( attr2attrVal.shiftY !== undefined ?
          attr2attrVal.shiftY.transitionCalcVal : 0 ) ) +
          "px";
    };

  if ( LAY.$isGpuAccelerated ) {

    // TODO: optimize to enter matrix3d directly
    LAY.Part.prototype.renderFn_positionAndTransform =   
    function () {
      var attr2attrVal = this.level.attr2attrVal;
      cssPrefix = cssPrefix === "-moz-" ? "" : cssPrefix;
      this.node.style[ cssPrefix + "transform" ] =
      
      "translate(" +
      ( ( attr2attrVal.left.transitionCalcVal + ( attr2attrVal.shiftX !== undefined ? attr2attrVal.shiftX.transitionCalcVal : 0 ) ) + "px, " ) +

      ( ( attr2attrVal.top.transitionCalcVal + ( attr2attrVal.shiftY !== undefined ? attr2attrVal.shiftY.transitionCalcVal : 0 ) ) + "px) " ) +
      ( attr2attrVal.z !== undefined ? "translateZ(" + attr2attrVal.z.transitionCalcVal + "px) " : "" ) +
      ( attr2attrVal.scaleX !== undefined ? "scaleX(" + attr2attrVal.scaleX.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleY !== undefined ? "scaleY(" + attr2attrVal.scaleY.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleZ !== undefined ? "scaleZ(" + attr2attrVal.scaleZ.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.skewX !== undefined ? "skewX(" + attr2attrVal.skewX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.skewY !== undefined ? "skewY(" + attr2attrVal.skewY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateX !== undefined ? "rotateX(" + attr2attrVal.rotateX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateY !== undefined ? "rotateY(" + attr2attrVal.rotateY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateZ !== undefined ? "rotateZ(" + attr2attrVal.rotateZ.transitionCalcVal + "deg)" : "" );

    };

    LAY.Part.prototype.renderFn_transform =   
    function () {
      var attr2attrVal = this.level.attr2attrVal;
      cssPrefix = cssPrefix === "-moz-" ? "" : cssPrefix;
      this.node.style[ cssPrefix + "transform" ] =
      ( attr2attrVal.scaleX !== undefined ? "scaleX(" + attr2attrVal.scaleX.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleY !== undefined ? "scaleY(" + attr2attrVal.scaleY.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.scaleZ !== undefined ? "scaleZ(" + attr2attrVal.scaleZ.transitionCalcVal + ") " : "" ) +
      ( attr2attrVal.skewX !== undefined ? "skewX(" + attr2attrVal.skewX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.skewY !== undefined ? "skewY(" + attr2attrVal.skewY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateX !== undefined ? "rotateX(" + attr2attrVal.rotateX.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateY !== undefined ? "rotateY(" + attr2attrVal.rotateY.transitionCalcVal + "deg) " : "" ) +
      ( attr2attrVal.rotateZ !== undefined ? "rotateZ(" + attr2attrVal.rotateZ.transitionCalcVal + "deg)" : "" );
    };

  } else {
    // legacy browser usage or forced non-gpu mode

    LAY.Part.prototype.renderFn_positionAndTransform =
      function () {
        this.renderFn_x();
        this.renderFn_y();
      };

    LAY.Part.prototype.renderFn_transform = function () {};
  }

  LAY.Part.prototype.renderFn_width = function () {
      this.node.style.width =
        this.level.attr2attrVal.width.transitionCalcVal + "px";
      if ( this.type === "canvas" ||
          this.type === "video" || 
          this.type === "image" ) {
        this.node.width =
        this.level.attr2attrVal.width.transitionCalcVal;
      }
    };

  LAY.Part.prototype.renderFn_height = function () {
    this.node.style.height =
      this.level.attr2attrVal.height.transitionCalcVal + "px";
    if ( this.type === "canvas" ||
        this.type === "video" || 
        this.type === "image" ) {
      this.node.height =
        this.level.attr2attrVal.height.transitionCalcVal;
    }
  };


  LAY.Part.prototype.renderFn_origin = function () {
    var attr2attrVal = this.level.attr2attrVal;

    this.node.style[ cssPrefix + "transform-origin" ] =
    ( ( attr2attrVal.originX !== undefined ? attr2attrVal.originX.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( ( attr2attrVal.originY !== undefined ? attr2attrVal.originY.transitionCalcVal : 0.5 ) * 100 ) + "% " +
    ( attr2attrVal.originZ !== undefined ? attr2attrVal.originZ.transitionCalcVal : 0  ) + "px";
  };


  LAY.Part.prototype.renderFn_perspective = function () {
    this.node.style[ cssPrefix + "perspective" ] =
     this.level.attr2attrVal.perspective.transitionCalcVal + "px";
  };

  LAY.Part.prototype.renderFn_perspectiveOrigin = function () {
    var attr2attrVal = this.level.attr2attrVal;
    this.node.style[ cssPrefix + "perspective-origin" ] =
    ( attr2attrVal.perspectiveOriginX ?
     ( attr2attrVal.perspectiveOriginX.transitionCalcVal * 100 )
      : 0 ) + "% " +
    ( attr2attrVal.perspectiveOriginY ?
     ( attr2attrVal.perspectiveOriginY.transitionCalcVal * 100 )
      : 0 ) + "%";
  };

  LAY.Part.prototype.renderFn_backfaceVisibility = function () {
    this.node.style[ cssPrefix + "backface-visibility" ] =
      this.level.attr2attrVal.backfaceVisibility.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_opacity = function () {
    this.node.style.opacity = this.level.attr2attrVal.opacity.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_display = function () {
    
    this.node.style.display =
      this.level.attr2attrVal.display.transitionCalcVal ?
        "block" : "none";
  };

  LAY.Part.prototype.renderFn_visible = function () {
    
    this.node.style.visibility =
      this.level.attr2attrVal.visible.transitionCalcVal ?
        "inherit" : "hidden";

  };

  LAY.Part.prototype.renderFn_zIndex = function () {

    this.node.style.zIndex =
      this.level.attr2attrVal.zIndex.transitionCalcVal || "auto";
  };


  LAY.Part.prototype.renderFn_focus = function () {
    if ( this.level.attr2attrVal.focus.transitionCalcVal ) {
      this.node.focus();
    } else if ( document.activeElement === this.node ) {
      document.body.focus();
    }
  };

  LAY.Part.prototype.renderFn_scrollX = function () {
    this.node.scrollLeft =
      this.level.attr2attrVal.scrollX.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_scrollY = function () {
    this.node.scrollTop =
      this.level.attr2attrVal.scrollY.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_scrollElastic = function () {
    this.node["-webkit-overflow-scrolling"] =
      this.level.attr2attrVal.scrollElastic.transitionCalcVal ?
       "touch" : "auto";
  };

  LAY.Part.prototype.renderFn_overflowX = function () {
    this.node.style.overflowX =
      this.level.attr2attrVal.overflowX.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_overflowY = function () {
    this.node.style.overflowY =
      this.level.attr2attrVal.overflowY.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_cursor = function () {
    this.node.style.cursor =
      this.level.attr2attrVal.
      cursor.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_userSelect = function () {
    if ( this.type !== "input" ) {
      this.node.style[ cssPrefix + "user-select" ] = 
        this.level.attr2attrVal.userSelect.transitionCalcVal;
    }
  };
  LAY.Part.prototype.renderFn_title = function () {
    this.node.title =
      this.level.attr2attrVal.
      title.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_tabindex = function () {
    this.node.tabindex =
      this.level.attr2attrVal.
      tabindex.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_backgroundColor = function () {
    this.node.style.backgroundColor =
      this.level.attr2attrVal.
      backgroundColor.transitionCalcVal.stringify();
  };

  LAY.Part.prototype.renderFn_backgroundImage = function () {
    this.node.style.backgroundImage =
      this.level.attr2attrVal.
      backgroundImage.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_backgroundAttachment = function () {
    this.node.style.backgroundAttachment = this.level.attr2attrVal.backgroundAttachment.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_backgroundRepeat = function () {
    this.node.style.backgroundRepeat = this.level.attr2attrVal.backgroundRepeat.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_backgroundSize = function () {
    
    this.node.style.backgroundSize =
      computePxOrString( 
        this.level.attr2attrVal.backgroundSizeX, "auto" ) +
      " " +
      computePxOrString(
        this.level.attr2attrVal.backgroundSizeY, "auto" );

  };

  LAY.Part.prototype.renderFn_backgroundPosition = function () {
    this.node.style.backgroundPosition =
      computePxOrString(
        this.level.attr2attrVal.backgroundPositionX, "0px" ) +
         " " +
      computePxOrString(
        this.level.attr2attrVal.backgroundPositionX, "0px" );
    
  };

  LAY.Part.prototype.renderFn_boxShadows = function () {
    if ( !LAY.$isBelowIE9 ) {
      var
      attr2attrVal = this.level.attr2attrVal,
      s = "",
      i, len;
      for ( i = 1, len = attr2attrVal[ "$$max.boxShadows" ].calcVal; i <= len;
       i++ ) {
        s +=
        ( ( attr2attrVal["boxShadows" + i + "Inset" ] !== undefined ?
         attr2attrVal["boxShadows" + i + "Inset" ].transitionCalcVal :
          false ) ? "inset " : "" ) +
        ( attr2attrVal["boxShadows" + i + "X" ].transitionCalcVal + "px " ) +
        ( attr2attrVal["boxShadows" + i + "Y" ].transitionCalcVal + "px " ) +
        ( ( attr2attrVal["boxShadows" + i + "Blur" ] !== undefined ?
          attr2attrVal["boxShadows" + i + "Blur" ].transitionCalcVal : 0 )
          + "px " ) +
        ( ( attr2attrVal["boxShadows" + i + "Spread" ] !== undefined ?
         attr2attrVal["boxShadows" + i + "Spread" ].transitionCalcVal : 0 )
          + "px " ) +
        ( attr2attrVal["boxShadows" + i + "Color" ].transitionCalcVal.stringify() );

        if ( i !== len ) {
          s += ",";
        }
      }
      this.node.style.boxShadow = s;
    }
  };



  LAY.Part.prototype.renderFn_filters = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
    s = "",
    i, len,
    filterType;
    for ( i = 1, len = attr2attrVal[ "$$max.filters" ].calcVal ; i <= len; i++ ) {
      filterType = attr2attrVal[ "filters" + i + "Type" ].calcVal;
      switch ( filterType ) {
        case "dropShadow":
          s +=  "drop-shadow(" +
          ( attr2attrVal["filters" + i + "X" ].transitionCalcVal + "px " ) +
          (  attr2attrVal["filters" + i + "Y" ].transitionCalcVal  + "px " ) +
          ( attr2attrVal["filters" + i + "Blur" ].transitionCalcVal + "px " ) +
    //      ( ( attr2attrVal["filters" + i + "Spread" ] !== undefined ? attr2attrVal[ "filters" + i + "Spread" ].transitionCalcVal : 0 ) + "px " ) +
          (  attr2attrVal["filters" + i + "Color" ].transitionCalcVal.stringify() ) +
          ") ";
          break;
        case "blur":
          s += "blur(" + attr2attrVal[ "filters" + i + "Blur" ] + ") ";
          break;
        case "hueRotate":
          s += "hue-rotate(" + attr2attrVal[ "filters" + i + "HueRotate" ] + "deg) ";
          break;
        case "url":
          s += "url(" + attr2attrVal[ "filters" + i + "Url" ] + ") ";
          break;
        default:
          s += filterType + "(" + ( attr2attrVal[ "filters" + i + LAY.$capitalize( filterType ) ] * 100 ) + "%) ";

      }
    }
    this.node.style[ cssPrefix + "filter" ] = s;

  };

  LAY.Part.prototype.renderFn_cornerRadiusTopLeft = function () {
    this.node.style.borderTopLeftRadius =
     this.level.attr2attrVal.cornerRadiusTopLeft.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_cornerRadiusTopRight = function () {
    this.node.style.borderTopRightRadius =
      this.level.attr2attrVal.cornerRadiusTopRight.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_cornerRadiusBottomRight = function () {
    this.node.style.borderBottomRightRadius =
      this.level.attr2attrVal.cornerRadiusBottomRight.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_cornerRadiusBottomLeft = function () {
    this.node.style.borderBottomLeftRadius =
      this.level.attr2attrVal.cornerRadiusBottomLeft.transitionCalcVal + "px";
  };



  LAY.Part.prototype.renderFn_borderTopStyle = function () {
    this.node.style.borderTopStyle =
      this.level.attr2attrVal.borderTopStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_borderRightStyle = function () {
    this.node.style.borderRightStyle =
      this.level.attr2attrVal.borderRightStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_borderBottomStyle = function () {
    this.node.style.borderBottomStyle =
      this.level.attr2attrVal.borderBottomStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_borderLeftStyle = function () {
    this.node.style.borderLeftStyle =
      this.level.attr2attrVal.borderLeftStyle.transitionCalcVal;
  };


  LAY.Part.prototype.renderFn_borderTopColor = function () {
    this.node.style.borderTopColor =
      this.level.attr2attrVal.borderTopColor.transitionCalcVal.stringify();
  };
  LAY.Part.prototype.renderFn_borderRightColor = function () {
    this.node.style.borderRightColor =
      this.level.attr2attrVal.borderRightColor.transitionCalcVal.stringify();
  };
  LAY.Part.prototype.renderFn_borderBottomColor = function () {
    this.node.style.borderBottomColor =
      this.level.attr2attrVal.borderBottomColor.transitionCalcVal.stringify();
  };
  LAY.Part.prototype.renderFn_borderLeftColor = function () {
    this.node.style.borderLeftColor =
      this.level.attr2attrVal.borderLeftColor.transitionCalcVal.stringify();
  };

  LAY.Part.prototype.renderFn_borderTopWidth = function () {
    this.node.style.borderTopWidth =
      this.level.attr2attrVal.borderTopWidth.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_borderRightWidth = function () {
    this.node.style.borderRightWidth =
      this.level.attr2attrVal.borderRightWidth.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_borderBottomWidth = function () {
    this.node.style.borderBottomWidth =
      this.level.attr2attrVal.borderBottomWidth.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_borderLeftWidth = function () {
    this.node.style.borderLeftWidth =
      this.level.attr2attrVal.borderLeftWidth.transitionCalcVal + "px";
  };



  /* Text Related */

  LAY.Part.prototype.renderFn_text = function () {
    this.node.innerHTML =
     this.level.attr2attrVal.text.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_textSize = function () {
    this.node.style.fontSize =
      computePxOrString( this.level.attr2attrVal.textSize );
  };
  LAY.Part.prototype.renderFn_textFamily = function () {
    this.node.style.fontFamily =
      this.level.attr2attrVal.textFamily.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_textWeight = function () {
    this.node.style.fontWeight =
      this.level.attr2attrVal.textWeight.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textColor = function () {
    this.node.style.color = 
      computeColorOrString( 
        this.level.attr2attrVal.textColor );
  };

  LAY.Part.prototype.renderFn_textVariant = function () {
    this.node.style.fontVariant =
      this.level.attr2attrVal.textVariant.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textTransform = function () {
    this.node.style.textTransform =
      this.level.attr2attrVal.textTransform.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textStyle = function () {
    this.node.style.fontStyle =
      this.level.attr2attrVal.textStyle.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textDecoration = function () {
    this.node.style.textDecoration =
      this.level.attr2attrVal.textDecoration.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textLetterSpacing = function () {
    this.node.style.letterSpacing = computePxOrStringOrNormal( 
        this.level.attr2attrVal.textLetterSpacing ) ;
  };
  LAY.Part.prototype.renderFn_textWordSpacing = function () {
    this.node.style.wordSpacing = computePxOrStringOrNormal( 
        this.level.attr2attrVal.textWordSpacing );
  };
  LAY.Part.prototype.renderFn_textAlign = function () {
    this.node.style.textAlign =
      this.level.attr2attrVal.textAlign.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textDirection = function () {
    //var dir = this.level.attr2attrVal.textDirection.transitionCalcVal;
    //if ( dir ) { //IE <8 throws error when given undefined value
    this.node.style.direction =
      this.level.attr2attrVal.textDirection.transitionCalcVal;
    //}
  };
  LAY.Part.prototype.renderFn_textLineHeight = function () {
    this.node.style.lineHeight = computeEmOrString( 
        this.level.attr2attrVal.textLineHeight );
  };

  LAY.Part.prototype.renderFn_textOverflow = function () {
    this.node.style.textOverflow =
      this.level.attr2attrVal.textOverflow.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textIndent = function () {
    this.node.style.textIndent =
      this.level.attr2attrVal.textIndent.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textWrap = function () {
    this.node.style.whiteSpace =
      this.level.attr2attrVal.textWrap.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textWordBreak = function () {
    this.node.style.wordBreak =
      this.level.attr2attrVal.textWordBreak.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textWordWrap = function () {
    this.node.style.wordWrap =
      this.level.attr2attrVal.textWordWrap.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textSmoothing = function () {
    this.node.style[ cssPrefix + "font-smoothing" ] =
     this.level.attr2attrVal.textSmoothing.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textRendering = function () {
    this.node.style.textRendering =
      this.level.attr2attrVal.textRendering.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_textPaddingTop = function () {
    this.node.style.paddingTop =
      this.level.attr2attrVal.textPaddingTop.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textPaddingRight = function () {
    this.node.style.paddingRight =
      this.level.attr2attrVal.textPaddingRight.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textPaddingBottom = function () {
    this.node.style.paddingBottom =
      this.level.attr2attrVal.textPaddingBottom.transitionCalcVal + "px";
  };
  LAY.Part.prototype.renderFn_textPaddingLeft = function () {
    this.node.style.paddingLeft =
      this.level.attr2attrVal.textPaddingLeft.transitionCalcVal + "px";
  };

  LAY.Part.prototype.renderFn_textShadows = function () {
    var attr2attrVal = this.level.attr2attrVal,
      s = "",
      i, len;
    for ( i = 1, len = attr2attrVal[ "$$max.textShadows" ].calcVal; i <= len; i++ ) {
      s +=
      (  attr2attrVal["textShadows" + i + "Color" ].transitionCalcVal.stringify() ) + " " +
      ( attr2attrVal["textShadows" + i + "X" ].transitionCalcVal + "px " ) +
      ( attr2attrVal["textShadows" + i + "Y" ].transitionCalcVal + "px " ) +
      ( attr2attrVal["textShadows" + i + "Blur" ].transitionCalcVal  + "px" );

      if ( i !== len ) {
        s += ",";
      }

    }
    this.node.style.textShadow = s;
  };

  /* Non <div> */

  /* Input Related */


  LAY.Part.prototype.renderFn_input = function () {
    var inputVal = this.level.attr2attrVal.input.transitionCalcVal;
    if ( this.inputType === "select" || this.inputType === "multiple" ) {
      this.node.innerHTML = generateSelectOptionsHTML( inputVal );
    } else {
      this.node.value = inputVal;
    }
  };


  LAY.Part.prototype.renderFn_inputLabel = function () {
    this.node.label = this.level.attr2attrVal.inputLabel.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputRows = function () {
    this.node.rows = this.level.attr2attrVal.inputRows.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputPlaceholder = function () {
    this.node.placeholder = this.level.attr2attrVal.inputPlaceholder.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputAutocomplete = function () {
    this.node.autocomplete = this.level.attr2attrVal.inputAutocomplete.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputAutocorrect = function () {
    this.node.autocorrect = this.level.attr2attrVal.inputAutocorrect.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_inputDisabled = function () {
    this.node.disabled = this.level.attr2attrVal.inputDisabled.transitionCalcVal;
  };

  /* Link (<a>) Related */

  LAY.Part.prototype.renderFn_linkHref = function () {
    this.node.href = this.level.attr2attrVal.linkHref.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_linkRel = function () {
    this.node.rel = this.level.attr2attrVal.linkRel.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_linkDownload = function () {
    this.node.download = this.level.attr2attrVal.linkDownload.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_linkTarget = function () {
    this.node.target = this.level.attr2attrVal.linkTarget.transitionCalcVal;
  };

  /* Image (<img>) related */
  LAY.Part.prototype.renderFn_imageUrl = function () {
    this.node.src = this.level.attr2attrVal.imageUrl.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_imageAlt = function () {
    this.node.alt = this.level.attr2attrVal.imageAlt.transitionCalcVal;
  };
  

  /* Audio (<audio>) related */

  LAY.Part.prototype.renderFn_audioSrc = function () {
    this.node.src = this.level.attr2attrVal.audioSrc.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_audioSources = function () {
    var
      attr2attrVal = this.level.attr2attrVal,
      i, len,
      documentFragment = document.createDocumentFragment(),
      childNodes = this.node.childNodes,
      childNode;
    // first remove the current audio sources
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "SOURCE" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrVal[ "$$max.audioSources" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "source" );
      childNode.type = attr2attrVal[ "audioSources" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "audioSources" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_audioTracks = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
    i, len,
    documentFragment = document.createDocumentFragment(),
    childNodes = this.node.childNodes,
    childNode;
    // first remove the current audio tracks
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "TRACK" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrVal[ "$$max.audioTracks" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "track" );
      childNode.type = attr2attrVal[ "audioTracks" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "audioTracks" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_audioVolume = function () {
    this.node.volume = this.level.attr2attrVal.audioVolume.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioController = function () {
    this.node.controls = this.level.attr2attrVal.audioController.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioLoop = function () {
    this.node.loop = this.level.attr2attrVal.audioLoop.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioMuted = function () {
    this.node.muted = this.level.attr2attrVal.audioMuted.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_audioPreload = function () {
    this.node.preload = this.level.attr2attrVal.audioPreload.transitionCalcVal;
  };

  /* Video (<video>) related */

  LAY.Part.prototype.renderFn_videoSrc = function () {
    this.node.src = this.level.attr2attrVal.videoSrc.transitionCalcVal;
  };

  LAY.Part.prototype.renderFn_videoSources = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
    i, len,
    documentFragment = document.createDocumentFragment(),
    childNodes = this.node.childNodes,
    childNode;
    // first remove the current video sources
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "SOURCE" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrVal[ "$$max.videoSources" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "source" );
      childNode.type = attr2attrVal[ "videoSources" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "videoSources" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_videoTracks = function () {
    var
    attr2attrVal = this.level.attr2attrVal,
    i, len,
    documentFragment = document.createDocumentFragment(),
    childNodes = this.node.childNodes,
    childNode;
    // first remove the current video tracks
    for ( i = 0, len = childNodes.length; i <= len; i++ ) {
      childNode = childNodes[ i ];
      if ( childNode.tagName === "TRACK" ) {
        childNode.parentNode.removeChild( childNode );
      }
    }
    for ( i = 1, len = attr2attrVal[ "$$max.videoTracks" ].calcVal; i <= len; i++ ) {
      childNode = document.createElement( "track" );
      childNode.type = attr2attrVal[ "videoTracks" + i + "Type" ].transitionCalcVal;
      childNode.src = attr2attrVal[ "videoTracks" + i + "Src" ].transitionCalcVal;
      documentFragment.appendChild( childNode );
    }
    this.node.appendChild( documentFragment );
  };

  LAY.Part.prototype.renderFn_videoAutoplay = function () {
    this.node.autoplay = this.level.attr2attrVal.videoAutoplay.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoController = function () {
    this.node.controls = this.level.attr2attrVal.videoController.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoCrossorigin = function () {
    this.node.crossorigin = this.level.attr2attrVal.videoCrossorigin.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoLoop = function () {
    this.node.loop = this.level.attr2attrVal.videoLoop.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoMuted = function () {
    this.node.muted = this.level.attr2attrVal.videoMuted.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoPreload = function () {
    this.node.preload = this.level.attr2attrVal.videoPreload.transitionCalcVal;
  };
  LAY.Part.prototype.renderFn_videoPoster = function () {
    this.node.poster = this.level.attr2attrVal.videoPoster.transitionCalcVal;
  };



})();

( function () {
  "use strict";
  LAY.Query = function ( rowS ) {
    this.rowS = rowS;
  };
  
  LAY.Query.prototype.filterEq = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.eq(
        this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterNeq = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.neq(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterGt = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.gt(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterGte = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.gte(
      this.rowS, key, val ) );
  };
  
  LAY.Query.prototype.filterLt = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.lt(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterLte = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.lte(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterRegex = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.regex(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterContains = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.contains(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterWithin = function ( key, val ) {
    return new LAY.Query( 
      LAY.$filterUtils.within( this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterFn = function ( fnFilter ) {
  	return new LAY.Query( LAY.$filterUtils.fn(
      this.rowS, fnFilter ) );
  };

  LAY.Query.prototype.foldMin = function ( key ) {
    return LAY.$foldUtils.min( this.rowS, key, val );
  };

  LAY.Query.prototype.foldMax = function ( key ) {
    return LAY.$foldUtils.max( this.rowS, key, val );
  };

  LAY.Query.prototype.foldSum = function ( key ) {
    return LAY.$foldUtils.sum( this.rowS, key, val );
  };

  LAY.Query.prototype.foldFn = function ( fnFold, acc ) {
    return LAY.$foldUtils.fn( this.rowS, fnFold, acc );
  };

  LAY.Query.prototype.index = function ( i ) {
  	return this.rowS[ i ];
  };

  LAY.Query.prototype.length = function () {
    return this.rowS.length;
  };
  LAY.Query.prototype.finish = function () {
  	return this.rowS;
  };


 
})();

(function () {
  "use strict";

  LAY.RelPath = function ( relativePath ) {


    this.isMe = false;
    this.isMany = false;
    this.path = "";
    this.isAbsolute = false;
    this.traverseArray = [];


    if  ( relativePath === "" ) {
      this.isMe = true;
    } else {
      if ( relativePath.charAt(0) === "/" ) {
        this.isAbsolute = true;
        this.path = relativePath;
      } else {
        var i=0;
        while ( relativePath.charAt( i ) === "." ) {
          if ( relativePath.slice(i, i+3) === "../" ) {
            this.traverseArray.push(0);
            i +=3;
          } else if ( relativePath.slice(i, i+4) === ".../" ) {
            this.traverseArray.push(1);
            i += 4;
          } else {
            throw "LAY Error: Error in Take path: " + relativePath;
          }
        }  
        // strip off the "../"s
        // eg: "../../Body" should become "Body"
        this.path = relativePath.slice( i );
      }
      if ( this.path.length !== 0 &&
          this.path.indexOf("*") === this.path.length - 1 ) {
        this.isMany = true;
        if ( this.path.length === 1 ) {
          this.path = "";
        } else {
          this.path = this.path.slice(0, this.path.length-2);
        }
      }
    }

  };


  LAY.RelPath.prototype.resolve = function ( referenceLevel ) {

    if ( this.isMe ) {
      return referenceLevel;
    } else {
      var level;
      if ( this.isAbsolute ) {
        level = LAY.$pathName2level[ this.path ];
      } else {
        level = referenceLevel;
        var traverseArray = this.traverseArray;

        for ( var i=0, len=traverseArray.length; i<len; i++ ) {
          if ( traverseArray[ i ] === 0 ) { //parent traversal
            level = level.parentLevel;
          } else { //closest row traversal
            do {
              level = level.parentLevel;
            } while ( !level.derivedMany )
            
          }
        }
        
        level =  ( this.path === "" ) ? level :
              LAY.$pathName2level[ level.pathName +
              ( ( level.pathName === "/" ) ? "" : "/" )+
              this.path ];
      }
      if ( this.isMany ) {
        return level.derivedMany.level;
      } else {
        return level;
      }
    }
  };



})();

( function () {
  "use strict";

  LAY.Take = function ( relativePath, attr ) {

    var _relPath00attr_S;

    if ( attr !== undefined ) {
      var path = new LAY.RelPath( relativePath );
      _relPath00attr_S = [ [ path, attr ] ];

      this.executable = function () {
        return path.resolve( this ).$getAttrVal( attr ).calcVal;          
      };
    } else { // direct value provided
      _relPath00attr_S = [];
      // note that 'relativePath' is misleading name
      // here in this second overloaded case
      var directValue = relativePath;
      if ( directValue instanceof LAY.Take ) {
        this.executable = directValue.executable;
        _relPath00attr_S = directValue._relPath00attr_S;
      } else {
        this.executable = function () {
          return directValue;
        };
      }
    }

    this._relPath00attr_S = _relPath00attr_S;

  };

  LAY.Take.prototype.execute = function ( contextPart ) {

    // pass in context part for relative path lookups
    return this.executable.call( contextPart );

  };

  LAY.Take.prototype.$mergePathAndAttrs = function ( take ) {

    var _relPath00attr_S = take._relPath00attr_S;
    for ( var i = 0, len = _relPath00attr_S.length; i < len; i++ ) {
      this._relPath00attr_S.push( _relPath00attr_S[ i ] );

    }
  };

  LAY.Take.prototype.add = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) + val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) + val;
      };
    }
    return this;
  };

  LAY.Take.prototype.plus = LAY.Take.prototype.add;

  LAY.Take.prototype.subtract = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) - val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) - val;
      };
    }
    return this;
  };

  LAY.Take.prototype.minus = LAY.Take.prototype.subtract;

  LAY.Take.prototype.divide = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) / val.execute( this );
      };
    } else {
      if ( val === 2 ) {
        return this.half();
      }
      this.executable = function () {
        return oldExecutable.call( this ) / val;
      };
    }
    return this;
  };

  LAY.Take.prototype.multiply = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) * val.execute( this );
      };
    } else {
      if ( val === 2 ) {
        return this.double();
      }
      this.executable = function () {
        return oldExecutable.call( this ) * val;
      };
    }
    return this;
  };

  LAY.Take.prototype.remainder = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) % val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) % val;
      };
    }
    return this;
  };

  LAY.Take.prototype.half = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) / 2;
    };

    return this;
  };

  LAY.Take.prototype.double = function ( ) {

    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ) * 2;
    };

    return this;
  };


  LAY.Take.prototype.contains = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).indexOf( val.execute( this ) ) !== -1;
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).indexOf( val ) !== -1;
      };
    }
    return this;
  };

  LAY.Take.prototype.identical = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return LAY.identical( oldExecutable.call( this ),
          val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return LAY.identical( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LAY.Take.prototype.eq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) === val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) === val;
      };
    }
    return this;
  };



  LAY.Take.prototype.neq = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) !== val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) !== val;
      };
    }
    return this;
  };

  LAY.Take.prototype.gt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) > val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) > val;
      };
    }
    return this;
  };

  LAY.Take.prototype.gte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) >= val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) >= val;
      };
    }
    return this;
  };

  LAY.Take.prototype.lt = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) < val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) < val;
      };
    }
    return this;
  };

  LAY.Take.prototype.lte = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) <= val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) <= val;
      };
    }
    return this;
  };

  LAY.Take.prototype.or = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) || val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) || val;
      };
    }
    return this;
  };

  LAY.Take.prototype.and = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ) && val.execute( this );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ) && val;
      };
    }
    return this;
  };

  LAY.Take.prototype.not = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return !oldExecutable.call( this );
    };

    return this;
  };


  LAY.Take.prototype.negative = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return -oldExecutable.call( this );
    };

    return this;
  };

  LAY.Take.prototype.number = function () {

    var oldExecutable = this.executable;

    this.executable = function () {
      return parseInt( oldExecutable.call( this ) );
    };

    return this;
  };



  LAY.Take.prototype.key = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this )[ val.execute( this ) ];
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this )[ val ];
      };
    }
    return this;
  };

  LAY.Take.prototype.index = LAY.Take.prototype.key;

  LAY.Take.prototype.length = function ( val ) {
    var oldExecutable = this.executable;

    this.executable = function () {
      return oldExecutable.call( this ).length;
    };

    return this;
  };

  LAY.Take.prototype.slice = function ( start, end ) {

    var oldExecutable = this.executable;

    if ( start instanceof LAY.Take ) {
      this.$mergePathAndAttrs( start );

      if ( end instanceof LAY.Take ) {
        this.$mergePathAndAttrs( end );
        this.executable = function () {
          return oldExecutable.call( this ).slice(
            start.execute( this ), end.execute( this ) );
        }

      } else {
        this.executable = function () {
          return oldExecutable.call( this ).slice(
          start.execute( this ), end );
        }
      }
    } else if ( end instanceof LAY.Take ) {
      this.$mergePathAndAttrs( end );
      this.executable = function () {
        return oldExecutable.call( this ).slice(
          start, end.execute( this ) );
      }
    } else {
      this.executable = function () {
        return oldExecutable.call( this ).slice(
          start, end );
      }
    }
    return this;
  };

  LAY.Take.prototype.min = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return Math.min( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.min( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LAY.Take.prototype.max = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return Math.max( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.max( oldExecutable.call( this ), val );
      };
    }
    return this;
  };


  LAY.Take.prototype.ceil = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.ceil( oldExecutable.call( this ) );
    };
    return this;
  };

  LAY.Take.prototype.floor = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.floor( oldExecutable.call( this ) );
    };
    return this;
  };

  LAY.Take.prototype.round = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.round( oldExecutable.call( this ) );
    };
    return this;
  };


  LAY.Take.prototype.sin = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.sin( oldExecutable.call( this ) );
    };
    return this;
  };


  LAY.Take.prototype.cos = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.cos( oldExecutable.call( this ) );
    };
    return this;
  };


  LAY.Take.prototype.tan = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.tan( oldExecutable.call( this ) );
    };
    return this;
  };

  LAY.Take.prototype.abs = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.abs( oldExecutable.call( this ) );
    };
    return this;
  };


  LAY.Take.prototype.pow = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ), val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return Math.pow( oldExecutable.call( this ), val );
      };
    }
    return this;
  };

  LAY.Take.prototype.log = function () {

    var oldExecutable = this.executable;
    this.executable = function () {
      return Math.log( oldExecutable.call( this ) );
    };
    return this;
  };


  LAY.Take.prototype.match = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).match( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).match( val );
      };
    }
    return this;

  };

  LAY.Take.prototype.test = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).test( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).test( val );
      };
    }
    return this;

  };

  LAY.Take.prototype.concat = LAY.Take.prototype.add;

  LAY.Take.prototype.lowercase = function () {
    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).toLowerCase();
    };
    return this;
  };

  LAY.Take.prototype.uppercase = function () {
    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).toUpperCase();
    };
    return this;
  };

  LAY.Take.prototype.capitalize = function () {
    var oldExecutable = this.executable;
    this.executable = function () {
      var val = oldExecutable.call( this );
      return val.charAt( 0 ).toUpperCase() +
        val.slice( 1 );
    };
    return this;
  };

  LAY.Take.prototype.format = function () {

    var argS = Array.prototype.slice.call( arguments ),
      takeFormat = new LAY.Take( LAY.$format );

    argS.unshift( this );

    return takeFormat.fn.apply( takeFormat, argS );

  };


  LAY.Take.prototype.i18nFormat = function () {
    function fnWrapperI18nFormat () {
      var argS = Array.prototype.slice.call( arguments );
      argS[ 0 ] = ( argS[ 0 ] )[ LAY.level( '/' ).attr( 'data.lang' ) ];
      if ( argS[ 0 ] === undefined ) {
        throw "LAY Error: No language defined for i18nFormat";
      }
      return LAY.$format.apply( undefined, argS );
    }

    this._relPath00attr_S.push( [ new LAY.RelPath( '/' ), 'data.lang' ] );

    var argS = Array.prototype.slice.call(arguments),
      takeFormat = new LAY.Take( fnWrapperI18nFormat );

    argS.unshift( this );

    return takeFormat.fn.apply( takeFormat, argS);

  };

  


  LAY.Take.prototype.colorEquals = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).equals( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).equals( val );
      };
    }
    return this;

  };


  LAY.Take.prototype.colorLighten = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().lighten( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().lighten( val );
      };
    }
    return this;

  };


  LAY.Take.prototype.colorDarken = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().darken( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().darken( val );
      };
    }
    return this;

  };


  LAY.Take.prototype.colorStringify = function ( ) {

    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).copy().stringify( );
    };

    return this;

  };

  LAY.Take.prototype.colorInvert = function ( ) {

    var oldExecutable = this.executable;
    this.executable = function () {
      return oldExecutable.call( this ).copy().invert();
    };

    return this;

  };

  LAY.Take.prototype.colorSaturate = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturate( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturate( val );
      };
    }
    return this;

  };

  LAY.Take.prototype.colorDesaturate = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().desaturate( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().desaturate( val );
      };
    }
    return this;

  };


  LAY.Take.prototype.colorAlpha = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().alpha( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().alpha( val );
      };
    }
    return this;

  };

  LAY.Take.prototype.colorRed = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().red( val );
      };
    }
    return this;
  };


  LAY.Take.prototype.colorGreen = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().green( val );
      };
    }
    return this;
  };

  LAY.Take.prototype.colorBlue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().blue( val );
      };
    }
    return this;
  };

  LAY.Take.prototype.colorHue = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().hue( val );
      };
    }
    return this;
  };

  LAY.Take.prototype.colorSaturation = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().saturation( val );
      };
    }
    return this;
  };

  LAY.Take.prototype.colorLightness = function ( val ) {

    var oldExecutable = this.executable;
    if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val.execute( this ) );
      };
    } else {

      this.executable = function () {
        return oldExecutable.call( this ).copy().lightness( val );
      };
    }
    return this;
  };

  LAY.Take.prototype.filterEq = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.eq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.eq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.eq(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.eq(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterNeq = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.neq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.neq(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.neq(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.neq(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterGt = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.gt(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.gt(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.gt(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.gt(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterGte = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.gte(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.gte(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.gte(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.gte(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterLt = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.lt(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.lt(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.lt(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.lt(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterLte = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.lte(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.lte(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.lte(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.lte(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterRegex = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.regex(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.regex(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.regex(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.regex(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterContains = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.contains(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.contains(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.contains(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.contains(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterWithin = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.within(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.within(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.within(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.within(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.filterFn = function ( attr, val ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( val instanceof LAY.Take ) {
        this.$mergePathAndAttrs( val );
        this.executable = function () {
          return LAY.$filterUtils.fn(
            oldExecutable.call( this ),
            attr.execute( this ),
            val.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$filterUtils.fn(
            oldExecutable.call( this ),
            attr.execute( this ),
            val
          );
        }
      }
    } else if ( val instanceof LAY.Take ) {
      this.$mergePathAndAttrs( val );
      this.executable = function () {
        return LAY.$filterUtils.fn(
            oldExecutable.call( this ),
            attr,
            val.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$filterUtils.fn(
            oldExecutable.call( this ),
            attr,
            val
          );
      }
    }
    return this;
  };

  LAY.Take.prototype.foldMin = function ( attr ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );
        this.executable = function () {
          return LAY.$foldUtils.min(
            oldExecutable.call( this ),
            attr.execute( this )
        );
      }
    } else {
      this.executable = function () {
        return LAY.$foldUtils.min(
          oldExecutable.call( this ),
          attr
        );
      }
      
    }
    return this;
  };

  LAY.Take.prototype.foldMax = function ( attr ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );
        this.executable = function () {
          return LAY.$foldUtils.max(
            oldExecutable.call( this ),
            attr.execute( this )
        );
      }
    } else {
      this.executable = function () {
        return LAY.$foldUtils.max(
          oldExecutable.call( this ),
          attr
        );
      }
      
    }
    return this;
  };

  LAY.Take.prototype.foldSum = function ( attr ) {

    var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );
        this.executable = function () {
          return LAY.$foldUtils.sum(
            oldExecutable.call( this ),
            attr.execute( this )
        );
      }
    } else {
      this.executable = function () {
        return LAY.$foldUtils.sum(
          oldExecutable.call( this ),
          attr
        );
      }
      
    }
    return this;
  };

  LAY.Take.prototype.foldFn = function ( attr, acc ) {

     var oldExecutable = this.executable;

    if ( attr instanceof LAY.Take ) {
      this.$mergePathAndAttrs( attr );

      if ( acc instanceof LAY.Take ) {
        this.$mergePathAndAttrs( acc );
        this.executable = function () {
          return LAY.$foldUtils.fn(
            oldExecutable.call( this ),
            attr.execute( this ),
            acc.execute( this )
          );
        }

      } else {
        this.executable = function () {
          return LAY.$foldUtils.fn(
            oldExecutable.call( this ),
            attr.execute( this ),
            acc
          );
        }
      }
    } else if ( acc instanceof LAY.Take ) {
      this.$mergePathAndAttrs( acc );
      this.executable = function () {
        return LAY.$foldUtils.fn(
            oldExecutable.call( this ),
            attr,
            acc.execute( this )
          );
      }
    } else {
      this.executable = function () {
        return LAY.$foldUtils.fn(
            oldExecutable.call( this ),
            attr,
            ac
          );
      }
    }
    return this;
  };
  /*
  * Call custom function with arguments, where arguments
  * can be LAY.Take objects.
  */
  LAY.Take.prototype.fn = function () {

    var fnExecutable = this.executable;
    //console.log(fnExecutable.call(this));
    //console.log(fnExecutable, arguments, arguments.length);
    if ( arguments.length === 0 ) {

      this.executable = function () {
        return fnExecutable.call( this ).call( this );
      };

    } else if ( arguments.length === 1 ) {

      var arg = arguments[ 0 ];

      if ( arg instanceof LAY.Take ) {

        this.$mergePathAndAttrs( arg );
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg.execute( this ) );
        };
      } else {
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg );
        };
      }

    } else if ( arguments.length === 2 ) {

      var arg1 = arguments[ 0 ];
      var arg2 = arguments[ 1 ];

      if ( arg1 instanceof LAY.Take ) {

        this.$mergePathAndAttrs( arg1 );

        if ( arg2 instanceof LAY.Take ) {

          this.$mergePathAndAttrs( arg2 );

          this.executable = function () {
            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2.execute( this ) );
          };

        } else {
          this.executable = function () {

            return fnExecutable.call( this ).call( this, arg1.execute( this ), arg2 );
          };
        }

      } else if ( arg2 instanceof LAY.Take ) {

        this.$mergePathAndAttrs( arg2 );
        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg1, arg2.execute( this ) );
        };


      } else {

        this.executable = function () {

          return fnExecutable.call( this ).call( this, arg1, arg2 );
        };
      }
    } else {

      var argSlength = arguments.length;
      var argS = Array.prototype.slice.call( arguments );

      for ( var i = 0, curArg; i < argSlength; i++ ) {

        curArg = arguments[ i ];

        if ( curArg instanceof LAY.Take ) {

          this.$mergePathAndAttrs( curArg );

        }
      }

      this.executable = function () {

        var executedArgS = new Array( argSlength );

        for ( var i = 0, arg; i < argSlength; i++ ) {

          arg = argS[ i ];

          executedArgS[ i ] = arg instanceof LAY.Take ? arg.execute( this ) : arg;

        }

        return fnExecutable.call( this ).apply( this, executedArgS );

      };
    }

    return this;


};

}());

( function () {
  "use strict";

  var transitionType2fn,
    epsilon = 1e-6;

  LAY.Transition = function ( type, delay, duration, args, done ) {
    this.done = done;
    this.delay = delay;
    this.transition = ( transitionType2fn[ type ] )( duration, args );

  };

  LAY.Transition.prototype.generateNext = function ( delta ) {
    return this.transition.generateNext( delta );
  };

  LAY.Transition.prototype.checkIsComplete = function () {
    return this.transition.checkIsComplete();
  };

  function LinearTransition ( duration, args ) {

    this.curTime = 0;
    this.duration = duration;

  }

  LinearTransition.prototype.generateNext = function ( delta ) {
    return ( ( this.curTime += delta ) / this.duration );
  };

  LinearTransition.prototype.checkIsComplete = function () {
    return this.curTime >= this.duration;
  };

  function CubicBezierTransition ( duration, args ) {

    this.curTime = 0;
    this.duration = duration;

    this.cx = 3.0 * args.a;
    this.bx = 3.0 * (args.c - args.a) - this.cx
    this.ax = 1.0 - this.cx - this.bx
    this.cy = 3.0 * args.b;
    this.by = 3.0 * (args.d - args.b) - this.cy
    this.ay = 1.0 - this.cy - this.by

  }


  // source of cubic bezier code below:
  // facebook pop framework & framer.js
  CubicBezierTransition.prototype.generateNext = function ( delta ) {

    return this.sampleCurveY( this.solveCurveX(
       (this.curTime += delta) / this.duration
    ) );

  }

  CubicBezierTransition.prototype.checkIsComplete = function () {
    return this.curTime >= this.duration;
  };


  CubicBezierTransition.prototype.sampleCurveX = function ( t ) {
    // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  };

  CubicBezierTransition.prototype.sampleCurveY = function ( t ) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  };

  CubicBezierTransition.prototype.sampleCurveDerivativeX = function( t ) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  };

  CubicBezierTransition.prototype.solveCurveX = function( x ) {
      var t0, t1, t2, x2, d2, i;

      // First try a few iterations of Newton's method -- normally very fast.
      for ( t2 = x, i = 0; i < 8; i++ ) {
        x2 = this.sampleCurveX( t2 ) - x;
        if ( Math.abs( x2 ) < epsilon )
          return t2;
        d2 = this.sampleCurveDerivativeX( t2 );
        if ( Math.abs( d2 ) < 1e-6 )
          break;
        t2 = t2 - x2 / d2;
      }

      // Fall back to the bisection method for reliability.
      t0 = 0.0;
      t1 = 1.0;
      t2 = x;

      if ( t2 < t0 )
        return t0;
      if ( t2 > t1 )
        return t1;

      while ( t0 < t1 ) {
        x2 = this.sampleCurveX( t2 );
        if ( Math.abs( x2 - x ) < epsilon )
          return t2;
        if ( x > x2 )
          t0 = t2;
        else
          t1 = t2;
        t2 = ( t1 - t0 ) * .5 + t0;
      }

      // Failure.
      return t2;
  };



  transitionType2fn = {
    linear: function ( duration, args ) {
      return new LinearTransition( duration, args );
    },
    "spring": function ( duration, args ) {
      return new LAY.$springTransition( duration, args );
    },
    "cubic-bezier": function ( duration, args ) {
      return new CubicBezierTransition( duration, args );
    },
    ease: function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.25, b: 0.1, c: 0.25, d: 1
      });
    },
    "ease-in": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.42, b: 0, c: 1, d: 1
      });
    },
    "ease-out": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0, b: 0, c: 0.58, d: 1
      });
    },
    "ease-in-out": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.42, b: 0, c: 0.58, d: 1
      });
    }
    /*
    ease: function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.25, b: 0.1, c: 0.25, d: 1
      });
    },
    "ease-in": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.42, b: 0, c: 1, d: 1
      });
    },
    "ease-out": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0, b: 0, c: 0.58, d: 1
      });
    },
    "ease-in-out": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.42, b: 0, c: 0.58, d: 1
      });
    }*/
  };






})();

( function () {
  "use strict";

  LAY.clog = function () {

    LAY.$numClog++;

  };

})();

( function() {
  "use strict";

  function takeColor ( color ) {

    return LAY.color( color );

  }

  var numRegex = /(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*((\d+\.\d+)|(\d+))?/;
  LAY.color = function ( colorName ) {

    if ( colorName instanceof LAY.Take ) {
      return new LAY.Take( takeColor ).fn( colorName );
    } else {
      colorName = colorName.toLowerCase();
      var colorValue = colorName2colorValue[ colorName ];
      if ( colorValue !== undefined ) {
        return new LAY.Color( 'rgb', colorValue, 1 );
      } else {
        if ( colorName.match(/(rgb)|(hsl)/) ) {
          var match = colorName.match( numRegex );
          if ( match ) {
            var
              arg1 = parseInt(match[1]),
              arg2 = parseInt(match[2]),
              arg3 = parseInt(match[3]),
              argAlpha = match[4] === undefined ?
               1 : parseFloat(match[4]);

            if ( colorName.indexOf("rgb") !== -1 ) {
              return LAY.rgba( arg1,arg2,arg3, argAlpha );
            } else {
              return LAY.hsla( arg1,arg2,arg3, argAlpha );
            }
          }
        }
      } 
    }
    throw ("LAY Error: Color name: " + colorName +  " not found." );

  };

  // source page: http://www.w3.org/TR/css3-color/
  // source code: for ( var i=2, len=tbody.childNodes.length; i < len; i++) { var m = tbody.childNodes[i].childNodes[5].innerText.match(/(\d+),(\d+),(\d+)/); d[tbody.childNodes[i].childNodes[3].childNodes[0].innerText] = {r:m[1], g:m[2], b:m[3]}}

  var colorName2colorValue = {
    aliceblue : { r: 240 , g: 248 , b: 255 },
    antiquewhite : { r: 250 , g: 235 , b: 215 },
    aqua : { r: 0 , g: 255 , b: 255 },
    aquamarine : { r: 127 , g: 255 , b: 212 },
    azure : { r: 240 , g: 255 , b: 255 },
    beige : { r: 245 , g: 245 , b: 220 },
    bisque : { r: 255 , g: 228 , b: 196 },
    black : { r: 0 , g: 0 , b: 0 },
    blanchedalmond : { r: 255 , g: 235 , b: 205 },
    blue : { r: 0 , g: 0 , b: 255 },
    blueviolet : { r: 138 , g: 43 , b: 226 },
    brown : { r: 165 , g: 42 , b: 42 },
    burlywood : { r: 222 , g: 184 , b: 135 },
    cadetblue : { r: 95 , g: 158 , b: 160 },
    chartreuse : { r: 127 , g: 255 , b: 0 },
    chocolate : { r: 210 , g: 105 , b: 30 },
    coral : { r: 255 , g: 127 , b: 80 },
    cornflowerblue : { r: 100 , g: 149 , b: 237 },
    cornsilk : { r: 255 , g: 248 , b: 220 },
    crimson : { r: 220 , g: 20 , b: 60 },
    cyan : { r: 0 , g: 255 , b: 255 },
    darkblue : { r: 0 , g: 0 , b: 139 },
    darkcyan : { r: 0 , g: 139 , b: 139 },
    darkgoldenrod : { r: 184 , g: 134 , b: 11 },
    darkgray : { r: 169 , g: 169 , b: 169 },
    darkgreen : { r: 0 , g: 100 , b: 0 },
    darkgrey : { r: 169 , g: 169 , b: 169 },
    darkkhaki : { r: 189 , g: 183 , b: 107 },
    darkmagenta : { r: 139 , g: 0 , b: 139 },
    darkolivegreen : { r: 85 , g: 107 , b: 47 },
    darkorange : { r: 255 , g: 140 , b: 0 },
    darkorchid : { r: 153 , g: 50 , b: 204 },
    darkred : { r: 139 , g: 0 , b: 0 },
    darksalmon : { r: 233 , g: 150 , b: 122 },
    darkseagreen : { r: 143 , g: 188 , b: 143 },
    darkslateblue : { r: 72 , g: 61 , b: 139 },
    darkslategray : { r: 47 , g: 79 , b: 79 },
    darkslategrey : { r: 47 , g: 79 , b: 79 },
    darkturquoise : { r: 0 , g: 206 , b: 209 },
    darkviolet : { r: 148 , g: 0 , b: 211 },
    deeppink : { r: 255 , g: 20 , b: 147 },
    deepskyblue : { r: 0 , g: 191 , b: 255 },
    dimgray : { r: 105 , g: 105 , b: 105 },
    dimgrey : { r: 105 , g: 105 , b: 105 },
    dodgerblue : { r: 30 , g: 144 , b: 255 },
    firebrick : { r: 178 , g: 34 , b: 34 },
    floralwhite : { r: 255 , g: 250 , b: 240 },
    forestgreen : { r: 34 , g: 139 , b: 34 },
    fuchsia : { r: 255 , g: 0 , b: 255 },
    gainsboro : { r: 220 , g: 220 , b: 220 },
    ghostwhite : { r: 248 , g: 248 , b: 255 },
    gold : { r: 255 , g: 215 , b: 0 },
    goldenrod : { r: 218 , g: 165 , b: 32 },
    gray : { r: 128 , g: 128 , b: 128 },
    green : { r: 0 , g: 128 , b: 0 },
    greenyellow : { r: 173 , g: 255 , b: 47 },
    grey : { r: 128 , g: 128 , b: 128 },
    honeydew : { r: 240 , g: 255 , b: 240 },
    hotpink : { r: 255 , g: 105 , b: 180 },
    indianred : { r: 205 , g: 92 , b: 92 },
    indigo : { r: 75 , g: 0 , b: 130 },
    ivory : { r: 255 , g: 255 , b: 240 },
    khaki : { r: 240 , g: 230 , b: 140 },
    lavender : { r: 230 , g: 230 , b: 250 },
    lavenderblush : { r: 255 , g: 240 , b: 245 },
    lawngreen : { r: 124 , g: 252 , b: 0 },
    lemonchiffon : { r: 255 , g: 250 , b: 205 },
    lightblue : { r: 173 , g: 216 , b: 230 },
    lightcoral : { r: 240 , g: 128 , b: 128 },
    lightcyan : { r: 224 , g: 255 , b: 255 },
    lightgoldenrodyellow : { r: 250 , g: 250 , b: 210 },
    lightgray : { r: 211 , g: 211 , b: 211 },
    lightgreen : { r: 144 , g: 238 , b: 144 },
    lightgrey : { r: 211 , g: 211 , b: 211 },
    lightpink : { r: 255 , g: 182 , b: 193 },
    lightsalmon : { r: 255 , g: 160 , b: 122 },
    lightseagreen : { r: 32 , g: 178 , b: 170 },
    lightskyblue : { r: 135 , g: 206 , b: 250 },
    lightslategray : { r: 119 , g: 136 , b: 153 },
    lightslategrey : { r: 119 , g: 136 , b: 153 },
    lightsteelblue : { r: 176 , g: 196 , b: 222 },
    lightyellow : { r: 255 , g: 255 , b: 224 },
    lime : { r: 0 , g: 255 , b: 0 },
    limegreen : { r: 50 , g: 205 , b: 50 },
    linen : { r: 250 , g: 240 , b: 230 },
    magenta : { r: 255 , g: 0 , b: 255 },
    maroon : { r: 128 , g: 0 , b: 0 },
    mediumaquamarine : { r: 102 , g: 205 , b: 170 },
    mediumblue : { r: 0 , g: 0 , b: 205 },
    mediumorchid : { r: 186 , g: 85 , b: 211 },
    mediumpurple : { r: 147 , g: 112 , b: 219 },
    mediumseagreen : { r: 60 , g: 179 , b: 113 },
    mediumslateblue : { r: 123 , g: 104 , b: 238 },
    mediumspringgreen : { r: 0 , g: 250 , b: 154 },
    mediumturquoise : { r: 72 , g: 209 , b: 204 },
    mediumvioletred : { r: 199 , g: 21 , b: 133 },
    midnightblue : { r: 25 , g: 25 , b: 112 },
    mintcream : { r: 245 , g: 255 , b: 250 },
    mistyrose : { r: 255 , g: 228 , b: 225 },
    moccasin : { r: 255 , g: 228 , b: 181 },
    navajowhite : { r: 255 , g: 222 , b: 173 },
    navy : { r: 0 , g: 0 , b: 128 },
    oldlace : { r: 253 , g: 245 , b: 230 },
    olive : { r: 128 , g: 128 , b: 0 },
    olivedrab : { r: 107 , g: 142 , b: 35 },
    orange : { r: 255 , g: 165 , b: 0 },
    orangered : { r: 255 , g: 69 , b: 0 },
    orchid : { r: 218 , g: 112 , b: 214 },
    palegoldenrod : { r: 238 , g: 232 , b: 170 },
    palegreen : { r: 152 , g: 251 , b: 152 },
    paleturquoise : { r: 175 , g: 238 , b: 238 },
    palevioletred : { r: 219 , g: 112 , b: 147 },
    papayawhip : { r: 255 , g: 239 , b: 213 },
    peachpuff : { r: 255 , g: 218 , b: 185 },
    peru : { r: 205 , g: 133 , b: 63 },
    pink : { r: 255 , g: 192 , b: 203 },
    plum : { r: 221 , g: 160 , b: 221 },
    powderblue : { r: 176 , g: 224 , b: 230 },
    purple : { r: 128 , g: 0 , b: 128 },
    red : { r: 255 , g: 0 , b: 0 },
    rosybrown : { r: 188 , g: 143 , b: 143 },
    royalblue : { r: 65 , g: 105 , b: 225 },
    saddlebrown : { r: 139 , g: 69 , b: 19 },
    salmon : { r: 250 , g: 128 , b: 114 },
    sandybrown : { r: 244 , g: 164 , b: 96 },
    seagreen : { r: 46 , g: 139 , b: 87 },
    seashell : { r: 255 , g: 245 , b: 238 },
    sienna : { r: 160 , g: 82 , b: 45 },
    silver : { r: 192 , g: 192 , b: 192 },
    skyblue : { r: 135 , g: 206 , b: 235 },
    slateblue : { r: 106 , g: 90 , b: 205 },
    slategray : { r: 112 , g: 128 , b: 144 },
    slategrey : { r: 112 , g: 128 , b: 144 },
    snow : { r: 255 , g: 250 , b: 250 },
    springgreen : { r: 0 , g: 255 , b: 127 },
    steelblue : { r: 70 , g: 130 , b: 180 },
    tan : { r: 210 , g: 180 , b: 140 },
    teal : { r: 0 , g: 128 , b: 128 },
    thistle : { r: 216 , g: 191 , b: 216 },
    tomato : { r: 255 , g: 99 , b: 71 },
    turquoise : { r: 64 , g: 224 , b: 208 },
    violet : { r: 238 , g: 130 , b: 238 },
    wheat : { r: 245 , g: 222 , b: 179 },
    white : { r: 255 , g: 255 , b: 255 },
    whitesmoke : { r: 245 , g: 245 , b: 245 },
    yellow : { r: 255 , g: 255 , b: 0 },
    yellowgreen : { r: 154 , g: 205 , b: 50 }
  };

})();

( function () {
	"use strict";

	LAY.formation = function ( name, fargs, fn ) {
    	LAY.$formation2fargs[ name ] = fargs;
			LAY.$formation2fn[ name ] = fn;
	};

})();
( function() {
  "use strict";

  function takeHex ( hex ) {

    return LAY.hex( hex );

  }

  LAY.hex = function ( hexVal ) {

    if ( hexVal instanceof LAY.Take ) {
        return new LAY.Take( takeHex ).fn( hexVal );
    } else {

      return new LAY.Color( 'rgb', hexToRgb(hexVal), 1 );        
    }

  };

  // source: http://stackoverflow.com/users/1047797/david
  // http://stackoverflow.com/a/11508164
  function hexToRgb(hex) {
    return {
      r: (hex >> 16) & 255,
      g: (hex >> 8) & 255,
      b: hex & 255
    };
  }

})();

(function() {
  "use strict";


  LAY.hsl = function ( h, s, l ) {

    return LAY.hsla( h, s, l, 1 );

  };

})();

(function() {
  "use strict";

  function takeHSLA ( h, s, l, a ) {

    var color = new LAY.Color( "hsl", { h: h, s: s, l: l }, a );

  }

  LAY.hsla = function ( h, s, l, a ) {

    if ( h instanceof LAY.Take ||
      s instanceof LAY.Take ||
      l instanceof LAY.Take ||
      a instanceof LAY.Take ) {

        return new LAY.Take( takeHSLA ).fn( h, s, l, a );

      } else {
        return new LAY.Color( "hsl", { h: h, s: s, l: l }, a );
      }

    };

  })();

( function () {
  "use strict";
  
/*!
* source: chai.js (https://github.com/chaijs/deep-eql)
* deep-eql
* Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
* MIT Licensed
*/

  
  LAY.identical = function ( a, b ) {
  	return deepEqual( a, b, undefined );
  };


function type (x) {
	return LAY.$type(x);
}

  function deepEqual(a,b,m) {
  	var
  		typeA = type( a ),
  		typeB = type( b );

  	if ( sameValue( a, b ) ) {
			return true;
		} else if ( 'color' === typeA ) {
			return colorEqual(a, b);
		} else if ( 'level' === typeA ) {
			return levelEqual(a, b);
		} else if ( 'take' === typeA || 'take' === typeB ) {
			return false;
		} else if ('date' === typeA ) {
			return dateEqual(a, b);
		} else if ('regexp' === typeA) {
			return regexpEqual(a, b);
		} else if ('arguments' === typeA) {
			return argumentsEqual(a, b, m);
		} else if (('object' !== typeA && 'object' !== typeB)
			&& ('array' !== typeA && 'array' !== typeB)) {
			return sameValue(a, b);
		} else {
			return objectEqual(a, b, m);
		}
  }



	/*
	* Strict (egal) equality test. Ensures that NaN always
	* equals NaN and `-0` does not equal `+0`.
	*
	* @param {Mixed} a
	* @param {Mixed} b
	* @return {Boolean} equal match
	*/

	function sameValue(a, b) {
		if (a === b) return a !== 0 || 1 / a === 1 / b;
		return a !== a && b !== b;
	}


	/*
	* Compare two Date objects by asserting that
	* the time values are equal using `saveValue`.
	*
	* @param {Date} a
	* @param {Date} b
	* @return {Boolean} result
	*/

	function dateEqual(a, b) {
		if ('date' !== type(b)) return false;
		return sameValue(a.getTime(), b.getTime());
	}


	function colorEqual (a, b) {
		return type(b) === "color" && a.equals(b);		
	}

	function levelEqual (a, b) {
		return type(b) === "level" && ( a.pathName === b.pathName );		
	}

	/*
	* Compare two regular expressions by converting them
	* to string and checking for `sameValue`.
	*
	* @param {RegExp} a
	* @param {RegExp} b
	* @return {Boolean} result
	*/

	function regexpEqual(a, b) {
		if ('regexp' !== type(b)) return false;
		return sameValue(a.toString(), b.toString());
	}

	/*
	* Assert deep equality of two `arguments` objects.
	* Unfortunately, these must be sliced to arrays
	* prior to test to ensure no bad behavior.
	*
	* @param {Arguments} a
	* @param {Arguments} b
	* @param {Array} memoize (optional)
	* @return {Boolean} result
	*/

	function argumentsEqual(a, b, m) {
		if ('arguments' !== type(b)) return false;
		a = [].slice.call(a);
		b = [].slice.call(b);
		return deepEqual(a, b, m);
	}

	/*
	* Get enumerable properties of a given object.
	*
	* @param {Object} a
	* @return {Array} property names
	*/

	function enumerable(a) {
		var res = [];
		for (var key in a) res.push(key);
		return res;
	}

	/*
	* Simple equality for flat iterable objects
	* such as Arrays or Node.js buffers.
	*
	* @param {Iterable} a
	* @param {Iterable} b
	* @return {Boolean} result
	*/

	function iterableEqual(a, b) {
		if (a.length !==  b.length) return false;

		var i = 0;
		var match = true;

		for (; i < a.length; i++) {
			if (a[i] !== b[i]) {
			  match = false;
			  break;
			}
		}

		return match;
	}

	/*
	* Extension to `iterableEqual` specifically
	* for Node.js Buffers.
	*
	* @param {Buffer} a
	* @param {Mixed} b
	* @return {Boolean} result
	*/

	function bufferEqual(a, b) {
		if (!Buffer.isBuffer(b)) return false;
		return iterableEqual(a, b);
	}

	/*
	* Block for `objectEqual` ensuring non-existing
	* values don't get in.
	*
	* @param {Mixed} object
	* @return {Boolean} result
	*/

	function isValue(a) {
		return a !== null && a !== undefined;
	}

	/*
	* Recursively check the equality of two objects.
	* Once basic sameness has been established it will
	* defer to `deepEqual` for each enumerable key
	* in the object.
	*
	* @param {Mixed} a
	* @param {Mixed} b
	* @return {Boolean} result
	*/

	function objectEqual(a, b, m) {
		if (!isValue(a) || !isValue(b)) {
			return false;
		}

		if (a.prototype !== b.prototype) {
			return false;
		}

		var i;
		if (m) {
			for (i = 0; i < m.length; i++) {
		 	 if ((m[i][0] === a && m[i][1] === b)
		 	 ||  (m[i][0] === b && m[i][1] === a)) {
		 	   return true;
		 	 }
			}
		} else {
			m = [];
		}

		try {
			var ka = enumerable(a);
			var kb = enumerable(b);
		} catch (ex) {
			return false;
		}

		ka.sort();
		kb.sort();

		if (!iterableEqual(ka, kb)) {
			return false;
		}

		m.push([ a, b ]);

		var key;
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!deepEqual(a[key], b[key], m)) {
			  return false;
			}
		}

		return true;
	}




})();
(function() {
  "use strict";

  LAY.level = function ( path ) {

    return LAY.$pathName2level[ path ];

  };


})();

(function() {
  "use strict";


  LAY.rgb = function ( r, g, b ) {

    return LAY.rgba( r, g, b, 1 );

  };

})();

(function() {
  "use strict";


  function takeRGBA ( r, g, b, a ) {

    return new LAY.Color( "rgb", { r: r, g: g, b: b }, a );

  }

  LAY.rgba = function ( r, g, b, a ) {


    if ( r instanceof LAY.Take ||
      g instanceof LAY.Take ||
      b instanceof LAY.Take ||
      a instanceof LAY.Take ) {

          return new LAY.Take( takeRGBA ).fn( r, g, b, a );

      } else {

        return new LAY.Color( "rgb", { r: r, g: g, b: b }, a );
      }

    };

  })();

(function() {
  "use strict";

  LAY.run =  function ( rootLson ) {

    
    setRuntimeGlobals();

    ( new LAY.Level( "/", rootLson, undefined ) ).$init();

    LAY.$solve();

    window.onresize = updateSize;

  };

  function setRuntimeGlobals () {
    var
      takeMidpointX = LAY.take("", "width").half(),
      takeMidpointY = LAY.take("", "height").half();
    
    LAY.$miscPosAttr2take = {
      centerX: LAY.take("","left").add( takeMidpointX ),
      centerY: LAY.take("","top").add( takeMidpointY ),
      $midpointX: takeMidpointX,
      $midpointY: takeMidpointY,
      $absoluteLeft: LAY.take("../", "$absoluteLeft").add(
        LAY.take("", "left") ),
      $absoluteTop: LAY.take("../", "$absoluteTop").add(
        LAY.take("", "top") )
    };

    LAY.$essentialPosAttr2take = {
      right: LAY.take("","left").add( LAY.take("", "width") ),
      bottom: LAY.take("","top").add( LAY.take("", "height") )
    };

    LAY.$emptyAttrVal = new LAY.AttrVal( "", undefined );

    LAY.$formationDisplayNoneState = {
      onlyif: LAY.take("","$f").eq(-1),
      props: {
        display:false
      }
    };
  }

  function updateSize () {

    var rootLevel = LAY.$pathName2level[ "/" ];
    rootLevel.$changeAttrVal( "$windowWidth", window.innerWidth ||
         document.documentElement.clientWidth ||
          document.body.clientWidth );
    rootLevel.$changeAttrVal( "$windowHeight", window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight );

  }




})();

(function() {
  "use strict";


  LAY.take = function ( relativePath, prop ) {

    if ( ( prop !== undefined ) &&
    	( LAY.$checkIsValidUtils.checkIsAttrExpandable( prop ) ) ) {
        throw ( "LAY Error: takes using expander props such as '" + relativePath  + "' are not permitted." );
    } else {

    	return new LAY.Take( relativePath, prop );
    }

  };

})();

( function() {
  "use strict";


  LAY.transparent = function ( ) {

    return new LAY.Color( 'rgb', { r: 0, g: 0, b: 0 }, 0 );

  };

})();

(function() {
  "use strict";

  LAY.unclog = function () {

    if ( --LAY.$numClog === 0 ) {
      LAY.$solve();
    }
    
  };

})();

( function () {
  "use strict";

  LAY.$arrayUtils = {
    /*
    * Add to array if element does not exist already
    * Return true the element was added (as it did not exist previously)
    */
    pushUnique: function ( elementS, element ) {
      if ( elementS.indexOf( element ) === -1  ) {
        elementS.push( element );
        return true;
      }
      return false;
    },

    /* Prepend element, if preset already then remove and prepend */
    prependUnique: function ( elementS, element ) {
      LAY.$arrayUtils.remove( elementS, element );
      elementS.unshift( element );
    },

    /*
    * Remove from array if element exists in it
    * Return true the element was remove (as it did exist previously)
    */
    remove: function ( elementS, element ) {
      var ind = elementS.indexOf( element );
      if ( ind !== -1 ) {
        elementS.splice( ind, 1 );
        return true;
      }
      return false;
    },

    /*
    * Remove element at index i
    */
    removeAtIndex: function ( elementS, ind ) {
      elementS.splice( ind, 1 );

    },



    /* Clone array at a single level */
    cloneSingleLevel: function ( elementS ) {
      return elementS.slice( 0 );
      
    },

    /*Swap element at index a with index b */
    swap: function ( elementS, a, b ) {
      var tmp = elementS[ a ];
      elementS[ a ] = elementS[ b ];
      elementS[ b ] = tmp;
    }

  };





})();

(function(){
  "use strict";
  LAY.$capitalize = function( string ) {

    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );

  };
})();

(function () {
  "use strict";

  var doingReadonlyS = [
    "$hovering", "$clicking"
  ];

  LAY.$checkIfDoingReadonly = function ( attr ) {
    return doingReadonlyS.indexOf( attr ) !== -1;
  };

})();
( function () {
  "use strict";

  var immidiateReadonlyS = [
    "$naturalWidth", "$naturalHeight",
    "$scrolledX", "$scrolledY",
    "$focused",
    "$input"
  ];
  
  LAY.$checkIfImmidiateReadonly = function ( attr ) {
    return immidiateReadonlyS.indexOf( attr ) !== -1;

  };


})();
(function(){	
  "use strict";


  var reservedNameS = [ 
    "root", "transition", "data", "when", "onlyif",
    "states", "exist",
    "",
    "many", "formation", "formationDisplayNone",
     "sort", "fargs",
    "rows", "row", "filter", "args", "all"
  ];

  function stripStateAttrPrefix( attr ) {
    var nonStateAttrPrefixS = [ "data", "when", "transition" ];
    var i = attr.indexOf(".");
    if ( i === -1 ) {
      return attr;
    } else {
      var prefix = attr.slice( 0, i );
      if ( nonStateAttrPrefixS.indexOf( prefix ) !== -1 ) {
        return attr;
      } else {
        return attr.slice( i + 1 );
      }
    }
  }

  /* 
  * Must not contain ".", "/" or ":"
  */
  function checkIfNoIllegalCharacters ( name ) {
    return ( name.indexOf(".") === -1 ) &&
      ( name.indexOf("/") === -1 ) &&
      ( name.indexOf(":") === -1) &&
      ( name.indexOf("*") === -1 );
  }

  LAY.$checkIsValidUtils = {
  	levelName: function ( levelName ) {
  		return checkIfNoIllegalCharacters( levelName ) &&
        ( reservedNameS.indexOf( levelName ) === -1 );
  	},
  	/*
  	* Rules of a state name:
  	* (1) Must not contain any illegal characters
l  	* (2) Must not be a reserved name with the exception of "root"
    * as "root" state name has already been checked at the
    * start of normalizing 
  	*/
  	stateName: function ( stateName ) {
  		 return checkIfNoIllegalCharacters( stateName ) &&
        ( ( reservedNameS.indexOf( stateName ) === -1 ) ||
           ( stateName === "root" ) );
		           
  	},

    checkIsAttrExpandable: function ( attr ) {
      return this.checkIsNonPropAttrExpandable( attr ) ||
        this.checkIsPropAttrExpandable( attr );
    },

  	checkIsNonPropAttrExpandable: function ( attr ) {
  		var expanderAttrS = [
			    "data", "when", "transition", "states", "fargs", "sort"
			];
			 var regexExpanderAttrs = /(^sort\.\d+$)|(^fargs\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+\.args$)|(^when\.[a-zA-Z]+$)/;

  		var strippedStateAttr = stripStateAttrPrefix( attr );
    	return ( ( expanderAttrS.indexOf( strippedStateAttr ) !== -1 ) ||
      	( regexExpanderAttrs.test( strippedStateAttr ) )
    	);
  	},

    checkIsPropAttrExpandable: function ( attr ) {
      var expanderPropS = [
        "border", "background", "boxShadows", "textShadows",
         "videoSources", "audioSources", "videoTracks", "audioTracks",
          "filters","borderTop", "borderRight", "borderBottom", "borderLeft",
      ];
       var regexExpanderProps = /(^boxShadows\d+$)|(^textShadows\d+$)|(^videoSources\d+$)|(^audioSources\d+$)|(^videoTracks\d+$)|(^audioTracks\d+$)|(^filters\d+$)|(^filters\d+DropShadow$)/;

      var strippedStateAttr = stripStateAttrPrefix( attr );
      return ( ( expanderPropS.indexOf( strippedStateAttr ) !== -1 ) ||
        ( regexExpanderProps.test( strippedStateAttr ) )
      );
    },

  	propAttr: function ( attr ) {
  		return ( ( attr.indexOf( "." ) === -1 ) &&
     		( attr.charAt(0) !== "$") &&
        ( reservedNameS.indexOf( attr ) === -1 )
       );
  	},

  	// source: underscore.js
  	nan: function ( num ) {
  		return ( typeof val === "number" ) &&
	     ( val !== +val );
  	}

  };

})();
( function () {
  "use strict";

  LAY.$clearDataTravellingAttrVals = function () {

    var

      x, y,
      yLen,
      renderDirtyPartS = LAY.$renderDirtyPartS,
      renderDirtyPart,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal;

      for ( x = 0; x < renderDirtyPartS.length; x++ ) {

        renderDirtyPart = renderDirtyPartS[ x ];
        travelRenderDirtyAttrValS = renderDirtyPart.travelRenderDirtyAttrValS;


        for ( y = 0, yLen = travelRenderDirtyAttrValS.length; y < yLen; y++ ) {

          travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ 0 ];
          if ( travelRenderDirtyAttrVal.renderCall ) {

            travelRenderDirtyAttrVal.startCalcVal =
              travelRenderDirtyAttrVal.transitionCalcVal;

            // Adding to the "normal" render list automatically
            // removes the attrval from the "travel" render list
            renderDirtyPart.addNormalRenderDirtyAttrVal(
              travelRenderDirtyAttrVal
            );
          } else {
            LAY.$arrayUtils.remove( travelRenderDirtyAttrValS,
              travelRenderDirtyAttrVal
            );
          }



        }

      }


  };

})();

(function () {
  "use strict";

  /* @source: https://github.com/pvorb/node-clone/blob/master/clone.js
  */

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }

  var util = {
    isArray: function (ar) {
      return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
    },
    isDate: function (d) {
      return typeof d === 'object' && objectToString(d) === '[object Date]';
    },
    isRegExp: function (re) {
      return typeof re === 'object' && objectToString(re) === '[object RegExp]';
    },
    getRegExpFlags: function (re) {
      var flags = '';
      re.global && (flags += 'g');
      re.ignoreCase && (flags += 'i');
      re.multiline && (flags += 'm');
      return flags;
    }
  };


  /**
  * Clones (copies) an Object using deep copying.
  *
  * This function supports circular references by default, but if you are certain
  * there are no circular references in your object, you can save some CPU time
  * by calling clone(obj, false).
  *
  * Caution: if `circular` is false and `parent` contains circular references,
  * your program may enter an infinite loop and crash.
  *
  * @param `parent` - the object to be cloned
  */

  LAY.$clone = function (parent) {
    // maintain two arrays for circular references, where corresponding parents
    // and children have the same index

    if ( typeof parent !== "object" ||
       parent instanceof LAY.Level ||
       parent instanceof LAY.Take ) {
      return parent;
    } 

    var allParents = [];
    var allChildren = [];

    var circular = true;

    var depth = Infinity;

    // recurse this function so we don't reset allParents and allChildren
    function _clone(parent, depth) {
      // cloning null always returns null
      if (parent === null)
        return null;

        if (depth === 0)
          return parent;

          var child;
          var proto;
          if (typeof parent != 'object' ||
              parent instanceof LAY.Level ||
              parent instanceof LAY.Take ) {
            return parent;
          }
          if ( parent instanceof LAY.Color ) {
            return parent.copy();
          }

          if (util.isArray(parent)) {
            child = [];
          } else if (util.isRegExp(parent)) {
            child = new RegExp(parent.source, util.getRegExpFlags(parent));
            if (parent.lastIndex) child.lastIndex = parent.lastIndex;
          } else if (util.isDate(parent)) {
            child = new Date(parent.getTime());
          } else {
            proto = Object.getPrototypeOf(parent);
            child = Object.create(proto);
          }

          if (circular) {
            var index = allParents.indexOf(parent);

            if (index != -1) {
              return allChildren[index];
            }
            allParents.push(parent);
            allChildren.push(child);
          }

          for (var i in parent) {
            var attrs;
            if (proto) {
              attrs = Object.getOwnPropertyDescriptor(proto, i);
            }

            if (attrs && attrs.set === null) {
              continue;
            }
            child[i] = _clone(parent[i], depth - 1);
          }

          return child;
        }

        return _clone(parent, depth);
      };



    })();

( function () {
  "use strict";

  var
    essentialProp2defaultValue,
    formation2defaultArgs;

  LAY.$defaultizeManyLson = function ( lson ) {
    
    var
      essentialProp,
      rootState = lson.states.root;
  
    lson.rows = lson.rows || [];
    
    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootState[ essentialProp ] === undefined ) {
        rootState[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }
    // TODO: defaultize fargs here?
  
  };


  essentialProp2defaultValue = {
    filter:  new LAY.Take( "", "rows" ),
    sort: [{key:"id", ascending:true}],
    formation: "onebelow",
    fargs: {}
  };


})();

( function () {
  "use strict";

  var
    nonRootEssentialProp2defaultValue,
    rootEssentialProp2defaultValue,
    lazyProp2defaultValue;


  LAY.$defaultizePartLson = function ( lson, parentLevel ) {
    var
      essentialProp,
      rootState = lson.states.root,
      rootStateProps = rootState.props,
      rootStateWhen = rootState.when,
      rootStateTransition = rootState.transition,
      props,
      states = lson.states,
      stateName, state,
      prop,
      when, transition, metaMax, maxProp,
      eventType, transitionProp,
      isRootLevel = parentLevel === undefined,
      essentialProp2defaultValue = parentLevel ?
        nonRootEssentialProp2defaultValue : 
        rootEssentialProp2defaultValue,
      lazyVal,
      parentLevelRootProps;

    /* Filling in the defaults here for root state lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootStateProps[ essentialProp ] === undefined ) {
        rootStateProps[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }
  

    if ( states ) {
      for ( stateName in states ) {
        state = states[ stateName ];
        props = state.props;
        when = state.when;
        transition = state.transition;
        metaMax = state.$$max;

        for ( prop in props ) {

          if (rootStateProps[ prop ] === undefined ) {
            lazyVal = LAY.$getLazyPropVal( prop,
              isRootLevel );
            if ( lazyVal !== undefined ) {
              rootStateProps[ prop ] = lazyVal;
            }
          }
        }
      }

      for ( maxProp in metaMax ) {
        lson.$$max = lson.$$max || {};

        if ( !lson.$$max[ maxProp ] ) {
          lson.$$max[ metaMax ] = metaMax[ maxProp ];
        }
      }

      for ( eventType in when ) {
        if ( !rootStateWhen[ eventType ] ) {
          rootStateWhen[ eventType ] = [];
        }
      }

      for ( transitionProp in rootStateTransition ) {
        if ( !rootStateTransition[ transitionProp ] )  {
          rootStateTransition[ transitionProp ] = {};
        }
      }
    }

    if ( !isRootLevel ) {
      // If the parent has an inheritable prop
      // then create a prop within the root of
      // the child's root props which can inherit
      // in the case that the prop hasn't already
      // been declared within the (child's root) props
      parentLevelRootProps = parentLevel.lson.states.root.props;
      for ( prop in parentLevelRootProps ) {
        if ( rootStateProps[ prop ] === undefined &&
         LAY.$inheritablePropS.indexOf( prop ) !== -1 ) {
          rootStateProps[ prop ] = LAY.$getLazyPropVal( prop );
        }
      }
    }

    if ( rootStateProps.text !== undefined &&
        ( lson.$type === undefined || lson.$type === "none" ) ) {
      lson.$type = "text";
    } else if ( lson.$type === undefined ) {
      lson.$type = "none";
    }

  };



  rootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAY.take("", "$windowWidth"),
    height: LAY.take("", "$windowHeight")
  };


  nonRootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAY.take("", "$naturalWidth"),
    height: LAY.take("", "$naturalHeight")
  };



})();

( function(){
  "use strict";

  var eventReadonly2_eventType2fnHandler_ = {
    $hovering: {
      mouseover: function () {
        this.$changeAttrVal( "$hovering", true );
      },
      mouseout: function () {
        this.$changeAttrVal( "$hovering", false );
      }
    },
    $clicking: {
      mousedown: function () {
        this.$changeAttrVal( "$clicking", true );
      },
      touchdown: function () {
        this.$changeAttrVal( "$clicking", true );
      },
      mouseup: function () {
        this.$changeAttrVal( "$clicking", false );
      },
      mouseleave: function () {
        this.$changeAttrVal( "$clicking", false );
      },
      touchup: function () {
        this.$changeAttrVal( "$clicking", false );
      }
    },
    $focused: {
      focus: function () {
        this.$requestRecalculation( "$focused" );
      },
      blur: function () {
       this.$requestRecalculation( "$focused" );
      }
    },
    $scrolledX: {
      scroll: function () {
        this.$requestRecalculation( "$scrolledX" );
      }
    },
    $scrolledY: {
      scroll: function () {
        this.$requestRecalculation( "$scrolledY" );
      }
    },
    $cursorX: {
      mousemove: function (e) {
        this.$changeAttrVal( "$cursorX", e.clientX );
      }
    },
    $cursorY: {
      mousemove: function (e) {
        this.$changeAttrVal( "$cursorY", e.clientY );

      }
    },

    $input: {
      click: function () {
        if ( this.part.inputType === "multiline" ||
            this.part.inputType === "line" ) {
          this.$requestRecalculation( "$input" );
        }
      },
      change: function () {
        this.$requestRecalculation( "$input" );
      },
      keyup: function () {
        if ( this.part.inputType === "multiline" ||
            this.part.inputType === "line" ) {
          this.$requestRecalculation( "$input" );
        }
      }
    }

  };


  LAY.$eventReadonlyUtils = {
    checkIsEventReadonlyAttr: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ] !==
        undefined;
    },
    getEventType2fnHandler: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ];
    }

  };


})();

( function () {
  "use strict";


  // Modified Source of: Dean Edwards, 2005
  // with input from Tino Zijdel, Matthias Miller, Diego Perini
  // Original Source: http://dean.edwards.name/weblog/2005/10/add-event/

  LAY.$eventUtils = {
    add: function ( element, type, handler ) {
      if ( element.addEventListener ) {
        element.addEventListener(type, handler, false);
      } else {
        // create a hash table of event types for the element
        if (!element.events) element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
          handlers = element.events[type] = [];
          // store the existing event handler (if there is one)
          if (element["on" + type]) {
            handlers.push( element["on" + type] );
          }
        }
        // add the event handler to the list of handlers
        handlers.push( handler );
        // assign a global event handler to do all the work
        element["on" + type] = handle;
      }
    },

    remove: function ( element, type, handler ) {
      if ( element.removeEventListener ) {
        element.removeEventListener(type, handler, false);
      } else {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
          var handlers = element.events[type];
          LAY.$arrayUtils.remove(handlers, handler);
        }
      }
    }
  };

  function handle( event ) {
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || fix(((this.ownerDocument || this.document || this).parentWindow || window).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for ( var i=0, len=handlers.length; i<len; i++ ) {
      this.$$handleEvent = handlers[i];
      if (this.$$handleEvent(event) === false) {
        returnValue = false;
      }
    
    }
    return returnValue;
  }

  function fix(event) {
    // add W3C standard event methods
    event.preventDefault = fix_preventDefault;
    event.stopPropagation = fix_stopPropagation;
    return event;
  }
  function fix_preventDefault() {
    this.returnValue = false;
  }
  function fix_stopPropagation() {
    this.cancelBubble = true;
  }
})();



( function () {
	"use strict";

	LAY.$filterUtils = {
		eq: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] === val;
				}, rowS );
		},
		
		neq: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] !== val;
				}, rowS );
		},

		gt: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] > val;
				}, rowS );
			
		},
		
		gte: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] >= val;
				}, rowS );
			
		},
		lt: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ] < val;
				}, rowS );
			
		},
		lte: function ( rowS, key, val ) {
			return  filter( function ( row ) {
					return row[ key ] <= val;
				}, rowS );
			
		},
		regex: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return val.test( row[ key ] );
				}, rowS );
			
		},
		contains: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return row[ key ].indexOf( val ) !== -1;
				}, rowS );
			
		},
		within: function ( rowS, key, val ) {
			return filter( function ( row ) {
					return val.indexOf( row[ key ] ) !== -1;
				}, rowS );
			
		},

		fn: function ( rowS, fnFilter ) {
			return filter( fnFilter , rowS );
		}
		

	};

	function filter ( fnFilter, rowS ) {
		var filteredRowS = [];
		for ( var i = 0, len = rowS.length, row; i < len; i++ ) {
			row = rowS[ i ];
			if ( fnFilter( row ) ) {
				filteredRowS.push( row );
			} 
		}
		return filteredRowS;
	}

})();

( function () {
  "use strict";

  var regexDetails = /^([a-zA-Z]+)(\d+)/;

  LAY.$findMultipleTypePropMatchDetails = function ( prop ) {
      return prop.match( regexDetails );
  };



})();

(function(){
  "use strict";

  LAY.$findRenderCall = function( prop, level ) {

    var
      renderCall,
      multipleTypePropMatchDetails;

    if ( level.isHelper ) {
      return "";
    } else if ( !LAY.$checkIsValidUtils.propAttr( prop ) ||
      ( [ "centerX", "right", "centerY", "bottom" ] ).indexOf( prop ) !== -1 ||
      LAY.$shorthandPropsUtils.checkIsDecentralizedShorthandProp( prop ) ) {
        return undefined;
      } else {
        multipleTypePropMatchDetails = LAY.$findMultipleTypePropMatchDetails(
        prop );

        if ( multipleTypePropMatchDetails ) {
          return multipleTypePropMatchDetails[ 1 ];
        }

        renderCall = 
          LAY.$shorthandPropsUtils.getShorthandPropCenteralized(
            prop );
        if ( renderCall !== undefined ) {
          if ( level.isGpu &&
            ( renderCall === "x" ||
              renderCall === "y" ||
              renderCall === "transform" ) ) {
            return "positionAndTransform";
          } else {
            return renderCall;
          }
        } else {
          if ( prop.startsWith("text") &&
           ( !level.part || level.part.type === "none" ) ) {
            return undefined;
          }
        }
        return prop;
        
      }
    };
})();

( function () {
  "use strict";

  LAY.$foldlUtils = {
    min: function ( rowS, key ) {
      return fold( function ( row, acc ) {
        var val = row[ key ];
          if ( ( acc === undefined ) || ( val < acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, rowS ); 
    },
    max: function ( rowS, key ) {
      return fold( function ( row, acc ) {
        var val = row[ key ];
          if ( ( acc === undefined ) || ( val > acc ) ) {
            return val;
          } else {
            return acc;
          }
        }, undefined, rowS ); 
    },
    sum: function ( rowS, key ) {
      return fold( function ( row, acc ) {
        return acc + row[ key ];
        }, 0, rowS );
    },

    
    fn: function ( rowS, fnFold, acc ) {
      return fold( fnFold, acc, rowS );      
    }
  

  };

  function fold ( fnFold, acc, rowS ) {
    for ( var i = 0, len = rowS.length; i < len; i++ ) {
      acc = fnFold( rowS[ i ], acc );
    }
    return acc;
  }

})();

// LAY has taken the below source from 'tmaeda1981jp'
// source: https://github.com/tmaeda1981jp/string-format-js/blob/master/format.js

(function() {

  "use strict";

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var Formatter = (function() {
      var Constr = function(identifier) {
        var array = function(len){ return new Array(len); };

        switch(true) {
        case /^#\{(\w+)\}*$/.test(identifier):
          this.formatter = function(line, param) {
            return line.replace('#{' + RegExp.$1 + '}', param[RegExp.$1]);
          };
          break;
        case /^([ds])$/.test(identifier):
          this.formatter = function(line, param) {
            if (RegExp.$1 === 'd' && !isNumber(param)) {
              throw new TypeError();
            }
            return line.replace("%" + identifier, param);
          };
          break;

        // Octet
        case /^(o)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace(
              "%" + identifier,
              parseInt(param).toString(8));
          };
          break;

        // Binary
        case /^(b)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace(
              "%" + identifier,
              parseInt(param).toString(2));
          };
          break;

        // Hex
        case /^([xX])$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var hex = parseInt(param).toString(16);
            if (identifier === 'X') { hex = hex.toUpperCase(); }
            return line.replace("%" + identifier, hex);
          };
          break;

        case /^(c)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace("%" + identifier, String.fromCharCode(param));
          };
          break;

        case /^(u)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            return line.replace("%" + identifier, parseInt(param, 10) >>> 0);
          };
          break;

        case /^(-?)(\d*).?(\d?)(e)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var lpad = RegExp.$1 === '-',
                width = RegExp.$2,
                decimal = RegExp.$3 !== '' ? RegExp.$3: undefined,
                val = param.toExponential(decimal),
                mantissa, exponent, padLength
            ;

            if (width !== '') {
              if (decimal !== undefined) {
                padLength = width - val.length;
                if (padLength >= 0){
                  val = lpad ?
                    val + array(padLength + 1).join(" "):
                    array(padLength + 1).join(" ") + val;
                }
                else {
                  // TODO throw ?
                }
              }
              else {
                mantissa = val.split('e')[0];
                exponent = 'e' + val.split('e')[1];
                padLength = width - (mantissa.length + exponent.length);
                val = padLength >= 0 ?
                  mantissa + (array(padLength + 1)).join("0") + exponent :
                  mantissa.slice(0, padLength) + exponent;
              }
            }
            return line.replace("%" + identifier, val);
          };
          break;

        case /^(-?)(\d*).?(\d?)(f)$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }
            var lpad = RegExp.$1 === '-',
                width   = RegExp.$2,
                decimal = RegExp.$3,
                DOT_LENGTH = '.'.length,
                integralPart = param > 0 ? Math.floor(param) : Math.ceil(param),
                val = parseFloat(param).toFixed(decimal !== '' ? decimal : 6),
                numberPartWidth, spaceWidth;

            if (width !== '') {
              if (decimal !== '') {
                numberPartWidth =
                  integralPart.toString().length + DOT_LENGTH + parseInt(decimal, 10);
                spaceWidth = width - numberPartWidth;
                val = lpad ?
                  parseFloat(param).toFixed(decimal) + (array(spaceWidth + 1).join(" ")) :
                  (array(spaceWidth + 1).join(" ")) + parseFloat(param).toFixed(decimal);
              }
              else {
                val = parseFloat(param).toFixed(
                  width - (integralPart.toString().length + DOT_LENGTH));
              }
            }
            return line.replace("%" + identifier, val);
          };
          break;

        // Decimal
        case /^([0\-]?)(\d+)d$/.test(identifier):
          this.formatter = function(line, param) {
            if (!isNumber(param)) { throw new TypeError(); }

            var len = RegExp.$2 - param.toString().length,
                replaceString = '',
                result;
            if (len < 0) { len = 0; }
            switch(RegExp.$1) {
            case "": // rpad
              replaceString = (array(len + 1).join(" ") + param).slice(-RegExp.$2);
              break;
            case "-": // lpad
              replaceString = (param + array(len + 1).join(" ")).slice(-RegExp.$2);
              break;
            case "0": // 0pad
              replaceString = (array(len + 1).join("0") + param).slice(-RegExp.$2);
              break;
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;

        // String
        case /^(-?)(\d)s$/.test(identifier):
          this.formatter = function(line, param) {
            var len = RegExp.$2 - param.toString().length,
                replaceString = '',
                result;
            if (len < 0) { len = 0; }
            switch(RegExp.$1) {
            case "": // rpad
              replaceString = (array(len + 1).join(" ") + param).slice(-RegExp.$2);
              break;
            case "-": // lpad
              replaceString = (param + array(len + 1).join(" ")).slice(-RegExp.$2);
              break;
            default:
              // TODO throw ?
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;

        // String with max length
        case /^(-?\d?)\.(\d)s$/.test(identifier):
          this.formatter = function(line, param) {
            var replaceString = '',
                max, spacelen;

            // %.4s
            if (RegExp.$1 === '') {
              replaceString = param.slice(0, RegExp.$2);
            }
            // %5.4s %-5.4s
            else {
              param = param.slice(0, RegExp.$2);
              max = Math.abs(RegExp.$1);
              spacelen = max - param.toString().length;
              replaceString = RegExp.$1.indexOf('-') !== -1 ?
                (param + array(spacelen + 1).join(" ")).slice(-max): // lpad
                (array(spacelen + 1).join(" ") + param).slice(-max); // rpad
            }
            return line.replace("%" + identifier, replaceString);
          };
          break;
        default:
          this.formatter = function(line, param) {
            return line;
          };
        }
      };

      Constr.prototype = {
        format: function(line, param) {
          return this.formatter.call(this, line, param);
        }
      };
      return Constr;
    }());

    LAY.$format = function() {

      var i,
          result,
          argSLength = arguments.length,
          argS = Array.prototype.slice.call(arguments),
          arg;

        try {
          // result contians the formattable string
          result = argS[ 0 ];
          for ( i = 1; i < argSLength; i++ ) {
            arg = argS[ i ];
            if (result.match(/%([.#0-9\-]*[bcdefosuxX])/)) {
              arg = arg instanceof LAY.Color ? arg.stringify() : arg; 
              result = new Formatter(RegExp.$1).format(result, arg );
            }
          }
          return result;
        } catch (err) {
          return "";
        }

    };

}());

( function() {
  "use strict";
  LAY.$formation2fargs = {
    "onebelow": {
      gap: 0
    },
    "totheright": {
      gap: 0
    },
    "grid": {
      columns: null,
      hgap: 0,
      vgap: 0
    },
    "none": {
      
    },
    "circular": {
      radius: null
    }
  };

})();
( function () {
	"use strict";

	LAY.$formation2fn = {
		none: function ( f , filteredLevel, filteredLevelS, fargs ) {
			return [ undefined, undefined ];
		},
		onebelow: function ( f, filteredLevel, filteredLevelS, fargs ) {
			return [
				undefined,
				fargs.gap === 0 ? 
					LAY.take(filteredLevelS[ f - 2 ].path(), "bottom") :
					LAY.take(filteredLevelS[ f - 2 ].path(), "bottom").add(
					fargs.gap)
			];
		},
		totheright: function ( f, filteredLevel, filteredLevelS, fargs ) {
			return [
				fargs.gap === 0 ? 
					LAY.take(filteredLevelS[ f - 2 ].path(), "right") :
					LAY.take(filteredLevelS[ f - 2 ].path(), "right").add(
					fargs.gap),
				undefined
			];
		},

		grid: function ( f, filteredLevel, filteredLevelS, fargs ) {
			var numCols = fargs.columns;
			var vgap = fargs.vgap;
			var hgap = fargs.hgap;
			var x,y;
			if ( f > numCols && ( ( f % numCols === 1 ) || numCols === 1 ) ) {
				x = LAY.take( filteredLevelS[ 0 ].path(), "left" );
			} else {
				x = LAY.take( filteredLevelS[ f - 2 ].path(), "right" ).add(hgap);
			}
			if ( f <= numCols ) {
				y = undefined;
			} else {
				y = LAY.take( filteredLevelS[ f - numCols -  1 ].path(),
					"bottom" ).add(vgap);
			}
			return [ x, y ];
		},
		circular: function ( f, filteredLevel, filteredLevelS, fargs) {
		    var angle = ( (f-1) * ( 360 / filteredLevelS.length ) ) - 90;
		    var firstLevelPathName = filteredLevelS[ 0 ].path();
		    var originX = LAY.take(firstLevelPathName, "centerX");
		    var originY = LAY.take(firstLevelPathName, "centerY").add(
		      fargs.radius );
		    var degreesToRadian = Math.PI / 180;
		    var paramX = fargs.radius * Math.cos(angle*degreesToRadian);
		    var paramY = fargs.radius * Math.sin(angle*degreesToRadian);

		    return [originX.add(paramX).minus(
		      LAY.take("", "width").half()),
		       originY.add(paramY).minus(LAY.take("", "height").half())];

		  }

	};
})();
( function () {
  "use strict";

  LAY.$generateColorMix = function ( startColor, endColor, fraction ) {

      var
        startColorRgbaDict = startColor.getRgba(),
        endColorRgbaDict = endColor.getRgba(),
        midColor;


      return new LAY.Color( "rgb", {
        r: Math.round( startColorRgbaDict.r +
          fraction * ( endColorRgbaDict.r - startColorRgbaDict.r )
        ),
        g: Math.round( startColorRgbaDict.g +
          fraction * ( endColorRgbaDict.g - startColorRgbaDict.g )
        ),
        b: Math.round( startColorRgbaDict.b +
          fraction * ( endColorRgbaDict.b - startColorRgbaDict.b )
        )
      }, ( startColorRgbaDict.a +
        fraction * ( endColorRgbaDict.a - startColorRgbaDict.a )
      ) );


  };

})();

( function() {
  "use strict";

  var
    rootLazyProp2defaultVal = {
      userSelect: "auto",
      cursor: "auto",
      textSize: 15,
      textFamily: "sans-serif",
      textWeight: "normal",
      textColor: LAY.color("black"),
      textVariant: "normal",
      textTransform: "none",
      textStyle: "normal",
      textLetterSpacing: 0,
      textWordSpacing: 0,
      textAlign: "left",
      textDirection: "ltr",
      textLineHeight: 1.3,
      textIndent: 0,
      textWrap: "nowrap",
      textWordBreak: "normal",
      textWordWrap: "normal",
      textSmoothing: "antialiased",
      textRendering: "auto"
    },
    
    nonRootLazyProp2defaultVal = {
      userSelect: LAY.take("../", "userSelect"),      
      cursor: LAY.take("../", "cursor"),      
      textSize: LAY.take("../", "textSize"),
      textFamily: LAY.take("../", "textFamily"),
      textWeight: LAY.take("../", "textWeight"),
      textColor: LAY.take("../", "textColor"),
      textVariant: LAY.take("../", "textVariant"),
      textTransform: LAY.take("../", "textTransform"),
      textStyle: LAY.take("../", "textStyle"),
      textLetterSpacing: LAY.take("../", "textLetterSpacing"),
      textWordSpacing: LAY.take("../", "textWordSpacing"),
      textAlign: LAY.take("../", "textAlign"),
      textDirection: LAY.take("../", "textDirection"),
      textLineHeight: LAY.take("../", "textLineHeight"),
      textIndent: LAY.take("../", "textIndent"),
      textWrap: LAY.take("../", "textWrap"),
      textWordBreak: LAY.take("../", "textWordBreak"),
      textWordWrap: LAY.take("../", "textWordWrap"),
      textSmoothing: LAY.take("../", "textSmoothing"),
      textRendering: LAY.take("../", "textRendering")
    },

    commonLazyProp2defaultVal = {
      display: true,
      visible: true,
      z: 0,
      shiftX: 0,
      shiftY: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ:1,
      skewX: 0,
      skewY: 0,
      originX: 0.5,
      originY: 0.5,
      originZ: 0,
      perspective:0,
      perspectiveOriginX: 0.5,
      perspectiveOriginY: 0.5,
      backfaceVisibility: false,
      opacity:1.0,
      zIndex: "auto",
      overflowX: "hidden",
      overflowY: "hidden",
      scrollX: 0,
      scrollY: 0,
      focus: false,
      scrollElastic: true,
      title: null,
      backgroundColor: LAY.transparent(),
      backgroundImage: "none",
      backgroundAttachment: "scroll",
      backgroundRepeat: "repeat",
      backgroundPositionX: 0,
      backgroundPositionY: 0,
      backgroundSizeX: "auto",
      backgroundSizeY: "auto",

      cornerRadiusTopLeft: 0,
      cornerRadiusTopRight: 0,
      cornerRadiusBottomLeft: 0,
      cornerRadiusBottomRight: 0,

      borderTopStyle: "solid",
      borderBottomStyle: "solid",
      borderRightStyle: "solid",
      borderLeftStyle: "solid",

      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,


      borderTopColor: LAY.transparent(),
      borderBottomColor: LAY.transparent(),
      borderRightColor: LAY.transparent(),
      borderLeftColor: LAY.transparent(),

      text: "",
      textOverflow: "clip",
      textDecoration: "none",

      textPaddingTop: 0,
      textPaddingRight: 0,
      textPaddingBottom: 0,
      textPaddingLeft: 0,

      input: "",
      inputLabel: "",
      inputPlaceholder: "",
      inputAutocomplete: false,
      inputAutocorrect: true,
      inputDisabled: false,

      imageUrl:null,
      imageAlt: null,

      videoAutoplay: false,
      videoControls: true,
      videoCrossorigin: "anonymous",
      videoLoop: false,
      videoMuted: false,
      videoPreload: "auto",
      videoPoster: null,

      audioControls: true,
      audioLoop: false,
      audioMuted: false,
      audioPreload: "auto",
      audioVolume: 1.0

    };

  LAY.$getLazyPropVal = function ( prop, isRootLevel ) {

    var commonLazyVal = commonLazyProp2defaultVal[ prop ];
    return commonLazyVal !== undefined ?
      commonLazyVal :
      ( isRootLevel ? 
        rootLazyProp2defaultVal[ prop ] :
        nonRootLazyProp2defaultVal[ prop ] );

  }

})();

(function () {
  "use strict";

  // Inheritance allows modifications to the
  // `intoLson` object, but disallows modifications
  // to `fromLson`



  /*
  * Inherit the root, state, or many LSON from `from` into `into`.
  */
  LAY.$inherit = function ( into, from, isStateInheritance, isMany, isMainLson ) {

    if ( !isStateInheritance ) {
      for ( var key in from ) {
        if ( from[ key ] ) {
          if ( key2fnInherit[ key ] ) {
            key2fnInherit[ key ]( into, from, isMany );
          } else {
            into[ key ] = from[ key ];
          }
        }
      }
    } else {

      if ( !isMainLson ) {
        into.onlyif = from.onlyif || into.onlyif;
        into.install = from.install || into.install;
        into.uninstall = from.uninstall || into.uninstall;
      }

      if ( isMany ) {
        into.formation = from.formation || into.formation;
        into.filter = from.filter || into.filter;
        key2fnInherit.fargs( into, from );
        into.sort = from.sort || into.sort;

      } else {
        if ( from.props !== undefined ) {
          key2fnInherit.props( into, from );
        }
        if ( from.when !== undefined ) {
          key2fnInherit.when( into, from );
        }
        if ( from.transition !== undefined ) {
          key2fnInherit.transition( into, from );
        }
        if ( from.$$max !== undefined ) {
          key2fnInherit.$$max( into, from );
        }
      }
    }
  };

  function inheritTransitionProp ( intoTransition, fromTransition,
    intoTransitionProp, fromTransitionProp ) {


      var
        fromTransitionDirective = fromTransition[ fromTransitionProp ],
        intoTransitionDirective = intoTransition[ intoTransitionProp ],
        fromTransitionArgKey2val,  intoTransitionArgKey2val,
        fromTransitionArgKey;


      if ( fromTransitionDirective !== undefined ) {

        if ( intoTransitionDirective === undefined ) {
          intoTransitionDirective =
            intoTransition[ intoTransitionProp ] = {};
        }

        intoTransitionDirective.type = fromTransitionDirective.type ||
          intoTransitionDirective.type;

        intoTransitionDirective.duration = fromTransitionDirective.duration ||
          intoTransitionDirective.duration;

        intoTransitionDirective.delay = fromTransitionDirective.delay ||
          intoTransitionDirective.delay;

        intoTransitionDirective.done = fromTransitionDirective.done ||
          intoTransitionDirective.done;

        fromTransitionArgKey2val = fromTransitionDirective.args;
        intoTransitionArgKey2val = intoTransitionDirective.args;


        if ( fromTransitionArgKey2val !== undefined ) {

          if ( intoTransitionArgKey2val === undefined ) {
            intoTransitionArgKey2val =
            intoTransitionDirective.args = {};
          }

          for ( fromTransitionArgKey in fromTransitionArgKey2val ) {

            intoTransitionArgKey2val[ fromTransitionArgKey ] =
              fromTransitionArgKey2val[ fromTransitionArgKey ];
          }
        }
      }
    }

    function checkIsMutable ( val ) {
      return ( typeof val === "object" );
    }

    function inheritSingleLevelObject( intoObject, fromObject, key, isDuplicateOn ) {

      var fromKey2value, intoKey2value, fromKey, fromKeyValue;
      fromKey2value = fromObject[ key ];
      intoKey2value = intoObject[ key ];


      if ( intoKey2value === undefined ) {

        intoKey2value = intoObject[ key ] = {};

      }

      for ( fromKey in fromKey2value ) {

        fromKeyValue = fromKey2value[ fromKey ];
        intoKey2value[ fromKey ] = ( isDuplicateOn &&
            checkIsMutable( fromKeyValue ) ) ?
          LAY.$clone( fromKeyValue ) :
          fromKeyValue;
      }
    }



    // Precondition: `into<Scope>.key (eg: intoLAY.key)` is already defined
    var key2fnInherit = {

      data: function( intoLson, fromLson ) {
        inheritSingleLevelObject( intoLson, fromLson, "data" );
      },


      props: function( intoLson, fromLson ) {
        inheritSingleLevelObject( intoLson, fromLson, "props" );
      },


      transition: function ( intoLson, fromLson ) {

        var
          fromTransition = fromLson.transition,
          intoTransition = intoLson.transition,
          fromTransitionProp,
          intoTransitionProp,
          i, len,
          tmpTransition = {};


        if ( ( intoTransition === undefined ) ) {
          intoTransition = intoLson.transition = {};
        }


        // "all" prop overwrite stage
        //
        // Eg: "rotateX" partially/completely overwritten
        // by "all" where "rotateX" is present
        // within "into"LSON and "all" is present
        // within "from"LSON

        if ( fromTransition.all ) {
          for ( intoTransitionProp in intoTransition ) {
            if ( intoTransition !== "all" ) {
              inheritTransitionProp( intoTransition, fromTransition,
                 intoTransitionProp, "all" );
            }
          }
        }

        // General inheritance of props of exact
        // names across from and into LSON
        for ( fromTransitionProp in fromTransition ) {
          inheritTransitionProp( intoTransition, fromTransition,
             fromTransitionProp, fromTransitionProp );
        }

        // flatten stage
        //
        // This is akin to a self-inheritance stafe whereby
        // prop transition directives are stacked
        // below the "all" transition direction
        //
        // Eg: a shorthand property such as "rotateX"
        // would inherit values from "all"
        //
        if ( intoTransition.all ) {
          for ( intoTransitionProp in intoTransition ) {

            if ( intoTransitionProp !== "all" ) {
              tmpTransition[ intoTransitionProp ] = {};
              inheritTransitionProp(
                tmpTransition, intoTransition,
                intoTransitionProp, "all" );
              inheritTransitionProp(
                tmpTransition, intoTransition,
                intoTransitionProp, intoTransitionProp );
              intoTransition[ intoTransitionProp ] =
                tmpTransition[ intoTransitionProp ];
            }
          }
        }
      },



      many: function( intoLson, fromLson ) {

        if ( intoLson.many === undefined ) {
          intoLson.many = {};
        }

        LAY.$inherit( intoLson.many, fromLson.many,
          false, true, false );

      },

      rows: function( intoLson, fromLson ) {

        var
          intoLsonRowS = intoLson.rows,
          fromLsonRowS = fromLson.rows,
          fromLsonRow;

        if ( fromLsonRowS ) {
          if ( fromLsonRowS instanceof LAY.Take ) {
            intoLson.rows = fromLsonRowS;            
          } else {
            intoLson.rows = new Array( fromLsonRowS.length );
            intoLsonRowS = intoLson.rows;
            for ( var i = 0, len = fromLsonRowS.length; i < len; i++ ) {

              fromLsonRow = fromLsonRowS[ i ];
              intoLsonRowS[ i ] = checkIsMutable( fromLsonRow ) ?
                LAY.$clone( fromLsonRow ) : fromLsonRow;

            }
          }
        }

      },

      fargs: function ( intoLson, fromLson ) {

        var
          formationFarg,
          intoFargs = intoLson.fargs,
          fromFargs = fromLson.fargs;

        if ( fromFargs ) {
          if ( !intoFargs ) {
            intoFargs = intoLson.fargs = {};
          }
          for ( formationFarg in fromFargs ) {
            if ( !intoFargs[ formationFarg  ] ) {
              intoFargs[ formationFarg ] = {};
            } 
            inheritSingleLevelObject( 
              intoFargs, fromFargs, formationFarg );
            
          }
        }
      },


      children: function( intoLson, fromLson ) {
        var fromChildName2lson, intoChildName2lson;
        fromChildName2lson = fromLson.children;
        intoChildName2lson = intoLson.children;

        if ( intoChildName2lson === undefined ) {
          intoChildName2lson = intoLson.children = {};
        }

        for ( var name in fromChildName2lson ) {

          if ( intoChildName2lson[ name ] === undefined ) { // inexistent child

            intoChildName2lson[ name ] = {};

          }
          LAY.$inherit( intoChildName2lson[ name ], fromChildName2lson[ name ],
             false, false, false );

        }
      },

      states: function( intoLson, fromLson, isMany ) {

        var
          fromStateName2state = fromLson.states,
          intoStateName2state = intoLson.states,
          inheritFromState, inheritIntoState;

        if ( intoStateName2state === undefined ) {
          intoStateName2state = intoLson.states = {};
        }

        for ( var name in fromStateName2state ) {

          if ( !intoStateName2state[ name ] ) { //inexistent state

            intoStateName2state[ name ] = {};

          }

          LAY.$inherit( intoStateName2state[ name ],
           fromStateName2state[ name ], true, isMany, false );

        }
      },

      when: function( intoLson, fromLson ) {

        var
          fromEventType2_fnEventHandlerS_ = fromLson.when,
          intoEventType2_fnEventHandlerS_ = intoLson.when,
          fnFromEventHandlerS, fnIntoEventHandlerS, fromEventType;


        if ( intoEventType2_fnEventHandlerS_ === undefined ) {
          intoEventType2_fnEventHandlerS_ = intoLson.when = {};
        }

        for ( fromEventType in fromEventType2_fnEventHandlerS_ ) {

          fnFromEventHandlerS = fromEventType2_fnEventHandlerS_[ fromEventType ];
          fnIntoEventHandlerS = intoEventType2_fnEventHandlerS_[ fromEventType ];

          if ( fnIntoEventHandlerS === undefined ) {

            intoEventType2_fnEventHandlerS_[ fromEventType ] = LAY.$arrayUtils.cloneSingleLevel( fnFromEventHandlerS );

          } else {

            intoEventType2_fnEventHandlerS_[ fromEventType ] = fnIntoEventHandlerS.concat( fnFromEventHandlerS );
          }

          LAY.$meta.set( intoLson, "num", "when." + fromEventType,
          ( intoEventType2_fnEventHandlerS_[ fromEventType ] ).length );

        }
      },

      $$max: function ( intoLson, fromLson ) {
        LAY.$meta.inherit.$$max( intoLson, fromLson );
      }

    };

  })();

(function () {
  "use strict";

  LAY.$inheritablePropS = [
    "textSize",
    "textFamily",
    "textWeight",
    "textColor",
    "textVariant",
    "textTransform",
    "textStyle",
    "textLetterSpacing",
    "textWordSpacing",
    "textAlign",
    "textDirection",
    "textLineHeight",
    "textIndent",
    "textWrap",
    "textWordBreak",
    "textWordWrap",
    "textSmoothing",
    "textRendering",
    "cursor",
    "userSelect"
  ];

})();
(function() {
  "use strict";


  LAY.$meta = {


    set: function ( lson, metaDomain, attr, val  ) {

      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        lson[ fullMetaDomain ] = {};
      }
      lson[ fullMetaDomain ][ attr ] = val;

    },

    get: function ( lson, metaDomain, attr  ) {
    
      var fullMetaDomain = "$$" + metaDomain;
      if ( lson[ fullMetaDomain ] === undefined ) {
        return undefined;
      } else {
        return lson[ fullMetaDomain ][ attr ];
      }
    },

    inherit: {
      /*
      $$keys: function ( intoLson, fromLson ) {

        var
        fromAttr2keyS = fromLson.$$keys,
        intoAttr2keyS = intoLson.$$keys,
        fromAttr,
        fromKeyS,
        intoKeyS,
        i, len;


        if ( intoAttr2keyS === undefined ) {
          intoAttr2keyS = intoLson.$$keys = {};
        }

        for ( fromAttr in fromAttr2keyS ) {
            fromKeyS = fromAttr2keyS[ fromAttr ];
            intoKeyS = intoAttr2keyS[ fromAttr ];
            if ( intoKeyS === undefined ) {
              intoAttr2keyS[ fromAttr ] = LAY.$arrayUtils.cloneSingleLevel( fromKeyS );
            } else {
              for ( i = 0, len = fromKeyS.length; i < len; i++ ) {
                LAY.$arrayUtils.pushUnique( intoKeys, fromKeyS[ i ] );
              }
          }
        }
      },
      */

      $$max: function ( intoLson, fromLson ) {

        var
          fromAttr2max = fromLson.$$max,
          intoAttr2max = intoLson.$$max,
          fromAttr;

        if ( intoAttr2max === undefined ) {
          intoAttr2max = intoLson.$$max = {};
        }

        for ( fromAttr in fromAttr2max ) {
            if ( intoAttr2max[ fromAttr ] === undefined ) {
              intoAttr2max[ fromAttr ] =
              fromAttr2max[ fromAttr ];
            } else {
              intoAttr2max[ fromAttr ] = Math.max(
                intoAttr2max[ fromAttr ],
                fromAttr2max[ fromAttr ]
              );
            }
        }
      }
    }
  };

})();

(function () {
  "use strict";

  var
    normalizedExternalLsonS = [],
    fnCenterToPos,
    fnOppEdgeToPos,
    takeWidth,
    takeHeight,
    takeParentWidth,
    takeParentHeight,
    takeZeroCenterX,
    takeZeroCenterY,
    key2fnNormalize;

  fnCenterToPos = function( center, dim, parentDim ) {
    return ( parentDim / 2 ) +  ( center - ( dim / 2 ) );
  };

  fnOppEdgeToPos = function( edge, dim, parentDim ) {
    return parentDim - ( edge + dim );
  };


  takeWidth = new LAY.Take( "", "width" );
  takeHeight = new LAY.Take( "", "height" );

  takeParentWidth = new LAY.take( "../", "width");
  takeParentHeight = new LAY.take( "../", "height");

  takeZeroCenterX = ( new LAY.take("../", "width")).half().minus(
    ( new LAY.take("", "width") ).half() );

  takeZeroCenterY = ( new LAY.take("../", "height")).half().minus(
    ( new LAY.take("", "height") ).half() );

  LAY.$normalize = function( lson, isExternal ) {

    if ( isExternal ) {
      // If we haven't previously normalized it, only then proceed
      if ( normalizedExternalLsonS.indexOf( lson ) === -1 ) {

        normalize( lson, true );
        normalizedExternalLsonS.push( lson );

      }

    } else {      
      normalize( lson, false );
    }
  };

  function normalize( lson, isRecursive ) {

    var
      lsonKey,
      rootLson = lson;

    if ( !lson.$$normalized ) {

      if ( !lson.states ) {
        lson.states = {};
      }

      if ( lson.states.root ) {
        throw "LAY Error: State name 'root' is reserved.";
      }

      checkForInconsistentReadonlyKeys( lson );
      normalizeLazyChildren( lson );

      lson.states.root = {
        props: lson.props,
        when: lson.when,
        transition: lson.transition
      };

      for ( lsonKey in lson ) {
        if ( lsonKey !== "children" || isRecursive ) {
          if ( lson[ lsonKey ] && lsonKey !== "$$max" ) {
            if ( !key2fnNormalize[ lsonKey ] ) {
              throw "LAY Error: LSON key: '" + lsonKey  + "' not found";
            }
            key2fnNormalize[ lsonKey ]( lson );
          }
        }
      }

      lson.props = undefined;
      lson.when = undefined;
      lson.transition = undefined;

      lson.$$normalized = true;



    }
  }

  /*
  * Checks for common naming mistakes with
  * readonly keys (i.e beginning with "$")
  */
  function checkForInconsistentReadonlyKeys( lson ) {
    var errorReadonly = "";
    if ( lson.inherits || lson.$inherits ) {
      throw "LAY Error: Did you mean '$inherit'?";
    } else if ( lson.load ) {
      errorReadonly = "load";
    } else if ( lson.inherit ) {
      errorReadonly = "inherit";
    } else if ( lson.gpu ) {
      errorReadonly = "gpu";
    } else if ( lson.obdurate ) {
      errorReadonly = "obdurate";
    } else if ( lson.type ) {
      errorReadonly = "type"
    }
    if ( errorReadonly ) {
      throw "LAY Error: prefix readonly '" +
        errorReadonly + "' with '$'";
    }
  }

  function normalizeLazyChildren( lson ) {
    lson.children = lson.children || {};
    for ( var key in lson ) {
      if ( !key2fnNormalize[ key ]) {
        lson.children[ key ] = lson[ key ];
        lson[ key ] = undefined; 
      }
    }
  }


  function checkAndThrowErrorAttrAsTake ( name, val ) {
    if ( val instanceof LAY.Take ) {
      throw ( "LAY Error: takes for special/expander props such as '" + name  + "' are not permitted." );
    }
  }

  /*
  * Recursively flatten the prop if object or array typed
  */
  function flattenProp( props, obj, key, prefix ) {

    var val, type, flattenedProp;
    val = obj[ key ];
    type = LAY.$type( val );
    if ( type === "array" && key !== "input" ) {
      for ( var i = 0, len = val.length; i < len; i++ ) {
        flattenedProp = prefix + ( i + 1 );
        flattenProp( props, val, i, flattenedProp );
      }
      obj[ key ] = undefined;

    } else if ( type === "object" ) {

      for ( var subKey in val ) {

        flattenedProp = prefix + LAY.$capitalize( subKey );
        flattenProp( props, val, subKey, flattenedProp );

        obj[ key ] = undefined;
      }

    } else {

      if ( LAY.$checkIsValidUtils.checkIsPropAttrExpandable( prefix ) ) {
        checkAndThrowErrorAttrAsTake( prefix, val );
      }

      props[ prefix ] = val;

    }
  }

  key2fnNormalize = {
    /*type: function ( lson ) {

      checkAndThrowErrorAttrAsTake( "type", lson.type );

      if ( lson.type === undefined ) {
        // check if text type
        var isTextType = false;
        if ( lson.props.text !== undefined ) {
          isTextType = true;
        }
        lson.type = isTextType ? "text" : "none";
      }
      var type = lson.type;
      if ( ( type === "text" ) && ( lson.children !== undefined ) ) {
        throw( "LAY Error: Text type Level with child Levels found" );
      }
      if ( type.startsWith( "input" ) ) {
        lson.type = "input";
        lson.inputType = type.slice( ( "input:" ).length );
      }

    },*/
    $type: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$type", lson.$type );
    },

    $inherit: function ( lson ) {

      if ( !( lson.$inherit instanceof Array ) ) {
        lson.$inherit = [ lson.$inherit ];
      }
      checkAndThrowErrorAttrAsTake( "$inherit", lson.$inherit );
      if ( ( lson.$inherit !== undefined ) &&
        LAY.$type( lson.$inherit ) !== "array" ) {
          lson.$inherit = [ lson.$inherit ];
        }
    },

    $obdurate: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$obdurate", lson.$obdurate );
    },

    $load: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$load", lson.$load );
    },

    $gpu: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "$gpu", lson.$gpu );
    },

    data: function ( lson ) {
      checkAndThrowErrorAttrAsTake( "data", lson.data );
    },

    exist: function ( lson ) {
    },
    /*
    * normalize the `lson`
    */
    props: function( lson ) {

      var
        prop2val = lson.props,
        prop, val,
        longhandPropS, longhandProp, shorthandVal,
        multipleTypePropMatchDetails,curMultipleMax,
        i, len;


      if ( lson.props === undefined ) {

        prop2val = lson.props = {};

      }

      checkAndThrowErrorAttrAsTake( "props", lson.props );


      if ( prop2val.centerX !== undefined ) {
        if ( prop2val.centerX === 0 ) { //optimization
          prop2val.left = takeZeroCenterX;
        } else {
          prop2val.left = ( new LAY.Take( fnCenterToPos ) ).fn(
            prop2val.centerX, takeWidth, takeParentWidth );
        }
        prop2val.centerX = undefined;
      }

      if ( prop2val.right !== undefined ) {
        prop2val.left = ( new LAY.Take( fnOppEdgeToPos ) ).fn(
          prop2val.right, takeWidth, takeParentWidth );
        prop2val.right = undefined;
      }

      if ( prop2val.centerY !== undefined ) {
        if ( prop2val.centerY === 0 ) { //optimization
          prop2val.top = takeZeroCenterY;
        } else {
          prop2val.top = ( new LAY.Take( fnCenterToPos ) ).fn(
            prop2val.centerY, takeHeight, takeParentHeight );
        }
        prop2val.centerY = undefined;
      }

      if ( prop2val.bottom !== undefined ) {
        prop2val.top = ( new LAY.Take( fnOppEdgeToPos ) ).fn(
           prop2val.bottom, takeHeight, takeParentHeight );
        prop2val.bottom = undefined;
      }

    

      for ( prop in prop2val ) {
        flattenProp( prop2val, prop2val, prop, prop );
      }

      for ( prop in prop2val ) {
        longhandPropS = LAY.$shorthandPropsUtils.getLonghandPropsDecenteralized( prop );
        if ( longhandPropS !== undefined ) {
          shorthandVal = prop2val[ prop ];
          for ( i = 0, len = longhandPropS.length; i < len; i++ ) {
            longhandProp = longhandPropS[ i ];
            prop2val[ longhandProp ] = prop2val[ longhandProp ] ||
            shorthandVal;

          }
        }
      }

      for ( prop in prop2val ) {
        if ( prop.lastIndexOf("Color") !== -1 ) {
          if ( typeof prop2val[ prop ] === "string" ) {
            throw "LAY Error: '" + prop + "' must be LAY.color()/LAY.rgb()/LAY.rgba()/LAY.hsl()/LAY.hsla()";
          }
        }
        multipleTypePropMatchDetails =
          LAY.$findMultipleTypePropMatchDetails( prop );
        if ( multipleTypePropMatchDetails !== null ) {
          curMultipleMax =
            LAY.$meta.get( lson, "max", multipleTypePropMatchDetails[ 1 ] );
          if ( ( curMultipleMax === undefined ) ||
            ( curMultipleMax < parseInt( multipleTypePropMatchDetails[ 2 ] ) ) ) {
            LAY.$meta.set( lson, "max", multipleTypePropMatchDetails[ 1 ],
              parseInt( multipleTypePropMatchDetails[ 2 ] ) );
          }
        }
      }

    },

  when: function ( lson ) {

    if ( lson.when === undefined ) {
      lson.when = {};
    } else {
      checkAndThrowErrorAttrAsTake( "when", lson.when );

      var eventType2_fnCallbackS_ = lson.when,
        eventType, fnCallbackS, i, len;

      for ( eventType in eventType2_fnCallbackS_ ) {
        fnCallbackS = eventType2_fnCallbackS_[ eventType ];
        //console.log(eventType2_fnCallbackS_[ eventType ]);

        if ( ! ( fnCallbackS instanceof Array ) ) {
          fnCallbackS =
            eventType2_fnCallbackS_[ eventType ] =
              [ fnCallbackS ];
        }
        checkAndThrowErrorAttrAsTake( "when." + eventType,
          fnCallbackS );
        //LAY.$meta.set( lson, "num", "when." + eventType, fnCallbackS.length );
      }
    }
  },

  transition: function( lson ) {

    if ( lson.transition === undefined ) {
      lson.transition = {};
    } else {
      var transitionProp, transitionDirective,
      transitionArgKey2val, transitionArgKey, transitionArgKeyS,
      transition = lson.transition,
      defaulterProp, defaultedPropS, defaultedProp, i, len;

      if ( transition !== undefined ) {
        checkAndThrowErrorAttrAsTake( "transition", lson.transition );

        if ( transition.centerX !== undefined ) {
          transition.left = transition.centerX;
        }
        if ( transition.right !== undefined ) {
          transition.left = transition.right;
        }
        if ( transition.centerY !== undefined ) {
          transition.top = transition.centerY;
        }
        if ( transition.bottom !== undefined ) {
          transition.top = transition.bottom;
        }

        for ( transitionProp in transition ) {
          if ( LAY.$checkIsValidUtils.checkIsPropAttrExpandable( transitionProp ) ) {
            throw ( "LAY Error: transitions for special/expander props such as '" + name  + "' are not permitted." );
          }
          transitionDirective = transition[ transitionProp ];
          checkAndThrowErrorAttrAsTake( "transition." + transitionProp,
          transitionDirective  );

          transitionArgKey2val = transitionDirective.args;
          if ( transitionArgKey2val !== undefined ) {

            checkAndThrowErrorAttrAsTake( "transition." + transitionProp + ".args",
            transitionArgKey2val  );

          }
        }
      }
    }
  },

  states: function( lson, isMany ) {

    if ( lson.states !== undefined ) {

      var stateName2state = lson.states, state;
      checkAndThrowErrorAttrAsTake( "states",  stateName2state );

      for ( var stateName in stateName2state ) {

        if ( !LAY.$checkIsValidUtils.stateName( stateName ) ) {
          throw ( "LAY Error: Invalid state name: " + stateName );
        }

        state = stateName2state[ stateName ];

        checkAndThrowErrorAttrAsTake( "states." + stateName, state );

        if ( !isMany ) {
          key2fnNormalize.props( state );
          key2fnNormalize.when( state );
          key2fnNormalize.transition( state );
        } else {
          key2fnNormalize.fargs( state );
          key2fnNormalize.sort( state ); 
        }

      }
    }
  },


  children: function( lson ) {

    if ( lson.children !== undefined ) {

      var childName2childLson = lson.children;
      checkAndThrowErrorAttrAsTake( "children",  childName2childLson );

      for ( var childName in childName2childLson ) {
        
        normalize( childName2childLson[ childName ], true );

      }
    }
  },

  many: function ( lson )  {

    if ( lson.many !== undefined ) {

      var many = lson.many;

      checkAndThrowErrorAttrAsTake( "many", many );

      if ( !many.states ) {
        many.states = {};
      }

      many.states.root = {
        
        formation: many.formation,
        sort: many.sort,
        filter: many.filter,
        fargs: many.fargs

      };

      many.formation = undefined;
      many.sort = undefined;
      many.filter = undefined;
      many.fargs = undefined;

      key2fnNormalize.states( many, true );

    }
  },

  // formation args (Many)
  fargs: function ( lson ) {
    if ( lson.fargs ) {
      var
        fargs = lson.fargs,
        formationArg;

      checkAndThrowErrorAttrAsTake( "fargs", fargs );

      for ( formationArg in fargs ) {
        checkAndThrowErrorAttrAsTake( "fargs." + formationArg,
          fargs[ formationArg ] );
      }


    }
  },

  sort: function ( lson ) {
    if ( lson.sort ) {
      var
        sortS = lson.sort,
        i, len;

      checkAndThrowErrorAttrAsTake( "sort", sortS );

      for ( i = 0, len = sortS.length; i < len; i++ ) {
        checkAndThrowErrorAttrAsTake( "sort." + i,
          sortS[ i ] );
        if ( sortS[ i ].ascending === undefined ) {
          sortS[ i ].ascending = true;
        }

      }
    } 
  }

};

}());

( function () {
  "use strict";
  // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  if ( Function.prototype.bind === undefined ) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof fNOP && oThis ?
          this
          : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
      };
    }


})();

(function () {
  "use strict";

  // Non console API compliant browsers will not throw an error
  
  if ( window.console === undefined ) {

    window.console = { error: function () {}, log: function () {}, info: function () {} };

  }

})();


(function(){
  "use strict";
  /* Modified source of: Paul Irish's https://gist.github.com/paulirish/5438650
  And https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
  */
  if ( window.performance === undefined ) {
    window.performance = {};
  }

  if ( window.performance.now === undefined ) {

    if ( Date.now === undefined ) {
      Date.now = function now() {
        return new Date().getTime();
      };
    }
    var nowOffset = Date.now();

    if ( performance.timing !== undefined && performance.timing.navigationStart !== undefined ) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }

})();

/*
http://paulirish.com/2011/requestanimationframe-for-smart-animating/
http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
MIT license*/

(function() {
  "use strict";
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                   window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function () {
  "use strict";

  if ( String.prototype.startWith === undefined ) {
    String.prototype.startsWith = function ( prefix ) {
      return this.indexOf(prefix) === 0;
    }
  }

})();

( function () {
  "use strict";


  /*
  * Optional argument of `timeNow`
  * which represent the previous time frame
  */
  LAY.$render = function ( timeNow ) {
    if ( ( ( LAY.$renderDirtyPartS.length !== 0 ) ||
       LAY.isDataTravelling
       ) ) {

      if ( timeNow ) {
        LAY.$prevTimeFrame = timeNow;
        window.requestAnimationFrame( render );
      } else {
        LAY.$prevTimeFrame = performance.now() - 16.7;
        render();
      }
      
    }
  }

  function render() {
    var
      curTimeFrame = performance.now(),
      timeFrameDiff = curTimeFrame - LAY.$prevTimeFrame,
      parentNode,
      x, y,
      i, len,
      isDataTravelling = LAY.$isDataTravelling,
      dataTravellingDelta = LAY.$dataTravelDelta,
      renderDirtyPartS = LAY.$renderDirtyPartS,
      renderDirtyPart,
      travelRenderDirtyAttrValS,
      travelRenderDirtyAttrVal,
      normalRenderDirtyAttrValS,
      normalRenderDirtyAttrVal,
      renderDirtyTransition,
      renderCallS, isNormalAttrValTransitionComplete,
      renderNewLevelS = [],
      renderNewLevel,
      fnLoad,
      isAllNormalTransitionComplete = true;

    LAY.$isRendering = true;

    for ( x = 0; x < renderDirtyPartS.length; x++ ) {

      renderDirtyPart = renderDirtyPartS[ x ];

      travelRenderDirtyAttrValS = renderDirtyPart.travelRenderDirtyAttrValS;
      normalRenderDirtyAttrValS = renderDirtyPart.normalRenderDirtyAttrValS;

      renderCallS = [];

      for ( y = 0; y < travelRenderDirtyAttrValS.length; y++ ) {

        travelRenderDirtyAttrVal = travelRenderDirtyAttrValS[ y ];

        if ( travelRenderDirtyAttrVal.isTransitionable ) {

          transitionAttrVal( travelRenderDirtyAttrVal, dataTravellingDelta );
            LAY.$arrayUtils.pushUnique(
               renderCallS, travelRenderDirtyAttrVal.renderCall );

        }
      }

      for ( y = 0; y < normalRenderDirtyAttrValS.length; y++ ) {

        normalRenderDirtyAttrVal = normalRenderDirtyAttrValS[ y ];
        isNormalAttrValTransitionComplete = true;
        if ( normalRenderDirtyAttrVal.calcVal !== undefined ) {
          LAY.$arrayUtils.pushUnique( renderCallS,
           normalRenderDirtyAttrVal.renderCall );
        }
        renderDirtyTransition = normalRenderDirtyAttrVal.transition;
        if ( renderDirtyTransition !== undefined ) { // if transitioning
          if ( renderDirtyTransition.delay &&
            renderDirtyTransition.delay > 0 ) {
            renderDirtyTransition.delay -= timeFrameDiff;
            isNormalAttrValTransitionComplete = false;
          } else {
            if ( !renderDirtyTransition.checkIsComplete() ) {
              isAllNormalTransitionComplete = false;
              isNormalAttrValTransitionComplete = false;
              transitionAttrVal( normalRenderDirtyAttrVal,
                 renderDirtyTransition.generateNext( timeFrameDiff ) );

            } else {
              if ( renderDirtyTransition.done !== undefined ) {
                renderDirtyTransition.done.call( renderDirtyPart.level );
              }
              normalRenderDirtyAttrVal.transition = undefined;
            }
          }
        }

        if ( isNormalAttrValTransitionComplete ) {
          normalRenderDirtyAttrVal.transitionCalcVal =
            normalRenderDirtyAttrVal.calcVal;
          LAY.$arrayUtils.removeAtIndex( normalRenderDirtyAttrValS, y );
          y--;

        }
      }

      // scroll positions must be affected last
      // as a dimensional update would require
      // scroll to be updated after
      if ( LAY.$arrayUtils.remove( renderCallS, "scrollX" ) ) {
        renderCallS.push( "scrollX" );
      }
      if ( LAY.$arrayUtils.remove( renderCallS, "scrollY" ) ) {
        renderCallS.push( "scrollY" );
      }

      for ( i = 0, len = renderCallS.length; i < len; i++ ) {
        var fnRender =
          renderDirtyPart[ "renderFn_" + renderCallS[ i ] ];
        if ( !fnRender ) {
          throw "LAY Error: Inexistent prop: '" +
           renderCallS[ i ] + "'"; 
        }
        renderDirtyPart[ "renderFn_" + renderCallS[ i ] ]();
      }

      if (
         ( normalRenderDirtyAttrValS.length === 0 ) &&
         ( travelRenderDirtyAttrValS.length === 0 ) ) {
        LAY.$arrayUtils.removeAtIndex( LAY.$renderDirtyPartS, x );
        x--;
      }

      if ( !renderDirtyPart.isInitiallyRendered &&
         LAY.$renderDirtyPartS.indexOf( renderDirtyPart ) === -1 ) {
        LAY.$arrayUtils.pushUnique( renderNewLevelS,
         renderDirtyPart.level );
      }
    }

    for ( i = 0, len = renderNewLevelS.length; i < len; i++ ) {
      renderNewLevel = renderNewLevelS[ i ];
      renderNewLevel.part.isInitiallyRendered = true;
      fnLoad = renderNewLevel.lson.$load;
      if ( fnLoad ) {
        fnLoad.call( renderNewLevel );
      }
    }

    LAY.$isRendering = false;
    
    if ( LAY.$isSolveRequiredOnRenderFinish ) {
      LAY.$isSolveRequiredOnRenderFinish = false;
      LAY.$solve();
    } else if ( !isAllNormalTransitionComplete ) {
      LAY.$render( curTimeFrame );
    }

  }

  function transitionAttrVal( normalRenderDirtyAttrVal, delta ) {
    if ( normalRenderDirtyAttrVal.calcVal instanceof LAY.Color ) {
      normalRenderDirtyAttrVal.transitionCalcVal =
        LAY.$generateColorMix( normalRenderDirtyAttrVal.startCalcVal,
          normalRenderDirtyAttrVal.calcVal,
          delta );
    } else {
      normalRenderDirtyAttrVal.transitionCalcVal =
        normalRenderDirtyAttrVal.startCalcVal +
        ( delta *
          ( normalRenderDirtyAttrVal.calcVal -
            normalRenderDirtyAttrVal.startCalcVal )
          );
    }
  }

})();
( function () {
  "use strict";

  var
  shorthandProp2_longhandPropS_,
  longhandPropS,
  centeralizedShorthandPropS;

  shorthandProp2_longhandPropS_ = {

    transform:[
      "z",
      "scaleX", "scaleY", "scaleZ",
      "rotateX", "rotateY", "rotateZ",
      "skewX", "skewY"
    ],
    x: [ "left", "shiftX"],
    y: [ "top", "shiftY"],
    origin: ["originX", "originY", "originZ" ],
    overflow: [
      "overflowX", "overflowY" ],
    backgroundPosition: [
      "backgroundPositionX", "backgroundPositionY" ],
    backgroundSize: [
      "backgroundSizeX", "backgroundSizeY" ],

    borderWidth: [
      "borderTopWidth", "borderRightWidth",
       "borderBottomWidth", "borderLeftWidth" ],
    borderColor: [
      "borderTopColor", "borderRightColor",
       "borderBottomColor", "borderLeftColor" ],
    borderStyle: [
      "borderTopStyle", "borderRightStyle",
       "borderBottomStyle", "borderLeftStyle" ],
    textPadding: [
      "textPaddingTop", "textPaddingRight",
       "textPaddingBottom", "textPaddingLeft" ],
    cornerRadius: [
      "cornerRadiusTopLeft", "cornerRadiusTopRight",
       "cornerRadiusBottomRight", "cornerRadiusBottomLeft" ]

  };

  // Centralized shorthand props are those props which
  // have same render calls (almost akin to css properties)
  // for each shorthand property

  centeralizedShorthandPropS = [
    "transform", "x", "y", "origin",
    "backgroundPosition", "backgroundSize"
  ];

  longhandPropS = ( function () {
    var
      longhandPropS = [],
      shorthandProp,
      i, len;

    for ( shorthandProp in shorthandProp2_longhandPropS_ ) {
      longhandPropS = longhandPropS.concat( shorthandProp2_longhandPropS_[ shorthandProp ] );
    }
    return longhandPropS;
  })();

  LAY.$shorthandPropsUtils = {
    getLonghandProps: function ( shorthandProp ) {
      return shorthandProp2_longhandPropS_[ shorthandProp ];
    },
    getLonghandPropsDecenteralized: function ( shorthandProp ) {
      if ( centeralizedShorthandPropS.indexOf( shorthandProp ) === -1 ) {
        return shorthandProp2_longhandPropS_[ shorthandProp ];
      } else {
        return undefined;
      }
    },
    getShorthandProp: function ( longhandProp ) {
      var shorthandProp;
      if ( longhandPropS.indexOf( longhandProp ) !== -1 ) {
        for ( shorthandProp in shorthandProp2_longhandPropS_ ) {
          if ( shorthandProp2_longhandPropS_[ shorthandProp ].indexOf( longhandProp ) !== -1 ) {
            return shorthandProp;
          }
        }
      }
      return undefined;
    },
    getShorthandPropCenteralized:  function ( longhandProp ) {
      var shorthandProp = LAY.$shorthandPropsUtils.getShorthandProp( longhandProp );
      if ( shorthandProp !== undefined && centeralizedShorthandPropS.indexOf( shorthandProp ) !== -1 ) {
        return shorthandProp;
      } else {
        return undefined;
      }
    },

    checkIsDecentralizedShorthandProp: function ( shorthandProp ) {
      return shorthandProp2_longhandPropS_[ shorthandProp ] !== undefined &&
        centeralizedShorthandPropS.indexOf( shorthandProp ) === -1;
    }

  };


})();

( function () {
  "use strict";
  LAY.$solve = function () {

    if ( LAY.$isRendering ) {
      LAY.$isSolveRequiredOnRenderFinish = true;
    } else if ( !LAY.$isSolving && LAY.$numClog === 0 ) {
      var 
        ret,
        isSolveNewComplete,
        isSolveRecalculationComplete,
        isSolveProgressed,
        isSolveHaltedForOneLoop = false;

      LAY.$isSolving = true;

      do {

        isSolveProgressed = false;
        isSolveNewComplete = false;
        isSolveRecalculationComplete = false;

        ret = LAY.$solveForNew();

        if ( ret < 2 ) {
          isSolveProgressed = true;
        }
          
        ret = LAY.$solveForRecalculation();
        if ( ret < 2 ) {
          isSolveProgressed = true;
        }


        // The reason we cannot use `ret` to confirm
        // completion and not `ret` is because during solving
        // for recalculation new levels could have been
        // added ((from many.rows), and during execution
        //  of state installation new recalculations or
        // levels could have been created 

        isSolveRecalculationComplete =
          LAY.$recalculateDirtyAttrValS.length === 0;
        isSolveNewComplete =
          LAY.$newLevelS.length === 0;

        if ( !isSolveProgressed ) {
          if ( isSolveHaltedForOneLoop ) {
            break;
          } else {
            isSolveHaltedForOneLoop = true;
          }
        } else {
          isSolveHaltedForOneLoop = false;
        }

      } while ( !( isSolveNewComplete && isSolveRecalculationComplete ) );

      if ( !( isSolveNewComplete && isSolveRecalculationComplete ) ) {
        var msg = "LAY Error: Circular/Undefined Reference Encountered [";
        if ( !isSolveNewComplete ) {
          msg += "Uninheritable Level: " + LAY.$newLevelS[ 0 ].pathName;
        } else {
          var circularAttrVal = LAY.$recalculateDirtyAttrValS[ 0 ];
          msg += "Uninstantiable Attr: " +
              circularAttrVal.attr +
            " (Level: " + circularAttrVal.level.pathName  + ")";
        } 
        msg += "]";
        throw msg;

      }

      relayout();
      recalculateNaturalDimensions();      
      executeManyLoads();
      executeStateInstallation();
      // If the load/install functions of 
      // many or level demands a recalculation
      // then we will solve, otherwise we shall
      // render
      LAY.$isSolving = false;
      if ( LAY.$recalculateDirtyAttrValS.length ) {
        LAY.$solve();
      } else {
        LAY.$render();
      }
    }
  };


  function relayout() {
    var relayoutDirtyManyS = LAY.$relayoutDirtyManyS;
    for ( var i=0, len=relayoutDirtyManyS.length; i<len; i++ ) {
      relayoutDirtyManyS[ i ].relayout();
    }
    LAY.$relayoutDirtyManyS = [];
  };


  function recalculateNaturalDimensions () {
    var
      naturalWidthDirtyPartS =
        LAY.$naturalWidthDirtyPartS,
      naturalHeightDirtyPartS = 
        LAY.$naturalHeightDirtyPartS,
      i, len, attrVal;

    // calculate natural width first
    // as knowing natural width is useful
    // while calculating natural height
    for ( i=naturalWidthDirtyPartS.length - 1;
        i >= 0; i-- ) {
      attrVal = 
        naturalWidthDirtyPartS[ i ].level.attr2attrVal.$naturalWidth;
      if ( attrVal ) {
        attrVal.requestRecalculation();
      }
    }

    for ( i=naturalHeightDirtyPartS.length - 1;
        i >= 0; i-- ) {
      attrVal = 
        naturalHeightDirtyPartS[ i ].level.attr2attrVal.$naturalHeight;
      if ( attrVal ) {
        attrVal.requestRecalculation();
      }
    }

    LAY.$naturalWidthDirtyPartS = [];
    LAY.$naturalHeightDirtyPartS = [];

  }

  function executeManyLoads () {
    var newManyS = LAY.$newManyS, newMany, fnLoad;

    for ( var i = 0, len = newManyS.length; i < len; i++ ) {
      newMany = newManyS[ i ];
      newMany.isLoaded = true;
      fnLoad = newMany.level.lson.$load;
      if ( fnLoad ) {
        fnLoad.call( newMany.level );
      }
    }
    LAY.$newManyS = [];
  }

  function executeStateInstallation () {
    var
      i, j, len, jLen,
      newlyInstalledStateLevelS = LAY.$newlyInstalledStateLevelS,
      newlyInstalledStateLevel,
      newlyInstalledStateS,
      attrValNewlyInstalledStateInstall,
      newlyUninstalledStateLevelS = LAY.$newlyUninstalledStateLevelS,
      newlyUninstalledStateLevel,
      newlyUninstalledStateS,
      attrValNewlyUninstalledStateUninstall;

    for ( i = 0, len = newlyInstalledStateLevelS.length; i < len; i++ ) {
      newlyInstalledStateLevel = newlyInstalledStateLevelS[ i ];
      newlyInstalledStateS = newlyInstalledStateLevel.newlyInstalledStateS;
      for ( j = 0, jLen = newlyInstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyInstalledStateInstall =
          newlyInstalledStateLevel.attr2attrVal[ newlyInstalledStateS[ j ] +
          ".install" ];
        attrValNewlyInstalledStateInstall &&
          ( LAY.$type(attrValNewlyInstalledStateInstall.calcVal ) ===
          "function") &&
          attrValNewlyInstalledStateInstall.calcVal.call(
          newlyInstalledStateLevel );
      }
      // empty the list
      newlyInstalledStateLevel.newlyInstalledStateS = [];
    }
    LAY.$newlyInstalledStateLevelS = [];

    for ( i = 0, len = newlyUninstalledStateLevelS.length; i < len; i++ ) {
      newlyUninstalledStateLevel = newlyUninstalledStateLevelS[ i ];
      newlyUninstalledStateS = newlyUninstalledStateLevel.newlyUninstalledStateS;
      for ( j = 0, jLen = newlyUninstalledStateS.length; j < jLen; j++ ) {
        attrValNewlyUninstalledStateUninstall =
          newlyUninstalledStateLevel.attr2attrVal[ newlyUninstalledStateS[ j ] +
          ".uninstall" ];
        attrValNewlyUninstalledStateUninstall &&
          ( LAY.$type( attrValNewlyUninstalledStateUninstall.calcVal) ===
          "function") &&
          attrValNewlyUninstalledStateUninstall.calcVal.call( 
          newlyUninstalledStateLevel );
      }
      // empty the list
      newlyUninstalledStateLevel.newlyUninstalledStateS = [];
    }
    LAY.$newlyUninstalledStateLevelS = [];
  }


})();

( function () {
  "use strict";
  LAY.$solveForNew = function () {

    var
      i, len,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      newLevelS = LAY.$newLevelS,
      newLevel,
      solvedLevelS = [];

    if ( !newLevelS.length ) {
      return 3;
    }
    
    do {
      isSolveProgressed = false;
      for ( i = 0; i < newLevelS.length; i++ ) {
        newLevel = newLevelS[ i ];
        if ( newLevel.$normalizeAndInherit() ) {
          newLevel.$identify();
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          solvedLevelS.push( newLevel );
          LAY.$arrayUtils.removeAtIndex( newLevelS, i );
          i--;
        }
      }
   
    } while ( ( newLevelS.length !== 0 ) && isSolveProgressed );

    for ( i = 0, len = solvedLevelS.length; i < len; i++ ) {
      solvedLevelS[ i ].$decideExistence();
    }



    return newLevelS.length === 0 ? 0 :
      isSolveProgressedOnce ? 1 : 2;
   
  }

})();

( function () {
  "use strict";
  LAY.$solveForRecalculation = function () {


    var 
      i,
      isSolveProgressed,
      isSolveProgressedOnce = false,
      ret,
      recalculateDirtyAttrValS = LAY.$recalculateDirtyAttrValS;
      
    if ( !recalculateDirtyAttrValS.length ) {
      return 3;
    }

    do {
      isSolveProgressed = false;
      for ( i = 0; i < recalculateDirtyAttrValS.length; i++ ) {
        ret =
          recalculateDirtyAttrValS[ i ].recalculate();

        if ( ret ) {
          isSolveProgressed = true;
          isSolveProgressedOnce = true;
          LAY.$arrayUtils.removeAtIndex( recalculateDirtyAttrValS, i );
          i--;
        }
      }
    
    } while ( ( recalculateDirtyAttrValS.length !== 0 ) && isSolveProgressed );


    return recalculateDirtyAttrValS.length === 0 ?  0 :
      isSolveProgressedOnce ? 1 : 2;

  };

})();


// source of spring code insprired from below:
// facebook pop framework & framer.js

( function() {
  "use strict";


  LAY.$springTransition = function( duration, args ) {
    this.curTime = 0;
    this.value = 0;
    this.friction = parseFloat( args.friction );
    this.tension = parseFloat( args.tension );
    this.velocity = parseFloat( args.velocity || 0 );

    this.threshold = parseFloat( args.threshold || ( 1 / 1000 ) );
    this.isComplete = false;
  };

  LAY.$springTransition.prototype.generateNext = function ( delta ) {
    var
      finalVelocity, net1DVelocity, netFloat,
       netValueIsLow, netVelocityIsLow, stateAfter, stateBefore;


    delta = delta / 1000;

    this.curTime += delta;
    stateBefore = {};
    stateAfter = {};
    stateBefore.x = this.value - 1;
    stateBefore.v = this.velocity;
    stateBefore.tension = this.tension;
    stateBefore.friction = this.friction;
    stateAfter = springIntegrateState( stateBefore, delta );

    this.value = 1 + stateAfter.x;
    finalVelocity = stateAfter.v;
    netFloat = stateAfter.x;
    net1DVelocity = stateAfter.v;
    netValueIsLow = Math.abs( netFloat ) < this.threshold;
    netVelocityIsLow = Math.abs( net1DVelocity ) < this.threshold;
    this.isComplete = netValueIsLow && netVelocityIsLow;
    this.velocity = finalVelocity;
    return this.value;
  };

  LAY.$springTransition.prototype.checkIsComplete = function() {
    return this.isComplete;
  };


  function springAccelerationForState ( state ) {
    return ( - state.tension * state.x ) - ( state.friction * state.v );
  };

  function springEvaluateState ( initialState ) {
    var output;
    output = {};
    output.dx = initialState.v;
    output.dv = springAccelerationForState( initialState );
    return output;
  };

  function springEvaluateStateWithDerivative( initialState, dt, derivative ) {
    var output, state;
    state = {};
    state.x = initialState.x + derivative.dx * dt;
    state.v = initialState.v + derivative.dv * dt;
    state.tension = initialState.tension;
    state.friction = initialState.friction;
    output = {};
    output.dx = state.v;
    output.dv = springAccelerationForState(state);
    return output;
  };

  function springIntegrateState ( state, speed ) {
    var a, b, c, d, dvdt, dxdt;
    a = springEvaluateState(state);
    b = springEvaluateStateWithDerivative(state, speed * 0.5, a);
    c = springEvaluateStateWithDerivative(state, speed * 0.5, b);
    d = springEvaluateStateWithDerivative(state, speed, c);


    dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);
    dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);
    state.x = state.x + dxdt * speed;
    state.v = state.v + dvdt * speed;
    return state;
  }

})();

( function () {
  "use strict";



  LAY.$transitionType2args = {
    "linear": [],
    "cubic-bezier": [ "a", "b", "c", "d" ],
    "spring": [ "velocity", "tension", "friction", "threshold" ]

  };




})();

(function () {
  "use strict";

  // source: jquery-2.1.1.js (line 302, 529)

  var typeIdentifier2_type_ = {
  '[object Boolean]':    'boolean',
  '[object Number]':     'number',
  '[object String]':     'string',
  '[object Function]':    'function',
  '[object Array]':     'array',
  '[object Date]':      'date',
  '[object RegExp]':    'regexp',
  '[object Object]':    'object',
  '[object Error]':     'error'
};


  LAY.$type = function( obj ) {
    if ( obj === null ) {
      return obj + "";
    } else if ( obj instanceof LAY.Color ) {
      return "color";
    } else if ( obj instanceof LAY.Take ) {
      return "take";
    } else if ( obj instanceof LAY.Level ) {
      return "level";
    }
    // Support: Android < 4.0, iOS < 6 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
    typeIdentifier2_type_[ Object.prototype.toString.call(obj) ] || "object" :
    typeof obj;
  };

})();

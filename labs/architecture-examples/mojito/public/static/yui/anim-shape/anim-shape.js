/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('anim-shape', function (Y, NAME) {

/**
 * Adds support for the <code>transform</code> attribute of <code>Graphic</code>
 * <code>Shape</code> instances.
 * @module anim
 * @submodule anim-shape-transform
 * @deprecated Use anim-shape instead.
 */
/**
 * Adds support for the <code>transform</code>, <code>fill</code>, and <code> attributes of <code>Graphic</code>
 * <code>Shape</code> instances. The <code>anim-shape</code> submodule can be used for all animations involving
 * <code>Graphic</code> <code>Shape</code> attributes. 
 * 
 * @module anim
 * @submodule anim-shape
 */
    var NUM = Number,
    TO,
    TOSTRING,
    COLOR = "color",
    STOPS = "stops",
    TYPE = "type",
    GETUPDATEDSTOPS = function(anim, from, to, elapsed, duration, fn)
    {
        var i = 0,
            getUpdatedColorValue = Y.Anim.getUpdatedColorValue,
            toStop,
            fromStop,
            prop,
            len = to.length,
            color,
            opacity,
            offset,
            rotation,
            r,
            fx,
            fy,
            cx,
            cy,
            stops = [],
            stop;
        for(; i < len; i = i + 1)
        {
            toStop = to[i];
            fromStop = from[i];
            stop = {};
            for(prop in toStop)
            {
                if(toStop.hasOwnProperty(prop))
                {
                    if(prop == COLOR)
                    {
                        stop[prop] = Y.Color.toHex(getUpdatedColorValue(Y.Color.toHex(fromStop[prop]), Y.Color.toHex(toStop[prop]), elapsed, duration, fn));
                    }
                    else
                    {
                        stop[prop] = fn(elapsed, NUM(fromStop[prop]), NUM(toStop[prop]) - NUM(fromStop[prop]), duration);
                    }
                }
            }
            stops.push(stop);
        }
        return stops;
    },
    FILLANDSTROKEBEHAVIOR = {
        set: function(anim, att, from, to, elapsed, duration, fn) {
            var i,
            updated = {},
            getUpdatedColorValue = Y.Anim.getUpdatedColorValue,
            getUpdatedStops = GETUPDATEDSTOPS;
            for(i in to)
            {
                if(to.hasOwnProperty(i) && i != TYPE)
                {
                    switch(i)
                    {
                        case COLOR :
                            updated[i] = getUpdatedColorValue(from[i], to[i], elapsed, duration, fn);
                        break;
                        case STOPS :
                            updated[i] = getUpdatedStops(anim, from[i], to[i], elapsed, duration, fn);
                        break;
                        default :
                            updated[i] = fn(elapsed, NUM(from[i]), NUM(to[i]) - NUM(from[i]), duration);
                        break;
                    }
                }
            }
            anim._node.set(att, updated);
        }
    };
    Y.Anim.behaviors.fill = FILLANDSTROKEBEHAVIOR;
    Y.Anim.behaviors.stroke = FILLANDSTROKEBEHAVIOR; 

    Y.Anim.behaviors.transform = {
        set: function(anim, att, from, to, elapsed, duration, fn) {
            var node = anim._node,
                transform = "",
                transformTo,
                transformFrom,
                toArgs,
                fromArgs,
                i = 0,
                j,
                argLen,
                len;
            to = TO;
            len = TO.length;
            for(; i < len; ++i)
            {
                toArgs = to[i].concat();
                fromArgs = from[i].concat();
                transformTo = toArgs.shift();
                transformFrom = fromArgs.shift();
                argLen = toArgs.length;
                transform += transformTo + "(";
                for(j = 0; j < argLen; ++j)
                {
                    transform += fn(elapsed, NUM(fromArgs[j]), NUM(toArgs[j]) - NUM(fromArgs[j]), duration);
                    if(j < argLen - 1)
                    {
                        transform += ", ";
                    }
                }
                transform += ");";
            }
            if(transform)
            {
                node.set('transform', transform);
            }
            node._transform = TOSTRING;
        },
        
        get: function(anim) {
            var node = anim._node,
                fromMatrix = node.matrix,
                toAttr = anim.get("to") || {},
                toString = anim.get("to").transform,
                fromString = node.get("transform"),
                toArray = Y.MatrixUtil.getTransformArray(toString),
                fromArray = fromString ? Y.MatrixUtil.getTransformArray(fromString) : null,
                toMatrix,
                i,
                len,
                transformFunction,
                from;
            if(toArray)
            {
                if(!fromArray || fromArray.length < 1)
                {
                    fromArray = [];
                    len = toArray.length;
                    for(i = 0; i < len; ++i)
                    {
                        transformFunction = toArray[i][0];
                        fromArray[i] = Y.MatrixUtil.getTransformFunctionArray(transformFunction);
                    }
                    TO = toArray;
                    from = fromArray;
                }
                else if(Y.MatrixUtil.compareTransformSequence(toArray, fromArray))
                {
                    TO = toArray;
                    from = fromArray;
                }
                else
                {
                    toMatrix = new Y.Matrix();
                    len = toArray.length;
                    for(i = 0; i < len; ++i)
                    {
                        transformFunction = toArray[i].shift();
                        transformFunction = transformFunction == "matrix" ? "multiply" : transformFunction;
                        toMatrix[transformFunction].apply(toMatrix, toArray[i]); 
                    }

                    TO = toMatrix.decompose();
                    from = fromMatrix.decompose();
                }
            }
            TOSTRING = toString;
            return from;
        }
    };  



}, '3.7.3', {"requires": ["anim-base", "anim-easing", "anim-color", "matrix"]});

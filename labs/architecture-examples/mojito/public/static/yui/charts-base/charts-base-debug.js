/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('charts-base', function (Y, NAME) {

/**
 * The Charts widget provides an api for displaying data
 * graphically.
 *
 * @module charts
 * @main charts
 */

/**
 * The charts-base submodule contains the core functionality for the charts module.
 *
 * @module charts
 * @submodule charts-base
 */
var CONFIG = Y.config,
    WINDOW = CONFIG.win,
    DOCUMENT = CONFIG.doc,
    Y_Lang = Y.Lang,
    IS_STRING = Y_Lang.isString,
    Y_DOM = Y.DOM,
    LeftAxisLayout,
    RightAxisLayout,
    BottomAxisLayout,
    TopAxisLayout,
    _getClassName = Y.ClassNameManager.getClassName,
    SERIES_MARKER = _getClassName("seriesmarker"),
    ShapeGroup,
    CircleGroup,
    RectGroup,
    EllipseGroup,
    DiamondGroup;

/**
 * Abstract class for creating groups of shapes with the same styles and dimensions.
 *
 * @class ShapeGroup
 * @constructor
 */
 ShapeGroup = function(cfg)
 {
    ShapeGroup.superclass.constructor.apply(this, arguments);
 };
    
 ShapeGroup.NAME = "shapeGroup";

 Y.extend(ShapeGroup, Y.Path, {    
    /**
     * Updates the shape.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var xvalues = this.get("xvalues"),
            yvalues = this.get("yvalues"),
            x,
            y,
            xRad,
            yRad,
            i = 0,
            len,
            attrs = [],
            dimensions = this.get("dimensions"),
            width = dimensions.width,
            height = dimensions.height,
            radius = dimensions.radius,
            yRadius = dimensions.yRadius,
            id = this.get("id"),
            className = this.node.className,
            widthIsArray = Y_Lang.isArray(width),
            heightIsArray = Y_Lang.isArray(height),
            radiusIsArray = Y_Lang.isArray(radius),
            yRadiusIsArray = Y_Lang.isArray(yRadius);
        if(xvalues && yvalues && xvalues.length > 0)
        {
            this.clear();

            len = xvalues.length;
            for(; i < len; ++i)
            {
                x = xvalues[i];
                y = yvalues[i];
                xRad = radiusIsArray ? radius[i] : radius;
                yRad = yRadiusIsArray ? yRadius[i] : yRadius;
                if(!isNaN(x) && !isNaN(y) && !isNaN(xRad))
                {
                    this.drawShape({
                        x: x,
                        y: y,
                        width: widthIsArray ? width[i] : width,
                        height: heightIsArray ? height[i] : height,
                        radius: xRad,
                        yRadius: yRad 
                    });
                    this.closePath();
                    attrs[i] = {
                        id: id + "_" + i,
                        className: className,
                        coords: (x - this._left) + ", " + (y - this._top)  + ", " + radius,
                        shape: "circle"
                    };
                }
            }
            this._closePath();
        }
    },

    /**
     * Parses and array of lengths into radii
     *
     * @method _getRadiusCollection
     * @param {Array} val Array of lengths
     * @return Array
     * @private
     */
    _getRadiusCollection: function(val)
    {
        var i = 0,
            len = val.length,
            radii = [];
        for(; i < len; ++i)
        {   
            radii[i] = val[i] * 0.5;
        }
        return radii;
    }
 });
    
ShapeGroup.ATTRS = Y.merge(Y.Path.ATTRS, {
    dimensions: {
        getter: function()
        {
            var dimensions = this._dimensions,
                radius,
                yRadius,
                width,
                height;
            if(dimensions.hasOwnProperty("radius"))
            {
                return dimensions;
            }
            else
            {
                width = dimensions.width;
                height = dimensions.height;
                radius = Y_Lang.isArray(width) ? this._getRadiusCollection(width) : (width * 0.5);
                yRadius = Y_Lang.isArray(height) ? this._getRadiusCollection(height) : (height * 0.5);
                return {
                    width: width,
                    height: height,
                    radius: radius,
                    yRadius: yRadius
                };
            }
        },

        setter: function(val)
        {
            this._dimensions = val;
            return val;
        }
    },
    xvalues: {
        getter: function()
        {
            return this._xvalues;
        },
        setter: function(val)
        {
            this._xvalues = val;
        }
    },
    yvalues: {
        getter: function()
        {
            return this._yvalues;
        },
        setter: function(val)
        {
            this._yvalues = val;
        }
    }
});
Y.ShapeGroup = ShapeGroup;
/**
 * Abstract class for creating groups of circles with the same styles and dimensions.
 *
 * @module charts
 * @submodule charts-base
 * @class CircleGroup
 * @constructor
 */
 CircleGroup = function(cfg)
 {
    CircleGroup.superclass.constructor.apply(this, arguments);
 };
    
 CircleGroup.NAME = "circleGroup";

 Y.extend(CircleGroup, Y.ShapeGroup, {    
    /**
     * Algorithm for drawing shape.
     *
     * @method drawShape
     * @param {Object} cfg Parameters used to draw the shape.
     */
    drawShape: function(cfg)
    {
        this.drawCircle(cfg.x, cfg.y, cfg.radius);
    }
 });

CircleGroup.ATTRS = Y.merge(Y.ShapeGroup.ATTRS, {
    dimensions: {
        getter: function()
        {
            var dimensions = this._dimensions,
                radius,
                yRadius,
                width,
                height;
            if(dimensions.hasOwnProperty("radius"))
            {
                return dimensions;
            }
            else
            {
                width = dimensions.width;
                height = dimensions.height;
                radius = Y_Lang.isArray(width) ? this._getRadiusCollection(width) : (width * 0.5);
                yRadius = radius;
                return {
                    width: width,
                    height: height,
                    radius: radius,
                    yRadius: yRadius
                };
            }
        }
    }
});
    
CircleGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.CircleGroup = CircleGroup;
/**
 * Abstract class for creating groups of rects with the same styles and dimensions.
 *
 * @module charts
 * @submodule charts-base
 * @class GroupRect
 * @constructor
 */
 RectGroup = function(cfg)
 {
    RectGroup.superclass.constructor.apply(this, arguments);
 };
    
 RectGroup.NAME = "rectGroup";

 Y.extend(RectGroup, Y.ShapeGroup, {    
    /**
     * Updates the rect.
     *
     * @method _draw
     * @private
     */
    drawShape: function(cfg)
    {
        this.drawRect(cfg.x, cfg.y, cfg.width, cfg.height);
    }
 });
    
RectGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.RectGroup = RectGroup;
/**
 * Abstract class for creating groups of diamonds with the same styles and dimensions.
 *
 * @module charts
 * @submodule charts-base
 * @class GroupDiamond
 * @constructor
 */
 DiamondGroup = function(cfg)
 {
    DiamondGroup.superclass.constructor.apply(this, arguments);
 };
    
 DiamondGroup.NAME = "diamondGroup";

 Y.extend(DiamondGroup, Y.ShapeGroup, {    
    /**
     * Updates the diamond.
     *
     * @method _draw
     * @private
     */
    drawShape: function(cfg)
    {
        this.drawDiamond(cfg.x, cfg.y, cfg.width, cfg.height);
    }
 });
    
DiamondGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.DiamondGroup = DiamondGroup;
/**
 * Abstract class for creating groups of diamonds with the same styles and dimensions.
 *
 * @module charts
 * @submodule charts-base
 * @class EllipseGroup
 * @constructor
 */
 EllipseGroup = function(cfg)
 {
    EllipseGroup.superclass.constructor.apply(this, arguments);
 };
    
 EllipseGroup.NAME = "diamondGroup";

 Y.extend(EllipseGroup, Y.ShapeGroup, {    
    /**
     * Updates the diamond.
     *
     * @method _draw
     * @private
     */
    drawShape: function(cfg)
    {
        this.drawEllipse(cfg.x, cfg.y, cfg.width, cfg.height);
    }
 });
    
EllipseGroup.ATTRS = Y.ShapeGroup.ATTRS;
Y.EllipseGroup = EllipseGroup;
/**
 * The Renderer class is a base class for chart components that use the `styles`
 * attribute.
 *
 * @module charts
 * @submodule charts-base
 * @class Renderer
 * @constructor
 */
function Renderer(){}

Renderer.ATTRS = {
        /**
         * Style properties for class
         * 
         * @attribute styles
         * @type Object
         */
        styles:
        {
            getter: function()
            {
                this._styles = this._styles || this._getDefaultStyles();
                return this._styles;
            },

            setter: function(val)
            {
                this._styles = this._setStyles(val);
            }
        },
        
        /**
         * The graphic in which drawings will be rendered.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {}
};
Renderer.NAME = "renderer";

Renderer.prototype = {
    /**
     * Storage for `styles` attribute.
     *
     * @property _styles
     * @type Object
     * @private
     */
	_styles: null,
	
    /**
     * Method used by `styles` setter.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     * @protected
     */
	_setStyles: function(newstyles)
	{
		var styles = this.get("styles");
        return this._mergeStyles(newstyles, styles);
	},
    
    /**
     * Merges to object literals so that only specified properties are 
     * overwritten.
     *
     * @method _mergeStyles
     * @param {Object} a Hash of new styles
     * @param {Object} b Hash of original styles
     * @return Object
     * @protected
     */
    _mergeStyles: function(a, b)
    {
        if(!b)
        {
            b = {};
        }
        var newstyles = Y.merge(b, {});
        Y.Object.each(a, function(value, key, a)
        {
            if(b.hasOwnProperty(key) && Y_Lang.isObject(value) && !Y_Lang.isFunction(value) && !Y_Lang.isArray(value))
            {
                newstyles[key] = this._mergeStyles(value, b[key]);
            }
            else
            {
                newstyles[key] = value;
            }
        }, this);
        return newstyles;
    },

    /**
     * Gets the default value for the `styles` attribute. 
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        return {padding:{
            top:0,
            right: 0,
            bottom: 0,
            left: 0
        }};
    }
};

Y.augment(Renderer, Y.Attribute);
Y.Renderer = Renderer;

/**
 * Algorithmic strategy for rendering a left axis.
 *
 * @module charts
 * @submodule charts-base
 * @class LeftAxisLayout
 * @constructor
 */
LeftAxisLayout = function() {};

LeftAxisLayout.prototype = {
    /**
     *  Default margins for text fields.
     *
     *  @private
     *  @method _getDefaultMargins
     *  @return Object
     */
    _getDefaultMargins: function() 
    {
        return {
            top: 0,
            left: 0,
            right: 4,
            bottom: 0
        };
    },

    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffset
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("topTickOffset",  0);
        host.set("bottomTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                host.set("rightTickOffset",  tickLength);
                host.set("leftTickOffset", 0);
            break;
            case "outside" : 
                host.set("rightTickOffset", 0);
                host.set("leftTickOffset",  tickLength);
            break;
            case "cross":
                host.set("rightTickOffset", halfTick); 
                host.set("leftTickOffset",  halfTick);
            break;
            default:
                host.set("rightTickOffset", 0);
                host.set("leftTickOffset", 0);
            break;
        }
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt Point on the axis in which the tick will intersect.
     * @param {Object} tickStyle Hash of properties to apply to the tick.
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:tickLength + padding.left, y:pt.y};
        host.drawLine(path, start, end);
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @return {Object}
     * @protected
     */
    getLineStart: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:padding.left, y:0};
        if(display === "outside")
        {
            pt.x += tickLength;
        }
        else if(display === "cross")
        {
            pt.x += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} point Point on the axis in which the tick will intersect.
     * @return {Object} 
     * @protected
     */
    getLabelPoint: function(point)
    {
        return {x:point.x - this.get("leftTickOffset"), y:point.y};
    },
    
    /**
     * Updates the value for the `maxLabelSize` for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(labelWidth, labelHeight)
    {
        var host = this,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            max;
        if(rot === 0)
        {
            max = labelWidth;
        }
        else if(absRot === 90)
        {
            max = labelHeight;
        }
        else
        {
            max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
        }
        host._maxLabelSize = Math.max(host._maxLabelSize, max);
    },
    
    /**
     * Determines the available label width when the axis width has been explicitly set.
     *
     * @method getExplicitlySized
     * @return Boolean
     * @protected
     */
    getExplicitlySized: function(styles)
    {
        if(this._explicitWidth)
        {
            var host = this,
                w = host._explicitWidth,
                totalTitleSize = host._totalTitleSize,
                leftTickOffset = host.get("leftTickOffset"),
                margin = styles.label.margin.right;
            host._maxLabelSize =  w - (leftTickOffset + margin + totalTitleSize);
            return true;
        }
        return false;
    },

    /**
     * Rotate and position title.
     *
     * @method positionTitle
     * @param {HTMLElement} label to rotate position
     * @protected
     */
    positionTitle: function(label)
    {
        var host = this,
            bounds = host._titleBounds,
            margin = host.get("styles").title.margin,
            props = host._titleRotationProps,
            w = bounds.right - bounds.left,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight,
            x = (labelWidth * -0.5) + (w * 0.5),
            y = (host.get("height") * 0.5) - (labelHeight * 0.5);
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        if(margin && margin.left)
        {
            x += margin.left;
        }
        props.x = x;
        props.y = y;
        props.transformOrigin = [0.5, 0.5];
        host._rotate(label, props);
    },

    /**
     * Rotate and position labels.
     *
     * @method positionLabel
     * @param {HTMLElement} label to rotate position
     * @param {Object} pt hash containing the x and y coordinates in which the label will be positioned
     * against.
     * @protected
     */
    positionLabel: function(label, pt, styles, i)
    {
        var host = this,
            tickOffset = host.get("leftTickOffset"),
            totalTitleSize = this._totalTitleSize,
            leftOffset = pt.x + totalTitleSize - tickOffset,
            topOffset = pt.y,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            maxLabelSize = host._maxLabelSize,
            labelWidth = this._labelWidths[i],
            labelHeight = this._labelHeights[i];
        if(rot === 0)
        {
            leftOffset -= labelWidth;
            topOffset -= labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            leftOffset -= labelWidth * 0.5;
        }
        else if(rot === -90)
        {
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
        }
        else
        {
            leftOffset -= labelWidth + (labelHeight * absRot/360);
            topOffset -= labelHeight * 0.5;
        }
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        props.x = Math.round(maxLabelSize + leftOffset);
        props.y = Math.round(topOffset);
        this._rotate(label, props);
    },

    /**
     * Adjusts the coordinates of an axis label based on the rotation.
     *
     * @method _setRotationCoords
     * @param {Object} props Coordinates, dimension and rotation properties of the label.
     * @protected
     */
    _setRotationCoords: function(props)
    {
        var rot = props.rot,
            absRot = props.absRot,
            leftOffset,
            topOffset,
            labelWidth = props.labelWidth,
            labelHeight = props.labelHeight;
        if(rot === 0)
        {
            leftOffset = labelWidth;
            topOffset = labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            topOffset = 0;
            leftOffset = labelWidth * 0.5;
        }
        else if(rot === -90)
        {
            leftOffset = labelWidth * 0.5;
            topOffset = labelHeight;
        }
        else
        {
            leftOffset = labelWidth + (labelHeight * absRot/360);
            topOffset = labelHeight * 0.5;
        }
        props.x -= leftOffset;
        props.y -= topOffset;
    },

    /**
     * Returns the transformOrigin to use for an axis label based on the position of the axis 
     * and the rotation of the label.
     *
     * @method _getTransformOrigin
     * @param {Number} rot The rotation (in degrees) of the label.
     * @return Array
     * @protected
     */
    _getTransformOrigin: function(rot)
    {
        var transformOrigin;
        if(rot === 0)
        {
            transformOrigin = [0, 0];
        }
        else if(rot === 90)
        {
            transformOrigin = [0.5, 0];
        }
        else if(rot === -90)
        {
            transformOrigin = [0.5, 1];
        }
        else
        {
            transformOrigin = [1, 0.5];
        }
        return transformOrigin;
    },

    /**
     * Adjust the position of the Axis widget's content box for internal axes.
     *
     * @method offsetNodeForTick
     * @param {Node} cb Content box of the Axis.
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
    },

    /**
     * Sets the width of the axis based on its contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var host = this,
            graphic = this.get("graphic"),
            style = host.get("styles"),
            label = style.label,
            tickOffset = host.get("leftTickOffset"),
            max = host._maxLabelSize,
            totalTitleSize = this._totalTitleSize,
            ttl = Math.round(totalTitleSize + tickOffset + max + label.margin.right);
        if(this._explicitWidth)
        {
            ttl = this._explicitWidth;
        }
        this.set("calculatedWidth", ttl);
        graphic.set("x", ttl - tickOffset);
    }
};

Y.LeftAxisLayout = LeftAxisLayout;
/**
 * RightAxisLayout contains algorithms for rendering a right axis.
 *
 * @module charts
 * @submodule charts-base
 * @class RightAxisLayout
 * @constructor
 */
RightAxisLayout = function(){};

RightAxisLayout.prototype = {
    /**
     *  Default margins for text fields.
     *
     *  @private
     *  @method _getDefaultMargins
     *  @return Object
     */
    _getDefaultMargins: function() 
    {
        return {
            top: 0,
            left: 4,
            right: 0,
            bottom: 0
        };
    },

    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffset
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("topTickOffset",  0);
        host.set("bottomTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                host.set("leftTickOffset", tickLength);
                host.set("rightTickOffset", 0);
            break;
            case "outside" : 
                host.set("leftTickOffset", 0);
                host.set("rightTickOffset", tickLength);
            break;
            case "cross" :
                host.set("rightTickOffset", halfTick);
                host.set("leftTickOffset", halfTick);
            break;
            default:
                host.set("leftTickOffset", 0);
                host.set("rightTickOffset", 0);
            break;
        }
    },

    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt Point on the axis in which the tick will intersect.
     * @param {Object) tickStyle Hash of properties to apply to the tick.
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:padding.left + tickLength, y:pt.y};
        host.drawLine(path, start, end);
    },
    
    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @return {Object}
     * @protected
     */
    getLineStart: function()
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:padding.left, y:padding.top};
        if(display === "inside")
        {
            pt.x += tickLength;
        }
        else if(display === "cross")
        {
            pt.x += tickLength/2;
        }
        return pt;
    },
    
    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} point Point on the axis in which the tick will intersect.
     * @return {Object} 
     * @protected
     */
    getLabelPoint: function(point)
    {
        return {x:point.x + this.get("rightTickOffset"), y:point.y};
    },
    
    /**
     * Updates the value for the `maxLabelSize` for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(labelWidth, labelHeight)
    {
        var host = this,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            max;
        if(rot === 0)
        {
            max = labelWidth;
        }
        else if(absRot === 90)
        {
            max = labelHeight;
        }
        else
        {
            max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
        }
        host._maxLabelSize = Math.max(host._maxLabelSize, max);
    },
    
    /**
     * Determines the available label width when the axis width has been explicitly set.
     *
     * @method getExplicitlySized
     * @return Boolean
     * @protected
     */
    getExplicitlySized: function(styles)
    {
        if(this._explicitWidth)
        {
            var host = this,
                w = host._explicitWidth,
                totalTitleSize = this._totalTitleSize,
                rightTickOffset = host.get("rightTickOffset"),
                margin = styles.label.margin.right;
            host._maxLabelSize =  w - (rightTickOffset + margin + totalTitleSize);
            return true;
        }
        return false;
    },

    /**
     * Rotate and position title.
     *
     * @method positionTitle
     * @param {HTMLElement} label to rotate position
     * @protected
     */
    positionTitle: function(label)
    {
        var host = this,
            bounds = host._titleBounds,
            margin = host.get("styles").title.margin,
            props = host._titleRotationProps,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight,
            w = bounds.right - bounds.left,
            x = this.get("width") - (labelWidth * 0.5) - (w * 0.5),
            y = (host.get("height") * 0.5) - (labelHeight * 0.5);
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        if(margin && margin.right)
        {
            x -= margin.left;
        }
        props.x = x;
        props.y = y;
        props.transformOrigin = [0.5, 0.5];
        host._rotate(label, props);
    },

    /**
     * Rotate and position labels.
     *
     * @method positionLabel
     * @param {HTMLElement} label to rotate position
     * @param {Object} pt hash containing the x and y coordinates in which the label will be positioned
     * against.
     * @protected
     */
    positionLabel: function(label, pt, styles, i)
    {
        var host = this,
            tickOffset = host.get("rightTickOffset"),
            labelStyles = styles.label,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            labelWidth = this._labelWidths[i],
            labelHeight = this._labelHeights[i];
        if(labelStyles.margin && labelStyles.margin.left)
        {
            margin = labelStyles.margin.left;
        }
        if(rot === 0)
        {
            topOffset -= labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
        }
        else if(rot === -90)
        {
            leftOffset -= labelWidth * 0.5;
        }
        else
        {
            topOffset -= labelHeight * 0.5;
            leftOffset += labelHeight/2 * absRot/90;
        }
        leftOffset += margin;
        leftOffset += tickOffset;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        props.x = Math.round(leftOffset);
        props.y = Math.round(topOffset);
        this._rotate(label, props);
    },
 
    /**
     * Adjusts the coordinates of an axis label based on the rotation.
     *
     * @method _setRotationCoords
     * @param {Object} props Coordinates, dimension and rotation properties of the label.
     * @protected
     */
    _setRotationCoords: function(props)
    {
        var rot = props.rot,
            absRot = props.absRot,
            leftOffset = 0,
            topOffset = 0,
            labelWidth = props.labelWidth,
            labelHeight = props.labelHeight;
        if(rot === 0)
        {
            topOffset = labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            leftOffset = labelWidth * 0.5;
            topOffset = labelHeight;
        }
        else if(rot === -90)
        {
            leftOffset = labelWidth * 0.5;
        }
        else
        {
            topOffset = labelHeight * 0.5;
            leftOffset = labelHeight/2 * absRot/90;
        }
        props.x -= leftOffset;
        props.y -= topOffset;
    },
   
    /**
     * Returns the transformOrigin to use for an axis label based on the position of the axis 
     * and the rotation of the label.
     *
     * @method _getTransformOrigin
     * @param {Number} rot The rotation (in degrees) of the label.
     * @return Array
     * @protected
     */
    _getTransformOrigin: function(rot)
    {
        var transformOrigin;
        if(rot === 0)
        {
            transformOrigin = [0, 0];
        }
        else if(rot === 90)
        {
            transformOrigin = [0.5, 1];
        }
        else if(rot === -90)
        {
            transformOrigin = [0.5, 0];
        }
        else
        {
            transformOrigin = [0, 0.5];
        }
        return transformOrigin;
    },

    /**
     * Adjusts position for inner ticks.
     *
     * @method offsetNodeForTick
     * @param {Node} cb contentBox of the axis
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
        var host = this,
            tickOffset = host.get("leftTickOffset"),
            offset = 0 - tickOffset;
        cb.setStyle("left", offset);
    },

    /**
     * Assigns a height based on the size of the contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var host = this,
            styles = host.get("styles"),
            labelStyle = styles.label,
            totalTitleSize = this._totalTitleSize,
            ttl = Math.round(host.get("rightTickOffset") + host._maxLabelSize + totalTitleSize + labelStyle.margin.left);
        if(this._explicitWidth)
        {
            ttl = this._explicitWidth;
        }
        host.set("calculatedWidth", ttl);
        host.get("contentBox").setStyle("width", ttl);
    }
};

Y.RightAxisLayout = RightAxisLayout;
/**
 * Contains algorithms for rendering a bottom axis.
 *
 * @module charts
 * @submodule charts-base
 * @class BottomAxisLayout
 * @Constructor
 */
BottomAxisLayout = function(){};

BottomAxisLayout.prototype = {
    /**
     *  Default margins for text fields.
     *
     *  @private
     *  @method _getDefaultMargins
     *  @return Object
     */
    _getDefaultMargins: function() 
    {
        return {
            top: 4,
            left: 0,
            right: 0,
            bottom: 0
        };
    },

    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffsets
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("leftTickOffset",  0);
        host.set("rightTickOffset",  0);

        switch(display)
        {
            case "inside" :
                host.set("topTickOffset", tickLength);
                host.set("bottomTickOffset", 0);
            break;
            case "outside" : 
                host.set("topTickOffset", 0);
                host.set("bottomTickOffset", tickLength);
            break;
            case "cross":
                host.set("topTickOffset",  halfTick);
                host.set("bottomTickOffset",  halfTick);
            break;
            default:
                host.set("topTickOffset", 0);
                host.set("bottomTickOffset", 0);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @protected
     */
    getLineStart: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:0, y:padding.top};
        if(display === "inside")
        {
            pt.y += tickLength;
        }
        else if(display === "cross")
        {
            pt.y += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt hash containing x and y coordinates
     * @param {Object} tickStyles hash of properties used to draw the tick
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        host.drawLine(path, start, end);
    },

    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} pt Object containing x and y coordinates
     * @return Object
     * @protected
     */
    getLabelPoint: function(point)
    {
        return {x:point.x, y:point.y + this.get("bottomTickOffset")};
    },
    
    /**
     * Updates the value for the `maxLabelSize` for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(labelWidth, labelHeight)
    {
        var host = this,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            max;
        if(rot === 0)
        {
            max = labelHeight;
        }
        else if(absRot === 90)
        {
            max = labelWidth;
        }
        else
        {
            max = (sinRadians * labelWidth) + (cosRadians * labelHeight); 
        }
        host._maxLabelSize = Math.max(host._maxLabelSize, max);
    },
    
    /**
     * Determines the available label height when the axis width has been explicitly set.
     *
     * @method getExplicitlySized
     * @return Boolean
     * @protected
     */
    getExplicitlySized: function(styles)
    {
        if(this._explicitHeight)
        {
            var host = this,
                h = host._explicitHeight,
                totalTitleSize = host._totalTitleSize,
                bottomTickOffset = host.get("bottomTickOffset"),
                margin = styles.label.margin.right;
            host._maxLabelSize =  h - (bottomTickOffset + margin + totalTitleSize);
            return true;
        }
        return false;
    },

    /**
     * Rotate and position title.
     *
     * @method positionTitle
     * @param {HTMLElement} label to rotate position
     * @protected
     */
    positionTitle: function(label)
    {
        var host = this,
            bounds = host._titleBounds,
            margin = host.get("styles").title.margin,
            props = host._titleRotationProps,
            h = bounds.bottom - bounds.top,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight,
            x = (host.get("width") * 0.5) - (labelWidth * 0.5),
            y = host.get("height") - labelHeight/2 - h/2;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        if(margin && margin.bottom)
        {
            y -= margin.bottom;
        }
        props.x = x;
        props.y = y;
        props.transformOrigin = [0.5, 0.5];
        host._rotate(label, props);
    },
    
    /**
     * Rotate and position labels.
     *
     * @method positionLabel
     * @param {HTMLElement} label to rotate position
     * @param {Object} pt hash containing the x and y coordinates in which the label will be positioned
     * against.
     * @protected
     */
    positionLabel: function(label, pt, styles, i)
    {
        var host = this,
            tickOffset = host.get("bottomTickOffset"),
            labelStyles = styles.label,
            margin = 0,
            props = host._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            leftOffset = Math.round(pt.x),
            topOffset = Math.round(pt.y),
            labelWidth = host._labelWidths[i],
            labelHeight = host._labelHeights[i];
        if(labelStyles.margin && labelStyles.margin.top)
        {
            margin = labelStyles.margin.top;
        }
        if(rot > 0)
        {
            topOffset -= labelHeight/2 * rot/90;
        }
        else if(rot < 0)
        {
            leftOffset -= labelWidth;
            topOffset -= labelHeight/2 * absRot/90;
        }
        else
        {
            leftOffset -= labelWidth * 0.5;
        }
        topOffset += margin;
        topOffset += tickOffset;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        props.x = leftOffset;
        props.y = topOffset;
        host._rotate(label, props);
    },
    
    /**
     * Adjusts the coordinates of an axis label based on the rotation.
     *
     * @method _setRotationCoords
     * @param {Object} props Coordinates, dimension and rotation properties of the label.
     * @protected
     */
    _setRotationCoords: function(props)
    {
        var rot = props.rot,
            absRot = props.absRot,
            labelWidth = props.labelWidth,
            labelHeight = props.labelHeight,
            leftOffset,
            topOffset;

        if(rot > 0)
        {
            leftOffset = 0;
            topOffset = labelHeight/2 * rot/90;
        }
        else if(rot < 0)
        {
            leftOffset = labelWidth;
            topOffset = labelHeight/2 * absRot/90;
        }
        else
        {
            leftOffset = labelWidth * 0.5;
            topOffset = 0;
        }
        props.x -= leftOffset;
        props.y -= topOffset;
    },

    /**
     * Returns the transformOrigin to use for an axis label based on the position of the axis 
     * and the rotation of the label.
     *
     * @method _getTransformOrigin
     * @param {Number} rot The rotation (in degrees) of the label.
     * @return Array
     * @protected
     */
    _getTransformOrigin: function(rot)
    {
        var transformOrigin;
        if(rot > 0)
        {
            transformOrigin = [0, 0.5];
        }
        else if(rot < 0)
        {
            transformOrigin = [1, 0.5];
        }
        else
        {
            transformOrigin = [0, 0];
        }
        return transformOrigin;
    },

    /**
     * Adjusts position for inner ticks.
     *
     * @method offsetNodeForTick
     * @param {Node} cb contentBox of the axis
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
        var host = this;
        host.get("contentBox").setStyle("top", 0 - host.get("topTickOffset"));
    },

    /**
     * Assigns a height based on the size of the contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var host = this,
            styles = host.get("styles"),
            labelStyle = styles.label,
            totalTitleSize = host._totalTitleSize,
            ttl = Math.round(host.get("bottomTickOffset") + host._maxLabelSize + labelStyle.margin.top + totalTitleSize);
        if(host._explicitHeight)
        {
            ttl = host._explicitHeight;
        }
        host.set("calculatedHeight", ttl);
    }
};
Y.BottomAxisLayout = BottomAxisLayout;
/**
 * Contains algorithms for rendering a top axis.
 *
 * @module charts
 * @submodule charts-base
 * @class TopAxisLayout
 * @constructor
 */
TopAxisLayout = function(){};

TopAxisLayout.prototype = {
    /**
     *  Default margins for text fields.
     *
     *  @private
     *  @method _getDefaultMargins
     *  @return Object
     */
    _getDefaultMargins: function() 
    {
        return {
            top: 0,
            left: 0,
            right: 0,
            bottom: 4
        };
    },
    
    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffsets
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("leftTickOffset",  0);
        host.set("rightTickOffset",  0);
        switch(display)
        {
            case "inside" :
                host.set("bottomTickOffset", tickLength);
                host.set("topTickOffset", 0);
            break;
            case "outside" : 
                host.set("bottomTickOffset", 0);
                host.set("topTickOffset",  tickLength);
            break;
            case "cross" :
                host.set("topTickOffset", halfTick);
                host.set("bottomTickOffset", halfTick);
            break;
            default:
                host.set("topTickOffset", 0);
                host.set("bottomTickOffset", 0);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @protected
     */
    getLineStart: function()
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:0, y:padding.top};
        if(display === "outside")
        {
            pt.y += tickLength;
        }
        else if(display === "cross")
        {
            pt.y += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt hash containing x and y coordinates
     * @param {Object} tickStyles hash of properties used to draw the tick
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        host.drawLine(path, start, end);
    },
    
    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} pt hash containing x and y coordinates
     * @return Object
     * @protected
     */
    getLabelPoint: function(pt)
    {
        return {x:pt.x, y:pt.y - this.get("topTickOffset")};
    },
    
    /**
     * Updates the value for the `maxLabelSize` for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(labelWidth, labelHeight)
    {
        var host = this,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            max;
        if(rot === 0)
        {
            max = labelHeight;
        }
        else if(absRot === 90)
        {
            max = labelWidth;
        }
        else
        {
            max = (sinRadians * labelWidth) + (cosRadians * labelHeight); 
        }
        host._maxLabelSize = Math.max(host._maxLabelSize, max);
    },

    /**
     * Determines the available label height when the axis width has been explicitly set.
     *
     * @method getExplicitlySized
     * @return Boolean
     * @protected
     */
    getExplicitlySized: function(styles)
    {
        if(this._explicitHeight)
        {
            var host = this,
                h = host._explicitHeight,
                totalTitleSize = host._totalTitleSize,
                topTickOffset = host.get("topTickOffset"),
                margin = styles.label.margin.right;
            host._maxLabelSize =  h - (topTickOffset + margin + totalTitleSize);
            return true;
        }
        return false;
    },

    /**
     * Rotate and position title.
     *
     * @method positionTitle
     * @param {HTMLElement} label to rotate position
     * @protected
     */
    positionTitle: function(label)
    {
        var host = this,
            bounds = host._titleBounds,
            margin = host.get("styles").title.margin,
            props = host._titleRotationProps,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight,
            h = bounds.bottom - bounds.top,
            x = (host.get("width") * 0.5) - (labelWidth * 0.5),
            y = h/2 - labelHeight/2;
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        if(margin && margin.top)
        {
            y += margin.top;
        }
        props.x = x;
        props.y = y;
        props.transformOrigin = [0.5, 0.5];
        host._rotate(label, props);
    },

    /**
     * Rotate and position labels.
     *
     * @method positionLabel
     * @param {HTMLElement} label to rotate position
     * @param {Object} pt hash containing the x and y coordinates in which the label will be positioned
     * against.
     * @protected
     */
    positionLabel: function(label, pt, styles, i)
    {
        var host = this,
            totalTitleSize = this._totalTitleSize,
            maxLabelSize = host._maxLabelSize,
            leftOffset = pt.x,
            topOffset = pt.y + totalTitleSize + maxLabelSize,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            labelWidth = this._labelWidths[i],
            labelHeight = this._labelHeights[i];
        if(rot === 0)
        {
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
        }
        else
        {
            if(rot === 90)
            {
                leftOffset -= labelWidth;
                topOffset -= (labelHeight * 0.5);
            }
            else if (rot === -90)
            {
                topOffset -= (labelHeight * 0.5);
            }    
            else if(rot > 0)
            {
                leftOffset -= labelWidth;
                topOffset -= labelHeight - (labelHeight * rot/180);
            }
            else
            {
                topOffset -= labelHeight - (labelHeight * absRot/180);
            }
        }
        props.x = Math.round(leftOffset);
        props.y = Math.round(topOffset);
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        this._rotate(label, props);
    },

    /**
     * Adjusts the coordinates of an axis label based on the rotation.
     *
     * @method _setRotationCoords
     * @param {Object} props Coordinates, dimension and rotation properties of the label.
     * @protected
     */
    _setRotationCoords: function(props)
    {
        var rot = props.rot,
            absRot = props.absRot,
            labelWidth = props.labelWidth,
            labelHeight = props.labelHeight,
            leftOffset,
            topOffset;
        if(rot === 0)
        {
            leftOffset = labelWidth * 0.5;
            topOffset = labelHeight;
        }
        else
        {
            if(rot === 90)
            {
                leftOffset = labelWidth;
                topOffset = (labelHeight * 0.5);
            }
            else if (rot === -90)
            {
                topOffset = (labelHeight * 0.5);
            }    
            else if(rot > 0)
            {
                leftOffset = labelWidth;
                topOffset = labelHeight - (labelHeight * rot/180);
            }
            else
            {
                topOffset = labelHeight - (labelHeight * absRot/180);
            }
        }
        props.x -= leftOffset;
        props.y -= topOffset;
    },

    /**
     * Returns the transformOrigin to use for an axis label based on the position of the axis 
     * and the rotation of the label.
     *
     * @method _getTransformOrigin
     * @param {Number} rot The rotation (in degrees) of the label.
     * @return Array
     * @protected
     */
    _getTransformOrigin: function(rot)
    {
        var transformOrigin;
        if(rot === 0)
        {
            transformOrigin = [0, 0];
        }
        else
        {
            if(rot === 90)
            {
                transformOrigin = [1, 0.5];
            }
            else if (rot === -90)
            {
                transformOrigin = [0, 0.5];
            }    
            else if(rot > 0)
            {
                transformOrigin = [1, 0.5];
            }
            else
            {
                transformOrigin = [0, 0.5];
            }
        }
        return transformOrigin;
    },

    /**
     * Adjusts position for inner ticks.
     *
     * @method offsetNodeForTick
     * @param {Node} cb contentBox of the axis
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
    },

    /**
     * Assigns a height based on the size of the contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var host = this,
            graphic = host.get("graphic"),
            styles = host.get("styles"),
            labelMargin = styles.label.margin,
            totalLabelSize = labelMargin.bottom + host._maxLabelSize,
            totalTitleSize = host._totalTitleSize,
            topTickOffset = this.get("topTickOffset"),
            ttl = Math.round(topTickOffset + totalLabelSize + totalTitleSize);
        if(this._explicitHeight)
        {
           ttl = this._explicitWidth; 
        }
        host.set("calculatedHeight", ttl);
        graphic.set("y", ttl - topTickOffset);
    }
};
Y.TopAxisLayout = TopAxisLayout;

/**
 * The Axis class. Generates axes for a chart.
 *
 * @module charts
 * @submodule charts-base
 * @class Axis
 * @extends Widget
 * @uses Renderer
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 */
Y.Axis = Y.Base.create("axis", Y.Widget, [Y.Renderer], {
    /**
     * Storage for calculatedWidth value.
     *
     * @property _calculatedWidth
     * @type Number
     * @private
     */
    _calculatedWidth: 0,

    /**
     * Storage for calculatedHeight value.
     *
     * @property _calculatedHeight
     * @type Number
     * @private
     */
    _calculatedHeight: 0,

    /**
     * Handles change to the dataProvider
     * 
     * @method _dataChangeHandler
     * @param {Object} e Event object
     * @private
     */
    _dataChangeHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * Handles change to the position attribute
     *
     * @method _positionChangeHandler
     * @param {Object} e Event object
     * @private
     */
    _positionChangeHandler: function(e)
    {
        this._updateGraphic(e.newVal);
        this._updateHandler();
    },

    /**
     * Updates the the Graphic instance
     *
     * @method _updateGraphic
     * @param {String} position Position of axis 
     * @private
     */
    _updateGraphic: function(position)
    {
        var graphic = this.get("graphic");
        if(position == "none")
        {
            if(graphic)
            {
                graphic.destroy();
            }
        }
        else
        {
            if(!graphic)
            {
                this._setCanvas();
            }
        }
    },

    /**
     * Handles changes to axis.
     *
     * @method _updateHandler
     * @param {Object} e Event object
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },
   
    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        this._updateGraphic(this.get("position"));
    },

    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        var layout = this._layout,
            defaultMargins,
            styles,
            label,
            title,
            i;
        if(layout)
        {
            defaultMargins = layout._getDefaultMargins();
            styles = this.get("styles");
            label = styles.label.margin;
            title =styles.title.margin;
            //need to defaultMargins method to the layout classes.
            for(i in defaultMargins)
            {
                if(defaultMargins.hasOwnProperty(i))
                {
                    label[i] = label[i] === undefined ? defaultMargins[i] : label[i];
                    title[i] = title[i] === undefined ? defaultMargins[i] : title[i];
                }
            }
        }
        this._drawAxis();
    },

    /**
     * Creates a graphic instance to be used for the axis line and ticks.
     *
     * @method _setCanvas
     * @private
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            bb = this.get("boundingBox"),
            p = this.get("position"),
            pn = this._parentNode,
            w = this.get("width"),
            h = this.get("height");
        bb.setStyle("position", "absolute");
        bb.setStyle("zIndex", 2);
        w = w ? w + "px" : pn.getStyle("width");
        h = h ? h + "px" : pn.getStyle("height");
        if(p === "top" || p === "bottom")
        {
            cb.setStyle("width", w);
        }
        else
        {
            cb.setStyle("height", h);
        }
        cb.setStyle("position", "relative");
        cb.setStyle("left", "0px");
        cb.setStyle("top", "0px");
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(cb);
    },
	
    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        var axisstyles = {
            majorTicks: {
                display:"inside",
                length:4,
                color:"#dad8c9",
                weight:1,
                alpha:1
            },
            minorTicks: {
                display:"none",
                length:2,
                color:"#dad8c9",
                weight:1
            },
            line: {
                weight:1,
                color:"#dad8c9",
                alpha:1
            },
            majorUnit: {
                determinant:"count",
                count:11,
                distance:75
            },
            top: "0px",
            left: "0px",
            width: "100px",
            height: "100px",
            label: {
                color:"#808080",
                alpha: 1,
                fontSize:"85%",
                rotation: 0,
                margin: {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined
                }
            },
            title: {
                color:"#808080",
                alpha: 1,
                fontSize:"85%",
                rotation: undefined,
                margin: {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined
                }
            },
            hideOverlappingLabelTicks: false
        };
        
        return Y.merge(Y.Renderer.prototype._getDefaultStyles(), axisstyles); 
    },

    /**
     * Updates the axis when the size changes.
     *
     * @method _handleSizeChange
     * @param {Object} e Event object.
     * @private
     */
    _handleSizeChange: function(e)
    {
        var attrName = e.attrName,
            pos = this.get("position"),
            vert = pos == "left" || pos == "right",
            cb = this.get("contentBox"),
            hor = pos == "bottom" || pos == "top";
        cb.setStyle("width", this.get("width"));
        cb.setStyle("height", this.get("height"));
        if((hor && attrName == "width") || (vert && attrName == "height"))
        {
            this._drawAxis();
        }
    },
   
    /**
     * Maps key values to classes containing layout algorithms
     *
     * @property _layoutClasses
     * @type Object
     * @private
     */
    _layoutClasses: 
    {
        top : TopAxisLayout,
        bottom: BottomAxisLayout,
        left: LeftAxisLayout,
        right : RightAxisLayout
    },
    
    /**
     * Draws a line segment between 2 points
     *
     * @method drawLine
     * @param {Object} startPoint x and y coordinates for the start point of the line segment
     * @param {Object} endPoint x and y coordinates for the for the end point of the line segment
     * @param {Object} line styles (weight, color and alpha to be applied to the line segment)
     * @private
     */
    drawLine: function(path, startPoint, endPoint)
    {
        path.moveTo(startPoint.x, startPoint.y);
        path.lineTo(endPoint.x, endPoint.y);
    },

    /**
     * Generates the properties necessary for rotating and positioning a text field.
     *
     * @method _getTextRotationProps
     * @param {Object} styles properties for the text field
     * @return Object
     * @private
     */
    _getTextRotationProps: function(styles)
    {
        if(styles.rotation === undefined)
        {
            switch(this.get("position"))
            {
                case "left" :
                    styles.rotation = -90;
                break; 
                case "right" : 
                    styles.rotation = 90;
                break;
                default :
                    styles.rotation = 0;
                break;
            }
        }
        var rot =  Math.min(90, Math.max(-90, styles.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8));
        return {
            rot: rot,
            absRot: absRot,
            radCon: radCon,
            sinRadians: sinRadians,
            cosRadians: cosRadians,
            textAlpha: styles.alpha
        };
    },

    /**
     * Draws an axis. 
     *
     * @method _drawAxis
     * @private
     */
    _drawAxis: function ()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        if(this._layout)
        {
            var styles = this.get("styles"),
                line = styles.line,
                labelStyles = styles.label,
                majorTickStyles = styles.majorTicks,
                drawTicks = majorTickStyles.display != "none",
                tickPoint,
                majorUnit = styles.majorUnit,
                len,
                majorUnitDistance,
                i = 0,
                layout = this._layout,
                layoutLength,
                position,
                lineStart,
                label,
                labelWidth,
                labelHeight,
                labelFunction = this.get("labelFunction"),
                labelFunctionScope = this.get("labelFunctionScope"),
                labelFormat = this.get("labelFormat"),
                graphic = this.get("graphic"),
                path = this.get("path"),
                tickPath,
                explicitlySized;
            this._labelWidths = [];
            this._labelHeights = [];
            graphic.set("autoDraw", false);
            path.clear();
            path.set("stroke", {
                weight: line.weight, 
                color: line.color, 
                opacity: line.alpha
            });
            this._labelRotationProps = this._getTextRotationProps(labelStyles);
            this._labelRotationProps.transformOrigin = layout._getTransformOrigin(this._labelRotationProps.rot);
            layout.setTickOffsets.apply(this);
            layoutLength = this.getLength();
            lineStart = layout.getLineStart.apply(this);
            len = this.getTotalMajorUnits(majorUnit);
            majorUnitDistance = this.getMajorUnitDistance(len, layoutLength, majorUnit);
            this.set("edgeOffset", this.getEdgeOffset(len, layoutLength) * 0.5);
            if(len < 1)
            {
                this._clearLabelCache();
            }
            else
            {
                tickPoint = this.getFirstPoint(lineStart);
                this.drawLine(path, lineStart, this.getLineEnd(tickPoint));
                if(drawTicks) 
                {
                    tickPath = this.get("tickPath");
                    tickPath.clear();
                    tickPath.set("stroke", {
                        weight: majorTickStyles.weight,
                        color: majorTickStyles.color,
                        opacity: majorTickStyles.alpha
                    });
                   layout.drawTick.apply(this, [tickPath, tickPoint, majorTickStyles]);
                }
                this._createLabelCache();
                this._tickPoints = [];
                this._maxLabelSize = 0; 
                this._totalTitleSize = 0;
                this._titleSize = 0;
                this._setTitle();
                explicitlySized = layout.getExplicitlySized.apply(this, [styles]);
                for(; i < len; ++i)
                {
                    if(drawTicks) 
                    {
                        layout.drawTick.apply(this, [tickPath, tickPoint, majorTickStyles]);
                    }
                    position = this.getPosition(tickPoint);
                    label = this.getLabel(tickPoint, labelStyles);
                    this._labels.push(label);
                    this._tickPoints.push({x:tickPoint.x, y:tickPoint.y});
                    this.get("appendLabelFunction")(label, labelFunction.apply(labelFunctionScope, [this.getLabelByIndex(i, len), labelFormat]));
                    labelWidth = Math.round(label.offsetWidth);
                    labelHeight = Math.round(label.offsetHeight);
                    if(!explicitlySized)
                    {
                        this._layout.updateMaxLabelSize.apply(this, [labelWidth, labelHeight]);
                    }
                    this._labelWidths.push(labelWidth);
                    this._labelHeights.push(labelHeight);
                    tickPoint = this.getNextPoint(tickPoint, majorUnitDistance);
                }
                this._clearLabelCache();
                if(this.get("overlapGraph"))
                {
                   layout.offsetNodeForTick.apply(this, [this.get("contentBox")]);
                }
                layout.setCalculatedSize.apply(this);
                if(this._titleTextField)
                {
                    this._layout.positionTitle.apply(this, [this._titleTextField]);
                }
                for(i = 0; i < len; ++i)
                {
                    layout.positionLabel.apply(this, [this.get("labels")[i], this._tickPoints[i], styles, i]);
                }
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._drawAxis();
        }
        else
        {
            this._updatePathElement();
            this.fire("axisRendered");
        }
    },
    
    /**
     * Calculates and sets the total size of a title.
     *
     * @method _setTotalTitleSize
     * @param {Object} styles Properties for the title field.
     * @private
     */
    _setTotalTitleSize: function(styles)
    {
        var title = this._titleTextField,
            w = title.offsetWidth,
            h = title.offsetHeight,
            rot = this._titleRotationProps.rot,
            bounds,
            size,
            margin = styles.margin,
            position = this.get("position"),
            matrix = new Y.Matrix();
        matrix.rotate(rot);
        bounds = matrix.getContentRect(w, h);
        if(position == "left" || position == "right")
        {
            size = bounds.right - bounds.left;
            if(margin)
            {
                size += margin.left + margin.right;
            }
        }
        else
        {
            size = bounds.bottom - bounds.top;
            if(margin)
            {
                size += margin.top + margin.bottom;
            }
        }
        this._titleBounds = bounds;
        this._totalTitleSize = size;
    },

    /**
     *  Updates path.
     *
     *  @method _updatePathElement
     *  @private
     */
    _updatePathElement: function()
    {
        var path = this._path,
            tickPath = this._tickPath,
            redrawGraphic = false,
            graphic = this.get("graphic");
        if(path)
        {
            redrawGraphic = true;
            path.end();
        }
        if(tickPath)
        {
            redrawGraphic = true;
            tickPath.end();
        }
        if(redrawGraphic)
        {
            graphic._redraw();
        }
    },

    /**
     * Updates the content and style properties for a title field.
     *
     * @method _updateTitle
     * @private
     */
    _setTitle: function()
    {
        var i,
            styles,
            customStyles,
            title = this.get("title"),
            titleTextField = this._titleTextField,
            parentNode;
        if(title !== null && title !== undefined)
        {
            customStyles = {
                    rotation: "rotation",
                    margin: "margin",
                    alpha: "alpha"
            };
            styles = this.get("styles").title;
            if(!titleTextField)
            {
                titleTextField = DOCUMENT.createElement('span');
                titleTextField.style.display = "block";
                titleTextField.style.whiteSpace = "nowrap";
                titleTextField.setAttribute("class", "axisTitle");
                this.get("contentBox").append(titleTextField);
            }
            else if(!DOCUMENT.createElementNS)
            {
                if(titleTextField.style.filter)
                {
                    titleTextField.style.filter = null;
                }
            }
            titleTextField.style.position = "absolute";
            for(i in styles)
            {
                if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
                {
                    titleTextField.style[i] = styles[i];
                }
            }
            this.get("appendTitleFunction")(titleTextField, title);
            this._titleTextField = titleTextField;
            this._titleRotationProps = this._getTextRotationProps(styles);
            this._setTotalTitleSize(styles);
        }
        else if(titleTextField)
        {
            parentNode = titleTextField.parentNode;
            if(parentNode)
            {
                parentNode.removeChild(titleTextField);
            }
            this._titleTextField = null;
            this._totalTitleSize = 0;
        }
    },

    /**
     * Creates or updates an axis label.
     *
     * @method getLabel
     * @param {Object} pt x and y coordinates for the label
     * @param {Object} styles styles applied to label
     * @return HTMLElement 
     * @private
     */
    getLabel: function(pt, styles)
    {
        var i,
            label,
            labelCache = this._labelCache,
            customStyles = {
                rotation: "rotation",
                margin: "margin",
                alpha: "alpha"
            };
        if(labelCache && labelCache.length > 0)
        {
            label = labelCache.shift();
        }
        else
        {
            label = DOCUMENT.createElement("span");
            label.className = Y.Lang.trim([label.className, "axisLabel"].join(' '));
            this.get("contentBox").append(label);
        }
        if(!DOCUMENT.createElementNS)
        {
            if(label.style.filter)
            {
                label.style.filter = null;
            }
        }
        label.style.display = "block";
        label.style.whiteSpace = "nowrap";
        label.style.position = "absolute";
        for(i in styles)
        {
            if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
            {
                label.style[i] = styles[i];
            }
        }
        return label;
    },

    /**
     * Creates a cache of labels that can be re-used when the axis redraws.
     *
     * @method _createLabelCache
     * @private
     */
    _createLabelCache: function()
    {
        if(this._labels)
        {
            while(this._labels.length > 0)
            {
                this._labelCache.push(this._labels.shift());
            }
        }
        else
        {
            this._clearLabelCache();
        }
        this._labels = [];
    },
    
    /**
     * Removes axis labels from the dom and clears the label cache.
     *
     * @method _clearLabelCache
     * @private
     */
    _clearLabelCache: function()
    {
        if(this._labelCache)
        {
            var len = this._labelCache.length,
                i = 0,
                label;
            for(; i < len; ++i)
            {
                label = this._labelCache[i];
                this._removeChildren(label);
                Y.Event.purgeElement(label, true);
                label.parentNode.removeChild(label);
            }
        }
        this._labelCache = [];
    },

    /**
     * Gets the end point of an axis.
     *
     * @method getLineEnd
     * @return Object
     * @private 
     */
    getLineEnd: function(pt)
    {
        var w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w, y:pt.y};
        }
        else
        {
            return {x:pt.x, y:h};
        }
    },

    /**
     * Calcuates the width or height of an axis depending on its direction.
     *
     * @method getLength
     * @return Number
     * @private
     */
    getLength: function()
    {
        var l,
            style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            h = this.get("height"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            l = w - (padding.left + padding.right);
        }
        else
        {
            l = h - (padding.top + padding.bottom);
        }
        return l;
    },

    /**
     * Gets the position of the first point on an axis.
     *
     * @method getFirstPoint
     * @param {Object} pt Object containing x and y coordinates.
     * @return Object
     * @private
     */
    getFirstPoint:function(pt)
    {
        var style = this.get("styles"),
            pos = this.get("position"),
            padding = style.padding,
            np = {x:pt.x, y:pt.y};
        if(pos === "top" || pos === "bottom")
        {
            np.x += padding.left + this.get("edgeOffset");
        }
        else
        {
            np.y += this.get("height") - (padding.top + this.get("edgeOffset"));
        }
        return np;
    },

    /**
     * Gets the position of the next point on an axis.
     *
     * @method getNextPoint
     * @param {Object} point Object containing x and y coordinates.
     * @param {Number} majorUnitDistance Distance in pixels between ticks.
     * @return Object
     * @private
     */
    getNextPoint: function(point, majorUnitDistance)
    {
        var pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            point.x = point.x + majorUnitDistance;		
        }
        else
        {
            point.y = point.y - majorUnitDistance;
        }
        return point;
    },

    /**
     * Calculates the placement of last tick on an axis.
     *
     * @method getLastPoint
     * @return Object
     * @private 
     */
    getLastPoint: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            w = this.get("width"),
            pos = this.get("position");
        if(pos === "top" || pos === "bottom")
        {
            return {x:w - padding.right, y:padding.top};
        }
        else
        {
            return {x:padding.left, y:padding.top};
        }
    },

    /**
     * Calculates position on the axis.
     *
     * @method getPosition
     * @param {Object} point contains x and y values
     * @private 
     */
    getPosition: function(point)
    {
        var p,
            h = this.get("height"),
            style = this.get("styles"),
            padding = style.padding,
            pos = this.get("position"),
            dataType = this.get("dataType");
        if(pos === "left" || pos === "right") 
        {
            //Numeric data on a vertical axis is displayed from bottom to top.
            //Categorical and Timeline data is displayed from top to bottom.
            if(dataType === "numeric")
            {
                p = (h - (padding.top + padding.bottom)) - (point.y - padding.top);
            }
            else
            {
                p = point.y - padding.top;
            }
        }
        else
        {
            p = point.x - padding.left;
        }
        return p;
    },

    /**
     * Rotates and positions a text field.
     *
     * @method _rotate
     * @param {HTMLElement} label text field to rotate and position
     * @param {Object} props properties to be applied to the text field. 
     * @private
     */
    _rotate: function(label, props)
    {
        var rot = props.rot,
            x = props.x,
            y = props.y,
            filterString,
            textAlpha,
            matrix = new Y.Matrix(),
            transformOrigin = props.transformOrigin || [0, 0],
            offsetRect;
        if(DOCUMENT.createElementNS)
        {
            matrix.translate(x, y);
            matrix.rotate(rot);
            Y_DOM.setStyle(label, "transformOrigin", (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%");
            Y_DOM.setStyle(label, "transform", matrix.toCSSText());
        }
        else
        {
            textAlpha = props.textAlpha;
            if(Y_Lang.isNumber(textAlpha) && textAlpha < 1 && textAlpha > -1 && !isNaN(textAlpha))
            {
                filterString = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(textAlpha * 100) + ")";
            }
            if(rot !== 0)
            {
                //ms filters kind of, sort of uses a transformOrigin of 0, 0. 
                //we'll translate the difference to create a true 0, 0 origin.
                matrix.rotate(rot);
                offsetRect = matrix.getContentRect(props.labelWidth, props.labelHeight);
                matrix.init();
                matrix.translate(offsetRect.left, offsetRect.top);
                matrix.translate(x, y);
                this._simulateRotateWithTransformOrigin(matrix, rot, transformOrigin, props.labelWidth, props.labelHeight);
                if(filterString)
                {
                    filterString += " ";
                }
                else
                {
                    filterString = ""; 
                }
                filterString += matrix.toFilterText();
                label.style.left = matrix.dx + "px";
                label.style.top = matrix.dy + "px";
            }
            else
            {
                label.style.left = x + "px";
                label.style.top = y + "px";
            }
            if(filterString)
            {
                label.style.filter = filterString;
            }
        }
    },
    
    /**
     * Simulates a rotation with a specified transformOrigin. 
     *
     * @method _simulateTransformOrigin
     * @param {Matrix} matrix Reference to a `Matrix` instance.
     * @param {Number} rot The rotation (in degrees) that will be performed on a matrix.
     * @param {Array} transformOrigin An array represeniting the origin in which to perform the transform. The first 
     * index represents the x origin and the second index represents the y origin.
     * @param {Number} w The width of the object that will be transformed.
     * @param {Number} h The height of the object that will be transformed.
     * @private
     */
    _simulateRotateWithTransformOrigin: function(matrix, rot, transformOrigin, w, h)
    {
        var transformX = transformOrigin[0] * w,
            transformY = transformOrigin[1] * h;
        transformX = !isNaN(transformX) ? transformX : 0;
        transformY = !isNaN(transformY) ? transformY : 0;
        matrix.translate(transformX, transformY);
        matrix.rotate(rot);
        matrix.translate(-transformX, -transformY);
    },

    /**
     * Returns the coordinates (top, right, bottom, left) for the bounding box of the last label. 
     *
     * @method getMaxLabelBounds
     * @return Object
     */
    getMaxLabelBounds: function()
    {
        return this._getLabelBounds(this.getMaximumValue());
    },

    /**
     * Returns the coordinates (top, right, bottom, left) for the bounding box of the first label. 
     *
     * @method getMinLabelBounds
     * @return Object
     */
    getMinLabelBounds: function()
    {
        return this._getLabelBounds(this.getMinimumValue());
    },
    
    /**
     * Returns the coordinates (top, right, bottom, left) for the bounding box of a label. 
     *
     * @method _getLabelBounds
     * @param {String} Value of the label
     * @return Object
     * @private
     */
    _getLabelBounds: function(val)
    {
        var layout = this._layout,
            labelStyles = this.get("styles").label,
            matrix = new Y.Matrix(),
            label,
            props = this._getTextRotationProps(labelStyles);
            props.transformOrigin = layout._getTransformOrigin(props.rot);
        label = this.getLabel({x: 0, y: 0}, labelStyles);
        this.get("appendLabelFunction")(label, this.get("labelFunction").apply(this, [val, this.get("labelFormat")]));
        props.labelWidth = label.offsetWidth;
        props.labelHeight = label.offsetHeight;
        this._removeChildren(label);
        Y.Event.purgeElement(label, true);
        label.parentNode.removeChild(label);
        props.x = 0;
        props.y = 0;
        layout._setRotationCoords(props);
        matrix.translate(props.x, props.y);
        this._simulateRotateWithTransformOrigin(matrix, props.rot, props.transformOrigin, props.labelWidth, props.labelHeight);
        return matrix.getContentRect(props.labelWidth, props.labelHeight);
    },

    /**
     * Removes all DOM elements from an HTML element. Used to clear out labels during detruction
     * phase.
     *
     * @method _removeChildren
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },
    
    /**
     * Destructor implementation Axis class. Removes all labels and the Graphic instance from the widget.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        var cb = this.get("contentBox").getDOMNode(),
            labels = this.get("labels"),
            graphic = this.get("graphic"),
            label,
            len = labels ? labels.length : 0;
        if(len > 0)
        {
            while(labels.length > 0)
            {
                label = labels.shift();
                this._removeChildren(label);
                cb.removeChild(label);
                label = null;
            }
        }
        if(graphic)
        {
            graphic.destroy();
        }
    },

    /**
     * Length in pixels of largest text bounding box. Used to calculate the height of the axis.
     *
     * @property maxLabelSize
     * @type Number
     * @protected
     */
    _maxLabelSize: 0,
    
    /**
     * Updates the content of text field. This method writes a value into a text field using 
     * `appendChild`. If the value is a `String`, it is converted to a `TextNode` first. 
     *
     * @method _setText
     * @param label {HTMLElement} label to be updated
     * @param val {String} value with which to update the label
     * @private
     */
    _setText: function(textField, val)
    { 
        textField.innerHTML = "";
        if(Y_Lang.isNumber(val))
        {
            val = val + "";
        }
        else if(!val)
        {
            val = "";
        }
        if(IS_STRING(val))
        {
            val = DOCUMENT.createTextNode(val);
        }
        textField.appendChild(val);
    }
}, {
    ATTRS: 
    {
        /**
         * When set, defines the width of a vertical axis instance. By default, vertical axes automatically size based on their contents. When the
         * width attribute is set, the axis will not calculate its width. When the width attribute is explicitly set, axis labels will postion themselves off of the 
         * the inner edge of the axis and the title, if present, will position itself off of the outer edge. If a specified width is less than the sum of 
         * the axis' contents, excess content will overflow.
         *
         * @attribute width
         * @type Number
         */
        width: {
            lazyAdd: false,

            getter: function() 
            {
                if(this._explicitWidth)
                {
                    return this._explicitWidth;        
                }
                return this._calculatedWidth;
            },

            setter: function(val)
            {
                this._explicitWidth = val;
                return val;
            }
        },

        /**
         * When set, defines the height of a horizontal axis instance. By default, horizontal axes automatically size based on their contents. When the
         * height attribute is set, the axis will not calculate its height. When the height attribute is explicitly set, axis labels will postion themselves off of the 
         * the inner edge of the axis and the title, if present, will position itself off of the outer edge. If a specified height is less than the sum of 
         * the axis' contents, excess content will overflow.
         *
         * @attribute height
         * @type Number
         */
        height: {
            lazyAdd: false,

            getter: function() 
            {
                if(this._explicitHeight)
                {
                    return this._explicitHeight;        
                }
                return this._calculatedHeight;
            },

            setter: function(val)
            {
                this._explicitHeight = val;
                return val;
            }
        },

        /**
         * Calculated value of an axis' width. By default, the value is used internally for vertical axes. If the `width` attribute is explicitly set, this value will be ignored.
         *
         * @attribute calculatedWidth
         * @type Number
         * @private
         */
        calculatedWidth: {
            getter: function()
            {
                return this._calculatedWidth;
            },

            setter: function(val)
            {
                this._calculatedWidth = val;
                return val;
            }
        },

        /**
         * Calculated value of an axis' height. By default, the value is used internally for horizontal axes. If the `height` attribute is explicitly set, this value will be ignored.
         *
         * @attribute calculatedHeight
         * @type Number
         * @private
         */
        calculatedHeight: {
            getter: function()
            {
                return this._calculatedHeight;
            },

            setter: function(val)
            {
                this._calculatedHeight = val;
                return val;
            }
        },

        /**
         * Difference betweend the first/last tick and edge of axis.
         *
         * @attribute edgeOffset
         * @type Number
         * @protected
         */
        edgeOffset: 
        {
            value: 0
        },

        /**
         * The graphic in which the axis line and ticks will be rendered.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {},
    
        /**
         *  @attribute path
         *  @type Shape
         *  @readOnly
         *  @private
         */
        path: {
            readOnly: true,

            getter: function()
            {
                if(!this._path)
                {
                    var graphic = this.get("graphic");
                    if(graphic)
                    {
                        this._path = graphic.addShape({type:"path"});
                    }
                }
                return this._path;
            }
        },

        /**
         *  @attribute tickPath
         *  @type Shape
         *  @readOnly
         *  @private
         */
        tickPath: {
            readOnly: true,

            getter: function()
            {
                if(!this._tickPath)
                {
                    var graphic = this.get("graphic");
                    if(graphic)
                    {
                        this._tickPath = graphic.addShape({type:"path"});
                    }
                }
                return this._tickPath;
            }
        },
        
        /**
         * Contains the contents of the axis. 
         *
         * @attribute node
         * @type HTMLElement
         */
        node: {},

        /**
         * Direction of the axis.
         *
         * @attribute position
         * @type String
         */
        position: {
            setter: function(val)
            {
                var layoutClass = this._layoutClasses[val];
                if(val && val != "none")
                {
                    this._layout = new layoutClass();
                }
                return val;
            }
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the top of the axis.
         *
         * @attribute topTickOffset
         * @type Number
         */
        topTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the bottom of the axis.
         *
         * @attribute bottomTickOffset
         * @type Number
         */
        bottomTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the left of the axis.
         *
         * @attribute leftTickOffset
         * @type Number
         */
        leftTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the right side of the axis.
         *
         * @attribute rightTickOffset
         * @type Number
         */
        rightTickOffset: {
            value: 0
        },
        
        /**
         * Collection of labels used to render the axis.
         *
         * @attribute labels
         * @type Array
         */
        labels: {
            readOnly: true,
            getter: function()
            {
                return this._labels;
            }
        },

        /**
         * Collection of points used for placement of labels and ticks along the axis.
         *
         * @attribute tickPoints
         * @type Array
         */
        tickPoints: {
            readOnly: true,

            getter: function()
            {
                if(this.get("position") == "none")
                {
                    return this.get("styles").majorUnit.count;
                }
                return this._tickPoints;
            }
        },

        /**
         * Indicates whether the axis overlaps the graph. If an axis is the inner most axis on a given
         * position and the tick position is inside or cross, the axis will need to overlap the graph.
         *
         * @attribute overlapGraph
         * @type Boolean
         */
        overlapGraph: {
            value:true,

            validator: function(val)
            {
                return Y_Lang.isBoolean(val);
            }
        },

        /**
         * Object which should have by the labelFunction
         *
         * @attribute labelFunctionScope
         * @type Object
         */
        labelFunctionScope: {},
        
        /**
         * Length in pixels of largest text bounding box. Used to calculate the height of the axis.
         *
         * @attribute maxLabelSize
         * @type Number
         * @protected
         */
        maxLabelSize: {
            getter: function()
            {
                return this._maxLabelSize;
            },

            setter: function(val)
            {
                this._maxLabelSize = val;
                return val; 
            }
        },
        
        /**
         *  Title for the axis. When specified, the title will display. The position of the title is determined by the axis position. 
         *  <dl>
         *      <dt>top</dt><dd>Appears above the axis and it labels. The default rotation is 0.</dd>
         *      <dt>right</dt><dd>Appears to the right of the axis and its labels. The default rotation is 90.</dd>
         *      <dt>bottom</dt><dd>Appears below the axis and its labels. The default rotation is 0.</dd>
         *      <dt>left</dt><dd>Appears to the left of the axis and its labels. The default rotation is -90.</dd>
         *  </dl>
         *
         *  @attribute title
         *  @type String
         */
        title: {
            value: null
        },
        
        /**
         * Method used for formatting a label. This attribute allows for the default label formatting method to overridden. The method use would need
         * to implement the arguments below and return a `String` or `HTMLElement`. 
         * <dl>
         *      <dt>val</dt><dd>Label to be formatted. (`String`)</dd>
         *      <dt>format</dt><dd>Template for formatting label. (optional)</dd>
         * </dl>
         *
         * @attribute labelFunction
         * @type Function
         */
        labelFunction: {
            value: function(val, format)
            {
                return val;
            }
        },
        
        /**
         * Function used to append an axis value to an axis label. This function has the following signature:
         *  <dl>
         *      <dt>textField</dt><dd>The axis label to be appended. (`HTMLElement`)</dd>
         *      <dt>val</dt><dd>The value to attach to the text field. This method will accept an `HTMLELement`
         *      or a `String`. This method does not use (`HTMLElement` | `String`)</dd>
         *  </dl>
         * The default method appends a value to the `HTMLElement` using the `appendChild` method. If the given 
         * value is a `String`, the method will convert the the value to a `textNode` before appending to the 
         * `HTMLElement`. This method will not convert an `HTMLString` to an `HTMLElement`. 
         *
         * @attribute appendLabelFunction
         * @type Function
         */
        appendLabelFunction: {
            valueFn: function()
            {
                return this._setText;
            }
        },
        
        /**
         * Function used to append a title value to the title object. This function has the following signature:
         *  <dl>
         *      <dt>textField</dt><dd>The title text field to be appended. (`HTMLElement`)</dd>
         *      <dt>val</dt><dd>The value to attach to the text field. This method will accept an `HTMLELement`
         *      or a `String`. This method does not use (`HTMLElement` | `String`)</dd>
         *  </dl>
         * The default method appends a value to the `HTMLElement` using the `appendChild` method. If the given 
         * value is a `String`, the method will convert the the value to a `textNode` before appending to the 
         * `HTMLElement` element. This method will not convert an `HTMLString` to an `HTMLElement`. 
         *
         * @attribute appendTitleFunction
         * @type Function
         */
        appendTitleFunction: {
            valueFn: function()
            {
                return this._setText;
            }
        }
            
        /**
         * Style properties used for drawing an axis. This attribute is inherited from `Renderer`. Below are the default values:
         *  <dl>
         *      <dt>majorTicks</dt><dd>Properties used for drawing ticks.
         *          <dl>
         *              <dt>display</dt><dd>Position of the tick. Possible values are `inside`, `outside`, `cross` and `none`. The
         *              default value is `inside`.</dd>
         *              <dt>length</dt><dd>The length (in pixels) of the tick. The default value is 4.</dd>
         *              <dt>color</dt><dd>The color of the tick. The default value is `#dad8c9`</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the tick. The default value is 1.</dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the tick. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>line</dt><dd>Properties used for drawing the axis line. 
         *          <dl>
         *              <dt>weight</dt><dd>Number indicating the width of the axis line. The default value is 1.</dd>
         *              <dt>color</dt><dd>The color of the axis line. The default value is `#dad8c9`.</dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the tick. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>majorUnit</dt><dd>Properties used to calculate the `majorUnit` for the axis. 
         *          <dl>
         *              <dt>determinant</dt><dd>The algorithm used for calculating distance between ticks. The possible options are `count` and `distance`. If
         *              the `determinant` is `count`, the axis ticks will spaced so that a specified number of ticks appear on the axis. If the `determinant`
         *              is `distance`, the axis ticks will spaced out according to the specified distance. The default value is `count`.</dd>
         *              <dt>count</dt><dd>Number of ticks to appear on the axis when the `determinant` is `count`. The default value is 11.</dd>
         *              <dt>distance</dt><dd>The distance (in pixels) between ticks when the `determinant` is `distance`. The default value is 75.</dd>
         *          </dl>
         *      </dd>
         *      <dt>label</dt><dd>Properties and styles applied to the axis labels.
         *          <dl>
         *              <dt>color</dt><dd>The color of the labels. The default value is `#808080`.</dd>
         *              <dt>alpha</dt><dd>Number between 0 and 1 indicating the opacity of the labels. The default value is 1.</dd>
         *              <dt>fontSize</dt><dd>The font-size of the labels. The default value is 85%</dd>
         *              <dt>rotation</dt><dd>The rotation, in degrees (between -90 and 90) of the labels. The default value is 0.</dd>
         *              <dt>margin</dt><dd>The distance between the label and the axis/tick. Depending on the position of the `Axis`, only one of the properties used.
         *                  <dl>
         *                      <dt>top</dt><dd>Pixel value used for an axis with a `position` of `bottom`. The default value is 4.</dd>
         *                      <dt>right</dt><dd>Pixel value used for an axis with a `position` of `left`. The default value is 4.</dd>
         *                      <dt>bottom</dt><dd>Pixel value used for an axis with a `position` of `top`. The default value is 4.</dd>
         *                      <dt>left</dt><dd>Pixel value used for an axis with a `position` of `right`. The default value is 4.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
/**
 * AxisType is an abstract class that manages the data for an axis.
 *
 * @module charts
 * @submodule charts-base
 * @class AxisType
 * @constructor
 * @extends Axis
 */
Y.AxisType = Y.Base.create("baseAxis", Y.Axis, [], {
    /**
     * @method initializer
     * @private
     */
    initializer: function()
    {
        this.after("dataReady", Y.bind(this._dataChangeHandler, this));
        this.after("dataUpdate", Y.bind(this._dataChangeHandler, this));
        this.after("minimumChange", Y.bind(this._keyChangeHandler, this));
        this.after("maximumChange", Y.bind(this._keyChangeHandler, this));
        this.after("keysChange", this._keyChangeHandler);
        this.after("dataProviderChange", this._dataProviderChangeHandler);
        this.after("alwaysShowZeroChange", this._keyChangeHandler);
        this.after("roundingMethodChange", this._keyChangeHandler);
    },

    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        this.after("stylesChange", this._updateHandler);
        this.after("overlapGraphChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("widthChange", this._handleSizeChange);
        this.after("heightChange", this._handleSizeChange);
        this.after("calculatedWidthChange", this._handleSizeChange);
        this.after("calculatedHeightChange", this._handleSizeChange);
    },

    /**
     * Handles changes to `dataProvider`.
     *
     * @method _dataProviderChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _dataProviderChangeHandler: function(e)
    {
        var keyCollection = this.get("keyCollection").concat(),
            keys = this.get("keys"),
            i;
        if(keys)
        {
            for(i in keys)
            {
                if(keys.hasOwnProperty(i))
                {
                    delete keys[i];
                }
            }
        }
        if(keyCollection && keyCollection.length)
        {
            this.set("keys", keyCollection);
        }
    },

    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuibaseaxis",
	
    /**
     * Type of data used in `Axis`.
     *
     * @property _type
     * @type String 
     * @readOnly
     * @private
     */
    _type: null,
	
    /**
     * Storage for `setMaximum` attribute.
     *
     * @property _setMaximum
     * @type Object
     * @private
     */
    _setMaximum: null,
	
    /**
     * Storage for `dataMaximum` attribute.
     *
     * @property _dataMaximum
     * @type Object
     * @private
     */
    _dataMaximum: null,
	
    /**
     * Storage for `setMinimum` attribute.
     *
     * @property _setMinimum
     * @type Object
     * @private
     */
    _setMinimum: null,
	
    /**
     * Reference to data array.
     *
     * @property _data
     * @type Array
     * @private
     */
    _data: null,

    /**
     * Indicates whether the all data is up to date.
     *
     * @property _updateTotalDataFlag
     * @type Boolean
     * @private
     */
    _updateTotalDataFlag: true,

    /**
     * Storage for `dataReady` attribute.
     *
     * @property _dataReady
     * @type Boolean
     * @readOnly
     * @private
     */
    _dataReady: false,
	
    /**
     * Adds an array to the key hash.
     *
     * @method addKey
     * @param value Indicates what key to use in retrieving
     * the array.
     */
    addKey: function (value)
	{
        this.set("keys", value);
	},

    /**
     * Gets an array of values based on a key.
     *
     * @method _getKeyArray
     * @param {String} key Value key associated with the data array.
     * @param {Array} data Array in which the data resides.
     * @return Array
     * @private
     */
    _getKeyArray: function(key, data)
    {
        var i = 0,
            obj,
            keyArray = [],
            len = data.length;
        for(; i < len; ++i)
        {
            obj = data[i];
            keyArray[i] = obj[key];
        }
        return keyArray;
    },

    /**
     * Sets data by key
     *
     * @method _setDataByKey
     * @param {String} key Key value to use.
     * @param {Array} data Array to use.
     * @private 
     */
    _setDataByKey: function(key, data)
    {
        var i,
            obj, 
            arr = [], 
            dv = this._dataClone.concat(), 
            len = dv.length;
        for(i = 0; i < len; ++i)
        {
            obj = dv[i];
            arr[i] = obj[key];
        }
        this.get("keys")[key] = arr;
        this._updateTotalDataFlag = true;
    },

    /**
     * Updates the total data array.
     *
     * @method _updateTotalData
     * @private
     */
    _updateTotalData: function()
    {
		var keys = this.get("keys"),
            i;
        this._data = [];
        for(i in keys)
        {
            if(keys.hasOwnProperty(i))
            {
                this._data = this._data.concat(keys[i]);
            }
        }
        this._updateTotalDataFlag = false;
    },

    /**
     * Removes an array from the key hash.
     * 
     * @method removeKey
     * @param {String} value Indicates what key to use in removing from 
     * the hash.
     */
    removeKey: function(value)
    {
        var keys = this.get("keys");
        if(keys.hasOwnProperty(value)) 
        {
            delete keys[value];
            this._keyChangeHandler();
        }
    },

    /**
     * Returns a value based of a key value and an index.
     *
     * @method getKeyValueAt
     * @param {String} key value used to look up the correct array
     * @param {Number} index within the array
     * @return Number 
     */
    getKeyValueAt: function(key, index)
    {
        var value = NaN,
            keys = this.get("keys");
        if(keys[key] && Y_Lang.isNumber(parseFloat(keys[key][index])))
        {
            value = keys[key][index];
        }
        return parseFloat(value);
    },

    /**
     * Returns an array of values based on an identifier key.
     *
     * @method getDataByKey
     * @param {String} value value used to identify the array
     * @return Object
     */
    getDataByKey: function (value)
    {
        var keys = this.get("keys");
        if(keys[value])
        {
            return keys[value];
        }
        return null;
    },

    /**
     * Calculates the maximum and minimum values for the `Axis`.
     *
     * @method _updateMinAndMax
     * @private 
     */
    _updateMinAndMax: function() 
    {
        var data = this.get("data"),
            max = 0,
            min = 0,
            len,
            num,
            i;
        if(data && data.length && data.length > 0)
        {
            len = data.length;
            max = min = data[0];
            if(len > 1)
            {
                for(i = 1; i < len; i++)
                {	
                    num = data[i];
                    if(isNaN(num))
                    {
                        continue;
                    }
                    max = Math.max(num, max);
                    min = Math.min(num, min);
                }
            }
        }
        this._dataMaximum = max;
        this._dataMinimum = min;
    },

    /**
     * Returns the total number of majorUnits that will appear on an axis.
     *
     * @method getTotalMajorUnits
     * @return Number
     */
    getTotalMajorUnits: function()
    {
        var units,
            majorUnit = this.get("styles").majorUnit,
            len = this.get("length");
        if(majorUnit.determinant === "count") 
        {
            units = majorUnit.count;
        }
        else if(majorUnit.determinant === "distance") 
        {
            units = (len/majorUnit.distance) + 1;
        }
        return units; 
    },

    /**
     * Returns the distance between major units on an axis.
     *
     * @method getMajorUnitDistance
     * @param {Number} len Number of ticks
     * @param {Number} uiLen Size of the axis.
     * @param {Object} majorUnit Hash of properties used to determine the majorUnit
     * @return Number
     */
    getMajorUnitDistance: function(len, uiLen, majorUnit)
    {
        var dist;
        if(majorUnit.determinant === "count")
        {
            dist = uiLen/(len - 1);
        }
        else if(majorUnit.determinant === "distance")
        {
            dist = majorUnit.distance;
        }
        return dist;
    },
    
    /**
     * Gets the distance that the first and last ticks are offset from there respective
     * edges.
     *
     * @method getEdgeOffset
     * @param {Number} ct Number of ticks on the axis.
     * @param {Number} l Length (in pixels) of the axis.
     * @return Number
     */
    getEdgeOffset: function(ct, l)
    {
        return 0;
    },

    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     */
    getLabelByIndex: function(i, l)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            increm = (max - min)/(l-1),
            label;
            l -= 1;
        label = min + (i * increm);
        return label;
    },

    /**
     * Updates the `Axis` after a change in keys.
     *
     * @method _keyChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _keyChangeHandler: function(e)
    {
        this._updateMinAndMax();
        this.fire("dataUpdate");
    },

    /**
     * Checks to see if data extends beyond the range of the axis. If so,
     * that data will need to be hidden. This method is internal, temporary and subject
     * to removal in the future.
     *
     * @method _hasDataOverflow
     * @protected
     * @return Boolean
     */
    _hasDataOverflow: function()
    {
        if(this.get("setMin") || this.get("setMax"))
        {
            return true;
        }
        return false;
    },

    /**
     * Returns a string corresponding to the first label on an 
     * axis.
     *
     * @method getMinimumValue
     * @return String
     */
    getMinimumValue: function()
    {
        return this.get("minimum");
    },

    /**
     * Returns a string corresponding to the last label on an 
     * axis.
     *
     * @method getMaximumValue
     * @return String
     */
    getMaximumValue: function()
    {
        return this.get("maximum");
    }
}, {
    ATTRS: {
        /**
         * Hash of array identifed by a string value.
         *
         * @attribute keys
         * @type Object
         */
        keys: {
            value: {},

            setter: function(val)
            {
                var keys = {},
                    i, 
                    len,
                    data = this.get("dataProvider");
                if(Y_Lang.isArray(val))
                {
                    len = val.length;
                    for(i = 0; i < len; ++i)
                    {
                        keys[val[i]] = this._getKeyArray(val[i], data);   
                    }
                    
                }
                else if(Y_Lang.isString(val))
                {
                    keys = this.get("keys");
                    keys[val] = this._getKeyArray(val, data);
                }
                else
                {
                    for(i in val)
                    {
                        if(val.hasOwnProperty(i))
                        {
                            keys[i] = this._getKeyArray(i, data);
                        }
                    }
                }
	            this._updateTotalDataFlag = true;
                return keys;
            }
        },

        /**
         *Indicates how to round unit values.
         *  <dl>
         *      <dt>niceNumber</dt><dd>Units will be smoothed based on the number of ticks and data range.</dd>
         *      <dt>auto</dt><dd>If the range is greater than 1, the units will be rounded.</dd>
         *      <dt>numeric value</dt><dd>Units will be equal to the numeric value.</dd>
         *      <dt>null</dt><dd>No rounding will occur.</dd>
         *  </dl>
         *
         * @attribute roundingMethod
         * @type String
         * @default niceNumber
         */
        roundingMethod: {
            value: "niceNumber"
        },

        /**
         *Returns the type of axis data
         *  <dl>
         *      <dt>time</dt><dd>Manages time data</dd>
         *      <dt>stacked</dt><dd>Manages stacked numeric data</dd>      
         *      <dt>numeric</dt><dd>Manages numeric data</dd>
         *      <dt>category</dt><dd>Manages categorical data</dd>
         *  </dl>
         *
         * @attribute type
         * @type String
         */
        type:
        {
            readOnly: true,

            getter: function ()
            {
                return this._type;
            }
        },

        /**
         * Instance of `ChartDataProvider` that the class uses
         * to build its own data.
         *
         * @attribute dataProvider
         * @type Array
         */
        dataProvider:{
            setter: function (value)
            {
                return value;
            }
        },

        /**
         * The maximum value contained in the `data` array. Used for
         * `maximum` when `autoMax` is true.
         *
         * @attribute dataMaximum
         * @type Number
         */
        dataMaximum: {
            getter: function ()
            {
                if(!this._dataMaximum)
                {   
                    this._updateMinAndMax();
                }
                return this._dataMaximum;
            }
        },

        /**
         * The maximum value that will appear on an axis.
         *
         * @attribute maximum
         * @type Number
         */
        maximum: {
            lazyAdd: false,

            getter: function ()
            {
                var max = this.get("dataMaximum"),
                    min = this.get("minimum");
                //If all values are zero, force a range so that the Axis and related series
                //will still render.
                if(min === 0 && max === 0)
                {
                    max = 10;
                }
                if(Y_Lang.isNumber(this._setMaximum))
                {
                    max = this._setMaximum;
                }
                return parseFloat(max);
            },
            setter: function (value)
            {
                this._setMaximum = parseFloat(value);
                return value;
            }
        },

        /**
         * The minimum value contained in the `data` array. Used for
         * `minimum` when `autoMin` is true.
         *
         * @attribute dataMinimum
         * @type Number
         */
        dataMinimum: {
            getter: function ()
            {
                if(!this._dataMinimum)
                {
                    this._updateMinAndMax();
                }
                return this._dataMinimum;
            }
        },

        /**
         * The minimum value that will appear on an axis.
         *
         * @attribute minimum
         * @type Number
         */
        minimum: {
            lazyAdd: false,

            getter: function ()
            {
                var min = this.get("dataMinimum");
                if(Y_Lang.isNumber(this._setMinimum))
                {
                    min = this._setMinimum;
                }
                return parseFloat(min);
            },
            setter: function(val)
            {
                this._setMinimum = parseFloat(val);
                return val;
            }
        },

        /**
         * Determines whether the maximum is calculated or explicitly 
         * set by the user.
         *
         * @attribute setMax
         * @type Boolean
         */
        setMax: {
            readOnly: true,

            getter: function()
            {
                return Y_Lang.isNumber(this._setMaximum);
            }
        },

        /**
         * Determines whether the minimum is calculated or explicitly
         * set by the user.
         *
         * @attribute setMin
         * @type Boolean
         */
        setMin: {
            readOnly: true,

            getter: function()
            {
                return Y_Lang.isNumber(this._setMinimum);
            }
        },

        /**
         * Array of axis data
         *
         * @attribute data
         * @type Array
         */
        data: {
            getter: function ()
            {
                if(!this._data || this._updateTotalDataFlag)
                {
                    this._updateTotalData();
                }
                return this._data;
            }
        },

        /**
         * Array containing all the keys in the axis.
        
         * @attribute keyCollection
         * @type Array
         */
        keyCollection: {
            getter: function()
            {
                var keys = this.get("keys"),
                    i, 
                    col = [];
                for(i in keys)
                {
                    if(keys.hasOwnProperty(i))
                    {
                        col.push(i);
                    }
                }
                return col;
            },
            readOnly: true
        }
    }
});
/**
 * NumericAxis manages numeric data on an axis.
 *
 * @module charts
 * @submodule charts-base
 * @class NumericAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @extends AxisType
 */
function NumericAxis(config)
{
	NumericAxis.superclass.constructor.apply(this, arguments);
}

NumericAxis.NAME = "numericAxis";

NumericAxis.ATTRS = {
    /**
     * Indicates whether 0 should always be displayed.
     *
     * @attribute alwaysShowZero
     * @type Boolean
     */
	alwaysShowZero: {
	    value: true	
	},
    
    /**
     * Method used for formatting a label. This attribute allows for the default label formatting method to overridden. The method use would need
     * to implement the arguments below and return a `String` or an `HTMLElement`. The default implementation of the method returns a `String`. The output of this method
     * will be rendered to the DOM using `appendChild`. If you override the `labelFunction` method and return an html string, you will also need to override the Axis' 
     * `appendLabelFunction` to accept html as a `String`.
     * <dl>
     *      <dt>val</dt><dd>Label to be formatted. (`String`)</dd>
     *      <dt>format</dt><dd>Object containing properties used to format the label. (optional)</dd>
     * </dl>
     *
     * @attribute labelFunction
     * @type Function
     */
    labelFunction: { 
        value: function(val, format)
        {
            if(format)
            {
                return Y.DataType.Number.format(val, format);
            }
            return val;
        }
    },

    /**
     * Object containing properties used by the `labelFunction` to format a
     * label.
     *
     * @attribute labelFormat
     * @type Object
     */
    labelFormat: {
        value: {
            prefix: "",
            thousandsSeparator: "",
            decimalSeparator: "",
            decimalPlaces: "0",
            suffix: ""
        }
    }
};

Y.extend(NumericAxis, Y.AxisType,
{
    /**
     * Formats a label based on the axis type and optionally specified format.
     *
     * @method formatLabel
     * @param {Object} value
     * @param {Object} format Pattern used to format the value.
     * @return String
     */
    formatLabel: function(val, format)
    {
        if(format)
        {
            return Y.DataType.Number.format(val, format);
        }
        return val;
    },

    /**
     * Returns the sum of all values per key.
     *
     * @method getTotalByKey
     * @param {String} key The identifier for the array whose values will be calculated.
     * @return Number
     */
    getTotalByKey: function(key)
    {
        var total = 0,
            values = this.getDataByKey(key),
            i = 0,
            val,
            len = values ? values.length : 0;
        for(; i < len; ++i)
        {
           val = parseFloat(values[i]);
           if(!isNaN(val))
           {
                total += val;
           }
        }
        return total;
    },

    /**
     * Type of data used in `Axis`.
     *
     * @property _type
     * @readOnly
     * @private
     */
    _type: "numeric",

    /**
     * Helper method for getting a `roundingUnit` when calculating the minimum and maximum values.
     *
     * @method _getMinimumUnit
     * @param {Number} max Maximum number
     * @param {Number} min Minimum number
     * @param {Number} units Number of units on the axis
     * @return Number
     * @private
     */
    _getMinimumUnit:function(max, min, units)
    {
        return this._getNiceNumber(Math.ceil((max - min)/units));
    },

    /**
     * Calculates a nice rounding unit based on the range.
     *
     * @method _getNiceNumber
     * @param {Number} roundingUnit The calculated rounding unit.
     * @return Number
     * @private
     */
    _getNiceNumber: function(roundingUnit)
    {
        var tempMajorUnit = roundingUnit,
            order = Math.ceil(Math.log(tempMajorUnit) * 0.4342944819032518),
            roundedMajorUnit = Math.pow(10, order),
            roundedDiff;

        if (roundedMajorUnit / 2 >= tempMajorUnit) 
        {
            roundedDiff = Math.floor((roundedMajorUnit / 2 - tempMajorUnit) / (Math.pow(10,order-1)/2));
            tempMajorUnit = roundedMajorUnit/2 - roundedDiff*Math.pow(10,order-1)/2;
        }
        else 
        {
            tempMajorUnit = roundedMajorUnit;
        }
        if(!isNaN(tempMajorUnit))
        {
            return tempMajorUnit;
        }
        return roundingUnit;

    },

    /**
     * Calculates the maximum and minimum values for the `Axis`.
     *
     * @method _updateMinAndMax
     * @private 
     */
    _updateMinAndMax: function()
    {
        var data = this.get("data"),
            max, 
            min,
            len,
            num,
            i = 0,
            key,
            setMax = this.get("setMax"),
            setMin = this.get("setMin");
        if(!setMax || !setMin)
        {
            if(data && data.length && data.length > 0)
            {
                len = data.length;
                for(; i < len; i++)
                {	
                    num = data[i];
                    if(isNaN(num))
                    {
                        if(Y_Lang.isObject(num))
                        {
                            min = max = 0;
                            //hloc values
                            for(key in num)
                            {
                               if(num.hasOwnProperty(key))
                               {
                                    max = Math.max(num[key], max);
                                    min = Math.min(num[key], min);
                               }
                            }
                        }
                        max = setMax ? this._setMaximum : max;
                        min = setMin ? this._setMinimum : min;
                        continue;
                    }
                    
                    if(setMin)
                    {
                        min = this._setMinimum;
                    }
                    else if(min === undefined)
                    {
                        min = num;
                    }
                    else
                    {
                        min = Math.min(num, min); 
                    }
                    if(setMax)
                    {
                        max = this._setMaximum;
                    }
                    else if(max === undefined)
                    {
                        max = num;
                    }
                    else
                    {
                        max = Math.max(num, max);
                    }
                    
                    this._actualMaximum = max;
                    this._actualMinimum = min;
                }
            }
            this._roundMinAndMax(min, max, setMin, setMax);
        }
    },

    /**
     * Rounds the mimimum and maximum values based on the `roundingUnit` attribute.
     *
     * @method _roundMinAndMax
     * @param {Number} min Minimum value
     * @param {Number} max Maximum value
     * @private
     */
    _roundMinAndMax: function(min, max, setMin, setMax)
    {
        var roundingUnit,
            minimumRange,
            minGreaterThanZero = min >= 0,
            maxGreaterThanZero = max > 0,
            dataRangeGreater,
            maxRound,
            minRound,
            topTicks,
            botTicks,
            tempMax,
            tempMin,
            units = this.getTotalMajorUnits() - 1,
            alwaysShowZero = this.get("alwaysShowZero"),
            roundingMethod = this.get("roundingMethod"),
            useIntegers = (max - min)/units >= 1;
        if(roundingMethod)
        {
            if(roundingMethod == "niceNumber")
            {
                roundingUnit = this._getMinimumUnit(max, min, units);
                if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if((alwaysShowZero || min < roundingUnit) && !setMin)
                    {
                        min = 0;
                        roundingUnit = this._getMinimumUnit(max, min, units);
                    }
                    else
                    {
                       min = this._roundDownToNearest(min, roundingUnit);
                    }
                    if(setMax)
                    {
                        if(!alwaysShowZero)
                        {
                            min = max - (roundingUnit * units);
                        }
                    }
                    else if(setMin)
                    {
                        max = min + (roundingUnit * units);
                    }
                    else
                    {
                        max = this._roundUpToNearest(max, roundingUnit);
                    }
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    if(alwaysShowZero)
                    {
                        topTicks = Math.round(units/((-1 * min)/max + 1));
                        topTicks = Math.max(Math.min(topTicks, units - 1), 1);
                        botTicks = units - topTicks;
                        tempMax = Math.ceil( max/topTicks );
                        tempMin = Math.floor( min/botTicks ) * -1;
                        
                        if(setMin)
                        {
                            while(tempMin < tempMax && botTicks >= 0)
                            {
                                botTicks--;
                                topTicks++;
                                tempMax = Math.ceil( max/topTicks );
                                tempMin = Math.floor( min/botTicks ) * -1;
                            }
                            //if there are any bottom ticks left calcualate the maximum by multiplying by the tempMin value
                            //if not, it's impossible to ensure that a zero is shown. skip it
                            if(botTicks > 0)
                            {
                                max = tempMin * topTicks;
                            }
                            else
                            {
                                max = min + (roundingUnit * units);
                            }
                        }
                        else if(setMax)
                        {
                            while(tempMax < tempMin && topTicks >= 0)
                            {
                                botTicks++;
                                topTicks--;
                                tempMin = Math.floor( min/botTicks ) * -1;
                                tempMax = Math.ceil( max/topTicks );
                            }
                            //if there are any top ticks left calcualate the minimum by multiplying by the tempMax value
                            //if not, it's impossible to ensure that a zero is shown. skip it
                            if(topTicks > 0)
                            {
                                min = tempMax * botTicks * -1;
                            }
                            else
                            {
                                min = max - (roundingUnit * units);
                            }
                        }
                        else
                        {
                            roundingUnit = Math.max(tempMax, tempMin);
                            roundingUnit = this._getNiceNumber(roundingUnit);  
                            max = roundingUnit * topTicks;
                            min = roundingUnit * botTicks * -1;
                        }
                    }
                    else 
                    {
                        if(setMax)
                        {
                            min = max - (roundingUnit * units);
                        }
                        else if(setMin)
                        {
                            max = min + (roundingUnit * units);
                        }
                        else
                        {
                            min = this._roundDownToNearest(min, roundingUnit);
                            max = this._roundUpToNearest(max, roundingUnit);
                        }
                    }
                }
                else
                {
                    if(setMin)
                    {
                        if(alwaysShowZero)
                        {
                            max = 0;
                        }
                        else
                        {
                            max = min + (roundingUnit * units);
                        }
                    }
                    else if(!setMax)
                    {
                        if(alwaysShowZero || max === 0 || max + roundingUnit > 0)
                        {
                            max = 0;
                            roundingUnit = this._getMinimumUnit(max, min, units);
                            min = max - (roundingUnit * units);
                        }
                        else
                        {
                            min = this._roundDownToNearest(min, roundingUnit);
                            max = this._roundUpToNearest(max, roundingUnit);
                        }
                    }
                    else
                    {
                        min = max - (roundingUnit * units);
                    }
                }
            }
            else if(roundingMethod == "auto") 
            {
                if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if((alwaysShowZero || min < (max-min)/units) && !setMin)
                    {
                        min = 0;
                    }
                
                    roundingUnit = (max - min)/units;
                    if(useIntegers)
                    {
                        roundingUnit = Math.ceil(roundingUnit);
                    }
                    max = min + (roundingUnit * units);
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    if(alwaysShowZero)
                    {
                        topTicks = Math.round( units / ( (-1 * min) /max + 1) );
                        topTicks = Math.max(Math.min(topTicks, units - 1), 1);
                        botTicks = units - topTicks;

                        if(useIntegers)
                        {
                            tempMax = Math.ceil( max/topTicks );
                            tempMin = Math.floor( min/botTicks ) * -1;
                        }
                        else
                        {
                            tempMax = max/topTicks;
                            tempMin = min/botTicks * -1;
                        }
                        roundingUnit = Math.max(tempMax, tempMin);
                        max = roundingUnit * topTicks;
                        min = roundingUnit * botTicks * -1;
                    }
                    else
                    {
                        roundingUnit = (max - min)/units;
                        if(useIntegers)
                        {
                            roundingUnit = Math.ceil(roundingUnit);
                        }
                        min = this._roundDownToNearest(min, roundingUnit);
                        max = this._roundUpToNearest(max, roundingUnit);
                    }
                }
                else
                {
                    roundingUnit = (max - min)/units;
                    if(useIntegers)
                    {   
                        roundingUnit = Math.ceil(roundingUnit);
                    }
                    if(alwaysShowZero || max === 0 || max + roundingUnit > 0)
                    {
                        max = 0;
                        roundingUnit = (max - min)/units;
                        if(useIntegers)
                        {
                            Math.ceil(roundingUnit);
                        }
                        min = max - (roundingUnit * units);
                    }
                    else
                    {
                        min = this._roundDownToNearest(min, roundingUnit);
                        max = this._roundUpToNearest(max, roundingUnit);
                    }

                }
            }
            else if(!isNaN(roundingMethod) && isFinite(roundingMethod))
            {
                roundingUnit = roundingMethod;
                minimumRange = roundingUnit * units;
                dataRangeGreater = (max - min) > minimumRange;
                minRound = this._roundDownToNearest(min, roundingUnit);
                maxRound = this._roundUpToNearest(max, roundingUnit);
                if(setMax)
                {
                    min = max - minimumRange;
                }
                else if(setMin)
                {
                    max = min + minimumRange;
                }
                else if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if(alwaysShowZero || minRound <= 0)
                    {
                        min = 0;
                    }
                    else
                    {
                        min = minRound;
                    }
                    max = min + minimumRange;
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    min = minRound;
                    max = maxRound;
                }
                else
                {
                    if(alwaysShowZero || maxRound >= 0)
                    {
                        max = 0;
                    }
                    else
                    {
                        max = maxRound;
                    }
                    min = max - minimumRange;
                }
            }
        }
        this._dataMaximum = max;
        this._dataMinimum = min;
    },

    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     */
    getLabelByIndex: function(i, l)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            increm = (max - min)/(l-1),
            label,
            roundingMethod = this.get("roundingMethod");
            l -= 1;
        //respect the min and max. calculate all other labels.
        if(i === 0)
        {
            label = min;
        }
        else if(i === l)
        {
            label = max;
        }
        else
        {
            label = (i * increm);
            if(roundingMethod == "niceNumber")
            {
                label = this._roundToNearest(label, increm);
            }
            label += min;
        }
        return parseFloat(label);
    },

    /**
     * Rounds a Number to the nearest multiple of an input. For example, by rounding
     * 16 to the nearest 10, you will receive 20. Similar to the built-in function Math.round().
     *
     * @method _roundToNearest
     * @param {Number} number Number to round
     * @param {Number} nearest Multiple to round towards.
     * @return Number
     * @private
     */
    _roundToNearest: function(number, nearest)
    {
        nearest = nearest || 1;
        if(nearest === 0)
        {
            return number;
        }
        var roundedNumber = Math.round(this._roundToPrecision(number / nearest, 10)) * nearest;
        return this._roundToPrecision(roundedNumber, 10);
    },
	
    /**
     * Rounds a Number up to the nearest multiple of an input. For example, by rounding
     * 16 up to the nearest 10, you will receive 20. Similar to the built-in function Math.ceil().
     *
     * @method _roundUpToNearest
     * @param {Number} number Number to round
     * @param {Number} nearest Multiple to round towards.
     * @return Number
     * @private
     */
    _roundUpToNearest: function(number, nearest)
    {
        nearest = nearest || 1;
        if(nearest === 0)
        {
            return number;
        }
        return Math.ceil(this._roundToPrecision(number / nearest, 10)) * nearest;
    },
	
    /**
     * Rounds a Number down to the nearest multiple of an input. For example, by rounding
     * 16 down to the nearest 10, you will receive 10. Similar to the built-in function Math.floor().
     *
     * @method _roundDownToNearest
     * @param {Number} number Number to round
     * @param {Number} nearest Multiple to round towards.
     * @return Number
     * @private
     */
    _roundDownToNearest: function(number, nearest)
    {
        nearest = nearest || 1;
        if(nearest === 0)
        {
            return number;
        }
        return Math.floor(this._roundToPrecision(number / nearest, 10)) * nearest;
    },

    /**
     * Rounds a number to a certain level of precision. Useful for limiting the number of
     * decimal places on a fractional number.
     *
     * @method _roundToPrecision
     * @param {Number} number Number to round
     * @param {Number} precision Multiple to round towards.
     * @return Number
     * @private
     */
    _roundToPrecision: function(number, precision)
    {
        precision = precision || 0;
        var decimalPlaces = Math.pow(10, precision);
        return Math.round(decimalPlaces * number) / decimalPlaces;
    },
    
    /**
     * Checks to see if data extends beyond the range of the axis. If so,
     * that data will need to be hidden. This method is internal, temporary and subject
     * to removal in the future.
     *
     * @method _hasDataOverflow
     * @protected
     * @return Boolean
     */
    _hasDataOverflow: function()
    {
        var roundingMethod,
            min,
            max;
        if(this.get("setMin") || this.get("setMax"))
        {
            return true;
        }
        roundingMethod = this.get("roundingMethod");
        min = this._actualMinimum;
        max = this._actualMaximum;
        if(Y_Lang.isNumber(roundingMethod) && ((Y_Lang.isNumber(max) && max > this._dataMaximum) || (Y_Lang.isNumber(min) && min < this._dataMinimum)))
        {
            return true;
        }
        return false;
    }
});

Y.NumericAxis = NumericAxis;
		
/**
 * StackedAxis manages stacked numeric data on an axis.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @extends NumericAxis
 */
function StackedAxis(config)
{
	StackedAxis.superclass.constructor.apply(this, arguments);
}

StackedAxis.NAME = "stackedAxis";


Y.extend(StackedAxis, Y.NumericAxis,
{
    /**
     * Calculates the maximum and minimum values for the `Axis`.
     *
     * @method _updateMinAndMax
     * @private 
     */
    _updateMinAndMax: function()
    {
        var max = 0,
            min = 0,
            pos = 0,
            neg = 0,
            len = 0,
            i = 0,
            key,
            num,
            keys = this.get("keys"),
            setMin = this.get("setMin"),
            setMax = this.get("setMax");

        for(key in keys)
        {
            if(keys.hasOwnProperty(key))
            {
                len = Math.max(len, keys[key].length);
            }
        }
        for(; i < len; ++i)
        {
            pos = 0;
            neg = 0;
            for(key in keys)
            {
                if(keys.hasOwnProperty(key))
                {
                    num = keys[key][i];
                    if(isNaN(num))
                    {
                        continue;
                    }
                    if(num >= 0)
                    {
                        pos += num;
                    }
                    else
                    {
                        neg += num;
                    }
                }
            }
            if(pos > 0)
            {
                max = Math.max(max, pos);
            }
            else 
            {
                max = Math.max(max, neg);
            }
            if(neg < 0)
            {
                min = Math.min(min, neg);
            }
            else
            {
                min = Math.min(min, pos);
            }
        }
        this._actualMaximum = max;
        this._actualMinimum = min;
        if(setMax)
        {
            max = this._setMaximum;
        }
        if(setMin)
        {
            min = this._setMinimum;
        }
        this._roundMinAndMax(min, max, setMin, setMax);
    }
});

Y.StackedAxis = StackedAxis;
		
/**
 * TimeAxis manages time data on an axis.
 *
 * @module charts
 * @submodule charts-base
 * @class TimeAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @extends AxisType
 */
function TimeAxis(config)
{
	TimeAxis.superclass.constructor.apply(this, arguments);
}

TimeAxis.NAME = "timeAxis";

TimeAxis.ATTRS = 
{
    /**
     * Indicates whether the maximum is calculated or explicitly set. 
     *
     * @attribute setMax
     * @readOnly
     * @type Boolean
     * @private
     */
    setMax: {
        readOnly: true,

        getter: function()
        {
            var max = this._getNumber(this._setMaximum);
            return (Y_Lang.isNumber(max));
        }
    },

    /**
     * Indicates whether the minimum is calculated or explicitly set. 
     *
     * @attribute setMin
     * @readOnly
     * @type Boolean
     * @private
     */
    setMin: {
        readOnly: true,

        getter: function()
        {
            var min = this._getNumber(this._setMinimum);
            return (Y_Lang.isNumber(min));
        }
    },

    /**
     * The maximum value that will appear on an axis. Unless explicitly set, this value is calculated by the `Axis`.
     *
     * @attribute maximum
     * @type Number
     */
    maximum: {
        getter: function ()
        {
            var max = this._getNumber(this._setMaximum);
            if(!Y_Lang.isNumber(max))
            {
                max = this._getNumber(this.get("dataMaximum"));
            }
            return parseFloat(max);
        },
        setter: function (value)
        {
            this._setMaximum = this._getNumber(value);
            return value;
        }
    },

    /**
     * The minimum value that will appear on an axis. Unless explicitly set, this value is calculated by the `Axis`.
     *
     * @attribute minimum
     * @type Number
     */
    minimum: {
        getter: function ()
        {
            var min = this._getNumber(this._setMinimum);
            if(!Y_Lang.isNumber(min)) 
            {
                min = this._getNumber(this.get("dataMinimum"));
            }
            return parseFloat(min);
        },
        setter: function (value)
        {
            this._setMinimum = this._getNumber(value);
            return value;
        }
    },

    /**
     * Method used for formatting a label. This attribute allows for the default label formatting method to overridden. The method use would need
     * to implement the arguments below and return a `String` or an `HTMLElement`. The default implementation of the method returns a `String`. The output of this method
     * will be rendered to the DOM using `appendChild`. If you override the `labelFunction` method and return an html string, you will also need to override the Axis' 
     * `appendLabelFunction` to accept html as a `String`.
     * <dl>
     *      <dt>val</dt><dd>Label to be formatted. (`String`)</dd>
     *      <dt>format</dt><dd>STRFTime string used to format the label. (optional)</dd>
     * </dl>
     *
     * @attribute labelFunction
     * @type Function
     */
    labelFunction: {
        value: function(val, format)
        {
            val = Y.DataType.Date.parse(val);
            if(format)
            {
                return Y.DataType.Date.format(val, {format:format});
            }
            return val;
        }
    },

    /**
     * Pattern used by the `labelFunction` to format a label.
     *
     * @attribute labelFormat
     * @type String
     */
    labelFormat: {
        value: "%b %d, %y"
    }
};

Y.extend(TimeAxis, Y.AxisType, {
    /**
     * Formats a label based on the axis type and optionally specified format.
     *
     * @method formatLabel
     * @param {Object} value
     * @param {Object} format Pattern used to format the value.
     * @return String
     */
    formatLabel: function(val, format)
    {
        val = Y.DataType.Date.parse(val);
        if(format)
        {
            return Y.DataType.Date.format(val, {format:format});
        }
        return val;
    },

    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuitimeaxis",
	
    /**
     * Type of data used in `Axis`.
     *
     * @property _dataType
     * @readOnly
     * @private
     */
    _dataType: "time",
	
    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     */
    getLabelByIndex: function(i, l)
    {
        var min = this.get("minimum"),
            max = this.get("maximum"),
            position = this.get("position"),
            increm,
            label;
            l -= 1;
        increm = ((max - min)/l) * i;
        if(position == "bottom" || position == "top")
        {
            label = min + increm;
        }
        else
        {
            label = max - increm;
        }
        return label;
    },

    /**
     * Gets an array of values based on a key.
     *
     * @method _getKeyArray
     * @param {String} key Value key associated with the data array.
     * @param {Array} data Array in which the data resides.
     * @return Array
     * @private
     */
    _getKeyArray: function(key, data)
    {
        var obj,
            keyArray = [],
            i = 0,
            val,
            len = data.length;
        for(; i < len; ++i)
        {
            obj = data[i][key];
            if(Y_Lang.isDate(obj))
            {   
                val = obj.valueOf();
            }
            else
            {
                val = new Date(obj);
                if(Y_Lang.isDate(val))
                {
                    val = val.valueOf();
                }
                else if(!Y_Lang.isNumber(obj))
                {
                    if(Y_Lang.isNumber(parseFloat(obj)))
                    {
                        val = parseFloat(obj);
                    }
                    else
                    {
                        if(typeof obj != "string")
                        {
                            obj = obj;
                        }
                        val = new Date(obj).valueOf();
                    }
                }
                else
                {
                    val = obj;
                }
            }
            keyArray[i] = val;
        }
        return keyArray;
    },

    /**
     * Sets data by key
     *
     * @method _setDataByKey
     * @param {String} key Key value to use.
     * @param {Array} data Array to use.
     * @private 
     */
    _setDataByKey: function(key, data)
    {
        var obj, 
            arr = [], 
            dv = this._dataClone.concat(), 
            i, 
            val,
            len = dv.length;
        for(i = 0; i < len; ++i)
        {
            obj = dv[i][key];
            if(Y_Lang.isDate(obj))
            {   
                val = obj.valueOf();
            }
            else
            {
                val = new Date(obj);
                if(Y_Lang.isDate(val))
                {
                    val = val.valueOf();
                }
                else if(!Y_Lang.isNumber(obj))
                {
                    if(Y_Lang.isNumber(parseFloat(obj)))
                    {
                        val = parseFloat(obj);
                    }
                    else
                    {
                        if(typeof obj != "string")
                        {
                            obj = obj.toString();
                        }
                        val = new Date(obj).valueOf();
                    }
                }
                else
                {
                    val = obj;
                }
            }
            arr[i] = val;
        }
        this.get("keys")[key] = arr;
        this._updateTotalDataFlag = true;
    },

    /**
     * Parses value into a number.
     *
     * @method _getNumber
     * @param val {Object} Value to parse into a number
     * @return Number
     * @private
     */
    _getNumber: function(val)
    {
        if(Y_Lang.isDate(val))
        {
            val = val.valueOf();
        }
        else if(!Y_Lang.isNumber(val) && val)
        {
            val = new Date(val).valueOf();
        }

        return val;
    }
});

Y.TimeAxis = TimeAxis;
		
/**
 * CategoryAxis manages category data on an axis.
 *
 * @module charts
 * @submodule charts-base
 * @class CategoryAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @extends AxisType
 */
function CategoryAxis(config)
{
	CategoryAxis.superclass.constructor.apply(this, arguments);
}

CategoryAxis.NAME = "categoryAxis";

Y.extend(CategoryAxis, Y.AxisType,
{
    /**
     * Formats a label based on the axis type and optionally specified format.
     *
     * @method formatLabel
     * @param {Object} value
     * @param {Object} format Pattern used to format the value.
     * @return String
     */
    formatLabel: function(val, format)
    {
        return val;
    },

    /**
     * Object storing key data.
     *
     * @property _indices
     * @private
     */
    _indices: null,

    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuicategoryaxis",

    /**
     * Type of data used in `Axis`.
     *
     * @property _dataType
     * @readOnly
     * @private
     */
    _type: "category",
        
    /**
     * Calculates the maximum and minimum values for the `Axis`.
     *
     * @method _updateMinAndMax
     * @private 
     */
    _updateMinAndMax: function()
    {
        this._dataMaximum = Math.max(this.get("data").length - 1, 0);
        this._dataMinimum = 0;
    },

    /**
     * Gets an array of values based on a key.
     *
     * @method _getKeyArray
     * @param {String} key Value key associated with the data array.
     * @param {Array} data Array in which the data resides.
     * @return Array
     * @private
     */
    _getKeyArray: function(key, data)
    {
        var i = 0,
            obj,
            keyArr = [],
            labels = [],
            len = data.length;
        if(!this._indices)
        {
            this._indices = {};
        }
        for(; i < len; ++i)
        {
            obj = data[i];
            keyArr[i] = i;
            labels[i] = obj[key];
        }
        this._indices[key] = keyArr;
        return labels;
    },

    /**
     * Sets data by key
     *
     * @method _setDataByKey
     * @param {String} key Key value to use.
     * @param {Array} data Array to use.
     * @private 
     */
    _setDataByKey: function(key)
    {
        var i,
            obj, 
            arr = [], 
            labels = [], 
            dv = this._dataClone.concat(), 
            len = dv.length;
        if(!this._indices)
        {
            this._indices = {};
        }
        for(i = 0; i < len; ++i)
        {
            obj = dv[i];
            arr[i] = i;
            labels[i] = obj[key];
        }
        this._indices[key] = arr;
        this.get("keys")[key] = labels.concat();
        this._updateTotalDataFlag = true;
    },

    /**
     * Returns an array of values based on an identifier key.
     *
     * @method getDataByKey
     * @param {String} value value used to identify the array
     * @return Array
     */
    getDataByKey: function (value)
    {
        if(!this._indices)
        {
            this.get("keys");
        }
        var keys = this._indices;
        if(keys[value])
        {
            return keys[value];
        }
        return null;
    },

    /**
     * Returns the total number of majorUnits that will appear on an axis.
     *
     * @method getTotalMajorUnits
     * @param {Object} majorUnit Object containing properties related to the majorUnit.
     * @param {Number} len Length of the axis.
     * @return Number
     */
    getTotalMajorUnits: function(majorUnit, len)
    {
        return this.get("data").length;
    },
    
    /**
     * Returns the distance between major units on an axis.
     *
     * @method getMajorUnitDistance
     * @param {Number} len Number of ticks
     * @param {Number} uiLen Size of the axis.
     * @param {Object} majorUnit Hash of properties used to determine the majorUnit
     * @return Number
     */
    getMajorUnitDistance: function(len, uiLen, majorUnit)
    {
        var dist;
        if(majorUnit.determinant === "count")
        {
            dist = uiLen/len;
        }
        else if(majorUnit.determinant === "distance")
        {
            dist = majorUnit.distance;
        }
        return dist;
    },
   
    /**
     * Gets the distance that the first and last ticks are offset from there respective
     * edges.
     *
     * @method getEdgeOffset
     * @param {Number} ct Number of ticks on the axis.
     * @param {Number} l Length (in pixels) of the axis.
     * @return Number
     */
    getEdgeOffset: function(ct, l)
    {
        return l/ct;
    },

    /**
     * Returns a value based of a key value and an index.
     *
     * @method getKeyValueAt
     * @param {String} key value used to look up the correct array
     * @param {Number} index within the array
     * @return String 
     */
    getKeyValueAt: function(key, index)
    {
        var value = NaN,
            keys = this.get("keys");
        if(keys[key] && keys[key][index]) 
        {
            value = keys[key][index];
        }
        return value;
    },
   
    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     */
    getLabelByIndex: function(i, l)
    {
        var label,
            data = this.get("data"),
            position = this.get("position");
        if(position == "bottom" || position == "top")
        {
            label = data[i];
        }
        else
        {
            label = data[l - (i + 1)];
        }   
        return label;
    },

    /**
     * Returns a string corresponding to the first label on an 
     * axis.
     *
     * @method getMinimumValue
     * @return String
     */
    getMinimumValue: function()
    {
        var data = this.get("data"),
            label = data[0];
        return label;
    },

    /**
     * Returns a string corresponding to the last label on an 
     * axis.
     *
     * @method getMaximumValue
     * @return String
     */
    getMaximumValue: function()
    {
        var data = this.get("data"),
            len = data.length - 1,
            label = data[len];
        return label;
    }
});

Y.CategoryAxis = CategoryAxis;
		
/**
 * Utility class used for calculating curve points.
 *
 * @module charts
 * @submodule charts-base
 * @class CurveUtil
 * @constructor
 */
function CurveUtil()
{
}

CurveUtil.prototype = {
    /**
     * Creates an array of start, end and control points for splines.
     *
     * @method getCurveControlPoints
     * @param {Array} xcoords Collection of x-coordinates used for calculate the curves
     * @param {Array} ycoords Collection of y-coordinates used for calculate the curves
     * @return Object
     * @protected
     */
    getCurveControlPoints: function(xcoords, ycoords) 
    {
		var outpoints = [],
            i = 1,
            l = xcoords.length - 1,
		    xvals = [],
		    yvals = [];
		
		
		// Too few points, need at least two
		if (l < 1) 
        {
			return null;
		} 
        
        outpoints[0] = {
            startx: xcoords[0], 
            starty: ycoords[0],
            endx: xcoords[1],
            endy: ycoords[1]
        };
        
		// Special case, the Bezier should be a straight line
        if (l === 1) 
        {
			outpoints[0].ctrlx1 = (2.0*xcoords[0] + xcoords[1])/3.0;  
			outpoints[0].ctrly2 = (2.0*ycoords[0] + ycoords[1])/3.0;
			outpoints[0].ctrlx2 = 2.0*outpoints[0].ctrlx1 - xcoords[0];
            outpoints[0].ctrly2 = 2.0*outpoints[0].ctrly1 - ycoords[0];
            return outpoints;
		}

		for (; i < l; ++i) 
        {
			outpoints.push({startx: Math.round(xcoords[i]), starty: Math.round(ycoords[i]), endx: Math.round(xcoords[i+1]), endy: Math.round(ycoords[i+1])});
			xvals[i] = 4.0 * xcoords[i] + 2*xcoords[i+1];
			yvals[i] = 4.0*ycoords[i] + 2*ycoords[i+1];
		}
		
		xvals[0] = xcoords[0] + (2.0 * xcoords[1]);
		xvals[l-1] = (8.0 * xcoords[l-1] + xcoords[l]) / 2.0;
		xvals = this.getControlPoints(xvals.concat());
        yvals[0] = ycoords[0] + (2.0 * ycoords[1]);
		yvals[l-1] = (8.0 * ycoords[l-1] + ycoords[l]) / 2.0;	
		yvals = this.getControlPoints(yvals.concat());
		
        for (i = 0; i < l; ++i) 
        {
			outpoints[i].ctrlx1 = Math.round(xvals[i]);
            outpoints[i].ctrly1 = Math.round(yvals[i]);
			
			if (i < l-1) 
            {
				outpoints[i].ctrlx2 = Math.round(2*xcoords[i+1] - xvals[i+1]);
                outpoints[i].ctrly2 = Math.round(2*ycoords[i+1] - yvals[i+1]);
			}
			else 
            {
				outpoints[i].ctrlx2 = Math.round((xcoords[l] + xvals[l-1])/2);
                outpoints[i].ctrly2 = Math.round((ycoords[l] + yvals[l-1])/2);
			}
		}
		
		return outpoints;	
	},

    /**
     * Gets the control points for the curve.
     *
     * @method getControlPoints
     * @param {Array} vals Collection of values coords used to generate control points.
     * @return Array
     * @private
     */
	getControlPoints: function(vals) 
    {
		var l = vals.length,
            x = [],
            tmp = [],
            b = 2.0,
            i = 1;
		x[0] = vals[0] / b;
		for (; i < l; ++i) 
        {
			tmp[i] = 1/b;
			b = (i < l-1 ? 4.0 : 3.5) - tmp[i];
			x[i] = (vals[i] - x[i-1]) / b;
		}
		
		for (i = 1; i < l; ++i) 
        {
			x[l-i-1] -= tmp[l-i] * x[l-i];
		}
		
		return x;
	}
};
Y.CurveUtil = CurveUtil;
/**
 * Utility class used for creating stacked series.
 *
 * @module charts
 * @submodule charts-base
 * @class StackingUtil
 * @constructor
 */
function StackingUtil(){}

StackingUtil.prototype = {
    /**
     * Indicates whether the series is stacked.
     *
     * @property _stacked
     * @private
     */
    _stacked: true,

    /**
     * @protected
     *
     * Adjusts coordinate values for stacked series.
     *
     * @method _stackCoordinates
     */
    _stackCoordinates: function() 
    {
        if(this.get("direction") == "vertical")
        {
            this._stackXCoords();
        }
        else
        {
            this._stackYCoords();
        }
    },

    /**
     * Stacks coordinates for a stacked vertical series.
     *
     * @method _stackXCoords
     * @protected
     */
    _stackXCoords: function()
    {
        var order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            i = 0,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            len,
            coord,
            prevCoord,
            prevOrder,
            stackedXCoords = xcoords.concat(),
            prevXCoords,
            prevYCoords,
            nullIndices = [],
            nullIndex;
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("stackedXCoords");
            prevYCoords = seriesCollection[order - 1].get("stackedYCoords");
            len = prevXCoords.length;
        }
        else
        {
            len = xcoords.length;
        }
        for(; i < len; i = i + 1)
        {
            if(Y_Lang.isNumber(xcoords[i]))
            {
                if(order > 0)
                {
                    prevCoord = prevXCoords[i];
                    if(!Y_Lang.isNumber(prevCoord))
                    {
                        prevOrder = order;
                        while(prevOrder >  - 1 && !Y_Lang.isNumber(prevCoord))
                        {
                            prevOrder = prevOrder - 1;
                            if(prevOrder > -1)
                            {
                                prevCoord = seriesCollection[prevOrder].get("stackedXCoords")[i];
                            }
                            else
                            {
                                prevCoord = this._leftOrigin;
                            }
                        }
                    }
                    xcoords[i] = xcoords[i] + prevCoord;
                }
                stackedXCoords[i] = xcoords[i];
            }
            else
            {
                nullIndices.push(i);
            }
        }
        this._cleanXNaN(stackedXCoords, ycoords);
        len = nullIndices.length;
        if(len > 0)
        {
            for(i = 0; i < len; i = i + 1)
            {
                nullIndex = nullIndices[i];
                coord = order > 0 ? prevXCoords[nullIndex] : this._leftOrigin;
                stackedXCoords[nullIndex] =  Math.max(stackedXCoords[nullIndex], coord);
            }
        }
        this.set("stackedXCoords", stackedXCoords);
        this.set("stackedYCoords", ycoords);
    },

    /**
     * Stacks coordinates for a stacked horizontal series.
     *
     * @method _stackYCoords
     * @protected
     */
    _stackYCoords: function()
    {
        var order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            h = graph.get("height"), 
            seriesCollection = graph.seriesTypes[type],
            i = 0,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            len,
            coord,
            prevCoord,
            prevOrder,
            stackedYCoords = ycoords.concat(),
            prevXCoords,
            prevYCoords,
            nullIndices = [],
            nullIndex;
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("stackedXCoords");
            prevYCoords = seriesCollection[order - 1].get("stackedYCoords");
            len = prevYCoords.length;
        }
        else
        {
            len = ycoords.length;
        }
        for(; i < len; i = i + 1)
        {
            if(Y_Lang.isNumber(ycoords[i]))
            {
                if(order > 0)
                {
                    prevCoord = prevYCoords[i];
                    if(!Y_Lang.isNumber(prevCoord))
                    {
                        prevOrder = order;
                        while(prevOrder >  - 1 && !Y_Lang.isNumber(prevCoord))
                        {
                            prevOrder = prevOrder - 1;
                            if(prevOrder > -1)
                            {
                                prevCoord = seriesCollection[prevOrder].get("stackedYCoords")[i];
                            }
                            else
                            {
                                prevCoord = this._bottomOrigin;
                            }
                        }
                    }
                    ycoords[i] = prevCoord - (h - ycoords[i]);
                }
                stackedYCoords[i] = ycoords[i];
            }
            else
            {
                nullIndices.push(i);
            }
        }
        this._cleanYNaN(xcoords, stackedYCoords);
        len = nullIndices.length;
        if(len > 0)
        {
            for(i = 0; i < len; i = i + 1)
            {
                nullIndex = nullIndices[i];
                coord = order > 0 ? prevYCoords[nullIndex] : h;
                stackedYCoords[nullIndex] =  Math.min(stackedYCoords[nullIndex], coord);
            }
        }
        this.set("stackedXCoords", xcoords);
        this.set("stackedYCoords", stackedYCoords);
    },

    /**
     * Cleans invalid x-coordinates by calculating their value based on the corresponding y-coordinate, the previous valid x-coordinate with its 
     * corresponding y-coordinate and the next valid x-coordinate with its corresponding y-coordinate. If there is no previous or next valid x-coordinate,
     * the value will not be altered.
     *
     * @method _cleanXNaN
     * @param {Array} xcoords An array of x-coordinate values
     * @param {Array} ycoords An arry of y-coordinate values
     * @private
     */
    _cleanXNaN: function(xcoords, ycoords)
    {
        var previousValidIndex,
            nextValidIndex,
            previousValidX,
            previousValidY,
            x,
            y,
            nextValidX,
            nextValidY,
            isNumber = Y_Lang.isNumber,
            m,
            i = 0,
            len = ycoords.length;
        for(; i < len; ++i)
        {
            x = xcoords[i];
            y = ycoords[i];
            //if x is invalid, calculate where it should be
            if(!isNumber(x) && i > 0 && i < len - 1)
            {
                previousValidY = ycoords[i - 1];
                //check to see if the previous value is valid
                previousValidX = this._getPreviousValidCoordValue(xcoords, i);
                nextValidY = ycoords[i + 1];
                nextValidX = this._getNextValidCoordValue(xcoords, i);
                //check to see if the next value is valid
                if(isNumber(previousValidX) && isNumber(nextValidX))
                {
                    //calculate slope and solve for x
                    m = (nextValidY - previousValidY) / (nextValidX - previousValidX);
                    xcoords[i] = (y + (m * previousValidX) - previousValidY)/m;
                }
                previousValidIndex = NaN;
                nextValidIndex = NaN;
            }
        }
    },

    /**
     * Returns the previous valid (numeric) value in an array if available.
     *
     * @method _getPreviousValidCoordValue
     * @param {Array} coords Array of values
     * @param {Number} index The index in the array in which to begin searching.
     * @return Number
     * @private
     */
    _getPreviousValidCoordValue: function(coords, index)
    {
        var coord,
            isNumber = Y_Lang.isNumber,
            limit = -1;
        while(!isNumber(coord) && index > limit)
        {
            index = index - 1;
            coord = coords[index];
        }
        return coord;
    },

    /**
     * Returns the next valid (numeric) value in an array if available.
     *
     * @method _getNextValidCoordValue
     * @param {Array} coords Array of values
     * @param {Number} index The index in the array in which to begin searching.
     * @return Number
     * @private
     */
    _getNextValidCoordValue: function(coords, index)
    {
        var coord,
            isNumber = Y_Lang.isNumber,
            limit = coords.length;
        while(!isNumber(coord) && index < limit)
        {
            index = index + 1;
            coord = coords[index];
        }
        return coord;
    },

    /**
     * Cleans invalid y-coordinates by calculating their value based on the corresponding x-coordinate, the previous valid y-coordinate with its 
     * corresponding x-coordinate and the next valid y-coordinate with its corresponding x-coordinate. If there is no previous or next valid y-coordinate,
     * the value will not be altered.
     *
     * @method _cleanYNaN
     * @param {Array} xcoords An array of x-coordinate values
     * @param {Array} ycoords An arry of y-coordinate values
     * @private
     */
    _cleanYNaN: function(xcoords, ycoords)
    {
        var previousValidIndex,
            nextValidIndex,
            previousValidX,
            previousValidY,
            x,
            y,
            nextValidX,
            nextValidY,
            isNumber = Y_Lang.isNumber,
            m,
            i = 0,
            len = xcoords.length;
        for(; i < len; ++i)
        {
            x = xcoords[i];
            y = ycoords[i];
            //if y is invalid, calculate where it should be
            if(!isNumber(y) && i > 0 && i < len - 1)
            {
                //check to see if the previous value is valid
                previousValidX = xcoords[i - 1];
                previousValidY = this._getPreviousValidCoordValue(ycoords, i);
                //check to see if the next value is valid
                nextValidX = xcoords[i + 1];
                nextValidY = this._getNextValidCoordValue(ycoords, i);
                if(isNumber(previousValidY) && isNumber(nextValidY))
                {
                    //calculate slope and solve for y
                    m = (nextValidY - previousValidY) / (nextValidX - previousValidX);
                    ycoords[i] = previousValidY + ((m * x) - (m * previousValidX));
                }
                previousValidIndex = NaN;
                nextValidIndex = NaN;
            }
        }
    }
};
Y.StackingUtil = StackingUtil;
/**
 * Utility class used for drawing lines.
 *
 * @module charts
 * @submodule charts-base
 * @class Lines
 * @constructor
 */
function Lines(){}

Lines.prototype = {
    /**
     * @property _lineDefaults
     * @type Object
     * @private
     */
    _lineDefaults: null,
    
    /**
     * Creates a graphic in which to draw a series.
     *
     * @method _getGraphic
     * @return Graphic
     * @private
     */
    _getGraphic: function()
    {
        var graphic = this.get("graphic") || this.get("graph").get("graphic");
        if(!this._lineGraphic)
        {
            this._lineGraphic = graphic.addShape({type: "path"});
        }
        this._lineGraphic.clear();
        return this._lineGraphic;
    },
    
    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} visible indicates visibilitye
     * @private
     */
    _toggleVisible: function(visible)
    {
        if(this._lineGraphic)
        {
            this._lineGraphic.set("visible", visible);
        }
    },

    /**
     * Draws lines for the series.
     *
     * @method drawLines
     * @protected
     */
    drawLines: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var isNumber = Y_Lang.isNumber,
            xcoords,
            ycoords,
            direction = this.get("direction"),
            len,
            lastPointValid,
            pointValid,
            noPointsRendered = true,
            lastValidX,
            lastValidY,
            nextX,
            nextY,
            i,
            styles = this.get("styles").line,
            lineType = styles.lineType,
            lc = styles.color || this._getDefaultColor(this.get("graphOrder"), "line"),
            lineAlpha = styles.alpha,
            dashLength = styles.dashLength,
            gapSpace = styles.gapSpace,
            connectDiscontinuousPoints = styles.connectDiscontinuousPoints,
            discontinuousType = styles.discontinuousType,
            discontinuousDashLength = styles.discontinuousDashLength,
            discontinuousGapSpace = styles.discontinuousGapSpace,
            path = this._getGraphic();
        if(this._stacked)
        {
            xcoords = this.get("stackedXCoords");
            ycoords = this.get("stackedYCoords");
        }
        else
        {
            xcoords = this.get("xcoords");
            ycoords = this.get("ycoords");
        }
        len = direction === "vertical" ? ycoords.length : xcoords.length;
        path.set("stroke", {
            weight: styles.weight, 
            color: lc, 
            opacity: lineAlpha
        });
        for(i = 0; i < len; i = ++i)
        {
            nextX = xcoords[i];
            nextY = ycoords[i];
            pointValid = isNumber(nextX) && isNumber(nextY); 
            if(!pointValid)
            {
                lastPointValid = pointValid;
                continue;
            }
            if(noPointsRendered)
            {
                noPointsRendered = false;
                path.moveTo(nextX, nextY);
            }
            else if(lastPointValid)
            {
                if(lineType != "dashed")
                {
                    path.lineTo(nextX, nextY);
                }
                else
                {
                    this.drawDashedLine(path, lastValidX, lastValidY, nextX, nextY, 
                                                dashLength, 
                                                gapSpace);
                }
            }
            else if(!connectDiscontinuousPoints)
            {
                path.moveTo(nextX, nextY);
            }
            else
            {
                if(discontinuousType != "solid")
                {
                    this.drawDashedLine(path, lastValidX, lastValidY, nextX, nextY, 
                                                discontinuousDashLength, 
                                                discontinuousGapSpace);
                }
                else
                {
                    path.lineTo(nextX, nextY);
                }
            }
            lastValidX = nextX;
            lastValidY = nextY;
            lastPointValid = true;
        }
        path.end();
    },
    
    /**
     * Connects data points with a consistent curve for a series.
     * 
     * @method drawSpline
     * @protected
     */
    drawSpline: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            curvecoords = this.getCurveControlPoints(xcoords, ycoords),
            len = curvecoords.length,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
            styles = this.get("styles").line,
            path = this._getGraphic(),
            lineAlpha = styles.alpha,
            color = styles.color || this._getDefaultColor(this.get("graphOrder"), "line");
        path.set("stroke", { 
            weight: styles.weight, 
            color: color, 
            opacity: lineAlpha
        });
        path.moveTo(xcoords[0], ycoords[0]);
        for(; i < len; i = ++i)
        {
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            path.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        path.end();
    },

    /**
     * Draws a dashed line between two points.
     * 
     * @method drawDashedLine
     * @param {Number} xStart	The x position of the start of the line
     * @param {Number} yStart	The y position of the start of the line
     * @param {Number} xEnd		The x position of the end of the line
     * @param {Number} yEnd		The y position of the end of the line
     * @param {Number} dashSize	the size of dashes, in pixels
     * @param {Number} gapSize	the size of gaps between dashes, in pixels
     * @private
     */
    drawDashedLine: function(path, xStart, yStart, xEnd, yEnd, dashSize, gapSize)
    {
        dashSize = dashSize || 10;
        gapSize = gapSize || 10;
        var segmentLength = dashSize + gapSize,
            xDelta = xEnd - xStart,
            yDelta = yEnd - yStart,
            delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),
            segmentCount = Math.floor(Math.abs(delta / segmentLength)),
            radians = Math.atan2(yDelta, xDelta),
            xCurrent = xStart,
            yCurrent = yStart,
            i;
        xDelta = Math.cos(radians) * segmentLength;
        yDelta = Math.sin(radians) * segmentLength;
        
        for(i = 0; i < segmentCount; ++i)
        {
            path.moveTo(xCurrent, yCurrent);
            path.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
            xCurrent += xDelta;
            yCurrent += yDelta;
        }
        
        path.moveTo(xCurrent, yCurrent);
        delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
        
        if(delta > dashSize)
        {
            path.lineTo(xCurrent + Math.cos(radians) * dashSize, yCurrent + Math.sin(radians) * dashSize);
        }
        else if(delta > 0)
        {
            path.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
        }
        
        path.moveTo(xEnd, yEnd);
    },

    /**
     * Default values for `styles` attribute.
     *
     * @method _getLineDefaults
     * @return Object
     * @protected
     */
    _getLineDefaults: function()
    {
        return {
            alpha: 1,
            weight: 6,
            lineType:"solid", 
            dashLength:10, 
            gapSpace:10, 
            connectDiscontinuousPoints:true, 
            discontinuousType:"solid", 
            discontinuousDashLength:10, 
            discontinuousGapSpace:10
        };
    }
};
Y.augment(Lines, Y.Attribute);
Y.Lines = Lines;
/**
 * Utility class used for drawing area fills.
 *
 * @module charts
 * @class Fills
 * @constructor
 */
function Fills(cfg)
{
    var attrs = {
        area: {
            getter: function()
            {
                return this._defaults || this._getAreaDefaults();
            },

            setter: function(val)
            {
                var defaults = this._defaults || this._getAreaDefaults();
                this._defaults = Y.merge(defaults, val);
            }
        }
    };
    this.addAttrs(attrs, cfg);
    this.get("styles");
}

Fills.prototype = {
    /**
     * Returns a path shape used for drawing fills.
     *
     * @method _getPath
     * @return Path
     * @private
     */
    _getPath: function()
    {
        var path = this._path;
        if(!path)
        {
            path = this.get("graph").get("graphic").addShape({type:"path"});
            this._path = path;
        }
        return path;
    },
    
    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} visible indicates visibilitye
     * @private
     */
    _toggleVisible: function(visible)
    {   
        if(this._path)
        {
            this._path.set("visible", visible);
        }
    },

    /**
     * Draws fill
     *
     * @method drawFill
     * @param {Array} xcoords The x-coordinates for the series.
     * @param {Array} ycoords The y-coordinates for the series.
     * @protected
     */
    drawFill: function(xcoords, ycoords)
    {
        if(xcoords.length < 1) 
        {
            return;
        }
        var isNumber = Y_Lang.isNumber,
            len = xcoords.length,
            firstX = xcoords[0],
            firstY = ycoords[0],
            lastValidX = firstX,
            lastValidY = firstY,
            nextX,
            nextY,
            pointValid,
            noPointsRendered = true,
            i = 0,
            styles = this.get("styles").area,
            path = this._getPath(),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"), "slice");
        path.clear();
        path.set("fill", {
            color: color, 
            opacity: styles.alpha
        });
        path.set("stroke", {weight: 0});
        for(; i < len; i = ++i)
        {
            nextX = xcoords[i];
            nextY = ycoords[i];
            pointValid = isNumber(nextX) && isNumber(nextY); 
            if(!pointValid)
            {
                continue;
            }
            if(noPointsRendered)
            {
                this._firstValidX = nextX;
                this._firstValidY = nextY;
                noPointsRendered = false;
                path.moveTo(nextX, nextY);
            }
            else
            {
                path.lineTo(nextX, nextY);
            }
            lastValidX = nextX;
            lastValidY = nextY;
        }
        this._lastValidX = lastValidX;
        this._lastValidY = lastValidY;
        path.end();
    },
	
    /**
     * Draws a fill for a spline
     *
     * @method drawAreaSpline
     * @protected
     */
    drawAreaSpline: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            curvecoords = this.getCurveControlPoints(xcoords, ycoords),
            len = curvecoords.length,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
            firstX = xcoords[0],
            firstY = ycoords[0],
            styles = this.get("styles").area,
            path = this._getPath(),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"), "slice");
        path.set("fill", {
            color: color, 
            opacity: styles.alpha
        });
        path.set("stroke", {weight: 0});
        path.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
        {
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            path.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        if(this.get("direction") === "vertical")
        {
            path.lineTo(this._leftOrigin, y);
            path.lineTo(this._leftOrigin, firstY);
        }
        else
        {
            path.lineTo(x, this._bottomOrigin);
            path.lineTo(firstX, this._bottomOrigin);
        }
        path.lineTo(firstX, firstY);
        path.end();
    },
    
    /**
     * Draws a a stacked area spline
     *
     * @method drawStackedAreaSpline
     * @protected
     */
    drawStackedAreaSpline: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            curvecoords,
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            prevXCoords,
            prevYCoords,
            len,
            cx1,
            cx2,
            cy1,
            cy2,
            x,
            y,
            i = 0,
            firstX,
            firstY,
            styles = this.get("styles").area,
            path = this._getPath(),
            color = styles.color || this._getDefaultColor(this.get("graphOrder"), "slice");
        firstX = xcoords[0];
        firstY = ycoords[0];
        curvecoords = this.getCurveControlPoints(xcoords, ycoords);
        len = curvecoords.length;
        path.set("fill", {
            color: color, 
            opacity: styles.alpha
        });
        path.set("stroke", {weight: 0});
        path.moveTo(firstX, firstY);
        for(; i < len; i = ++i)
        {
            x = curvecoords[i].endx;
            y = curvecoords[i].endy;
            cx1 = curvecoords[i].ctrlx1;
            cx2 = curvecoords[i].ctrlx2;
            cy1 = curvecoords[i].ctrly1;
            cy2 = curvecoords[i].ctrly2;
            path.curveTo(cx1, cy1, cx2, cy2, x, y);
        }
        if(order > 0)
        {
            prevXCoords = seriesCollection[order - 1].get("xcoords").concat().reverse();
            prevYCoords = seriesCollection[order - 1].get("ycoords").concat().reverse();
            curvecoords = this.getCurveControlPoints(prevXCoords, prevYCoords);
            i = 0;
            len = curvecoords.length;
            path.lineTo(prevXCoords[0], prevYCoords[0]);
            for(; i < len; i = ++i)
            {
                x = curvecoords[i].endx;
                y = curvecoords[i].endy;
                cx1 = curvecoords[i].ctrlx1;
                cx2 = curvecoords[i].ctrlx2;
                cy1 = curvecoords[i].ctrly1;
                cy2 = curvecoords[i].ctrly2;
                path.curveTo(cx1, cy1, cx2, cy2, x, y);
            }
        }
        else
        {
            if(this.get("direction") === "vertical")
            {
                path.lineTo(this._leftOrigin, ycoords[ycoords.length-1]);
                path.lineTo(this._leftOrigin, firstY);
            }
            else
            {
                path.lineTo(xcoords[xcoords.length-1], this._bottomOrigin);
                path.lineTo(firstX, this._bottomOrigin);
            }

        }
        path.lineTo(firstX, firstY);
        path.end();
    },
    
    /**
     * Storage for default area styles.
     *
     * @property _defaults
     * @type Object
     * @private
     */
    _defaults: null,

    /**
     * Concatenates coordinate array with correct coordinates for closing an area fill.
     *
     * @method _getClosingPoints
     * @return Array
     * @protected
     */
    _getClosingPoints: function()
    {
        var xcoords = this.get("xcoords").concat(),
            ycoords = this.get("ycoords").concat(),
            firstValidIndex,
            lastValidIndex;
        if(this.get("direction") === "vertical")
        {
            lastValidIndex = this._getLastValidIndex(xcoords);
            firstValidIndex = this._getFirstValidIndex(xcoords);
            ycoords.push(ycoords[lastValidIndex]);
            ycoords.push(ycoords[firstValidIndex]);
            xcoords.push(this._leftOrigin);
            xcoords.push(this._leftOrigin);
        }
        else
        {
            lastValidIndex = this._getLastValidIndex(ycoords);
            firstValidIndex = this._getFirstValidIndex(ycoords);
            xcoords.push(xcoords[lastValidIndex]);
            xcoords.push(xcoords[firstValidIndex]);
            ycoords.push(this._bottomOrigin);
            ycoords.push(this._bottomOrigin);
        }
        xcoords.push(xcoords[0]);
        ycoords.push(ycoords[0]);
        return [xcoords, ycoords];
    },

    /**
     * Returns the order of the series closest to the current series that has a valid value for the current index.
     *
     * @method _getHighestValidOrder
     * @param {Array} seriesCollection Array of series of a given type.
     * @param {Number} index Index of the series item.
     * @param {Number} order Index of the the series in the seriesCollection
     * @param {String} direction Indicates the direction of the series
     * @return Number
     * @private
     */
    _getHighestValidOrder: function(seriesCollection, index, order, direction)
    {
        var coords = direction == "vertical" ? "stackedXCoords" : "stackedYCoords",
            coord;
        while(isNaN(coord) && order > -1)
        {
          order = order - 1;
          if(order > -1)
          {
            coord = seriesCollection[order].get(coords)[index];
          }
        }
        return order;
    },
    
    /**
     * Returns an array containing the x and y coordinates for a given series and index.
     *
     * @method _getCoordsByOrderAndIndex
     * @param {Array} seriesCollection Array of series of a given type.
     * @param {Number} index Index of the series item.
     * @param {Number} order Index of the the series in the seriesCollection
     * @param {String} direction Indicates the direction of the series
     * @return Array
     * @private
     */
    _getCoordsByOrderAndIndex: function(seriesCollection, index, order, direction)
    {
        var xcoord,
            ycoord;
        if(direction == "vertical")
        {
            xcoord = order < 0 ? this._leftOrigin : seriesCollection[order].get("stackedXCoords")[index];
            ycoord = this.get("stackedYCoords")[index];
        }
        else
        {
            xcoord = this.get("stackedXCoords")[index];
            ycoord = order < 0 ? this._bottomOrigin : seriesCollection[order].get("stackedYCoords")[index];
        }
        return [xcoord, ycoord];
    },
    
    /**
     * Concatenates coordinate array with the correct coordinates for closing an area stack.
     *
     * @method _getStackedClosingPoints
     * @return Array
     * @protected
     */
    _getStackedClosingPoints: function()
    {
        var order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            direction = this.get("direction"),
            seriesCollection = graph.seriesTypes[type],
            firstValidIndex,
            lastValidIndex,
            xcoords = this.get("stackedXCoords"),
            ycoords = this.get("stackedYCoords"),
            limit,
            previousSeries,
            previousSeriesFirstValidIndex,
            previousSeriesLastValidIndex,
            previousXCoords,
            previousYCoords,
            coords,
            closingXCoords,
            closingYCoords,
            currentIndex,
            highestValidOrder,
            oldOrder;
        if(order < 1)
        {    
          return this._getClosingPoints();
        }
        
        previousSeries = seriesCollection[order - 1];
        previousXCoords = previousSeries.get("stackedXCoords").concat();
        previousYCoords = previousSeries.get("stackedYCoords").concat();
        if(direction == "vertical")
        {
            firstValidIndex = this._getFirstValidIndex(xcoords);
            lastValidIndex = this._getLastValidIndex(xcoords);
            previousSeriesFirstValidIndex = previousSeries._getFirstValidIndex(previousXCoords);
            previousSeriesLastValidIndex = previousSeries._getLastValidIndex(previousXCoords);
        }
        else
        {
            firstValidIndex = this._getFirstValidIndex(ycoords);
            lastValidIndex = this._getLastValidIndex(ycoords);
            previousSeriesFirstValidIndex = previousSeries._getFirstValidIndex(previousYCoords);
            previousSeriesLastValidIndex = previousSeries._getLastValidIndex(previousYCoords);
        }
        if(previousSeriesLastValidIndex >= firstValidIndex && previousSeriesFirstValidIndex <= lastValidIndex)
        {
            previousSeriesFirstValidIndex = Math.max(firstValidIndex, previousSeriesFirstValidIndex);
            previousSeriesLastValidIndex = Math.min(lastValidIndex, previousSeriesLastValidIndex);
            previousXCoords = previousXCoords.slice(previousSeriesFirstValidIndex, previousSeriesLastValidIndex + 1);
            previousYCoords = previousYCoords.slice(previousSeriesFirstValidIndex, previousSeriesLastValidIndex + 1);
            limit = previousSeriesFirstValidIndex;
        }
        else
        {
            limit = lastValidIndex;
        }

        closingXCoords = [xcoords[firstValidIndex]];
        closingYCoords = [ycoords[firstValidIndex]];
        currentIndex = firstValidIndex;
        while((isNaN(highestValidOrder) || highestValidOrder < order - 1) && currentIndex <= limit)
        {
            oldOrder = highestValidOrder;
            highestValidOrder = this._getHighestValidOrder(seriesCollection, currentIndex, order, direction);
            if(!isNaN(oldOrder) && highestValidOrder > oldOrder)
            {
                coords = this._getCoordsByOrderAndIndex(seriesCollection, currentIndex, oldOrder, direction);
                closingXCoords.push(coords[0]);
                closingYCoords.push(coords[1]);
            }
            coords = this._getCoordsByOrderAndIndex(seriesCollection, currentIndex, highestValidOrder, direction);
            closingXCoords.push(coords[0]);
            closingYCoords.push(coords[1]);
            currentIndex = currentIndex + 1;
        }
        if(previousXCoords && previousXCoords.length > 0 && previousSeriesLastValidIndex > firstValidIndex && previousSeriesFirstValidIndex < lastValidIndex)
        {
            closingXCoords = closingXCoords.concat(previousXCoords);
            closingYCoords = closingYCoords.concat(previousYCoords);
            highestValidOrder = order -1; 
        }
        currentIndex = Math.max(firstValidIndex, previousSeriesLastValidIndex);
        order = order - 1;
        highestValidOrder = NaN;
        while(currentIndex <= lastValidIndex)
        {
            oldOrder = highestValidOrder;
            highestValidOrder = this._getHighestValidOrder(seriesCollection, currentIndex, order, direction);
            if(!isNaN(oldOrder))
            {
                if(highestValidOrder > oldOrder)
                {
                    coords = this._getCoordsByOrderAndIndex(seriesCollection, currentIndex, oldOrder, direction);
                    closingXCoords.push(coords[0]);
                    closingYCoords.push(coords[1]);
                }
                else if(highestValidOrder < oldOrder)
                {
                    coords = this._getCoordsByOrderAndIndex(seriesCollection, currentIndex - 1, highestValidOrder, direction);
                    closingXCoords.push(coords[0]);
                    closingYCoords.push(coords[1]);
                }
            }
            coords = this._getCoordsByOrderAndIndex(seriesCollection, currentIndex, highestValidOrder, direction);
            closingXCoords.push(coords[0]);
            closingYCoords.push(coords[1]);
            currentIndex = currentIndex + 1;
        }

        closingXCoords.reverse();
        closingYCoords.reverse();
        return [xcoords.concat(closingXCoords), ycoords.concat(closingYCoords)];
    },

    /**
     * Returns default values for area styles.
     *
     * @method _getAreaDefaults
     * @return Object
     * @private
     */
    _getAreaDefaults: function()
    {
        return {
        };
    }
};
Y.augment(Fills, Y.Attribute);
Y.Fills = Fills;
/**
 * Utility class used for drawing markers.
 *
 * @module charts
 * @submodule charts-base
 * @class Plots
 * @constructor
 */
function Plots(cfg)
{
    var attrs = { 
        markers: {
            getter: function()
            {
                return this._markers;
            }
        }
    };
    this.addAttrs(attrs, cfg);
}

Plots.prototype = {
    /**
     * Storage for default marker styles.
     *
     * @property _plotDefaults
     * @type Object
     * @private
     */
    _plotDefaults: null,

    /**
     * Draws the markers
     *
     * @method drawPlots
     * @protected
     */
    drawPlots: function()
    {
        if(!this.get("xcoords") || this.get("xcoords").length < 1) 
		{
			return;
		}
        var isNumber = Y_Lang.isNumber,
            style = Y.clone(this.get("styles").marker),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left,
            marker,
            offsetWidth = w/2,
            offsetHeight = h/2,
            xvalues,
            yvalues,
            fillColors = null,
            borderColors = null,
            graphOrder = this.get("graphOrder"),
            groupMarkers = this.get("groupMarkers");
        if(groupMarkers)
        {
            xvalues = [];
            yvalues = [];
            for(; i < len; ++i)
            {
                xvalues.push(parseFloat(xcoords[i] - offsetWidth));
                yvalues.push(parseFloat(ycoords[i] - offsetHeight));
            }
            this._createGroupMarker({
                xvalues: xvalues,
                yvalues: yvalues,
                fill: style.fill,
                border: style.border,
                dimensions: {
                    width: w,
                    height: h
                },
                graphOrder: graphOrder,
                shape: style.shape
            });
            return;
        }
        if(Y_Lang.isArray(style.fill.color))
        {
            fillColors = style.fill.color.concat(); 
        }
        if(Y_Lang.isArray(style.border.color))
        {
            borderColors = style.border.color.concat();
        }
        this._createMarkerCache();
        for(; i < len; ++i)
        {
            top = parseFloat(ycoords[i] - offsetHeight);
            left = parseFloat(xcoords[i] - offsetWidth);            
            if(!isNumber(left) || !isNumber(top))
            {
                this._markers.push(null);
                continue;
            }
            if(fillColors)
            {
                style.fill.color = fillColors[i % fillColors.length];
            }
            if(borderColors)
            {
                style.border.color = borderColors[i % borderColors.length];
            }

            style.x = left;
            style.y = top;
            marker = this.getMarker(style, graphOrder, i);
        }
        this._clearMarkerCache();
    },

    /**
     * Pre-defined group shapes.
     *
     * @property _groupShapes
     * @private
     */
    _groupShapes: {
        circle: Y.CircleGroup,
        rect: Y.RectGroup,
        ellipse: Y.EllipseGroup,
        diamond: Y.DiamondGroup
    },

    /**
     * Returns the correct group shape class.
     *
     * @method _getGroupShape
     * @param {Shape | String} shape Indicates which shape class. 
     * @return Function
     * @protected
     */
    _getGroupShape: function(shape)
    {
        if(Y_Lang.isString(shape))
        {
            shape = this._groupShapes[shape];
        }
        return shape;
    },

    /**
     * Gets the default values for series that use the utility. This method is used by
     * the class' `styles` attribute's getter to get build default values.
     *
     * @method _getPlotDefaults
     * @return Object
     * @protected
     */
    _getPlotDefaults: function()
    {
        var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 1,
                alpha: 1
            },
            width: 10,
            height: 10,
            shape: "circle"
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    },

    /**
     * Collection of markers to be used in the series.
     *
     * @property _markers
     * @type Array
     * @private
     */
    _markers: null,

    /**
     * Collection of markers to be re-used on a series redraw.
     *
     * @property _markerCache
     * @type Array
     * @private
     */
    _markerCache: null,
   
    /**
     * Gets and styles a marker. If there is a marker in cache, it will use it. Otherwise
     * it will create one.
     *
     * @method getMarker
     * @param {Object} styles Hash of style properties.
     * @param {Number} order Order of the series.
     * @param {Number} index Index within the series associated with the marker.
     * @return Shape
     * @protected
     */
    getMarker: function(styles, order, index)
    {
        var marker,
            border = styles.border;
        styles.id = this.get("chart").get("id") + "_" + order + "_" + index;
        //fix name differences between graphic layer
        border.opacity = border.alpha;
        styles.stroke = border;
        styles.fill.opacity = styles.fill.alpha;
        if(this._markerCache.length > 0)
        {
            while(!marker)
            {
                if(this._markerCache.length < 1)
                {
                    marker = this._createMarker(styles, order, index);
                    break;
                }
                marker = this._markerCache.shift();

            }
            marker.set(styles);
        }
        else
        {
            marker = this._createMarker(styles, order, index);
        }
        this._markers.push(marker);
        return marker;
    },
    
    /**
     * Creates a shape to be used as a marker.
     *
     * @method _createMarker
     * @param {Object} styles Hash of style properties.
     * @param {Number} order Order of the series.
     * @param {Number} index Index within the series associated with the marker.
     * @return Shape
     * @private
     */
    _createMarker: function(styles, order, index)
    {
        var graphic = this.get("graphic"),
            marker,
            cfg = Y.clone(styles);
        graphic.set("autoDraw", false);
        cfg.type = cfg.shape;
        marker = graphic.addShape(cfg); 
        marker.addClass(SERIES_MARKER);
        return marker;
    },
    
    /**
     * Creates a cache of markers for reuse.
     *
     * @method _createMarkerCache
     * @private
     */
    _createMarkerCache: function()
    {
        if(this._groupMarker)
        {
            this._groupMarker.destroy();
            this._groupMarker = null;
        }
        if(this._markers && this._markers.length > 0)
        {
            this._markerCache = this._markers.concat();
        }
        else
        {
            this._markerCache = [];
        }
        this._markers = [];
    },
  
    /**
     * Draws a series of markers in a single shape instance.
     *
     * @method _createGroupMarkers
     * @param {Object} styles Set of configuration properties used to create the markers.
     * @protected
     */
    _createGroupMarker: function(styles)
    {
        var marker,
            markers = this.get("markers"),
            border = styles.border,
            graphic,
            cfg,
            shape;
        if(markers && markers.length > 0)
        {
            while(markers.length > 0)
            {
                marker = markers.shift();
                marker.destroy();
            }
            this.set("markers", []);
        }
        //fix name differences between graphic layer
        border.opacity = border.alpha;
        cfg = {
            id: this.get("chart").get("id") + "_" + styles.graphOrder,
            stroke: border,
            fill: styles.fill,
            dimensions: styles.dimensions,
            xvalues: styles.xvalues,
            yvalues: styles.yvalues
        };
        cfg.fill.opacity = styles.fill.alpha;
        shape = this._getGroupShape(styles.shape);
        if(shape)
        {
            cfg.type = shape;
        }
        if(styles.hasOwnProperty("radius") && !isNaN(styles.radius))
        {
            cfg.dimensions.radius = styles.radius;
        }
        if(this._groupMarker)
        {
            this._groupMarker.destroy();
        }
        graphic = this.get("graphic");
        this._groupMarker = graphic.addShape(cfg);
        graphic._redraw();
    },

    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} visible indicates visibilitye
     * @private
     */
    _toggleVisible: function(visible)
    {
        var marker,
            markers = this.get("markers"),
            i = 0,
            len;
        if(markers)
        {
            len = markers.length;
            for(; i < len; ++i)
            {
                marker = markers[i];
                if(marker)
                {
                    marker.set("visible", visible);
                }
            }
        }
    },

    /**
     * Removes unused markers from the marker cache
     *
     * @method _clearMarkerCache
     * @private
     */
    _clearMarkerCache: function()
    {
        var marker;
        while(this._markerCache.length > 0)
        {
            marker = this._markerCache.shift();
            if(marker)
            {
                marker.destroy();
            }
        }
    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers && this._markers[i])
        {
            var w,
                h,
                styles = Y.clone(this.get("styles").marker),
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                markerStyles.stroke = markerStyles.border;
                marker.set(markerStyles);
                w = markerStyles.width;
                h = markerStyles.height;
                marker.set("x", (xcoords[i] - w/2));
                marker.set("y",  (ycoords[i] - h/2));
                marker.set("visible", this.get("visible"));
        }
    },

    /**
     * Parses a color from an array.
     *
     * @method _getItemColor
     * @param {Array} val collection of colors
     * @param {Number} i index of the item
     * @return String
     * @protected
     */
    _getItemColor: function(val, i)
    {
        if(Y_Lang.isArray(val))
        {
            return val[i % val.length];
        }
        return val;
    },

    /**
     * Method used by `styles` setter. Overrides base implementation.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     * @protected
     */
    _setStyles: function(val)
    {
        val = this._parseMarkerStyles(val);
        return Y.Renderer.prototype._setStyles.apply(this, [val]);
    },

    /**
     * Combines new styles with existing styles.
     *
     * @method _parseMarkerStyles
     * @param {Object} Object containing style properties for the marker.
     * @return Object
     * @private
     */
    _parseMarkerStyles: function(val)
    {
        if(val.marker)
        {
            var defs = this._getPlotDefaults();
            val.marker = this._mergeStyles(val.marker, defs);
            if(val.marker.over)
            {
                val.marker.over = this._mergeStyles(val.marker.over, val.marker);
            }
            if(val.marker.down)
            {
                val.marker.down = this._mergeStyles(val.marker.down, val.marker);
            }
        }
        return val;
    },

    /**
     * Returns marker state based on event type
     *
     * @method _getState
     * @param {String} type event type
     * @return String
     * @protected
     */
    _getState: function(type)
    {
        var state;
        switch(type)
        {
            case "mouseout" :
                state = "off";
            break;
            case "mouseover" :
                state = "over";
            break;
            case "mouseup" :
                state = "over";
            break;
            case "mousedown" :
                state = "down";
            break;
        }
        return state;
    },
    
    /**
     * @property _statSyles
     * @type Object
     * @private
     */
    _stateSyles: null
};

Y.augment(Plots, Y.Attribute);
Y.Plots = Plots;
/**
 * Histogram is the base class for Column and Bar series.
 *
 * @module charts
 * @submodule charts-base
 * @class Histogram
 * @constructor
 */
function Histogram(){}

Histogram.prototype = {
    /**
     * Draws the series.
     *
     * @method drawSeries
     * @protected
     */
    drawSeries: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var style = Y.clone(this.get("styles").marker),
            setSize,
            calculatedSize,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            seriesLen = seriesCollection.length,
            seriesSize = 0,
            totalSize = 0,
            offset = 0,
            ratio,
            renderer,
            order = this.get("order"),
            graphOrder = this.get("graphOrder"),
            left,
            marker,
            setSizeKey,
            calculatedSizeKey,
            config,
            fillColors = null,
            borderColors = null,
            xMarkerPlane = [],
            yMarkerPlane = [],
            xMarkerPlaneLeft,
            xMarkerPlaneRight,
            yMarkerPlaneTop,
            yMarkerPlaneBottom,
            dimensions = {
                width: [],
                height: []
            },
            xvalues = [],
            yvalues = [],
            groupMarkers = this.get("groupMarkers");
        if(Y_Lang.isArray(style.fill.color))
        {
            fillColors = style.fill.color.concat(); 
        }
        if(Y_Lang.isArray(style.border.color))
        {
            borderColors = style.border.color.concat();
        }
        if(this.get("direction") == "vertical")
        {
            setSizeKey = "height";
            calculatedSizeKey = "width";
        }
        else
        {
            setSizeKey = "width";
            calculatedSizeKey = "height";
        }
        setSize = style[setSizeKey];
        calculatedSize = style[calculatedSizeKey];
        this._createMarkerCache();
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesSize += renderer.get("styles").marker[setSizeKey];
            if(order > i) 
            {
                offset = seriesSize;
            }
        }
        totalSize = len * seriesSize;
        this._maxSize = graph.get(setSizeKey);
        if(totalSize > this._maxSize)
        {
            ratio = graph.get(setSizeKey)/totalSize;
            seriesSize *= ratio;
            offset *= ratio;
            setSize *= ratio;
            setSize = Math.max(setSize, 1);
            this._maxSize = setSize;
        }
        offset -= seriesSize/2;
        for(i = 0; i < len; ++i)
        {
            xMarkerPlaneLeft = xcoords[i] - seriesSize/2;
            xMarkerPlaneRight = xMarkerPlaneLeft + seriesSize;
            yMarkerPlaneTop = ycoords[i] - seriesSize/2;
            yMarkerPlaneBottom = yMarkerPlaneTop + seriesSize;
            xMarkerPlane.push({start: xMarkerPlaneLeft, end: xMarkerPlaneRight});
            yMarkerPlane.push({start: yMarkerPlaneTop, end: yMarkerPlaneBottom});
            if(isNaN(xcoords[i]) || isNaN(ycoords[i]))
            {
                this._markers.push(null);
                continue;
            }
            config = this._getMarkerDimensions(xcoords[i], ycoords[i], calculatedSize, offset);
            if(!isNaN(config.calculatedSize) && config.calculatedSize > 0)
            {
                top = config.top;
                left = config.left;

                if(groupMarkers)
                {
                    dimensions[setSizeKey][i] = setSize;
                    dimensions[calculatedSizeKey][i] = config.calculatedSize;
                    xvalues.push(left);
                    yvalues.push(top);
                }
                else
                {
                    style[setSizeKey] = setSize;
                    style[calculatedSizeKey] = config.calculatedSize;
                    style.x = left;
                    style.y = top;
                    if(fillColors)
                    {
                        style.fill.color = fillColors[i % fillColors.length];
                    }
                    if(borderColors)
                    {
                        style.border.color = borderColors[i % borderColors.length];
                    }
                    marker = this.getMarker(style, graphOrder, i);
                }

            }
            else if(!groupMarkers)
            {
                this._markers.push(null);
            }
        }
        this.set("xMarkerPlane", xMarkerPlane);
        this.set("yMarkerPlane", yMarkerPlane);
        if(groupMarkers)
        {
            this._createGroupMarker({
                fill: style.fill,
                border: style.border,
                dimensions: dimensions,
                xvalues: xvalues,
                yvalues: yvalues,
                shape: style.shape
            });
        }
        else
        {
            this._clearMarkerCache();
        }
    },
    
    /**
     * Collection of default colors used for marker fills in a series when not specified by user.
     *
     * @property _defaultFillColors
     * @type Array
     * @protected
     */
    _defaultFillColors: ["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"],
    
    /**
     * Gets the default style values for the markers.
     *
     * @method _getPlotDefaults
     * @return Object
     * @private
     */
    _getPlotDefaults: function()
    {
        var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 0,
                alpha: 1
            },
            width: 12,
            height: 12,
            shape: "rect",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    }
};

Y.Histogram = Histogram;
/**
 * The CartesianSeries class creates a chart with horizontal and vertical axes.
 *
 * @module charts
 * @submodule charts-base
 * @class CartesianSeries
 * @extends Base
 * @uses Renderer
 * @constructor
 */
Y.CartesianSeries = Y.Base.create("cartesianSeries", Y.Base, [Y.Renderer], {
    /**
     * Storage for `xDisplayName` attribute.
     *
     * @property _xDisplayName
     * @type String
     * @private
     */
    _xDisplayName: null,

    /**
     * Storage for `yDisplayName` attribute.
     *
     * @property _yDisplayName
     * @type String
     * @private
     */
    _yDisplayName: null,
    
    /**
     * Th x-coordinate for the left edge of the series.
     *
     * @property _leftOrigin
     * @type String
     * @private
     */
    _leftOrigin: null,

    /**
     * The y-coordinate for the bottom edge of the series.
     * 
     * @property _bottomOrigin
     * @type String
     * @private
     */
    _bottomOrigin: null,

    /**
     * @method render
     * @private
     */
    render: function()
    {
        this._setCanvas();
        this.addListeners();
        this.set("rendered", true);
        this.validate();
    },

    /**
     * Adds event listeners.
     *
     * @method addListeners
     * @private
     */
    addListeners: function()
    {
        var xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis");
        if(xAxis)
        {
            this._xDataReadyHandle = xAxis.after("dataReady", Y.bind(this._xDataChangeHandler, this));
            this._xDataUpdateHandle = xAxis.after("dataUpdate", Y.bind(this._xDataChangeHandler, this));
        }
        if(yAxis)
        {
            this._yDataReadyHandle = yAxis.after("dataReady", Y.bind(this._yDataChangeHandler, this));
            this._yDataUpdateHandle = yAxis.after("dataUpdate", Y.bind(this._yDataChangeHandler, this));
        }
        this._xAxisChangeHandle = this.after("xAxisChange", this._xAxisChangeHandler);
        this._yAxisChangeHandle = this.after("yAxisChange", this._yAxisChangeHandler);
        this._stylesChangeHandle = this.after("stylesChange", function(e) {
            var axesReady = this._updateAxisData();
            if(axesReady)
            {
                this.draw();
            }
        });
        this._widthChangeHandle = this.after("widthChange", function(e) {
            var axesReady = this._updateAxisData();
            if(axesReady)
            {
                this.draw();
            }
        });
        this._heightChangeHandle = this.after("heightChange", function(e) {
            var axesReady = this._updateAxisData();
            if(axesReady)
            {
                this.draw();
            }
        });
        this._visibleChangeHandle = this.after("visibleChange", this._handleVisibleChange);
    },
  
    /**
     * Event handler for the xAxisChange event.
     *
     * @method _xAxisChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _xAxisChangeHandler: function(e)
    {
        var xAxis = this.get("xAxis");
        xAxis.after("dataReady", Y.bind(this._xDataChangeHandler, this));
        xAxis.after("dataUpdate", Y.bind(this._xDataChangeHandler, this));
    },
    
    /**
     * Event handler the yAxisChange event.
     *
     * @method _yAxisChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _yAxisChangeHandler: function(e)
    {
        var yAxis = this.get("yAxis");
        yAxis.after("dataReady", Y.bind(this._yDataChangeHandler, this));
        yAxis.after("dataUpdate", Y.bind(this._yDataChangeHandler, this));
    },

    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuicartesianseries",

    /**
     * Event handler for xDataChange event.
     *
     * @method _xDataChangeHandler
     * @param {Object} event Event object.
     * @private 
     */
    _xDataChangeHandler: function(event)
    {
        var axesReady = this._updateAxisData();
        if(axesReady)
        {
            this.draw();
        }
    },

    /**
     * Event handler for yDataChange event.
     *
     * @method _yDataChangeHandler
     * @param {Object} event Event object.
     * @private 
     */
    _yDataChangeHandler: function(event)
    {
        var axesReady = this._updateAxisData();
        if(axesReady)
        {
            this.draw();
        }
    },

    /**
     * Checks to ensure that both xAxis and yAxis data are available. If so, set the `xData` and `yData` attributes and return `true`. Otherwise, return `false`.
     *
     * @method _updateAxisData
     * @return Boolean
     * @private 
     */
    _updateAxisData: function()
    {
        var xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
            xKey = this.get("xKey"),
            yKey = this.get("yKey"),
            yData,
            xData;
        if(!xAxis || !yAxis || !xKey || !yKey)
        {
            return false;
        }
        xData = xAxis.getDataByKey(xKey);
        yData = yAxis.getDataByKey(yKey);
        if(!xData || !yData)
        {
            return false;
        }
        this.set("xData", xData.concat());
        this.set("yData", yData.concat());
        return true;
    },

    /**
     * Draws the series is the xAxis and yAxis data are both available.
     *
     * @method validate
     * @private
     */
    validate: function()
    {
        if((this.get("xData") && this.get("yData")) || this._updateAxisData())
        {
            this.draw();
        }
        else
        {
            this.fire("drawingComplete");
        }
    },

    /**
     * Creates a `Graphic` instance.
     *
     * @method _setCanvas
     * @protected
     */
    _setCanvas: function()
    {
        var graph = this.get("graph"),
            graphic = graph.get("graphic");
        this.set("graphic", graphic);
    },

    /**
     * Calculates the coordinates for the series.
     *
     * @method setAreaData
     * @protected
     */
    setAreaData: function()
    {
        var isNumber = Y_Lang.isNumber,
            nextX, nextY,
            graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height"),
            xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
            xData = this.get("xData").concat(),
            yData = this.get("yData").concat(),
            xValue,
            yValue,
            xOffset = xAxis.getEdgeOffset(xData.length, w),
            yOffset = yAxis.getEdgeOffset(yData.length, h),
            padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
			dataWidth = w - (leftPadding + padding.right + xOffset),
			dataHeight = h - (topPadding + padding.bottom + yOffset),
			xcoords = [],
			ycoords = [],
			xMax = xAxis.get("maximum"),
			xMin = xAxis.get("minimum"),
			yMax = yAxis.get("maximum"),
			yMin = yAxis.get("minimum"),
            xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
            dataLength,
            direction = this.get("direction"),
            i = 0,
            xMarkerPlane = [],
            yMarkerPlane = [],
            xMarkerPlaneOffset = this.get("xMarkerPlaneOffset"),
            yMarkerPlaneOffset = this.get("yMarkerPlaneOffset"),
            graphic = this.get("graphic");
        graphic.set("width", w);
        graphic.set("height", h);
        dataLength = xData.length;
        xOffset *= 0.5;
        yOffset *= 0.5;
        //Assuming a vertical graph has a range/category for its vertical axis.    
        if(direction === "vertical")
        {
            yData = yData.reverse();
        }
        this._leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding + xOffset);
        this._bottomOrigin = Math.round((dataHeight + topPadding + yOffset)); 
        if(yMin < 0)
        {
            this._bottomOrigin = this._bottomOrigin - ((0 - yMin) * yScaleFactor);
        }
        for (; i < dataLength; ++i) 
		{
            xValue = parseFloat(xData[i]);
            yValue = parseFloat(yData[i]);
            if(isNumber(xValue))
            {
                nextX = (((xValue - xMin) * xScaleFactor) + leftPadding + xOffset);
            }
            else
            {
                nextX = NaN;
            }
            if(isNumber(yValue))
            {
			    nextY = ((dataHeight + topPadding + yOffset) - (yValue - yMin) * yScaleFactor);
            }
            else
            {
                nextY = NaN;
            }
            xcoords.push(nextX);
            ycoords.push(nextY);
            xMarkerPlane.push({start:nextX - xMarkerPlaneOffset, end: nextX + xMarkerPlaneOffset});
            yMarkerPlane.push({start:nextY - yMarkerPlaneOffset, end: nextY + yMarkerPlaneOffset});
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
        this.set("xMarkerPlane", xMarkerPlane);
        this.set("yMarkerPlane", yMarkerPlane);
        this._dataLength = dataLength;
    },

    /**
     * Finds the first valid index of an array coordinates.
     *
     * @method _getFirstValidIndex
     * @param {Array} coords An array of x or y coordinates.
     * @return Number
     * @private
     */
    _getFirstValidIndex: function(coords)
    {
        var coord,
            i = -1,
            limit = coords.length;
        while(!Y_Lang.isNumber(coord) && i < limit)
        {
            i += 1;
            coord = coords[i];
        }
        return i;
    },

    /**
     * Finds the last valid index of an array coordinates.
     *
     * @method _getLastValidIndex
     * @param {Array} coords An array of x or y coordinates.
     * @return Number
     * @private
     */
    _getLastValidIndex: function(coords)
    {
        var coord,
            i = coords.length,
            limit = -1;
        while(!Y_Lang.isNumber(coord) && i > limit)
        {
            i -= 1;
            coord = coords[i];
        }
        return i;
    },

    /**
     * Draws the series.
     *
     * @method draw
     * @protected
     */
    draw: function()
    {
        var graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height");
        if(this.get("rendered"))
        {
            if((isFinite(w) && isFinite(h) && w > 0 && h > 0) && ((this.get("xData") && this.get("yData")) || this._updateAxisData()))
            {
                if(this._drawing)
                {
                    this._callLater = true;
                    return;
                }
                this._drawing = true;
                this._callLater = false;
                this.setAreaData();
                if(this.get("xcoords") && this.get("ycoords"))
                {
                    this.drawSeries();
                }
                this._drawing = false;
                if(this._callLater)
                {
                    this.draw();
                }
                else
                {
                    this._toggleVisible(this.get("visible"));
                    this.fire("drawingComplete");
                }
            }
        }
    },
    
    /**
     * Default value for plane offsets when the parent chart's `interactiveType` is `planar`. 
     *
     * @property _defaultPlaneOffset
     * @type Number
     * @private
     */
    _defaultPlaneOffset: 4,
    
    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        return {padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }};
    },

    /**
     * Collection of default colors used for lines in a series when not specified by user.
     *
     * @property _defaultLineColors
     * @type Array
     * @protected
     */
    _defaultLineColors:["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"],

    /**
     * Collection of default colors used for marker fills in a series when not specified by user.
     *
     * @property _defaultFillColors
     * @type Array
     * @protected
     */
    _defaultFillColors:["#6084d0", "#eeb647", "#6c6b5f", "#d6484f", "#ce9ed1", "#ff9f3b", "#93b7ff", "#e0ddd0", "#94ecba", "#309687"],
    
    /**
     * Collection of default colors used for marker borders in a series when not specified by user.
     *
     * @property _defaultBorderColors
     * @type Array
     * @protected
     */
    _defaultBorderColors:["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"],
    
    /**
     * Collection of default colors used for area fills, histogram fills and pie fills in a series when not specified by user.
     *
     * @property _defaultSliceColors
     * @type Array
     * @protected
     */
    _defaultSliceColors: ["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"],

    /**
     * Parses a color based on a series order and type.
     *
     * @method _getDefaultColor
     * @param {Number} index Index indicating the series order.
     * @param {String} type Indicates which type of object needs the color.
     * @return String
     * @protected
     */
    _getDefaultColor: function(index, type)
    {
        var colors = {
                line: this._defaultLineColors,
                fill: this._defaultFillColors,
                border: this._defaultBorderColors,
                slice: this._defaultSliceColors
            },
            col = colors[type],
            l = col.length;
        index = index || 0;
        if(index >= l)
        {
            index = index % l;
        }
        type = type || "fill";
        return colors[type][index];
    },
    
    /**
     * Shows/hides contents of the series.
     *
     * @method _handleVisibleChange
     * @param {Object} e Event object.
     * @protected
     */
    _handleVisibleChange: function(e) 
    {
        this._toggleVisible(this.get("visible"));
    },

    /**
     * Returns the sum of all values for the series.
     *
     * @method getTotalValues
     * @return Number
     */
    getTotalValues: function()
    {
        var total = this.get("valueAxis").getTotalByKey(this.get("valueKey"));
        return total;
    },

    /**
     * Destructor implementation for the CartesianSeries class. Calls destroy on all Graphic instances.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        var marker,
            markers = this.get("markers");
        if(this.get("rendered"))
        {
            if(this._xDataReadyHandle)
            {
                this._xDataReadyHandle.detach();
            }
            if(this._xDataUpdateHandle)
            {
                this._xDataUpdateHandle.detach();
            }
            if(this._yDataReadyHandle)
            {
                this._yDataReadyHandle.detach();
            }
            if(this._yDataUpdateHandle)
            {
                this._yDataUpdateHandle.detach();
            }
            this._xAxisChangeHandle.detach();
            this._yAxisChangeHandle.detach();
            this._stylesChangeHandle.detach();
            this._widthChangeHandle.detach();
            this._heightChangeHandle.detach();
            this._visibleChangeHandle.detach();
        }
        while(markers && markers.length > 0)
        {
            marker = markers.shift();
            if(marker && marker instanceof Y.Shape)
            {
                marker.destroy();
            }
        }
        if(this._path)
        {
            this._path.destroy();
            this._path = null;
        }
        if(this._lineGraphic)
        {
            this._lineGraphic.destroy();
            this._lineGraphic = null;
        }
        if(this._groupMarker)
        {
            this._groupMarker.destroy();
            this._groupMarker = null;
        }
    }
        /**
         * Event handle for the x-axis' dataReady event.
         * 
         * @property _xDataReadyHandle
         * @type {EventHandle}
         * @private
         */
        
        /**
         * Event handle for the x-axis dataUpdate event.
         *
         * @property _xDataUpdateHandle
         * @type {EventHandle}
         * @private
         */
        
        /**
         * Event handle for the y-axis dataReady event.
         *
         * @property _yDataReadyHandle
         * @type {EventHandle}
         * @private
         */

        /**
         * Event handle for the y-axis dataUpdate event.
         * @property _yDataUpdateHandle
         * @type {EventHandle}
         * @private
         */

        /**
         * Event handle for the xAxisChange event.
         * @property _xAxisChangeHandle
         * @type {EventHandle}
         * @private
         */

        /**
         * Event handle for the yAxisChange event.
         * @property _yAxisChangeHandle
         * @type {EventHandle}
         * @private
         */

        /**
         * Event handle for the stylesChange event.
         * @property _stylesChangeHandle
         * @type {EventHandle}
         * @private
         */

        /**
         * Event handle for the widthChange event.
         * @property _widthChangeHandle
         * @type {EventHandle}
         * @private
         */

        /**
         * Event handle for the heightChange event.
         * @property _heightChangeHandle
         * @type {EventHandle}
         * @private
         */

        /**
         * Event handle for the visibleChange event.
         * @property _visibleChangeHandle
         * @type {EventHandle}
         * @private
         */
}, {
    ATTRS: {
        /**
         * Name used for for displaying data related to the x-coordinate.
         *
         * @attribute xDisplayName
         * @type String
         */
        xDisplayName: {
            getter: function()
            {
                return this._xDisplayName || this.get("xKey");
            },

            setter: function(val)
            {
                this._xDisplayName = val.toString();
                return val;
            }
        },

        /**
         * Name used for for displaying data related to the y-coordinate.
         *
         * @attribute yDisplayName
         * @type String
         */
        yDisplayName: {
            getter: function()
            {
                return this._yDisplayName || this.get("yKey");
            },

            setter: function(val)
            {
                this._yDisplayName = val.toString();
                return val;
            }
        },
        
        /**
         * Name used for for displaying category data
         *
         * @attribute categoryDisplayName
         * @type String
         * @readOnly
         */
        categoryDisplayName: {
            lazyAdd: false,

            getter: function()
            {
                return this.get("direction") == "vertical" ? this.get("yDisplayName") : this.get("xDisplayName");
           },

            setter: function(val)
            {
                if(this.get("direction") == "vertical")
                {
                    this._yDisplayName = val;
                }
                else
                {
                    this._xDisplayName = val;
                }
                return val;
            }
        },

        /**
         * Name used for for displaying value data
         *
         * @attribute valueDisplayName
         * @type String
         * @readOnly
         */
        valueDisplayName: {
            lazyAdd: false,

            getter: function()
            {
                return this.get("direction") == "vertical" ? this.get("xDisplayName") : this.get("yDisplayName");
            },

            setter: function(val)
            {
                if(this.get("direction") == "vertical")
                {
                    this._xDisplayName = val;
                }
                else
                {
                    this._yDisplayName = val;
                }
                return val;
            }
        },
        
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default cartesian
         */
        type: {		
            value: "cartesian"
        },

        /**
         * Order of this instance of this `type`.
         *
         * @attribute order
         * @type Number
         */
        order: {},

        /**
         * Order of the instance
         *
         * @attribute graphOrder
         * @type Number
         */
        graphOrder: {},

        /**
         * x coordinates for the series.
         *
         * @attribute xcoords
         * @type Array
         */
        xcoords: {},
        
        /**
         * y coordinates for the series
         *
         * @attribute ycoords
         * @type Array
         */
        ycoords: {},

        /**
         * Reference to the `Chart` application.
         *
         * @attribute chart
         * @type ChartBase
         * @readOnly
         */
        chart: {
            readOnly: true,

            getter: function()
            {
                return this.get("graph").get("chart");
            }
        },
        
        /**
         * Reference to the `Graph` in which the series is drawn into.
         *
         * @attribute graph
         * @type Graph
         */
        graph: {},

        /**
         * Reference to the `Axis` instance used for assigning 
         * x-values to the graph.
         *
         * @attribute xAxis
         * @type Axis
         */
        xAxis: {},
        
        /**
         * Reference to the `Axis` instance used for assigning 
         * y-values to the graph.
         *
         * @attribute yAxis
         * @type Axis
         */
        yAxis: {},
        
        /**
         * Indicates which array to from the hash of value arrays in 
         * the x-axis `Axis` instance.
         *
         * @attribute xKey
         * @type String
         */
        xKey: {
            setter: function(val)
            {
                return val.toString();
            }
        },

        /**
         * Indicates which array to from the hash of value arrays in 
         * the y-axis `Axis` instance.
         *
         * @attribute yKey
         * @type String
         */
        yKey: {
            setter: function(val)
            {
                return val.toString();
            }
        },

        /**
         * Array of x values for the series.
         *
         * @attribute xData
         * @type Array
         */
        xData: {},

        /**
         * Array of y values for the series.
         *
         * @attribute yData
         * @type Array
         */
        yData: {},
       
        /**
         * Indicates whether the Series has been through its initial set up.
         *
         * @attribute rendered
         * @type Boolean
         */
        rendered: {
            value: false
        },

        /*
         * Returns the width of the parent graph
         *
         * @attribute width
         * @type Number
         */
        width: {
            readOnly: true,
            
            getter: function()
            {
                this.get("graph").get("width");
            }
        },

        /**
         * Returns the height of the parent graph
         *
         * @attribute height
         * @type Number
         */
        height: {
            readOnly: true,
            
            getter: function()
            {
                this.get("graph").get("height");
            }
        },

        /**
         * Indicates whether to show the series
         *
         * @attribute visible
         * @type Boolean
         * @default true
         */
        visible: {
            value: true
        },

        /**
         * Collection of area maps along the xAxis. Used to determine mouseover for multiple
         * series.
         *
         * @attribute xMarkerPlane
         * @type Array
         */
        xMarkerPlane: {},
        
        /**
         * Collection of area maps along the yAxis. Used to determine mouseover for multiple
         * series.
         *
         * @attribute yMarkerPlane
         * @type Array
         */
        yMarkerPlane: {},

        /**
         * Distance from a data coordinate to the left/right for setting a hotspot.
         *
         * @attribute xMarkerPlaneOffset
         * @type Number
         */
        xMarkerPlaneOffset: {
            getter: function() {
                var marker = this.get("styles").marker;
                if(marker && marker.width && isFinite(marker.width))
                {
                    return marker.width * 0.5;
                }
                return this._defaultPlaneOffset;
            }
        },

        /**
         * Distance from a data coordinate to the top/bottom for setting a hotspot.
         *
         * @attribute yMarkerPlaneOffset
         * @type Number
         */
        yMarkerPlaneOffset: {
            getter: function() {
                var marker = this.get("styles").marker;
                if(marker && marker.height && isFinite(marker.height))
                {
                    return marker.height * 0.5;
                }
                return this._defaultPlaneOffset;
            }
        },

        /**
         * Direction of the series
         *
         * @attribute direction
         * @type String
         */
        direction: {
            value: "horizontal"
        },

        /**
         * Indicates whether or not markers for a series will be grouped and rendered in a single complex shape instance.
         *
         * @attribute groupMarkers
         * @type Boolean
         */
        groupMarkers: {
            getter: function()
            {
                if(this._groupMarkers === undefined)
                {
                    return this.get("graph").get("groupMarkers");
                }
                else
                {
                    return this._groupMarkers;
                }
            },

            setter: function(val)
            {
                this._groupMarkers = val;
                return val;
            }
        }
    }
});
/**
 * The MarkerSeries class renders quantitative data by plotting relevant data points 
 * on a graph.
 *
 * @module charts
 * @submodule charts-base
 * @class MarkerSeries
 * @extends CartesianSeries
 * @uses Plots
 * @constructor
 */
Y.MarkerSeries = Y.Base.create("markerSeries", Y.CartesianSeries, [Y.Plots], {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.drawPlots();
    },
    
    /**
     * @protected
     *
     * Method used by `styles` setter. Overrides base implementation.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     */
    _setStyles: function(val)
    {
        if(!val.marker)
        {
            val = {marker:val};
        }
        val = this._parseMarkerStyles(val);
        return Y.MarkerSeries.superclass._mergeStyles.apply(this, [val, this._getDefaultStyles()]);
    },
    
    /**
     * @protected
     *
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        var styles = this._mergeStyles({marker:this._getPlotDefaults()}, Y.MarkerSeries.superclass._getDefaultStyles());
        return styles;
    }
},{
    ATTRS : {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default marker
         */
        type: {
            value:"marker"
        }
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from `Renderer`. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the fill. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#6084d0", "#eeb647", "#6c6b5f", "#d6484f", "#ce9ed1", "#ff9f3b", "#93b7ff", "#e0ddd0", "#94ecba", "#309687"]`
         *              </dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker fill. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the border. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>width</dt><dd>indicates the width of the marker. The default value is 10.</dd>
         *      <dt>height</dt><dd>indicates the height of the marker The default value is 10.</dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});

/**
 * The LineSeries class renders quantitative data on a graph by connecting relevant data points.
 *
 * @module charts
 * @submodule charts-base
 * @class LineSeries
 * @extends CartesianSeries
 * @uses Lines
 * @constructor
 */
Y.LineSeries = Y.Base.create("lineSeries", Y.CartesianSeries, [Y.Lines], {
    /**
     * @protected
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.drawLines();
    },

    /**
     * @protected
     *
     * Method used by `styles` setter. Overrides base implementation.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     */
    _setStyles: function(val)
    {
        if(!val.line)
        {
            val = {line:val};
        }
        return Y.LineSeries.superclass._setStyles.apply(this, [val]);
    },

    /**
     * @protected
     *
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        var styles = this._mergeStyles({line:this._getLineDefaults()}, Y.LineSeries.superclass._getDefaultStyles());
        return styles;
    }
},
{
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default line
         */
        type: {
            value:"line"
        }

        /**
         * Style properties used for drawing lines. This attribute is inherited from `Renderer`. Below are the default values:
         *  <dl>
         *      <dt>color</dt><dd>The color of the line. The default value is determined by the order of the series on the graph. The color will be
         *      retrieved from the following array: 
         *      `["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"]`
         *      <dt>weight</dt><dd>Number that indicates the width of the line. The default value is 6.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the line. The default value is 1.</dd>
         *      <dt>lineType</dt><dd>Indicates whether the line is solid or dashed. The default value is solid.</dd> 
         *      <dt>dashLength</dt><dd>When the `lineType` is dashed, indicates the length of the dash. The default value is 10.</dd>
         *      <dt>gapSpace</dt><dd>When the `lineType` is dashed, indicates the distance between dashes. The default value is 10.</dd>
         *      <dt>connectDiscontinuousPoints</dt><dd>Indicates whether or not to connect lines when there is a missing or null value between points. The default value is true.</dd> 
         *      <dt>discontinuousType</dt><dd>Indicates whether the line between discontinuous points is solid or dashed. The default value is solid.</dd>
         *      <dt>discontinuousDashLength</dt><dd>When the `discontinuousType` is dashed, indicates the length of the dash. The default value is 10.</dd>
         *      <dt>discontinuousGapSpace</dt><dd>When the `discontinuousType` is dashed, indicates the distance between dashes. The default value is 10.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});



		

		
/**
 * SplineSeries renders a graph with data points connected by a curve.
 *
 * @module charts
 * @submodule charts-base
 * @class SplineSeries
 * @constructor
 * @extends CartesianSeries
 * @uses CurveUtil
 * @uses Lines
 */
Y.SplineSeries = Y.Base.create("splineSeries",  Y.LineSeries, [Y.CurveUtil, Y.Lines], {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.drawSpline();
    }
}, {
	ATTRS : {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default spline
         */
        type : {
            value:"spline"
        }

        /**
         * Style properties used for drawing lines. This attribute is inherited from `Renderer`. Below are the default values:
         *  <dl>
         *      <dt>color</dt><dd>The color of the line. The default value is determined by the order of the series on the graph. The color will be
         *      retrieved from the following array: 
         *      `["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"]`
         *      <dt>weight</dt><dd>Number that indicates the width of the line. The default value is 6.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the line. The default value is 1.</dd>
         *      <dt>lineType</dt><dd>Indicates whether the line is solid or dashed. The default value is solid.</dd> 
         *      <dt>dashLength</dt><dd>When the `lineType` is dashed, indicates the length of the dash. The default value is 10.</dd>
         *      <dt>gapSpace</dt><dd>When the `lineType` is dashed, indicates the distance between dashes. The default value is 10.</dd>
         *      <dt>connectDiscontinuousPoints</dt><dd>Indicates whether or not to connect lines when there is a missing or null value between points. The default value is true.</dd> 
         *      <dt>discontinuousType</dt><dd>Indicates whether the line between discontinuous points is solid or dashed. The default value is solid.</dd>
         *      <dt>discontinuousDashLength</dt><dd>When the `discontinuousType` is dashed, indicates the length of the dash. The default value is 10.</dd>
         *      <dt>discontinuousGapSpace</dt><dd>When the `discontinuousType` is dashed, indicates the distance between dashes. The default value is 10.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});



		

		
/**
 * StackedSplineSeries creates spline graphs in which the different series are stacked along a value axis
 * to indicate their contribution to a cumulative total.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedSplineSeries
 * @constructor
 * @extends SplineSeries
 * @extends StackingUtil
 */
Y.StackedSplineSeries = Y.Base.create("stackedSplineSeries", Y.SplineSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Calculates the coordinates for the series. Overrides base implementation.
     *
     * @method setAreaData
     */
    setAreaData: function()
    {   
        Y.StackedSplineSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedSpline
         */
        type: {
            value:"stackedSpline"
        }
    }
});

/**
 * StackedMarkerSeries plots markers with different series stacked along the value axis to indicate each
 * series' contribution to a cumulative total.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedMarkerSeries
 * @constructor
 * @extends MarkerSeries
 * @extends StackingUtil
 */
Y.StackedMarkerSeries = Y.Base.create("stackedMarkerSeries", Y.MarkerSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Calculates the coordinates for the series. Overrides base implementation.
     *
     * @method setAreaData
     */
    setAreaData: function()
    {   
        Y.StackedMarkerSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedMarker
         */
        type: {
            value:"stackedMarker"
        }
    }
});

/**
 * The ColumnSeries class renders columns positioned horizontally along a category or time axis. The columns'
 * lengths are proportional to the values they represent along a vertical axis.
 * and the relevant data points.
 *
 * @module charts
 * @submodule charts-base
 * @class ColumnSeries
 * @extends MarkerSeries
 * @uses Histogram
 * @constructor
 */
Y.ColumnSeries = Y.Base.create("columnSeries", Y.MarkerSeries, [Y.Histogram], {
    /**
     * Helper method for calculating the size of markers. 
     *
     * @method _getMarkerDimensions
     * @param {Number} xcoord The x-coordinate representing the data point for the marker.
     * @param {Number} ycoord The y-coordinate representing the data point for the marker.
     * @param {Number} calculatedSize The calculated size for the marker. For a `BarSeries` is it the width. For a `ColumnSeries` it is the height.
     * @param {Number} offset Distance of position offset dictated by other marker series in the same graph.
     * @return Object
     * @private
     */
    _getMarkerDimensions: function(xcoord, ycoord, calculatedSize, offset)
    {
        var config = {
            left: xcoord + offset
        };
        if(this._bottomOrigin >= ycoord)
        {
            config.top = ycoord;
            config.calculatedSize = this._bottomOrigin - config.top;
        }
        else
        {
            config.top = this._bottomOrigin;
            config.calculatedSize = ycoord - this._bottomOrigin;
        }
        return config;
    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers && this._markers[i])
        {
            var styles = Y.clone(this.get("styles").marker),
                markerStyles,
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                markers,
                graph = this.get("graph"),
                seriesStyles,
                seriesCollection = graph.seriesTypes[this.get("type")],
                seriesLen = seriesCollection.length,
                seriesSize = 0,
                offset = 0,
                renderer,
                n = 0,
                xs = [],
                order = this.get("order"),
                config;
            markerStyles = state == "off" || !styles[state] ? Y.clone(styles) : Y.clone(styles[state]); 
            markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            config = this._getMarkerDimensions(xcoords[i], ycoords[i], styles.width, offset);
            markerStyles.height = config.calculatedSize;
            markerStyles.width = Math.min(this._maxSize, markerStyles.width);
            marker.set(markerStyles);
            for(; n < seriesLen; ++n)
            {
                xs[n] = xcoords[i] + seriesSize;
                seriesStyles = seriesCollection[n].get("styles").marker;
                seriesSize += Math.min(this._maxSize, seriesStyles.width);
                if(order > n)
                {
                    offset = seriesSize;
                }
                offset -= seriesSize/2;
            }
            for(n = 0; n < seriesLen; ++n)
            {
                markers = seriesCollection[n].get("markers");
                if(markers)
                {
                    renderer = markers[i];
                    if(renderer && renderer !== undefined)
                    {
                        renderer.set("x", (xs[n] - seriesSize/2));
                    }
                }
            }
        }
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @readOnly
         * @default column
         */
        type: {
            value: "column"
        }
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from `MarkerSeries`. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the fill. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *              </dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker fill. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the border. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>width</dt><dd>indicates the width of the marker. The default value is 12.</dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
/**
 * The BarSeries class renders bars positioned vertically along a category or time axis. The bars'
 * lengths are proportional to the values they represent along a horizontal axis.
 * and the relevant data points.
 *
 * @module charts
 * @submodule charts-base
 * @class BarSeries
 * @extends MarkerSeries
 * @uses Histogram
 * @constructor
 */
Y.BarSeries = Y.Base.create("barSeries", Y.MarkerSeries, [Y.Histogram], {
    /**
     * Helper method for calculating the size of markers. 
     *
     * @method _getMarkerDimensions
     * @param {Number} xcoord The x-coordinate representing the data point for the marker.
     * @param {Number} ycoord The y-coordinate representing the data point for the marker.
     * @param {Number} calculatedSize The calculated size for the marker. For a `BarSeries` is it the width. For a `ColumnSeries` it is the height.
     * @param {Number} offset Distance of position offset dictated by other marker series in the same graph.
     * @return Object
     * @private
     */
    _getMarkerDimensions: function(xcoord, ycoord, calculatedSize, offset)
    {
        var config = {
            top: ycoord + offset
        };
        if(xcoord >= this._leftOrigin)
        {
            config.left = this._leftOrigin;
            config.calculatedSize = xcoord - config.left;
        }
        else
        {
            config.left = xcoord;
            config.calculatedSize = this._leftOrigin - xcoord;
        }
        return config;
    },
    
    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers && this._markers[i])
        {
            var styles = Y.clone(this.get("styles").marker),
                markerStyles,
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                markers,
                graph = this.get("graph"),
                seriesCollection = graph.seriesTypes[this.get("type")],
                seriesLen = seriesCollection.length,
                seriesStyles,
                seriesSize = 0,
                offset = 0,
                renderer,
                n = 0,
                ys = [],
                order = this.get("order"),
                config;
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            config = this._getMarkerDimensions(xcoords[i], ycoords[i], styles.height, offset);
            markerStyles.width = config.calculatedSize;
            markerStyles.height = Math.min(this._maxSize, markerStyles.height);
            marker.set(markerStyles);
            for(; n < seriesLen; ++n)
            {
                ys[n] = ycoords[i] + seriesSize;
                seriesStyles = seriesCollection[n].get("styles").marker;
                seriesSize += Math.min(this._maxSize, seriesStyles.height); 
                if(order > n)
                {
                    offset = seriesSize;
                }
                offset -= seriesSize/2;
            }
            for(n = 0; n < seriesLen; ++n)
            {
                markers = seriesCollection[n].get("markers");
                if(markers)
                {
                    renderer = markers[i];
                    if(renderer && renderer !== undefined)
                    {
                        renderer.set("y", (ys[n] - seriesSize/2));
                    }
                }
            }
        }
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default bar
         */
        type: {
            value: "bar"
        },

        /**
         * Indicates the direction of the category axis that the bars are plotted against.
         *
         * @attribute direction
         * @type String
         */
        direction: {
            value: "vertical"
        }
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from `MarkerSeries`. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the fill. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *              </dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker fill. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the border. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>height</dt><dd>indicates the width of the marker. The default value is 12.</dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
/**
 * The AreaSeries class renders quantitative data on a graph by creating a fill between 0
 * and the relevant data points.
 *
 * @module charts
 * @submodule charts-base
 * @class AreaSeries
 * @extends CartesianSeries
 * @uses Fills
 * @constructor
 */
Y.AreaSeries = Y.Base.create("areaSeries", Y.CartesianSeries, [Y.Fills], {
    /**
     * @protected
     *
     * Renders the series. 
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.drawFill.apply(this, this._getClosingPoints());
    },
    
    /**
     * @protected
     *
     * Method used by `styles` setter. Overrides base implementation.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     */
    _setStyles: function(val)
    {
        if(!val.area)
        {
            val = {area:val};
        }
        return Y.AreaSeries.superclass._setStyles.apply(this, [val]);
    },

    /**
     * @protected
     *
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        var styles = this._mergeStyles({area:this._getAreaDefaults()}, Y.AreaSeries.superclass._getDefaultStyles());
        return styles;
    }
},
{
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default area
         */
        type: {
            value:"area"
        }
        
        /**
         * Style properties used for drawing area fills. This attribute is inherited from `Renderer`. Below are the default values:
         *
         *  <dl>
         *      <dt>color</dt><dd>The color of the fill. The default value is determined by the order of the series on the graph. The color will be 
         *      retrieved from the following array:
         *      `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *      </dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});



		

		
/**
 * AreaSplineSeries renders an area graph with data points connected by a curve.
 *
 * @module charts
 * @submodule charts-base
 * @class AreaSplineSeries
 * @constructor
 * @extends CartesianSeries
 * @uses Fills
 * @uses CurveUtil
 */
Y.AreaSplineSeries = Y.Base.create("areaSplineSeries", Y.AreaSeries, [Y.CurveUtil], {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.drawAreaSpline();
    }
}, {
	ATTRS : {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default areaSpline
         */
        type: {
            value:"areaSpline"
        }
        
        /**
         * Style properties used for drawing area fills. This attribute is inherited from `Renderer`. Below are the default values:
         *
         *  <dl>
         *      <dt>color</dt><dd>The color of the fill. The default value is determined by the order of the series on the graph. The color will be 
         *      retrieved from the following array:
         *      `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *      </dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});

/**
 * StackedAreaSplineSeries creates a stacked area chart with points data points connected by a curve.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedAreaSplineSeries
 * @constructor
 * @extends AreaSeries
 * @uses CurveUtil
 * @uses StackingUtil
 */
Y.StackedAreaSplineSeries = Y.Base.create("stackedAreaSplineSeries", Y.AreaSeries, [Y.CurveUtil, Y.StackingUtil], {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this._stackCoordinates();
        this.drawStackedAreaSpline();
    }
}, {
    ATTRS : {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedAreaSpline
         */
        type: {
            value:"stackedAreaSpline"
        }
    }
});

/**
 * The ComboSeries class renders a combination of lines, plots and area fills in a single series. Each
 * series type has a corresponding boolean attribute indicating if it is rendered. By default, lines and plots 
 * are rendered and area is not. 
 *
 * @module charts
 * @submodule charts-base
 * @class ComboSeries
 * @extends CartesianSeries 
 * @uses Fills
 * @uses Lines
 * @uses Plots
 * @constructor
 */
Y.ComboSeries = Y.Base.create("comboSeries", Y.CartesianSeries, [Y.Fills, Y.Lines, Y.Plots], {
	/**
     * @protected
     * 
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        if(this.get("showAreaFill"))
        {
            this.drawFill.apply(this, this._getClosingPoints());
        }
        if(this.get("showLines")) 
        {
            this.drawLines();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    },
    
    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} visible indicates visibilitye
     * @private
     */
    _toggleVisible: function(visible)
    {
        var markers,
            marker,
            len,
            i;
        if(this.get("showAreaFill") && this._path)
        {
            this._path.set("visible", visible);
        }
        if(this.get("showLines") && this._lineGraphic)
        {
            this._lineGraphic.set("visible", visible);
        }
        if(this.get("showMarkers"))
        {
            markers = this.get("markers");
            if(markers)
            {
                i = 0;
                len = markers.length;
                for(; i < len; ++i)
                {
                    marker = markers[i];
                    if(marker)
                    {
                        marker.set("visible", visible);
                    }
                }
            }
        }
    },

    /**
     * @protected
     *
     * Returns the default hash for the `styles` attribute.
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        var styles = Y.ComboSeries.superclass._getDefaultStyles();
        styles.line = this._getLineDefaults();
        styles.marker = this._getPlotDefaults();
        styles.area = this._getAreaDefaults();
        return styles;
    }
},
{
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default combo
         */
        type: {
            value:"combo"
        },

        /**
         * Indicates whether a fill is displayed.
         *
         * @attribute showAreaFill
         * @type Boolean
         * @default false
         */
        showAreaFill: {
            value: false
        },

        /**
         * Indicates whether lines are displayed.
         *
         * @attribute showLines
         * @type Boolean
         * @default true
         */
        showLines: {
            value: true
        },

        /**
         * Indicates whether markers are displayed.
         *
         * @attribute showMarkers
         * @type Boolean
         * @default true
         */
        showMarkers: {
            value: true
        },

        /**
         * Reference to the styles of the markers. These styles can also
         * be accessed through the `styles` attribute. Below are default
         * values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the fill. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#6084d0", "#eeb647", "#6c6b5f", "#d6484f", "#ce9ed1", "#ff9f3b", "#93b7ff", "#e0ddd0", "#94ecba", "#309687"]`
         *              </dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker fill. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the border. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>width</dt><dd>indicates the width of the marker. The default value is 10.</dd>
         *      <dt>height</dt><dd>indicates the height of the marker The default value is 10.</dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute marker
         * @type Object
         */
        marker: {
            lazyAdd: false,
            getter: function()
            {
                return this.get("styles").marker;
            },
            setter: function(val)
            {
                this.set("styles", {marker:val});
            }
        },
        
        /**
         * Reference to the styles of the lines. These styles can also be accessed through the `styles` attribute.
         * Below are the default values:
         *  <dl>
         *      <dt>color</dt><dd>The color of the line. The default value is determined by the order of the series on the graph. The color will be
         *      retrieved from the following array: 
         *      `["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"]`
         *      <dt>weight</dt><dd>Number that indicates the width of the line. The default value is 6.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the line. The default value is 1.</dd>
         *      <dt>lineType</dt><dd>Indicates whether the line is solid or dashed. The default value is solid.</dd> 
         *      <dt>dashLength</dt><dd>When the `lineType` is dashed, indicates the length of the dash. The default value is 10.</dd>
         *      <dt>gapSpace</dt><dd>When the `lineType` is dashed, indicates the distance between dashes. The default value is 10.</dd>
         *      <dt>connectDiscontinuousPoints</dt><dd>Indicates whether or not to connect lines when there is a missing or null value between points. The default value is true.</dd> 
         *      <dt>discontinuousType</dt><dd>Indicates whether the line between discontinuous points is solid or dashed. The default value is solid.</dd>
         *      <dt>discontinuousDashLength</dt><dd>When the `discontinuousType` is dashed, indicates the length of the dash. The default value is 10.</dd>
         *      <dt>discontinuousGapSpace</dt><dd>When the `discontinuousType` is dashed, indicates the distance between dashes. The default value is 10.</dd>
         *  </dl>
         *
         * @attribute line
         * @type Object
         */
        line: {
            lazyAdd: false,
            getter: function()
            {
                return this.get("styles").line;
            },
            setter: function(val)
            {
                this.set("styles", {line:val});
            }
        },
        
        /**
         * Reference to the styles of the area fills. These styles can also be accessed through the `styles` attribute.
         * Below are the default values:
         *
         *  <dl>
         *      <dt>color</dt><dd>The color of the fill. The default value is determined by the order of the series on the graph. The color will be 
         *      retrieved from the following array:
         *      `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *      </dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1</dd>
         *  </dl>
         *
         * @attribute area
         * @type Object
         */
        area: {
            lazyAdd: false,
            getter: function()
            {
                return this.get("styles").area;
            },
            setter: function(val)
            {
                this.set("styles", {area:val});
            }
        }

        /**
         * Style properties for the series. Contains a key indexed hash of the following:
         *  <dl>
         *      <dt>marker</dt><dd>Style properties for the markers in the series. Specific style attributes are listed
         *      <a href="#attr_marker">here</a>.</dd>
         *      <dt>line</dt><dd>Style properties for the lines in the series. Specific
         *      style attributes are listed <a href="#attr_line">here</a>.</dd>
         *      <dt>area</dt><dd>Style properties for the area fills in the series. Specific style attributes are listed
         *      <a href="#attr_area">here</a>.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});



		

		
/**
 * The StackedComboSeries class renders a combination of lines, plots and area fills in a single series. Series
 * are stacked along the value axis to indicate each series contribution to a cumulative total. Each
 * series type has a corresponding boolean attribute indicating if it is rendered. By default, all three types are
 * rendered.  
 *
 * @module charts
 * @submodule charts-base
 * @class StackedComboSeries
 * @extends ComboSeries
 * @uses StackingUtil
 * @constructor
 */
Y.StackedComboSeries = Y.Base.create("stackedComboSeries", Y.ComboSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Calculates the coordinates for the series. Overrides base implementation.
     *
     * @method setAreaData
     */
    setAreaData: function()
    {   
        Y.StackedComboSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    },
	
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        if(this.get("showAreaFill"))
        {
            this.drawFill.apply(this, this._getStackedClosingPoints());
        }
        if(this.get("showLines")) 
        {
            this.drawLines();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
    
}, {
    ATTRS : {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedCombo
         */
        type: {
            value: "stackedCombo"
        },

        /**
         * Indicates whether a fill is displayed.
         *
         * @attribute showAreaFill
         * @type Boolean
         * @default true
         */
        showAreaFill: {
            value: true
        }
    }
});
/**
 * The ComboSplineSeries class renders a combination of splines, plots and areaspline fills in a single series. Each
 * series type has a corresponding boolean attribute indicating if it is rendered. By default, splines and plots 
 * are rendered and areaspline is not. 
 *
 * @module charts
 * @submodule charts-base
 * @class ComboSplineSeries
 * @extends ComboSeries
 * @extends CurveUtil
 * @constructor
 */
Y.ComboSplineSeries = Y.Base.create("comboSplineSeries", Y.ComboSeries, [Y.CurveUtil], {
    /**
     * @protected
     * 
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        if(this.get("showAreaFill"))
        {
            this.drawAreaSpline();
        }
        if(this.get("showLines")) 
        {
            this.drawSpline();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default comboSpline
         */
        type: {
            value : "comboSpline"
        }
    }
});
/**
 * The StackedComboSplineSeries class renders a combination of splines, plots and areaspline fills in a single series. Series
 * are stacked along the value axis to indicate each series contribution to a cumulative total. Each
 * series type has a corresponding boolean attribute indicating if it is rendered. By default, all three types are
 * rendered.  
 *
 * @module charts
 * @submodule charts-base
 * @class StackedComboSplineSeries
 * @extends StackedComboSeries
 * @uses CurveUtil
 * @constructor
 */
Y.StackedComboSplineSeries = Y.Base.create("stackedComboSplineSeries", Y.StackedComboSeries, [Y.CurveUtil], {
    /**
	 * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
	 */
	drawSeries: function()
    {
        if(this.get("showAreaFill"))
        {
            this.drawStackedAreaSpline();
        }
        if(this.get("showLines")) 
        {
            this.drawSpline();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedComboSpline
         */
        type : {
            value : "stackedComboSpline"
        },

        /**
         * Indicates whether a fill is displayed.
         *
         * @attribute showAreaFill
         * @type Boolean
         * @default true
         */
        showAreaFill: {
            value: true
        }
    }
});
/**
 * StackedLineSeries creates line graphs in which the different series are stacked along a value axis
 * to indicate their contribution to a cumulative total.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedLineSeries
 * @constructor
 * @extends  LineSeries
 * @uses StackingUtil
 */
Y.StackedLineSeries = Y.Base.create("stackedLineSeries", Y.LineSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Calculates the coordinates for the series. Overrides base implementation.
     *
     * @method setAreaData
     */
    setAreaData: function()
    {   
        Y.StackedLineSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedLine
         */
        type: {
            value:"stackedLine"
        }
    }
});
/**
 * StackedAreaSeries area fills to display data showing its contribution to a whole.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedAreaSeries
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @extends AreaSeries
 * @uses StackingUtil
 */
Y.StackedAreaSeries = Y.Base.create("stackedAreaSeries", Y.AreaSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Calculates the coordinates for the series. Overrides base implementation.
     *
     * @method setAreaData
     */
    setAreaData: function()
    {   
        Y.StackedAreaSeries.superclass.setAreaData.apply(this);
        this._stackCoordinates.apply(this);
    },

    /**
     * @protected
     *
     * Draws the series
     *
     * @method drawSeries
     */
	drawSeries: function()
    {
        this.drawFill.apply(this, this._getStackedClosingPoints());
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedArea
         */
        type: {
            value:"stackedArea"
        }
    }
});
/**
 * The StackedColumnSeries renders column chart in which series are stacked vertically to show
 * their contribution to the cumulative total.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedColumnSeries
 * @extends ColumnSeries
 * @uses StackingUtil
 * @constructor
 */
Y.StackedColumnSeries = Y.Base.create("stackedColumnSeries", Y.ColumnSeries, [Y.StackingUtil], {
    /**
     * Draws the series.
     *
     * @method drawSeries
	 * @protected
	 */
	drawSeries: function()
	{
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var isNumber = Y_Lang.isNumber,
            style = Y.clone(this.get("styles").marker), 
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            ratio,
            order = this.get("order"),
            graphOrder = this.get("graphOrder"),
            left,
            marker,
            fillColors,
            borderColors,
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            useOrigin = order === 0,
            totalWidth = len * w,
            dimensions = {
                width: [],
                height: []
            },
            xvalues = [],
            yvalues = [],
            groupMarkers = this.get("groupMarkers");
        if(Y_Lang.isArray(style.fill.color))
        {
            fillColors = style.fill.color.concat(); 
        }
        if(Y_Lang.isArray(style.border.color))
        {
            borderColors = style.border.color.concat();
        }
        this._createMarkerCache();
        if(totalWidth > this.get("width"))
        {
            ratio = this.width/totalWidth;
            w *= ratio;
            w = Math.max(w, 1);
        }
        if(!useOrigin)
        {
            lastCollection = seriesCollection[order - 1];
            negativeBaseValues = lastCollection.get("negativeBaseValues");
            positiveBaseValues = lastCollection.get("positiveBaseValues");
            if(!negativeBaseValues || !positiveBaseValues)
            {
                useOrigin = true;
                positiveBaseValues = [];
                negativeBaseValues = [];
            }
        }
        else
        {
            negativeBaseValues = [];
            positiveBaseValues = [];
        }
        this.set("negativeBaseValues", negativeBaseValues);
        this.set("positiveBaseValues", positiveBaseValues);
        for(i = 0; i < len; ++i)
        {
            left = xcoords[i];
            top = ycoords[i];
            
            if(!isNumber(top) || !isNumber(left))
            {
                if(useOrigin)
                {
                    negativeBaseValues[i] = this._bottomOrigin;
                    positiveBaseValues[i] = this._bottomOrigin;
                }
                this._markers.push(null); 
                continue;
            }
            if(useOrigin)
            {
                h = Math.abs(this._bottomOrigin - top);
                if(top < this._bottomOrigin)
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = this._bottomOrigin;
                }
                else if(top > this._bottomOrigin)
                {
                    positiveBaseValues[i] = this._bottomOrigin;
                    negativeBaseValues[i] = top;
                    top -= h;
                }
                else
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = top;
                }
            }
            else 
            {
                if(top > this._bottomOrigin)
                {
                    top += (negativeBaseValues[i] - this._bottomOrigin);
                    h = top - negativeBaseValues[i];
                    negativeBaseValues[i] = top;
                    top -= h;
                }
                else if(top <= this._bottomOrigin)
                {
                    top = positiveBaseValues[i] - (this._bottomOrigin - top);
                    h = positiveBaseValues[i] - top;
                    positiveBaseValues[i] = top;
                }
            }
            if(!isNaN(h) && h > 0)
            {
                left -= w/2;
                if(groupMarkers)
                {
                    dimensions.width[i] = w;
                    dimensions.height[i] = h;
                    xvalues.push(left);
                    yvalues.push(top);
                }
                else
                {
                    style.width = w;
                    style.height = h;
                    style.x = left;
                    style.y = top;
                    if(fillColors)
                    {
                        style.fill.color = fillColors[i % fillColors.length];
                    }
                    if(borderColors)
                    {
                        style.border.color = borderColors[i % borderColors.length];
                    }
                    marker = this.getMarker(style, graphOrder, i);
                }
            }
            else if(!groupMarkers)
            {
               this._markers.push(null);
            }
        }
        if(groupMarkers)
        {
            this._createGroupMarker({
                fill: style.fill,
                border: style.border,
                dimensions: dimensions,
                xvalues: xvalues,
                yvalues: yvalues,
                shape: style.shape
            });
        }
        else
        {
            this._clearMarkerCache();
        }
    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers && this._markers[i])
        {
            var styles,
                markerStyles,
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                marker = this._markers[i],
                offset = 0,
                fillColor,
                borderColor;        
            styles = this.get("styles").marker;
            offset = styles.width * 0.5;
            markerStyles = state == "off" || !styles[state] ? Y.clone(styles) : Y.clone(styles[state]); 
            markerStyles.height = marker.get("height");
            markerStyles.x = (xcoords[i] - offset);
            markerStyles.y = marker.get("y");
            markerStyles.id = marker.get("id");
            fillColor = markerStyles.fill.color; 
            borderColor = markerStyles.border.color;
            if(Y_Lang.isArray(fillColor))
            {
                markerStyles.fill.color = fillColor[i % fillColor.length];
            }
            else
            {
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            }
            if(Y_Lang.isArray(borderColor))
            {
                markerStyles.border.color = borderColor[i % borderColor.length];
            }
            else
            {
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            }
            marker.set(markerStyles);
        }
    },
	
    /**
     * Gets the default values for the markers. 
     *
     * @method _getPlotDefaults
     * @return Object
     * @protected
     */
    _getPlotDefaults: function()
    {
        var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 0,
                alpha: 1
            },
            width: 24,
            height: 24,
            shape: "rect",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedColumn
         */
        type: {
            value: "stackedColumn"
        },

        /**
         * @attribute negativeBaseValues
         * @type Array
         * @default null
         * @private
         */
        negativeBaseValues: {
            value: null
        },

        /**
         * @attribute positiveBaseValues
         * @type Array
         * @default null
         * @private
         */
        positiveBaseValues: {
            value: null
        }
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from `ColumnSeries`. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the fill. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *              </dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker fill. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the border. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>width</dt><dd>indicates the width of the marker. The default value is 24.</dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});

/**
 * The StackedBarSeries renders bar chart in which series are stacked horizontally to show
 * their contribution to the cumulative total.
 *
 * @module charts
 * @submodule charts-base
 * @class StackedBarSeries
 * @extends BarSeries
 * @uses StackingUtil
 * @constructor
 */
Y.StackedBarSeries = Y.Base.create("stackedBarSeries", Y.BarSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
	{
        if(this.get("xcoords").length < 1) 
        {
            return;
        }

        var isNumber = Y_Lang.isNumber,
            style = Y.clone(this.get("styles").marker),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            ratio,
            order = this.get("order"),
            graphOrder = this.get("graphOrder"),
            left,
            marker,
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            fillColors,
            borderColors,
            useOrigin = order === 0,
            totalHeight = len * h,
            dimensions = {
                width: [],
                height: []
            },
            xvalues = [],
            yvalues = [],
            groupMarkers = this.get("groupMarkers");
        if(Y_Lang.isArray(style.fill.color))
        {
            fillColors = style.fill.color.concat(); 
        }
        if(Y_Lang.isArray(style.border.color))
        {
            borderColors = style.border.color.concat();
        }
        this._createMarkerCache();
        if(totalHeight > this.get("height"))
        {
            ratio = this.height/totalHeight;
            h *= ratio;
            h = Math.max(h, 1);
        }
        if(!useOrigin)
        {
            lastCollection = seriesCollection[order - 1];
            negativeBaseValues = lastCollection.get("negativeBaseValues");
            positiveBaseValues = lastCollection.get("positiveBaseValues");
            if(!negativeBaseValues || !positiveBaseValues)
            {
                useOrigin = true;
                positiveBaseValues = [];
                negativeBaseValues = [];
            }
        }
        else
        {
            negativeBaseValues = [];
            positiveBaseValues = [];
        }
        this.set("negativeBaseValues", negativeBaseValues);
        this.set("positiveBaseValues", positiveBaseValues);
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            if(!isNumber(top) || !isNumber(left))
            {
                if(useOrigin)
                {
                    positiveBaseValues[i] = this._leftOrigin;
                    negativeBaseValues[i] = this._leftOrigin;
                }
                this._markers.push(null);
                continue;
            }
            if(useOrigin)
            {
                w = Math.abs(left - this._leftOrigin);
                if(left > this._leftOrigin)
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                    left -= w;
                }
                else if(left < this._leftOrigin)
                {   
                    positiveBaseValues[i] = this._leftOrigin;
                    negativeBaseValues[i] = left;
                }
                else
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                }
            }
            else
            {
                if(left < this._leftOrigin)
                {
                    left = negativeBaseValues[i] - (this._leftOrigin - xcoords[i]);
                    w = negativeBaseValues[i] - left;
                    negativeBaseValues[i] = left;
                }
                else if(left >= this._leftOrigin)
                {
                    left += (positiveBaseValues[i] - this._leftOrigin);
                    w = left - positiveBaseValues[i];
                    positiveBaseValues[i] = left;
                    left -= w;
                }
            }
            if(!isNaN(w) && w > 0)
            {
                top -= h/2;
                if(groupMarkers)
                {
                    dimensions.width[i] = w;
                    dimensions.height[i] = h;
                    xvalues.push(left);
                    yvalues.push(top);
                }
                else
                {
                    style.width = w;
                    style.height = h;
                    style.x = left;
                    style.y = top;
                    if(fillColors)
                    {
                        style.fill.color = fillColors[i % fillColors.length];
                    }
                    if(borderColors)
                    {
                        style.border.color = borderColors[i % borderColors.length];
                    }
                    marker = this.getMarker(style, graphOrder, i);
                }
            }
            else if(!groupMarkers)
            {
                this._markers.push(null);
            }
        }
        if(groupMarkers)
        {
            this._createGroupMarker({
                fill: style.fill,
                border: style.border,
                dimensions: dimensions,
                xvalues: xvalues,
                yvalues: yvalues,
                shape: style.shape
            });
        }
        else
        {
            this._clearMarkerCache();
        }
    },

    /**
     * @protected
     *
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers[i])
        {
            var state = this._getState(type),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                styles = this.get("styles").marker,
                h = styles.height,
                markerStyles = state == "off" || !styles[state] ? Y.clone(styles) : Y.clone(styles[state]), 
                fillColor,
                borderColor;        
            markerStyles.y = (ycoords[i] - h/2);
            markerStyles.x = marker.get("x");
            markerStyles.width = marker.get("width");
            markerStyles.id = marker.get("id");
            fillColor = markerStyles.fill.color; 
            borderColor = markerStyles.border.color;
            if(Y_Lang.isArray(fillColor))
            {
                markerStyles.fill.color = fillColor[i % fillColor.length];
            }
            else
            {
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            }
            if(Y_Lang.isArray(borderColor))
            {
                markerStyles.border.color = borderColor[i % borderColor.length];
            }
            else
            {
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            }
            marker.set(markerStyles);
        }
    },
	
    /**
     * @protected
     *
     * Returns default values for the `styles` attribute.
     * 
     * @method _getPlotDefaults
     * @return Object
     */
    _getPlotDefaults: function()
    {
        var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 0,
                alpha: 1
            },
            width: 24,
            height: 24,
            shape: "rect",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedBar
         */
        type: {
            value: "stackedBar"
        },

        /**
         * Direction of the series
         *
         * @attribute direction
         * @type String
         * @default vertical
         */
        direction: {
            value: "vertical"
        },

        /**
         * @private
         *
         * @attribute negativeBaseValues
         * @type Array
         * @default null
         */
        negativeBaseValues: {
            value: null
        },

        /**
         * @private
         *
         * @attribute positiveBaseValues
         * @type Array
         * @default null
         */
        positiveBaseValues: {
            value: null
        }
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from `BarSeries`. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the fill. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *              </dd>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker fill. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>Color of the border. The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>height</dt><dd>indicates the width of the marker. The default value is 24.</dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});

/**
 * PieSeries visualizes data as a circular chart divided into wedges which represent data as a 
 * percentage of a whole.
 *
 * @module charts
 * @submodule charts-base
 * @class PieSeries
 * @constructor
 * @extends MarkerSeries
 */
Y.PieSeries = Y.Base.create("pieSeries", Y.MarkerSeries, [], { 
    /**
     * Image map used for interactivity when rendered with canvas.
     *
     * @property _map
     * @type HTMLElement
     * @private
     */
    _map: null,

    /**
     * Image used for image map when rendered with canvas.
     *
     * @property _image
     * @type HTMLElement
     * @private
     */
    _image: null,

    /**
     * Creates or updates the image map when rendered with canvas.
     *
     * @method _setMap
     * @private
     */
    _setMap: function()
    {
        var id = "pieHotSpotMapi_" + Math.round(100000 * Math.random()),
            cb = this.get("graph").get("contentBox"),
            areaNode;
        if(this._image)
        {
            cb.removeChild(this._image);
            while(this._areaNodes && this._areaNodes.length > 0)
            {
                areaNode = this._areaNodes.shift();
                this._map.removeChild(areaNode);
            }
            cb.removeChild(this._map);
        }
        this._image = DOCUMENT.createElement("img"); 
        this._image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAABCAYAAAD9yd/wAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJJREFUeNpiZGBgSGPAAgACDAAIkABoFyloZQAAAABJRU5ErkJggg==";
        cb.appendChild(this._image);
        this._image.setAttribute("usemap", "#" + id);
        this._image.style.zIndex = 3;
        this._image.style.opacity = 0;
        this._image.setAttribute("alt", "imagemap");
        this._map = DOCUMENT.createElement("map");
        this._map.style.zIndex = 5;
        cb.appendChild(this._map);
        this._map.setAttribute("name", id);
        this._map.setAttribute("id", id);
        this._areaNodes = [];
    },

    /**
     * Storage for `categoryDisplayName` attribute.
     *
     * @property _categoryDisplayName
     * @private
     */
    _categoryDisplayName: null,
    
    /**
     * Storage for `valueDisplayName` attribute.
     *
     * @property _valueDisplayName
     * @private
     */
    _valueDisplayName: null,

    /**
     * Adds event listeners.
     *
     * @method addListeners
     * @private
     */
    addListeners: function()
    {
        var categoryAxis = this.get("categoryAxis"),
            valueAxis = this.get("valueAxis");
        if(categoryAxis)
        {
            categoryAxis.after("dataReady", Y.bind(this._categoryDataChangeHandler, this));
            categoryAxis.after("dataUpdate", Y.bind(this._categoryDataChangeHandler, this));
        }
        if(valueAxis)
        {
            valueAxis.after("dataReady", Y.bind(this._valueDataChangeHandler, this));
            valueAxis.after("dataUpdate", Y.bind(this._valueDataChangeHandler, this));
        }
        this.after("categoryAxisChange", this.categoryAxisChangeHandler);
        this.after("valueAxisChange", this.valueAxisChangeHandler);
        this.after("stylesChange", this._updateHandler);
    },
    
    /**
     * Draws the series.
     *
     * @method validate
     * @private
     */
    validate: function()
    {
        this.draw();
        this._renderered = true;
    },

    /**
     * Event handler for the categoryAxisChange event.
     *
     * @method _categoryAxisChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _categoryAxisChangeHandler: function(e)
    {
        var categoryAxis = this.get("categoryAxis");
        categoryAxis.after("dataReady", Y.bind(this._categoryDataChangeHandler, this));
        categoryAxis.after("dataUpdate", Y.bind(this._categoryDataChangeHandler, this));
    },
    
    /**
     * Event handler for the valueAxisChange event.
     *
     * @method _valueAxisChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _valueAxisChangeHandler: function(e)
    {
        var valueAxis = this.get("valueAxis");
        valueAxis.after("dataReady", Y.bind(this._valueDataChangeHandler, this));
        valueAxis.after("dataUpdate", Y.bind(this._valueDataChangeHandler, this));
    },
	
    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "pieseries",
	
    /**
     * Event handler for categoryDataChange event.
     *
     * @method _categoryDataChangeHandler
     * @param {Object} event Event object.
     * @private 
     */
    _categoryDataChangeHandler: function(event)
    {
       if(this._rendered && this.get("categoryKey") && this.get("valueKey"))
        {
            this.draw();
        }
    },

    /**
     * Event handler for valueDataChange event.
     *
     * @method _valueDataChangeHandler
     * @param {Object} event Event object.
     * @private 
     */
    _valueDataChangeHandler: function(event)
    {
        if(this._rendered && this.get("categoryKey") && this.get("valueKey"))
        {
            this.draw();
        }
    },
   
    /**
     * Draws the series. Overrides the base implementation.
     *
     * @method draw
     * @protected
     */
    draw: function()
    {
        var graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height");
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {   
            this._rendered = true;
            if(this._drawing)
            {
                this._callLater = true;
                return;
            }
            this._drawing = true;
            this._callLater = false;
            this.drawSeries();
            this._drawing = false;
            if(this._callLater)
            {
                this.draw();
            }
            else
            {
                this.fire("drawingComplete");
            }
        }
    },

    /**
     * Draws the markers
     *
     * @method drawPlots
     * @protected
     */
    drawPlots: function()
    {
        var values = this.get("valueAxis").getDataByKey(this.get("valueKey")).concat(),
            catValues = this.get("categoryAxis").getDataByKey(this.get("categoryKey")).concat(),
            totalValue = 0,
            itemCount = values.length,
            styles = this.get("styles").marker,
            fillColors = styles.fill.colors,
            fillAlphas = styles.fill.alphas || ["1"],
            borderColors = styles.border.colors,
            borderWeights = [styles.border.weight],
            borderAlphas = [styles.border.alpha],
            tbw = borderWeights.concat(),
            tbc = borderColors.concat(),
            tba = borderAlphas.concat(),
            tfc,
            tfa,
            padding = styles.padding,
            graph = this.get("graph"),
            minDimension = Math.min(graph.get("width"), graph.get("height")),
            w = minDimension - (padding.left + padding.right),
            h = minDimension - (padding.top + padding.bottom),
            startAngle = -90,
            halfWidth = w / 2,
            halfHeight = h / 2,
            radius = Math.min(halfWidth, halfHeight),
            i = 0,
            value,
            angle = 0,
            lc,
            la,
            lw,
            wedgeStyle,
            marker,
            graphOrder = this.get("graphOrder"),
            isCanvas = Y.Graphic.NAME == "canvasGraphic";
        for(; i < itemCount; ++i)
        {
            value = parseFloat(values[i]);
            
            values.push(value);
            if(!isNaN(value))
            {
                totalValue += value;
            }
        }
        
        tfc = fillColors ? fillColors.concat() : null;
        tfa = fillAlphas ? fillAlphas.concat() : null;
        this._createMarkerCache();
        if(isCanvas)
        {
            this._setMap();
            this._image.width = w;
            this._image.height = h;
        }
        for(i = 0; i < itemCount; i++)
        {
            value = values[i];
            if(totalValue === 0)
            {
                angle = 360 / values.length;
            }
            else
            {
                angle = 360 * (value / totalValue);
            }
            if(tfc && tfc.length < 1)
            {
                tfc = fillColors.concat();
            }
            if(tfa && tfa.length < 1)
            {
                tfa = fillAlphas.concat();
            }
            if(tbw && tbw.length < 1)
            {
                tbw = borderWeights.concat();
            }
            if(tbw && tbc.length < 1)
            {
                tbc = borderColors.concat();
            }
            if(tba && tba.length < 1)
            {
                tba = borderAlphas.concat();
            }
            lw = tbw ? tbw.shift() : null;
            lc = tbc ? tbc.shift() : null;
            la = tba ? tba.shift() : null;
            startAngle += angle;
            wedgeStyle = {
                border: {
                    color:lc,
                    weight:lw,
                    alpha:la
                },
                fill: {
                    color:tfc ? tfc.shift() : this._getDefaultColor(i, "slice"),
                    alpha:tfa ? tfa.shift() : null
                },
                type: "pieslice",
                arc: angle,
                radius: radius,
                startAngle: startAngle,
                cx: halfWidth,
                cy: halfHeight,
                width: w,
                height: h
            };
            marker = this.getMarker(wedgeStyle, graphOrder, i);
            if(isCanvas)
            {
                this._addHotspot(wedgeStyle, graphOrder, i);
            }
        }
        this._clearMarkerCache();
    },

    /**
     *  Adds an interactive map when rendering in canvas.
     *
     *  @method _addHotspot
     *  @param {Object} cfg Object containing data used to draw the hotspot
     *  @param {Number} seriesIndex Index of series in the `seriesCollection`.
     *  @param {Number} index Index of the marker using the hotspot.
     *  @private
     */
    _addHotspot: function(cfg, seriesIndex, index)
    {
        var areaNode = DOCUMENT.createElement("area"),
            i = 1,
            x = cfg.cx,
            y = cfg.cy, 
            arc = cfg.arc,
            startAngle = cfg.startAngle - arc, 
            endAngle = cfg.startAngle,
            radius = cfg.radius, 
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius,
            ay = y + Math.sin(startAngle / 180 * Math.PI) * radius,
            bx = x + Math.cos(endAngle / 180 * Math.PI) * radius,
            by = y + Math.sin(endAngle / 180 * Math.PI) * radius,
            numPoints = Math.floor(arc/10) - 1,
            divAngle = (arc/(Math.floor(arc/10)) / 180) * Math.PI,
            angleCoord = Math.atan((ay - y)/(ax - x)),
            pts = x + ", " + y + ", " + ax + ", " + ay,
            cosAng,
            sinAng,
            multDivAng;
        for(i = 1; i <= numPoints; ++i)
        {
            multDivAng = divAngle * i;
            cosAng = Math.cos(angleCoord + multDivAng);
            sinAng = Math.sin(angleCoord + multDivAng);
            if(startAngle <= 90)
            {
                pts += ", " + (x + (radius * Math.cos(angleCoord + (divAngle * i))));
                pts += ", " + (y + (radius * Math.sin(angleCoord + (divAngle * i))));
            }
            else
            {
                pts += ", " + (x - (radius * Math.cos(angleCoord + (divAngle * i))));
                pts += ", " + (y - (radius * Math.sin(angleCoord + (divAngle * i))));
            }
        }
        pts += ", " + bx + ", " + by;
        pts += ", " + x + ", " + y;
        this._map.appendChild(areaNode);
        areaNode.setAttribute("class", SERIES_MARKER);
        areaNode.setAttribute("id", "hotSpot_" + seriesIndex + "_" + index);
        areaNode.setAttribute("shape", "polygon");
        areaNode.setAttribute("coords", pts);
        this._areaNodes.push(areaNode);

    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers[i])
        {
            var state = this._getState(type),
                markerStyles,
                indexStyles,
                marker = this._markers[i],
                styles = this.get("styles").marker; 
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            indexStyles = this._mergeStyles(markerStyles, {});
            indexStyles.fill.color = indexStyles.fill.colors[i % indexStyles.fill.colors.length];
            indexStyles.fill.alpha = indexStyles.fill.alphas[i % indexStyles.fill.alphas.length];
            marker.set(indexStyles);
        }
    },
    
    /**
     * Creates a shape to be used as a marker.
     *
     * @method _createMarker
     * @param {Object} styles Hash of style properties.
     * @param {Number} order Order of the series.
     * @param {Number} index Index within the series associated with the marker.
     * @return Shape
     * @private
     */
    _createMarker: function(styles, order, index)
    {
        var graphic = this.get("graphic"),
            marker,
            cfg = Y.clone(styles);
        graphic.set("autoDraw", false);
        marker = graphic.addShape(cfg); 
        marker.addClass(SERIES_MARKER);
        return marker;
    },
    
    /**
     * Creates a cache of markers for reuse.
     *
     * @method _createMarkerCache
     * @private
     */
    _clearMarkerCache: function()
    {
        var len = this._markerCache.length,
            i = 0,
            marker;
        for(; i < len; ++i)
        {
            marker = this._markerCache[i];
            if(marker)
            {
                marker.destroy();
            }
        }
        this._markerCache = [];
    },

    /**
     * Gets the default style values for the markers.
     *
     * @method _getPlotDefaults
     * @return Object
     * @private
     */
    _getPlotDefaults: function()
    {
         var defs = {
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            fill:{
                alphas:["1"]
            },
            border: {
                weight: 0,
                alpha: 1
            }
        };
        defs.fill.colors = this._defaultSliceColors;
        defs.border.colors = this._defaultBorderColors;
        return defs;
    },

    /**
     * Collection of default colors used for lines in a series when not specified by user.
     *
     * @property _defaultLineColors
     * @type Array
     * @protected
     */
    _defaultLineColors:["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"],

    /**
     * Collection of default colors used for marker fills in a series when not specified by user.
     *
     * @property _defaultFillColors
     * @type Array
     * @protected
     */
    _defaultFillColors:["#6084d0", "#eeb647", "#6c6b5f", "#d6484f", "#ce9ed1", "#ff9f3b", "#93b7ff", "#e0ddd0", "#94ecba", "#309687"],
    
    /**
     * Collection of default colors used for marker borders in a series when not specified by user.
     *
     * @property _defaultBorderColors
     * @type Array
     * @protected
     */
    _defaultBorderColors:["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"],
    
    /**
     * Collection of default colors used for area fills, histogram fills and pie fills in a series when not specified by user.
     *
     * @property _defaultSliceColors
     * @type Array
     * @protected
     */
    _defaultSliceColors: ["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"],

    /**
     * Colors used if style colors are not specified
     *
     * @method _getDefaultColor
     * @param {Number} index Index indicating the series order.
     * @param {String} type Indicates which type of object needs the color.
     * @return String
     * @protected
     */
    _getDefaultColor: function(index, type)
    {
        var colors = {
                line: this._defaultLineColors,
                fill: this._defaultFillColors,
                border: this._defaultBorderColors,
                slice: this._defaultSliceColors
            },
            col = colors[type],
            l = col.length;
        index = index || 0;
        if(index >= l)
        {
            index = index % l;
        }
        type = type || "fill";
        return colors[type][index];
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default pie
         */
        type: {		
            value: "pie"
        },
        
        /**
         * Order of this instance of this `type`.
         *
         * @attribute order
         * @type Number
         */
        order: {},

        /**
         * Reference to the `Graph` in which the series is drawn into.
         *
         * @attribute graph
         * @type Graph
         */
        graph: {},
        
        /**
         * Reference to the `Axis` instance used for assigning 
         * category values to the graph.
         *
         * @attribute categoryAxis
         * @type Axis
         */
        categoryAxis: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("categoryAxis");
            }
        },
        
        /**
         * Reference to the `Axis` instance used for assigning 
         * series values to the graph.
         *
         * @attribute categoryAxis
         * @type Axis
         */
        valueAxis: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("valueAxis");
            }
        },

        /**
         * Indicates which array to from the hash of value arrays in 
         * the category `Axis` instance.
         *
         * @attribute categoryKey
         * @type String
         */
        categoryKey: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("categoryKey");
            }
        },
        /**
         * Indicates which array to from the hash of value arrays in 
         * the value `Axis` instance.
         *
         * @attribute valueKey
         * @type String
         */
        valueKey: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("valueKey");
            }
        },

        /**
         * Name used for for displaying category data
         *
         * @attribute categoryDisplayName
         * @type String
         */
        categoryDisplayName: {
            setter: function(val)
            {
                this._categoryDisplayName = val;
                return val;
            },

            getter: function()
            {
                return this._categoryDisplayName || this.get("categoryKey");
            }
        },

        /**
         * Name used for for displaying value data
         *
         * @attribute valueDisplayName
         * @type String
         */
        valueDisplayName: {
            setter: function(val)
            {
                this._valueDisplayName = val;
                return val;
            },

            getter: function()
            {
                return this._valueDisplayName || this.get("valueKey");
            }
        },
        
        /**
         * @attribute slices
         * @type Array
         * @private
         */
        slices: null
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from `MarkerSeries`. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>colors</dt><dd>An array of colors to be used for the marker fills. The color for each marker is retrieved from the 
         *              array below:<br/>
         *              `["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]`
         *              </dd>
         *              <dt>alphas</dt><dd>An array of alpha references (Number from 0 to 1) indicating the opacity of each marker fill. The default value is [1].</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>An array of colors to be used for the marker borders. The color for each marker is retrieved from the
         *              array below:<br/>
         *              `["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]`
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a `mouseover` event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for `marker.over.fill.color` is equivalent to `marker.fill.color`.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
/**
 * Gridlines draws gridlines on a Graph.
 *
 * @module charts
 * @submodule charts-base
 * @class Gridlines
 * @constructor
 * @extends Base
 * @uses Renderer
 */
Y.Gridlines = Y.Base.create("gridlines", Y.Base, [Y.Renderer], {
    /**
     * Reference to the `Path` element used for drawing Gridlines.
     *
     * @property _path
     * @type Path
     * @private
     */
    _path: null,

    /**
     * Removes the Gridlines.
     *
     * @method remove
     * @private
     */
    remove: function()
    {
        var path = this._path;
        if(path)
        {
            path.destroy();
        }
    },

    /**
     * Draws the gridlines
     *
     * @method draw
     * @protected
     */
    draw: function()
    {
        if(this.get("axis") && this.get("graph"))
        {
            this._drawGridlines();
        }
    },

    /**
     * Algorithm for drawing gridlines
     *
     * @method _drawGridlines
     * @private
     */
    _drawGridlines: function()
    {
        var path,
            axis = this.get("axis"),
            axisPosition = axis.get("position"),
            points,
            i = 0,
            l,
            direction = this.get("direction"),
            graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height"),
            line = this.get("styles").line,
            color = line.color,
            weight = line.weight,
            alpha = line.alpha,
            lineFunction = direction == "vertical" ? this._verticalLine : this._horizontalLine;
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
            if(axisPosition != "none" && axis && axis.get("tickPoints"))
            {
                points = axis.get("tickPoints");
                l = points.length;
            }
            else
            {
                points = [];
                l = axis.get("styles").majorUnit.count;
                for(; i < l; ++i)
                {
                    points[i] = {
                        x: w * (i/(l-1)),
                        y: h * (i/(l-1))
                    };
                }
                i = 0;
            }
            path = graph.get("gridlines");
            path.set("width", w);
            path.set("height", h);
            path.set("stroke", {
                weight: weight,
                color: color,
                opacity: alpha
            });
            for(; i < l; ++i)
            {
                lineFunction(path, points[i], w, h);
            }
            path.end();
        }
    },

    /**
     * Algorithm for horizontal lines.
     *
     * @method _horizontalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @param {Number} h Height of the Graph
     * @private
     */
    _horizontalLine: function(path, pt, w, h)
    {
        path.moveTo(0, pt.y);
        path.lineTo(w, pt.y);
    },

    /**
     * Algorithm for vertical lines.
     *
     * @method _verticalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @param {Number} h Height of the Graph
     * @private
     */
    _verticalLine: function(path, pt, w, h)
    {
        path.moveTo(pt.x, 0);
        path.lineTo(pt.x, h);
    },
    
    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        var defs = {
            line: {
                color:"#f0efe9",
                weight: 1,
                alpha: 1
            }
        };
        return defs;
    }

},
{
    ATTRS: {
        /**
         * Indicates the direction of the gridline.
         *
         * @attribute direction
         * @type String
         */
        direction: {},
        
        /**
         * Indicate the `Axis` in which to bind
         * the gridlines.
         *
         * @attribute axis
         * @type Axis
         */
        axis: {},
        
        /**
         * Indicates the `Graph` in which the gridlines 
         * are drawn.
         *
         * @attribute graph
         * @type Graph
         */
        graph: {}
    }
});
/**
 * Graph manages and contains series instances for a `CartesianChart`
 * instance.
 *
 * @module charts
 * @submodule charts-base
 * @class Graph
 * @constructor
 * @extends Widget
 * @uses Renderer
 */
Y.Graph = Y.Base.create("graph", Y.Widget, [Y.Renderer], {
    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        var bb = this.get("boundingBox");
        bb.setStyle("position", "absolute");
        this.after("widthChange", this._sizeChangeHandler);
        this.after("heightChange", this._sizeChangeHandler);
        this.after("stylesChange", this._updateStyles);
        this.after("groupMarkersChange", this._drawSeries);
    },

    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        var background,
            cb,
            bg,
            sc = this.get("seriesCollection"),
            series,
            i = 0,
            len = sc ? sc.length : 0,
            hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines");
        if(this.get("showBackground"))
        {
            background = this.get("background");
            cb = this.get("contentBox");
            bg = this.get("styles").background;
            bg.stroke = bg.border;
            bg.stroke.opacity = bg.stroke.alpha;
            bg.fill.opacity = bg.fill.alpha;
            bg.width = this.get("width");
            bg.height = this.get("height");
            bg.type = bg.shape;
            background.set(bg);
        }
        for(; i < len; ++i)
        {
            series = sc[i];
            if(series instanceof Y.CartesianSeries)
            {
                series.render();
            }
        }
        if(hgl && hgl instanceof Y.Gridlines)
        {
            hgl.draw();
        }
        if(vgl && vgl instanceof Y.Gridlines)
        {
            vgl.draw();
        }
    },
   
    /**
     * Object of arrays containing series mapped to a series type.
     *
     * @property seriesTypes
     * @type Object
     * @private
     */
    seriesTypes: null,

    /**
     * Returns a series instance based on an index.
     * 
     * @method getSeriesByIndex
     * @param {Number} val index of the series
     * @return CartesianSeries
     */
    getSeriesByIndex: function(val)
    {
        var col = this.get("seriesCollection"),
            series;
        if(col && col.length > val)
        {
            series = col[val];
        }
        return series;
    },

    /**
     * Returns a series instance based on a key value.
     * 
     * @method getSeriesByKey
     * @param {String} val key value of the series
     * @return CartesianSeries
     */
    getSeriesByKey: function(val)
    {
        var obj = this._seriesDictionary,
            series;
        if(obj && obj.hasOwnProperty(val))
        {
            series = obj[val];
        }
        return series;
    },

    /**
     * Adds dispatcher to a `_dispatcher` used to
     * to ensure all series have redrawn before for firing event.
     *
     * @method addDispatcher
     * @param {CartesianSeries} val series instance to add
     * @protected
     */
    addDispatcher: function(val)
    {
        if(!this._dispatchers)
        {
            this._dispatchers = [];
        }
        this._dispatchers.push(val);
    },

    /**
     * Collection of series to be displayed in the graph.
     *
     * @property _seriesCollection
     * @type Array
     * @private 
     */
    _seriesCollection: null,
    
    /**
     * Object containing key value pairs of `CartesianSeries` instances.
     *
     * @property _seriesDictionary
     * @type Object
     * @private
     */
    _seriesDictionary: null,

    /**
     * Parses series instances to be displayed in the graph.
     *
     * @method _parseSeriesCollection
     * @param {Array} Collection of `CartesianSeries` instances or objects container `CartesianSeries` attributes values.
     * @private
     */
    _parseSeriesCollection: function(val)
    {
        if(!val)
        {
            return;
        }	
        var len = val.length,
            i = 0,
            series,
            seriesKey;
        this._seriesCollection = [];
        this._seriesDictionary = {};
        this.seriesTypes = [];
        for(; i < len; ++i)
        {	
            series = val[i];
            if(!(series instanceof Y.CartesianSeries) && !(series instanceof Y.PieSeries))
            {
                this._createSeries(series);
                continue;
            }
            this._addSeries(series);
        }
        len = this._seriesCollection.length;
        for(i = 0; i < len; ++i)
        {
            series = this.get("seriesCollection")[i];
            seriesKey = series.get("direction") == "horizontal" ? "yKey" : "xKey";
            this._seriesDictionary[series.get(seriesKey)] = series;
        }
    },

    /**
     * Adds a series to the graph.
     *
     * @method _addSeries
     * @param {CartesianSeries} series Series to add to the graph.
     * @private
     */
    _addSeries: function(series)
    {
        var type = series.get("type"),
            seriesCollection = this.get("seriesCollection"),
            graphSeriesLength = seriesCollection.length,
            seriesTypes = this.seriesTypes,
            typeSeriesCollection;	
        if(!series.get("graph")) 
        {
            series.set("graph", this);
        }
        seriesCollection.push(series);
        if(!seriesTypes.hasOwnProperty(type))
        {
            this.seriesTypes[type] = [];
        }
        typeSeriesCollection = this.seriesTypes[type];
        series.set("graphOrder", graphSeriesLength);
        series.set("order", typeSeriesCollection.length);
        typeSeriesCollection.push(series);
        this.addDispatcher(series);
        series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        this.fire("seriesAdded", series);
    },

    /**
     * Creates a `CartesianSeries` instance from an object containing attribute key value pairs. The key value pairs include attributes for the specific series and a type value which defines the type of
     * series to be used. 
     *
     * @method createSeries
     * @param {Object} seriesData Series attribute key value pairs.
     * @private
     */
    _createSeries: function(seriesData)
    {
        var type = seriesData.type,
            seriesCollection = this.get("seriesCollection"),
            seriesTypes = this.seriesTypes,
            typeSeriesCollection,
            seriesType,
            series;
            seriesData.graph = this;
        if(!seriesTypes.hasOwnProperty(type))
        {
            seriesTypes[type] = [];
        }
        typeSeriesCollection = seriesTypes[type];
        seriesData.graph = this;
        seriesData.order = typeSeriesCollection.length;
        seriesData.graphOrder = seriesCollection.length;
        seriesType = this._getSeries(seriesData.type);
        series = new seriesType(seriesData);
        this.addDispatcher(series);
        series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        typeSeriesCollection.push(series);
        seriesCollection.push(series);
        if(this.get("rendered"))
        {
            series.render();
        }
    },
    
    /**
     * String reference for pre-defined `Series` classes.
     *
     * @property _seriesMap
     * @type Object
     * @private
     */
    _seriesMap: {
        line : Y.LineSeries,
        column : Y.ColumnSeries,
        bar : Y.BarSeries,
        area :  Y.AreaSeries,
        candlestick : Y.CandlestickSeries,
        ohlc : Y.OHLCSeries,
        stackedarea : Y.StackedAreaSeries,
        stackedline : Y.StackedLineSeries,
        stackedcolumn : Y.StackedColumnSeries,
        stackedbar : Y.StackedBarSeries,
        markerseries : Y.MarkerSeries,
        spline : Y.SplineSeries,
        areaspline : Y.AreaSplineSeries,
        stackedspline : Y.StackedSplineSeries,
        stackedareaspline : Y.StackedAreaSplineSeries,
        stackedmarkerseries : Y.StackedMarkerSeries,
        pie : Y.PieSeries,
        combo : Y.ComboSeries,
        stackedcombo : Y.StackedComboSeries,
        combospline : Y.ComboSplineSeries,
        stackedcombospline : Y.StackedComboSplineSeries
    },

    /**
     * Returns a specific `CartesianSeries` class based on key value from a look up table of a direct reference to a class. When specifying a key value, the following options
     * are available:
     *
     *  <table>
     *      <tr><th>Key Value</th><th>Class</th></tr>
     *      <tr><td>line</td><td>Y.LineSeries</td></tr>    
     *      <tr><td>column</td><td>Y.ColumnSeries</td></tr>    
     *      <tr><td>bar</td><td>Y.BarSeries</td></tr>    
     *      <tr><td>area</td><td>Y.AreaSeries</td></tr>    
     *      <tr><td>stackedarea</td><td>Y.StackedAreaSeries</td></tr>    
     *      <tr><td>stackedline</td><td>Y.StackedLineSeries</td></tr>    
     *      <tr><td>stackedcolumn</td><td>Y.StackedColumnSeries</td></tr>    
     *      <tr><td>stackedbar</td><td>Y.StackedBarSeries</td></tr>    
     *      <tr><td>markerseries</td><td>Y.MarkerSeries</td></tr>    
     *      <tr><td>spline</td><td>Y.SplineSeries</td></tr>    
     *      <tr><td>areaspline</td><td>Y.AreaSplineSeries</td></tr>    
     *      <tr><td>stackedspline</td><td>Y.StackedSplineSeries</td></tr>
     *      <tr><td>stackedareaspline</td><td>Y.StackedAreaSplineSeries</td></tr>
     *      <tr><td>stackedmarkerseries</td><td>Y.StackedMarkerSeries</td></tr>
     *      <tr><td>pie</td><td>Y.PieSeries</td></tr>
     *      <tr><td>combo</td><td>Y.ComboSeries</td></tr>
     *      <tr><td>stackedcombo</td><td>Y.StackedComboSeries</td></tr>
     *      <tr><td>combospline</td><td>Y.ComboSplineSeries</td></tr>
     *      <tr><td>stackedcombospline</td><td>Y.StackedComboSplineSeries</td></tr>
     *  </table>
     * 
     * When referencing a class directly, you can specify any of the above classes or any custom class that extends `CartesianSeries` or `PieSeries`.
     *
     * @method _getSeries
     * @param {String | Object} type Series type.
     * @return CartesianSeries
     * @private
     */
    _getSeries: function(type)
    {
        var seriesClass;
        if(Y_Lang.isString(type))
        {
            seriesClass = this._seriesMap[type];
        }
        else 
        {
            seriesClass = type;
        }
        return seriesClass;
    },

    /**
     * Event handler for marker events.
     *
     * @method _markerEventHandler
     * @param {Object} e Event object.
     * @private
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            markerNode = e.currentTarget,
            strArr = markerNode.getAttribute("id").split("_"),
            series = this.getSeriesByIndex(strArr[1]),
            index = strArr[2];
        series.updateMarkerState(type, index);
    },

    /**
     * Collection of `CartesianSeries` instances to be redrawn.
     *
     * @property _dispatchers
     * @type Array
     * @private
     */
    _dispatchers: null,

    /**
     * Updates the `Graph` styles.
     *
     * @method _updateStyles
     * @private
     */
    _updateStyles: function()
    {
        var styles = this.get("styles").background,
            border = styles.border;
            border.opacity = border.alpha;
            styles.stroke = border;
            styles.fill.opacity = styles.fill.alpha;
        this.get("background").set(styles);
        this._sizeChangeHandler();
    },

    /**
     * Event handler for size changes.
     *
     * @method _sizeChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _sizeChangeHandler: function(e)
    {
        var hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines"),
            w = this.get("width"),
            h = this.get("height"),
            bg = this.get("styles").background,
            weight,
            background;
        if(bg && bg.border)
        {
            weight = bg.border.weight || 0;
        }
        if(this.get("showBackground"))
        {
            background = this.get("background");
            if(w && h)
            {
                background.set("width", w);
                background.set("height", h);
            }
        }
        if(this._gridlines)
        {
            this._gridlines.clear();
        }
        if(hgl && hgl instanceof Y.Gridlines)
        {
            hgl.draw();
        }
        if(vgl && vgl instanceof Y.Gridlines)
        {
            vgl.draw();
        }
        this._drawSeries();
    },

    /**
     * Draws each series.
     *
     * @method _drawSeries
     * @private
     */
    _drawSeries: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        var sc,
            i,
            len,
            graphic = this.get("graphic");
        graphic.set("autoDraw", false);
        this._callLater = false;
        this._drawing = true;
        sc = this.get("seriesCollection");
        i = 0;
        len = sc ? sc.length : 0;
        for(; i < len; ++i)
        {
            sc[i].draw();
            if((!sc[i].get("xcoords") || !sc[i].get("ycoords")) && !sc[i] instanceof Y.PieSeries)
            {
                this._callLater = true;
                break;
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._drawSeries();
        }
    },  

    /**
     * Event handler for series drawingComplete event.
     *
     * @method _drawingCompleteHandler
     * @param {Object} e Event object.
     * @private
     */
    _drawingCompleteHandler: function(e)
    {
        var series = e.currentTarget,
            graphic,
            index = Y.Array.indexOf(this._dispatchers, series);
        if(index > -1)
        {
            this._dispatchers.splice(index, 1);
        }
        if(this._dispatchers.length < 1)
        {
            graphic = this.get("graphic");
            if(!graphic.get("autoDraw"))
            {
                graphic._redraw();
            }
            this.fire("chartRendered");
        }
    },

    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        var defs = {
            background: {
                shape: "rect",
                fill:{
                    color:"#faf9f2"
                },
                border: {
                    color:"#dad8c9",
                    weight: 1
                }
            }
        };
        return defs;
    },

    /**
     * Destructor implementation Graph class. Removes all Graphic instances from the widget.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        if(this._graphic)
        {
            this._graphic.destroy();
            this._graphic = null;
        }
        if(this._background)
        {
            this._background.get("graphic").destroy();
            this._background = null;
        }
        if(this._gridlines)
        {
            this._gridlines.get("graphic").destroy();
            this._gridlines = null;
        }
    }
}, {
    ATTRS: {
        /**
         * The x-coordinate for the graph.
         *
         * @attribute x
         * @type Number
         * @protected
         */
        x: {
            setter: function(val)
            {
                this.get("boundingBox").setStyle("left", val + "px");
                return val;
            }
        },

        /**
         * The y-coordinate for the graph.
         *
         * @attribute y
         * @type Number
         * @protected
         */
        y: {
            setter: function(val)
            {
                this.get("boundingBox").setStyle("top", val + "px");
                return val;
            }
        },

        /**
         * Reference to the chart instance using the graph.
         *
         * @attribute chart
         * @type ChartBase
         * @readOnly
         */
        chart: {},

        /**
         * Collection of series. When setting the `seriesCollection` the array can contain a combination of either
         * `CartesianSeries` instances or object literals with properties that will define a series.
         *
         * @attribute seriesCollection
         * @type CartesianSeries
         */
        seriesCollection: {
            getter: function()
            {
                return this._seriesCollection;
            },

            setter: function(val)
            {
                this._parseSeriesCollection(val);
                return this._seriesCollection;
            }
        },
       
        /**
         * Indicates whether the `Graph` has a background.
         *
         * @attribute showBackground
         * @type Boolean
         * @default true
         */
        showBackground: {
            value: true
        },

        /**
         * Read-only hash lookup for all series on in the `Graph`.
         *
         * @attribute seriesDictionary
         * @type Object
         * @readOnly
         */
        seriesDictionary: {
            readOnly: true,

            getter: function()
            {
                return this._seriesDictionary;
            }
        },

        /**
         * Reference to the horizontal `Gridlines` instance.
         *
         * @attribute horizontalGridlines
         * @type Gridlines
         * @default null
         */
        horizontalGridlines: {
            value: null,

            setter: function(val)
            {
                var gl = this.get("horizontalGridlines");
                if(gl && gl instanceof Y.Gridlines)
                {
                    gl.remove();
                }
                if(val instanceof Y.Gridlines)
                {
                    gl = val;
                    val.set("graph", this);
                    return val;
                }
                else if(val && val.axis)
                {
                    gl = new Y.Gridlines({direction:"horizontal", axis:val.axis, graph:this, styles:val.styles});
                    return gl;
                }
            }
        },
        
        /**
         * Reference to the vertical `Gridlines` instance.
         *
         * @attribute verticalGridlines
         * @type Gridlines
         * @default null
         */
        verticalGridlines: {
            value: null,

            setter: function(val)
            {
                var gl = this.get("verticalGridlines");
                if(gl && gl instanceof Y.Gridlines)
                {
                    gl.remove();
                }
                if(val instanceof Y.Gridlines)
                {
                    gl = val;
                    val.set("graph", this);
                    return val;
                }
                else if(val && val.axis)
                {
                    gl = new Y.Gridlines({direction:"vertical", axis:val.axis, graph:this, styles:val.styles});
                    return gl;
                }
            }
        },

        /**
         * Reference to graphic instance used for the background.
         *
         * @attribute background
         * @type Graphic
         * @readOnly
         */
        background: {
            getter: function()
            {
                if(!this._background)
                {
                    this._backgroundGraphic = new Y.Graphic({render:this.get("contentBox")});
                    this._backgroundGraphic.get("node").style.zIndex = 0; 
                    this._background = this._backgroundGraphic.addShape({type: "rect"});
                }
                return this._background;
            }
        },

        /**
         * Reference to graphic instance used for gridlines.
         *
         * @attribute gridlines
         * @type Graphic
         * @readOnly
         */
        gridlines: {
            readOnly: true,

            getter: function()
            {
                if(!this._gridlines)
                {
                    this._gridlinesGraphic = new Y.Graphic({render:this.get("contentBox")});
                    this._gridlinesGraphic.get("node").style.zIndex = 1; 
                    this._gridlines = this._gridlinesGraphic.addShape({type: "path"});
                }
                return this._gridlines;
            }
        },
        
        /**
         * Reference to graphic instance used for series.
         *
         * @attribute graphic
         * @type Graphic
         * @readOnly
         */
        graphic: {
            readOnly: true,

            getter: function() 
            {
                if(!this._graphic)
                {
                    this._graphic = new Y.Graphic({render:this.get("contentBox")});
                    this._graphic.get("node").style.zIndex = 2; 
                    this._graphic.set("autoDraw", false);
                }
                return this._graphic;
            }
        },

        /**
         * Indicates whether or not markers for a series will be grouped and rendered in a single complex shape instance.
         *
         * @attribute groupMarkers
         * @type Boolean
         */
        groupMarkers: {
            value: false
        }

        /**
         * Style properties used for drawing a background. Below are the default values:
         *  <dl>
         *      <dt>background</dt><dd>An object containing the following values:
         *          <dl>
         *              <dt>fill</dt><dd>Defines the style properties for the fill. Contains the following values:
         *                  <dl>
         *                      <dt>color</dt><dd>Color of the fill. The default value is #faf9f2.</dd>
         *                      <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the background fill. The default value is 1.</dd>
         *                  </dl>
         *              </dd>
         *              <dt>border</dt><dd>Defines the style properties for the border. Contains the following values:
         *                  <dl>
         *                      <dt>color</dt><dd>Color of the border. The default value is #dad8c9.</dd>
         *                      <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the background border. The default value is 1.</dd>
         *                      <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
/**
 * The ChartBase class is an abstract class used to create charts.
 *
 * @module charts
 * @submodule charts-base
 * @class ChartBase
 * @constructor
 */
function ChartBase() {}

ChartBase.ATTRS = {
    /**
     * Data used to generate the chart.
     * 
     * @attribute dataProvider
     * @type Array
     */
    dataProvider: {
        lazyAdd: false,

        valueFn: function()
        {
            var defDataProvider = [];
            if(!this._seriesKeysExplicitlySet)
            {
                this._seriesKeys = this._buildSeriesKeys(defDataProvider);
            }
            return defDataProvider;
        },

        setter: function(val)
        {
            var dataProvider = this._setDataValues(val);
            if(!this._seriesKeysExplicitlySet)
            {
                this._seriesKeys = this._buildSeriesKeys(dataProvider);
            }
            return dataProvider;
        }
    },

    /**
     * A collection of keys that map to the series axes. If no keys are set,
     * they will be generated automatically depending on the data structure passed into 
     * the chart.
     *
     * @attribute seriesKeys
     * @type Array
     */
    seriesKeys: {
        getter: function()
        {
            return this._seriesKeys;
        },

        setter: function(val)
        {
            this._seriesKeysExplicitlySet = true;
            this._seriesKeys = val;
            return val;
        }
    },

    /**
     * Sets the `aria-label` for the chart.
     *
     * @attribute ariaLabel
     * @type String
     */
    ariaLabel: {
        value: "Chart Application",

        setter: function(val)
        {
            var cb = this.get("contentBox");
            if(cb)
            {
                cb.setAttribute("aria-label", val);
            }
            return val;
        }
    },
    
    /**
     * Sets the aria description for the chart.
     *
     * @attribute ariaDescription
     * @type String
     */
    ariaDescription: {
        value: "Use the up and down keys to navigate between series. Use the left and right keys to navigate through items in a series.",

        setter: function(val)
        {
            if(this._description)
            {
                this._description.setContent("");
                this._description.appendChild(DOCUMENT.createTextNode(val));
            }
            return val;
        }
    },
    
    /**
     * Reference to the default tooltip available for the chart.
     * <p>Contains the following properties:</p>
     *  <dl>
     *      <dt>node</dt><dd>Reference to the actual dom node</dd>
     *      <dt>showEvent</dt><dd>Event that should trigger the tooltip</dd>
     *      <dt>hideEvent</dt><dd>Event that should trigger the removal of a tooltip (can be an event or an array of events)</dd>
     *      <dt>styles</dt><dd>A hash of style properties that will be applied to the tooltip node</dd>
     *      <dt>show</dt><dd>Indicates whether or not to show the tooltip</dd>
     *      <dt>markerEventHandler</dt><dd>Displays and hides tooltip based on marker events</dd>
     *      <dt>planarEventHandler</dt><dd>Displays and hides tooltip based on planar events</dd>
     *      <dt>markerLabelFunction</dt><dd>Reference to the function used to format a marker event triggered tooltip's text. The method contains 
     *      the following arguments:
     *  <dl>
     *      <dt>categoryItem</dt><dd>An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>
     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided).</dd>
     *      <dt>key</dt><dd>The key of the category.</dd>
     *      <dt>value</dt><dd>The value of the category.</dd>
     *  </dl>
     *  </dd>
     *  <dt>valueItem</dt><dd>An object containing the following:
     *      <dl>
     *          <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>
     *          <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *          <dt>key</dt><dd>The key for the series.</dd>
     *          <dt>value</dt><dd>The value for the series item.</dd> 
     *      </dl>
     *  </dd>
     *  <dt>itemIndex</dt><dd>The index of the item within the series.</dd>
     *  <dt>series</dt><dd> The `CartesianSeries` instance of the item.</dd>
     *  <dt>seriesIndex</dt><dd>The index of the series in the `seriesCollection`.</dd>
     *  </dl>
     *  The method returns an `HTMLElement` which is written into the DOM using `appendChild`. If you override this method and choose to return an html string, you
     *  will also need to override the tooltip's `setTextFunction` method to accept an html string.
     *  </dd>
     *  <dt>planarLabelFunction</dt><dd>Reference to the function used to format a planar event triggered tooltip's text
     *  <dl>
     *      <dt>categoryAxis</dt><dd> `CategoryAxis` Reference to the categoryAxis of the chart.
     *      <dt>valueItems</dt><dd>Array of objects for each series that has a data point in the coordinate plane of the event. Each object contains the following data:
     *  <dl>
     *      <dt>axis</dt><dd>The value axis of the series.</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *  </dl> 
     *  </dd>
     *      <dt>index</dt><dd>The index of the item within its series.</dd>
     *      <dt>seriesArray</dt><dd>Array of series instances for each value item.</dd>
     *      <dt>seriesIndex</dt><dd>The index of the series in the `seriesCollection`.</dd>
     *  </dl>
     *  </dd>
     *  </dl>
     *  The method returns an `HTMLElement` which is written into the DOM using `appendChild`. If you override this method and choose to return an html string, you
     *  will also need to override the tooltip's `setTextFunction` method to accept an html string.
     *  </dd>
     *  <dt>setTextFunction</dt><dd>Method that writes content returned from `planarLabelFunction` or `markerLabelFunction` into the the tooltip node.
     *  has the following signature:
     *  <dl>
     *      <dt>label</dt><dd>The `HTMLElement` that the content is to be added.</dd>
     *      <dt>val</dt><dd>The content to be rendered into tooltip. This can be a `String` or `HTMLElement`. If an HTML string is used, it will be rendered as a
     *      string.</dd>
     *  </dl>
     *  </dd>
     *  </dl>
     * @attribute tooltip
     * @type Object
     */ 
    tooltip: {
        valueFn: "_getTooltip",

        setter: function(val)
        {
            return this._updateTooltip(val);
        }
    },

    /** 
     * The key value used for the chart's category axis. 
     *
     * @attribute categoryKey
     * @type String
     * @default category
     */
    categoryKey: {
        value: "category"
    },
        
    /**
     * Indicates the type of axis to use for the category axis.
     *
     *  <dl>
     *      <dt>category</dt><dd>Specifies a `CategoryAxis`.</dd>
     *      <dt>time</dt><dd>Specifies a `TimeAxis</dd>
     *  </dl>
     *
     * @attribute categoryType
     * @type String
     * @default category
     */
    categoryType:{
        value:"category"
    },

    /**
     * Indicates the the type of interactions that will fire events.
     *
     *  <dl>
     *      <dt>marker</dt><dd>Events will be broadcasted when the mouse interacts with individual markers.</dd>
     *      <dt>planar</dt><dd>Events will be broadcasted when the mouse intersects the plane of any markers on the chart.</dd>
     *      <dt>none</dt><dd>No events will be broadcasted.</dd>
     *  </dl>
     *
     * @attribute interactionType
     * @type String
     * @default marker
     */
    interactionType: {
        value: "marker"
    },

    /**
     * Reference to all the axes in the chart.
     *
     * @attribute axesCollection
     * @type Array
     */
    axesCollection: {},

    /**
     * Reference to graph instance.
     * 
     * @attribute graph
     * @type Graph 
     */
    graph: {
        valueFn: "_getGraph"
    },

    /**
     * Indicates whether or not markers for a series will be grouped and rendered in a single complex shape instance.
     *
     * @attribute groupMarkers
     * @type Boolean
     */
    groupMarkers: {
        value: false
    }
};

ChartBase.prototype = {
    /**
     * Handles groupMarkers change event.
     *
     * @method _groupMarkersChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _groupMarkersChangeHandler: function(e)
    {
        var graph = this.get("graph"),
            useGroupMarkers = e.newVal;
        if(graph)
        {
            graph.set("groupMarkers", useGroupMarkers);
        }
    },

    /**
     * Handler for itemRendered event.
     *
     * @method _itemRendered
     * @param {Object} e Event object.
     * @private
     */
    _itemRendered: function(e)
    {
        this._itemRenderQueue = this._itemRenderQueue.splice(1 + Y.Array.indexOf(this._itemRenderQueue, e.currentTarget), 1);
        if(this._itemRenderQueue.length < 1)
        {
            this._redraw();
        }
    },

    /**
     * Default value function for the `Graph` attribute.
     *
     * @method _getGraph
     * @return Graph
     * @private
     */
    _getGraph: function()
    {
        var graph = new Y.Graph({
            chart:this,
            groupMarkers: this.get("groupMarkers")    
        });
        graph.after("chartRendered", Y.bind(function(e) {
            this.fire("chartRendered");
        }, this));
        return graph; 
    },

    /**
     * Returns a series instance by index or key value.
     *
     * @method getSeries
     * @param val
     * @return CartesianSeries
     */
    getSeries: function(val)
    {
        var series = null, 
            graph = this.get("graph");
        if(graph)
        {
            if(Y_Lang.isNumber(val))
            {
                series = graph.getSeriesByIndex(val);
            }
            else
            {
                series = graph.getSeriesByKey(val);
            }
        }
        return series;
    },

    /**
     * Returns an `Axis` instance by key reference. If the axis was explicitly set through the `axes` attribute,
     * the key will be the same as the key used in the `axes` object. For default axes, the key for
     * the category axis is the value of the `categoryKey` (`category`). For the value axis, the default 
     * key is `values`.
     *
     * @method getAxisByKey
     * @param {String} val Key reference used to look up the axis.
     * @return Axis
     */
    getAxisByKey: function(val)
    {
        var axis,
            axes = this.get("axes");
        if(axes && axes.hasOwnProperty(val))
        {
            axis = axes[val];
        }
        return axis;
    },

    /**
     * Returns the category axis for the chart.
     *
     * @method getCategoryAxis
     * @return Axis
     */
    getCategoryAxis: function()
    {
        var axis,
            key = this.get("categoryKey"),
            axes = this.get("axes");
        if(axes.hasOwnProperty(key))
        {
            axis = axes[key];
        }
        return axis;
    },

    /**
     * Default direction of the chart.
     *
     * @property _direction
     * @type String
     * @default horizontal
     * @private
     */
    _direction: "horizontal",
    
    /**
     * Storage for the `dataProvider` attribute.
     *
     * @property _dataProvider
     * @type Array
     * @private
     */
    _dataProvider: null,

    /**
     * Setter method for `dataProvider` attribute.
     *
     * @method _setDataValues
     * @param {Array} val Array to be set as `dataProvider`.
     * @return Array
     * @private
     */
    _setDataValues: function(val)
    {
        if(Y_Lang.isArray(val[0]))
        {
            var hash, 
                dp = [], 
                cats = val[0], 
                i = 0, 
                l = cats.length, 
                n, 
                sl = val.length;
            for(; i < l; ++i)
            {
                hash = {category:cats[i]};
                for(n = 1; n < sl; ++n)
                {
                    hash["series" + n] = val[n][i];
                }
                dp[i] = hash; 
            }
            return dp;
        }
        return val;
    },

    /**
     * Storage for `seriesCollection` attribute.
     *
     * @property _seriesCollection
     * @type Array
     * @private 
     */
    _seriesCollection: null,

    /**
     * Setter method for `seriesCollection` attribute.
     *
     * @property _setSeriesCollection
     * @param {Array} val Array of either `CartesianSeries` instances or objects containing series attribute key value pairs.
     * @private
     */
    _setSeriesCollection: function(val)
    {
        this._seriesCollection = val;
    },
    /**
     * Helper method that returns the axis class that a key references.
     *
     * @method _getAxisClass
     * @param {String} t The type of axis.
     * @return Axis
     * @private
     */
    _getAxisClass: function(t)
    {
        return this._axisClass[t];
    },
  
    /**
     * Key value pairs of axis types. 
     *
     * @property _axisClass
     * @type Object
     * @private
     */
    _axisClass: {
        stacked: Y.StackedAxis,
        numeric: Y.NumericAxis,
        category: Y.CategoryAxis,
        time: Y.TimeAxis
    },

    /**
     * Collection of axes.
     *
     * @property _axes
     * @type Array
     * @private
     */
    _axes: null,

    /**
     * @method initializer
     * @private
     */
    initializer: function()
    {
        this._itemRenderQueue = [];
        this._seriesIndex = -1;
        this._itemIndex = -1;
        this.after("dataProviderChange", this._dataProviderChangeHandler);
    },

    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        var tt = this.get("tooltip"),
            bb = this.get("boundingBox"),
            cb = this.get("contentBox");
        //move the position = absolute logic to a class file
        bb.setStyle("position", "absolute");
        cb.setStyle("position", "absolute");
        this._addAxes();
        this._addSeries();
        if(tt && tt.show)
        {
            this._addTooltip();
        }
        this._setAriaElements(bb, cb);
    },
   
    /**
     * Creates an aria `live-region`, `aria-label` and `aria-describedby` for the Chart.
     *
     * @method _setAriaElements
     * @param {Node} cb Reference to the Chart's `contentBox` attribute.
     * @private
     */
    _setAriaElements: function(bb, cb)
    {
        var description = this._getAriaOffscreenNode(),
            id = this.get("id") + "_description",
            liveRegion = this._getAriaOffscreenNode();
        cb.set("tabIndex", 0);
        cb.set("role", "img");
        cb.setAttribute("aria-label", this.get("ariaLabel"));
        cb.setAttribute("aria-describedby", id);
        description.set("id", id);
        description.set("tabIndex", -1);
        description.appendChild(DOCUMENT.createTextNode(this.get("ariaDescription")));
        liveRegion.set("id", "live-region");
        liveRegion.set("aria-live", "polite");
        liveRegion.set("aria-atomic", "true");
        liveRegion.set("role", "status");
        bb.setAttribute("role", "application");
        bb.appendChild(description);
        bb.appendChild(liveRegion);
        this._description = description;
        this._liveRegion = liveRegion;
    },

    /**
     * Sets a node offscreen for use as aria-description or aria-live-regin.
     *
     * @method _setOffscreen
     * @return Node 
     * @private
     */
    _getAriaOffscreenNode: function()  
    {
        var node = Y.Node.create("<div></div>"),
            ie = Y.UA.ie,
            clipRect = (ie && ie < 8) ? "rect(1px 1px 1px 1px)" : "rect(1px, 1px, 1px, 1px)";
        node.setStyle("position", "absolute");
        node.setStyle("height", "1px"); 
        node.setStyle("width", "1px"); 
        node.setStyle("overflow", "hidden");
        node.setStyle("clip", clipRect); 
        return node;
    },
  
    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        this._redraw();
    },

    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        this.after("tooltipChange", Y.bind(this._tooltipChangeHandler, this));
        this.after("widthChange", this._sizeChanged);
        this.after("heightChange", this._sizeChanged);
        this.after("groupMarkersChange", this._groupMarkersChangeHandler);
        var tt = this.get("tooltip"),
            hideEvent = "mouseout",
            showEvent = "mouseover",
            cb = this.get("contentBox"),
            interactionType = this.get("interactionType"),
            i = 0,
            len,
            markerClassName = "." + SERIES_MARKER,
            isTouch = ((WINDOW && ("ontouchstart" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6));
        Y.on("keydown", Y.bind(function(e) {
            var key = e.keyCode,
                numKey = parseFloat(key),
                msg;
            if(numKey > 36 && numKey < 41)
            {
                e.halt();
                msg = this._getAriaMessage(numKey);
                this._liveRegion.setContent("");
                this._liveRegion.appendChild(DOCUMENT.createTextNode(msg));
            }
        }, this), this.get("contentBox"));
        if(interactionType == "marker")
        {
            //if touch capabilities, toggle tooltip on touchend. otherwise, the tooltip attribute's hideEvent/showEvent types.
            hideEvent = tt.hideEvent;
            showEvent = tt.showEvent;
            if(isTouch)
            {
                Y.delegate("touchend", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                //hide active tooltip if the chart is touched
                Y.on("touchend", Y.bind(function(e) {
                    e.halt(true);
                    if(this._activeMarker)
                    {
                        this._activeMarker = null;
                        this.hideTooltip(e);
                    }
                }, this));
            }
            else
            {
                Y.delegate("mouseenter", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                Y.delegate("mousedown", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                Y.delegate("mouseup", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                Y.delegate("mouseleave", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                Y.delegate("click", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                Y.delegate("mousemove", Y.bind(this._positionTooltip, this), cb, markerClassName);
            }
        }
        else if(interactionType == "planar")
        {
            if(isTouch)
            {
                this._overlay.on("touchend", Y.bind(this._planarEventDispatcher, this));
            }
            else
            {
                this._overlay.on("mousemove", Y.bind(this._planarEventDispatcher, this));
                this.on("mouseout", this.hideTooltip);
            }
        }
        if(tt)
        {
            this.on("markerEvent:touchend", Y.bind(function(e) {
                var marker = e.series.get("markers")[e.index];
                if(this._activeMarker && marker === this._activeMarker)
                {
                    this._activeMarker = null;
                    this.hideTooltip(e);
                }
                else
                {

                    this._activeMarker = marker;
                    tt.markerEventHandler.apply(this, [e]);
                }
            }, this));
            if(hideEvent && showEvent && hideEvent == showEvent)
            {
                this.on(interactionType + "Event:" + hideEvent, this.toggleTooltip);
            }
            else
            {
                if(showEvent)
                {
                    this.on(interactionType + "Event:" + showEvent, tt[interactionType + "EventHandler"]);
                }
                if(hideEvent)
                {
                    if(Y_Lang.isArray(hideEvent))
                    {
                        len = hideEvent.length;
                        for(; i < len; ++i)
                        {
                            this.on(interactionType + "Event:" + hideEvent[i], this.hideTooltip);
                        }
                    }
                    this.on(interactionType + "Event:" + hideEvent, this.hideTooltip);
                }
            }
        }
    },
    
    /**
     * Event handler for marker events.
     *
     * @method _markerEventDispatcher
     * @param {Object} e Event object.
     * @private
     */
    _markerEventDispatcher: function(e)
    {
        var type = e.type,
            cb = this.get("contentBox"),
            markerNode = e.currentTarget,
            strArr = markerNode.getAttribute("id").split("_"),
            index = strArr.pop(),
            seriesIndex = strArr.pop(),
            series = this.getSeries(parseInt(seriesIndex, 10)),
            items = this.getSeriesItems(series, index),
            isTouch = e && e.hasOwnProperty("changedTouches"),
            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,
            x = pageX - cb.getX(),
            y = pageY - cb.getY();
        if(type == "mouseenter")
        {
            type = "mouseover";
        }
        else if(type == "mouseleave")
        {
            type = "mouseout";
        }
        series.updateMarkerState(type, index);
        e.halt();
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseover event.
         * 
         *
         * @event markerEvent:mouseover
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseout event.
         *
         * @event markerEvent:mouseout
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mousedown event.
         *
         * @event markerEvent:mousedown
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseup event.
         *
         * @event markerEvent:mouseup
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a click event.
         *
         * @event markerEvent:click
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>pageX</dt><dd>The x location of the event on the page (including scroll)</dd>
         *      <dt>pageY</dt><dd>The y location of the event on the page (including scroll)</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *      <dt>originEvent</dt><dd>Underlying dom event.</dd>
         *  </dl>
         */
        this.fire("markerEvent:" + type, {
            originEvent: e,
            pageX:pageX, 
            pageY:pageY, 
            categoryItem:items.category, 
            valueItem:items.value, 
            node:markerNode, 
            x:x, 
            y:y, 
            series:series, 
            index:index, 
            seriesIndex:seriesIndex
        });
    },

    /**
     * Event handler for dataProviderChange.
     *
     * @method _dataProviderChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _dataProviderChangeHandler: function(e)
    {
        var dataProvider = e.newVal,
            axes,
            i,
            axis;
        this._seriesIndex = -1;
        this._itemIndex = -1;
        if(this instanceof Y.CartesianChart)
        {
            this.set("axes", this.get("axes"));
            this.set("seriesCollection", this.get("seriesCollection"));
        }
        axes = this.get("axes");
        if(axes)
        {
            for(i in axes)
            {
                if(axes.hasOwnProperty(i))
                {
                    axis = axes[i];
                    if(axis instanceof Y.Axis)
                    {
                        if(axis.get("position") != "none")
                        {
                            this._addToAxesRenderQueue(axis);
                        }
                        axis.set("dataProvider", dataProvider);
                    }
                }
            }
        }
    },
    
    /**
     * Event listener for toggling the tooltip. If a tooltip is visible, hide it. If not, it 
     * will create and show a tooltip based on the event object.
     * 
     * @method toggleTooltip
     * @param {Object} e Event object.
     */
    toggleTooltip: function(e)
    {
        var tt = this.get("tooltip");
        if(tt.visible)
        {
            this.hideTooltip();
        }
        else
        {
            tt.markerEventHandler.apply(this, [e]);
        }
    },

    /**
     * Shows a tooltip
     *
     * @method _showTooltip
     * @param {String} msg Message to dispaly in the tooltip.
     * @param {Number} x x-coordinate 
     * @param {Number} y y-coordinate
     * @private
     */
    _showTooltip: function(msg, x, y)
    {
        var tt = this.get("tooltip"),
            node = tt.node;
        if(msg)
        {
            tt.visible = true;
            tt.setTextFunction(node, msg);
            node.setStyle("top", y + "px");
            node.setStyle("left", x + "px");
            node.setStyle("visibility", "visible");
        }
    },

    /**
     * Positions the tooltip
     *
     * @method _positionTooltip
     * @param {Object} e Event object.
     * @private
     */
    _positionTooltip: function(e)
    {
        var tt = this.get("tooltip"),
            node = tt.node,
            cb = this.get("contentBox"),
            x = (e.pageX + 10) - cb.getX(),
            y = (e.pageY + 10) - cb.getY();
        if(node)
        {
            node.setStyle("left", x + "px");
            node.setStyle("top", y + "px");
        }
    },

    /**
     * Hides the default tooltip
     *
     * @method hideTooltip
     */
    hideTooltip: function()
    {
        var tt = this.get("tooltip"),
            node = tt.node;
        tt.visible = false;
        node.set("innerHTML", "");
        node.setStyle("left", -10000);
        node.setStyle("top", -10000);
        node.setStyle("visibility", "hidden");
    },

    /**
     * Adds a tooltip to the dom.
     *
     * @method _addTooltip
     * @private
     */
    _addTooltip: function()
    {
        var tt = this.get("tooltip"),
            id = this.get("id") + "_tooltip",
            cb = this.get("contentBox"),
            oldNode = DOCUMENT.getElementById(id);
        if(oldNode)
        {
            cb.removeChild(oldNode);
        }
        tt.node.set("id", id);
        tt.node.setStyle("visibility", "hidden");
        cb.appendChild(tt.node);
    },

    /**
     * Updates the tooltip attribute.
     *
     * @method _updateTooltip
     * @param {Object} val Object containing properties for the tooltip.
     * @return Object
     * @private
     */
    _updateTooltip: function(val)
    {
        var tt = this.get("tooltip") || this._getTooltip(),
            i,
            styles,
            node,
            props = {
                markerLabelFunction:"markerLabelFunction",
                planarLabelFunction:"planarLabelFunction",
                setTextFunction:"setTextFunction",
                showEvent:"showEvent",
                hideEvent:"hideEvent",
                markerEventHandler:"markerEventHandler",
                planarEventHandler:"planarEventHandler",
                show:"show"
            };
        if(Y_Lang.isObject(val))
        {
            styles = val.styles;
            node = Y.one(val.node) || tt.node;
            if(styles)
            {
                for(i in styles)
                {
                    if(styles.hasOwnProperty(i))
                    {
                        node.setStyle(i, styles[i]);
                    }
                }
            }
            for(i in props)
            {
                if(val.hasOwnProperty(i))
                {
                    tt[i] = val[i];
                }
            }
            tt.node = node;
        }
        return tt;
    },

    /**
     * Default getter for `tooltip` attribute.
     *
     * @method _getTooltip
     * @return Object
     * @private
     */
    _getTooltip: function()
    {
        var node = DOCUMENT.createElement("div"),
            tooltipClass = _getClassName("chart-tooltip"),
            tt = {
                setTextFunction: this._setText,
                markerLabelFunction: this._tooltipLabelFunction,
                planarLabelFunction: this._planarLabelFunction,
                show: true,
                hideEvent: "mouseout",
                showEvent: "mouseover",
                markerEventHandler: function(e)
                {
                    var tt = this.get("tooltip"),
                    msg = tt.markerLabelFunction.apply(this, [e.categoryItem, e.valueItem, e.index, e.series, e.seriesIndex]);
                    this._showTooltip(msg, e.x + 10, e.y + 10);
                },
                planarEventHandler: function(e)
                {
                    var tt = this.get("tooltip"),
                        msg ,
                        categoryAxis = this.get("categoryAxis");
                    msg = tt.planarLabelFunction.apply(this, [categoryAxis, e.valueItem, e.index, e.items, e.seriesIndex]);
                    this._showTooltip(msg, e.x + 10, e.y + 10);
                }
            };
        node = Y.one(node);
        node.set("id", this.get("id") + "_tooltip");
        node.setStyle("fontSize", "85%");
        node.setStyle("opacity", "0.83");
        node.setStyle("position", "absolute");
        node.setStyle("paddingTop", "2px");
        node.setStyle("paddingRight", "5px");
        node.setStyle("paddingBottom", "4px");
        node.setStyle("paddingLeft", "2px");
        node.setStyle("backgroundColor", "#fff");
        node.setStyle("border", "1px solid #dbdccc");
        node.setStyle("pointerEvents", "none");
        node.setStyle("zIndex", 3);
        node.setStyle("whiteSpace", "noWrap");
        node.setStyle("visibility", "hidden");
        node.addClass(tooltipClass);
        tt.node = Y.one(node);
        return tt;
    },

    /**
     * Formats tooltip text when `interactionType` is `planar`.
     *
     * @method _planarLabelFunction
     * @param {Axis} categoryAxis Reference to the categoryAxis of the chart.
     * @param {Array} valueItems Array of objects for each series that has a data point in the coordinate plane of the event. Each object contains the following data:
     *  <dl>
     *      <dt>axis</dt><dd>The value axis of the series.</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *  </dl> 
     *  @param {Number} index The index of the item within its series.
     *  @param {Array} seriesArray Array of series instances for each value item.
     *  @param {Number} seriesIndex The index of the series in the `seriesCollection`.
     *  @return {String | HTML} 
     * @private
     */
    _planarLabelFunction: function(categoryAxis, valueItems, index, seriesArray, seriesIndex)
    {
        var msg = DOCUMENT.createElement("div"),
            valueItem,
            i = 0,
            len = seriesArray.length,
            axis,
            categoryValue,
            seriesValue,
            series;
        if(categoryAxis)
        {
            categoryValue = categoryAxis.get("labelFunction").apply(this, [categoryAxis.getKeyValueAt(this.get("categoryKey"), index), categoryAxis.get("labelFormat")]);
            if(!Y_Lang.isObject(categoryValue))
            {
                categoryValue = DOCUMENT.createTextNode(categoryValue);
            }
            msg.appendChild(categoryValue);
        }

        for(; i < len; ++i)
        {
            series = seriesArray[i];
            if(series.get("visible"))
            {
                valueItem = valueItems[i];
                axis = valueItem.axis;
                seriesValue =  axis.get("labelFunction").apply(this, [axis.getKeyValueAt(valueItem.key, index), axis.get("labelFormat")]);
                msg.appendChild(DOCUMENT.createElement("br"));
                msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName));
                msg.appendChild(DOCUMENT.createTextNode(": "));
                if(!Y_Lang.isObject(seriesValue))
                {
                    seriesValue = DOCUMENT.createTextNode(seriesValue);
                }
                msg.appendChild(seriesValue);
            }
        }
        return msg;
    },

    /**
     * Formats tooltip text when `interactionType` is `marker`.
     *
     * @method _tooltipLabelFunction
     * @param {Object} categoryItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>
     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key of the category.</dd>
     *      <dt>value</dt><dd>The value of the category</dd>
     *  </dl>
     * @param {Object} valueItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd> 
     *  </dl>
     * @param {Number} itemIndex The index of the item within the series.
     * @param {CartesianSeries} series The `CartesianSeries` instance of the item.
     * @param {Number} seriesIndex The index of the series in the `seriesCollection`.
     * @return {String | HTML}
     * @private
     */
    _tooltipLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)
    {
        var msg = DOCUMENT.createElement("div"),
            categoryValue = categoryItem.axis.get("labelFunction").apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]),
            seriesValue = valueItem.axis.get("labelFunction").apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]);
        msg.appendChild(DOCUMENT.createTextNode(categoryItem.displayName)); 
        msg.appendChild(DOCUMENT.createTextNode(": ")); 
        if(!Y_Lang.isObject(categoryValue))
        {
            categoryValue = DOCUMENT.createTextNode(categoryValue);
        }
        msg.appendChild(categoryValue);
        msg.appendChild(DOCUMENT.createElement("br"));
        msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName)); 
        msg.appendChild(DOCUMENT.createTextNode(": ")); 
        if(!Y_Lang.isObject(seriesValue))
        {
            seriesValue = DOCUMENT.createTextNode(seriesValue);
        }
        msg.appendChild(seriesValue);
        return msg; 
    },

    /**
     * Event handler for the tooltipChange.
     *
     * @method _tooltipChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _tooltipChangeHandler: function(e)
    {
        if(this.get("tooltip"))
        {
            var tt = this.get("tooltip"),
                node = tt.node,
                show = tt.show,
                cb = this.get("contentBox");
            if(node && show)
            {
                if(!cb.contains(node))
                {
                    this._addTooltip();
                }
            }
        }
    },
    
    /**
     * Updates the content of text field. This method writes a value into a text field using 
     * `appendChild`. If the value is a `String`, it is converted to a `TextNode` first. 
     *
     * @method _setText
     * @param label {HTMLElement} label to be updated
     * @param val {String} value with which to update the label
     * @private
     */
    _setText: function(textField, val)
    { 
        textField.setContent("");
        if(Y_Lang.isNumber(val))
        {
            val = val + "";
        }
        else if(!val)
        {
            val = "";
        }
        if(IS_STRING(val))
        {
            val = DOCUMENT.createTextNode(val);
        }
        textField.appendChild(val);
    },

    /**
     * Returns all the keys contained in a  `dataProvider`.
     *
     * @method _getAllKeys
     * @param {Array} dp Collection of objects to be parsed.
     * @return Object
     */
    _getAllKeys: function(dp)
    {
        var i = 0,
            len = dp.length,
            item,
            key,
            keys = {};
        for(; i < len; ++i)
        {
            item = dp[i];
            for(key in item)
            {
                if(item.hasOwnProperty(key))
                {
                    keys[key] = true;
                }
            }
        }
        return keys;
    },
    
    /**
     * Constructs seriesKeys if not explicitly specified.
     *
     * @method _buildSeriesKeys
     * @param {Array} dataProvider The dataProvider for the chart.
     * @return Array
     * @private
     */
    _buildSeriesKeys: function(dataProvider)
    {
        var allKeys,
            catKey = this.get("categoryKey"),
            keys = [],
            i;
        if(this._seriesKeysExplicitlySet)
        {
            return this._seriesKeys;
        }
        allKeys = this._getAllKeys(dataProvider);
        for(i in allKeys)
        {
            if(allKeys.hasOwnProperty(i) && i != catKey)
            {
                keys.push(i);
            }
        }
        return keys;
    }
};
Y.ChartBase = ChartBase;
/**
 * The CartesianChart class creates a chart with horizontal and vertical axes.
 *
 * @module charts
 * @submodule charts-base
 * @class CartesianChart
 * @extends ChartBase
 * @constructor
 */
Y.CartesianChart = Y.Base.create("cartesianChart", Y.Widget, [Y.ChartBase], {
    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        var bb = this.get("boundingBox"),
            cb = this.get("contentBox"),
            tt = this.get("tooltip"),
            overlay,
            overlayClass = _getClassName("overlay");
        //move the position = absolute logic to a class file
        bb.setStyle("position", "absolute");
        cb.setStyle("position", "absolute");
        this._addAxes();
        this._addGridlines();
        this._addSeries();
        if(tt && tt.show)
        {
            this._addTooltip();
        }
        //If there is a style definition. Force them to set.
        this.get("styles");
        if(this.get("interactionType") == "planar")
        {
            overlay = DOCUMENT.createElement("div");
            this.get("contentBox").appendChild(overlay);
            this._overlay = Y.one(overlay); 
            this._overlay.set("id", this.get("id") + "_overlay");
            this._overlay.setStyle("position", "absolute");
            this._overlay.setStyle("background", "#fff");
            this._overlay.setStyle("opacity", 0);
            this._overlay.addClass(overlayClass);
            this._overlay.setStyle("zIndex", 4);
        }
        this._setAriaElements(bb, cb);
        this._redraw();
    },

    /**
     * When `interactionType` is set to `planar`, listens for mouse move events and fires `planarEvent:mouseover` or `planarEvent:mouseout` depending on the position of the mouse in relation to 
     * data points on the `Chart`.
     *
     * @method _planarEventDispatcher
     * @param {Object} e Event object.
     * @private
     */
    _planarEventDispatcher: function(e)
    {
        var graph = this.get("graph"),
            bb = this.get("boundingBox"),
            cb = graph.get("contentBox"),
            isTouch = e && e.hasOwnProperty("changedTouches"),
            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,
            posX = pageX - bb.getX(),
            posY = pageY - bb.getY(),
            offset = {
                x: pageX - cb.getX(),
                y: pageY - cb.getY()
            },
            sc = graph.get("seriesCollection"),
            series,
            i = 0,
            index,
            oldIndex = this._selectedIndex,
            item,
            items = [],
            categoryItems = [],
            valueItems = [],
            direction = this.get("direction"),
            hasMarkers,
            catAxis,
            valAxis,
            coord,
            //data columns and area data could be created on a graph level
            markerPlane,
            len,
            coords;
        e.halt(true);
        if(direction == "horizontal")
        {
            catAxis = "x";
            valAxis = "y";
        }
        else
        {
            valAxis = "x";
            catAxis = "y";
        }
        coord = offset[catAxis];
        if(sc)
        {
            len = sc.length;
            while(i < len && !markerPlane)
            {
                if(sc[i])
                {
                    markerPlane = sc[i].get(catAxis + "MarkerPlane");
                }
                i++;
            }
        }
        if(markerPlane)
        {
            len = markerPlane.length;
            for(i = 0; i < len; ++i)
            {
                if(coord <= markerPlane[i].end && coord >= markerPlane[i].start)
                {
                    index = i;
                    break;
                }
            }
            len = sc.length;
            for(i = 0; i < len; ++i)
            {
                series = sc[i];
                coords = series.get(valAxis + "coords");
                hasMarkers = series.get("markers");
                if(hasMarkers && !isNaN(oldIndex) && oldIndex > -1)
                {
                    series.updateMarkerState("mouseout", oldIndex);
                }
                if(coords && coords[index] > -1)
                {
                    if(hasMarkers && !isNaN(index) && index > -1)
                    {
                        series.updateMarkerState("mouseover", index);
                    }
                    item = this.getSeriesItems(series, index);
                    categoryItems.push(item.category);
                    valueItems.push(item.value);
                    items.push(series);
                }
                    
            }
            this._selectedIndex = index;

            /**
             * Broadcasts when `interactionType` is set to `planar` and a series' marker plane has received a mouseover event.
             * 
             *
             * @event planarEvent:mouseover
             * @preventable false
             * @param {EventFacade} e Event facade with the following additional
             *   properties:
             *  <dl>
             *      <dt>categoryItem</dt><dd>An array of hashes, each containing information about the category `Axis` of each marker whose plane has been intersected.</dd>
             *      <dt>valueItem</dt><dd>An array of hashes, each containing information about the value `Axis` of each marker whose plane has been intersected.</dd>
             *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
             *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
             *      <dt>pageX</dt><dd>The x location of the event on the page (including scroll)</dd>
             *      <dt>pageY</dt><dd>The y location of the event on the page (including scroll)</dd>
             *      <dt>items</dt><dd>An array including all the series which contain a marker whose plane has been intersected.</dd>
             *      <dt>index</dt><dd>Index of the markers in their respective series.</dd>
             *      <dt>originEvent</dt><dd>Underlying dom event.</dd>
             *  </dl>
             */
            /**
             * Broadcasts when `interactionType` is set to `planar` and a series' marker plane has received a mouseout event.
             *
             * @event planarEvent:mouseout
             * @preventable false
             * @param {EventFacade} e 
             */
            if(index > -1)
            {
                this.fire("planarEvent:mouseover", {
                    categoryItem:categoryItems, 
                    valueItem:valueItems, 
                    x:posX, 
                    y:posY, 
                    pageX:pageX,
                    pageY:pageY,
                    items:items, 
                    index:index,
                    originEvent:e
                });
            }
            else
            {
                this.fire("planarEvent:mouseout");
            }
        }
    },

    /**
     * Indicates the default series type for the chart.
     *
     * @property _type
     * @type {String}
     * @private
     */
    _type: "combo",

    /**
     * Queue of axes instances that will be updated. This method is used internally to determine when all axes have been updated.
     *
     * @property _itemRenderQueue
     * @type Array
     * @private
     */
    _itemRenderQueue: null,

    /**
     * Adds an `Axis` instance to the `_itemRenderQueue`.
     *
     * @method _addToAxesRenderQueue
     * @param {Axis} axis An `Axis` instance.
     * @private 
     */
    _addToAxesRenderQueue: function(axis)
    {
        if(!this._itemRenderQueue)
        {
            this._itemRenderQueue = [];
        }
        if(Y.Array.indexOf(this._itemRenderQueue, axis) < 0)
        {
            this._itemRenderQueue.push(axis);
        }
    },

    /**
     * Adds axis instance to the appropriate array based on position
     *
     * @method _addToAxesCollection
     * @param {String} position The position of the axis
     * @param {Axis} axis The `Axis` instance
     */
    _addToAxesCollection: function(position, axis)
    {
        var axesCollection = this.get(position + "AxesCollection");
        if(!axesCollection)
        {
            axesCollection = [];
            this.set(position + "AxesCollection", axesCollection);
        }
        axesCollection.push(axis);
    },

    /**
     * Returns the default value for the `seriesCollection` attribute.
     *
     * @method _getDefaultSeriesCollection
     * @param {Array} val Array containing either `CartesianSeries` instances or objects containing data to construct series instances.
     * @return Array
     * @private
     */
    _getDefaultSeriesCollection: function()
    {
        var seriesCollection,
            dataProvider = this.get("dataProvider");
        if(dataProvider)
        {
            seriesCollection = this._parseSeriesCollection();
        }
        return seriesCollection;
    },

    /**
     * Parses and returns a series collection from an object and default properties.
     *
     * @method _parseSeriesCollection
     * @param {Object} val Object contain properties for series being set.
     * @return Object
     * @private
     */
    _parseSeriesCollection: function(val)
    {
        var dir = this.get("direction"), 
            sc = [], 
            catAxis,
            valAxis,
            tempKeys = [],
            series,
            seriesKeys = this.get("seriesKeys").concat(),
            i,
            index,
            l,
            type = this.get("type"),
            key,
            catKey,
            seriesKey,
            graph,
            orphans = [],
            categoryKey = this.get("categoryKey"),
            showMarkers = this.get("showMarkers"),
            showAreaFill = this.get("showAreaFill"),
            showLines = this.get("showLines");
        val = val || []; 
        if(dir == "vertical")
        {
            catAxis = "yAxis";
            catKey = "yKey";
            valAxis = "xAxis";
            seriesKey = "xKey";
        }
        else
        {
            catAxis = "xAxis";
            catKey = "xKey";
            valAxis = "yAxis";
            seriesKey = "yKey";
        }
        l = val.length;
        while(val && val.length > 0)
        {
            series = val.shift();
            key = this._getBaseAttribute(series, seriesKey);
            if(key)
            {
                index = Y.Array.indexOf(seriesKeys, key);
                if(index > -1)
                {
                    seriesKeys.splice(index, 1);
                    tempKeys.push(key);
                    sc.push(series);
                }
                else
                {
                    orphans.push(series);
                }
            }
            else
            {
                orphans.push(series);
            }
        }
        while(orphans.length > 0)
        {
            series = orphans.shift();
            if(seriesKeys.length > 0)
            {
                key = seriesKeys.shift();
                this._setBaseAttribute(series, seriesKey, key);
                tempKeys.push(key);
                sc.push(series);
            }
            else if(series instanceof Y.CartesianSeries)
            {
                series.destroy(true);
            }
        }
        if(seriesKeys.length > 0)
        {
            tempKeys = tempKeys.concat(seriesKeys);
        }
        l = tempKeys.length;
        for(i = 0; i < l; ++i)
        {
            series = sc[i] || {type:type};
            if(series instanceof Y.CartesianSeries)
            {
                this._parseSeriesAxes(series);
                continue;
            }

            series[catKey] = series[catKey] || categoryKey;
            series[seriesKey] = series[seriesKey] || seriesKeys.shift();
            series[catAxis] = this._getCategoryAxis();
            series[valAxis] = this._getSeriesAxis(series[seriesKey]);
                
            series.type = series.type || type;
            series.direction = series.direction || dir;
            
            if((series.type == "combo" || series.type == "stackedcombo" || series.type == "combospline" || series.type == "stackedcombospline"))
            {
                if(showAreaFill !== null)
                {
                    series.showAreaFill = (series.showAreaFill !== null && series.showAreaFill !== undefined) ? series.showAreaFill : showAreaFill;
                }
                if(showMarkers !== null)
                {
                    series.showMarkers = (series.showMarkers !== null && series.showMarkers !== undefined) ? series.showMarkers : showMarkers;
                }
                if(showLines !== null)
                {
                    series.showLines = (series.showLines !== null && series.showLines !== undefined) ? series.showLines : showLines;
                }
            }
            sc[i] = series;
        }
        if(sc)
        {
            graph = this.get("graph");
            graph.set("seriesCollection", sc);
            sc = graph.get("seriesCollection");
        }
        return sc;
    },

    /**
     * Parse and sets the axes for a series instance.
     *
     * @method _parseSeriesAxes
     * @param {CartesianSeries} series A `CartesianSeries` instance.
     * @private
     */
    _parseSeriesAxes: function(series)
    {
        var axes = this.get("axes"),
            xAxis = series.get("xAxis"),
            yAxis = series.get("yAxis"),
            YAxis = Y.Axis,
            axis;
        if(xAxis && !(xAxis instanceof YAxis) && Y_Lang.isString(xAxis) && axes.hasOwnProperty(xAxis))
        {
            axis = axes[xAxis];
            if(axis instanceof YAxis)
            {
                series.set("xAxis", axis);
            }
        }
        if(yAxis && !(yAxis instanceof YAxis) && Y_Lang.isString(yAxis) && axes.hasOwnProperty(yAxis))
        {   
            axis = axes[yAxis];
            if(axis instanceof YAxis)
            {
                series.set("yAxis", axis);
            }
        }

    },

    /**
     * Returns the category axis instance for the chart.
     *
     * @method _getCategoryAxis
     * @return Axis
     * @private
     */
    _getCategoryAxis: function()
    {
        var axis,
            axes = this.get("axes"),
            categoryAxisName = this.get("categoryAxisName") || this.get("categoryKey");
        axis = axes[categoryAxisName];
        return axis;
    },

    /**
     * Returns the value axis for a series.
     *
     * @method _getSeriesAxis
     * @param {String} key The key value used to determine the axis instance.
     * @return Axis
     * @private
     */
    _getSeriesAxis:function(key, axisName)
    {
        var axes = this.get("axes"),
            i,
            keys,
            axis;
        if(axes)
        {
            if(axisName && axes.hasOwnProperty(axisName))
            {
                axis = axes[axisName];
            }
            else
            {
                for(i in axes)
                {
                    if(axes.hasOwnProperty(i))
                    {
                        keys = axes[i].get("keys");
                        if(keys && keys.hasOwnProperty(key))
                        {
                            axis = axes[i];
                            break;
                        }
                    }
                }
            }
        }
        return axis;
    },

    /**
     * Gets an attribute from an object, using a getter for Base objects and a property for object
     * literals. Used for determining attributes from series/axis references which can be an actual class instance
     * or a hash of properties that will be used to create a class instance.
     *
     * @method _getBaseAttribute
     * @param {Object} item Object or instance in which the attribute resides.
     * @param {String} key Attribute whose value will be returned.
     * @return Object
     * @private
     */
    _getBaseAttribute: function(item, key)
    {
        if(item instanceof Y.Base)
        {
            return item.get(key);
        }
        if(item.hasOwnProperty(key))
        {
            return item[key];
        }
        return null;
    },

    /**
     * Sets an attribute on an object, using a setter of Base objects and a property for object
     * literals. Used for setting attributes on a Base class, either directly or to be stored in an object literal
     * for use at instantiation.
     *
     * @method _setBaseAttribute
     * @param {Object} item Object or instance in which the attribute resides.
     * @param {String} key Attribute whose value will be assigned.
     * @param {Object} value Value to be assigned to the attribute.
     * @private
     */
    _setBaseAttribute: function(item, key, value)
    {
        if(item instanceof Y.Base)
        {
            item.set(key, value);
        }
        else
        {
            item[key] = value;
        }
    },

    /**
     * Creates `Axis` instances.
     *
     * @method _setAxes
     * @param {Object} val Object containing `Axis` instances or objects in which to construct `Axis` instances.
     * @return Object
     * @private
     */
    _setAxes: function(val)
    {
        var hash = this._parseAxes(val),
            axes = {},
            axesAttrs = {
                edgeOffset: "edgeOffset", 
                position: "position",
                overlapGraph:"overlapGraph",
                labelFunction:"labelFunction",
                labelFunctionScope:"labelFunctionScope",
                labelFormat:"labelFormat",
                appendLabelFunction: "appendLabelFunction",
                appendTitleFunction: "appendTitleFunction",
                maximum:"maximum",
                minimum:"minimum", 
                roundingMethod:"roundingMethod",
                alwaysShowZero:"alwaysShowZero",
                title:"title",
                width:"width",
                height:"height"
            },
            dp = this.get("dataProvider"),
            ai,
            i, 
            pos, 
            axis,
            axisPosition,
            dh, 
            axisClass, 
            config,
            axesCollection;
        for(i in hash)
        {
            if(hash.hasOwnProperty(i))
            {
                dh = hash[i];
                if(dh instanceof Y.Axis)
                {
                    axis = dh;
                }
                else
                {
                    axis = null;
                    config = {};
                    config.dataProvider = dh.dataProvider || dp;
                    config.keys = dh.keys;
                    
                    if(dh.hasOwnProperty("roundingUnit"))
                    {
                        config.roundingUnit = dh.roundingUnit;
                    }
                    pos = dh.position;
                    if(dh.styles)
                    {
                        config.styles = dh.styles;
                    }
                    config.position = dh.position;
                    for(ai in axesAttrs)
                    {
                        if(axesAttrs.hasOwnProperty(ai) && dh.hasOwnProperty(ai))
                        {
                            config[ai] = dh[ai];
                        }
                    }
                   
                    //only check for existing axis if we constructed the default axes already
                    if(val)
                    {
                        axis = this.getAxisByKey(i);
                    }
                    
                    if(axis && axis instanceof Y.Axis)
                    {
                        axisPosition = axis.get("position");
                        if(pos != axisPosition)
                        {
                            if(axisPosition != "none")
                            {
                                axesCollection = this.get(axisPosition + "AxesCollection");
                                axesCollection.splice(Y.Array.indexOf(axesCollection, axis), 1);
                            }
                            if(pos != "none")
                            {
                                this._addToAxesCollection(pos, axis);
                            }
                        }
                        axis.setAttrs(config);
                    }
                    else
                    {
                        axisClass = this._getAxisClass(dh.type);
                        axis = new axisClass(config);
                        axis.after("axisRendered", Y.bind(this._itemRendered, this));
                    }
                }

                if(axis)
                {
                    axesCollection = this.get(pos + "AxesCollection");
                    if(axesCollection && Y.Array.indexOf(axesCollection, axis) > 0)
                    {
                        axis.set("overlapGraph", false);
                    }
                    axes[i] = axis;
                }
            }
        }
        return axes;
    },
    
    /**
     * Adds axes to the chart.
     *
     * @method _addAxes
     * @private
     */
    _addAxes: function()
    {
        var axes = this.get("axes"),
            i, 
            axis, 
            pos,
            w = this.get("width"),
            h = this.get("height"),
            node = Y.Node.one(this._parentNode);
        if(!this._axesCollection)
        {   
            this._axesCollection = [];
        }
        for(i in axes)
        {
            if(axes.hasOwnProperty(i))
            {
                axis = axes[i];
                if(axis instanceof Y.Axis)
                {
                    if(!w)
                    {
                        this.set("width", node.get("offsetWidth"));
                        w = this.get("width");
                    }
                    if(!h)
                    {
                        this.set("height", node.get("offsetHeight"));
                        h = this.get("height");
                    }
                    this._addToAxesRenderQueue(axis);
                    pos = axis.get("position");
                    if(!this.get(pos + "AxesCollection"))
                    {
                        this.set(pos + "AxesCollection", [axis]);
                    }
                    else
                    {
                        this.get(pos + "AxesCollection").push(axis);
                    }
                    this._axesCollection.push(axis);
                    if(axis.get("keys").hasOwnProperty(this.get("categoryKey")))
                    {
                        this.set("categoryAxis", axis);
                    }
                    axis.render(this.get("contentBox"));
                }
            }
        }
    },

    /**
     * Renders the Graph.
     *
     * @method _addSeries
     * @private
     */
    _addSeries: function()
    {
        var graph = this.get("graph"),
            sc = this.get("seriesCollection");
        graph.render(this.get("contentBox"));

    },

    /**
     * Adds gridlines to the chart.
     *
     * @method _addGridlines
     * @private
     */
    _addGridlines: function()
    {
        var graph = this.get("graph"),
            hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines"),
            direction = this.get("direction"),
            leftAxesCollection = this.get("leftAxesCollection"),
            rightAxesCollection = this.get("rightAxesCollection"),
            bottomAxesCollection = this.get("bottomAxesCollection"),
            topAxesCollection = this.get("topAxesCollection"),
            seriesAxesCollection,
            catAxis = this.get("categoryAxis"),
            hAxis,
            vAxis;
        if(this._axesCollection)
        {
            seriesAxesCollection = this._axesCollection.concat();
            seriesAxesCollection.splice(Y.Array.indexOf(seriesAxesCollection, catAxis), 1);
        }
        if(hgl)
        {
            if(leftAxesCollection && leftAxesCollection[0])
            {
                hAxis = leftAxesCollection[0];
            }
            else if(rightAxesCollection && rightAxesCollection[0])
            {
                hAxis = rightAxesCollection[0];
            }
            else 
            {
                hAxis = direction == "horizontal" ? catAxis : seriesAxesCollection[0];
            }
            if(!this._getBaseAttribute(hgl, "axis") && hAxis)
            {
                this._setBaseAttribute(hgl, "axis", hAxis);
            }
            if(this._getBaseAttribute(hgl, "axis"))
            {
                graph.set("horizontalGridlines", hgl);
            }
        }
        if(vgl)
        {
            if(bottomAxesCollection && bottomAxesCollection[0])
            {
                vAxis = bottomAxesCollection[0];
            }
            else if (topAxesCollection && topAxesCollection[0])
            {
                vAxis = topAxesCollection[0];
            }
            else 
            {
                vAxis = direction == "vertical" ? catAxis : seriesAxesCollection[0];
            }
            if(!this._getBaseAttribute(vgl, "axis") && vAxis)
            {
                this._setBaseAttribute(vgl, "axis", vAxis);
            }
            if(this._getBaseAttribute(vgl, "axis"))
            {
                graph.set("verticalGridlines", vgl);
            }
        }
    },
    
    /**
     * Default Function for the axes attribute.
     *
     * @method _getDefaultAxes
     * @return Object
     * @private
     */
    _getDefaultAxes: function()
    {
        var axes;
        if(this.get("dataProvider"))
        {
            axes = this._parseAxes();
        }
        return axes;
    },

    /**
     * Generates and returns a key-indexed object containing `Axis` instances or objects used to create `Axis` instances.
     *
     * @method _parseAxes
     * @param {Object} axes Object containing `Axis` instances or `Axis` attributes.
     * @return Object
     * @private
     */
    _parseAxes: function(axes)
    {
        var catKey = this.get("categoryKey"),
            axis,
            attr,
            keys,
            newAxes = {},
            claimedKeys = [],
            categoryAxisName = this.get("categoryAxisName") || this.get("categoryKey"),
            valueAxisName = this.get("valueAxisName"),
            seriesKeys = this.get("seriesKeys").concat(),
            i, 
            l,
            ii,
            ll,
            cIndex,
            direction = this.get("direction"),
            seriesPosition,
            categoryPosition,
            valueAxes = [],
            seriesAxis = this.get("stacked") ? "stacked" : "numeric";
        if(direction == "vertical")
        {
            seriesPosition = "bottom";
            categoryPosition = "left";
        }
        else
        {
            seriesPosition = "left";
            categoryPosition = "bottom";
        }
        if(axes)
        {
            for(i in axes)
            {
                if(axes.hasOwnProperty(i))
                {
                    axis = axes[i];
                    keys = this._getBaseAttribute(axis, "keys");
                    attr = this._getBaseAttribute(axis, "type");
                    if(attr == "time" || attr == "category")
                    {
                        categoryAxisName = i;
                        this.set("categoryAxisName", i);
                        if(Y_Lang.isArray(keys) && keys.length > 0)
                        {
                            catKey = keys[0];
                            this.set("categoryKey", catKey);
                        }
                        newAxes[i] = axis;
                    }
                    else if(i == categoryAxisName)
                    {
                        newAxes[i] = axis;
                    }
                    else 
                    {
                        newAxes[i] = axis;
                        if(i != valueAxisName && keys && Y_Lang.isArray(keys))
                        {
                            ll = keys.length;
                            for(ii = 0; ii < ll; ++ii)
                            {
                                claimedKeys.push(keys[ii]);
                            }
                            valueAxes.push(newAxes[i]);
                        }
                        if(!(this._getBaseAttribute(newAxes[i], "type")))
                        {
                            this._setBaseAttribute(newAxes[i], "type", seriesAxis);
                        }
                        if(!(this._getBaseAttribute(newAxes[i], "position")))
                        {
                            this._setBaseAttribute(newAxes[i], "position", this._getDefaultAxisPosition(newAxes[i], valueAxes, seriesPosition));
                        }
                    }
                }
            }
        }
        cIndex = Y.Array.indexOf(seriesKeys, catKey);
        if(cIndex > -1)
        {
            seriesKeys.splice(cIndex, 1);
        }
        l = claimedKeys.length;
        for(i = 0; i < l; ++i)
        {
            cIndex = Y.Array.indexOf(seriesKeys, claimedKeys[i]); 
            if(cIndex > -1)
            {
                seriesKeys.splice(cIndex, 1);
            }
        }
        if(!newAxes.hasOwnProperty(categoryAxisName))
        {
            newAxes[categoryAxisName] = {};
        }
        if(!(this._getBaseAttribute(newAxes[categoryAxisName], "keys")))
        {
            this._setBaseAttribute(newAxes[categoryAxisName], "keys", [catKey]);
        }
        
        if(!(this._getBaseAttribute(newAxes[categoryAxisName], "position")))
        {
            this._setBaseAttribute(newAxes[categoryAxisName], "position", categoryPosition);
        }
         
        if(!(this._getBaseAttribute(newAxes[categoryAxisName], "type")))
        {
            this._setBaseAttribute(newAxes[categoryAxisName], "type", this.get("categoryType"));
        }
        if(!newAxes.hasOwnProperty(valueAxisName) && seriesKeys && seriesKeys.length > 0)
        {
            newAxes[valueAxisName] = {keys:seriesKeys};
            valueAxes.push(newAxes[valueAxisName]);
        }
        if(claimedKeys.length > 0)
        {
            if(seriesKeys.length > 0)
            {
                seriesKeys = claimedKeys.concat(seriesKeys);
            }
            else
            {
                seriesKeys = claimedKeys;
            }
        }
        if(newAxes.hasOwnProperty(valueAxisName))
        {
            if(!(this._getBaseAttribute(newAxes[valueAxisName], "position")))
            {
                this._setBaseAttribute(newAxes[valueAxisName], "position", this._getDefaultAxisPosition(newAxes[valueAxisName], valueAxes, seriesPosition));
            }
            this._setBaseAttribute(newAxes[valueAxisName], "type", seriesAxis);
            this._setBaseAttribute(newAxes[valueAxisName], "keys", seriesKeys);
        } 
        if(!this._seriesKeysExplicitlySet)
        {
            this._seriesKeys = seriesKeys;
        }
        return newAxes;
    },

    /**
     * Determines the position of an axis when one is not specified.
     *
     * @method _getDefaultAxisPosition
     * @param {Axis} axis `Axis` instance.
     * @param {Array} valueAxes Array of `Axis` instances.
     * @param {String} position Default position depending on the direction of the chart and type of axis.
     * @return String
     * @private
     */
    _getDefaultAxisPosition: function(axis, valueAxes, position)
    {
        var direction = this.get("direction"),
            i = Y.Array.indexOf(valueAxes, axis);
        
        if(valueAxes[i - 1] && valueAxes[i - 1].position)
        {
            if(direction == "horizontal")
            {
                if(valueAxes[i - 1].position == "left")
                {
                    position = "right";
                }
                else if(valueAxes[i - 1].position == "right")
                {
                    position = "left";
                }
            }
            else
            {
                if (valueAxes[i -1].position == "bottom")
                {
                    position = "top";
                }       
                else
                {
                    position = "bottom";
                }
            }
        }
        return position;
    },

   
    /**
     * Returns an object literal containing a categoryItem and a valueItem for a given series index. Below is the structure of each:
     * 
     * @method getSeriesItems
     * @param {CartesianSeries} series Reference to a series.
     * @param {Number} index Index of the specified item within a series.
     * @return Object An object literal containing the following:
     *
     *  <dl>
     *      <dt>categoryItem</dt><dd>Object containing the following data related to the category axis of the series.
     *  <dl>
     *      <dt>axis</dt><dd>Reference to the category axis of the series.</dd>
     *      <dt>key</dt><dd>Category key for the series.</dd>
     *      <dt>value</dt><dd>Value on the axis corresponding to the series index.</dd>
     *  </dl>
     *      </dd>
     *      <dt>valueItem</dt><dd>Object containing the following data related to the category axis of the series.
     *  <dl>
     *      <dt>axis</dt><dd>Reference to the value axis of the series.</dd>
     *      <dt>key</dt><dd>Value key for the series.</dd>
     *      <dt>value</dt><dd>Value on the axis corresponding to the series index.</dd>
     *  </dl>
     *      </dd>
     *  </dl>
     */
    getSeriesItems: function(series, index)
    {
        var xAxis = series.get("xAxis"),
            yAxis = series.get("yAxis"),
            xKey = series.get("xKey"),
            yKey = series.get("yKey"),
            categoryItem,
            valueItem;
        if(this.get("direction") == "vertical")
        {
            categoryItem = {
                axis:yAxis,
                key:yKey,
                value:yAxis.getKeyValueAt(yKey, index)
            };
            valueItem = {
                axis:xAxis,
                key:xKey,
                value: xAxis.getKeyValueAt(xKey, index)
            };
        }
        else
        {
            valueItem = {
                axis:yAxis,
                key:yKey,
                value:yAxis.getKeyValueAt(yKey, index)
            };
            categoryItem = {
                axis:xAxis,
                key:xKey,
                value: xAxis.getKeyValueAt(xKey, index)
            };
        }
        categoryItem.displayName = series.get("categoryDisplayName");
        valueItem.displayName = series.get("valueDisplayName");
        categoryItem.value = categoryItem.axis.getKeyValueAt(categoryItem.key, index);
        valueItem.value = valueItem.axis.getKeyValueAt(valueItem.key, index);
        return {category:categoryItem, value:valueItem};
    },

    /**
     * Handler for sizeChanged event.
     *
     * @method _sizeChanged
     * @param {Object} e Event object.
     * @private
     */
    _sizeChanged: function(e)
    {
        if(this._axesCollection)
        {
            var ac = this._axesCollection,
                i = 0,
                l = ac.length;
            for(; i < l; ++i)
            {
                this._addToAxesRenderQueue(ac[i]);
            }
            this._redraw();
        }
    },
    
    /**
     * Returns the maximum distance in pixels that the extends outside the top bounds of all vertical axes.
     *
     * @method _getTopOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} width Width of the axes
     * @return Number
     * @private
     */
    _getTopOverflow: function(set1, set2, height)
    {
        var i = 0,
            len,
            overflow = 0,
            axis;
        if(set1)
        {
            len = set1.length;
            for(; i < len; ++i)
            {
                axis = set1[i];
                overflow = Math.max(overflow, Math.abs(axis.getMaxLabelBounds().top) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        if(set2)
        {
            i = 0;
            len = set2.length;
            for(; i < len; ++i)
            {
                axis = set2[i];
                overflow = Math.max(overflow, Math.abs(axis.getMaxLabelBounds().top) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        return overflow;
    },
    
    /**
     * Returns the maximum distance in pixels that the extends outside the right bounds of all horizontal axes.
     *
     * @method _getRightOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} width Width of the axes
     * @return Number
     * @private
     */
    _getRightOverflow: function(set1, set2, width)
    {
        var i = 0,
            len,
            overflow = 0,
            axis;
        if(set1)
        {
            len = set1.length;
            for(; i < len; ++i)
            {
                axis = set1[i];
                overflow = Math.max(overflow, axis.getMaxLabelBounds().right - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        if(set2)
        {
            i = 0;
            len = set2.length;
            for(; i < len; ++i)
            {
                axis = set2[i];
                overflow = Math.max(overflow, axis.getMaxLabelBounds().right - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        return overflow;
    },
    
    /**
     * Returns the maximum distance in pixels that the extends outside the left bounds of all horizontal axes.
     *
     * @method _getLeftOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} width Width of the axes
     * @return Number
     * @private
     */
    _getLeftOverflow: function(set1, set2, width)
    {
        var i = 0,
            len,
            overflow = 0,
            axis;
        if(set1)
        {
            len = set1.length;
            for(; i < len; ++i)
            {
                axis = set1[i];
                overflow = Math.max(overflow, Math.abs(axis.getMinLabelBounds().left) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        if(set2)
        {
            i = 0;
            len = set2.length;
            for(; i < len; ++i)
            {
                axis = set2[i];
                overflow = Math.max(overflow, Math.abs(axis.getMinLabelBounds().left) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        return overflow;
    },
    
    /**
     * Returns the maximum distance in pixels that the extends outside the bottom bounds of all vertical axes.
     *
     * @method _getBottomOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} height Height of the axes
     * @return Number
     * @private
     */
    _getBottomOverflow: function(set1, set2, height)
    {
        var i = 0,
            len,
            overflow = 0,
            axis;
        if(set1)
        {
            len = set1.length;
            for(; i < len; ++i)
            {
                axis = set1[i];
                overflow = Math.max(overflow, axis.getMinLabelBounds().bottom - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        if(set2)
        {
            i = 0;
            len = set2.length;
            for(; i < len; ++i)
            {
                axis = set2[i];
                overflow = Math.max(overflow, axis.getMinLabelBounds().bottom - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        return overflow;
    },

    /**
     * Redraws and position all the components of the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        var w = this.get("width"),
            h = this.get("height"),
            leftPaneWidth = 0,
            rightPaneWidth = 0,
            topPaneHeight = 0,
            bottomPaneHeight = 0,
            leftAxesCollection = this.get("leftAxesCollection"),
            rightAxesCollection = this.get("rightAxesCollection"),
            topAxesCollection = this.get("topAxesCollection"),
            bottomAxesCollection = this.get("bottomAxesCollection"),
            i = 0,
            l,
            axis,
            graphOverflow = "visible",
            graph = this.get("graph"),
            topOverflow,
            bottomOverflow,
            leftOverflow,
            rightOverflow,
            graphWidth,
            graphHeight,
            graphX,
            graphY,
            allowContentOverflow = this.get("allowContentOverflow"),
            diff,
            rightAxesXCoords,
            leftAxesXCoords,
            topAxesYCoords,
            bottomAxesYCoords,
            graphRect = {};
        if(leftAxesCollection)
        {
            leftAxesXCoords = [];
            l = leftAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                leftAxesXCoords.unshift(leftPaneWidth);
                leftPaneWidth += leftAxesCollection[i].get("width");
            }
        }
        if(rightAxesCollection)
        {
            rightAxesXCoords = [];
            l = rightAxesCollection.length;
            i = 0;
            for(i = l - 1; i > -1; --i)
            {
                rightPaneWidth += rightAxesCollection[i].get("width");
                rightAxesXCoords.unshift(w - rightPaneWidth);
            }
        }
        if(topAxesCollection)
        {
            topAxesYCoords = [];
            l = topAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                topAxesYCoords.unshift(topPaneHeight);
                topPaneHeight += topAxesCollection[i].get("height");
            }
        }
        if(bottomAxesCollection)
        {
            bottomAxesYCoords = [];
            l = bottomAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                bottomPaneHeight += bottomAxesCollection[i].get("height");
                bottomAxesYCoords.unshift(h - bottomPaneHeight);
            }
        }
        
        graphWidth = w - (leftPaneWidth + rightPaneWidth);
        graphHeight = h - (bottomPaneHeight + topPaneHeight);
        graphRect.left = leftPaneWidth;
        graphRect.top = topPaneHeight;
        graphRect.bottom = h - bottomPaneHeight;
        graphRect.right = w - rightPaneWidth;
        if(!allowContentOverflow)
        {
            topOverflow = this._getTopOverflow(leftAxesCollection, rightAxesCollection);
            bottomOverflow = this._getBottomOverflow(leftAxesCollection, rightAxesCollection);
            leftOverflow = this._getLeftOverflow(bottomAxesCollection, topAxesCollection);
            rightOverflow = this._getRightOverflow(bottomAxesCollection, topAxesCollection);
            
            diff = topOverflow - topPaneHeight;
            if(diff > 0)
            {
                graphRect.top = topOverflow;
                if(topAxesYCoords)
                {
                    i = 0;
                    l = topAxesYCoords.length;
                    for(; i < l; ++i)
                    {
                        topAxesYCoords[i] += diff;
                    }
                }
            }

            diff = bottomOverflow - bottomPaneHeight;
            if(diff > 0)
            {
                graphRect.bottom = h - bottomOverflow;
                if(bottomAxesYCoords)
                {
                    i = 0;
                    l = bottomAxesYCoords.length;
                    for(; i < l; ++i)
                    {
                        bottomAxesYCoords[i] -= diff;
                    }
                }
            }

            diff = leftOverflow - leftPaneWidth;
            if(diff > 0)
            {
                graphRect.left = leftOverflow;
                if(leftAxesXCoords)
                {
                    i = 0;
                    l = leftAxesXCoords.length;
                    for(; i < l; ++i)
                    {
                        leftAxesXCoords[i] += diff;
                    }
                }
            }

            diff = rightOverflow - rightPaneWidth;
            if(diff > 0)
            {
                graphRect.right = w - rightOverflow;
                if(rightAxesXCoords)
                {
                    i = 0;
                    l = rightAxesXCoords.length;
                    for(; i < l; ++i)
                    {
                        rightAxesXCoords[i] -= diff;
                    }
                }
            }
        }
        graphWidth = graphRect.right - graphRect.left;
        graphHeight = graphRect.bottom - graphRect.top;
        graphX = graphRect.left;
        graphY = graphRect.top;
        if(topAxesCollection)
        {
            l = topAxesCollection.length;
            i = 0;
            for(; i < l; i++)
            {
                axis = topAxesCollection[i];
                if(axis.get("width") !== graphWidth)
                {
                    axis.set("width", graphWidth);
                }
                axis.get("boundingBox").setStyle("left", graphX + "px");
                axis.get("boundingBox").setStyle("top", topAxesYCoords[i] + "px");
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(bottomAxesCollection)
        {
            l = bottomAxesCollection.length;
            i = 0;
            for(; i < l; i++)
            {
                axis = bottomAxesCollection[i];
                if(axis.get("width") !== graphWidth)
                {
                    axis.set("width", graphWidth);
                }
                axis.get("boundingBox").setStyle("left", graphX + "px");
                axis.get("boundingBox").setStyle("top", bottomAxesYCoords[i] + "px");
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(leftAxesCollection)
        {
            l = leftAxesCollection.length;
            i = 0;
            for(; i < l; ++i)
            {
                axis = leftAxesCollection[i];
                axis.get("boundingBox").setStyle("top", graphY + "px");
                axis.get("boundingBox").setStyle("left", leftAxesXCoords[i] + "px");
                if(axis.get("height") !== graphHeight)
                {
                    axis.set("height", graphHeight);
                }
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(rightAxesCollection)
        {
            l = rightAxesCollection.length;
            i = 0;
            for(; i < l; ++i)
            {
                axis = rightAxesCollection[i];
                axis.get("boundingBox").setStyle("top", graphY + "px");
                axis.get("boundingBox").setStyle("left", rightAxesXCoords[i] + "px");
                if(axis.get("height") !== graphHeight)
                {
                    axis.set("height", graphHeight);
                }
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._redraw();
            return;
        }
        if(graph)
        {
            graph.get("boundingBox").setStyle("left", graphX + "px");
            graph.get("boundingBox").setStyle("top", graphY + "px");
            graph.set("width", graphWidth);
            graph.set("height", graphHeight);
            graph.get("boundingBox").setStyle("overflow", graphOverflow);
        }

        if(this._overlay)
        {
            this._overlay.setStyle("left", graphX + "px");
            this._overlay.setStyle("top", graphY + "px");
            this._overlay.setStyle("width", graphWidth + "px");
            this._overlay.setStyle("height", graphHeight + "px");
        }
    },

    /**
     * Destructor implementation for the CartesianChart class. Calls destroy on all axes, series and the Graph instance.
     * Removes the tooltip and overlay HTML elements.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        var graph = this.get("graph"),
            i = 0,
            len,
            seriesCollection = this.get("seriesCollection"),
            axesCollection = this._axesCollection,
            tooltip = this.get("tooltip").node;
        if(this._description)
        {
            this._description.empty();
            this._description.remove(true);
        }
        if(this._liveRegion)
        {
            this._liveRegion.empty();
            this._liveRegion.remove(true);
        }
        len = seriesCollection ? seriesCollection.length : 0;
        for(; i < len; ++i)
        {
            if(seriesCollection[i] instanceof Y.CartesianSeries)
            {
                seriesCollection[i].destroy(true);
            }
        }
        len = axesCollection ? axesCollection.length : 0;
        for(i = 0; i < len; ++i)
        {
            if(axesCollection[i] instanceof Y.Axis)
            {
                axesCollection[i].destroy(true);
            }
        }
        if(graph)
        {
            graph.destroy(true);
        }
        if(tooltip)
        {
            tooltip.empty();
            tooltip.remove(true);
        }
        if(this._overlay)
        {
            this._overlay.empty();
            this._overlay.remove(true);
        }
    },

    /**
     * Returns the appropriate message based on the key press.
     *
     * @method _getAriaMessage
     * @param {Number} key The keycode that was pressed.
     * @return String
     */
    _getAriaMessage: function(key)
    {
        var msg = "",
            series,
            items,
            categoryItem,
            valueItem,
            seriesIndex = this._seriesIndex,
            itemIndex = this._itemIndex,
            seriesCollection = this.get("seriesCollection"),
            len = seriesCollection.length,
            dataLength;
        if(key % 2 === 0)
        {
            if(len > 1)
            {
                if(key === 38)
                {
                    seriesIndex = seriesIndex < 1 ? len - 1 : seriesIndex - 1;
                }
                else if(key === 40)
                {
                    seriesIndex = seriesIndex >= len - 1 ? 0 : seriesIndex + 1;
                }
                this._itemIndex = -1;
            }
            else
            {
                seriesIndex = 0;
            }
            this._seriesIndex = seriesIndex;
            series = this.getSeries(parseInt(seriesIndex, 10));
            msg = series.get("valueDisplayName") + " series.";
        }
        else
        {
            if(seriesIndex > -1)
            {
                msg = "";
                series = this.getSeries(parseInt(seriesIndex, 10));
            }
            else
            {
                seriesIndex = 0;
                this._seriesIndex = seriesIndex;
                series = this.getSeries(parseInt(seriesIndex, 10));
                msg = series.get("valueDisplayName") + " series.";
            }
            dataLength = series._dataLength ? series._dataLength : 0;
            if(key === 37)
            {
                itemIndex = itemIndex > 0 ? itemIndex - 1 : dataLength - 1;
            }
            else if(key === 39)
            {
                itemIndex = itemIndex >= dataLength - 1 ? 0 : itemIndex + 1;
            }
            this._itemIndex = itemIndex;
            items = this.getSeriesItems(series, itemIndex);
            categoryItem = items.category;
            valueItem = items.value;
            if(categoryItem && valueItem && categoryItem.value && valueItem.value)
            {
                msg += categoryItem.displayName + ": " + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]) + ", ";
                msg += valueItem.displayName + ": " + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]) + ", "; 
            }
           else
            {
                msg += "No data available.";
            }
            msg += (itemIndex + 1) + " of " + dataLength + ". ";
        }
        return msg;
    }
}, {
    ATTRS: {
        /**
         * Indicates whether axis labels are allowed to overflow beyond the bounds of the chart's content box.
         *
         * @attribute allowContentOverflow
         * @type Boolean
         */
        allowContentOverflow: {
            value: false
        },

        /**
         * Style object for the axes.
         *
         * @attribute axesStyles
         * @type Object
         * @private
         */
        axesStyles: {
            getter: function()
            {
                var axes = this.get("axes"),
                    i,
                    styles = this._axesStyles;
                if(axes)
                {
                    for(i in axes)
                    {
                        if(axes.hasOwnProperty(i) && axes[i] instanceof Y.Axis)
                        {
                            if(!styles)
                            {
                                styles = {};
                            }
                            styles[i] = axes[i].get("styles");
                        }
                    }
                }
                return styles;
            },
            
            setter: function(val)
            {
                var axes = this.get("axes"),
                    i;
                for(i in val)
                {
                    if(val.hasOwnProperty(i) && axes.hasOwnProperty(i))
                    {
                        this._setBaseAttribute(axes[i], "styles", val[i]);
                    }
                }
            }
        },

        /**
         * Style object for the series
         *
         * @attribute seriesStyles
         * @type Object
         * @private
         */
        seriesStyles: {
            getter: function()
            {
                var styles = this._seriesStyles,
                    graph = this.get("graph"),
                    dict,
                    i;
                if(graph)
                {
                    dict = graph.get("seriesDictionary");
                    if(dict)
                    {
                        styles = {};
                        for(i in dict)
                        {
                            if(dict.hasOwnProperty(i))
                            {
                                styles[i] = dict[i].get("styles");
                            }
                        }
                    }
                }
                return styles;
            },
            
            setter: function(val)
            {
                var i,
                    l,
                    s;
    
                if(Y_Lang.isArray(val))
                {
                    s = this.get("seriesCollection");
                    i = 0;
                    l = val.length;

                    for(; i < l; ++i)
                    {
                        this._setBaseAttribute(s[i], "styles", val[i]);
                    }
                }
                else
                {
                    for(i in val)
                    {
                        if(val.hasOwnProperty(i))
                        {
                            s = this.getSeries(i);
                            this._setBaseAttribute(s, "styles", val[i]);
                        }
                    }
                }
            }
        },

        /**
         * Styles for the graph.
         *
         * @attribute graphStyles
         * @type Object
         * @private
         */
        graphStyles: {
            getter: function()
            {
                var graph = this.get("graph");
                if(graph)
                {
                    return(graph.get("styles"));
                }
                return this._graphStyles;
            },

            setter: function(val)
            {
                var graph = this.get("graph");
                this._setBaseAttribute(graph, "styles", val);
            }

        },

        /**
         * Style properties for the chart. Contains a key indexed hash of the following:
         *  <dl>
         *      <dt>series</dt><dd>A key indexed hash containing references to the `styles` attribute for each series in the chart.
         *      Specific style attributes vary depending on the series:
         *      <ul>
         *          <li><a href="AreaSeries.html#attr_styles">AreaSeries</a></li>
         *          <li><a href="BarSeries.html#attr_styles">BarSeries</a></li>
         *          <li><a href="ColumnSeries.html#attr_styles">ColumnSeries</a></li>
         *          <li><a href="ComboSeries.html#attr_styles">ComboSeries</a></li>
         *          <li><a href="LineSeries.html#attr_styles">LineSeries</a></li>
         *          <li><a href="MarkerSeries.html#attr_styles">MarkerSeries</a></li>
         *          <li><a href="SplineSeries.html#attr_styles">SplineSeries</a></li>
         *      </ul>
         *      </dd>
         *      <dt>axes</dt><dd>A key indexed hash containing references to the `styles` attribute for each axes in the chart. Specific
         *      style attributes can be found in the <a href="Axis.html#attr_styles">Axis</a> class.</dd>
         *      <dt>graph</dt><dd>A reference to the `styles` attribute in the chart. Specific style attributes can be found in the
         *      <a href="Graph.html#attr_styles">Graph</a> class.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
        styles: {
            getter: function()
            {
                var styles = { 
                    axes: this.get("axesStyles"),
                    series: this.get("seriesStyles"),
                    graph: this.get("graphStyles")
                };
                return styles;
            },
            setter: function(val)
            {
                if(val.hasOwnProperty("axes"))
                {
                    if(this.get("axesStyles"))
                    {
                        this.set("axesStyles", val.axes);
                    }
                    else
                    {
                        this._axesStyles = val.axes;
                    }
                }
                if(val.hasOwnProperty("series"))
                {
                    if(this.get("seriesStyles"))
                    {
                        this.set("seriesStyles", val.series);
                    }
                    else
                    {
                        this._seriesStyles = val.series;
                    }
                }
                if(val.hasOwnProperty("graph"))
                {
                    this.set("graphStyles", val.graph);
                }
            }
        },

        /**
         * Axes to appear in the chart. This can be a key indexed hash of axis instances or object literals
         * used to construct the appropriate axes.
         *
         * @attribute axes
         * @type Object
         */
        axes: {
            valueFn: "_getDefaultAxes",

            setter: function(val)
            {
                if(this.get("dataProvider"))
                {
                    val = this._setAxes(val);
                }
                return val;
            }
        },

        /**
         * Collection of series to appear on the chart. This can be an array of Series instances or object literals
         * used to construct the appropriate series.
         *
         * @attribute seriesCollection
         * @type Array
         */
        seriesCollection: {
            valueFn: "_getDefaultSeriesCollection",
            
            setter: function(val)
            {
                if(this.get("dataProvider"))
                {
                    val = this._parseSeriesCollection(val);
                }
                return val;
            }
        },

        /**
         * Reference to the left-aligned axes for the chart.
         *
         * @attribute leftAxesCollection
         * @type Array
         * @private
         */
        leftAxesCollection: {},

        /**
         * Reference to the bottom-aligned axes for the chart.
         *
         * @attribute bottomAxesCollection
         * @type Array
         * @private
         */
        bottomAxesCollection: {},

        /**
         * Reference to the right-aligned axes for the chart.
         *
         * @attribute rightAxesCollection
         * @type Array
         * @private
         */
        rightAxesCollection: {},

        /**
         * Reference to the top-aligned axes for the chart.
         *
         * @attribute topAxesCollection
         * @type Array
         * @private
         */
        topAxesCollection: {},
        
        /**
         * Indicates whether or not the chart is stacked.
         *
         * @attribute stacked
         * @type Boolean
         */
        stacked: {
            value: false
        },

        /**
         * Direction of chart's category axis when there is no series collection specified. Charts can
         * be horizontal or vertical. When the chart type is column, the chart is horizontal.
         * When the chart type is bar, the chart is vertical. 
         *
         * @attribute direction
         * @type String
         */
        direction: {
            getter: function()
            {
                var type = this.get("type");
                if(type == "bar")
                {   
                    return "vertical";
                }
                else if(type == "column")
                {
                    return "horizontal";
                }
                return this._direction;
            },

            setter: function(val)
            {
                this._direction = val;
                return this._direction;
            }
        },

        /**
         * Indicates whether or not an area is filled in a combo chart.
         * 
         * @attribute showAreaFill
         * @type Boolean
         */
        showAreaFill: {},

        /**
         * Indicates whether to display markers in a combo chart.
         *
         * @attribute showMarkers
         * @type Boolean
         */
        showMarkers:{},

        /**
         * Indicates whether to display lines in a combo chart.
         *
         * @attribute showLines
         * @type Boolean
         */
        showLines:{},

        /**
         * Indicates the key value used to identify a category axis in the `axes` hash. If
         * not specified, the categoryKey attribute value will be used.
         * 
         * @attribute categoryAxisName
         * @type String
         */
        categoryAxisName: {
        },

        /**
         * Indicates the key value used to identify a the series axis when an axis not generated.
         *
         * @attribute valueAxisName
         * @type String
         */
        valueAxisName: {
            value: "values"
        },

        /**
         * Reference to the horizontalGridlines for the chart.
         *
         * @attribute horizontalGridlines
         * @type Gridlines
         */
        horizontalGridlines: {
            getter: function()
            {
                var graph = this.get("graph");
                if(graph)
                {
                    return graph.get("horizontalGridlines");
                }
                return this._horizontalGridlines;
            },
            setter: function(val)
            {
                var graph = this.get("graph");
                if(val && !Y_Lang.isObject(val))
                {
                    val = {};
                }
                if(graph)
                {
                    graph.set("horizontalGridlines", val);
                }
                else
                {
                    this._horizontalGridlines = val;
                }
            }
        },

        /**
         * Reference to the verticalGridlines for the chart.
         *
         * @attribute verticalGridlines
         * @type Gridlines
         */
        verticalGridlines: {
            getter: function()
            {
                var graph = this.get("graph");
                if(graph)
                {
                    return graph.get("verticalGridlines");
                }
                return this._verticalGridlines;
            },
            setter: function(val)
            {
                var graph = this.get("graph");
                if(val && !Y_Lang.isObject(val))
                {
                    val = {};
                }
                if(graph)
                {
                    graph.set("verticalGridlines", val);
                }
                else
                {
                    this._verticalGridlines = val;
                }
            }
        },
        
        /**
         * Type of chart when there is no series collection specified.
         *
         * @attribute type
         * @type String 
         */
        type: {
            getter: function()
            {
                if(this.get("stacked"))
                {
                    return "stacked" + this._type;
                }
                return this._type;
            },

            setter: function(val)
            {
                if(this._type == "bar")
                {
                    if(val != "bar")
                    {
                        this.set("direction", "horizontal");
                    }
                }
                else
                {
                    if(val == "bar")
                    {
                        this.set("direction", "vertical");
                    }
                }
                this._type = val;
                return this._type;
            }
        },
        
        /**
         * Reference to the category axis used by the chart.
         *
         * @attribute categoryAxis
         * @type Axis
         */
        categoryAxis:{}
    }
});
/**
 * The PieChart class creates a pie chart
 *
 * @module charts
 * @submodule charts-base
 * @class PieChart
 * @extends ChartBase
 * @constructor
 */
Y.PieChart = Y.Base.create("pieChart", Y.Widget, [Y.ChartBase], {
    /**
     * Calculates and returns a `seriesCollection`.
     *
     * @method _getSeriesCollection
     * @return Array
     * @private
     */
    _getSeriesCollection: function()
    {
        if(this._seriesCollection)
        {
            return this._seriesCollection;
        }
        var axes = this.get("axes"),
            sc = [], 
            seriesKeys,
            i = 0,
            l,
            type = this.get("type"),
            key,
            catAxis = "categoryAxis",
            catKey = "categoryKey",
            valAxis = "valueAxis",
            seriesKey = "valueKey";
        if(axes)
        {
            seriesKeys = axes.values.get("keyCollection");
            key = axes.category.get("keyCollection")[0];
            l = seriesKeys.length;
            for(; i < l; ++i)
            {
                sc[i] = {type:type};
                sc[i][catAxis] = "category";
                sc[i][valAxis] = "values";
                sc[i][catKey] = key;
                sc[i][seriesKey] = seriesKeys[i];
            }
        }
        this._seriesCollection = sc;
        return sc;
    },

    /**
     * Creates `Axis` instances.
     *
     * @method _parseAxes
     * @param {Object} val Object containing `Axis` instances or objects in which to construct `Axis` instances.
     * @return Object
     * @private
     */
    _parseAxes: function(hash)
    {
        if(!this._axes)
        {
            this._axes = {};
        }
        var i, pos, axis, dh, config, axisClass,
            type = this.get("type"),
            w = this.get("width"),
            h = this.get("height"),
            node = Y.Node.one(this._parentNode);
        if(!w)
        {
            this.set("width", node.get("offsetWidth"));
            w = this.get("width");
        }
        if(!h)
        {
            this.set("height", node.get("offsetHeight"));
            h = this.get("height");
        }
        for(i in hash)
        {
            if(hash.hasOwnProperty(i))
            {
                dh = hash[i];
                pos = type == "pie" ? "none" : dh.position;
                axisClass = this._getAxisClass(dh.type);
                config = {dataProvider:this.get("dataProvider")};
                if(dh.hasOwnProperty("roundingUnit"))
                {
                    config.roundingUnit = dh.roundingUnit;
                }
                config.keys = dh.keys;
                config.width = w;
                config.height = h;
                config.position = pos;
                config.styles = dh.styles;
                axis = new axisClass(config);
                axis.on("axisRendered", Y.bind(this._itemRendered, this));
                this._axes[i] = axis;
            }
        }
    },

    /**
     * Adds axes to the chart.
     *
     * @method _addAxes
     * @private
     */
    _addAxes: function()
    {
        var axes = this.get("axes"),
            i, 
            axis, 
            p;
        if(!axes)
        {
            this.set("axes", this._getDefaultAxes());
            axes = this.get("axes");
        }
        if(!this._axesCollection)
        {   
            this._axesCollection = [];
        }
        for(i in axes)
        {
            if(axes.hasOwnProperty(i))
            {
                axis = axes[i];
                p = axis.get("position");
                if(!this.get(p + "AxesCollection"))
                {
                    this.set(p + "AxesCollection", [axis]);
                }
                else
                {
                    this.get(p + "AxesCollection").push(axis);
                }
                this._axesCollection.push(axis);
            }
        }
    },

    /**
     * Renders the Graph.
     *
     * @method _addSeries
     * @private
     */
    _addSeries: function()
    {
        var graph = this.get("graph"),
            seriesCollection = this.get("seriesCollection");
        this._parseSeriesAxes(seriesCollection);
        graph.set("showBackground", false);
        graph.set("width", this.get("width"));
        graph.set("height", this.get("height"));
        graph.set("seriesCollection", seriesCollection);
        this._seriesCollection = graph.get("seriesCollection");
        graph.render(this.get("contentBox"));
    },

    /**
     * Parse and sets the axes for the chart.
     *
     * @method _parseSeriesAxes
     * @param {Array} c A collection `PieSeries` instance.
     * @private
     */
    _parseSeriesAxes: function(c)
    {
        var i = 0, 
            len = c.length, 
            s,
            axes = this.get("axes"),
            axis;
        for(; i < len; ++i)
        {
            s = c[i];
            if(s)
            {
                //If series is an actual series instance, 
                //replace axes attribute string ids with axes
                if(s instanceof Y.PieSeries)
                {
                    axis = s.get("categoryAxis");
                    if(axis && !(axis instanceof Y.Axis))
                    {
                        s.set("categoryAxis", axes[axis]);
                    }
                    axis = s.get("valueAxis");
                    if(axis && !(axis instanceof Y.Axis))
                    {
                        s.set("valueAxis", axes[axis]);
                    }
                    continue;
                }
                s.categoryAxis = axes.category;
                s.valueAxis = axes.values;
                if(!s.type)
                {
                    s.type = this.get("type");
                }
            }
        }
    },

    /**
     * Generates and returns a key-indexed object containing `Axis` instances or objects used to create `Axis` instances.
     *
     * @method _getDefaultAxes
     * @return Object
     * @private
     */
    _getDefaultAxes: function()
    {
        var catKey = this.get("categoryKey"),
            seriesKeys = this.get("seriesKeys").concat(), 
            seriesAxis = "numeric";
        return {
            values:{
                keys:seriesKeys,
                type:seriesAxis
            },
            category:{
                keys:[catKey],
                type:this.get("categoryType")
            }
        };
    },
        
    /**
     * Returns an object literal containing a categoryItem and a valueItem for a given series index.
     *
     * @method getSeriesItem
     * @param series Reference to a series.
     * @param index Index of the specified item within a series.
     * @return Object
     */
    getSeriesItems: function(series, index)
    {
        var categoryItem = {
                axis: series.get("categoryAxis"),
                key: series.get("categoryKey"),
                displayName: series.get("categoryDisplayName")
            },
            valueItem = {
                axis: series.get("valueAxis"),
                key: series.get("valueKey"),
                displayName: series.get("valueDisplayName")
            };
        categoryItem.value = categoryItem.axis.getKeyValueAt(categoryItem.key, index);
        valueItem.value = valueItem.axis.getKeyValueAt(valueItem.key, index);
        return {category:categoryItem, value:valueItem};
    },

    /**
     * Handler for sizeChanged event.
     *
     * @method _sizeChanged
     * @param {Object} e Event object.
     * @private
     */
    _sizeChanged: function(e)
    {
        this._redraw();
    },

    /**
     * Redraws the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        var graph = this.get("graph"),
            w = this.get("width"),
            h = this.get("height"),
            dimension;
        if(graph)
        {
            dimension = Math.min(w, h);
            graph.set("width", dimension);
            graph.set("height", dimension);
        }
    },
    
    /**
     * Formats tooltip text for a pie chart.
     *
     * @method _tooltipLabelFunction
     * @param {Object} categoryItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>
     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key of the category.</dd>
     *      <dt>value</dt><dd>The value of the category</dd>
     *  </dl>
     * @param {Object} valueItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd> 
     *  </dl>
     * @param {Number} itemIndex The index of the item within the series.
     * @param {CartesianSeries} series The `PieSeries` instance of the item.
     * @param {Number} seriesIndex The index of the series in the `seriesCollection`.
     * @return {HTML}
     * @private
     */
    _tooltipLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)
    {
        var msg = DOCUMENT.createElement("div"),
            total = series.getTotalValues(),
            pct = Math.round((valueItem.value / total) * 10000)/100;
        msg.appendChild(DOCUMENT.createTextNode(categoryItem.displayName +
        ": " + categoryItem.axis.get("labelFunction").apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]))); 
        msg.appendChild(DOCUMENT.createElement("br"));
        msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName + 
        ": " + valueItem.axis.get("labelFunction").apply(this, [valueItem.value, valueItem.axis.get("labelFormat")])));
        msg.appendChild(DOCUMENT.createElement("br"));
        msg.appendChild(DOCUMENT.createTextNode(pct + "%")); 
        return msg; 
    },

    /**
     * Returns the appropriate message based on the key press.
     *
     * @method _getAriaMessage
     * @param {Number} key The keycode that was pressed.
     * @return String
     */
    _getAriaMessage: function(key)
    {
        var msg = "",
            categoryItem,
            items,
            series,
            valueItem,
            seriesIndex = 0,
            itemIndex = this._itemIndex,
            seriesCollection = this.get("seriesCollection"),
            len,
            total,
            pct,
            markers;
        series = this.getSeries(parseInt(seriesIndex, 10));
        markers = series.get("markers");
        len = markers && markers.length ? markers.length : 0;
        if(key === 37)
        {
            itemIndex = itemIndex > 0 ? itemIndex - 1 : len - 1;
        }
        else if(key === 39)
        {
            itemIndex = itemIndex >= len - 1 ? 0 : itemIndex + 1;
        }
        this._itemIndex = itemIndex;
        items = this.getSeriesItems(series, itemIndex);
        categoryItem = items.category;
        valueItem = items.value;
        total = series.getTotalValues();
        pct = Math.round((valueItem.value / total) * 10000)/100;
        if(categoryItem && valueItem)
        {
            msg += categoryItem.displayName + ": " + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]) + ", ";
            msg += valueItem.displayName + ": " + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]) + ", "; 
            msg += "Percent of total " + valueItem.displayName + ": " + pct + "%,"; 
        }
        else
        {
            msg += "No data available,";
        }
        msg += (itemIndex + 1) + " of " + len + ". ";
        return msg;
    }
}, {
    ATTRS: {
        /**
         * Sets the aria description for the chart.
         *
         * @attribute ariaDescription
         * @type String
         */
        ariaDescription: {
            value: "Use the left and right keys to navigate through items.",

            setter: function(val)
            {
                if(this._description)
                {
                    this._description.setContent("");
                    this._description.appendChild(DOCUMENT.createTextNode(val));
                }
                return val;
            }
        },
        
        /**
         * Axes to appear in the chart. 
         *
         * @attribute axes
         * @type Object
         */
        axes: {
            getter: function()
            {
                return this._axes;
            },

            setter: function(val)
            {
                this._parseAxes(val);
            }
        },

        /**
         * Collection of series to appear on the chart. This can be an array of Series instances or object literals
         * used to describe a Series instance.
         *
         * @attribute seriesCollection
         * @type Array
         */
        seriesCollection: {
            getter: function()
            {
                return this._getSeriesCollection();
            },
            
            setter: function(val)
            {
                return this._setSeriesCollection(val);
            }
        },
        
        /**
         * Type of chart when there is no series collection specified.
         *
         * @attribute type
         * @type String 
         */
        type: {
            value: "pie"
        }
    }
});


}, '3.7.3', {"requires": ["dom", "datatype-number", "datatype-date", "event-custom", "event-mouseenter", "event-touch", "widget", "widget-position", "widget-stack", "graphics"]});

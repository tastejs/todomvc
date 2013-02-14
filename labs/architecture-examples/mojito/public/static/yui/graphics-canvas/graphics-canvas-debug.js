/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('graphics-canvas', function (Y, NAME) {

var IMPLEMENTATION = "canvas",
    SHAPE = "shape",
	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,
    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\.][0-9]*/g,
    DOCUMENT = Y.config.doc,
    Y_LANG = Y.Lang,
    AttributeLite = Y.AttributeLite,
	CanvasShape,
	CanvasPath,
	CanvasRect,
    CanvasEllipse,
	CanvasCircle,
    CanvasPieSlice,
    Y_DOM = Y.DOM,
    Y_Color = Y.Color,
    PARSE_INT = parseInt,
    PARSE_FLOAT = parseFloat,
    IS_NUMBER = Y_LANG.isNumber,
    RE = RegExp,
    TORGB = Y_Color.toRGB,
    TOHEX = Y_Color.toHex,
    _getClassName = Y.ClassNameManager.getClassName;

/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Drawing.html">`Drawing`</a> class. 
 * `CanvasDrawing` is not intended to be used directly. Instead, use the <a href="Drawing.html">`Drawing`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Drawing.html">`Drawing`</a> 
 * class will point to the `CanvasDrawing` class.
 *
 * @module graphics
 * @class CanvasDrawing
 * @constructor
 */
function CanvasDrawing()
{
}

CanvasDrawing.prototype = {
    /**
     * Maps path to methods
     *
     * @property _pathSymbolToMethod
     * @type Object
     * @private
     */
    _pathSymbolToMethod: {
        M: "moveTo",
        m: "relativeMoveTo",
        L: "lineTo",
        l: "relativeLineTo",
        C: "curveTo",
        c: "relativeCurveTo",
        Q: "quadraticCurveTo",
        q: "relativeQuadraticCurveTo",
        z: "closePath",
        Z: "closePath"
    },

    /**
     * Current x position of the drawing.
     *
     * @property _currentX
     * @type Number
     * @private
     */
    _currentX: 0,

    /**
     * Current y position of the drqwing.
     *
     * @property _currentY
     * @type Number
     * @private
     */
    _currentY: 0,
    
    /**
     * Parses hex color string and alpha value to rgba
     *
     * @method _toRGBA
     * @param {Object} val Color value to parse. Can be hex string, rgb or name.
     * @param {Number} alpha Numeric value between 0 and 1 representing the alpha level.
     * @private
     */
    _toRGBA: function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (!Y_Color.re_RGB.test(val)) {
            val = TOHEX(val);
        }

        if(Y_Color.re_hex.exec(val)) {
            val = 'rgba(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    /**
     * Converts color to rgb format
     *
     * @method _toRGB
     * @param val Color value to convert.
     * @private 
     */
    _toRGB: function(val) {
        return TORGB(val);
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     * @private
     */
	setSize: function(w, h) {
        if(this.get("autoSize"))
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.style.width = w + "px";
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
                this.node.setAttribute("height", h);
            }
        }
    },
    
	/**
     * Tracks coordinates. Used to calculate the start point of dashed lines. 
     *
     * @method _updateCoords
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
	 * @private
	 */
    _updateCoords: function(x, y)
    {
        this._xcoords.push(x);
        this._ycoords.push(y);
        this._currentX = x;
        this._currentY = y;
    },

	/**
     * Clears the coordinate arrays. Called at the end of a drawing operation.  
	 * 
     * @method _clearAndUpdateCoords
     * @private
	 */
    _clearAndUpdateCoords: function()
    {
        var x = this._xcoords.pop() || 0,
            y = this._ycoords.pop() || 0;
        this._updateCoords(x, y);
    },

	/**
     * Moves the shape's dom node.
     *
     * @method _updateNodePosition
	 * @private
	 */
    _updateNodePosition: function()
    {
        var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"); 
        node.style.position = "absolute";
        node.style.left = (x + this._left) + "px";
        node.style.top = (y + this._top) + "px";
    },
    
    /**
     * Queues up a method to be executed when a shape redraws.
     *
     * @method _updateDrawingQueue
     * @param {Array} val An array containing data that can be parsed into a method and arguments. The value at zero-index of the array is a string reference of
     * the drawing method that will be called. All subsequent indices are argument for that method. For example, `lineTo(10, 100)` would be structured as:
     * `["lineTo", 10, 100]`.
     * @private
     */
    _updateDrawingQueue: function(val)
    {
        this._methods.push(val);
    },
    
    /**
     * Draws a line segment from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function()
    {
        this._lineTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a line segment from the current drawing position to the relative x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    relativeLineTo: function()
    {
        this._lineTo.apply(this, [Y.Array(arguments), true]);
    },

    /**
     * Implements lineTo methods.
     *
     * @method _lineTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _lineTo: function(args, relative) 
    {
        var point1 = args[0], 
            i, 
            len,
            x,
            y,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        if(!this._lineToMethods)
        {
            this._lineToMethods = [];
        }
        len = args.length - 1;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            for (i = 0; i < len; i = i + 2) {
                x = parseFloat(args[i]);
                y = parseFloat(args[i + 1]);
                x = x + relativeX;
                y = y + relativeY;
                this._updateDrawingQueue(["lineTo", x, y]);
                this._trackSize(x - wt, y - wt);
                this._trackSize(x + wt, y + wt);
                this._updateCoords(x, y);
            }
        }
        else
        {
            for (i = 0; i < len; i = i + 1) 
            {
                x = parseFloat(args[i][0]);
                y = parseFloat(args[i][1]);
                this._updateDrawingQueue(["lineTo", x, y]);
                this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];
                this._trackSize(x - wt, y - wt);
                this._trackSize(x + wt, y + wt);
                this._updateCoords(x, y);
            }
        }
        this._drawingComplete = false;
        return this;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function()
    {
        this._moveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Moves the current drawing position relative to specified x and y coordinates.
     *
     * @method relativeMoveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeMoveTo: function()
    {
        this._moveTo.apply(this, [Y.Array(arguments), true]);
    },

    /**
     * Implements moveTo methods.
     *
     * @method _moveTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _moveTo: function(args, relative) {
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0,
            x = parseFloat(args[0]) + relativeX,
            y = parseFloat(args[1]) + relativeY;
        this._updateDrawingQueue(["moveTo", x, y]);
        this._trackSize(x - wt, y - wt);
        this._trackSize(x + wt, y + wt);
        this._updateCoords(x, y);
        this._drawingComplete = false;
        return this;
    },
    
    /**
     * Draws a bezier curve.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    curveTo: function() {
        this._curveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a bezier curve relative to the current coordinates.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeCurveTo: function() {
        this._curveTo.apply(this, [Y.Array(arguments), true]);
    },
    
    /**
     * Implements curveTo methods.
     *
     * @method _curveTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _curveTo: function(args, relative) {
        var w,
            h,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            x,
            y,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        len = args.length - 5;
        for(i = 0; i < len; i = i + 6)
        {
            cp1x = parseFloat(args[i]) + relativeX;
            cp1y = parseFloat(args[i + 1]) + relativeY;
            cp2x = parseFloat(args[i + 2]) + relativeX;
            cp2y = parseFloat(args[i + 3]) + relativeY;
            x = parseFloat(args[i + 4]) + relativeX;
            y = parseFloat(args[i + 5]) + relativeY;
            this._updateDrawingQueue(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
            this._drawingComplete = false;
            right = Math.max(x, Math.max(cp1x, cp2x));
            bottom = Math.max(y, Math.max(cp1y, cp2y));
            left = Math.min(x, Math.min(cp1x, cp2x));
            top = Math.min(y, Math.min(cp1y, cp2y));
            w = Math.abs(right - left);
            h = Math.abs(bottom - top);
            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
            this._setCurveBoundingBox(pts, w, h);
            this._currentX = x;
            this._currentY = y;
        }
    },

    /**
     * Draws a quadratic bezier curve.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    quadraticCurveTo: function() {
        this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a quadratic bezier curve relative to the current position.
     *
     * @method relativeQuadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeQuadraticCurveTo: function() {
        this._quadraticCurveTo.apply(this, [Y.Array(arguments), true]);
    },

    /**
     * Implements quadraticCurveTo methods.
     *
     * @method _quadraticCurveTo
     * @param {Array} args The arguments to be used.
     * @param {Boolean} relative Indicates whether or not to use relative coordinates.
     * @private
     */
    _quadraticCurveTo: function(args, relative) {
        var cpx, 
            cpy, 
            x, 
            y,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len = args.length - 3,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        for(i = 0; i < len; i = i + 4)
        {
            cpx = parseFloat(args[i]) + relativeX;
            cpy = parseFloat(args[i + 1]) + relativeY;
            x = parseFloat(args[i + 2]) + relativeX;
            y = parseFloat(args[i + 3]) + relativeY;
            this._drawingComplete = false;
            right = Math.max(x, cpx);
            bottom = Math.max(y, cpy);
            left = Math.min(x, cpx);
            top = Math.min(y, cpy);
            w = Math.abs(right - left);
            h = Math.abs(bottom - top);
            pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; 
            this._setCurveBoundingBox(pts, w, h);
            this._updateDrawingQueue(["quadraticCurveTo", cpx, cpy, x, y]);
            this._updateCoords(x, y);
        }
        return this;
    },

    /**
     * Draws a circle. Used internally by `CanvasCircle` class.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @protected
     */
	drawCircle: function(x, y, radius) {
        var startAngle = 0,
            endAngle = 2 * Math.PI,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            circum = radius * 2;
            circum += wt;
        this._drawingComplete = false;
        this._trackSize(x + circum, y + circum);
        this._trackSize(x - wt, y - wt);
        this._updateCoords(x, y);
        this._updateDrawingQueue(["arc", x + radius, y + radius, radius, startAngle, endAngle, false]);
        return this;
    },

    /**
     * Draws a diamond.     
     * 
     * @method drawDiamond
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} width width
     * @param {Number} height height
     * @protected
     */
    drawDiamond: function(x, y, width, height)
    {
        var midWidth = width * 0.5,
            midHeight = height * 0.5;
        this.moveTo(x + midWidth, y);
        this.lineTo(x + width, y + midHeight);
        this.lineTo(x + midWidth, y + height);
        this.lineTo(x, y + midHeight);
        this.lineTo(x + midWidth, y);
        return this;
    },

    /**
     * Draws an ellipse. Used internally by `CanvasEllipse` class.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @protected
     */
	drawEllipse: function(x, y, w, h) {
        var l = 8,
            theta = -(45/180) * Math.PI,
            angle = 0,
            angleMid,
            radius = w/2,
            yRadius = h/2,
            i,
            centerX = x + radius,
            centerY = y + yRadius,
            ax, ay, bx, by, cx, cy,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;

        ax = centerX + Math.cos(0) * radius;
        ay = centerY + Math.sin(0) * yRadius;
        this.moveTo(ax, ay);
        for(i = 0; i < l; i++)
        {
            angle += theta;
            angleMid = angle - (theta / 2);
            bx = centerX + Math.cos(angle) * radius;
            by = centerY + Math.sin(angle) * yRadius;
            cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
            cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
        }
        this._trackSize(x + w + wt, y + h + wt);
        this._trackSize(x - wt, y - wt);
        this._updateCoords(x, y);
        return this;
    },

    /**
     * Draws a rectangle.
     *
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
    drawRect: function(x, y, w, h) {
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        this._drawingComplete = false;
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        return this;
    },

    /**
     * Draws a rectangle with rounded corners.
     * 
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} ew width of the ellipse used to draw the rounded corners
     * @param {Number} eh height of the ellipse used to draw the rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0;
        this._drawingComplete = false;
        this.moveTo( x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        return this;
    },
    
    /**
     * Draws a wedge.
     *
     * @method drawWedge
     * @param {Number} x x-coordinate of the wedge's center point
     * @param {Number} y y-coordinate of the wedge's center point
     * @param {Number} startAngle starting angle in degrees
     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.
     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param {Number} yRadius [optional] y radius for wedge.
     * @private
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        var wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            segs,
            segAngle,
            theta,
            angle,
            angleMid,
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            i = 0;
        yRadius = yRadius || radius;

        this._drawingComplete = false;
        // move to x,y position
        this._updateDrawingQueue(["moveTo", x, y]);
        
        yRadius = yRadius || radius;
        
        // limit sweep to reasonable numbers
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        angle = (startAngle / 180) * Math.PI;
        
        // draw the curve in segments no larger than 45 degrees.
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            this.lineTo(ax, ay);
            // Loop for drawing curve segments
            for(i = 0; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
            }
            // close the wedge by drawing a line to the center
            this._updateDrawingQueue(["lineTo", x, y]);
        }
        this._trackSize(-wt , -wt);
        this._trackSize((radius * 2) + wt, (radius * 2) + wt);
        return this;
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        this._closePath();
        return this;
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        this._updateDrawingQueue(["closePath"]);
        this._updateDrawingQueue(["beginPath"]);
    },

	/**
	 * Clears the graphics object.
	 *
	 * @method clear
	 */
    
    /**
     * Returns a linear gradient fill
     *
     * @method _getLinearGradient
     * @return CanvasGradient
     * @private
     */
    _getLinearGradient: function() {
        var isNumber = Y.Lang.isNumber,
            fill = this.get("fill"),
            stops = fill.stops,
            opacity,
            color,
            stop,
            i,
            len = stops.length,
            gradient,
            x = 0,
            y = 0,
            w = this.get("width"),
            h = this.get("height"),
            r = fill.rotation || 0,
            x1, x2, y1, y2,
            cx = x + w/2,
            cy = y + h/2,
            offset,
            radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));
        if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            if(r < 180)
            {
                y1 = y;
                y2 = y + h;
            }
            else
            {
                y1 = y + h;
                y2 = y;
            }
            x1 = cx - ((cy - y1)/tanRadians);
            x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            if(r > 90 && r < 270)
            {
                x1 = x + w;
                x2 = x;
            }
            else
            {
                x1 = x;
                x2 = x + w;
            }
            y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        gradient = this._context.createLinearGradient(x1, y1, x2, y2);
        for(i = 0; i < len; ++i)
        {
            stop = stops[i];
            opacity = stop.opacity;
            color = stop.color;
            offset = stop.offset;
            if(isNumber(opacity))
            {
                opacity = Math.max(0, Math.min(1, opacity));
                color = this._toRGBA(color, opacity);
            }
            else
            {
                color = TORGB(color);
            }
            offset = stop.offset || i/(len - 1);
            gradient.addColorStop(offset, color);
        }
        return gradient;
    },

    /**
     * Returns a radial gradient fill
     *
     * @method _getRadialGradient
     * @return CanvasGradient
     * @private
     */
    _getRadialGradient: function() {
        var isNumber = Y.Lang.isNumber,
            fill = this.get("fill"),
            r = fill.r,
            fx = fill.fx,
            fy = fill.fy,
            stops = fill.stops,
            opacity,
            color,
            stop,
            i,
            len = stops.length,
            gradient,
            x = 0,
            y = 0,
            w = this.get("width"),
            h = this.get("height"),
            x1, x2, y1, y2, r2, 
            xc, yc, xn, yn, d, 
            offset,
            ratio,
            stopMultiplier;
        xc = x + w/2;
        yc = y + h/2;
        x1 = w * fx;
        y1 = h * fy;
        x2 = x + w/2;
        y2 = y + h/2;
        r2 = w * r;
        d = Math.sqrt( Math.pow(Math.abs(xc - x1), 2) + Math.pow(Math.abs(yc - y1), 2) );
        if(d >= r2)
        {
            ratio = d/r2;
            //hack. gradient won't show if it is exactly on the edge of the arc
            if(ratio === 1)
            {
                ratio = 1.01;
            }
            xn = (x1 - xc)/ratio;
            yn = (y1 - yc)/ratio;
            xn = xn > 0 ? Math.floor(xn) : Math.ceil(xn);
            yn = yn > 0 ? Math.floor(yn) : Math.ceil(yn);
            x1 = xc + xn;
            y1 = yc + yn;
        }
        
        //If the gradient radius is greater than the circle's, adjusting the radius stretches the gradient properly.
        //If the gradient radius is less than the circle's, adjusting the radius of the gradient will not work. 
        //Instead, adjust the color stops to reflect the smaller radius.
        if(r >= 0.5)
        {
            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, r * w);
            stopMultiplier = 1;
        }
        else
        {
            gradient = this._context.createRadialGradient(x1, y1, r, x2, y2, w/2);
            stopMultiplier = r * 2;
        }
        for(i = 0; i < len; ++i)
        {
            stop = stops[i];
            opacity = stop.opacity;
            color = stop.color;
            offset = stop.offset;
            if(isNumber(opacity))
            {
                opacity = Math.max(0, Math.min(1, opacity));
                color = this._toRGBA(color, opacity);
            }
            else
            {
                color = TORGB(color);
            }
            offset = stop.offset || i/(len - 1);
            offset *= stopMultiplier;
            if(offset <= 1)
            {
                gradient.addColorStop(offset, color);
            }
        }
        return gradient;
    },


    /**
     * Clears all values
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        this._methods = [];
        this._lineToMethods = [];
        this._xcoords = [0];
		this._ycoords = [0];
		this._width = 0;
        this._height = 0;
        this._left = 0;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
        this._currentX = 0;
        this._currentY = 0;
    },
   
    /**
     * Indicates a drawing has completed.
     *
     * @property _drawingComplete
     * @type Boolean
     * @private
     */
    _drawingComplete: false,

    /**
     * Creates canvas element
     *
     * @method _createGraphic
     * @return HTMLCanvasElement
     * @private
     */
    _createGraphic: function(config) {
        var graphic = Y.config.doc.createElement('canvas');
        return graphic;
    },
    
    /**
     * Returns the points on a curve
     *
     * @method getBezierData
     * @param Array points Array containing the begin, end and control points of a curve.
     * @param Number t The value for incrementing the next set of points.
     * @return Array
     * @private
     */
    getBezierData: function(points, t) {  
        var n = points.length,
            tmp = [],
            i,
            j;

        for (i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        for (j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        return [ tmp[0][0], tmp[0][1] ]; 
    },
  
    /**
     * Calculates the bounding box for a curve
     *
     * @method _setCurveBoundingBox
     * @param Array pts Array containing points for start, end and control points of a curve.
     * @param Number w Width used to calculate the number of points to describe the curve.
     * @param Number h Height used to calculate the number of points to describe the curve.
     * @private
     */
    _setCurveBoundingBox: function(pts, w, h)
    {
        var i = 0,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            wt = this._stroke && this._strokeWeight ? this._strokeWeight : 0,
            xy;
        for(i = 0; i < len; ++i)
        {
            xy = this.getBezierData(pts, t * i);
            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        left = Math.round(left * 10)/10;
        right = Math.round(right * 10)/10;
        top = Math.round(top * 10)/10;
        bottom = Math.round(bottom * 10)/10;
        this._trackSize(right + wt, bottom + wt);
        this._trackSize(left - wt, top - wt);
    },

    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._right) {
            this._right = w;
        }
        if(w < this._left)
        {
            this._left = w;    
        }
        if (h < this._top)
        {
            this._top = h;
        }
        if (h > this._bottom) 
        {
            this._bottom = h;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
    }
};
Y.CanvasDrawing = CanvasDrawing;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Shape.html">`Shape`</a> class. 
 * `CanvasShape` is not intended to be used directly. Instead, use the <a href="Shape.html">`Shape`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Shape.html">`Shape`</a> 
 * class will point to the `CanvasShape` class.
 *
 * @module graphics
 * @class CanvasShape
 * @constructor
 */
CanvasShape = function(cfg)
{
    this._transforms = [];
    this.matrix = new Y.Matrix();
    CanvasShape.superclass.constructor.apply(this, arguments);
};

CanvasShape.NAME = "shape";

Y.extend(CanvasShape, Y.GraphicBase, Y.mix({
    /**
     * Init method, invoked during construction.
     * Calls `initializer` method.
     *
     * @method init
     * @protected
     */
    init: function()
	{
		this.initializer.apply(this, arguments);
	},

	/**
	 * Initializes the shape
	 *
	 * @private
	 * @method _initialize
	 */
	initializer: function(cfg)
	{
		var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
        host._initProps();
		host.createNode(); 
		host._xcoords = [0];
		host._ycoords = [0];
        if(graphic)
        {
            this._setGraphic(graphic);
        }
        if(data)
        {
            host._parsePathData(data);
        }
		host._updateHandler();
	},
 
    /**
     * Set the Graphic instance for the shape.
     *
     * @method _setGraphic
     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned
     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.
     * @private
     */
    _setGraphic: function(render)
    {
        var graphic;
        if(render instanceof Y.CanvasGraphic)
        {
		    this._graphic = render;
        }
        else
        {
            render = Y.one(render);
            graphic = new Y.CanvasGraphic({
                render: render
            });
            graphic._appendShape(this);
            this._graphic = graphic;
        }
    },
   
	/**
	 * Add a class name to each node.
	 *
	 * @method addClass
	 * @param {String} className the class name to add to the node's class attribute 
	 */
	addClass: function(className)
	{
		var node = Y.one(this.get("node"));
		node.addClass(className);
	},
	
	/**
	 * Removes a class name from each node.
	 *
	 * @method removeClass
	 * @param {String} className the class name to remove from the node's class attribute
	 */
	removeClass: function(className)
	{
		var node = Y.one(this.get("node"));
		node.removeClass(className);
	},

	/**
	 * Gets the current position of the node in page coordinates.
	 *
	 * @method getXY
	 * @return Array The XY position of the shape.
	 */
	getXY: function()
	{
		var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = this.get("x"),
			y = this.get("y");
		return [parentXY[0] + x, parentXY[1] + y];
	},

	/**
	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.
	 *
	 * @method setXY
	 * @param {Array} Contains X & Y values for new position (coordinates are page-based)
	 */
	setXY: function(xy)
	{
		var graphic = this.get("graphic"),
			parentXY = graphic.getXY(),
			x = xy[0] - parentXY[0],
			y = xy[1] - parentXY[1];
		this._set("x", x);
		this._set("y", y);
		this._updateNodePosition(x, y);
	},

	/**
	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. 
	 *
	 * @method contains
	 * @param {CanvasShape | HTMLElement} needle The possible node or descendent
	 * @return Boolean Whether or not this shape is the needle or its ancestor.
	 */
	contains: function(needle)
	{
		return needle === Y.one(this.node);
	},

	/**
	 * Test if the supplied node matches the supplied selector.
	 *
	 * @method test
	 * @param {String} selector The CSS selector to test against.
	 * @return Boolean Wheter or not the shape matches the selector.
	 */
	test: function(selector)
	{
		return Y.one(this.get("node")).test(selector);
		//return Y.Selector.test(this.node, selector);
	},

	/**
	 * Compares nodes to determine if they match.
	 * Node instances can be compared to each other and/or HTMLElements.
	 * @method compareTo
	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.
	 * @return {Boolean} True if the nodes match, false if they do not.
	 */
	compareTo: function(refNode) {
		var node = this.node;
		return node === refNode;
	},

	/**
	 * Value function for fill attribute
	 *
	 * @method _getDefaultFill
	 * @return Object
	 * @private
	 */
	_getDefaultFill: function() {
		return {
			type: "solid",
			opacity: 1,
			cx: 0.5,
			cy: 0.5,
			fx: 0.5,
			fy: 0.5,
			r: 0.5
		};
	},

	/**
	 * Value function for stroke attribute
	 *
	 * @method _getDefaultStroke
	 * @return Object
	 * @private
	 */
	_getDefaultStroke: function() 
	{
		return {
			weight: 1,
			dashstyle: "none",
			color: "#000",
			opacity: 1.0
		};
	},

	/**
	 * Left edge of the path
	 *
     * @property _left
     * @type Number
	 * @private
	 */
	_left: 0,

	/**
	 * Right edge of the path
	 *
     * @property _right
     * @type Number
	 * @private
	 */
	_right: 0,
	
	/**
	 * Top edge of the path
	 *
     * @property _top
     * @type Number
	 * @private
	 */
	_top: 0, 
	
	/**
	 * Bottom edge of the path
	 *
     * @property _bottom
     * @type Number
	 * @private
	 */
	_bottom: 0,

	/**
	 * Creates the dom node for the shape.
	 *
     * @method createNode
	 * @return HTMLElement
	 * @private
	 */
	createNode: function()
	{
		var host = this,
            node = Y.config.doc.createElement('canvas'),
			id = host.get("id"),
            concat = host._camelCaseConcat,
            name = host.name;
		host._context = node.getContext('2d');
		node.setAttribute("overflow", "visible");
        node.style.overflow = "visible";
        if(!host.get("visible"))
        {
            node.style.visibility = "hidden";
        }
		node.setAttribute("id", id);
		id = "#" + id;
	    host.node = node;
		host.addClass(_getClassName(SHAPE) + " " + _getClassName(concat(IMPLEMENTATION, SHAPE)) + " " + _getClassName(name) + " " + _getClassName(concat(IMPLEMENTATION, name))); 
	},
	
	/**
     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, 
     * return an event attached to the `node` element. If not, return the normal functionality.
     *
     * @method on
     * @param {String} type event type
     * @param {Object} callback function
	 * @private
	 */
	on: function(type, fn)
	{
		if(Y.Node.DOM_EVENTS[type])
		{
			return Y.one("#" +  this.get("id")).on(type, fn);
		}
		return Y.on.apply(this, arguments);
	},
	
	/**
	 * Adds a stroke to the shape node.
	 *
	 * @method _strokeChangeHandler
     * @param {Object} stroke Properties of the `stroke` attribute.
	 * @private
	 */
	_setStrokeProps: function(stroke)
	{
		var color,
			weight,
			opacity,
			linejoin,
			linecap,
			dashstyle;
	    if(stroke)
        {
            color = stroke.color;
            weight = PARSE_FLOAT(stroke.weight);
            opacity = PARSE_FLOAT(stroke.opacity);
            linejoin = stroke.linejoin || "round";
            linecap = stroke.linecap || "butt";
            dashstyle = stroke.dashstyle;
            this._miterlimit = null;
            this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;
            this._strokeWeight = weight;

            if (IS_NUMBER(weight) && weight > 0) 
            {
                this._stroke = 1;
            } 
            else 
            {
                this._stroke = 0;
            }
            if (IS_NUMBER(opacity)) {
                this._strokeStyle = this._toRGBA(color, opacity);
            }
            else
            {
                this._strokeStyle = color;
            }
            this._linecap = linecap;
            if(linejoin == "round" || linejoin == "bevel")
            {
                this._linejoin = linejoin;
            }
            else
            {
                linejoin = parseInt(linejoin, 10);
                if(IS_NUMBER(linejoin))
                {
                    this._miterlimit =  Math.max(linejoin, 1);
                    this._linejoin = "miter";
                }
            }
        }
        else
        {
            this._stroke = 0;
        }
	},

    /**
     * Sets the value of an attribute.
     *
     * @method set
     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can 
     * be passed in to set multiple attributes at once.
     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as 
     * the name param.
     */
	set: function() 
	{
		var host = this,
			val = arguments[0];
		AttributeLite.prototype.set.apply(host, arguments);
		if(host.initialized)
		{
			host._updateHandler();
		}
	},
	
	/**
	 * Adds a fill to the shape node.
	 *
	 * @method _setFillProps 
     * @param {Object} fill Properties of the `fill` attribute.
	 * @private
	 */
	_setFillProps: function(fill)
	{
		var isNumber = IS_NUMBER,
			color,
			opacity,
			type;
        if(fill)
        {
            color = fill.color;
            type = fill.type;
            if(type == "linear" || type == "radial")
            {
                this._fillType = type;
            }
            else if(color)
            {
                opacity = fill.opacity;
                if (isNumber(opacity)) 
                {
                    opacity = Math.max(0, Math.min(1, opacity));
                    color = this._toRGBA(color, opacity);
                } 
                else 
                {
                    color = TORGB(color);
                }

                this._fillColor = color;
                this._fillType = 'solid';
            }
            else
            {
                this._fillColor = null;
            }
        }
		else
		{
            this._fillType = null;
			this._fillColor = null;
		}
	},

	/**
	 * Specifies a 2d translation.
	 *
	 * @method translate
	 * @param {Number} x The value to transate on the x-axis.
	 * @param {Number} y The value to translate on the y-axis.
	 */
	translate: function(x, y)
	{
		this._translateX += x;
		this._translateY += y;
		this._addTransform("translate", arguments);
	},

	/**
	 * Translates the shape along the x-axis. When translating x and y coordinates,
	 * use the `translate` method.
	 *
	 * @method translateX
	 * @param {Number} x The value to translate.
	 */
	translateX: function(x)
    {
        this._translateX += x;
        this._addTransform("translateX", arguments);
    },

	/**
	 * Performs a translate on the y-coordinate. When translating x and y coordinates,
	 * use the `translate` method.
	 *
	 * @method translateY
	 * @param {Number} y The value to translate.
	 */
	translateY: function(y)
    {
        this._translateY += y;
        this._addTransform("translateY", arguments);
    },

    /**
     * Skews the shape around the x-axis and y-axis.
     *
     * @method skew
     * @param {Number} x The value to skew on the x-axis.
     * @param {Number} y The value to skew on the y-axis.
     */
    skew: function(x, y)
    {
        this._addTransform("skew", arguments);
    },

	/**
	 * Skews the shape around the x-axis.
	 *
	 * @method skewX
	 * @param {Number} x x-coordinate
	 */
	 skewX: function(x)
	 {
		this._addTransform("skewX", arguments);
	 },

	/**
	 * Skews the shape around the y-axis.
	 *
	 * @method skewY
	 * @param {Number} y y-coordinate
	 */
	 skewY: function(y)
	 {
		this._addTransform("skewY", arguments);
	 },

	/**
	 * Rotates the shape clockwise around it transformOrigin.
	 *
	 * @method rotate
	 * @param {Number} deg The degree of the rotation.
	 */
	 rotate: function(deg)
	 {
		this._rotation = deg;
		this._addTransform("rotate", arguments);
	 },

	/**
	 * Specifies a 2d scaling operation.
	 *
	 * @method scale
	 * @param {Number} val
	 */
	scale: function(x, y)
	{
		this._addTransform("scale", arguments);
	},
	
    /**
     * Storage for `rotation` atribute.
     *
     * @property _rotation
     * @type Number
	 * @private
	 */
	_rotation: 0,
    
    /**
     * Storage for the transform attribute.
     *
     * @property _transform
     * @type String
     * @private
     */
    _transform: "",

    /**
     * Adds a transform to the shape.
     *
     * @method _addTransform
     * @param {String} type The transform being applied.
     * @param {Array} args The arguments for the transform.
	 * @private
	 */
	_addTransform: function(type, args)
	{
        args = Y.Array(args);
        this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        args.unshift(type);
        this._transforms.push(args);
        if(this.initialized)
        {
            this._updateTransform();
        }
	},

	/**
     * Applies all transforms.
     *
     * @method _updateTransform
	 * @private
	 */
	_updateTransform: function()
	{
		var node = this.node,
			key,
			transform,
			transformOrigin = this.get("transformOrigin"),
            matrix = this.matrix,
            i,
            len = this._transforms.length;
        
        if(this._transforms && this._transforms.length > 0)
        {
            for(i = 0; i < len; ++i)
            {
                key = this._transforms[i].shift();
                if(key)
                {
                    matrix[key].apply(matrix, this._transforms[i]); 
                }
            }
            transform = matrix.toCSSText();
        }
        
        this._graphic.addToRedrawQueue(this);    
		transformOrigin = (100 * transformOrigin[0]) + "% " + (100 * transformOrigin[1]) + "%";
        Y_DOM.setStyle(node, "transformOrigin", transformOrigin);
        if(transform)
		{
            Y_DOM.setStyle(node, "transform", transform);
		}
        this._transforms = [];
	},

	/**
     * Updates `Shape` based on attribute changes.
     *
     * @method _updateHandler
	 * @private
	 */
	_updateHandler: function()
	{
		this._draw();
		this._updateTransform();
	},
	
	/**
	 * Updates the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
        var node = this.node;
        this.clear();
		this._closePath();
		node.style.left = this.get("x") + "px";
		node.style.top = this.get("y") + "px";
	},

	/**
	 * Completes a shape or drawing
	 *
	 * @method _closePath
	 * @private
	 */
	_closePath: function()
	{
		if(!this._methods)
		{
			return;
		}
		var node = this.get("node"),
			w = this._right - this._left,
			h = this._bottom - this._top,
			context = this._context,
			methods = [],
			cachedMethods = this._methods.concat(),
			i,
			j,
			method,
			args,
            argsLen,
			len = 0;
		this._context.clearRect(0, 0, node.width, node.height);
	   if(this._methods)
	   {
			len = cachedMethods.length;
			if(!len || len < 1)
			{
				return;
			}
			for(i = 0; i < len; ++i)
			{
				methods[i] = cachedMethods[i].concat();
				args = methods[i];
                argsLen = (args[0] == "quadraticCurveTo" || args[0] == "bezierCurveTo") ? args.length : 3;
				for(j = 1; j < argsLen; ++j)
				{
					if(j % 2 === 0)
					{
						args[j] = args[j] - this._top;
					}
					else
					{
						args[j] = args[j] - this._left;
					}
				}
			}
            node.setAttribute("width", Math.min(w, 2000));
            node.setAttribute("height", Math.min(2000, h));
            context.beginPath();
			for(i = 0; i < len; ++i)
			{
				args = methods[i].concat();
				if(args && args.length > 0)
				{
					method = args.shift();
					if(method)
					{
                        if(method == "closePath")
                        {
                            context.closePath();
                            this._strokeAndFill(context);
                        }
						else if(method && method == "lineTo" && this._dashstyle)
						{
							args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);
							this._drawDashedLine.apply(this, args);
						}
						else
						{
                            context[method].apply(context, args); 
						}
					}
				}
			}

            this._strokeAndFill(context);
			this._drawingComplete = true;
			this._clearAndUpdateCoords();
			this._updateNodePosition();
			this._methods = cachedMethods;
		}
	},

    /**
     * Completes a stroke and/or fill operation on the context.
     *
     * @method _strokeAndFill
     * @param {Context} Reference to the context element of the canvas instance.
     * @private
     */
    _strokeAndFill: function(context)
    {
        if (this._fillType) 
        {
            if(this._fillType == "linear")
            {
                context.fillStyle = this._getLinearGradient();
            }
            else if(this._fillType == "radial")
            {
                context.fillStyle = this._getRadialGradient();
            }
            else
            {
                context.fillStyle = this._fillColor;
            }
            context.closePath();
            context.fill();
        }

        if (this._stroke) {
            if(this._strokeWeight)
            {
                context.lineWidth = this._strokeWeight;
            }
            context.lineCap = this._linecap;
            context.lineJoin = this._linejoin;
            if(this._miterlimit)
            {
                context.miterLimit = this._miterlimit;
            }
            context.strokeStyle = this._strokeStyle;
            context.stroke();
        }
    },

	/**
	 * Draws a dashed line between two points.
	 * 
	 * @method _drawDashedLine
	 * @param {Number} xStart	The x position of the start of the line
	 * @param {Number} yStart	The y position of the start of the line
	 * @param {Number} xEnd		The x position of the end of the line
	 * @param {Number} yEnd		The y position of the end of the line
	 * @private
	 */
	_drawDashedLine: function(xStart, yStart, xEnd, yEnd)
	{
		var context = this._context,
			dashsize = this._dashstyle[0],
			gapsize = this._dashstyle[1],
			segmentLength = dashsize + gapsize,
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
			context.moveTo(xCurrent, yCurrent);
			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
			xCurrent += xDelta;
			yCurrent += yDelta;
		}
		
		context.moveTo(xCurrent, yCurrent);
		delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
		
		if(delta > dashsize)
		{
			context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
		}
		else if(delta > 0)
		{
			context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
		}
		
		context.moveTo(xEnd, yEnd);
	},

	//This should move to CanvasDrawing class. 
    //Currently docmented in CanvasDrawing class.
    clear: function() {
		this._initProps();
        if(this.node) 
        {
            this._context.clearRect(0, 0, this.node.width, this.node.height);
        }
        return this;
	},
	
	/**
	 * Returns the bounds for a shape.
	 *
     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.
     * The calculated bounding box is used by the graphic instance to calculate its viewBox. 
     *
	 * @method getBounds
	 * @return Object
	 */
	getBounds: function()
	{
		var type = this._type,
			w = this.get("width"),
			h = this.get("height"),
			x = this.get("x"),
			y = this.get("y");
        if(type == "path")
        {
            x = x + this._left;
            y = y + this._top;
            w = this._right - this._left;
            h = this._bottom - this._top;
        }
        return this._getContentRect(w, h, x, y);
	},

    /**
     * Calculates the bounding box for the shape.
     *
     * @method _getContentRect
     * @param {Number} w width of the shape
     * @param {Number} h height of the shape
     * @param {Number} x x-coordinate of the shape
     * @param {Number} y y-coordinate of the shape
     * @private
     */
    _getContentRect: function(w, h, x, y)
    {
        var transformOrigin = this.get("transformOrigin"),
            transformX = transformOrigin[0] * w,
            transformY = transformOrigin[1] * h,
		    transforms = this.matrix.getTransformArray(this.get("transform")),
            matrix = new Y.Matrix(),
            i,
            len = transforms.length,
            transform,
            key,
            contentRect;
        if(this._type == "path")
        {
            transformX = transformX + x;
            transformY = transformY + y;
        }
        transformX = !isNaN(transformX) ? transformX : 0;
        transformY = !isNaN(transformY) ? transformY : 0;
        matrix.translate(transformX, transformY);
        for(i = 0; i < len; i = i + 1)
        {
            transform = transforms[i];
            key = transform.shift();
            if(key)
            {
                matrix[key].apply(matrix, transform); 
            }
        }
        matrix.translate(-transformX, -transformY);
        contentRect = matrix.getContentRect(w, h, x, y);
        return contentRect;
    },

    /**
     * Places the shape above all other shapes.
     *
     * @method toFront
     */
    toFront: function()
    {
        var graphic = this.get("graphic");
        if(graphic)
        {
            graphic._toFront(this);
        }
    },

    /**
     * Places the shape underneath all other shapes.
     *
     * @method toFront
     */
    toBack: function()
    {
        var graphic = this.get("graphic");
        if(graphic)
        {
            graphic._toBack(this);
        }
    },

    /**
     * Parses path data string and call mapped methods.
     *
     * @method _parsePathData
     * @param {String} val The path data
     * @private
     */
    _parsePathData: function(val)
    {
        var method,
            methodSymbol,
            args,
            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),
            i,
            len, 
            str,
            symbolToMethod = this._pathSymbolToMethod;
        if(commandArray)
        {
            this.clear();
            len = commandArray.length || 0;
            for(i = 0; i < len; i = i + 1)
            {
                str = commandArray[i];
                methodSymbol = str.substr(0, 1);
                args = str.substr(1).match(SPLITARGSPATTERN);
                method = symbolToMethod[methodSymbol];
                if(method)
                {
                    if(args)
                    {
                        this[method].apply(this, args);
                    }
                    else
                    {
                        this[method].apply(this);
                    }
                }
            }
            this.end();
        }
    },
    
    /**
     * Destroys the shape instance.
     *
     * @method destroy
     */
    destroy: function()
    {
        var graphic = this.get("graphic");
        if(graphic)
        {
            graphic.removeShape(this);
        }
        else
        {
            this._destroy();
        }
    },

    /**
     *  Implementation for shape destruction
     *
     *  @method destroy
     *  @protected
     */
    _destroy: function()
    {
        if(this.node)
        {
            Y.one(this.node).remove(true);
            this._context = null;
            this.node = null;
        }
    }
}, Y.CanvasDrawing.prototype));

CanvasShape.ATTRS =  {
	/**
	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a 
	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].
	 *
	 * @config transformOrigin
	 * @type Array
	 */
	transformOrigin: {
		valueFn: function()
		{
			return [0.5, 0.5];
		}
	},
	
    /**
     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:
     *     
     *    <dl>
     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>
     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>
     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>
     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>
     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>
     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>
     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>
     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>
     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      
     *    </dl>
     * </p>
     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform
     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>
            var myRect = new Y.Rect({
                type:"rect",
                width: 50,
                height: 40,
                transform: "rotate(45)"
            };
     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>
    
        myRect.set("transform", "translate(40, 50) rotate(45)");
	 * @config transform
     * @type String  
	 */
	transform: {
		setter: function(val)
		{
            this.matrix.init();	
		    this._transforms = this.matrix.getTransformArray(val);
            this._transform = val;
            return val;
		},

        getter: function()
        {
            return this._transform;
        }
	},

	/**
	 * Dom node for the shape
	 *
	 * @config node
	 * @type HTMLElement
	 * @readOnly
	 */
	node: {
		readOnly: true,

		getter: function()
		{
			return this.node;
		}
	},

	/**
	 * Unique id for class instance.
	 *
	 * @config id
	 * @type String
	 */
	id: {
		valueFn: function()
		{
			return Y.guid();
		},

		setter: function(val)
		{
			var node = this.node;
			if(node)
			{
				node.setAttribute("id", val);
			}
			return val;
		}
	},

	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
        value: 0
    },

	/**
	 * Indicates the height of the shape
	 *
	 * @config height
	 * @type Number
	 */
	height: {
        value: 0
    },

	/**
	 * Indicates the x position of shape.
	 *
	 * @config x
	 * @type Number
	 */
	x: {
		value: 0
	},

	/**
	 * Indicates the y position of shape.
	 *
	 * @config y
	 * @type Number
	 */
	y: {
		value: 0
	},

	/**
	 * Indicates whether the shape is visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
	visible: {
		value: true,

		setter: function(val){
			var node = this.get("node"),
                visibility = val ? "visible" : "hidden";
			if(node)
            {
                node.style.visibility = visibility;
            }
			return val;
		}
	},

	/**
	 * Contains information about the fill of the shape. 
     *  <dl>
     *      <dt>color</dt><dd>The color of the fill.</dd>
     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>
     *      <dt>type</dt><dd>Type of fill.
     *          <dl>
     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>
     *              <dt>linear</dt><dd>Linear gradient fill.</dd>
     *              <dt>radial</dt><dd>Radial gradient fill.</dd>
     *          </dl>
     *      </dd>
     *  </dl>
     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:
     *  <dl>
     *      <dt>stops</dt><dd>An array of objects containing the following properties:
     *          <dl>
     *              <dt>color</dt><dd>The color of the stop.</dd>
     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>
     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> 
     *          </dl>
     *      </dd>
     *      <p>Linear gradients also have the following property:</p>
     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>
     *      <p>Radial gradients have the following additional properties:</p>
     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>
     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>
     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>
     *  </dl>
     *  <p>The corresponding `SVGShape` class implements the following additional properties.</p>
     *  <dl>
     *      <dt>cx</dt><dd>
     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *      </dd>
     *      <dt>cy</dt><dd>
     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *      </dd>
     *  </dl>
     *  <p>These properties are not currently implemented in `CanvasShape` or `VMLShape`.</p> 
	 *
	 * @config fill
	 * @type Object 
	 */
	fill: {
		valueFn: "_getDefaultFill",
		
		setter: function(val)
		{
			var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			fill = (val) ? Y.merge(tmpl, val) : null;
			if(fill && fill.color)
			{
				if(fill.color === undefined || fill.color == "none")
				{
					fill.color = null;
				}
			}
			this._setFillProps(fill);
			return fill;
		}
	},

	/**
	 * Contains information about the stroke of the shape.
     *  <dl>
     *      <dt>color</dt><dd>The color of the stroke.</dd>
     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>
     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>
     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to "none", a solid stroke is drawn. When set to an array, the first index indicates the
     *  length of the dash. The second index indicates the length of gap.
     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:
     *          <dl>
     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>
     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>
     *              <dt>round</dt><dd>Specifies a round linecap.</dd>
     *          </dl>
     *      </dd>
     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:
     *          <dl>
     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>
     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>
     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having
     *  separate miter and miter limit values.</dd>
     *          </dl>
     *      </dd>
     *  </dl>
	 *
	 * @config stroke
	 * @type Object
	 */
	stroke: {
		valueFn: "_getDefaultStroke",

		setter: function(val)
		{
			var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            if(val && val.hasOwnProperty("weight"))
            {
                wt = parseInt(val.weight, 10);
                if(!isNaN(wt))
                {
                    val.weight = wt;
                }
            }
			val = (val) ? Y.merge(tmpl, val) : null;
			this._setStrokeProps(val);
			return val;
		}
	},
	
	//Not used. Remove in future.
	autoSize: {
		value: false
	},

	// Only implemented in SVG
	// Determines whether the instance will receive mouse events.
	// 
	// @config pointerEvents
	// @type string
	//
	pointerEvents: {
		value: "visiblePainted"
	},

    /**
     * Represents an SVG Path string. This will be parsed and added to shape's API to represent the SVG data across all implementations. Note that when using VML or SVG 
     * implementations, part of this content will be added to the DOM using respective VML/SVG attributes. If your content comes from an untrusted source, you will need 
     * to ensure that no malicious code is included in that content. 
     *
     * @config data
     * @type String
     */
    data: {
        setter: function(val)
        {
            if(this.get("node"))
            {
                this._parsePathData(val);
            }
            return val;
        }
    },

	/**
	 * Reference to the container Graphic.
	 *
	 * @config graphic
	 * @type Graphic
	 */
	graphic: {
		readOnly: true,

		getter: function()
		{
			return this._graphic;
		}
    }
};
Y.CanvasShape = CanvasShape;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Path.html">`Path`</a> class. 
 * `CanvasPath` is not intended to be used directly. Instead, use the <a href="Path.html">`Path`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Path.html">`Path`</a> 
 * class will point to the `CanvasPath` class.
 *
 * @module graphics
 * @class CanvasPath
 * @extends CanvasShape
 */
CanvasPath = function(cfg)
{
	CanvasPath.superclass.constructor.apply(this, arguments);
};
CanvasPath.NAME = "path";
Y.extend(CanvasPath, Y.CanvasShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "path",

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
    _draw: function()
    {
        this._closePath();
        this._updateTransform();
    },

	/**
	 * Creates the dom node for the shape.
	 *
     * @method createNode
	 * @return HTMLElement
	 * @private
	 */
	createNode: function()
	{
		var host = this,
            node = Y.config.doc.createElement('canvas'),
			name = host.name,
            concat = host._camelCaseConcat,
            id = host.get("id");
		host._context = node.getContext('2d');
		node.setAttribute("overflow", "visible");
        node.setAttribute("pointer-events", "none");
        node.style.pointerEvents = "none";
        node.style.overflow = "visible";
		node.setAttribute("id", id);
		id = "#" + id;
		host.node = node;
		host.addClass(_getClassName(SHAPE) + " " + _getClassName(concat(IMPLEMENTATION, SHAPE)) + " " + _getClassName(name) + " " + _getClassName(concat(IMPLEMENTATION, name))); 
	},

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
    }
});

CanvasPath.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
		getter: function()
		{
			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
			return this._width - offset;
		},

		setter: function(val)
		{
			this._width = val;
			return val;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @config height
	 * @type Number
	 */
	height: {
		getter: function()
		{
			var offset = this._stroke && this._strokeWeight ? (this._strokeWeight * 2) : 0;
            return this._height - offset;
		},

		setter: function(val)
		{
			this._height = val;
			return val;
		}
	},
	
	/**
	 * Indicates the path used for the node.
	 *
	 * @config path
	 * @type String
     * @readOnly
	 */
	path: {
        readOnly: true,

		getter: function()
		{
			return this._path;
		}
	}
});
Y.CanvasPath = CanvasPath;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Rect.html">`Rect`</a> class. 
 * `CanvasRect` is not intended to be used directly. Instead, use the <a href="Rect.html">`Rect`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Rect.html">`Rect`</a> 
 * class will point to the `CanvasRect` class.
 *
 * @module graphics
 * @class CanvasRect
 * @constructor
 */
CanvasRect = function()
{
	CanvasRect.superclass.constructor.apply(this, arguments);
};
CanvasRect.NAME = "rect";
Y.extend(CanvasRect, Y.CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "rect",

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
		var w = this.get("width"),
			h = this.get("height");
		this.clear();
        this.drawRect(0, 0, w, h);
		this._closePath();
	}
});
CanvasRect.ATTRS = Y.CanvasShape.ATTRS;
Y.CanvasRect = CanvasRect;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Ellipse.html">`Ellipse`</a> class. 
 * `CanvasEllipse` is not intended to be used directly. Instead, use the <a href="Ellipse.html">`Ellipse`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Ellipse.html">`Ellipse`</a> 
 * class will point to the `CanvasEllipse` class.
 *
 * @module graphics
 * @class CanvasEllipse
 * @constructor
 */
CanvasEllipse = function(cfg)
{
	CanvasEllipse.superclass.constructor.apply(this, arguments);
};

CanvasEllipse.NAME = "ellipse";

Y.extend(CanvasEllipse, CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "ellipse",

	/**
     * Draws the shape.
     *
     * @method _draw
	 * @private
	 */
	_draw: function()
	{
		var w = this.get("width"),
			h = this.get("height");
		this.clear();
        this.drawEllipse(0, 0, w, h);
		this._closePath();
	}
});
CanvasEllipse.ATTRS = Y.merge(CanvasShape.ATTRS, {
	/**
	 * Horizontal radius for the ellipse. 
	 *
	 * @config xRadius
	 * @type Number
	 */
	xRadius: {
		setter: function(val)
		{
			this.set("width", val * 2);
		},

		getter: function()
		{
			var val = this.get("width");
			if(val) 
			{
				val *= 0.5;
			}
			return val;
		}
	},

	/**
	 * Vertical radius for the ellipse. 
	 *
	 * @config yRadius
	 * @type Number
	 * @readOnly
	 */
	yRadius: {
		setter: function(val)
		{
			this.set("height", val * 2);
		},

		getter: function()
		{
			var val = this.get("height");
			if(val) 
			{
				val *= 0.5;
			}
			return val;
		}
	}
});
Y.CanvasEllipse = CanvasEllipse;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the <a href="Circle.html">`Circle`</a> class. 
 * `CanvasCircle` is not intended to be used directly. Instead, use the <a href="Circle.html">`Circle`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Circle.html">`Circle`</a> 
 * class will point to the `CanvasCircle` class.
 *
 * @module graphics
 * @class CanvasCircle
 * @constructor
 */
CanvasCircle = function(cfg)
{
	CanvasCircle.superclass.constructor.apply(this, arguments);
};
    
CanvasCircle.NAME = "circle";

Y.extend(CanvasCircle, Y.CanvasShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "circle",

	/**
     * Draws the shape.
     *
     * @method _draw
	 * @private
	 */
	_draw: function()
	{
		var radius = this.get("radius");
		if(radius)
		{
            this.clear();
            this.drawCircle(0, 0, radius);
			this._closePath();
		}
	}
});

CanvasCircle.ATTRS = Y.merge(Y.CanvasShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
	width: {
        setter: function(val)
        {
            this.set("radius", val/2);
            return val;
        },

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Indicates the height of the shape
	 *
	 * @config height
	 * @type Number
	 */
	height: {
        setter: function(val)
        {
            this.set("radius", val/2);
            return val;
        },

		getter: function()
		{
			return this.get("radius") * 2;
		}
	},

	/**
	 * Radius of the circle
	 *
	 * @config radius
     * @type Number
	 */
	radius: {
		lazyAdd: false
	}
});
Y.CanvasCircle = CanvasCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class CanvasPieSlice
 * @constructor
 */
CanvasPieSlice = function()
{
	CanvasPieSlice.superclass.constructor.apply(this, arguments);
};
CanvasPieSlice.NAME = "canvasPieSlice";
Y.extend(CanvasPieSlice, Y.CanvasShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "path",

	/**
	 * Change event listener
	 *
	 * @private
	 * @method _updateHandler
	 */
	_draw: function(e)
	{
        var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        this.clear();
        this._left = x;
        this._right = radius;
        this._top = y;
        this._bottom = radius;
        this.drawWedge(x, y, startAngle, arc, radius);
		this.end();
	}
 });
CanvasPieSlice.ATTRS = Y.mix({
    cx: {
        value: 0
    },

    cy: {
        value: 0
    },
    /**
     * Starting angle in relation to a circle in which to begin the pie slice drawing.
     *
     * @config startAngle
     * @type Number
     */
    startAngle: {
        value: 0
    },

    /**
     * Arc of the slice.
     *
     * @config arc
     * @type Number
     */
    arc: {
        value: 0
    },

    /**
     * Radius of the circle in which the pie slice is drawn
     *
     * @config radius
     * @type Number
     */
    radius: {
        value: 0
    }
}, Y.CanvasShape.ATTRS);
Y.CanvasPieSlice = CanvasPieSlice;
/**
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> implementation of the `Graphic` class. 
 * `CanvasGraphic` is not intended to be used directly. Instead, use the <a href="Graphic.html">`Graphic`</a> class. 
 * If the browser lacks <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities but has 
 * <a href="http://www.w3.org/TR/html5/the-canvas-element.html">Canvas</a> capabilities, the <a href="Graphic.html">`Graphic`</a> 
 * class will point to the `CanvasGraphic` class.
 *
 * @module graphics
 * @class CanvasGraphic
 * @constructor
 */
function CanvasGraphic(config) {
    
    CanvasGraphic.superclass.constructor.apply(this, arguments);
}

CanvasGraphic.NAME = "canvasGraphic";

CanvasGraphic.ATTRS = {
    /**
     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.
     * 
     * @config render
     * @type Node | String 
     */
    render: {},
	
    /**
	 * Unique id for class instance.
	 *
	 * @config id
	 * @type String
	 */
	id: {
		valueFn: function()
		{
			return Y.guid();
		},

		setter: function(val)
		{
			var node = this._node;
			if(node)
			{
				node.setAttribute("id", val);
			}
			return val;
		}
	},

    /**
     * Key value pairs in which a shape instance is associated with its id.
     *
     *  @config shapes
     *  @type Object
     *  @readOnly
     */
    shapes: {
        readOnly: true,

        getter: function()
        {
            return this._shapes;
        }
    },

    /**
     *  Object containing size and coordinate data for the content of a Graphic in relation to the graphic instance's position.
     *
     *  @config contentBounds 
     *  @type Object
     *  @readOnly
     */
    contentBounds: {
        readOnly: true,

        getter: function()
        {
            return this._contentBounds;
        }
    },

    /**
     *  The outermost html element of the Graphic instance.
     *
     *  @config node
     *  @type HTMLElement
     *  @readOnly
     */
    node: {
        readOnly: true,

        getter: function()
        {
            return this._node;
        }
    },

	/**
	 * Indicates the width of the `Graphic`. 
	 *
	 * @config width
	 * @type Number
	 */
    width: {
        setter: function(val)
        {
            if(this._node)
            {
                this._node.style.width = val + "px";            
            }
            return val;
        }
    },

	/**
	 * Indicates the height of the `Graphic`. 
	 *
	 * @config height 
	 * @type Number
	 */
    height: {
        setter: function(val)
        {
            if(this._node)
            {
                this._node.style.height = val + "px";
            }
            return val;
        }
    },

    /**
     *  Determines the sizing of the Graphic. 
     *
     *  <dl>
     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>
     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's 
     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>
     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>
     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>
     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>
     *  </dl>
     *
     *
     *  @config autoSize
     *  @type Boolean | String
     *  @default false
     */
    autoSize: {
        value: false
    },

    /**
     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.
     *
     *  <dl>
     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary 
     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>
     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>
     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>
     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>
     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>
     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>
     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>
     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>
     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>
     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>
     *  </dl>
     * 
     * @config preserveAspectRatio
     * @type String
     * @default xMidYMid
     */
    preserveAspectRatio: {
        value: "xMidYMid"
    },

    /**
     * The contentBounds will resize to greater values but not smaller values. (for performance)
     * When resizing the contentBounds down is desirable, set the resizeDown value to true.
     *
     * @config resizeDown 
     * @type Boolean
     */
    resizeDown: {
        value: false
    },

	/**
	 * Indicates the x-coordinate for the instance.
	 *
	 * @config x
	 * @type Number
	 */
    x: {
        getter: function()
        {
            return this._x;
        },

        setter: function(val)
        {
            this._x = val;
            if(this._node)
            {
                this._node.style.left = val + "px";
            }
            return val;
        }
    },

	/**
	 * Indicates the y-coordinate for the instance.
	 *
	 * @config y
	 * @type Number
	 */
    y: {
        getter: function()
        {
            return this._y;
        },

        setter: function(val)
        {
            this._y = val;
            if(this._node)
            {
                this._node.style.top = val + "px";
            }
            return val;
        }
    },

    /**
     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.
     * This property will get set to false when batching operations.
     *
     * @config autoDraw
     * @type Boolean
     * @default true
     * @private
     */
    autoDraw: {
        value: true
    },

	/**
	 * Indicates whether the `Graphic` and its children are visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
    visible: {
        value: true,

        setter: function(val)
        {
            this._toggleVisible(val);
            return val;
        }
    }
};

Y.extend(CanvasGraphic, Y.GraphicBase, {
    /**
     * Sets the value of an attribute.
     *
     * @method set
     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can 
     * be passed in to set multiple attributes at once.
     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as 
     * the name param.
     */
	set: function(attr, value) 
	{
		var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		AttributeLite.prototype.set.apply(host, arguments);	
        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            if(Y_LANG.isString && redrawAttrs[attr])
            {
                forceRedraw = true;
            }
            else if(Y_LANG.isObject(attr))
            {
                for(key in redrawAttrs)
                {
                    if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        forceRedraw = true;
                        break;
                    }
                }
            }
        }
        if(forceRedraw)
        {
            host._redraw();
        }
	},

    /**
     * Storage for `x` attribute.
     *
     * @property _x
     * @type Number
     * @private
     */
    _x: 0,

    /**
     * Storage for `y` attribute.
     *
     * @property _y
     * @type Number
     * @private
     */
    _y: 0,

    /**
     * Gets the current position of the graphic instance in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        var node = Y.one(this._node),
            xy;
        if(node)
        {
            xy = node.getXY();
        }
        return xy;
    },
    
	/**
     * Initializes the class.
     *
     * @method initializer
     * @param {Object} config Optional attributes 
     * @private
     */
    initializer: function(config) {
        var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden",
            w = this.get("width") || 0,
            h = this.get("height") || 0;
        this._shapes = {};
        this._redrawQueue = {};
		this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this._node = DOCUMENT.createElement('div');
        this._node.style.position = "absolute";
        this._node.style.visibility = visibility;
        this.set("width", w);
        this.set("height", h);
        if(render)
        {
            this.render(render);
        }
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        var parentNode = Y.one(render),
            node = this._node,
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        parentNode = parentNode || DOCUMENT.body;
        parentNode.appendChild(node);
        node.style.display = "block";
        node.style.position = "absolute";
        node.style.left = "0px";
        node.style.top = "0px";
        this.set("width", w);
        this.set("height", h);
        this.parentNode = parentNode;
        return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this.removeAllShapes();
        if(this._node)
        {
            this._removeChildren(this._node);
            Y.one(this._node).destroy();
        }
    },

    /**
     * Generates a shape instance by type.
     *
     * @method addShape
     * @param {Object} cfg attributes for the shape
     * @return Shape
     */
    addShape: function(cfg)
    {
        cfg.graphic = this;
        if(!this.get("visible"))
        {
            cfg.visible = false;
        }
        var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        this._appendShape(shape);
        return shape;
    },

    /**
     * Adds a shape instance to the graphic instance.
     *
     * @method _appendShape
     * @param {Shape} shape The shape instance to be added to the graphic.
     * @private
     */
    _appendShape: function(shape)
    {
        var node = shape.node,
            parentNode = this._frag || this._node;
        if(this.get("autoDraw")) 
        {
            parentNode.appendChild(node);
        }
        else
        {
            this._getDocFrag().appendChild(node);
        }
    },

    /**
     * Removes a shape instance from from the graphic instance.
     *
     * @method removeShape
     * @param {Shape|String} shape The instance or id of the shape to be removed.
     */
    removeShape: function(shape)
    {
        if(!(shape instanceof CanvasShape))
        {
            if(Y_LANG.isString(shape))
            {
                shape = this._shapes[shape];
            }
        }
        if(shape && shape instanceof CanvasShape)
        {
            shape._destroy();
            delete this._shapes[shape.get("id")];
        }
        if(this.get("autoDraw")) 
        {
            this._redraw();
        }
        return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        var shapes = this._shapes,
            i;
        for(i in shapes)
        {
            if(shapes.hasOwnProperty(i))
            {
                shapes[i].destroy();
            }
        }
        this._shapes = {};
    },
    
    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        this.removeAllShapes();
    },

    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param {HTMLElement} node
     * @private
     */
    _removeChildren: function(node)
    {
        if(node && node.hasChildNodes())
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
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} val indicates visibilitye
     * @private
     */
    _toggleVisible: function(val)
    {
        var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        if(shapes)
        {
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shapes[i].set("visible", val);
                }
            }
        }
        if(this._node)
        {
            this._node.style.visibility = visibility;
        }
    },

    /**
     * Returns a shape class. Used by `addShape`. 
     *
     * @method _getShapeClass
     * @param {Shape | String} val Indicates which shape class. 
     * @return Function 
     * @private
     */
    _getShapeClass: function(val)
    {
        var shape = this._shapeClass[val];
        if(shape)
        {
            return shape;
        }
        return val;
    },
    
    /**
     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.
     *
     * @property _shapeClass
     * @type Object
     * @private
     */
    _shapeClass: {
        circle: Y.CanvasCircle,
        rect: Y.CanvasRect,
        path: Y.CanvasPath,
        ellipse: Y.CanvasEllipse,
        pieslice: Y.CanvasPieSlice
    },
    
    /**
     * Returns a shape based on the id of its dom node.
     *
     * @method getShapeById
     * @param {String} id Dom id of the shape's node attribute.
     * @return Shape
     */
    getShapeById: function(id)
    {
        var shape = this._shapes[id];
        return shape;
    },

	/**
	 * Allows for creating multiple shapes in order to batch appending and redraw operations.
	 *
	 * @method batch
	 * @param {Function} method Method to execute.
	 */
    batch: function(method)
    {
        var autoDraw = this.get("autoDraw");
        this.set("autoDraw", false);
        method();
        this.set("autoDraw", autoDraw);
    },

    /**
     * Returns a document fragment to for attaching shapes.
     *
     * @method _getDocFrag
     * @return DocumentFragment
     * @private
     */
    _getDocFrag: function()
    {
        if(!this._frag)
        {
            this._frag = DOCUMENT.createDocumentFragment();
        }
        return this._frag;
    },
    
    /**
     * Redraws all shapes.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        var autoSize = this.get("autoSize"),
            preserveAspectRatio = this.get("preserveAspectRatio"),
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            contentWidth,
            contentHeight,
            w,
            h,
            xScale,
            yScale,
            translateX = 0,
            translateY = 0,
            matrix,
            node = this.get("node");
        if(autoSize)
        {
            if(autoSize == "sizeContentToGraphic")
            {
                contentWidth = box.right - box.left;
                contentHeight = box.bottom - box.top;
                w = parseFloat(Y_DOM.getComputedStyle(node, "width"));
                h = parseFloat(Y_DOM.getComputedStyle(node, "height"));
                matrix = new Y.Matrix();
                if(preserveAspectRatio == "none")
                {
                    xScale = w/contentWidth;
                    yScale = h/contentHeight;
                }
                else
                {
                    if(contentWidth/contentHeight !== w/h) 
                    {
                        if(contentWidth * h/contentHeight > w)
                        {
                            xScale = yScale = w/contentWidth;
                            translateY = this._calculateTranslate(preserveAspectRatio.slice(5).toLowerCase(), contentHeight * w/contentWidth, h);
                        }
                        else
                        {
                            xScale = yScale = h/contentHeight;
                            translateX = this._calculateTranslate(preserveAspectRatio.slice(1, 4).toLowerCase(), contentWidth * h/contentHeight, w);
                        }
                    }
                }
                Y_DOM.setStyle(node, "transformOrigin", "0% 0%");
                translateX = translateX - (box.left * xScale);
                translateY = translateY - (box.top * yScale);
                matrix.translate(translateX, translateY);
                matrix.scale(xScale, yScale);
                Y_DOM.setStyle(node, "transform", matrix.toCSSText());
            }
            else
            {
                this.set("width", box.right);
                this.set("height", box.bottom);
            }
        }
        if(this._frag)
        {
            this._node.appendChild(this._frag);
            this._frag = null;
        }
    },
    
    /**
     * Determines the value for either an x or y value to be used for the <code>translate</code> of the Graphic.
     *
     * @method _calculateTranslate
     * @param {String} position The position for placement. Possible values are min, mid and max.
     * @param {Number} contentSize The total size of the content.
     * @param {Number} boundsSize The total size of the Graphic.
     * @return Number
     * @private
     */
    _calculateTranslate: function(position, contentSize, boundsSize)
    {
        var ratio = boundsSize - contentSize,
            coord;
        switch(position)
        {
            case "mid" :
                coord = ratio * 0.5;
            break;
            case "max" :
                coord = ratio;
            break;
            default :
                coord = 0;
            break;
        }
        return coord;
    },
    
    /**
     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally 
     * by `Shape` instances.
     *
     * @method addToRedrawQueue
     * @param Shape shape The shape instance to add to the queue
     * @protected
     */
    addToRedrawQueue: function(shape)
    {
        var shapeBox,
            box;
        this._shapes[shape.get("id")] = shape;
        if(!this.get("resizeDown"))
        {
            shapeBox = shape.getBounds();
            box = this._contentBounds;
            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            this._contentBounds = box;
        }
        if(this.get("autoDraw")) 
        {
            this._redraw();
        }
    },

    /**
     * Recalculates and returns the `contentBounds` for the `Graphic` instance.
     *
     * @method _getUpdatedContentBounds
     * @return {Object} 
     * @private
     */
    _getUpdatedContentBounds: function()
    {
        var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        for(i in queue)
        {
            if(queue.hasOwnProperty(i))
            {
                shape = queue[i];
                bounds = shape.getBounds();
                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        this._contentBounds = box;
        return box;
    },

    /**
     * Inserts shape on the top of the tree.
     *
     * @method _toFront
     * @param {CanvasShape} Shape to add.
     * @private
     */
    _toFront: function(shape)
    {
        var contentNode = this.get("node");
        if(shape instanceof Y.CanvasShape)
        {
            shape = shape.get("node");
        }
        if(contentNode && shape)
        {
            contentNode.appendChild(shape);
        }
    },

    /**
     * Inserts shape as the first child of the content node.
     *
     * @method _toBack
     * @param {CanvasShape} Shape to add.
     * @private
     */
    _toBack: function(shape)
    {
        var contentNode = this.get("node"),
            targetNode;
        if(shape instanceof Y.CanvasShape)
        {
            shape = shape.get("node");
        }
        if(contentNode && shape)
        {
            targetNode = contentNode.firstChild;
            if(targetNode)
            {
                contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                contentNode.appendChild(shape);
            }
        }
    }
});

Y.CanvasGraphic = CanvasGraphic;


}, '3.7.3', {"requires": ["graphics"]});

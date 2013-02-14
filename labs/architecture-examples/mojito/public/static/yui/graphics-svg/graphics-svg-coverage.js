/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/graphics-svg/graphics-svg.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/graphics-svg/graphics-svg.js",
    code: []
};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].code=["YUI.add('graphics-svg', function (Y, NAME) {","","var IMPLEMENTATION = \"svg\",","    SHAPE = \"shape\",","	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,","    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\\.][0-9]*/g,","    Y_LANG = Y.Lang,","	AttributeLite = Y.AttributeLite,","	SVGGraphic,","    SVGShape,","	SVGCircle,","	SVGRect,","	SVGPath,","	SVGEllipse,","    SVGPieSlice,","    DOCUMENT = Y.config.doc,","    _getClassName = Y.ClassNameManager.getClassName;","","function SVGDrawing(){}","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Drawing.html\">`Drawing`</a> class. "," * `SVGDrawing` is not intended to be used directly. Instead, use the <a href=\"Drawing.html\">`Drawing`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Drawing.html\">`Drawing`</a> "," * class will point to the `SVGDrawing` class."," *"," * @module graphics"," * @class SVGDrawing"," * @constructor"," */","SVGDrawing.prototype = {","    /**","     * Maps path to methods","     *","     * @property _pathSymbolToMethod","     * @type Object","     * @private","     */","    _pathSymbolToMethod: {","        M: \"moveTo\",","        m: \"relativeMoveTo\",","        L: \"lineTo\",","        l: \"relativeLineTo\",","        C: \"curveTo\",","        c: \"relativeCurveTo\",","        Q: \"quadraticCurveTo\",","        q: \"relativeQuadraticCurveTo\",","        z: \"closePath\",","        Z: \"closePath\"","    },","","    /**","     * Current x position of the drawing.","     *","     * @property _currentX","     * @type Number","     * @private","     */","    _currentX: 0,","","    /**","     * Current y position of the drqwing.","     *","     * @property _currentY","     * @type Number","     * @private","     */","    _currentY: 0,","    ","    /**","     * Indicates the type of shape","     *","     * @private","     * @property _type","     * @readOnly","     * @type String","     */","    _type: \"path\",","   ","    /**","     * Draws a bezier curve.","     *","     * @method curveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    curveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a bezier curve relative to the current coordinates.","     *","     * @method relativeCurveTo","     * @param {Number} cp1x x-coordinate for the first control point.","     * @param {Number} cp1y y-coordinate for the first control point.","     * @param {Number} cp2x x-coordinate for the second control point.","     * @param {Number} cp2y y-coordinate for the second control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeCurveTo: function() {","        this._curveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements curveTo methods.","     *","     * @method _curveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _curveTo: function(args, relative) {","        var w,","            h,","            pts,","            cp1x,","            cp1y,","            cp2x,","            cp2y,","            x,","            y,","            right,","            left,","            bottom,","            top,","            i,","            len,","            pathArrayLen,","            currentArray,","            command = relative ? \"c\" : \"C\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        this._pathArray = this._pathArray || [];","        if(this._pathType !== command)","        {","            this._pathType = command;","            currentArray = [command];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);","        len = args.length - 5;","        for(i = 0; i < len; i = i + 6)","        {","            cp1x = parseFloat(args[i]) + relativeX;","            cp1y = parseFloat(args[i + 1]) + relativeY;","            cp2x = parseFloat(args[i + 2]) + relativeX;","            cp2y = parseFloat(args[i + 3]) + relativeY;","            x = parseFloat(args[i + 4]) + relativeX;","            y = parseFloat(args[i + 5]) + relativeY;","            right = Math.max(x, Math.max(cp1x, cp2x));","            bottom = Math.max(y, Math.max(cp1y, cp2y));","            left = Math.min(x, Math.min(cp1x, cp2x));","            top = Math.min(y, Math.min(cp1y, cp2y));","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","    },","","    /**","     * Draws a quadratic bezier curve.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    quadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a quadratic bezier curve relative to the current position.","     *","     * @method quadraticCurveTo","     * @param {Number} cpx x-coordinate for the control point.","     * @param {Number} cpy y-coordinate for the control point.","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeQuadraticCurveTo: function() {","        this._quadraticCurveTo.apply(this, [Y.Array(arguments), true]);","    },","   ","    /**","     * Implements quadraticCurveTo methods.","     *","     * @method _quadraticCurveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _quadraticCurveTo: function(args, relative) {","        var cpx, ","            cpy, ","            x, ","            y,","            pathArrayLen,","            currentArray,","            w,","            h,","            pts,","            right,","            left,","            bottom,","            top,","            i,","            len,","            command = relative ? \"q\" : \"Q\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        if(this._pathType !== command)","        {","            this._pathType = command;","            currentArray = [command];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","            if(!currentArray)","            {","                currentArray = [];","                this._pathArray.push(currentArray);","            }","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);","        len = args.length - 3;","        for(i = 0; i < len; i = i + 4)","        {","            cpx = parseFloat(args[i]) + relativeX;","            cpy = parseFloat(args[i + 1]) + relativeY;","            x = parseFloat(args[i + 2]) + relativeX;","            y = parseFloat(args[i + 3]) + relativeY;","            right = Math.max(x, cpx);","            bottom = Math.max(y, cpy);","            left = Math.min(x, cpx);","            top = Math.min(y, cpy);","            w = Math.abs(right - left);","            h = Math.abs(bottom - top);","            pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; ","            this._setCurveBoundingBox(pts, w, h);","            this._currentX = x;","            this._currentY = y;","        }","    },","","    /**","     * Draws a rectangle.","     *","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     */","    drawRect: function(x, y, w, h) {","        this.moveTo(x, y);","        this.lineTo(x + w, y);","        this.lineTo(x + w, y + h);","        this.lineTo(x, y + h);","        this.lineTo(x, y);","    },","","    /**","     * Draws a rectangle with rounded corners.","     * ","     * @method drawRect","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @param {Number} ew width of the ellipse used to draw the rounded corners","     * @param {Number} eh height of the ellipse used to draw the rounded corners","     */","    drawRoundRect: function(x, y, w, h, ew, eh) {","        this.moveTo(x, y + eh);","        this.lineTo(x, y + h - eh);","        this.quadraticCurveTo(x, y + h, x + ew, y + h);","        this.lineTo(x + w - ew, y + h);","        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);","        this.lineTo(x + w, y + eh);","        this.quadraticCurveTo(x + w, y, x + w - ew, y);","        this.lineTo(x + ew, y);","        this.quadraticCurveTo(x, y, x, y + eh);","	},","","    /**","     * Draws a circle.     ","     * ","     * @method drawCircle","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} r radius","     * @protected","     */","	drawCircle: function(x, y, radius) {","        var circum = radius * 2;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + circum, y + circum);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y + circum]);","        this._pathArray.push([\"A\",  radius, radius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","   ","    /**","     * Draws an ellipse.","     *","     * @method drawEllipse","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @param {Number} w width","     * @param {Number} h height","     * @protected","     */","	drawEllipse: function(x, y, w, h) {","        var radius = w * 0.5,","            yRadius = h * 0.5;","        this._drawingComplete = false;","        this._trackSize(x, y);","        this._trackSize(x + w, y + h);","        this._pathArray = this._pathArray || [];","        this._pathArray.push([\"M\", x + radius, y]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y + h]);","        this._pathArray.push([\"A\",  radius, yRadius, 0, 1, 0, x + radius, y]);","        this._currentX = x;","        this._currentY = y;","        return this;","    },","","    /**","     * Draws a diamond.     ","     * ","     * @method drawDiamond","     * @param {Number} x y-coordinate","     * @param {Number} y x-coordinate","     * @param {Number} width width","     * @param {Number} height height","     * @protected","     */","    drawDiamond: function(x, y, width, height)","    {","        var midWidth = width * 0.5,","            midHeight = height * 0.5;","        this.moveTo(x + midWidth, y);","        this.lineTo(x + width, y + midHeight);","        this.lineTo(x + midWidth, y + height);","        this.lineTo(x, y + midHeight);","        this.lineTo(x + midWidth, y);","        return this;","    },","","    /**","     * Draws a wedge.","     *","     * @method drawWedge","     * @param {Number} x x-coordinate of the wedge's center point","     * @param {Number} y y-coordinate of the wedge's center point","     * @param {Number} startAngle starting angle in degrees","     * @param {Number} arc sweep of the wedge. Negative values draw clockwise.","     * @param {Number} radius radius of wedge. If [optional] yRadius is defined, then radius is the x radius.","     * @param {Number} yRadius [optional] y radius for wedge.","     * @private","     */","    drawWedge: function(x, y, startAngle, arc, radius, yRadius)","    {","        var segs,","            segAngle,","            theta,","            angle,","            angleMid,","            ax,","            ay,","            bx,","            by,","            cx,","            cy,","            i,","            diameter = radius * 2,","            currentArray,","            pathArrayLen;","        yRadius = yRadius || radius;","        if(this._pathType != \"M\")","        {","            this._pathType = \"M\";","            currentArray = [\"M\"];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray(); ","        }","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen].push(x); ","        this._pathArray[pathArrayLen].push(x); ","        ","        // limit sweep to reasonable numbers","        if(Math.abs(arc) > 360)","        {","            arc = 360;","        }","        ","        // First we calculate how many segments are needed","        // for a smooth arc.","        segs = Math.ceil(Math.abs(arc) / 45);","        ","        // Now calculate the sweep of each segment.","        segAngle = arc / segs;","        ","        // The math requires radians rather than degrees. To convert from degrees","        // use the formula (degrees/180)*Math.PI to get radians.","        theta = -(segAngle / 180) * Math.PI;","        ","        // convert angle startAngle to radians","        angle = (startAngle / 180) * Math.PI;","        if(segs > 0)","        {","            // draw a line from the center to the start of the curve","            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;","            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;","            this._pathType = \"L\";","            pathArrayLen++;","            this._pathArray[pathArrayLen] = [\"L\"];","            this._pathArray[pathArrayLen].push(Math.round(ax));","            this._pathArray[pathArrayLen].push(Math.round(ay));","            pathArrayLen++; ","            this._pathType = \"Q\";","            this._pathArray[pathArrayLen] = [\"Q\"];","            for(i = 0; i < segs; ++i)","            {","                angle += theta;","                angleMid = angle - (theta / 2);","                bx = x + Math.cos(angle) * radius;","                by = y + Math.sin(angle) * yRadius;","                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));","                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));","                this._pathArray[pathArrayLen].push(Math.round(cx));","                this._pathArray[pathArrayLen].push(Math.round(cy));","                this._pathArray[pathArrayLen].push(Math.round(bx));","                this._pathArray[pathArrayLen].push(Math.round(by));","            }","        }","        this._currentX = x;","        this._currentY = y;","        this._trackSize(diameter, diameter); ","        return this;","    },","","    /**","     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.","     * ","     * @method lineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    lineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Draws a line segment using the current line style from the current drawing position to the relative x and y coordinates.","     * ","     * @method relativeLineTo","     * @param {Number} point1 x-coordinate for the end point.","     * @param {Number} point2 y-coordinate for the end point.","     */","    relativeLineTo: function()","    {","        this._lineTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements lineTo methods.","     *","     * @method _lineTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _lineTo: function(args, relative) {","        var point1 = args[0],","            i,","            len,","            pathArrayLen,","            currentArray,","            x,","            y,","            command = relative ? \"l\" : \"L\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        this._pathArray = this._pathArray || [];","        this._shapeType = \"path\";","        len = args.length;","        if(this._pathType !== command)","        {","            this._pathType = command;","            currentArray = [command];","            this._pathArray.push(currentArray);","        }","        else","        {","            currentArray = this._getCurrentArray();","        }","        pathArrayLen = this._pathArray.length - 1;","        if (typeof point1 === 'string' || typeof point1 === 'number') {","            for (i = 0; i < len; i = i + 2) {","                x = parseFloat(args[i]);","                y = parseFloat(args[i + 1]);","                this._pathArray[pathArrayLen].push(x);","                this._pathArray[pathArrayLen].push(y);","                x = x + relativeX;","                y = y + relativeY;","                this._currentX = x;","                this._currentY = y;","                this._trackSize.apply(this, [x, y]);","            }","        }","        else","        {","            for (i = 0; i < len; ++i) {","                x = parseFloat(args[i][0]);","                y = parseFloat(args[i][1]);","                this._pathArray[pathArrayLen].push(x);","                this._pathArray[pathArrayLen].push(y);","                this._currentX = x;","                this._currentY = y;","                x = x + relativeX;","                y = y + relativeY;","                this._trackSize.apply(this, [x, y]);","            }","        }","    },","","    /**","     * Moves the current drawing position to specified x and y coordinates.","     *","     * @method moveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    moveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), false]);","    },","","    /**","     * Moves the current drawing position relative to specified x and y coordinates.","     *","     * @method relativeMoveTo","     * @param {Number} x x-coordinate for the end point.","     * @param {Number} y y-coordinate for the end point.","     */","    relativeMoveTo: function()","    {","        this._moveTo.apply(this, [Y.Array(arguments), true]);","    },","","    /**","     * Implements moveTo methods.","     *","     * @method _moveTo","     * @param {Array} args The arguments to be used.","     * @param {Boolean} relative Indicates whether or not to use relative coordinates.","     * @private","     */","    _moveTo: function(args, relative) {","        var pathArrayLen,","            currentArray,","            x = parseFloat(args[0]),","            y = parseFloat(args[1]),","            command = relative ? \"m\" : \"M\",","            relativeX = relative ? parseFloat(this._currentX) : 0,","            relativeY = relative ? parseFloat(this._currentY) : 0;","        this._pathArray = this._pathArray || [];","        this._pathType = command;","        currentArray = [command];","        this._pathArray.push(currentArray);","        pathArrayLen = this._pathArray.length - 1;","        this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);","        x = x + relativeX;","        y = y + relativeY;","        this._currentX = x;","        this._currentY = y;","        this._trackSize(x, y);","    },"," ","    /**","     * Completes a drawing operation. ","     *","     * @method end","     */","    end: function()","    {","        this._closePath();","    },","","    /**","     * Clears the path.","     *","     * @method clear","     */","    clear: function()","    {","        this._currentX = 0;","        this._currentY = 0;","        this._width = 0;","        this._height = 0;","        this._left = 0;","        this._right = 0;","        this._top = 0;","        this._bottom = 0;","        this._pathArray = [];","        this._path = \"\";","    },","","    /**","     * Draws the path.","     *","     * @method _closePath","     * @private","     */","    _closePath: function()","    {","        var pathArray,","            segmentArray,","            pathType,","            len,","            val,","            val2,","            i,","            path = \"\",","            node = this.node,","            left = parseFloat(this._left),","            top = parseFloat(this._top),","            fill = this.get(\"fill\");","        if(this._pathArray)","        {","            pathArray = this._pathArray.concat();","            while(pathArray && pathArray.length > 0)","            {","                segmentArray = pathArray.shift();","                len = segmentArray.length;","                pathType = segmentArray[0];","                if(pathType === \"A\")","                {","                    path += pathType + segmentArray[1] + \",\" + segmentArray[2];","                }","                else if(pathType == \"z\" || pathType == \"Z\")","                {","                    path += \" z \";","                }","                else if(pathType == \"C\" || pathType == \"c\")","                {","                    path += pathType + (segmentArray[1] - left)+ \",\" + (segmentArray[2] - top);","                }","                else","                {","                    path += \" \" + pathType + parseFloat(segmentArray[1] - left);","                }","                switch(pathType)","                {","                    case \"L\" :","                    case \"l\" :","                    case \"M\" :","                    case \"Q\" :","                    case \"q\" :","                        for(i = 2; i < len; ++i)","                        {","                            val = (i % 2 === 0) ? top : left;","                            val = segmentArray[i] - val;","                            path += \", \" + parseFloat(val);","                        }","                    break;","                    case \"A\" :","                        val = \" \" + parseFloat(segmentArray[3]) + \" \" + parseFloat(segmentArray[4]);","                        val += \",\" + parseFloat(segmentArray[5]) + \" \" + parseFloat(segmentArray[6] - left);","                        val += \",\" + parseFloat(segmentArray[7] - top);","                        path += \" \" + val;","                    break;","                    case \"C\" :","                    case \"c\" :","                        for(i = 3; i < len - 1; i = i + 2)","                        {","                            val = parseFloat(segmentArray[i] - left);","                            val = val + \", \";","                            val = val + parseFloat(segmentArray[i + 1] - top);","                            path += \" \" + val;","                        }","                    break;","                }","            }","            if(fill && fill.color)","            {","                path += 'z';","            }","            Y.Lang.trim(path);","            if(path)","            {","                node.setAttribute(\"d\", path);","            }","            ","            this._path = path;","            this._fillChangeHandler();","            this._strokeChangeHandler();","            this._updateTransform();","        }","    },","","    /**","     * Ends a fill and stroke","     *","     * @method closePath","     */","    closePath: function()","    {","        this._pathArray.push([\"z\"]);","    },","","    /**","     * Returns the current array of drawing commands.","     *","     * @method _getCurrentArray","     * @return Array","     * @private","     */","    _getCurrentArray: function()","    {","        var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];","        if(!currentArray)","        {","            currentArray = [];","            this._pathArray.push(currentArray);","        }","        return currentArray;","    },","    ","    /**","     * Returns the points on a curve","     *","     * @method getBezierData","     * @param Array points Array containing the begin, end and control points of a curve.","     * @param Number t The value for incrementing the next set of points.","     * @return Array","     * @private","     */","    getBezierData: function(points, t) {  ","        var n = points.length,","            tmp = [],","            i,","            j;","","        for (i = 0; i < n; ++i){","            tmp[i] = [points[i][0], points[i][1]]; // save input","        }","        ","        for (j = 1; j < n; ++j) {","            for (i = 0; i < n - j; ++i) {","                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","            }","        }","        return [ tmp[0][0], tmp[0][1] ]; ","    },","  ","    /**","     * Calculates the bounding box for a curve","     *","     * @method _setCurveBoundingBox","     * @param Array pts Array containing points for start, end and control points of a curve.","     * @param Number w Width used to calculate the number of points to describe the curve.","     * @param Number h Height used to calculate the number of points to describe the curve.","     * @private","     */","    _setCurveBoundingBox: function(pts, w, h)","    {","        var i,","            left = this._currentX,","            right = left,","            top = this._currentY,","            bottom = top,","            len = Math.round(Math.sqrt((w * w) + (h * h))),","            t = 1/len,","            xy;","        for(i = 0; i < len; ++i)","        {","            xy = this.getBezierData(pts, t * i);","            left = isNaN(left) ? xy[0] : Math.min(xy[0], left);","            right = isNaN(right) ? xy[0] : Math.max(xy[0], right);","            top = isNaN(top) ? xy[1] : Math.min(xy[1], top);","            bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);","        }","        left = Math.round(left * 10)/10;","        right = Math.round(right * 10)/10;","        top = Math.round(top * 10)/10;","        bottom = Math.round(bottom * 10)/10;","        this._trackSize(right, bottom);","        this._trackSize(left, top);","    },","    ","    /**","     * Updates the size of the graphics object","     *","     * @method _trackSize","     * @param {Number} w width","     * @param {Number} h height","     * @private","     */","    _trackSize: function(w, h) {","        if (w > this._right) {","            this._right = w;","        }","        if(w < this._left)","        {","            this._left = w;    ","        }","        if (h < this._top)","        {","            this._top = h;","        }","        if (h > this._bottom) ","        {","            this._bottom = h;","        }","        this._width = this._right - this._left;","        this._height = this._bottom - this._top;","    }","};","Y.SVGDrawing = SVGDrawing;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Shape.html\">`Shape`</a> class. "," * `SVGShape` is not intended to be used directly. Instead, use the <a href=\"Shape.html\">`Shape`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Shape.html\">`Shape`</a> "," * class will point to the `SVGShape` class."," *"," * @module graphics"," * @class SVGShape"," * @constructor"," * @param {Object} cfg (optional) Attribute configs"," */","SVGShape = function(cfg)","{","    this._transforms = [];","    this.matrix = new Y.Matrix();","    this._normalizedMatrix = new Y.Matrix();","    SVGShape.superclass.constructor.apply(this, arguments);","};","","SVGShape.NAME = \"shape\";","","Y.extend(SVGShape, Y.GraphicBase, Y.mix({","    /**","     * Storage for x attribute.","     *","     * @property _x","     * @protected","     */","    _x: 0,","","    /**","     * Storage for y attribute.","     *","     * @property _y","     * @protected","     */","    _y: 0,","    ","    /**","     * Init method, invoked during construction.","     * Calls `initializer` method.","     *","     * @method init","     * @protected","     */","	init: function()","	{","		this.initializer.apply(this, arguments);","	},","","	/**","	 * Initializes the shape","	 *","	 * @private","	 * @method initializer","	 */","	initializer: function(cfg)","	{","		var host = this,","            graphic = cfg.graphic,","            data = this.get(\"data\");","		host.createNode(); ","		if(graphic)","        {","            host._setGraphic(graphic);","        }","        if(data)","        {","            host._parsePathData(data);","        }","        host._updateHandler();","	},"," ","    /**","     * Set the Graphic instance for the shape.","     *","     * @method _setGraphic","     * @param {Graphic | Node | HTMLElement | String} render This param is used to determine the graphic instance. If it is a `Graphic` instance, it will be assigned","     * to the `graphic` attribute. Otherwise, a new Graphic instance will be created and rendered into the dom element that the render represents.","     * @private","     */","    _setGraphic: function(render)","    {","        var graphic;","        if(render instanceof Y.SVGGraphic)","        {","		    this._graphic = render;","        }","        else","        {","            render = Y.one(render);","            graphic = new Y.SVGGraphic({","                render: render","            });","            graphic._appendShape(this);","            this._graphic = graphic;","        }","    },","","	/**","	 * Add a class name to each node.","	 *","	 * @method addClass","	 * @param {String} className the class name to add to the node's class attribute ","	 */","	addClass: function(className)","	{","		var node = this.node;","		node.className.baseVal = Y_LANG.trim([node.className.baseVal, className].join(' '));","	},","","	/**","	 * Removes a class name from each node.","	 *","	 * @method removeClass","	 * @param {String} className the class name to remove from the node's class attribute","	 */","	removeClass: function(className)","	{","		var node = this.node,","			classString = node.className.baseVal;","		classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');","		node.className.baseVal = classString;","	},","","	/**","	 * Gets the current position of the node in page coordinates.","	 *","	 * @method getXY","	 * @return Array The XY position of the shape.","	 */","	getXY: function()","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY(),","			x = this._x,","			y = this._y;","		return [parentXY[0] + x, parentXY[1] + y];","	},","","	/**","	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.","	 *","	 * @method setXY","	 * @param {Array} Contains x & y values for new position (coordinates are page-based)","	 */","	setXY: function(xy)","	{","		var graphic = this._graphic,","			parentXY = graphic.getXY();","		this._x = xy[0] - parentXY[0];","		this._y = xy[1] - parentXY[1];","        this.set(\"transform\", this.get(\"transform\"));","	},","","	/**","	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. ","	 *","	 * @method contains","	 * @param {SVGShape | HTMLElement} needle The possible node or descendent","	 * @return Boolean Whether or not this shape is the needle or its ancestor.","	 */","	contains: function(needle)","	{","		return needle === Y.one(this.node);","	},","","	/**","	 * Compares nodes to determine if they match.","	 * Node instances can be compared to each other and/or HTMLElements.","	 * @method compareTo","	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.","	 * @return {Boolean} True if the nodes match, false if they do not.","	 */","	compareTo: function(refNode) {","		var node = this.node;","","		return node === refNode;","	},","","	/**","	 * Test if the supplied node matches the supplied selector.","	 *","	 * @method test","	 * @param {String} selector The CSS selector to test against.","	 * @return Boolean Wheter or not the shape matches the selector.","	 */","	test: function(selector)","	{","		return Y.Selector.test(this.node, selector);","	},","	","	/**","	 * Value function for fill attribute","	 *","	 * @private","	 * @method _getDefaultFill","	 * @return Object","	 */","	_getDefaultFill: function() {","		return {","			type: \"solid\",","			opacity: 1,","			cx: 0.5,","			cy: 0.5,","			fx: 0.5,","			fy: 0.5,","			r: 0.5","		};","	},","	","	/**","	 * Value function for stroke attribute","	 *","	 * @private","	 * @method _getDefaultStroke","	 * @return Object","	 */","	_getDefaultStroke: function() ","	{","		return {","			weight: 1,","			dashstyle: \"none\",","			color: \"#000\",","			opacity: 1.0","		};","	},","","	/**","	 * Creates the dom node for the shape.","	 *","     * @method createNode","	 * @return HTMLElement","	 * @private","	 */","	createNode: function()","	{","		var host = this,","            node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + this._type),","			id = host.get(\"id\"),","            name = host.name,","            concat = host._camelCaseConcat,","			pointerEvents = host.get(\"pointerEvents\");","		host.node = node;","		host.addClass(_getClassName(SHAPE) + \" \" + _getClassName(concat(IMPLEMENTATION, SHAPE)) + \" \" + _getClassName(name) + \" \" + _getClassName(concat(IMPLEMENTATION, name))); ","        if(id)","		{","			node.setAttribute(\"id\", id);","		}","		if(pointerEvents)","		{","			node.setAttribute(\"pointer-events\", pointerEvents);","		}","        if(!host.get(\"visible\"))","        {","            Y.one(node).setStyle(\"visibility\", \"hidden\");","        }","	},","	","","	/**","     * Overrides default `on` method. Checks to see if its a dom interaction event. If so, ","     * return an event attached to the `node` element. If not, return the normal functionality.","     *","     * @method on","     * @param {String} type event type","     * @param {Object} callback function","	 * @private","	 */","	on: function(type, fn)","	{","		if(Y.Node.DOM_EVENTS[type])","		{","			return Y.one(\"#\" +  this.get(\"id\")).on(type, fn);","		}","		return Y.on.apply(this, arguments);","	},","","	/**","	 * Adds a stroke to the shape node.","	 *","	 * @method _strokeChangeHandler","	 * @private","	 */","	_strokeChangeHandler: function(e)","	{","		var node = this.node,","			stroke = this.get(\"stroke\"),","			strokeOpacity,","			dashstyle,","			dash,","			linejoin;","		if(stroke && stroke.weight && stroke.weight > 0)","		{","			linejoin = stroke.linejoin || \"round\";","			strokeOpacity = parseFloat(stroke.opacity);","			dashstyle = stroke.dashstyle || \"none\";","			dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;","			stroke.color = stroke.color || \"#000000\";","			stroke.weight = stroke.weight || 1;","			stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;","			stroke.linecap = stroke.linecap || \"butt\";","			node.setAttribute(\"stroke-dasharray\", dash);","			node.setAttribute(\"stroke\", stroke.color);","			node.setAttribute(\"stroke-linecap\", stroke.linecap);","			node.setAttribute(\"stroke-width\",  stroke.weight);","			node.setAttribute(\"stroke-opacity\", stroke.opacity);","			if(linejoin == \"round\" || linejoin == \"bevel\")","			{","				node.setAttribute(\"stroke-linejoin\", linejoin);","			}","			else","			{","				linejoin = parseInt(linejoin, 10);","				if(Y_LANG.isNumber(linejoin))","				{","					node.setAttribute(\"stroke-miterlimit\",  Math.max(linejoin, 1));","					node.setAttribute(\"stroke-linejoin\", \"miter\");","				}","			}","		}","		else","		{","			node.setAttribute(\"stroke\", \"none\");","		}","	},","	","	/**","	 * Adds a fill to the shape node.","	 *","	 * @method _fillChangeHandler","	 * @private","	 */","	_fillChangeHandler: function(e)","	{","		var node = this.node,","			fill = this.get(\"fill\"),","			fillOpacity,","			type;","		if(fill)","		{","			type = fill.type;","			if(type == \"linear\" || type == \"radial\")","			{","				this._setGradientFill(fill);","				node.setAttribute(\"fill\", \"url(#grad\" + this.get(\"id\") + \")\");","			}","			else if(!fill.color)","			{","				node.setAttribute(\"fill\", \"none\");","			}","			else","			{","                fillOpacity = parseFloat(fill.opacity);","				fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;","				node.setAttribute(\"fill\", fill.color);","				node.setAttribute(\"fill-opacity\", fillOpacity);","			}","		}","		else","		{","			node.setAttribute(\"fill\", \"none\");","		}","	},","","	/**","	 * Creates a gradient fill","	 *","	 * @method _setGradientFill","	 * @param {String} type gradient type","	 * @private","	 */","	_setGradientFill: function(fill) {","		var offset,","			opacity,","			color,","			stopNode,","            newStop,","			isNumber = Y_LANG.isNumber,","			graphic = this._graphic,","			type = fill.type, ","			gradientNode = graphic.getGradientNode(\"grad\" + this.get(\"id\"), type),","			stops = fill.stops,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			rotation = fill.rotation || 0,","			radCon = Math.PI/180,","            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),","            i,","			len,","			def,","			stop,","			x1 = \"0%\", ","			x2 = \"100%\", ","			y1 = \"0%\", ","			y2 = \"0%\",","			cx = fill.cx,","			cy = fill.cy,","			fx = fill.fx,","			fy = fill.fy,","			r = fill.r,","            stopNodes = [];","		if(type == \"linear\")","		{","            cx = w/2;","            cy = h/2;","            if(Math.abs(tanRadians) * w/2 >= h/2)","            {","                if(rotation < 180)","                {","                    y1 = 0;","                    y2 = h;","                }","                else","                {","                    y1 = h;","                    y2 = 0;","                }","                x1 = cx - ((cy - y1)/tanRadians);","                x2 = cx - ((cy - y2)/tanRadians); ","            }","            else","            {","                if(rotation > 90 && rotation < 270)","                {","                    x1 = w;","                    x2 = 0;","                }","                else","                {","                    x1 = 0;","                    x2 = w;","                }","                y1 = ((tanRadians * (cx - x1)) - cy) * -1;","                y2 = ((tanRadians * (cx - x2)) - cy) * -1;","            }","","            x1 = Math.round(100 * x1/w);","            x2 = Math.round(100 * x2/w);","            y1 = Math.round(100 * y1/h);","            y2 = Math.round(100 * y2/h);","            ","            //Set default value if not valid ","            x1 = isNumber(x1) ? x1 : 0;","            x2 = isNumber(x2) ? x2 : 100;","            y1 = isNumber(y1) ? y1 : 0;","            y2 = isNumber(y2) ? y2 : 0;","            ","            gradientNode.setAttribute(\"spreadMethod\", \"pad\");","			gradientNode.setAttribute(\"width\", w);","			gradientNode.setAttribute(\"height\", h);","            gradientNode.setAttribute(\"x1\", x1 + \"%\");","            gradientNode.setAttribute(\"x2\", x2 + \"%\");","            gradientNode.setAttribute(\"y1\", y1 + \"%\");","            gradientNode.setAttribute(\"y2\", y2 + \"%\");","		}","		else","		{","			gradientNode.setAttribute(\"cx\", (cx * 100) + \"%\");","			gradientNode.setAttribute(\"cy\", (cy * 100) + \"%\");","			gradientNode.setAttribute(\"fx\", (fx * 100) + \"%\");","			gradientNode.setAttribute(\"fy\", (fy * 100) + \"%\");","			gradientNode.setAttribute(\"r\", (r * 100) + \"%\");","		}","		","		len = stops.length;","		def = 0;","        for(i = 0; i < len; ++i)","		{","            if(this._stops && this._stops.length > 0)","            {","                stopNode = this._stops.shift();","                newStop = false;","            }","            else","            {","			    stopNode = graphic._createGraphicNode(\"stop\");","                newStop = true;","            }","			stop = stops[i];","			opacity = stop.opacity;","			color = stop.color;","			offset = stop.offset || i/(len - 1);","			offset = Math.round(offset * 100) + \"%\";","			opacity = isNumber(opacity) ? opacity : 1;","			opacity = Math.max(0, Math.min(1, opacity));","			def = (i + 1) / len;","			stopNode.setAttribute(\"offset\", offset);","			stopNode.setAttribute(\"stop-color\", color);","			stopNode.setAttribute(\"stop-opacity\", opacity);","			if(newStop)","            {","                gradientNode.appendChild(stopNode);","            }","            stopNodes.push(stopNode);","		}","        while(this._stops && this._stops.length > 0)","        {","            gradientNode.removeChild(this._stops.shift());","        }","        this._stops = stopNodes;","	},","","    _stops: null,","","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function() ","	{","		var host = this;","		AttributeLite.prototype.set.apply(host, arguments);","		if(host.initialized)","		{","			host._updateHandler();","		}","	},","","	/**","	 * Specifies a 2d translation.","	 *","	 * @method translate","	 * @param {Number} x The value to transate on the x-axis.","	 * @param {Number} y The value to translate on the y-axis.","	 */","	translate: function(x, y)","	{","		this._addTransform(\"translate\", arguments);","	},","","	/**","	 * Translates the shape along the x-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateX","	 * @param {Number} x The value to translate.","	 */","	translateX: function(x)","    {","        this._addTransform(\"translateX\", arguments);","    },","","	/**","	 * Translates the shape along the y-axis. When translating x and y coordinates,","	 * use the `translate` method.","	 *","	 * @method translateY","	 * @param {Number} y The value to translate.","	 */","	translateY: function(y)","    {","        this._addTransform(\"translateY\", arguments);","    },","","    /**","     * Skews the shape around the x-axis and y-axis.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y)","    {","        this._addTransform(\"skew\", arguments);","    },","","	/**","	 * Skews the shape around the x-axis.","	 *","	 * @method skewX","	 * @param {Number} x x-coordinate","	 */","	 skewX: function(x)","	 {","		this._addTransform(\"skewX\", arguments);","	 },","","	/**","	 * Skews the shape around the y-axis.","	 *","	 * @method skewY","	 * @param {Number} y y-coordinate","	 */","	 skewY: function(y)","	 {","		this._addTransform(\"skewY\", arguments);","	 },","","	/**","	 * Rotates the shape clockwise around it transformOrigin.","	 *","	 * @method rotate","	 * @param {Number} deg The degree of the rotation.","	 */","	 rotate: function(deg)","	 {","		this._addTransform(\"rotate\", arguments);","	 },","","	/**","	 * Specifies a 2d scaling operation.","	 *","	 * @method scale","	 * @param {Number} val","	 */","	scale: function(x, y)","	{","		this._addTransform(\"scale\", arguments);","	},","","    /**","     * Adds a transform to the shape.","     *","     * @method _addTransform","     * @param {String} type The transform being applied.","     * @param {Array} args The arguments for the transform.","	 * @private","	 */","	_addTransform: function(type, args)","	{","        args = Y.Array(args);","        this._transform = Y_LANG.trim(this._transform + \" \" + type + \"(\" + args.join(\", \") + \")\");","        args.unshift(type);","        this._transforms.push(args);","        if(this.initialized)","        {","            this._updateTransform();","        }","	},","","	/**","     * Applies all transforms.","     *","     * @method _updateTransform","	 * @private","	 */","	_updateTransform: function()","	{","		var isPath = this._type == \"path\",","		    node = this.node,","			key,","			transform,","			transformOrigin,","			x,","			y,","            tx,","            ty,","            matrix = this.matrix,","            normalizedMatrix = this._normalizedMatrix,","            i,","            len = this._transforms.length;","","        if(isPath || (this._transforms && this._transforms.length > 0))","		{","            x = this._x;","            y = this._y;","            transformOrigin = this.get(\"transformOrigin\");","            tx = x + (transformOrigin[0] * this.get(\"width\"));","            ty = y + (transformOrigin[1] * this.get(\"height\")); ","            //need to use translate for x/y coords","            if(isPath)","            {","                //adjust origin for custom shapes ","                if(!(this instanceof Y.SVGPath))","                {","                    tx = this._left + (transformOrigin[0] * this.get(\"width\"));","                    ty = this._top + (transformOrigin[1] * this.get(\"height\"));","                }","                normalizedMatrix.init({dx: x + this._left, dy: y + this._top});","            }","            normalizedMatrix.translate(tx, ty);","            for(i = 0; i < len; ++i)","            {","                key = this._transforms[i].shift();","                if(key)","                {","                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);","                    matrix[key].apply(matrix, this._transforms[i]); ","                }","                if(isPath)","                {","                    this._transforms[i].unshift(key);","                }","			}","            normalizedMatrix.translate(-tx, -ty);","            transform = \"matrix(\" + normalizedMatrix.a + \",\" + ","                            normalizedMatrix.b + \",\" + ","                            normalizedMatrix.c + \",\" + ","                            normalizedMatrix.d + \",\" + ","                            normalizedMatrix.dx + \",\" +","                            normalizedMatrix.dy + \")\";","		}","        this._graphic.addToRedrawQueue(this);    ","        if(transform)","		{","            node.setAttribute(\"transform\", transform);","        }","        if(!isPath)","        {","            this._transforms = [];","        }","	},","","	/**","	 * Draws the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node;","		node.setAttribute(\"width\", this.get(\"width\"));","		node.setAttribute(\"height\", this.get(\"height\"));","		node.setAttribute(\"x\", this._x);","		node.setAttribute(\"y\", this._y);","		node.style.left = this._x + \"px\";","		node.style.top = this._y + \"px\";","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	},","","	/**","     * Updates `Shape` based on attribute changes.","     *","     * @method _updateHandler","	 * @private","	 */","	_updateHandler: function(e)","	{","		this._draw();","	},","    ","    /**","     * Storage for the transform attribute.","     *","     * @property _transform","     * @type String","     * @private","     */","    _transform: \"\",","","	/**","	 * Returns the bounds for a shape.","	 *","     * Calculates the a new bounding box from the original corner coordinates (base on size and position) and the transform matrix.","     * The calculated bounding box is used by the graphic instance to calculate its viewBox. ","     *","	 * @method getBounds","	 * @return Object","	 */","	getBounds: function()","	{","		var type = this._type,","			stroke = this.get(\"stroke\"),","            w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = type == \"path\" ? 0 : this._x,","			y = type == \"path\" ? 0 : this._y,","            wt = 0;","        if(type != \"path\")","        {","            if(stroke && stroke.weight)","            {","                wt = stroke.weight;","            }","            w = (x + w + wt) - (x - wt); ","            h = (y + h + wt) - (y - wt);","            x -= wt;","            y -= wt;","        }","		return this._normalizedMatrix.getContentRect(w, h, x, y);","	},","","    /**","     * Places the shape above all other shapes.","     *","     * @method toFront","     */","    toFront: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toFront(this);","        }","    },","","    /**","     * Places the shape underneath all other shapes.","     *","     * @method toFront","     */","    toBack: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic._toBack(this);","        }","    },","","    /**","     * Parses path data string and call mapped methods.","     *","     * @method _parsePathData","     * @param {String} val The path data","     * @private","     */","    _parsePathData: function(val)","    {","        var method,","            methodSymbol,","            args,","            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),","            i,","            len, ","            str,","            symbolToMethod = this._pathSymbolToMethod;","        if(commandArray)","        {","            this.clear();","            len = commandArray.length || 0;","            for(i = 0; i < len; i = i + 1)","            {","                str = commandArray[i];","                methodSymbol = str.substr(0, 1);","                args = str.substr(1).match(SPLITARGSPATTERN);","                method = symbolToMethod[methodSymbol];","                if(method)","                {","                    if(args)","                    {","                        this[method].apply(this, args);","                    }","                    else","                    {","                        this[method].apply(this);","                    }","                }","            }","            this.end();","        }","    },","","    /**","     * Destroys the shape instance.","     *","     * @method destroy","     */","    destroy: function()","    {","        var graphic = this.get(\"graphic\");","        if(graphic)","        {","            graphic.removeShape(this);","        }","        else","        {","            this._destroy();","        }","    },","","    /**","     *  Implementation for shape destruction","     *","     *  @method destroy","     *  @protected","     */","    _destroy: function()","    {","        if(this.node)","        {","            Y.Event.purgeElement(this.node, true);","            if(this.node.parentNode)","            {","                this.node.parentNode.removeChild(this.node);","            }","            this.node = null;","        }","    }"," }, Y.SVGDrawing.prototype));","	","SVGShape.ATTRS = {","	/**","	 * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a ","	 * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].","	 *","	 * @config transformOrigin","	 * @type Array","	 */","	transformOrigin: {","		valueFn: function()","		{","			return [0.5, 0.5];","		}","	},","	","    /**","     * <p>A string containing, in order, transform operations applied to the shape instance. The `transform` string can contain the following values:","     *     ","     *    <dl>","     *        <dt>rotate</dt><dd>Rotates the shape clockwise around it transformOrigin.</dd>","     *        <dt>translate</dt><dd>Specifies a 2d translation.</dd>","     *        <dt>skew</dt><dd>Skews the shape around the x-axis and y-axis.</dd>","     *        <dt>scale</dt><dd>Specifies a 2d scaling operation.</dd>","     *        <dt>translateX</dt><dd>Translates the shape along the x-axis.</dd>","     *        <dt>translateY</dt><dd>Translates the shape along the y-axis.</dd>","     *        <dt>skewX</dt><dd>Skews the shape around the x-axis.</dd>","     *        <dt>skewY</dt><dd>Skews the shape around the y-axis.</dd>","     *        <dt>matrix</dt><dd>Specifies a 2D transformation matrix comprised of the specified six values.</dd>      ","     *    </dl>","     * </p>","     * <p>Applying transforms through the transform attribute will reset the transform matrix and apply a new transform. The shape class also contains corresponding methods for each transform","     * that will apply the transform to the current matrix. The below code illustrates how you might use the `transform` attribute to instantiate a recangle with a rotation of 45 degrees.</p>","            var myRect = new Y.Rect({","                type:\"rect\",","                width: 50,","                height: 40,","                transform: \"rotate(45)\"","            };","     * <p>The code below would apply `translate` and `rotate` to an existing shape.</p>","    ","        myRect.set(\"transform\", \"translate(40, 50) rotate(45)\");","	 * @config transform","     * @type String  ","	 */","	transform: {","		setter: function(val)","        {","            this.matrix.init();	","            this._normalizedMatrix.init();","		    this._transforms = this.matrix.getTransformArray(val);","            this._transform = val;","            return val;","		},","","        getter: function()","        {","            return this._transform;","        }","	},","","	/**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","	/**","	 * Indicates the x position of shape.","	 *","	 * @config x","	 * @type Number","	 */","	x: {","	    getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._x = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the y position of shape.","	 *","	 * @config y","	 * @type Number","	 */","	y: {","	    getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            var transform = this.get(\"transform\");","            this._y = val;","            if(transform) ","            {","                this.set(\"transform\", transform);","            }","        }","	},","","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","	width: {","        value: 0","    },","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","        value: 0","    },","","	/**","	 * Indicates whether the shape is visible.","	 *","	 * @config visible","	 * @type Boolean","	 */","	visible: {","		value: true,","","		setter: function(val){","			var visibility = val ? \"visible\" : \"hidden\";","			if(this.node)","            {","                this.node.style.visibility = visibility;","            }","			return val;","		}","	},","","	/**","	 * Contains information about the fill of the shape. ","     *  <dl>","     *      <dt>color</dt><dd>The color of the fill.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>","     *      <dt>type</dt><dd>Type of fill.","     *          <dl>","     *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>","     *              <dt>linear</dt><dd>Linear gradient fill.</dd>","     *              <dt>radial</dt><dd>Radial gradient fill.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","     *  <p>If a `linear` or `radial` is specified as the fill type. The following additional property is used:","     *  <dl>","     *      <dt>stops</dt><dd>An array of objects containing the following properties:","     *          <dl>","     *              <dt>color</dt><dd>The color of the stop.</dd>","     *              <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stop. The default value is 1. Note: No effect for IE 6 - 8</dd>","     *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> ","     *          </dl>","     *      </dd>","     *      <p>Linear gradients also have the following property:</p>","     *      <dt>rotation</dt><dd>Linear gradients flow left to right by default. The rotation property allows you to change the flow by rotation. (e.g. A rotation of 180 would make the gradient pain from right to left.)</dd>","     *      <p>Radial gradients have the following additional properties:</p>","     *      <dt>r</dt><dd>Radius of the gradient circle.</dd>","     *      <dt>fx</dt><dd>Focal point x-coordinate of the gradient.</dd>","     *      <dt>fy</dt><dd>Focal point y-coordinate of the gradient.</dd>","     *      <dt>cx</dt><dd>","     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *      <dt>cy</dt><dd>","     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>","     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>","     *      </dd>","     *  </dl>","	 *","	 * @config fill","	 * @type Object ","	 */","	fill: {","		valueFn: \"_getDefaultFill\",","		","		setter: function(val)","		{","			var fill,","				tmpl = this.get(\"fill\") || this._getDefaultFill();","			fill = (val) ? Y.merge(tmpl, val) : null;","			if(fill && fill.color)","			{","				if(fill.color === undefined || fill.color == \"none\")","				{","					fill.color = null;","				}","			}","			return fill;","		}","	},","","	/**","	 * Contains information about the stroke of the shape.","     *  <dl>","     *      <dt>color</dt><dd>The color of the stroke.</dd>","     *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>","     *      <dt>opacity</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>","     *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to \"none\", a solid stroke is drawn. When set to an array, the first index indicates the","     *  length of the dash. The second index indicates the length of gap.","     *      <dt>linecap</dt><dd>Specifies the linecap for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>butt (default)</dt><dd>Specifies a butt linecap.</dd>","     *              <dt>square</dt><dd>Specifies a sqare linecap.</dd>","     *              <dt>round</dt><dd>Specifies a round linecap.</dd>","     *          </dl>","     *      </dd>","     *      <dt>linejoin</dt><dd>Specifies a linejoin for the stroke. The following values can be specified:","     *          <dl>","     *              <dt>round (default)</dt><dd>Specifies that the linejoin will be round.</dd>","     *              <dt>bevel</dt><dd>Specifies a bevel for the linejoin.</dd>","     *              <dt>miter limit</dt><dd>An integer specifying the miter limit of a miter linejoin. If you want to specify a linejoin of miter, you simply specify the limit as opposed to having","     *  separate miter and miter limit values.</dd>","     *          </dl>","     *      </dd>","     *  </dl>","	 *","	 * @config stroke","	 * @type Object","	 */","	stroke: {","		valueFn: \"_getDefaultStroke\",","","		setter: function(val)","		{","			var tmpl = this.get(\"stroke\") || this._getDefaultStroke(),","                wt;","            if(val && val.hasOwnProperty(\"weight\"))","            {","                wt = parseInt(val.weight, 10);","                if(!isNaN(wt))","                {","                    val.weight = wt;","                }","            }","            return (val) ? Y.merge(tmpl, val) : null;","		}","	},","	","	// Only implemented in SVG","	// Determines whether the instance will receive mouse events.","	// ","	// @config pointerEvents","	// @type string","	//","	pointerEvents: {","		valueFn: function() ","		{","			var val = \"visiblePainted\",","				node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		},","","		setter: function(val)","		{","			var node = this.node;","			if(node)","			{","				node.setAttribute(\"pointer-events\", val);","			}","			return val;","		}","	},","","	/**","	 * Dom node for the shape.","	 *","	 * @config node","	 * @type HTMLElement","	 * @readOnly","	 */","	node: {","		readOnly: true,","","		getter: function()","		{","			return this.node;","		}","	},","","    /**","     * Represents an SVG Path string. This will be parsed and added to shape's API to represent the SVG data across all implementations. Note that when using VML or SVG ","     * implementations, part of this content will be added to the DOM using respective VML/SVG attributes. If your content comes from an untrusted source, you will need ","     * to ensure that no malicious code is included in that content. ","     *","     * @config data","     * @type String","     */","    data: {","        setter: function(val)","        {","            if(this.get(\"node\"))","            {","                this._parsePathData(val);","            }","            return val;","        }","    },","","	/**","	 * Reference to the parent graphic instance","	 *","	 * @config graphic","	 * @type SVGGraphic","	 * @readOnly","	 */","	graphic: {","		readOnly: true,","","		getter: function()","		{","			return this._graphic;","		}","	}","};","Y.SVGShape = SVGShape;","","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Path.html\">`Path`</a> class. "," * `SVGPath` is not intended to be used directly. Instead, use the <a href=\"Path.html\">`Path`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Path.html\">`Path`</a> "," * class will point to the `SVGPath` class."," *"," * @module graphics"," * @class SVGPath"," * @extends SVGShape"," * @constructor"," */","SVGPath = function(cfg)","{","	SVGPath.superclass.constructor.apply(this, arguments);","};","SVGPath.NAME = \"path\";","Y.extend(SVGPath, Y.SVGShape, {","    /**","     * Left edge of the path","     *","     * @property _left","     * @type Number","     * @private","     */","    _left: 0,","","    /**","     * Right edge of the path","     *","     * @property _right","     * @type Number","     * @private","     */","    _right: 0,","    ","    /**","     * Top edge of the path","     *","     * @property _top","     * @type Number","     * @private","     */","    _top: 0, ","    ","    /**","     * Bottom edge of the path","     *","     * @property _bottom","     * @type Number","     * @private","     */","    _bottom: 0,","","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @readOnly","     * @type String","     * @private","     */","    _type: \"path\",","","    /**","     * Storage for path","     *","     * @property _path","     * @type String","     * @private","     */","	_path: \"\"","});","","SVGPath.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the path used for the node.","	 *","	 * @config path","	 * @type String","     * @readOnly","	 */","	path: {","		readOnly: true,","","		getter: function()","		{","			return this._path;","		}","	},","","	/**","	 * Indicates the width of the shape","	 * ","	 * @config width","	 * @type Number","	 */","	width: {","		getter: function()","		{","			var val = Math.max(this._right - this._left, 0);","			return val;","		}","	},","","	/**","	 * Indicates the height of the shape","	 * ","	 * @config height","	 * @type Number","	 */","	height: {","		getter: function()","		{","			return Math.max(this._bottom - this._top, 0);","		}","	}","});","Y.SVGPath = SVGPath;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Rect.html\">`Rect`</a> class. "," * `SVGRect` is not intended to be used directly. Instead, use the <a href=\"Rect.html\">`Rect`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Rect.html\">`Rect`</a> "," * class will point to the `SVGRect` class."," *"," * @module graphics"," * @class SVGRect"," * @constructor"," */","SVGRect = function()","{","	SVGRect.superclass.constructor.apply(this, arguments);","};","SVGRect.NAME = \"rect\";","Y.extend(SVGRect, Y.SVGShape, {","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"rect\""," });","SVGRect.ATTRS = Y.SVGShape.ATTRS;","Y.SVGRect = SVGRect;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * `SVGEllipse` is not intended to be used directly. Instead, use the <a href=\"Ellipse.html\">`Ellipse`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Ellipse.html\">`Ellipse`</a> "," * class will point to the `SVGEllipse` class."," *"," * @module graphics"," * @class SVGEllipse"," * @constructor"," */","SVGEllipse = function(cfg)","{","	SVGEllipse.superclass.constructor.apply(this, arguments);","};","","SVGEllipse.NAME = \"ellipse\";","","Y.extend(SVGEllipse, SVGShape, {","	/**","	 * Indicates the type of shape","	 *","	 * @property _type","	 * @type String","     * @private","	 */","	_type: \"ellipse\",","","	/**","	 * Updates the shape.","	 *","	 * @method _draw","	 * @private","	 */","	_draw: function()","	{","		var node = this.node,","			w = this.get(\"width\"),","			h = this.get(\"height\"),","			x = this.get(\"x\"),","			y = this.get(\"y\"),","			xRadius = w * 0.5,","			yRadius = h * 0.5,","			cx = x + xRadius,","			cy = y + yRadius;","		node.setAttribute(\"rx\", xRadius);","		node.setAttribute(\"ry\", yRadius);","		node.setAttribute(\"cx\", cx);","		node.setAttribute(\"cy\", cy);","		this._fillChangeHandler();","		this._strokeChangeHandler();","		this._updateTransform();","	}","});","","SVGEllipse.ATTRS = Y.merge(SVGShape.ATTRS, {","	/**","	 * Horizontal radius for the ellipse. ","	 *","	 * @config xRadius","	 * @type Number","	 */","	xRadius: {","		setter: function(val)","		{","			this.set(\"width\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"width\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	},","","	/**","	 * Vertical radius for the ellipse. ","	 *","	 * @config yRadius","	 * @type Number","	 * @readOnly","	 */","	yRadius: {","		setter: function(val)","		{","			this.set(\"height\", val * 2);","		},","","		getter: function()","		{","			var val = this.get(\"height\");","			if(val) ","			{","				val *= 0.5;","			}","			return val;","		}","	}","});","Y.SVGEllipse = SVGEllipse;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Circle.html\">`Circle`</a> class. "," * `SVGCircle` is not intended to be used directly. Instead, use the <a href=\"Circle.html\">`Circle`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Circle.html\">`Circle`</a> "," * class will point to the `SVGCircle` class."," *"," * @module graphics"," * @class SVGCircle"," * @constructor"," */"," SVGCircle = function(cfg)"," {","    SVGCircle.superclass.constructor.apply(this, arguments);"," };","    "," SVGCircle.NAME = \"circle\";",""," Y.extend(SVGCircle, Y.SVGShape, {    ","    ","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"circle\",","","    /**","     * Updates the shape.","     *","     * @method _draw","     * @private","     */","    _draw: function()","    {","        var node = this.node,","            x = this.get(\"x\"),","            y = this.get(\"y\"),","            radius = this.get(\"radius\"),","            cx = x + radius,","            cy = y + radius;","        node.setAttribute(\"r\", radius);","        node.setAttribute(\"cx\", cx);","        node.setAttribute(\"cy\", cy);","        this._fillChangeHandler();","        this._strokeChangeHandler();","        this._updateTransform();","    }"," });","    ","SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {","	/**","	 * Indicates the width of the shape","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","	/**","	 * Indicates the height of the shape","	 *","	 * @config height","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            this.set(\"radius\", val/2);","            return val;","        },","","        getter: function()","        {","            return this.get(\"radius\") * 2;","        }","    },","","    /**","     * Radius of the circle","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","});","Y.SVGCircle = SVGCircle;","/**"," * Draws pie slices"," *"," * @module graphics"," * @class SVGPieSlice"," * @constructor"," */","SVGPieSlice = function()","{","	SVGPieSlice.superclass.constructor.apply(this, arguments);","};","SVGPieSlice.NAME = \"svgPieSlice\";","Y.extend(SVGPieSlice, Y.SVGShape, Y.mix({","    /**","     * Indicates the type of shape","     *","     * @property _type","     * @type String","     * @private","     */","    _type: \"path\",","","	/**","	 * Change event listener","	 *","	 * @private","	 * @method _updateHandler","	 */","	_draw: function(e)","	{","        var x = this.get(\"cx\"),","            y = this.get(\"cy\"),","            startAngle = this.get(\"startAngle\"),","            arc = this.get(\"arc\"),","            radius = this.get(\"radius\");","        this.clear();","        this.drawWedge(x, y, startAngle, arc, radius);","		this.end();","	}"," }, Y.SVGDrawing.prototype));","SVGPieSlice.ATTRS = Y.mix({","    cx: {","        value: 0","    },","","    cy: {","        value: 0","    },","    /**","     * Starting angle in relation to a circle in which to begin the pie slice drawing.","     *","     * @config startAngle","     * @type Number","     */","    startAngle: {","        value: 0","    },","","    /**","     * Arc of the slice.","     *","     * @config arc","     * @type Number","     */","    arc: {","        value: 0","    },","","    /**","     * Radius of the circle in which the pie slice is drawn","     *","     * @config radius","     * @type Number","     */","    radius: {","        value: 0","    }","}, Y.SVGShape.ATTRS);","Y.SVGPieSlice = SVGPieSlice;","/**"," * <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> implementation of the <a href=\"Graphic.html\">`Graphic`</a> class. "," * `SVGGraphic` is not intended to be used directly. Instead, use the <a href=\"Graphic.html\">`Graphic`</a> class. "," * If the browser has <a href=\"http://www.w3.org/TR/SVG/\">SVG</a> capabilities, the <a href=\"Graphic.html\">`Graphic`</a> "," * class will point to the `SVGGraphic` class."," *"," * @module graphics"," * @class SVGGraphic"," * @constructor"," */","SVGGraphic = function(cfg) {","    SVGGraphic.superclass.constructor.apply(this, arguments);","};","","SVGGraphic.NAME = \"svgGraphic\";","","SVGGraphic.ATTRS = {","    /**","     * Whether or not to render the `Graphic` automatically after to a specified parent node after init. This can be a Node instance or a CSS selector string.","     * ","     * @config render","     * @type Node | String ","     */","    render: {},","	","    /**","	 * Unique id for class instance.","	 *","	 * @config id","	 * @type String","	 */","	id: {","		valueFn: function()","		{","			return Y.guid();","		},","","		setter: function(val)","		{","			var node = this._node;","			if(node)","			{","				node.setAttribute(\"id\", val);","			}","			return val;","		}","	},","","    /**","     * Key value pairs in which a shape instance is associated with its id.","     *","     *  @config shapes","     *  @type Object","     *  @readOnly","     */","    shapes: {","        readOnly: true,","","        getter: function()","        {","            return this._shapes;","        }","    },","","    /**","     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.","     *","     *  @config contentBounds","     *  @type Object ","     *  @readOnly","     */","    contentBounds: {","        readOnly: true,","","        getter: function()","        {","            return this._contentBounds;","        }","    },","","    /**","     *  The html element that represents to coordinate system of the Graphic instance.","     *","     *  @config node","     *  @type HTMLElement","     *  @readOnly","     */","    node: {","        readOnly: true,","","        getter: function()","        {","            return this._node;","        }","    },","    ","	/**","	 * Indicates the width of the `Graphic`. ","	 *","	 * @config width","	 * @type Number","	 */","    width: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.width = val + \"px\";","            }","            return val; ","        }","    },","","	/**","	 * Indicates the height of the `Graphic`. ","	 *","	 * @config height ","	 * @type Number","	 */","    height: {","        setter: function(val)","        {","            if(this._node)","            {","                this._node.style.height = val  + \"px\";","            }","            return val;","        }","    },","","    /**","     *  Determines the sizing of the Graphic. ","     *","     *  <dl>","     *      <dt>sizeContentToGraphic</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The content contained in the Graphic will be sized to fit with in the Graphic instance's ","     *      dimensions. When using this setting, the <code>preserveAspectRatio</code> attribute will determine how the contents are sized.</dd>","     *      <dt>sizeGraphicToContent</dt><dd>(Also accepts a value of true) The Graphic's width and height are determined by the size and positioning of the content.</dd>","     *      <dt>false</dt><dd>The Graphic's width and height attributes are, either explicitly set through the <code>width</code> and <code>height</code>","     *      attributes or are determined by the dimensions of the parent element. The contents of the Graphic instance are not affected by this setting.</dd>","     *  </dl>","     *","     *","     *  @config autoSize","     *  @type Boolean | String","     *  @default false","     */","    autoSize: {","        value: false","    },","    ","    /**","     * Determines how content is sized when <code>autoSize</code> is set to <code>sizeContentToGraphic</code>.","     *","     *  <dl>","     *      <dt>none<dt><dd>Do not force uniform scaling. Scale the graphic content of the given element non-uniformly if necessary ","     *      such that the element's bounding box exactly matches the viewport rectangle.</dd>","     *      <dt>xMinYMin</dt><dd>Force uniform scaling position along the top left of the Graphic's node.</dd>","     *      <dt>xMidYMin</dt><dd>Force uniform scaling horizontally centered and positioned at the top of the Graphic's node.<dd>","     *      <dt>xMaxYMin</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the top.</dd>","     *      <dt>xMinYMid</dt>Force uniform scaling positioned horizontally from the left and vertically centered.</dd>","     *      <dt>xMidYMid (the default)</dt><dd>Force uniform scaling with the content centered.</dd>","     *      <dt>xMaxYMid</dt><dd>Force uniform scaling positioned horizontally from the right and vertically centered.</dd>","     *      <dt>xMinYMax</dt><dd>Force uniform scaling positioned horizontally from the left and vertically from the bottom.</dd>","     *      <dt>xMidYMax</dt><dd>Force uniform scaling horizontally centered and position vertically from the bottom.</dd>","     *      <dt>xMaxYMax</dt><dd>Force uniform scaling positioned horizontally from the right and vertically from the bottom.</dd>","     *  </dl>","     * ","     * @config preserveAspectRatio","     * @type String","     * @default xMidYMid","     */","    preserveAspectRatio: {","        value: \"xMidYMid\"","    },","    ","    /**","     * The contentBounds will resize to greater values but not to smaller values. (for performance)","     * When resizing the contentBounds down is desirable, set the resizeDown value to true.","     *","     * @config resizeDown ","     * @type Boolean","     */","    resizeDown: {","        value: false","    },","","	/**","	 * Indicates the x-coordinate for the instance.","	 *","	 * @config x","	 * @type Number","	 */","    x: {","        getter: function()","        {","            return this._x;","        },","","        setter: function(val)","        {","            this._x = val;","            if(this._node)","            {","                this._node.style.left = val + \"px\";","            }","            return val;","        }","    },","","	/**","	 * Indicates the y-coordinate for the instance.","	 *","	 * @config y","	 * @type Number","	 */","    y: {","        getter: function()","        {","            return this._y;","        },","","        setter: function(val)","        {","            this._y = val;","            if(this._node)","            {","                this._node.style.top = val + \"px\";","            }","            return val;","        }","    },","","    /**","     * Indicates whether or not the instance will automatically redraw after a change is made to a shape.","     * This property will get set to false when batching operations.","     *","     * @config autoDraw","     * @type Boolean","     * @default true","     * @private","     */","    autoDraw: {","        value: true","    },","    ","    visible: {","        value: true,","","        setter: function(val)","        {","            this._toggleVisible(val);","            return val;","        }","    },","","    //","    //  Indicates the pointer-events setting for the svg:svg element.","    //","    //  @config pointerEvents","    //  @type String","    //","    pointerEvents: {","        value: \"none\"","    }","};","","Y.extend(SVGGraphic, Y.GraphicBase, {","    /**","     * Sets the value of an attribute.","     *","     * @method set","     * @param {String|Object} name The name of the attribute. Alternatively, an object of key value pairs can ","     * be passed in to set multiple attributes at once.","     * @param {Any} value The value to set the attribute to. This value is ignored if an object is received as ","     * the name param.","     */","	set: function(attr, value) ","	{","		var host = this,","            redrawAttrs = {","                autoDraw: true,","                autoSize: true,","                preserveAspectRatio: true,","                resizeDown: true","            },","            key,","            forceRedraw = false;","		AttributeLite.prototype.set.apply(host, arguments);	","        if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)","        {","            if(Y_LANG.isString && redrawAttrs[attr])","            {","                forceRedraw = true;","            }","            else if(Y_LANG.isObject(attr))","            {","                for(key in redrawAttrs)","                {","                    if(redrawAttrs.hasOwnProperty(key) && attr[key])","                    {","                        forceRedraw = true;","                        break;","                    }","                }","            }","        }","        if(forceRedraw)","        {","            host._redraw();","        }","	},","","    /**","     * Storage for `x` attribute.","     *","     * @property _x","     * @type Number","     * @private","     */","    _x: 0,","","    /**","     * Storage for `y` attribute.","     *","     * @property _y","     * @type Number","     * @private","     */","    _y: 0,","","    /**","     * Gets the current position of the graphic instance in page coordinates.","     *","     * @method getXY","     * @return Array The XY position of the shape.","     */","    getXY: function()","    {","        var node = Y.one(this._node),","            xy;","        if(node)","        {","            xy = node.getXY();","        }","        return xy;","    },","","    /**","     * Initializes the class.","     *","     * @method initializer","     * @private","     */","    initializer: function() {","        var render = this.get(\"render\"),","            visibility = this.get(\"visible\") ? \"visible\" : \"hidden\";","        this._shapes = {};","		this._contentBounds = {","            left: 0,","            top: 0,","            right: 0,","            bottom: 0","        };","        this._gradients = {};","        this._node = DOCUMENT.createElement('div');","        this._node.style.position = \"absolute\";","        this._node.style.left = this.get(\"x\") + \"px\";","        this._node.style.top = this.get(\"y\") + \"px\";","        this._node.style.visibility = visibility;","        this._contentNode = this._createGraphics();","        this._contentNode.style.visibility = visibility;","        this._contentNode.setAttribute(\"id\", this.get(\"id\"));","        this._node.appendChild(this._contentNode);","        if(render)","        {","            this.render(render);","        }","    },","","    /**","     * Adds the graphics node to the dom.","     * ","     * @method render","     * @param {HTMLElement} parentNode node in which to render the graphics node into.","     */","    render: function(render) {","        var parentNode = Y.one(render),","            w = this.get(\"width\") || parseInt(parentNode.getComputedStyle(\"width\"), 10),","            h = this.get(\"height\") || parseInt(parentNode.getComputedStyle(\"height\"), 10);","        parentNode = parentNode || Y.one(DOCUMENT.body);","        parentNode.append(this._node);","        this.parentNode = parentNode;","        this.set(\"width\", w);","        this.set(\"height\", h);","        return this;","    },","","    /**","     * Removes all nodes.","     *","     * @method destroy","     */","    destroy: function()","    {","        this.removeAllShapes();","        if(this._contentNode)","        {","            this._removeChildren(this._contentNode);","            if(this._contentNode.parentNode)","            {","                this._contentNode.parentNode.removeChild(this._contentNode);","            }","            this._contentNode = null;","        }","        if(this._node)","        {","            this._removeChildren(this._node);","            Y.one(this._node).remove(true);","            this._node = null;","        }","    },","","    /**","     * Generates a shape instance by type.","     *","     * @method addShape","     * @param {Object} cfg attributes for the shape","     * @return Shape","     */","    addShape: function(cfg)","    {","        cfg.graphic = this;","        if(!this.get(\"visible\"))","        {","            cfg.visible = false;","        }","        var shapeClass = this._getShapeClass(cfg.type),","            shape = new shapeClass(cfg);","        this._appendShape(shape);","        return shape;","    },","","    /**","     * Adds a shape instance to the graphic instance.","     *","     * @method _appendShape","     * @param {Shape} shape The shape instance to be added to the graphic.","     * @private","     */","    _appendShape: function(shape)","    {","        var node = shape.node,","            parentNode = this._frag || this._contentNode;","        if(this.get(\"autoDraw\")) ","        {","            parentNode.appendChild(node);","        }","        else","        {","            this._getDocFrag().appendChild(node);","        }","    },","","    /**","     * Removes a shape instance from from the graphic instance.","     *","     * @method removeShape","     * @param {Shape|String} shape The instance or id of the shape to be removed.","     */","    removeShape: function(shape)","    {","        if(!(shape instanceof SVGShape))","        {","            if(Y_LANG.isString(shape))","            {","                shape = this._shapes[shape];","            }","        }","        if(shape && shape instanceof SVGShape)","        {","            shape._destroy();","            delete this._shapes[shape.get(\"id\")];","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","        return shape;","    },","","    /**","     * Removes all shape instances from the dom.","     *","     * @method removeAllShapes","     */","    removeAllShapes: function()","    {","        var shapes = this._shapes,","            i;","        for(i in shapes)","        {","            if(shapes.hasOwnProperty(i))","            {","                shapes[i]._destroy();","            }","        }","        this._shapes = {};","    },","    ","    /**","     * Removes all child nodes.","     *","     * @method _removeChildren","     * @param {HTMLElement} node","     * @private","     */","    _removeChildren: function(node)","    {","        if(node.hasChildNodes())","        {","            var child;","            while(node.firstChild)","            {","                child = node.firstChild;","                this._removeChildren(child);","                node.removeChild(child);","            }","        }","    },","","    /**","     * Clears the graphics object.","     *","     * @method clear","     */","    clear: function() {","        this.removeAllShapes();","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} val indicates visibilitye","     * @private","     */","    _toggleVisible: function(val)","    {","        var i,","            shapes = this._shapes,","            visibility = val ? \"visible\" : \"hidden\";","        if(shapes)","        {","            for(i in shapes)","            {","                if(shapes.hasOwnProperty(i))","                {","                    shapes[i].set(\"visible\", val);","                }","            }","        }","        if(this._contentNode)","        {","            this._contentNode.style.visibility = visibility;","        }","        if(this._node)","        {","            this._node.style.visibility = visibility;","        }","    },","","    /**","     * Returns a shape class. Used by `addShape`. ","     *","     * @method _getShapeClass","     * @param {Shape | String} val Indicates which shape class. ","     * @return Function ","     * @private","     */","    _getShapeClass: function(val)","    {","        var shape = this._shapeClass[val];","        if(shape)","        {","            return shape;","        }","        return val;","    },","","    /**","     * Look up for shape classes. Used by `addShape` to retrieve a class for instantiation.","     *","     * @property _shapeClass","     * @type Object","     * @private","     */","    _shapeClass: {","        circle: Y.SVGCircle,","        rect: Y.SVGRect,","        path: Y.SVGPath,","        ellipse: Y.SVGEllipse,","        pieslice: Y.SVGPieSlice","    },","    ","    /**","     * Returns a shape based on the id of its dom node.","     *","     * @method getShapeById","     * @param {String} id Dom id of the shape's node attribute.","     * @return Shape","     */","    getShapeById: function(id)","    {","        var shape = this._shapes[id];","        return shape;","    },","","	/**","	 * Allows for creating multiple shapes in order to batch appending and redraw operations.","	 *","	 * @method batch","	 * @param {Function} method Method to execute.","	 */","    batch: function(method)","    {","        var autoDraw = this.get(\"autoDraw\");","        this.set(\"autoDraw\", false);","        method();","        this.set(\"autoDraw\", autoDraw);","    },","    ","    /**","     * Returns a document fragment to for attaching shapes.","     *","     * @method _getDocFrag","     * @return DocumentFragment","     * @private","     */","    _getDocFrag: function()","    {","        if(!this._frag)","        {","            this._frag = DOCUMENT.createDocumentFragment();","        }","        return this._frag;","    },","","    /**","     * Redraws all shapes.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var autoSize = this.get(\"autoSize\"),","            preserveAspectRatio = this.get(\"preserveAspectRatio\"),","            box = this.get(\"resizeDown\") ? this._getUpdatedContentBounds() : this._contentBounds,","            left = box.left,","            right = box.right,","            top = box.top,","            bottom = box.bottom,","            width = right - left,","            height = bottom - top,","            computedWidth,","            computedHeight,","            computedLeft,","            computedTop,","            node;","        if(autoSize)","        {","            if(autoSize == \"sizeContentToGraphic\")","            {","                node = Y.one(this._node);","                computedWidth = parseFloat(node.getComputedStyle(\"width\"));","                computedHeight = parseFloat(node.getComputedStyle(\"height\"));","                computedLeft = computedTop = 0;","                this._contentNode.setAttribute(\"preserveAspectRatio\", preserveAspectRatio);","            }","            else ","            {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","                this._state.width = width;","                this._state.height = height;","                if(this._node)","                {","                    this._node.style.width = width + \"px\";","                    this._node.style.height = height + \"px\";","                }","            }","        }","        else","        {","                computedWidth = width;","                computedHeight = height;","                computedLeft = left;","                computedTop = top;","        }","        if(this._contentNode)","        {","            this._contentNode.style.left = computedLeft + \"px\";","            this._contentNode.style.top = computedTop + \"px\";","            this._contentNode.setAttribute(\"width\", computedWidth);","            this._contentNode.setAttribute(\"height\", computedHeight);","            this._contentNode.style.width = computedWidth + \"px\";","            this._contentNode.style.height = computedHeight + \"px\";","            this._contentNode.setAttribute(\"viewBox\", \"\" + left + \" \" + top + \" \" + width + \" \" + height + \"\");","        }","        if(this._frag)","        {","            if(this._contentNode)","            {","                this._contentNode.appendChild(this._frag);","            }","            this._frag = null;","        } ","    },"," ","    /**","     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally ","     * by `Shape` instances.","     *","     * @method addToRedrawQueue","     * @param shape {SVGShape}","     * @protected","     */","    addToRedrawQueue: function(shape)","    {","        var shapeBox,","            box;","        this._shapes[shape.get(\"id\")] = shape;","        if(!this.get(\"resizeDown\"))","        {","            shapeBox = shape.getBounds();","            box = this._contentBounds;","            box.left = box.left < shapeBox.left ? box.left : shapeBox.left;","            box.top = box.top < shapeBox.top ? box.top : shapeBox.top;","            box.right = box.right > shapeBox.right ? box.right : shapeBox.right;","            box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;","            box.width = box.right - box.left;","            box.height = box.bottom - box.top;","            this._contentBounds = box;","        }","        if(this.get(\"autoDraw\")) ","        {","            this._redraw();","        }","    },","","    /**","     * Recalculates and returns the `contentBounds` for the `Graphic` instance.","     *","     * @method _getUpdatedContentBounds","     * @return {Object} ","     * @private","     */","    _getUpdatedContentBounds: function()","    {","        var bounds,","            i,","            shape,","            queue = this._shapes,","            box = {};","        for(i in queue)","        {","            if(queue.hasOwnProperty(i))","            {","                shape = queue[i];","                bounds = shape.getBounds();","                box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;","                box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;","                box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;","                box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;","            }","        }","        box.left = Y_LANG.isNumber(box.left) ? box.left : 0;","        box.top = Y_LANG.isNumber(box.top) ? box.top : 0;","        box.right = Y_LANG.isNumber(box.right) ? box.right : 0;","        box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;","        this._contentBounds = box;","        return box;","    },","","    /**","     * Creates a contentNode element","     *","     * @method _createGraphics","     * @private","     */","    _createGraphics: function() {","        var contentNode = this._createGraphicNode(\"svg\"),","            pointerEvents = this.get(\"pointerEvents\");","        contentNode.style.position = \"absolute\";","        contentNode.style.top = \"0px\";","        contentNode.style.left = \"0px\";","        contentNode.style.overflow = \"auto\";","        contentNode.setAttribute(\"overflow\", \"auto\");","        contentNode.setAttribute(\"pointer-events\", pointerEvents);","        return contentNode;","    },","","    /**","     * Creates a graphic node","     *","     * @method _createGraphicNode","     * @param {String} type node type to create","     * @param {String} pe specified pointer-events value","     * @return HTMLElement","     * @private","     */","    _createGraphicNode: function(type, pe)","    {","        var node = DOCUMENT.createElementNS(\"http://www.w3.org/2000/svg\", \"svg:\" + type),","            v = pe || \"none\";","        if(type !== \"defs\" && type !== \"stop\" && type !== \"linearGradient\" && type != \"radialGradient\")","        {","            node.setAttribute(\"pointer-events\", v);","        }","        return node;","    },","","    /**","     * Returns a reference to a gradient definition based on an id and type.","     *","     * @method getGradientNode","     * @param {String} key id that references the gradient definition","     * @param {String} type description of the gradient type","     * @return HTMLElement","     * @protected","     */","    getGradientNode: function(key, type)","    {","        var gradients = this._gradients,","            gradient,","            nodeType = type + \"Gradient\";","        if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)","        {","            gradient = this._gradients[key];","        }","        else","        {","            gradient = this._createGraphicNode(nodeType);","            if(!this._defs)","            {","                this._defs = this._createGraphicNode(\"defs\");","                this._contentNode.appendChild(this._defs);","            }","            this._defs.appendChild(gradient);","            key = key || \"gradient\" + Math.round(100000 * Math.random());","            gradient.setAttribute(\"id\", key);","            if(gradients.hasOwnProperty(key))","            {","                this._defs.removeChild(gradients[key]);","            }","            gradients[key] = gradient;","        }","        return gradient;","    },","","    /**","     * Inserts shape on the top of the tree.","     *","     * @method _toFront","     * @param {SVGShape} Shape to add.","     * @private","     */","    _toFront: function(shape)","    {","        var contentNode = this._contentNode;","        if(shape instanceof Y.SVGShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            contentNode.appendChild(shape);","        }","    },","","    /**","     * Inserts shape as the first child of the content node.","     *","     * @method _toBack","     * @param {SVGShape} Shape to add.","     * @private","     */","    _toBack: function(shape)","    {","        var contentNode = this._contentNode,","            targetNode;","        if(shape instanceof Y.SVGShape)","        {","            shape = shape.get(\"node\");","        }","        if(contentNode && shape)","        {","            targetNode = contentNode.firstChild;","            if(targetNode)","            {","                contentNode.insertBefore(shape, targetNode);","            }","            else","            {","                contentNode.appendChild(shape);","            }","        }","    }","});","","Y.SVGGraphic = SVGGraphic;","","","","}, '3.7.3', {\"requires\": [\"graphics\"]});"];
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].lines = {"1":0,"3":0,"19":0,"31":0,"92":0,"107":0,"119":0,"139":0,"140":0,"142":0,"143":0,"144":0,"148":0,"149":0,"151":0,"152":0,"155":0,"156":0,"157":0,"158":0,"160":0,"161":0,"162":0,"163":0,"164":0,"165":0,"166":0,"167":0,"168":0,"169":0,"170":0,"171":0,"172":0,"173":0,"174":0,"175":0,"189":0,"202":0,"214":0,"232":0,"234":0,"235":0,"236":0,"240":0,"241":0,"243":0,"244":0,"247":0,"248":0,"249":0,"250":0,"252":0,"253":0,"254":0,"255":0,"256":0,"257":0,"258":0,"259":0,"260":0,"261":0,"262":0,"263":0,"264":0,"265":0,"279":0,"280":0,"281":0,"282":0,"283":0,"298":0,"299":0,"300":0,"301":0,"302":0,"303":0,"304":0,"305":0,"306":0,"319":0,"320":0,"321":0,"322":0,"323":0,"324":0,"325":0,"326":0,"327":0,"328":0,"329":0,"343":0,"345":0,"346":0,"347":0,"348":0,"349":0,"350":0,"351":0,"352":0,"353":0,"354":0,"369":0,"371":0,"372":0,"373":0,"374":0,"375":0,"376":0,"393":0,"408":0,"409":0,"411":0,"412":0,"413":0,"417":0,"419":0,"420":0,"421":0,"424":0,"426":0,"431":0,"434":0,"438":0,"441":0,"442":0,"445":0,"446":0,"447":0,"448":0,"449":0,"450":0,"451":0,"452":0,"453":0,"454":0,"455":0,"457":0,"458":0,"459":0,"460":0,"461":0,"462":0,"463":0,"464":0,"465":0,"466":0,"469":0,"470":0,"471":0,"472":0,"484":0,"496":0,"508":0,"518":0,"519":0,"520":0,"521":0,"523":0,"524":0,"525":0,"529":0,"531":0,"532":0,"533":0,"534":0,"535":0,"536":0,"537":0,"538":0,"539":0,"540":0,"541":0,"542":0,"547":0,"548":0,"549":0,"550":0,"551":0,"552":0,"553":0,"554":0,"555":0,"556":0,"570":0,"582":0,"594":0,"601":0,"602":0,"603":0,"604":0,"605":0,"606":0,"607":0,"608":0,"609":0,"610":0,"611":0,"621":0,"631":0,"632":0,"633":0,"634":0,"635":0,"636":0,"637":0,"638":0,"639":0,"640":0,"651":0,"663":0,"665":0,"666":0,"668":0,"669":0,"670":0,"671":0,"673":0,"675":0,"677":0,"679":0,"681":0,"685":0,"687":0,"694":0,"696":0,"697":0,"698":0,"700":0,"702":0,"703":0,"704":0,"705":0,"706":0,"709":0,"711":0,"712":0,"713":0,"714":0,"716":0,"719":0,"721":0,"723":0,"724":0,"726":0,"729":0,"730":0,"731":0,"732":0,"743":0,"755":0,"756":0,"758":0,"759":0,"761":0,"774":0,"779":0,"780":0,"783":0,"784":0,"785":0,"786":0,"789":0,"803":0,"811":0,"813":0,"814":0,"815":0,"816":0,"817":0,"819":0,"820":0,"821":0,"822":0,"823":0,"824":0,"836":0,"837":0,"839":0,"841":0,"843":0,"845":0,"847":0,"849":0,"851":0,"852":0,"855":0,"867":0,"869":0,"870":0,"871":0,"872":0,"875":0,"877":0,"903":0,"914":0,"917":0,"918":0,"920":0,"922":0,"924":0,"926":0,"939":0,"940":0,"942":0,"946":0,"947":0,"950":0,"951":0,"963":0,"964":0,"975":0,"977":0,"978":0,"989":0,"993":0,"1004":0,"1006":0,"1007":0,"1008":0,"1020":0,"1031":0,"1033":0,"1045":0,"1056":0,"1076":0,"1093":0,"1099":0,"1100":0,"1101":0,"1103":0,"1105":0,"1107":0,"1109":0,"1111":0,"1127":0,"1129":0,"1131":0,"1142":0,"1148":0,"1150":0,"1151":0,"1152":0,"1153":0,"1154":0,"1155":0,"1156":0,"1157":0,"1158":0,"1159":0,"1160":0,"1161":0,"1162":0,"1163":0,"1165":0,"1169":0,"1170":0,"1172":0,"1173":0,"1179":0,"1191":0,"1195":0,"1197":0,"1198":0,"1200":0,"1201":0,"1203":0,"1205":0,"1209":0,"1210":0,"1211":0,"1212":0,"1217":0,"1229":0,"1258":0,"1260":0,"1261":0,"1262":0,"1264":0,"1266":0,"1267":0,"1271":0,"1272":0,"1274":0,"1275":0,"1279":0,"1281":0,"1282":0,"1286":0,"1287":0,"1289":0,"1290":0,"1293":0,"1294":0,"1295":0,"1296":0,"1299":0,"1300":0,"1301":0,"1302":0,"1304":0,"1305":0,"1306":0,"1307":0,"1308":0,"1309":0,"1310":0,"1314":0,"1315":0,"1316":0,"1317":0,"1318":0,"1321":0,"1322":0,"1323":0,"1325":0,"1327":0,"1328":0,"1332":0,"1333":0,"1335":0,"1336":0,"1337":0,"1338":0,"1339":0,"1340":0,"1341":0,"1342":0,"1343":0,"1344":0,"1345":0,"1346":0,"1348":0,"1350":0,"1352":0,"1354":0,"1356":0,"1372":0,"1373":0,"1374":0,"1376":0,"1389":0,"1401":0,"1413":0,"1425":0,"1436":0,"1447":0,"1458":0,"1469":0,"1482":0,"1483":0,"1484":0,"1485":0,"1486":0,"1488":0,"1500":0,"1514":0,"1516":0,"1517":0,"1518":0,"1519":0,"1520":0,"1522":0,"1525":0,"1527":0,"1528":0,"1530":0,"1532":0,"1533":0,"1535":0,"1536":0,"1538":0,"1539":0,"1541":0,"1543":0,"1546":0,"1547":0,"1554":0,"1555":0,"1557":0,"1559":0,"1561":0,"1573":0,"1574":0,"1575":0,"1576":0,"1577":0,"1578":0,"1579":0,"1580":0,"1581":0,"1582":0,"1593":0,"1616":0,"1623":0,"1625":0,"1627":0,"1629":0,"1630":0,"1631":0,"1632":0,"1634":0,"1644":0,"1645":0,"1647":0,"1658":0,"1659":0,"1661":0,"1674":0,"1682":0,"1684":0,"1685":0,"1686":0,"1688":0,"1689":0,"1690":0,"1691":0,"1692":0,"1694":0,"1696":0,"1700":0,"1704":0,"1715":0,"1716":0,"1718":0,"1722":0,"1734":0,"1736":0,"1737":0,"1739":0,"1741":0,"1746":0,"1757":0,"1793":0,"1794":0,"1795":0,"1796":0,"1797":0,"1802":0,"1815":0,"1820":0,"1821":0,"1823":0,"1825":0,"1838":0,"1843":0,"1844":0,"1845":0,"1847":0,"1861":0,"1866":0,"1867":0,"1868":0,"1870":0,"1905":0,"1906":0,"1908":0,"1910":0,"1960":0,"1962":0,"1963":0,"1965":0,"1967":0,"1970":0,"2007":0,"2009":0,"2011":0,"2012":0,"2014":0,"2017":0,"2030":0,"2032":0,"2034":0,"2036":0,"2041":0,"2042":0,"2044":0,"2046":0,"2062":0,"2077":0,"2079":0,"2081":0,"2097":0,"2101":0,"2114":0,"2116":0,"2118":0,"2119":0,"2176":0,"2189":0,"2202":0,"2203":0,"2216":0,"2220":0,"2231":0,"2233":0,"2235":0,"2236":0,"2246":0,"2247":0,"2258":0,"2260":0,"2263":0,"2265":0,"2283":0,"2292":0,"2293":0,"2294":0,"2295":0,"2296":0,"2297":0,"2298":0,"2302":0,"2312":0,"2317":0,"2318":0,"2320":0,"2322":0,"2336":0,"2341":0,"2342":0,"2344":0,"2346":0,"2350":0,"2361":0,"2363":0,"2366":0,"2368":0,"2387":0,"2393":0,"2394":0,"2395":0,"2396":0,"2397":0,"2398":0,"2402":0,"2412":0,"2413":0,"2418":0,"2431":0,"2432":0,"2437":0,"2451":0,"2459":0,"2461":0,"2463":0,"2464":0,"2482":0,"2487":0,"2488":0,"2489":0,"2492":0,"2530":0,"2541":0,"2542":0,"2545":0,"2547":0,"2565":0,"2570":0,"2571":0,"2573":0,"2575":0,"2591":0,"2607":0,"2623":0,"2636":0,"2638":0,"2640":0,"2653":0,"2655":0,"2657":0,"2727":0,"2732":0,"2733":0,"2735":0,"2737":0,"2750":0,"2755":0,"2756":0,"2758":0,"2760":0,"2782":0,"2783":0,"2798":0,"2810":0,"2819":0,"2820":0,"2822":0,"2824":0,"2826":0,"2828":0,"2830":0,"2832":0,"2833":0,"2838":0,"2840":0,"2870":0,"2872":0,"2874":0,"2876":0,"2886":0,"2888":0,"2889":0,"2895":0,"2896":0,"2897":0,"2898":0,"2899":0,"2900":0,"2901":0,"2902":0,"2903":0,"2904":0,"2905":0,"2907":0,"2918":0,"2921":0,"2922":0,"2923":0,"2924":0,"2925":0,"2926":0,"2936":0,"2937":0,"2939":0,"2940":0,"2942":0,"2944":0,"2946":0,"2948":0,"2949":0,"2950":0,"2963":0,"2964":0,"2966":0,"2968":0,"2970":0,"2971":0,"2983":0,"2985":0,"2987":0,"2991":0,"3003":0,"3005":0,"3007":0,"3010":0,"3012":0,"3013":0,"3015":0,"3017":0,"3019":0,"3029":0,"3031":0,"3033":0,"3035":0,"3038":0,"3050":0,"3052":0,"3053":0,"3055":0,"3056":0,"3057":0,"3068":0,"3080":0,"3083":0,"3085":0,"3087":0,"3089":0,"3093":0,"3095":0,"3097":0,"3099":0,"3113":0,"3114":0,"3116":0,"3118":0,"3145":0,"3146":0,"3157":0,"3158":0,"3159":0,"3160":0,"3172":0,"3174":0,"3176":0,"3187":0,"3201":0,"3203":0,"3205":0,"3206":0,"3207":0,"3208":0,"3209":0,"3213":0,"3214":0,"3215":0,"3216":0,"3217":0,"3218":0,"3219":0,"3221":0,"3222":0,"3228":0,"3229":0,"3230":0,"3231":0,"3233":0,"3235":0,"3236":0,"3237":0,"3238":0,"3239":0,"3240":0,"3241":0,"3243":0,"3245":0,"3247":0,"3249":0,"3263":0,"3265":0,"3266":0,"3268":0,"3269":0,"3270":0,"3271":0,"3272":0,"3273":0,"3274":0,"3275":0,"3276":0,"3278":0,"3280":0,"3293":0,"3298":0,"3300":0,"3302":0,"3303":0,"3304":0,"3305":0,"3306":0,"3307":0,"3310":0,"3311":0,"3312":0,"3313":0,"3314":0,"3315":0,"3325":0,"3327":0,"3328":0,"3329":0,"3330":0,"3331":0,"3332":0,"3333":0,"3347":0,"3349":0,"3351":0,"3353":0,"3367":0,"3370":0,"3372":0,"3376":0,"3377":0,"3379":0,"3380":0,"3382":0,"3383":0,"3384":0,"3385":0,"3387":0,"3389":0,"3391":0,"3403":0,"3404":0,"3406":0,"3408":0,"3410":0,"3423":0,"3425":0,"3427":0,"3429":0,"3431":0,"3432":0,"3434":0,"3438":0,"3444":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].functions = {"SVGDrawing:19":0,"curveTo:91":0,"relativeCurveTo:106":0,"_curveTo:118":0,"quadraticCurveTo:188":0,"relativeQuadraticCurveTo:201":0,"_quadraticCurveTo:213":0,"drawRect:278":0,"drawRoundRect:297":0,"drawCircle:318":0,"drawEllipse:342":0,"drawDiamond:367":0,"drawWedge:391":0,"lineTo:482":0,"relativeLineTo:494":0,"_lineTo:507":0,"moveTo:568":0,"relativeMoveTo:580":0,"_moveTo:593":0,"end:619":0,"clear:629":0,"_closePath:649":0,"closePath:741":0,"_getCurrentArray:753":0,"getBezierData:773":0,"_setCurveBoundingBox:801":0,"_trackSize:835":0,"SVGShape:867":0,"init:901":0,"initializer:912":0,"_setGraphic:937":0,"addClass:961":0,"removeClass:973":0,"getXY:987":0,"setXY:1002":0,"contains:1018":0,"compareTo:1030":0,"test:1043":0,"_getDefaultFill:1055":0,"_getDefaultStroke:1074":0,"createNode:1091":0,"on:1125":0,"_strokeChangeHandler:1140":0,"_fillChangeHandler:1189":0,"_setGradientFill:1228":0,"set:1370":0,"translate:1387":0,"translateX:1399":0,"translateY:1411":0,"skew:1423":0,"skewX:1434":0,"skewY:1445":0,"rotate:1456":0,"scale:1467":0,"_addTransform:1480":0,"_updateTransform:1498":0,"_draw:1571":0,"_updateHandler:1591":0,"getBounds:1614":0,"toFront:1642":0,"toBack:1656":0,"_parsePathData:1672":0,"destroy:1713":0,"_destroy:1732":0,"valueFn:1755":0,"setter:1791":0,"getter:1800":0,"valueFn:1813":0,"setter:1818":0,"getter:1836":0,"setter:1841":0,"getter:1859":0,"setter:1864":0,"setter:1904":0,"setter:1958":0,"setter:2005":0,"valueFn:2028":0,"setter:2039":0,"getter:2060":0,"setter:2075":0,"getter:2095":0,"SVGPath:2114":0,"getter:2187":0,"getter:2200":0,"getter:2214":0,"SVGRect:2231":0,"SVGEllipse:2258":0,"_draw:2281":0,"setter:2310":0,"getter:2315":0,"setter:2334":0,"getter:2339":0,"SVGCircle:2361":0,"_draw:2385":0,"setter:2410":0,"getter:2416":0,"setter:2429":0,"getter:2435":0,"SVGPieSlice:2459":0,"_draw:2480":0,"SVGGraphic:2541":0,"valueFn:2563":0,"setter:2568":0,"getter:2589":0,"getter:2605":0,"getter:2621":0,"setter:2634":0,"setter:2651":0,"getter:2725":0,"setter:2730":0,"getter:2748":0,"setter:2753":0,"setter:2780":0,"set:2808":0,"getXY:2868":0,"initializer:2885":0,"render:2917":0,"destroy:2934":0,"addShape:2961":0,"_appendShape:2981":0,"removeShape:3001":0,"removeAllShapes:3027":0,"_removeChildren:3048":0,"clear:3067":0,"_toggleVisible:3078":0,"_getShapeClass:3111":0,"getShapeById:3143":0,"batch:3155":0,"_getDocFrag:3170":0,"_redraw:3185":0,"addToRedrawQueue:3261":0,"_getUpdatedContentBounds:3291":0,"_createGraphics:3324":0,"_createGraphicNode:3345":0,"getGradientNode:3365":0,"_toFront:3401":0,"_toBack:3421":0,"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredLines = 886;
_yuitest_coverage["build/graphics-svg/graphics-svg.js"].coveredFunctions = 138;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1);
YUI.add('graphics-svg', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3);
var IMPLEMENTATION = "svg",
    SHAPE = "shape",
	SPLITPATHPATTERN = /[a-z][^a-z]*/ig,
    SPLITARGSPATTERN = /[-]?[0-9]*[0-9|\.][0-9]*/g,
    Y_LANG = Y.Lang,
	AttributeLite = Y.AttributeLite,
	SVGGraphic,
    SVGShape,
	SVGCircle,
	SVGRect,
	SVGPath,
	SVGEllipse,
    SVGPieSlice,
    DOCUMENT = Y.config.doc,
    _getClassName = Y.ClassNameManager.getClassName;

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 19);
function SVGDrawing(){}

/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Drawing.html">`Drawing`</a> class. 
 * `SVGDrawing` is not intended to be used directly. Instead, use the <a href="Drawing.html">`Drawing`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Drawing.html">`Drawing`</a> 
 * class will point to the `SVGDrawing` class.
 *
 * @module graphics
 * @class SVGDrawing
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 31);
SVGDrawing.prototype = {
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
     * Indicates the type of shape
     *
     * @private
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",
   
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "curveTo", 91);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 92);
this._curveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a bezier curve relative to the current coordinates.
     *
     * @method relativeCurveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeCurveTo: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeCurveTo", 106);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 107);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_curveTo", 118);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 119);
var w,
            h,
            pts,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
            x,
            y,
            right,
            left,
            bottom,
            top,
            i,
            len,
            pathArrayLen,
            currentArray,
            command = relative ? "c" : "C",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 139);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 140);
if(this._pathType !== command)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 142);
this._pathType = command;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 143);
currentArray = [command];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 144);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 148);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 149);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 151);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 152);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 155);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 156);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 157);
len = args.length - 5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 158);
for(i = 0; i < len; i = i + 6)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 160);
cp1x = parseFloat(args[i]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 161);
cp1y = parseFloat(args[i + 1]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 162);
cp2x = parseFloat(args[i + 2]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 163);
cp2y = parseFloat(args[i + 3]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 164);
x = parseFloat(args[i + 4]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 165);
y = parseFloat(args[i + 5]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 166);
right = Math.max(x, Math.max(cp1x, cp2x));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 167);
bottom = Math.max(y, Math.max(cp1y, cp2y));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 168);
left = Math.min(x, Math.min(cp1x, cp2x));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 169);
top = Math.min(y, Math.min(cp1y, cp2y));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 170);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 171);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 172);
pts = [[this._currentX, this._currentY] , [cp1x, cp1y], [cp2x, cp2y], [x, y]]; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 173);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 174);
this._currentX = x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 175);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "quadraticCurveTo", 188);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 189);
this._quadraticCurveTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a quadratic bezier curve relative to the current position.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    relativeQuadraticCurveTo: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeQuadraticCurveTo", 201);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 202);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_quadraticCurveTo", 213);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 214);
var cpx, 
            cpy, 
            x, 
            y,
            pathArrayLen,
            currentArray,
            w,
            h,
            pts,
            right,
            left,
            bottom,
            top,
            i,
            len,
            command = relative ? "q" : "Q",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 232);
if(this._pathType !== command)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 234);
this._pathType = command;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 235);
currentArray = [command];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 236);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 240);
currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 241);
if(!currentArray)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 243);
currentArray = [];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 244);
this._pathArray.push(currentArray);
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 247);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 248);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 249);
len = args.length - 3;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 250);
for(i = 0; i < len; i = i + 4)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 252);
cpx = parseFloat(args[i]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 253);
cpy = parseFloat(args[i + 1]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 254);
x = parseFloat(args[i + 2]) + relativeX;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 255);
y = parseFloat(args[i + 3]) + relativeY;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 256);
right = Math.max(x, cpx);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 257);
bottom = Math.max(y, cpy);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 258);
left = Math.min(x, cpx);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 259);
top = Math.min(y, cpy);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 260);
w = Math.abs(right - left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 261);
h = Math.abs(bottom - top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 262);
pts = [[this._currentX, this._currentY] , [cpx, cpy], [x, y]]; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 263);
this._setCurveBoundingBox(pts, w, h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 264);
this._currentX = x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 265);
this._currentY = y;
        }
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRect", 278);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 279);
this.moveTo(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 280);
this.lineTo(x + w, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 281);
this.lineTo(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 282);
this.lineTo(x, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 283);
this.lineTo(x, y);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawRoundRect", 297);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 298);
this.moveTo(x, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 299);
this.lineTo(x, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 300);
this.quadraticCurveTo(x, y + h, x + ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 301);
this.lineTo(x + w - ew, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 302);
this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 303);
this.lineTo(x + w, y + eh);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 304);
this.quadraticCurveTo(x + w, y, x + w - ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 305);
this.lineTo(x + ew, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 306);
this.quadraticCurveTo(x, y, x, y + eh);
	},

    /**
     * Draws a circle.     
     * 
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     * @protected
     */
	drawCircle: function(x, y, radius) {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawCircle", 318);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 319);
var circum = radius * 2;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 320);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 321);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 322);
this._trackSize(x + circum, y + circum);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 323);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 324);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 325);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y + circum]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 326);
this._pathArray.push(["A",  radius, radius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 327);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 328);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 329);
return this;
    },
   
    /**
     * Draws an ellipse.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @protected
     */
	drawEllipse: function(x, y, w, h) {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawEllipse", 342);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 343);
var radius = w * 0.5,
            yRadius = h * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 345);
this._drawingComplete = false;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 346);
this._trackSize(x, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 347);
this._trackSize(x + w, y + h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 348);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 349);
this._pathArray.push(["M", x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 350);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y + h]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 351);
this._pathArray.push(["A",  radius, yRadius, 0, 1, 0, x + radius, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 352);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 353);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 354);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawDiamond", 367);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 369);
var midWidth = width * 0.5,
            midHeight = height * 0.5;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 371);
this.moveTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 372);
this.lineTo(x + width, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 373);
this.lineTo(x + midWidth, y + height);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 374);
this.lineTo(x, y + midHeight);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 375);
this.lineTo(x + midWidth, y);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 376);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "drawWedge", 391);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 393);
var segs,
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
            i,
            diameter = radius * 2,
            currentArray,
            pathArrayLen;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 408);
yRadius = yRadius || radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 409);
if(this._pathType != "M")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 411);
this._pathType = "M";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 412);
currentArray = ["M"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 413);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 417);
currentArray = this._getCurrentArray(); 
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 419);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 420);
this._pathArray[pathArrayLen].push(x); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 421);
this._pathArray[pathArrayLen].push(x); 
        
        // limit sweep to reasonable numbers
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 424);
if(Math.abs(arc) > 360)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 426);
arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 431);
segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 434);
segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 438);
theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 441);
angle = (startAngle / 180) * Math.PI;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 442);
if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 445);
ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 446);
ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 447);
this._pathType = "L";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 448);
pathArrayLen++;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 449);
this._pathArray[pathArrayLen] = ["L"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 450);
this._pathArray[pathArrayLen].push(Math.round(ax));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 451);
this._pathArray[pathArrayLen].push(Math.round(ay));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 452);
pathArrayLen++; 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 453);
this._pathType = "Q";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 454);
this._pathArray[pathArrayLen] = ["Q"];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 455);
for(i = 0; i < segs; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 457);
angle += theta;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 458);
angleMid = angle - (theta / 2);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 459);
bx = x + Math.cos(angle) * radius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 460);
by = y + Math.sin(angle) * yRadius;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 461);
cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 462);
cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 463);
this._pathArray[pathArrayLen].push(Math.round(cx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 464);
this._pathArray[pathArrayLen].push(Math.round(cy));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 465);
this._pathArray[pathArrayLen].push(Math.round(bx));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 466);
this._pathArray[pathArrayLen].push(Math.round(by));
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 469);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 470);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 471);
this._trackSize(diameter, diameter); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 472);
return this;
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "lineTo", 482);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 484);
this._lineTo.apply(this, [Y.Array(arguments), false]);
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the relative x and y coordinates.
     * 
     * @method relativeLineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    relativeLineTo: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeLineTo", 494);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 496);
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
    _lineTo: function(args, relative) {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_lineTo", 507);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 508);
var point1 = args[0],
            i,
            len,
            pathArrayLen,
            currentArray,
            x,
            y,
            command = relative ? "l" : "L",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 518);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 519);
this._shapeType = "path";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 520);
len = args.length;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 521);
if(this._pathType !== command)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 523);
this._pathType = command;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 524);
currentArray = [command];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 525);
this._pathArray.push(currentArray);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 529);
currentArray = this._getCurrentArray();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 531);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 532);
if (typeof point1 === 'string' || typeof point1 === 'number') {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 533);
for (i = 0; i < len; i = i + 2) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 534);
x = parseFloat(args[i]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 535);
y = parseFloat(args[i + 1]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 536);
this._pathArray[pathArrayLen].push(x);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 537);
this._pathArray[pathArrayLen].push(y);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 538);
x = x + relativeX;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 539);
y = y + relativeY;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 540);
this._currentX = x;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 541);
this._currentY = y;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 542);
this._trackSize.apply(this, [x, y]);
            }
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 547);
for (i = 0; i < len; ++i) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 548);
x = parseFloat(args[i][0]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 549);
y = parseFloat(args[i][1]);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 550);
this._pathArray[pathArrayLen].push(x);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 551);
this._pathArray[pathArrayLen].push(y);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 552);
this._currentX = x;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 553);
this._currentY = y;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 554);
x = x + relativeX;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 555);
y = y + relativeY;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 556);
this._trackSize.apply(this, [x, y]);
            }
        }
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "moveTo", 568);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 570);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "relativeMoveTo", 580);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 582);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_moveTo", 593);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 594);
var pathArrayLen,
            currentArray,
            x = parseFloat(args[0]),
            y = parseFloat(args[1]),
            command = relative ? "m" : "M",
            relativeX = relative ? parseFloat(this._currentX) : 0,
            relativeY = relative ? parseFloat(this._currentY) : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 601);
this._pathArray = this._pathArray || [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 602);
this._pathType = command;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 603);
currentArray = [command];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 604);
this._pathArray.push(currentArray);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 605);
pathArrayLen = this._pathArray.length - 1;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 606);
this._pathArray[pathArrayLen] = this._pathArray[pathArrayLen].concat([x, y]);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 607);
x = x + relativeX;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 608);
y = y + relativeY;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 609);
this._currentX = x;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 610);
this._currentY = y;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 611);
this._trackSize(x, y);
    },
 
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "end", 619);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 621);
this._closePath();
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 629);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 631);
this._currentX = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 632);
this._currentY = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 633);
this._width = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 634);
this._height = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 635);
this._left = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 636);
this._right = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 637);
this._top = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 638);
this._bottom = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 639);
this._pathArray = [];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 640);
this._path = "";
    },

    /**
     * Draws the path.
     *
     * @method _closePath
     * @private
     */
    _closePath: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_closePath", 649);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 651);
var pathArray,
            segmentArray,
            pathType,
            len,
            val,
            val2,
            i,
            path = "",
            node = this.node,
            left = parseFloat(this._left),
            top = parseFloat(this._top),
            fill = this.get("fill");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 663);
if(this._pathArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 665);
pathArray = this._pathArray.concat();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 666);
while(pathArray && pathArray.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 668);
segmentArray = pathArray.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 669);
len = segmentArray.length;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 670);
pathType = segmentArray[0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 671);
if(pathType === "A")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 673);
path += pathType + segmentArray[1] + "," + segmentArray[2];
                }
                else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 675);
if(pathType == "z" || pathType == "Z")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 677);
path += " z ";
                }
                else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 679);
if(pathType == "C" || pathType == "c")
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 681);
path += pathType + (segmentArray[1] - left)+ "," + (segmentArray[2] - top);
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 685);
path += " " + pathType + parseFloat(segmentArray[1] - left);
                }}}
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 687);
switch(pathType)
                {
                    case "L" :
                    case "l" :
                    case "M" :
                    case "Q" :
                    case "q" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 694);
for(i = 2; i < len; ++i)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 696);
val = (i % 2 === 0) ? top : left;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 697);
val = segmentArray[i] - val;
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 698);
path += ", " + parseFloat(val);
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 700);
break;
                    case "A" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 702);
val = " " + parseFloat(segmentArray[3]) + " " + parseFloat(segmentArray[4]);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 703);
val += "," + parseFloat(segmentArray[5]) + " " + parseFloat(segmentArray[6] - left);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 704);
val += "," + parseFloat(segmentArray[7] - top);
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 705);
path += " " + val;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 706);
break;
                    case "C" :
                    case "c" :
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 709);
for(i = 3; i < len - 1; i = i + 2)
                        {
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 711);
val = parseFloat(segmentArray[i] - left);
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 712);
val = val + ", ";
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 713);
val = val + parseFloat(segmentArray[i + 1] - top);
                            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 714);
path += " " + val;
                        }
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 716);
break;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 719);
if(fill && fill.color)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 721);
path += 'z';
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 723);
Y.Lang.trim(path);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 724);
if(path)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 726);
node.setAttribute("d", path);
            }
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 729);
this._path = path;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 730);
this._fillChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 731);
this._strokeChangeHandler();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 732);
this._updateTransform();
        }
    },

    /**
     * Ends a fill and stroke
     *
     * @method closePath
     */
    closePath: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "closePath", 741);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 743);
this._pathArray.push(["z"]);
    },

    /**
     * Returns the current array of drawing commands.
     *
     * @method _getCurrentArray
     * @return Array
     * @private
     */
    _getCurrentArray: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getCurrentArray", 753);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 755);
var currentArray = this._pathArray[Math.max(0, this._pathArray.length - 1)];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 756);
if(!currentArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 758);
currentArray = [];
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 759);
this._pathArray.push(currentArray);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 761);
return currentArray;
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBezierData", 773);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 774);
var n = points.length,
            tmp = [],
            i,
            j;

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 779);
for (i = 0; i < n; ++i){
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 780);
tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 783);
for (j = 1; j < n; ++j) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 784);
for (i = 0; i < n - j; ++i) {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 785);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 786);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 789);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setCurveBoundingBox", 801);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 803);
var i,
            left = this._currentX,
            right = left,
            top = this._currentY,
            bottom = top,
            len = Math.round(Math.sqrt((w * w) + (h * h))),
            t = 1/len,
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 811);
for(i = 0; i < len; ++i)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 813);
xy = this.getBezierData(pts, t * i);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 814);
left = isNaN(left) ? xy[0] : Math.min(xy[0], left);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 815);
right = isNaN(right) ? xy[0] : Math.max(xy[0], right);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 816);
top = isNaN(top) ? xy[1] : Math.min(xy[1], top);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 817);
bottom = isNaN(bottom) ? xy[1] : Math.max(xy[1], bottom);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 819);
left = Math.round(left * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 820);
right = Math.round(right * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 821);
top = Math.round(top * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 822);
bottom = Math.round(bottom * 10)/10;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 823);
this._trackSize(right, bottom);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 824);
this._trackSize(left, top);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_trackSize", 835);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 836);
if (w > this._right) {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 837);
this._right = w;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 839);
if(w < this._left)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 841);
this._left = w;    
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 843);
if (h < this._top)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 845);
this._top = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 847);
if (h > this._bottom) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 849);
this._bottom = h;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 851);
this._width = this._right - this._left;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 852);
this._height = this._bottom - this._top;
    }
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 855);
Y.SVGDrawing = SVGDrawing;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Shape.html">`Shape`</a> class. 
 * `SVGShape` is not intended to be used directly. Instead, use the <a href="Shape.html">`Shape`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Shape.html">`Shape`</a> 
 * class will point to the `SVGShape` class.
 *
 * @module graphics
 * @class SVGShape
 * @constructor
 * @param {Object} cfg (optional) Attribute configs
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 867);
SVGShape = function(cfg)
{
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGShape", 867);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 869);
this._transforms = [];
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 870);
this.matrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 871);
this._normalizedMatrix = new Y.Matrix();
    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 872);
SVGShape.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 875);
SVGShape.NAME = "shape";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 877);
Y.extend(SVGShape, Y.GraphicBase, Y.mix({
    /**
     * Storage for x attribute.
     *
     * @property _x
     * @protected
     */
    _x: 0,

    /**
     * Storage for y attribute.
     *
     * @property _y
     * @protected
     */
    _y: 0,
    
    /**
     * Init method, invoked during construction.
     * Calls `initializer` method.
     *
     * @method init
     * @protected
     */
	init: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "init", 901);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 903);
this.initializer.apply(this, arguments);
	},

	/**
	 * Initializes the shape
	 *
	 * @private
	 * @method initializer
	 */
	initializer: function(cfg)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 912);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 914);
var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 917);
host.createNode(); 
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 918);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 920);
host._setGraphic(graphic);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 922);
if(data)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 924);
host._parsePathData(data);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 926);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGraphic", 937);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 939);
var graphic;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 940);
if(render instanceof Y.SVGGraphic)
        {
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 942);
this._graphic = render;
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 946);
render = Y.one(render);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 947);
graphic = new Y.SVGGraphic({
                render: render
            });
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 950);
graphic._appendShape(this);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 951);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addClass", 961);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 963);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 964);
node.className.baseVal = Y_LANG.trim([node.className.baseVal, className].join(' '));
	},

	/**
	 * Removes a class name from each node.
	 *
	 * @method removeClass
	 * @param {String} className the class name to remove from the node's class attribute
	 */
	removeClass: function(className)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeClass", 973);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 975);
var node = this.node,
			classString = node.className.baseVal;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 977);
classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 978);
node.className.baseVal = classString;
	},

	/**
	 * Gets the current position of the node in page coordinates.
	 *
	 * @method getXY
	 * @return Array The XY position of the shape.
	 */
	getXY: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 987);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 989);
var graphic = this._graphic,
			parentXY = graphic.getXY(),
			x = this._x,
			y = this._y;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 993);
return [parentXY[0] + x, parentXY[1] + y];
	},

	/**
	 * Set the position of the shape in page coordinates, regardless of how the node is positioned.
	 *
	 * @method setXY
	 * @param {Array} Contains x & y values for new position (coordinates are page-based)
	 */
	setXY: function(xy)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setXY", 1002);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1004);
var graphic = this._graphic,
			parentXY = graphic.getXY();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1006);
this._x = xy[0] - parentXY[0];
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1007);
this._y = xy[1] - parentXY[1];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1008);
this.set("transform", this.get("transform"));
	},

	/**
	 * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. 
	 *
	 * @method contains
	 * @param {SVGShape | HTMLElement} needle The possible node or descendent
	 * @return Boolean Whether or not this shape is the needle or its ancestor.
	 */
	contains: function(needle)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "contains", 1018);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1020);
return needle === Y.one(this.node);
	},

	/**
	 * Compares nodes to determine if they match.
	 * Node instances can be compared to each other and/or HTMLElements.
	 * @method compareTo
	 * @param {HTMLElement | Node} refNode The reference node to compare to the node.
	 * @return {Boolean} True if the nodes match, false if they do not.
	 */
	compareTo: function(refNode) {
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "compareTo", 1030);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1031);
var node = this.node;

		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1033);
return node === refNode;
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "test", 1043);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1045);
return Y.Selector.test(this.node, selector);
	},
	
	/**
	 * Value function for fill attribute
	 *
	 * @private
	 * @method _getDefaultFill
	 * @return Object
	 */
	_getDefaultFill: function() {
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultFill", 1055);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1056);
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
	 * @private
	 * @method _getDefaultStroke
	 * @return Object
	 */
	_getDefaultStroke: function() 
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDefaultStroke", 1074);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1076);
return {
			weight: 1,
			dashstyle: "none",
			color: "#000",
			opacity: 1.0
		};
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "createNode", 1091);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1093);
var host = this,
            node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
			id = host.get("id"),
            name = host.name,
            concat = host._camelCaseConcat,
			pointerEvents = host.get("pointerEvents");
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1099);
host.node = node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1100);
host.addClass(_getClassName(SHAPE) + " " + _getClassName(concat(IMPLEMENTATION, SHAPE)) + " " + _getClassName(name) + " " + _getClassName(concat(IMPLEMENTATION, name))); 
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1101);
if(id)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1103);
node.setAttribute("id", id);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1105);
if(pointerEvents)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1107);
node.setAttribute("pointer-events", pointerEvents);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1109);
if(!host.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1111);
Y.one(node).setStyle("visibility", "hidden");
        }
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "on", 1125);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1127);
if(Y.Node.DOM_EVENTS[type])
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1129);
return Y.one("#" +  this.get("id")).on(type, fn);
		}
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1131);
return Y.on.apply(this, arguments);
	},

	/**
	 * Adds a stroke to the shape node.
	 *
	 * @method _strokeChangeHandler
	 * @private
	 */
	_strokeChangeHandler: function(e)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_strokeChangeHandler", 1140);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1142);
var node = this.node,
			stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash,
			linejoin;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1148);
if(stroke && stroke.weight && stroke.weight > 0)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1150);
linejoin = stroke.linejoin || "round";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1151);
strokeOpacity = parseFloat(stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1152);
dashstyle = stroke.dashstyle || "none";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1153);
dash = Y_LANG.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1154);
stroke.color = stroke.color || "#000000";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1155);
stroke.weight = stroke.weight || 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1156);
stroke.opacity = Y_LANG.isNumber(strokeOpacity) ? strokeOpacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1157);
stroke.linecap = stroke.linecap || "butt";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1158);
node.setAttribute("stroke-dasharray", dash);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1159);
node.setAttribute("stroke", stroke.color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1160);
node.setAttribute("stroke-linecap", stroke.linecap);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1161);
node.setAttribute("stroke-width",  stroke.weight);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1162);
node.setAttribute("stroke-opacity", stroke.opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1163);
if(linejoin == "round" || linejoin == "bevel")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1165);
node.setAttribute("stroke-linejoin", linejoin);
			}
			else
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1169);
linejoin = parseInt(linejoin, 10);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1170);
if(Y_LANG.isNumber(linejoin))
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1172);
node.setAttribute("stroke-miterlimit",  Math.max(linejoin, 1));
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1173);
node.setAttribute("stroke-linejoin", "miter");
				}
			}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1179);
node.setAttribute("stroke", "none");
		}
	},
	
	/**
	 * Adds a fill to the shape node.
	 *
	 * @method _fillChangeHandler
	 * @private
	 */
	_fillChangeHandler: function(e)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_fillChangeHandler", 1189);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1191);
var node = this.node,
			fill = this.get("fill"),
			fillOpacity,
			type;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1195);
if(fill)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1197);
type = fill.type;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1198);
if(type == "linear" || type == "radial")
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1200);
this._setGradientFill(fill);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1201);
node.setAttribute("fill", "url(#grad" + this.get("id") + ")");
			}
			else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1203);
if(!fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1205);
node.setAttribute("fill", "none");
			}
			else
			{
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1209);
fillOpacity = parseFloat(fill.opacity);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1210);
fillOpacity = Y_LANG.isNumber(fillOpacity) ? fillOpacity : 1;
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1211);
node.setAttribute("fill", fill.color);
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1212);
node.setAttribute("fill-opacity", fillOpacity);
			}}
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1217);
node.setAttribute("fill", "none");
		}
	},

	/**
	 * Creates a gradient fill
	 *
	 * @method _setGradientFill
	 * @param {String} type gradient type
	 * @private
	 */
	_setGradientFill: function(fill) {
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_setGradientFill", 1228);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1229);
var offset,
			opacity,
			color,
			stopNode,
            newStop,
			isNumber = Y_LANG.isNumber,
			graphic = this._graphic,
			type = fill.type, 
			gradientNode = graphic.getGradientNode("grad" + this.get("id"), type),
			stops = fill.stops,
			w = this.get("width"),
			h = this.get("height"),
			rotation = fill.rotation || 0,
			radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(rotation * radCon)).toFixed(8)),
            i,
			len,
			def,
			stop,
			x1 = "0%", 
			x2 = "100%", 
			y1 = "0%", 
			y2 = "0%",
			cx = fill.cx,
			cy = fill.cy,
			fx = fill.fx,
			fy = fill.fy,
			r = fill.r,
            stopNodes = [];
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1258);
if(type == "linear")
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1260);
cx = w/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1261);
cy = h/2;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1262);
if(Math.abs(tanRadians) * w/2 >= h/2)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1264);
if(rotation < 180)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1266);
y1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1267);
y2 = h;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1271);
y1 = h;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1272);
y2 = 0;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1274);
x1 = cx - ((cy - y1)/tanRadians);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1275);
x2 = cx - ((cy - y2)/tanRadians); 
            }
            else
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1279);
if(rotation > 90 && rotation < 270)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1281);
x1 = w;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1282);
x2 = 0;
                }
                else
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1286);
x1 = 0;
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1287);
x2 = w;
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1289);
y1 = ((tanRadians * (cx - x1)) - cy) * -1;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1290);
y2 = ((tanRadians * (cx - x2)) - cy) * -1;
            }

            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1293);
x1 = Math.round(100 * x1/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1294);
x2 = Math.round(100 * x2/w);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1295);
y1 = Math.round(100 * y1/h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1296);
y2 = Math.round(100 * y2/h);
            
            //Set default value if not valid 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1299);
x1 = isNumber(x1) ? x1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1300);
x2 = isNumber(x2) ? x2 : 100;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1301);
y1 = isNumber(y1) ? y1 : 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1302);
y2 = isNumber(y2) ? y2 : 0;
            
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1304);
gradientNode.setAttribute("spreadMethod", "pad");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1305);
gradientNode.setAttribute("width", w);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1306);
gradientNode.setAttribute("height", h);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1307);
gradientNode.setAttribute("x1", x1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1308);
gradientNode.setAttribute("x2", x2 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1309);
gradientNode.setAttribute("y1", y1 + "%");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1310);
gradientNode.setAttribute("y2", y2 + "%");
		}
		else
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1314);
gradientNode.setAttribute("cx", (cx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1315);
gradientNode.setAttribute("cy", (cy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1316);
gradientNode.setAttribute("fx", (fx * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1317);
gradientNode.setAttribute("fy", (fy * 100) + "%");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1318);
gradientNode.setAttribute("r", (r * 100) + "%");
		}
		
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1321);
len = stops.length;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1322);
def = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1323);
for(i = 0; i < len; ++i)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1325);
if(this._stops && this._stops.length > 0)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1327);
stopNode = this._stops.shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1328);
newStop = false;
            }
            else
            {
			    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1332);
stopNode = graphic._createGraphicNode("stop");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1333);
newStop = true;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1335);
stop = stops[i];
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1336);
opacity = stop.opacity;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1337);
color = stop.color;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1338);
offset = stop.offset || i/(len - 1);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1339);
offset = Math.round(offset * 100) + "%";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1340);
opacity = isNumber(opacity) ? opacity : 1;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1341);
opacity = Math.max(0, Math.min(1, opacity));
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1342);
def = (i + 1) / len;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1343);
stopNode.setAttribute("offset", offset);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1344);
stopNode.setAttribute("stop-color", color);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1345);
stopNode.setAttribute("stop-opacity", opacity);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1346);
if(newStop)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1348);
gradientNode.appendChild(stopNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1350);
stopNodes.push(stopNode);
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1352);
while(this._stops && this._stops.length > 0)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1354);
gradientNode.removeChild(this._stops.shift());
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1356);
this._stops = stopNodes;
	},

    _stops: null,

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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 1370);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1372);
var host = this;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1373);
AttributeLite.prototype.set.apply(host, arguments);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1374);
if(host.initialized)
		{
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1376);
host._updateHandler();
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translate", 1387);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1389);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateX", 1399);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1401);
this._addTransform("translateX", arguments);
    },

	/**
	 * Translates the shape along the y-axis. When translating x and y coordinates,
	 * use the `translate` method.
	 *
	 * @method translateY
	 * @param {Number} y The value to translate.
	 */
	translateY: function(y)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "translateY", 1411);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1413);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skew", 1423);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1425);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewX", 1434);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1436);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "skewY", 1445);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1447);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "rotate", 1456);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1458);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "scale", 1467);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1469);
this._addTransform("scale", arguments);
	},

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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_addTransform", 1480);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1482);
args = Y.Array(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1483);
this._transform = Y_LANG.trim(this._transform + " " + type + "(" + args.join(", ") + ")");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1484);
args.unshift(type);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1485);
this._transforms.push(args);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1486);
if(this.initialized)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1488);
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateTransform", 1498);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1500);
var isPath = this._type == "path",
		    node = this.node,
			key,
			transform,
			transformOrigin,
			x,
			y,
            tx,
            ty,
            matrix = this.matrix,
            normalizedMatrix = this._normalizedMatrix,
            i,
            len = this._transforms.length;

        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1514);
if(isPath || (this._transforms && this._transforms.length > 0))
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1516);
x = this._x;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1517);
y = this._y;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1518);
transformOrigin = this.get("transformOrigin");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1519);
tx = x + (transformOrigin[0] * this.get("width"));
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1520);
ty = y + (transformOrigin[1] * this.get("height")); 
            //need to use translate for x/y coords
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1522);
if(isPath)
            {
                //adjust origin for custom shapes 
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1525);
if(!(this instanceof Y.SVGPath))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1527);
tx = this._left + (transformOrigin[0] * this.get("width"));
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1528);
ty = this._top + (transformOrigin[1] * this.get("height"));
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1530);
normalizedMatrix.init({dx: x + this._left, dy: y + this._top});
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1532);
normalizedMatrix.translate(tx, ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1533);
for(i = 0; i < len; ++i)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1535);
key = this._transforms[i].shift();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1536);
if(key)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1538);
normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1539);
matrix[key].apply(matrix, this._transforms[i]); 
                }
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1541);
if(isPath)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1543);
this._transforms[i].unshift(key);
                }
			}
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1546);
normalizedMatrix.translate(-tx, -ty);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1547);
transform = "matrix(" + normalizedMatrix.a + "," + 
                            normalizedMatrix.b + "," + 
                            normalizedMatrix.c + "," + 
                            normalizedMatrix.d + "," + 
                            normalizedMatrix.dx + "," +
                            normalizedMatrix.dy + ")";
		}
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1554);
this._graphic.addToRedrawQueue(this);    
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1555);
if(transform)
		{
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1557);
node.setAttribute("transform", transform);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1559);
if(!isPath)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1561);
this._transforms = [];
        }
	},

	/**
	 * Draws the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 1571);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1573);
var node = this.node;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1574);
node.setAttribute("width", this.get("width"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1575);
node.setAttribute("height", this.get("height"));
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1576);
node.setAttribute("x", this._x);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1577);
node.setAttribute("y", this._y);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1578);
node.style.left = this._x + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1579);
node.style.top = this._y + "px";
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1580);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1581);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1582);
this._updateTransform();
	},

	/**
     * Updates `Shape` based on attribute changes.
     *
     * @method _updateHandler
	 * @private
	 */
	_updateHandler: function(e)
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_updateHandler", 1591);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1593);
this._draw();
	},
    
    /**
     * Storage for the transform attribute.
     *
     * @property _transform
     * @type String
     * @private
     */
    _transform: "",

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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getBounds", 1614);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1616);
var type = this._type,
			stroke = this.get("stroke"),
            w = this.get("width"),
			h = this.get("height"),
			x = type == "path" ? 0 : this._x,
			y = type == "path" ? 0 : this._y,
            wt = 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1623);
if(type != "path")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1625);
if(stroke && stroke.weight)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1627);
wt = stroke.weight;
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1629);
w = (x + w + wt) - (x - wt); 
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1630);
h = (y + h + wt) - (y - wt);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1631);
x -= wt;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1632);
y -= wt;
        }
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1634);
return this._normalizedMatrix.getContentRect(w, h, x, y);
	},

    /**
     * Places the shape above all other shapes.
     *
     * @method toFront
     */
    toFront: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "toFront", 1642);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1644);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1645);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1647);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "toBack", 1656);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1658);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1659);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1661);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_parsePathData", 1672);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1674);
var method,
            methodSymbol,
            args,
            commandArray = Y.Lang.trim(val.match(SPLITPATHPATTERN)),
            i,
            len, 
            str,
            symbolToMethod = this._pathSymbolToMethod;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1682);
if(commandArray)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1684);
this.clear();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1685);
len = commandArray.length || 0;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1686);
for(i = 0; i < len; i = i + 1)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1688);
str = commandArray[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1689);
methodSymbol = str.substr(0, 1);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1690);
args = str.substr(1).match(SPLITARGSPATTERN);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1691);
method = symbolToMethod[methodSymbol];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1692);
if(method)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1694);
if(args)
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1696);
this[method].apply(this, args);
                    }
                    else
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1700);
this[method].apply(this);
                    }
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1704);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 1713);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1715);
var graphic = this.get("graphic");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1716);
if(graphic)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1718);
graphic.removeShape(this);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1722);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_destroy", 1732);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1734);
if(this.node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1736);
Y.Event.purgeElement(this.node, true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1737);
if(this.node.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1739);
this.node.parentNode.removeChild(this.node);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1741);
this.node = null;
        }
    }
 }, Y.SVGDrawing.prototype));
	
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1746);
SVGShape.ATTRS = {
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1755);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1757);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1791);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1793);
this.matrix.init();	
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1794);
this._normalizedMatrix.init();
		    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1795);
this._transforms = this.matrix.getTransformArray(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1796);
this._transform = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1797);
return val;
		},

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1800);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1802);
return this._transform;
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 1813);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1815);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1818);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1820);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1821);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1823);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1825);
return val;
		}
	},

	/**
	 * Indicates the x position of shape.
	 *
	 * @config x
	 * @type Number
	 */
	x: {
	    getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1836);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1838);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1841);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1843);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1844);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1845);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1847);
this.set("transform", transform);
            }
        }
	},

	/**
	 * Indicates the y position of shape.
	 *
	 * @config y
	 * @type Number
	 */
	y: {
	    getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 1859);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1861);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1864);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1866);
var transform = this.get("transform");
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1867);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1868);
if(transform) 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1870);
this.set("transform", transform);
            }
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
	 * Indicates whether the shape is visible.
	 *
	 * @config visible
	 * @type Boolean
	 */
	visible: {
		value: true,

		setter: function(val){
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1904);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1905);
var visibility = val ? "visible" : "hidden";
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1906);
if(this.node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 1908);
this.node.style.visibility = visibility;
            }
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1910);
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
     *      <dt>cx</dt><dd>
     *          <p>The x-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>
     *      </dd>
     *      <dt>cy</dt><dd>
     *          <p>The y-coordinate of the center of the gradient circle. Determines where the color stop begins. The default value 0.5.</p>
     *          <p><strong>Note: </strong>Currently, this property is not implemented for corresponding `CanvasShape` and `VMLShape` classes which are used on Android or IE 6 - 8.</p>
     *      </dd>
     *  </dl>
	 *
	 * @config fill
	 * @type Object 
	 */
	fill: {
		valueFn: "_getDefaultFill",
		
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 1958);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1960);
var fill,
				tmpl = this.get("fill") || this._getDefaultFill();
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1962);
fill = (val) ? Y.merge(tmpl, val) : null;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1963);
if(fill && fill.color)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1965);
if(fill.color === undefined || fill.color == "none")
				{
					_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1967);
fill.color = null;
				}
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 1970);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2005);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2007);
var tmpl = this.get("stroke") || this._getDefaultStroke(),
                wt;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2009);
if(val && val.hasOwnProperty("weight"))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2011);
wt = parseInt(val.weight, 10);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2012);
if(!isNaN(wt))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2014);
val.weight = wt;
                }
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2017);
return (val) ? Y.merge(tmpl, val) : null;
		}
	},
	
	// Only implemented in SVG
	// Determines whether the instance will receive mouse events.
	// 
	// @config pointerEvents
	// @type string
	//
	pointerEvents: {
		valueFn: function() 
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 2028);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2030);
var val = "visiblePainted",
				node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2032);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2034);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2036);
return val;
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2039);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2041);
var node = this.node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2042);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2044);
node.setAttribute("pointer-events", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2046);
return val;
		}
	},

	/**
	 * Dom node for the shape.
	 *
	 * @config node
	 * @type HTMLElement
	 * @readOnly
	 */
	node: {
		readOnly: true,

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2060);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2062);
return this.node;
		}
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2075);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2077);
if(this.get("node"))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2079);
this._parsePathData(val);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2081);
return val;
        }
    },

	/**
	 * Reference to the parent graphic instance
	 *
	 * @config graphic
	 * @type SVGGraphic
	 * @readOnly
	 */
	graphic: {
		readOnly: true,

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2095);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2097);
return this._graphic;
		}
	}
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2101);
Y.SVGShape = SVGShape;

/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Path.html">`Path`</a> class. 
 * `SVGPath` is not intended to be used directly. Instead, use the <a href="Path.html">`Path`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Path.html">`Path`</a> 
 * class will point to the `SVGPath` class.
 *
 * @module graphics
 * @class SVGPath
 * @extends SVGShape
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2114);
SVGPath = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPath", 2114);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2116);
SVGPath.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2118);
SVGPath.NAME = "path";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2119);
Y.extend(SVGPath, Y.SVGShape, {
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
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     * @private
     */
    _type: "path",

    /**
     * Storage for path
     *
     * @property _path
     * @type String
     * @private
     */
	_path: ""
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2176);
SVGPath.ATTRS = Y.merge(Y.SVGShape.ATTRS, {
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2187);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2189);
return this._path;
		}
	},

	/**
	 * Indicates the width of the shape
	 * 
	 * @config width
	 * @type Number
	 */
	width: {
		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2200);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2202);
var val = Math.max(this._right - this._left, 0);
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2203);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2214);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2216);
return Math.max(this._bottom - this._top, 0);
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2220);
Y.SVGPath = SVGPath;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Rect.html">`Rect`</a> class. 
 * `SVGRect` is not intended to be used directly. Instead, use the <a href="Rect.html">`Rect`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Rect.html">`Rect`</a> 
 * class will point to the `SVGRect` class.
 *
 * @module graphics
 * @class SVGRect
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2231);
SVGRect = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGRect", 2231);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2233);
SVGRect.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2235);
SVGRect.NAME = "rect";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2236);
Y.extend(SVGRect, Y.SVGShape, {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "rect"
 });
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2246);
SVGRect.ATTRS = Y.SVGShape.ATTRS;
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2247);
Y.SVGRect = SVGRect;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Ellipse.html">`Ellipse`</a> class. 
 * `SVGEllipse` is not intended to be used directly. Instead, use the <a href="Ellipse.html">`Ellipse`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Ellipse.html">`Ellipse`</a> 
 * class will point to the `SVGEllipse` class.
 *
 * @module graphics
 * @class SVGEllipse
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2258);
SVGEllipse = function(cfg)
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGEllipse", 2258);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2260);
SVGEllipse.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2263);
SVGEllipse.NAME = "ellipse";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2265);
Y.extend(SVGEllipse, SVGShape, {
	/**
	 * Indicates the type of shape
	 *
	 * @property _type
	 * @type String
     * @private
	 */
	_type: "ellipse",

	/**
	 * Updates the shape.
	 *
	 * @method _draw
	 * @private
	 */
	_draw: function()
	{
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2281);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2283);
var node = this.node,
			w = this.get("width"),
			h = this.get("height"),
			x = this.get("x"),
			y = this.get("y"),
			xRadius = w * 0.5,
			yRadius = h * 0.5,
			cx = x + xRadius,
			cy = y + yRadius;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2292);
node.setAttribute("rx", xRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2293);
node.setAttribute("ry", yRadius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2294);
node.setAttribute("cx", cx);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2295);
node.setAttribute("cy", cy);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2296);
this._fillChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2297);
this._strokeChangeHandler();
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2298);
this._updateTransform();
	}
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2302);
SVGEllipse.ATTRS = Y.merge(SVGShape.ATTRS, {
	/**
	 * Horizontal radius for the ellipse. 
	 *
	 * @config xRadius
	 * @type Number
	 */
	xRadius: {
		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2310);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2312);
this.set("width", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2315);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2317);
var val = this.get("width");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2318);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2320);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2322);
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2334);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2336);
this.set("height", val * 2);
		},

		getter: function()
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2339);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2341);
var val = this.get("height");
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2342);
if(val) 
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2344);
val *= 0.5;
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2346);
return val;
		}
	}
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2350);
Y.SVGEllipse = SVGEllipse;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Circle.html">`Circle`</a> class. 
 * `SVGCircle` is not intended to be used directly. Instead, use the <a href="Circle.html">`Circle`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Circle.html">`Circle`</a> 
 * class will point to the `SVGCircle` class.
 *
 * @module graphics
 * @class SVGCircle
 * @constructor
 */
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2361);
SVGCircle = function(cfg)
 {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGCircle", 2361);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2363);
SVGCircle.superclass.constructor.apply(this, arguments);
 };
    
 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2366);
SVGCircle.NAME = "circle";

 _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2368);
Y.extend(SVGCircle, Y.SVGShape, {    
    
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @type String
     * @private
     */
    _type: "circle",

    /**
     * Updates the shape.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2385);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2387);
var node = this.node,
            x = this.get("x"),
            y = this.get("y"),
            radius = this.get("radius"),
            cx = x + radius,
            cy = y + radius;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2393);
node.setAttribute("r", radius);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2394);
node.setAttribute("cx", cx);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2395);
node.setAttribute("cy", cy);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2396);
this._fillChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2397);
this._strokeChangeHandler();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2398);
this._updateTransform();
    }
 });
    
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2402);
SVGCircle.ATTRS = Y.merge(Y.SVGShape.ATTRS, {
	/**
	 * Indicates the width of the shape
	 *
	 * @config width
	 * @type Number
	 */
    width: {
        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2410);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2412);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2413);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2416);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2418);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2429);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2431);
this.set("radius", val/2);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2432);
return val;
        },

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2435);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2437);
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
        value: 0
    }
});
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2451);
Y.SVGCircle = SVGCircle;
/**
 * Draws pie slices
 *
 * @module graphics
 * @class SVGPieSlice
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2459);
SVGPieSlice = function()
{
	_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGPieSlice", 2459);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2461);
SVGPieSlice.superclass.constructor.apply(this, arguments);
};
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2463);
SVGPieSlice.NAME = "svgPieSlice";
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2464);
Y.extend(SVGPieSlice, Y.SVGShape, Y.mix({
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_draw", 2480);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2482);
var x = this.get("cx"),
            y = this.get("cy"),
            startAngle = this.get("startAngle"),
            arc = this.get("arc"),
            radius = this.get("radius");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2487);
this.clear();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2488);
this.drawWedge(x, y, startAngle, arc, radius);
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2489);
this.end();
	}
 }, Y.SVGDrawing.prototype));
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2492);
SVGPieSlice.ATTRS = Y.mix({
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
}, Y.SVGShape.ATTRS);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2530);
Y.SVGPieSlice = SVGPieSlice;
/**
 * <a href="http://www.w3.org/TR/SVG/">SVG</a> implementation of the <a href="Graphic.html">`Graphic`</a> class. 
 * `SVGGraphic` is not intended to be used directly. Instead, use the <a href="Graphic.html">`Graphic`</a> class. 
 * If the browser has <a href="http://www.w3.org/TR/SVG/">SVG</a> capabilities, the <a href="Graphic.html">`Graphic`</a> 
 * class will point to the `SVGGraphic` class.
 *
 * @module graphics
 * @class SVGGraphic
 * @constructor
 */
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2541);
SVGGraphic = function(cfg) {
    _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "SVGGraphic", 2541);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2542);
SVGGraphic.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2545);
SVGGraphic.NAME = "svgGraphic";

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2547);
SVGGraphic.ATTRS = {
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
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "valueFn", 2563);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2565);
return Y.guid();
		},

		setter: function(val)
		{
			_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2568);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2570);
var node = this._node;
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2571);
if(node)
			{
				_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2573);
node.setAttribute("id", val);
			}
			_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2575);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2589);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2591);
return this._shapes;
        }
    },

    /**
     *  Object containing size and coordinate data for the content of a Graphic in relation to the coordSpace node.
     *
     *  @config contentBounds
     *  @type Object 
     *  @readOnly
     */
    contentBounds: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2605);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2607);
return this._contentBounds;
        }
    },

    /**
     *  The html element that represents to coordinate system of the Graphic instance.
     *
     *  @config node
     *  @type HTMLElement
     *  @readOnly
     */
    node: {
        readOnly: true,

        getter: function()
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2621);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2623);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2634);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2636);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2638);
this._node.style.width = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2640);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2651);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2653);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2655);
this._node.style.height = val  + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2657);
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
     * The contentBounds will resize to greater values but not to smaller values. (for performance)
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2725);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2727);
return this._x;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2730);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2732);
this._x = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2733);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2735);
this._node.style.left = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2737);
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
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getter", 2748);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2750);
return this._y;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2753);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2755);
this._y = val;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2756);
if(this._node)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2758);
this._node.style.top = val + "px";
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2760);
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
    
    visible: {
        value: true,

        setter: function(val)
        {
            _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "setter", 2780);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2782);
this._toggleVisible(val);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2783);
return val;
        }
    },

    //
    //  Indicates the pointer-events setting for the svg:svg element.
    //
    //  @config pointerEvents
    //  @type String
    //
    pointerEvents: {
        value: "none"
    }
};

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2798);
Y.extend(SVGGraphic, Y.GraphicBase, {
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
		_yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "set", 2808);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2810);
var host = this,
            redrawAttrs = {
                autoDraw: true,
                autoSize: true,
                preserveAspectRatio: true,
                resizeDown: true
            },
            key,
            forceRedraw = false;
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2819);
AttributeLite.prototype.set.apply(host, arguments);	
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2820);
if(host._state.autoDraw === true && Y.Object.size(this._shapes) > 0)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2822);
if(Y_LANG.isString && redrawAttrs[attr])
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2824);
forceRedraw = true;
            }
            else {_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2826);
if(Y_LANG.isObject(attr))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2828);
for(key in redrawAttrs)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2830);
if(redrawAttrs.hasOwnProperty(key) && attr[key])
                    {
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2832);
forceRedraw = true;
                        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2833);
break;
                    }
                }
            }}
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2838);
if(forceRedraw)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2840);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getXY", 2868);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2870);
var node = Y.one(this._node),
            xy;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2872);
if(node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2874);
xy = node.getXY();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2876);
return xy;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "initializer", 2885);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2886);
var render = this.get("render"),
            visibility = this.get("visible") ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2888);
this._shapes = {};
		_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2889);
this._contentBounds = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2895);
this._gradients = {};
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2896);
this._node = DOCUMENT.createElement('div');
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2897);
this._node.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2898);
this._node.style.left = this.get("x") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2899);
this._node.style.top = this.get("y") + "px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2900);
this._node.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2901);
this._contentNode = this._createGraphics();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2902);
this._contentNode.style.visibility = visibility;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2903);
this._contentNode.setAttribute("id", this.get("id"));
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2904);
this._node.appendChild(this._contentNode);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2905);
if(render)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2907);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "render", 2917);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2918);
var parentNode = Y.one(render),
            w = this.get("width") || parseInt(parentNode.getComputedStyle("width"), 10),
            h = this.get("height") || parseInt(parentNode.getComputedStyle("height"), 10);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2921);
parentNode = parentNode || Y.one(DOCUMENT.body);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2922);
parentNode.append(this._node);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2923);
this.parentNode = parentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2924);
this.set("width", w);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2925);
this.set("height", h);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2926);
return this;
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "destroy", 2934);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2936);
this.removeAllShapes();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2937);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2939);
this._removeChildren(this._contentNode);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2940);
if(this._contentNode.parentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2942);
this._contentNode.parentNode.removeChild(this._contentNode);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2944);
this._contentNode = null;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2946);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2948);
this._removeChildren(this._node);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2949);
Y.one(this._node).remove(true);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2950);
this._node = null;
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addShape", 2961);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2963);
cfg.graphic = this;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2964);
if(!this.get("visible"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2966);
cfg.visible = false;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2968);
var shapeClass = this._getShapeClass(cfg.type),
            shape = new shapeClass(cfg);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2970);
this._appendShape(shape);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2971);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_appendShape", 2981);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 2983);
var node = shape.node,
            parentNode = this._frag || this._contentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2985);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2987);
parentNode.appendChild(node);
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 2991);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeShape", 3001);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3003);
if(!(shape instanceof SVGShape))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3005);
if(Y_LANG.isString(shape))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3007);
shape = this._shapes[shape];
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3010);
if(shape && shape instanceof SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3012);
shape._destroy();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3013);
delete this._shapes[shape.get("id")];
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3015);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3017);
this._redraw();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3019);
return shape;
    },

    /**
     * Removes all shape instances from the dom.
     *
     * @method removeAllShapes
     */
    removeAllShapes: function()
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "removeAllShapes", 3027);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3029);
var shapes = this._shapes,
            i;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3031);
for(i in shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3033);
if(shapes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3035);
shapes[i]._destroy();
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3038);
this._shapes = {};
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_removeChildren", 3048);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3050);
if(node.hasChildNodes())
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3052);
var child;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3053);
while(node.firstChild)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3055);
child = node.firstChild;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3056);
this._removeChildren(child);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3057);
node.removeChild(child);
            }
        }
    },

    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "clear", 3067);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3068);
this.removeAllShapes();
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toggleVisible", 3078);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3080);
var i,
            shapes = this._shapes,
            visibility = val ? "visible" : "hidden";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3083);
if(shapes)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3085);
for(i in shapes)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3087);
if(shapes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3089);
shapes[i].set("visible", val);
                }
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3093);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3095);
this._contentNode.style.visibility = visibility;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3097);
if(this._node)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3099);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getShapeClass", 3111);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3113);
var shape = this._shapeClass[val];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3114);
if(shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3116);
return shape;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3118);
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
        circle: Y.SVGCircle,
        rect: Y.SVGRect,
        path: Y.SVGPath,
        ellipse: Y.SVGEllipse,
        pieslice: Y.SVGPieSlice
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getShapeById", 3143);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3145);
var shape = this._shapes[id];
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3146);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "batch", 3155);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3157);
var autoDraw = this.get("autoDraw");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3158);
this.set("autoDraw", false);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3159);
method();
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3160);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getDocFrag", 3170);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3172);
if(!this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3174);
this._frag = DOCUMENT.createDocumentFragment();
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3176);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_redraw", 3185);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3187);
var autoSize = this.get("autoSize"),
            preserveAspectRatio = this.get("preserveAspectRatio"),
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            left = box.left,
            right = box.right,
            top = box.top,
            bottom = box.bottom,
            width = right - left,
            height = bottom - top,
            computedWidth,
            computedHeight,
            computedLeft,
            computedTop,
            node;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3201);
if(autoSize)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3203);
if(autoSize == "sizeContentToGraphic")
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3205);
node = Y.one(this._node);
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3206);
computedWidth = parseFloat(node.getComputedStyle("width"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3207);
computedHeight = parseFloat(node.getComputedStyle("height"));
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3208);
computedLeft = computedTop = 0;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3209);
this._contentNode.setAttribute("preserveAspectRatio", preserveAspectRatio);
            }
            else 
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3213);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3214);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3215);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3216);
computedTop = top;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3217);
this._state.width = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3218);
this._state.height = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3219);
if(this._node)
                {
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3221);
this._node.style.width = width + "px";
                    _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3222);
this._node.style.height = height + "px";
                }
            }
        }
        else
        {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3228);
computedWidth = width;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3229);
computedHeight = height;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3230);
computedLeft = left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3231);
computedTop = top;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3233);
if(this._contentNode)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3235);
this._contentNode.style.left = computedLeft + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3236);
this._contentNode.style.top = computedTop + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3237);
this._contentNode.setAttribute("width", computedWidth);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3238);
this._contentNode.setAttribute("height", computedHeight);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3239);
this._contentNode.style.width = computedWidth + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3240);
this._contentNode.style.height = computedHeight + "px";
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3241);
this._contentNode.setAttribute("viewBox", "" + left + " " + top + " " + width + " " + height + "");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3243);
if(this._frag)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3245);
if(this._contentNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3247);
this._contentNode.appendChild(this._frag);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3249);
this._frag = null;
        } 
    },
 
    /**
     * Adds a shape to the redraw queue and calculates the contentBounds. Used internally 
     * by `Shape` instances.
     *
     * @method addToRedrawQueue
     * @param shape {SVGShape}
     * @protected
     */
    addToRedrawQueue: function(shape)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "addToRedrawQueue", 3261);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3263);
var shapeBox,
            box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3265);
this._shapes[shape.get("id")] = shape;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3266);
if(!this.get("resizeDown"))
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3268);
shapeBox = shape.getBounds();
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3269);
box = this._contentBounds;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3270);
box.left = box.left < shapeBox.left ? box.left : shapeBox.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3271);
box.top = box.top < shapeBox.top ? box.top : shapeBox.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3272);
box.right = box.right > shapeBox.right ? box.right : shapeBox.right;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3273);
box.bottom = box.bottom > shapeBox.bottom ? box.bottom : shapeBox.bottom;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3274);
box.width = box.right - box.left;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3275);
box.height = box.bottom - box.top;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3276);
this._contentBounds = box;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3278);
if(this.get("autoDraw")) 
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3280);
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
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_getUpdatedContentBounds", 3291);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3293);
var bounds,
            i,
            shape,
            queue = this._shapes,
            box = {};
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3298);
for(i in queue)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3300);
if(queue.hasOwnProperty(i))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3302);
shape = queue[i];
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3303);
bounds = shape.getBounds();
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3304);
box.left = Y_LANG.isNumber(box.left) ? Math.min(box.left, bounds.left) : bounds.left;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3305);
box.top = Y_LANG.isNumber(box.top) ? Math.min(box.top, bounds.top) : bounds.top;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3306);
box.right = Y_LANG.isNumber(box.right) ? Math.max(box.right, bounds.right) : bounds.right;
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3307);
box.bottom = Y_LANG.isNumber(box.bottom) ? Math.max(box.bottom, bounds.bottom) : bounds.bottom;
            }
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3310);
box.left = Y_LANG.isNumber(box.left) ? box.left : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3311);
box.top = Y_LANG.isNumber(box.top) ? box.top : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3312);
box.right = Y_LANG.isNumber(box.right) ? box.right : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3313);
box.bottom = Y_LANG.isNumber(box.bottom) ? box.bottom : 0;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3314);
this._contentBounds = box;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3315);
return box;
    },

    /**
     * Creates a contentNode element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphics", 3324);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3325);
var contentNode = this._createGraphicNode("svg"),
            pointerEvents = this.get("pointerEvents");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3327);
contentNode.style.position = "absolute";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3328);
contentNode.style.top = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3329);
contentNode.style.left = "0px";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3330);
contentNode.style.overflow = "auto";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3331);
contentNode.setAttribute("overflow", "auto");
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3332);
contentNode.setAttribute("pointer-events", pointerEvents);
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3333);
return contentNode;
    },

    /**
     * Creates a graphic node
     *
     * @method _createGraphicNode
     * @param {String} type node type to create
     * @param {String} pe specified pointer-events value
     * @return HTMLElement
     * @private
     */
    _createGraphicNode: function(type, pe)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_createGraphicNode", 3345);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3347);
var node = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3349);
if(type !== "defs" && type !== "stop" && type !== "linearGradient" && type != "radialGradient")
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3351);
node.setAttribute("pointer-events", v);
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3353);
return node;
    },

    /**
     * Returns a reference to a gradient definition based on an id and type.
     *
     * @method getGradientNode
     * @param {String} key id that references the gradient definition
     * @param {String} type description of the gradient type
     * @return HTMLElement
     * @protected
     */
    getGradientNode: function(key, type)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "getGradientNode", 3365);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3367);
var gradients = this._gradients,
            gradient,
            nodeType = type + "Gradient";
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3370);
if(gradients.hasOwnProperty(key) && gradients[key].tagName.indexOf(type) > -1)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3372);
gradient = this._gradients[key];
        }
        else
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3376);
gradient = this._createGraphicNode(nodeType);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3377);
if(!this._defs)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3379);
this._defs = this._createGraphicNode("defs");
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3380);
this._contentNode.appendChild(this._defs);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3382);
this._defs.appendChild(gradient);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3383);
key = key || "gradient" + Math.round(100000 * Math.random());
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3384);
gradient.setAttribute("id", key);
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3385);
if(gradients.hasOwnProperty(key))
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3387);
this._defs.removeChild(gradients[key]);
            }
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3389);
gradients[key] = gradient;
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3391);
return gradient;
    },

    /**
     * Inserts shape on the top of the tree.
     *
     * @method _toFront
     * @param {SVGShape} Shape to add.
     * @private
     */
    _toFront: function(shape)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toFront", 3401);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3403);
var contentNode = this._contentNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3404);
if(shape instanceof Y.SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3406);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3408);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3410);
contentNode.appendChild(shape);
        }
    },

    /**
     * Inserts shape as the first child of the content node.
     *
     * @method _toBack
     * @param {SVGShape} Shape to add.
     * @private
     */
    _toBack: function(shape)
    {
        _yuitest_coverfunc("build/graphics-svg/graphics-svg.js", "_toBack", 3421);
_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3423);
var contentNode = this._contentNode,
            targetNode;
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3425);
if(shape instanceof Y.SVGShape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3427);
shape = shape.get("node");
        }
        _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3429);
if(contentNode && shape)
        {
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3431);
targetNode = contentNode.firstChild;
            _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3432);
if(targetNode)
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3434);
contentNode.insertBefore(shape, targetNode);
            }
            else
            {
                _yuitest_coverline("build/graphics-svg/graphics-svg.js", 3438);
contentNode.appendChild(shape);
            }
        }
    }
});

_yuitest_coverline("build/graphics-svg/graphics-svg.js", 3444);
Y.SVGGraphic = SVGGraphic;



}, '3.7.3', {"requires": ["graphics"]});

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
_yuitest_coverage["build/matrix/matrix.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/matrix/matrix.js",
    code: []
};
_yuitest_coverage["build/matrix/matrix.js"].code=["YUI.add('matrix', function (Y, NAME) {","","/**"," * Matrix utilities."," *"," * @class MatrixUtil"," * @module matrix"," **/","","var MatrixUtil = {","        /**","         * Used as value for the _rounding method.","         *","         * @property _rounder","         * @private","         */","        _rounder: 100000,","        ","        /**","         * Rounds values","         *","         * @method _round","         * @private","         */","        _round: function(val) {","            val = Math.round(val * MatrixUtil._rounder) / MatrixUtil._rounder;","            return val;","        },","        /**","         * Converts a radian value to a degree.","         *","         * @method rad2deg","         * @param {Number} rad Radian value to be converted.","         * @return Number","         */","        rad2deg: function(rad) {","            var deg = rad * (180 / Math.PI);","            return deg;","        },","","        /**","         * Converts a degree value to a radian.","         *","         * @method deg2rad","         * @param {Number} deg Degree value to be converted to radian.","         * @return Number","         */","        deg2rad: function(deg) {","            var rad = deg * (Math.PI / 180);","            return rad;","        },","","        /**","         * Converts an angle to a radian","         *","         * @method angle2rad","         * @param {Objecxt} val Value to be converted to radian.","         * @return Number","         */","        angle2rad: function(val) {","            if (typeof val === 'string' && val.indexOf('rad') > -1) {","                val = parseFloat(val);","            } else { // default to deg","                val = MatrixUtil.deg2rad(parseFloat(val));","            }","","            return val;","        },","","        /**","         * Converts a transform object to an array of column vectors. ","         *","         * /                                             \\","         * | matrix[0][0]   matrix[1][0]    matrix[2][0] |","         * | matrix[0][1]   matrix[1][1]    matrix[2][1] |","         * | matrix[0][2]   matrix[1][2]    matrix[2][2] |","         * \\                                             /","         *","         * @method getnxn","         * @return Array","         */","        convertTransformToArray: function(matrix)","        {","            var matrixArray = [","                    [matrix.a, matrix.c, matrix.dx],","                    [matrix.b, matrix.d, matrix.dy],","                    [0, 0, 1]","                ];","            return matrixArray;","        },","","        /**","         * Returns the determinant of a given matrix. ","         *","         * /                                             \\","         * | matrix[0][0]   matrix[1][0]    matrix[2][0] |","         * | matrix[0][1]   matrix[1][1]    matrix[2][1] |","         * | matrix[0][2]   matrix[1][2]    matrix[2][2] |","         * | matrix[0][3]   matrix[1][3]    matrix[2][3] |","         * \\                                             /","         *","         * @method getDeterminant","         * @param {Array} matrix An nxn matrix represented an array of vector (column) arrays. Each vector array has index for each row.","         * @return Number","         */","        getDeterminant: function(matrix)","        {","            var determinant = 0,","                len = matrix.length,","                i = 0,","                multiplier;","","            if(len == 2)","            {","                return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];","            }","            for(; i < len; ++i)","            {","                multiplier = matrix[i][0];","                if(i % 2 === 0 || i === 0)","                {","                    determinant += multiplier * MatrixUtil.getDeterminant(MatrixUtil.getMinors(matrix, i, 0));  ","                }","                else","                {","                    determinant -= multiplier * MatrixUtil.getDeterminant(MatrixUtil.getMinors(matrix, i, 0));","                }","            }","            return determinant;","        },","","        /**","         * Returns the inverse of a matrix","         *","         * @method inverse","         * @param Array matrix An array representing an nxn matrix","         * @return Array","         *","         * /                                             \\","         * | matrix[0][0]   matrix[1][0]    matrix[2][0] |","         * | matrix[0][1]   matrix[1][1]    matrix[2][1] |","         * | matrix[0][2]   matrix[1][2]    matrix[2][2] |","         * | matrix[0][3]   matrix[1][3]    matrix[2][3] |","         * \\                                             /","         */","        inverse: function(matrix)","        {","            var determinant = 0,","                len = matrix.length,","                i = 0,","                j,","                inverse,","                adjunct = [],","                //vector representing 2x2 matrix","                minor = [];","            if(len === 2) ","            {","                determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];","                inverse = [","                    [matrix[1][1] * determinant, -matrix[1][0] * determinant],","                    [-matrix[0][1] * determinant, matrix[0][0] * determinant]","                ]; ","            }","            else","            {","                determinant = MatrixUtil.getDeterminant(matrix);","                for(; i < len; ++i)","                {","                    adjunct[i] = [];","                    for(j = 0; j < len; ++j)","                    {","                        minor = MatrixUtil.getMinors(matrix, j, i);","                        adjunct[i][j] = MatrixUtil.getDeterminant(minor);","                        if((i + j) % 2 !== 0 && (i + j) !== 0)","                        {","                            adjunct[i][j] *= -1;","                        }","                    }","                }","                inverse = MatrixUtil.scalarMultiply(adjunct, 1/determinant);","            }","            return inverse;","        },","","        /**","         * Multiplies a matrix by a numeric value.","         *","         * @method scalarMultiply","         * @param {Array} matrix The matrix to be altered.","         * @param {Number} multiplier The number to multiply against the matrix.","         * @return Array","         */","        scalarMultiply: function(matrix, multiplier)","        {","            var i = 0,","                j,","                len = matrix.length;","            for(; i < len; ++i)","            {","                for(j = 0; j < len; ++j)","                {","                    matrix[i][j] = MatrixUtil._round(matrix[i][j] * multiplier);","                }","            }","            return matrix;","        },","","        /**","         * Returns the transpose for an nxn matrix.","         *","         * @method transpose","         * @param matrix An nxn matrix represented by an array of vector arrays.","         * @return Array","         */","        transpose: function(matrix)","        {","            var len = matrix.length,","                i = 0,","                j = 0,","                transpose = [];","            for(; i < len; ++i)","            {","                transpose[i] = [];","                for(j = 0; j < len; ++j)","                {","                    transpose[i].push(matrix[j][i]);","                }","            }","            return transpose;","        },","","        /**","         * Returns a matrix of minors based on a matrix, column index and row index.","         *","         * @method getMinors","         * @param {Array} matrix The matrix from which to extract the matrix of minors.","         * @param {Number} columnIndex A zero-based index representing the specified column to exclude.","         * @param {Number} rowIndex A zero-based index represeenting the specified row to exclude.","         * @return Array","         */","        getMinors: function(matrix, columnIndex, rowIndex)","        {","            var minors = [],","                len = matrix.length,","                i = 0,","                j,","                column;","            for(; i < len; ++i)","            {","                if(i !== columnIndex)","                {","                    column = [];","                    for(j = 0; j < len; ++j)","                    {","                        if(j !== rowIndex)","                        {","                            column.push(matrix[i][j]);","                        }","                    }","                    minors.push(column);","                }","            }","            return minors;","        },","","        /**","         * Returns the sign of value","         *","         * @method sign","         * @param {Number} val value to be interpreted","         * @return Number","         */","        sign: function(val)","        {","            return val === 0 ? 1 : val/Math.abs(val);","        },","","        /**","         * Multiplies a vector and a matrix","         *","         * @method vectorMatrixProduct","         * @param {Array} vector Array representing a column vector","         * @param {Array} matrix Array representing an nxn matrix","         * @return Array","         */","        vectorMatrixProduct: function(vector, matrix)","        {","            var i,","                j,","                len = vector.length,","                product = [],","                rowProduct;","            for(i = 0; i < len; ++i)","            {","                rowProduct = 0;","                for(j = 0; j < len; ++j)","                {","                    rowProduct += vector[i] * matrix[i][j];","                }","                product[i] = rowProduct;","            }","            return product;","        },","        ","        /**","         * Breaks up a 2d transform matrix into a series of transform operations.","         *","         * @method decompose","         * @param {Array} 3x3 matrix array","         * @return Array","         */","        decompose: function(matrix)","        {","            var a = parseFloat(matrix[0][0]),","                b = parseFloat(matrix[1][0]),","                c = parseFloat(matrix[0][1]),","                d = parseFloat(matrix[1][1]),","                dx = parseFloat(matrix[0][2]),","                dy = parseFloat(matrix[1][2]),","                rotate,","                sx,","                sy,","                shear;","            if((a * d - b * c) === 0)","            {","                return false;","            }","            //get length of vector(ab)","            sx = MatrixUtil._round(Math.sqrt(a * a + b * b));","            //normalize components of vector(ab)","            a /= sx;","            b /= sx;","            shear = MatrixUtil._round(a * c + b * d);","            c -= a * shear;","            d -= b * shear;","            //get length of vector(cd)","            sy = MatrixUtil._round(Math.sqrt(c * c + d * d));","            //normalize components of vector(cd)","            c /= sy;","            d /= sy;","            shear /=sy;","            shear = MatrixUtil._round(MatrixUtil.rad2deg(Math.atan(shear)));","            rotate = MatrixUtil._round(MatrixUtil.rad2deg(Math.atan2(matrix[1][0], matrix[0][0])));","","            return [","                [\"translate\", dx, dy],","                [\"rotate\", rotate],","                [\"skewX\", shear],","                [\"scale\", sx, sy]","            ];","        },","","        /**","         * Parses a transform string and returns an array of transform arrays.","         *","         * @method getTransformArray ","         * @param {String} val A transform string","         * @return Array","         */","        getTransformArray: function(transform) {","            var re = /\\s*([a-z]*)\\(([\\w,\\.,\\-,\\s]*)\\)/gi,","                transforms = [],","                args,","                m,","                decomp,","                methods = MatrixUtil.transformMethods;","            ","            while ((m = re.exec(transform))) {","                if (methods.hasOwnProperty(m[1])) ","                {","                    args = m[2].split(',');","                    args.unshift(m[1]);","                    transforms.push(args);","                }","                else if(m[1] == \"matrix\")","                {","                    args = m[2].split(',');","                    decomp = MatrixUtil.decompose([","                        [args[0], args[2], args[4]],","                        [args[1], args[3], args[5]],","                        [0, 0, 1]","                    ]);","                    transforms.push(decomp[0]);","                    transforms.push(decomp[1]);","                    transforms.push(decomp[2]);","                    transforms.push(decomp[3]);","                }","            }","            return transforms;","        },","        ","        /**","         * Returns an array of transform arrays representing transform functions and arguments.","         *","         * @method getTransformFunctionArray","         * @return Array","         */","        getTransformFunctionArray: function(transform) {","            var list;","            switch(transform)","            {","                case \"skew\" :","                    list = [transform, 0, 0];","                break;","                case \"scale\" :","                    list = [transform, 1, 1];","                break;","                case \"scaleX\" :","                    list = [transform, 1];","                break;","                case \"scaleY\" :","                    list = [transform, 1];","                break;","                case \"translate\" :","                    list = [transform, 0, 0];","                break;","                default :","                    list = [transform, 0];","                break;","            }","            return list;","        },","","        /**","         * Compares to arrays or transform functions to ensure both contain the same functions in the same ","         * order.","         *","         * @method compareTransformSequence","         * @param {Array} list1 Array to compare","         * @param {Array} list2 Array to compare","         * @return Boolean","         */","        compareTransformSequence: function(list1, list2)","        {","            var i = 0,","                len = list1.length,","                len2 = list2.length,","                isEqual = len === len2;","            if(isEqual)","            {","                for(; i < len; ++i)","                {","                    if(list1[i][0] != list2[i][0])","                    {","                        isEqual = false;","                        break;","                    }","                }","            }","            return isEqual;","        },","","        /**","         * Mapping of possible transform method names.","         *","         * @property transformMethods","         * @type Object","         */","        transformMethods: {","            rotate: \"rotate\",","            skew: \"skew\",","            skewX: \"skewX\",","            skewY: \"skewY\",","            translate: \"translate\",","            translateX: \"translateX\",","            translateY: \"tranlsateY\",","            scale: \"scale\",","            scaleX: \"scaleX\",","            scaleY: \"scaleY\"","        }","","};","","Y.MatrixUtil = MatrixUtil;","","/**"," * Matrix is a class that allows for the manipulation of a transform matrix."," * This class is a work in progress."," *"," * @class Matrix"," * @constructor"," * @module matrix"," */","var Matrix = function(config) {","    this.init(config);","};","","Matrix.prototype = {","    /**","     * Used as value for the _rounding method.","     *","     * @property _rounder","     * @private","     */","    _rounder: 100000,","","    /**","     * Updates the matrix. ","     *","     * @method multiple","     * @param {Number} a ","     * @param {Number} b","     * @param {Number} c","     * @param {Number} d","     * @param {Number} dx","     * @param {Number} dy","     */","    multiply: function(a, b, c, d, dx, dy) {","        var matrix = this,","            matrix_a = matrix.a * a + matrix.c * b,","            matrix_b = matrix.b * a + matrix.d * b,","            matrix_c = matrix.a * c + matrix.c * d,","            matrix_d = matrix.b * c + matrix.d * d,","            matrix_dx = matrix.a * dx + matrix.c * dy + matrix.dx,","            matrix_dy = matrix.b * dx + matrix.d * dy + matrix.dy;","","        matrix.a = this._round(matrix_a);","        matrix.b = this._round(matrix_b);","        matrix.c = this._round(matrix_c);","        matrix.d = this._round(matrix_d);","        matrix.dx = this._round(matrix_dx);","        matrix.dy = this._round(matrix_dy);","        return this;","    },","","    /**","     * Parses a string and updates the matrix.","     *","     * @method applyCSSText","     * @param {String} val A css transform string","     */","    applyCSSText: function(val) {","        var re = /\\s*([a-z]*)\\(([\\w,\\.,\\-,\\s]*)\\)/gi,","            args,","            m;","","        val = val.replace(/matrix/g, \"multiply\");","        while ((m = re.exec(val))) {","            if (typeof this[m[1]] === 'function') {","                args = m[2].split(',');","                this[m[1]].apply(this, args);","            }","        }","    },","    ","    /**","     * Parses a string and returns an array of transform arrays.","     *","     * @method getTransformArray ","     * @param {String} val A css transform string","     * @return Array","     */","    getTransformArray: function(val) {","        var re = /\\s*([a-z]*)\\(([\\w,\\.,\\-,\\s]*)\\)/gi,","            transforms = [],","            args,","            m;","        ","        val = val.replace(/matrix/g, \"multiply\");","        while ((m = re.exec(val))) {","            if (typeof this[m[1]] === 'function') {","                args = m[2].split(',');","                args.unshift(m[1]);","                transforms.push(args);","            }","        }","        return transforms;","    },","","    /**","     * Default values for the matrix","     *","     * @property _defaults","     * @private","     */","    _defaults: {","        a: 1,","        b: 0,","        c: 0,","        d: 1,","        dx: 0,","        dy: 0","    },","","    /**","     * Rounds values","     *","     * @method _round","     * @private","     */","    _round: function(val) {","        val = Math.round(val * this._rounder) / this._rounder;","        return val;","    },","","    /**","     * Initializes a matrix.","     *","     * @method init","     * @param {Object} config Specified key value pairs for matrix properties. If a property is not explicitly defined in the config argument,","     * the default value will be used.","     */","    init: function(config) {","        var defaults = this._defaults,","            prop;","","        config = config || {};","","        for (prop in defaults) {","            if(defaults.hasOwnProperty(prop))","            {","                this[prop] = (prop in config) ? config[prop] : defaults[prop];","            }","        }","","        this._config = config;","    },","","    /**","     * Applies a scale transform","     *","     * @method scale","     * @param {Number} val","     */","    scale: function(x, y) {","        this.multiply(x, 0, 0, y, 0, 0);","        return this;","    },","    ","    /**","     * Applies a skew transformation.","     *","     * @method skew","     * @param {Number} x The value to skew on the x-axis.","     * @param {Number} y The value to skew on the y-axis.","     */","    skew: function(x, y) {","        x = x || 0;","        y = y || 0;","","        if (x !== undefined) { // null or undef","            x = Math.tan(this.angle2rad(x));","","        }","","        if (y !== undefined) { // null or undef","            y = Math.tan(this.angle2rad(y));","        }","","        this.multiply(1, y, x, 1, 0, 0);","        return this;","    },","","    /**","     * Applies a skew to the x-coordinate","     *","     * @method skewX","     * @param {Number} x x-coordinate","     */","    skewX: function(x) {","        this.skew(x);","        return this;","    },","","    /**","     * Applies a skew to the y-coordinate","     *","     * @method skewY","     * @param {Number} y y-coordinate","     */","    skewY: function(y) {","        this.skew(null, y);","        return this;","    },","","    /**","     * Returns a string of text that can be used to populate a the css transform property of an element.","     *","     * @method toCSSText","     * @return String","     */","    toCSSText: function() {","        var matrix = this,","            text = 'matrix(' +","                    matrix.a + ',' + ","                    matrix.b + ',' + ","                    matrix.c + ',' + ","                    matrix.d + ',' + ","                    matrix.dx + ',' +","                    matrix.dy + ')';","        return text;","    },","","    /**","     * Returns a string that can be used to populate the css filter property of an element.","     *","     * @method toFilterText","     * @return String","     */","    toFilterText: function() {","        var matrix = this,","            text = 'progid:DXImageTransform.Microsoft.Matrix(';","        text +=     'M11=' + matrix.a + ',' + ","                    'M21=' + matrix.b + ',' + ","                    'M12=' + matrix.c + ',' + ","                    'M22=' + matrix.d + ',' +","                    'sizingMethod=\"auto expand\")';","","        text += '';","","        return text;","    },","","    /**","     * Converts a radian value to a degree.","     *","     * @method rad2deg","     * @param {Number} rad Radian value to be converted.","     * @return Number","     */","    rad2deg: function(rad) {","        var deg = rad * (180 / Math.PI);","        return deg;","    },","","    /**","     * Converts a degree value to a radian.","     *","     * @method deg2rad","     * @param {Number} deg Degree value to be converted to radian.","     * @return Number","     */","    deg2rad: function(deg) {","        var rad = deg * (Math.PI / 180);","        return rad;","    },","","    angle2rad: function(val) {","        if (typeof val === 'string' && val.indexOf('rad') > -1) {","            val = parseFloat(val);","        } else { // default to deg","            val = this.deg2rad(parseFloat(val));","        }","","        return val;","    },","","    /**","     * Applies a rotate transform.","     *","     * @method rotate","     * @param {Number} deg The degree of the rotation.","     */","    rotate: function(deg, x, y) {","        var rad = this.angle2rad(deg),","            sin = Math.sin(rad),","            cos = Math.cos(rad);","        this.multiply(cos, sin, 0 - sin, cos, 0, 0);","        return this;","    },","","    /**","     * Applies translate transformation.","     *","     * @method translate","     * @param {Number} x The value to transate on the x-axis.","     * @param {Number} y The value to translate on the y-axis.","     */","    translate: function(x, y) {","        x = parseFloat(x) || 0;","        y = parseFloat(y) || 0;","        this.multiply(1, 0, 0, 1, x, y);","        return this;","    },","    ","    /**","     * Applies a translate to the x-coordinate","     *","     * @method translateX","     * @param {Number} x x-coordinate","     */","    translateX: function(x) {","        this.translate(x);","        return this;","    },","","    /**","     * Applies a translate to the y-coordinate","     *","     * @method translateY","     * @param {Number} y y-coordinate","     */","    translateY: function(y) {","        this.translate(null, y);","        return this;","    },","","","    /**","     * Returns an identity matrix.","     *","     * @method identity","     * @return Object","     */","    identity: function() {","        var config = this._config,","            defaults = this._defaults,","            prop;","","        for (prop in config) {","            if (prop in defaults) {","                this[prop] = defaults[prop];","            }","        }","        return this;","    },","","    /**","     * Returns a 3x3 Matrix array","     *","     * /                                             \\","     * | matrix[0][0]   matrix[1][0]    matrix[2][0] |","     * | matrix[0][1]   matrix[1][1]    matrix[2][1] |","     * | matrix[0][2]   matrix[1][2]    matrix[2][2] |","     * \\                                             /","     *","     * @method getMatrixArray","     * @return Array","     */","    getMatrixArray: function()","    {","        var matrix = this,","            matrixArray = [","                [matrix.a, matrix.c, matrix.dx],","                [matrix.b, matrix.d, matrix.dy],","                [0, 0, 1]","            ];","        return matrixArray;","    },","","    /**","     * Returns the left, top, right and bottom coordinates for a transformed","     * item.","     *","     * @method getContentRect","     * @param {Number} width The width of the item.","     * @param {Number} height The height of the item.","     * @param {Number} x The x-coordinate of the item.","     * @param {Number} y The y-coordinate of the item.","     * @return Object","     */","    getContentRect: function(width, height, x, y)","    {","        var left = !isNaN(x) ? x : 0,","            top = !isNaN(y) ? y : 0,","            right = left + width,","            bottom = top + height,","            matrix = this,","            a = matrix.a,","            b = matrix.b,","            c = matrix.c,","            d = matrix.d,","            dx = matrix.dx,","            dy = matrix.dy,","            x1 = (a * left + c * top + dx), ","            y1 = (b * left + d * top + dy),","            //[x2, y2]","            x2 = (a * right + c * top + dx),","            y2 = (b * right + d * top + dy),","            //[x3, y3]","            x3 = (a * left + c * bottom + dx),","            y3 = (b * left + d * bottom + dy),","            //[x4, y4]","            x4 = (a * right + c * bottom + dx),","            y4 = (b * right + d * bottom + dy);","        return {","            left: Math.min(x3, Math.min(x1, Math.min(x2, x4))),","            right: Math.max(x3, Math.max(x1, Math.max(x2, x4))),","            top: Math.min(y2, Math.min(y4, Math.min(y3, y1))),","            bottom: Math.max(y2, Math.max(y4, Math.max(y3, y1)))","        };","    },       ","    ","    /**","     * Returns the determinant of the matrix.","     *","     * @method getDeterminant","     * @return Number","     */","    getDeterminant: function()","    {","        return Y.MatrixUtil.getDeterminant(this.getMatrixArray());","    },","","    /**","     * Returns the inverse (in array form) of the matrix.","     *","     * @method inverse","     * @return Array","     */","    inverse: function()","    {","        return Y.MatrixUtil.inverse(this.getMatrixArray());","    },","","    /**","     * Returns the transpose of the matrix","     *","     * @method transpose","     * @return Array","     */","    transpose: function()","    {","        return Y.MatrixUtil.transpose(this.getMatrixArray());","    },","","    /**","     * Returns an array of transform commands that represent the matrix.","     *","     * @method decompose","     * @return Array","     */","    decompose: function()","    {","        return Y.MatrixUtil.decompose(this.getMatrixArray());","    }","};","","Y.Matrix = Matrix;","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/matrix/matrix.js"].lines = {"1":0,"10":0,"26":0,"27":0,"37":0,"38":0,"49":0,"50":0,"61":0,"62":0,"64":0,"67":0,"84":0,"89":0,"108":0,"113":0,"115":0,"117":0,"119":0,"120":0,"122":0,"126":0,"129":0,"148":0,"156":0,"158":0,"159":0,"166":0,"167":0,"169":0,"170":0,"172":0,"173":0,"174":0,"176":0,"180":0,"182":0,"195":0,"198":0,"200":0,"202":0,"205":0,"217":0,"221":0,"223":0,"224":0,"226":0,"229":0,"243":0,"248":0,"250":0,"252":0,"253":0,"255":0,"257":0,"260":0,"263":0,"275":0,"288":0,"293":0,"295":0,"296":0,"298":0,"300":0,"302":0,"314":0,"324":0,"326":0,"329":0,"331":0,"332":0,"333":0,"334":0,"335":0,"337":0,"339":0,"340":0,"341":0,"342":0,"343":0,"345":0,"361":0,"368":0,"369":0,"371":0,"372":0,"373":0,"375":0,"377":0,"378":0,"383":0,"384":0,"385":0,"386":0,"389":0,"399":0,"400":0,"403":0,"404":0,"406":0,"407":0,"409":0,"410":0,"412":0,"413":0,"415":0,"416":0,"418":0,"419":0,"421":0,"435":0,"439":0,"441":0,"443":0,"445":0,"446":0,"450":0,"474":0,"484":0,"485":0,"488":0,"509":0,"517":0,"518":0,"519":0,"520":0,"521":0,"522":0,"523":0,"533":0,"537":0,"538":0,"539":0,"540":0,"541":0,"554":0,"559":0,"560":0,"561":0,"562":0,"563":0,"564":0,"567":0,"592":0,"593":0,"604":0,"607":0,"609":0,"610":0,"612":0,"616":0,"626":0,"627":0,"638":0,"639":0,"641":0,"642":0,"646":0,"647":0,"650":0,"651":0,"661":0,"662":0,"672":0,"673":0,"683":0,"691":0,"701":0,"703":0,"709":0,"711":0,"722":0,"723":0,"734":0,"735":0,"739":0,"740":0,"742":0,"745":0,"755":0,"758":0,"759":0,"770":0,"771":0,"772":0,"773":0,"783":0,"784":0,"794":0,"795":0,"806":0,"810":0,"811":0,"812":0,"815":0,"832":0,"838":0,"854":0,"876":0,"892":0,"903":0,"914":0,"925":0,"929":0};
_yuitest_coverage["build/matrix/matrix.js"].functions = {"_round:25":0,"rad2deg:36":0,"deg2rad:48":0,"angle2rad:60":0,"convertTransformToArray:82":0,"getDeterminant:106":0,"inverse:146":0,"scalarMultiply:193":0,"transpose:215":0,"getMinors:241":0,"sign:273":0,"vectorMatrixProduct:286":0,"decompose:312":0,"getTransformArray:360":0,"getTransformFunctionArray:398":0,"compareTransformSequence:433":0,"Matrix:484":0,"multiply:508":0,"applyCSSText:532":0,"getTransformArray:553":0,"_round:591":0,"init:603":0,"scale:625":0,"skew:637":0,"skewX:660":0,"skewY:671":0,"toCSSText:682":0,"toFilterText:700":0,"rad2deg:721":0,"deg2rad:733":0,"angle2rad:738":0,"rotate:754":0,"translate:769":0,"translateX:782":0,"translateY:793":0,"identity:805":0,"getMatrixArray:830":0,"getContentRect:852":0,"getDeterminant:890":0,"inverse:901":0,"transpose:912":0,"decompose:923":0,"(anonymous 1):1":0};
_yuitest_coverage["build/matrix/matrix.js"].coveredLines = 204;
_yuitest_coverage["build/matrix/matrix.js"].coveredFunctions = 43;
_yuitest_coverline("build/matrix/matrix.js", 1);
YUI.add('matrix', function (Y, NAME) {

/**
 * Matrix utilities.
 *
 * @class MatrixUtil
 * @module matrix
 **/

_yuitest_coverfunc("build/matrix/matrix.js", "(anonymous 1)", 1);
_yuitest_coverline("build/matrix/matrix.js", 10);
var MatrixUtil = {
        /**
         * Used as value for the _rounding method.
         *
         * @property _rounder
         * @private
         */
        _rounder: 100000,
        
        /**
         * Rounds values
         *
         * @method _round
         * @private
         */
        _round: function(val) {
            _yuitest_coverfunc("build/matrix/matrix.js", "_round", 25);
_yuitest_coverline("build/matrix/matrix.js", 26);
val = Math.round(val * MatrixUtil._rounder) / MatrixUtil._rounder;
            _yuitest_coverline("build/matrix/matrix.js", 27);
return val;
        },
        /**
         * Converts a radian value to a degree.
         *
         * @method rad2deg
         * @param {Number} rad Radian value to be converted.
         * @return Number
         */
        rad2deg: function(rad) {
            _yuitest_coverfunc("build/matrix/matrix.js", "rad2deg", 36);
_yuitest_coverline("build/matrix/matrix.js", 37);
var deg = rad * (180 / Math.PI);
            _yuitest_coverline("build/matrix/matrix.js", 38);
return deg;
        },

        /**
         * Converts a degree value to a radian.
         *
         * @method deg2rad
         * @param {Number} deg Degree value to be converted to radian.
         * @return Number
         */
        deg2rad: function(deg) {
            _yuitest_coverfunc("build/matrix/matrix.js", "deg2rad", 48);
_yuitest_coverline("build/matrix/matrix.js", 49);
var rad = deg * (Math.PI / 180);
            _yuitest_coverline("build/matrix/matrix.js", 50);
return rad;
        },

        /**
         * Converts an angle to a radian
         *
         * @method angle2rad
         * @param {Objecxt} val Value to be converted to radian.
         * @return Number
         */
        angle2rad: function(val) {
            _yuitest_coverfunc("build/matrix/matrix.js", "angle2rad", 60);
_yuitest_coverline("build/matrix/matrix.js", 61);
if (typeof val === 'string' && val.indexOf('rad') > -1) {
                _yuitest_coverline("build/matrix/matrix.js", 62);
val = parseFloat(val);
            } else { // default to deg
                _yuitest_coverline("build/matrix/matrix.js", 64);
val = MatrixUtil.deg2rad(parseFloat(val));
            }

            _yuitest_coverline("build/matrix/matrix.js", 67);
return val;
        },

        /**
         * Converts a transform object to an array of column vectors. 
         *
         * /                                             \
         * | matrix[0][0]   matrix[1][0]    matrix[2][0] |
         * | matrix[0][1]   matrix[1][1]    matrix[2][1] |
         * | matrix[0][2]   matrix[1][2]    matrix[2][2] |
         * \                                             /
         *
         * @method getnxn
         * @return Array
         */
        convertTransformToArray: function(matrix)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "convertTransformToArray", 82);
_yuitest_coverline("build/matrix/matrix.js", 84);
var matrixArray = [
                    [matrix.a, matrix.c, matrix.dx],
                    [matrix.b, matrix.d, matrix.dy],
                    [0, 0, 1]
                ];
            _yuitest_coverline("build/matrix/matrix.js", 89);
return matrixArray;
        },

        /**
         * Returns the determinant of a given matrix. 
         *
         * /                                             \
         * | matrix[0][0]   matrix[1][0]    matrix[2][0] |
         * | matrix[0][1]   matrix[1][1]    matrix[2][1] |
         * | matrix[0][2]   matrix[1][2]    matrix[2][2] |
         * | matrix[0][3]   matrix[1][3]    matrix[2][3] |
         * \                                             /
         *
         * @method getDeterminant
         * @param {Array} matrix An nxn matrix represented an array of vector (column) arrays. Each vector array has index for each row.
         * @return Number
         */
        getDeterminant: function(matrix)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "getDeterminant", 106);
_yuitest_coverline("build/matrix/matrix.js", 108);
var determinant = 0,
                len = matrix.length,
                i = 0,
                multiplier;

            _yuitest_coverline("build/matrix/matrix.js", 113);
if(len == 2)
            {
                _yuitest_coverline("build/matrix/matrix.js", 115);
return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
            }
            _yuitest_coverline("build/matrix/matrix.js", 117);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/matrix/matrix.js", 119);
multiplier = matrix[i][0];
                _yuitest_coverline("build/matrix/matrix.js", 120);
if(i % 2 === 0 || i === 0)
                {
                    _yuitest_coverline("build/matrix/matrix.js", 122);
determinant += multiplier * MatrixUtil.getDeterminant(MatrixUtil.getMinors(matrix, i, 0));  
                }
                else
                {
                    _yuitest_coverline("build/matrix/matrix.js", 126);
determinant -= multiplier * MatrixUtil.getDeterminant(MatrixUtil.getMinors(matrix, i, 0));
                }
            }
            _yuitest_coverline("build/matrix/matrix.js", 129);
return determinant;
        },

        /**
         * Returns the inverse of a matrix
         *
         * @method inverse
         * @param Array matrix An array representing an nxn matrix
         * @return Array
         *
         * /                                             \
         * | matrix[0][0]   matrix[1][0]    matrix[2][0] |
         * | matrix[0][1]   matrix[1][1]    matrix[2][1] |
         * | matrix[0][2]   matrix[1][2]    matrix[2][2] |
         * | matrix[0][3]   matrix[1][3]    matrix[2][3] |
         * \                                             /
         */
        inverse: function(matrix)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "inverse", 146);
_yuitest_coverline("build/matrix/matrix.js", 148);
var determinant = 0,
                len = matrix.length,
                i = 0,
                j,
                inverse,
                adjunct = [],
                //vector representing 2x2 matrix
                minor = [];
            _yuitest_coverline("build/matrix/matrix.js", 156);
if(len === 2) 
            {
                _yuitest_coverline("build/matrix/matrix.js", 158);
determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
                _yuitest_coverline("build/matrix/matrix.js", 159);
inverse = [
                    [matrix[1][1] * determinant, -matrix[1][0] * determinant],
                    [-matrix[0][1] * determinant, matrix[0][0] * determinant]
                ]; 
            }
            else
            {
                _yuitest_coverline("build/matrix/matrix.js", 166);
determinant = MatrixUtil.getDeterminant(matrix);
                _yuitest_coverline("build/matrix/matrix.js", 167);
for(; i < len; ++i)
                {
                    _yuitest_coverline("build/matrix/matrix.js", 169);
adjunct[i] = [];
                    _yuitest_coverline("build/matrix/matrix.js", 170);
for(j = 0; j < len; ++j)
                    {
                        _yuitest_coverline("build/matrix/matrix.js", 172);
minor = MatrixUtil.getMinors(matrix, j, i);
                        _yuitest_coverline("build/matrix/matrix.js", 173);
adjunct[i][j] = MatrixUtil.getDeterminant(minor);
                        _yuitest_coverline("build/matrix/matrix.js", 174);
if((i + j) % 2 !== 0 && (i + j) !== 0)
                        {
                            _yuitest_coverline("build/matrix/matrix.js", 176);
adjunct[i][j] *= -1;
                        }
                    }
                }
                _yuitest_coverline("build/matrix/matrix.js", 180);
inverse = MatrixUtil.scalarMultiply(adjunct, 1/determinant);
            }
            _yuitest_coverline("build/matrix/matrix.js", 182);
return inverse;
        },

        /**
         * Multiplies a matrix by a numeric value.
         *
         * @method scalarMultiply
         * @param {Array} matrix The matrix to be altered.
         * @param {Number} multiplier The number to multiply against the matrix.
         * @return Array
         */
        scalarMultiply: function(matrix, multiplier)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "scalarMultiply", 193);
_yuitest_coverline("build/matrix/matrix.js", 195);
var i = 0,
                j,
                len = matrix.length;
            _yuitest_coverline("build/matrix/matrix.js", 198);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/matrix/matrix.js", 200);
for(j = 0; j < len; ++j)
                {
                    _yuitest_coverline("build/matrix/matrix.js", 202);
matrix[i][j] = MatrixUtil._round(matrix[i][j] * multiplier);
                }
            }
            _yuitest_coverline("build/matrix/matrix.js", 205);
return matrix;
        },

        /**
         * Returns the transpose for an nxn matrix.
         *
         * @method transpose
         * @param matrix An nxn matrix represented by an array of vector arrays.
         * @return Array
         */
        transpose: function(matrix)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "transpose", 215);
_yuitest_coverline("build/matrix/matrix.js", 217);
var len = matrix.length,
                i = 0,
                j = 0,
                transpose = [];
            _yuitest_coverline("build/matrix/matrix.js", 221);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/matrix/matrix.js", 223);
transpose[i] = [];
                _yuitest_coverline("build/matrix/matrix.js", 224);
for(j = 0; j < len; ++j)
                {
                    _yuitest_coverline("build/matrix/matrix.js", 226);
transpose[i].push(matrix[j][i]);
                }
            }
            _yuitest_coverline("build/matrix/matrix.js", 229);
return transpose;
        },

        /**
         * Returns a matrix of minors based on a matrix, column index and row index.
         *
         * @method getMinors
         * @param {Array} matrix The matrix from which to extract the matrix of minors.
         * @param {Number} columnIndex A zero-based index representing the specified column to exclude.
         * @param {Number} rowIndex A zero-based index represeenting the specified row to exclude.
         * @return Array
         */
        getMinors: function(matrix, columnIndex, rowIndex)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "getMinors", 241);
_yuitest_coverline("build/matrix/matrix.js", 243);
var minors = [],
                len = matrix.length,
                i = 0,
                j,
                column;
            _yuitest_coverline("build/matrix/matrix.js", 248);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/matrix/matrix.js", 250);
if(i !== columnIndex)
                {
                    _yuitest_coverline("build/matrix/matrix.js", 252);
column = [];
                    _yuitest_coverline("build/matrix/matrix.js", 253);
for(j = 0; j < len; ++j)
                    {
                        _yuitest_coverline("build/matrix/matrix.js", 255);
if(j !== rowIndex)
                        {
                            _yuitest_coverline("build/matrix/matrix.js", 257);
column.push(matrix[i][j]);
                        }
                    }
                    _yuitest_coverline("build/matrix/matrix.js", 260);
minors.push(column);
                }
            }
            _yuitest_coverline("build/matrix/matrix.js", 263);
return minors;
        },

        /**
         * Returns the sign of value
         *
         * @method sign
         * @param {Number} val value to be interpreted
         * @return Number
         */
        sign: function(val)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "sign", 273);
_yuitest_coverline("build/matrix/matrix.js", 275);
return val === 0 ? 1 : val/Math.abs(val);
        },

        /**
         * Multiplies a vector and a matrix
         *
         * @method vectorMatrixProduct
         * @param {Array} vector Array representing a column vector
         * @param {Array} matrix Array representing an nxn matrix
         * @return Array
         */
        vectorMatrixProduct: function(vector, matrix)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "vectorMatrixProduct", 286);
_yuitest_coverline("build/matrix/matrix.js", 288);
var i,
                j,
                len = vector.length,
                product = [],
                rowProduct;
            _yuitest_coverline("build/matrix/matrix.js", 293);
for(i = 0; i < len; ++i)
            {
                _yuitest_coverline("build/matrix/matrix.js", 295);
rowProduct = 0;
                _yuitest_coverline("build/matrix/matrix.js", 296);
for(j = 0; j < len; ++j)
                {
                    _yuitest_coverline("build/matrix/matrix.js", 298);
rowProduct += vector[i] * matrix[i][j];
                }
                _yuitest_coverline("build/matrix/matrix.js", 300);
product[i] = rowProduct;
            }
            _yuitest_coverline("build/matrix/matrix.js", 302);
return product;
        },
        
        /**
         * Breaks up a 2d transform matrix into a series of transform operations.
         *
         * @method decompose
         * @param {Array} 3x3 matrix array
         * @return Array
         */
        decompose: function(matrix)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "decompose", 312);
_yuitest_coverline("build/matrix/matrix.js", 314);
var a = parseFloat(matrix[0][0]),
                b = parseFloat(matrix[1][0]),
                c = parseFloat(matrix[0][1]),
                d = parseFloat(matrix[1][1]),
                dx = parseFloat(matrix[0][2]),
                dy = parseFloat(matrix[1][2]),
                rotate,
                sx,
                sy,
                shear;
            _yuitest_coverline("build/matrix/matrix.js", 324);
if((a * d - b * c) === 0)
            {
                _yuitest_coverline("build/matrix/matrix.js", 326);
return false;
            }
            //get length of vector(ab)
            _yuitest_coverline("build/matrix/matrix.js", 329);
sx = MatrixUtil._round(Math.sqrt(a * a + b * b));
            //normalize components of vector(ab)
            _yuitest_coverline("build/matrix/matrix.js", 331);
a /= sx;
            _yuitest_coverline("build/matrix/matrix.js", 332);
b /= sx;
            _yuitest_coverline("build/matrix/matrix.js", 333);
shear = MatrixUtil._round(a * c + b * d);
            _yuitest_coverline("build/matrix/matrix.js", 334);
c -= a * shear;
            _yuitest_coverline("build/matrix/matrix.js", 335);
d -= b * shear;
            //get length of vector(cd)
            _yuitest_coverline("build/matrix/matrix.js", 337);
sy = MatrixUtil._round(Math.sqrt(c * c + d * d));
            //normalize components of vector(cd)
            _yuitest_coverline("build/matrix/matrix.js", 339);
c /= sy;
            _yuitest_coverline("build/matrix/matrix.js", 340);
d /= sy;
            _yuitest_coverline("build/matrix/matrix.js", 341);
shear /=sy;
            _yuitest_coverline("build/matrix/matrix.js", 342);
shear = MatrixUtil._round(MatrixUtil.rad2deg(Math.atan(shear)));
            _yuitest_coverline("build/matrix/matrix.js", 343);
rotate = MatrixUtil._round(MatrixUtil.rad2deg(Math.atan2(matrix[1][0], matrix[0][0])));

            _yuitest_coverline("build/matrix/matrix.js", 345);
return [
                ["translate", dx, dy],
                ["rotate", rotate],
                ["skewX", shear],
                ["scale", sx, sy]
            ];
        },

        /**
         * Parses a transform string and returns an array of transform arrays.
         *
         * @method getTransformArray 
         * @param {String} val A transform string
         * @return Array
         */
        getTransformArray: function(transform) {
            _yuitest_coverfunc("build/matrix/matrix.js", "getTransformArray", 360);
_yuitest_coverline("build/matrix/matrix.js", 361);
var re = /\s*([a-z]*)\(([\w,\.,\-,\s]*)\)/gi,
                transforms = [],
                args,
                m,
                decomp,
                methods = MatrixUtil.transformMethods;
            
            _yuitest_coverline("build/matrix/matrix.js", 368);
while ((m = re.exec(transform))) {
                _yuitest_coverline("build/matrix/matrix.js", 369);
if (methods.hasOwnProperty(m[1])) 
                {
                    _yuitest_coverline("build/matrix/matrix.js", 371);
args = m[2].split(',');
                    _yuitest_coverline("build/matrix/matrix.js", 372);
args.unshift(m[1]);
                    _yuitest_coverline("build/matrix/matrix.js", 373);
transforms.push(args);
                }
                else {_yuitest_coverline("build/matrix/matrix.js", 375);
if(m[1] == "matrix")
                {
                    _yuitest_coverline("build/matrix/matrix.js", 377);
args = m[2].split(',');
                    _yuitest_coverline("build/matrix/matrix.js", 378);
decomp = MatrixUtil.decompose([
                        [args[0], args[2], args[4]],
                        [args[1], args[3], args[5]],
                        [0, 0, 1]
                    ]);
                    _yuitest_coverline("build/matrix/matrix.js", 383);
transforms.push(decomp[0]);
                    _yuitest_coverline("build/matrix/matrix.js", 384);
transforms.push(decomp[1]);
                    _yuitest_coverline("build/matrix/matrix.js", 385);
transforms.push(decomp[2]);
                    _yuitest_coverline("build/matrix/matrix.js", 386);
transforms.push(decomp[3]);
                }}
            }
            _yuitest_coverline("build/matrix/matrix.js", 389);
return transforms;
        },
        
        /**
         * Returns an array of transform arrays representing transform functions and arguments.
         *
         * @method getTransformFunctionArray
         * @return Array
         */
        getTransformFunctionArray: function(transform) {
            _yuitest_coverfunc("build/matrix/matrix.js", "getTransformFunctionArray", 398);
_yuitest_coverline("build/matrix/matrix.js", 399);
var list;
            _yuitest_coverline("build/matrix/matrix.js", 400);
switch(transform)
            {
                case "skew" :
                    _yuitest_coverline("build/matrix/matrix.js", 403);
list = [transform, 0, 0];
                _yuitest_coverline("build/matrix/matrix.js", 404);
break;
                case "scale" :
                    _yuitest_coverline("build/matrix/matrix.js", 406);
list = [transform, 1, 1];
                _yuitest_coverline("build/matrix/matrix.js", 407);
break;
                case "scaleX" :
                    _yuitest_coverline("build/matrix/matrix.js", 409);
list = [transform, 1];
                _yuitest_coverline("build/matrix/matrix.js", 410);
break;
                case "scaleY" :
                    _yuitest_coverline("build/matrix/matrix.js", 412);
list = [transform, 1];
                _yuitest_coverline("build/matrix/matrix.js", 413);
break;
                case "translate" :
                    _yuitest_coverline("build/matrix/matrix.js", 415);
list = [transform, 0, 0];
                _yuitest_coverline("build/matrix/matrix.js", 416);
break;
                default :
                    _yuitest_coverline("build/matrix/matrix.js", 418);
list = [transform, 0];
                _yuitest_coverline("build/matrix/matrix.js", 419);
break;
            }
            _yuitest_coverline("build/matrix/matrix.js", 421);
return list;
        },

        /**
         * Compares to arrays or transform functions to ensure both contain the same functions in the same 
         * order.
         *
         * @method compareTransformSequence
         * @param {Array} list1 Array to compare
         * @param {Array} list2 Array to compare
         * @return Boolean
         */
        compareTransformSequence: function(list1, list2)
        {
            _yuitest_coverfunc("build/matrix/matrix.js", "compareTransformSequence", 433);
_yuitest_coverline("build/matrix/matrix.js", 435);
var i = 0,
                len = list1.length,
                len2 = list2.length,
                isEqual = len === len2;
            _yuitest_coverline("build/matrix/matrix.js", 439);
if(isEqual)
            {
                _yuitest_coverline("build/matrix/matrix.js", 441);
for(; i < len; ++i)
                {
                    _yuitest_coverline("build/matrix/matrix.js", 443);
if(list1[i][0] != list2[i][0])
                    {
                        _yuitest_coverline("build/matrix/matrix.js", 445);
isEqual = false;
                        _yuitest_coverline("build/matrix/matrix.js", 446);
break;
                    }
                }
            }
            _yuitest_coverline("build/matrix/matrix.js", 450);
return isEqual;
        },

        /**
         * Mapping of possible transform method names.
         *
         * @property transformMethods
         * @type Object
         */
        transformMethods: {
            rotate: "rotate",
            skew: "skew",
            skewX: "skewX",
            skewY: "skewY",
            translate: "translate",
            translateX: "translateX",
            translateY: "tranlsateY",
            scale: "scale",
            scaleX: "scaleX",
            scaleY: "scaleY"
        }

};

_yuitest_coverline("build/matrix/matrix.js", 474);
Y.MatrixUtil = MatrixUtil;

/**
 * Matrix is a class that allows for the manipulation of a transform matrix.
 * This class is a work in progress.
 *
 * @class Matrix
 * @constructor
 * @module matrix
 */
_yuitest_coverline("build/matrix/matrix.js", 484);
var Matrix = function(config) {
    _yuitest_coverfunc("build/matrix/matrix.js", "Matrix", 484);
_yuitest_coverline("build/matrix/matrix.js", 485);
this.init(config);
};

_yuitest_coverline("build/matrix/matrix.js", 488);
Matrix.prototype = {
    /**
     * Used as value for the _rounding method.
     *
     * @property _rounder
     * @private
     */
    _rounder: 100000,

    /**
     * Updates the matrix. 
     *
     * @method multiple
     * @param {Number} a 
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} dx
     * @param {Number} dy
     */
    multiply: function(a, b, c, d, dx, dy) {
        _yuitest_coverfunc("build/matrix/matrix.js", "multiply", 508);
_yuitest_coverline("build/matrix/matrix.js", 509);
var matrix = this,
            matrix_a = matrix.a * a + matrix.c * b,
            matrix_b = matrix.b * a + matrix.d * b,
            matrix_c = matrix.a * c + matrix.c * d,
            matrix_d = matrix.b * c + matrix.d * d,
            matrix_dx = matrix.a * dx + matrix.c * dy + matrix.dx,
            matrix_dy = matrix.b * dx + matrix.d * dy + matrix.dy;

        _yuitest_coverline("build/matrix/matrix.js", 517);
matrix.a = this._round(matrix_a);
        _yuitest_coverline("build/matrix/matrix.js", 518);
matrix.b = this._round(matrix_b);
        _yuitest_coverline("build/matrix/matrix.js", 519);
matrix.c = this._round(matrix_c);
        _yuitest_coverline("build/matrix/matrix.js", 520);
matrix.d = this._round(matrix_d);
        _yuitest_coverline("build/matrix/matrix.js", 521);
matrix.dx = this._round(matrix_dx);
        _yuitest_coverline("build/matrix/matrix.js", 522);
matrix.dy = this._round(matrix_dy);
        _yuitest_coverline("build/matrix/matrix.js", 523);
return this;
    },

    /**
     * Parses a string and updates the matrix.
     *
     * @method applyCSSText
     * @param {String} val A css transform string
     */
    applyCSSText: function(val) {
        _yuitest_coverfunc("build/matrix/matrix.js", "applyCSSText", 532);
_yuitest_coverline("build/matrix/matrix.js", 533);
var re = /\s*([a-z]*)\(([\w,\.,\-,\s]*)\)/gi,
            args,
            m;

        _yuitest_coverline("build/matrix/matrix.js", 537);
val = val.replace(/matrix/g, "multiply");
        _yuitest_coverline("build/matrix/matrix.js", 538);
while ((m = re.exec(val))) {
            _yuitest_coverline("build/matrix/matrix.js", 539);
if (typeof this[m[1]] === 'function') {
                _yuitest_coverline("build/matrix/matrix.js", 540);
args = m[2].split(',');
                _yuitest_coverline("build/matrix/matrix.js", 541);
this[m[1]].apply(this, args);
            }
        }
    },
    
    /**
     * Parses a string and returns an array of transform arrays.
     *
     * @method getTransformArray 
     * @param {String} val A css transform string
     * @return Array
     */
    getTransformArray: function(val) {
        _yuitest_coverfunc("build/matrix/matrix.js", "getTransformArray", 553);
_yuitest_coverline("build/matrix/matrix.js", 554);
var re = /\s*([a-z]*)\(([\w,\.,\-,\s]*)\)/gi,
            transforms = [],
            args,
            m;
        
        _yuitest_coverline("build/matrix/matrix.js", 559);
val = val.replace(/matrix/g, "multiply");
        _yuitest_coverline("build/matrix/matrix.js", 560);
while ((m = re.exec(val))) {
            _yuitest_coverline("build/matrix/matrix.js", 561);
if (typeof this[m[1]] === 'function') {
                _yuitest_coverline("build/matrix/matrix.js", 562);
args = m[2].split(',');
                _yuitest_coverline("build/matrix/matrix.js", 563);
args.unshift(m[1]);
                _yuitest_coverline("build/matrix/matrix.js", 564);
transforms.push(args);
            }
        }
        _yuitest_coverline("build/matrix/matrix.js", 567);
return transforms;
    },

    /**
     * Default values for the matrix
     *
     * @property _defaults
     * @private
     */
    _defaults: {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        dx: 0,
        dy: 0
    },

    /**
     * Rounds values
     *
     * @method _round
     * @private
     */
    _round: function(val) {
        _yuitest_coverfunc("build/matrix/matrix.js", "_round", 591);
_yuitest_coverline("build/matrix/matrix.js", 592);
val = Math.round(val * this._rounder) / this._rounder;
        _yuitest_coverline("build/matrix/matrix.js", 593);
return val;
    },

    /**
     * Initializes a matrix.
     *
     * @method init
     * @param {Object} config Specified key value pairs for matrix properties. If a property is not explicitly defined in the config argument,
     * the default value will be used.
     */
    init: function(config) {
        _yuitest_coverfunc("build/matrix/matrix.js", "init", 603);
_yuitest_coverline("build/matrix/matrix.js", 604);
var defaults = this._defaults,
            prop;

        _yuitest_coverline("build/matrix/matrix.js", 607);
config = config || {};

        _yuitest_coverline("build/matrix/matrix.js", 609);
for (prop in defaults) {
            _yuitest_coverline("build/matrix/matrix.js", 610);
if(defaults.hasOwnProperty(prop))
            {
                _yuitest_coverline("build/matrix/matrix.js", 612);
this[prop] = (prop in config) ? config[prop] : defaults[prop];
            }
        }

        _yuitest_coverline("build/matrix/matrix.js", 616);
this._config = config;
    },

    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(x, y) {
        _yuitest_coverfunc("build/matrix/matrix.js", "scale", 625);
_yuitest_coverline("build/matrix/matrix.js", 626);
this.multiply(x, 0, 0, y, 0, 0);
        _yuitest_coverline("build/matrix/matrix.js", 627);
return this;
    },
    
    /**
     * Applies a skew transformation.
     *
     * @method skew
     * @param {Number} x The value to skew on the x-axis.
     * @param {Number} y The value to skew on the y-axis.
     */
    skew: function(x, y) {
        _yuitest_coverfunc("build/matrix/matrix.js", "skew", 637);
_yuitest_coverline("build/matrix/matrix.js", 638);
x = x || 0;
        _yuitest_coverline("build/matrix/matrix.js", 639);
y = y || 0;

        _yuitest_coverline("build/matrix/matrix.js", 641);
if (x !== undefined) { // null or undef
            _yuitest_coverline("build/matrix/matrix.js", 642);
x = Math.tan(this.angle2rad(x));

        }

        _yuitest_coverline("build/matrix/matrix.js", 646);
if (y !== undefined) { // null or undef
            _yuitest_coverline("build/matrix/matrix.js", 647);
y = Math.tan(this.angle2rad(y));
        }

        _yuitest_coverline("build/matrix/matrix.js", 650);
this.multiply(1, y, x, 1, 0, 0);
        _yuitest_coverline("build/matrix/matrix.js", 651);
return this;
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX
     * @param {Number} x x-coordinate
     */
    skewX: function(x) {
        _yuitest_coverfunc("build/matrix/matrix.js", "skewX", 660);
_yuitest_coverline("build/matrix/matrix.js", 661);
this.skew(x);
        _yuitest_coverline("build/matrix/matrix.js", 662);
return this;
    },

    /**
     * Applies a skew to the y-coordinate
     *
     * @method skewY
     * @param {Number} y y-coordinate
     */
    skewY: function(y) {
        _yuitest_coverfunc("build/matrix/matrix.js", "skewY", 671);
_yuitest_coverline("build/matrix/matrix.js", 672);
this.skew(null, y);
        _yuitest_coverline("build/matrix/matrix.js", 673);
return this;
    },

    /**
     * Returns a string of text that can be used to populate a the css transform property of an element.
     *
     * @method toCSSText
     * @return String
     */
    toCSSText: function() {
        _yuitest_coverfunc("build/matrix/matrix.js", "toCSSText", 682);
_yuitest_coverline("build/matrix/matrix.js", 683);
var matrix = this,
            text = 'matrix(' +
                    matrix.a + ',' + 
                    matrix.b + ',' + 
                    matrix.c + ',' + 
                    matrix.d + ',' + 
                    matrix.dx + ',' +
                    matrix.dy + ')';
        _yuitest_coverline("build/matrix/matrix.js", 691);
return text;
    },

    /**
     * Returns a string that can be used to populate the css filter property of an element.
     *
     * @method toFilterText
     * @return String
     */
    toFilterText: function() {
        _yuitest_coverfunc("build/matrix/matrix.js", "toFilterText", 700);
_yuitest_coverline("build/matrix/matrix.js", 701);
var matrix = this,
            text = 'progid:DXImageTransform.Microsoft.Matrix(';
        _yuitest_coverline("build/matrix/matrix.js", 703);
text +=     'M11=' + matrix.a + ',' + 
                    'M21=' + matrix.b + ',' + 
                    'M12=' + matrix.c + ',' + 
                    'M22=' + matrix.d + ',' +
                    'sizingMethod="auto expand")';

        _yuitest_coverline("build/matrix/matrix.js", 709);
text += '';

        _yuitest_coverline("build/matrix/matrix.js", 711);
return text;
    },

    /**
     * Converts a radian value to a degree.
     *
     * @method rad2deg
     * @param {Number} rad Radian value to be converted.
     * @return Number
     */
    rad2deg: function(rad) {
        _yuitest_coverfunc("build/matrix/matrix.js", "rad2deg", 721);
_yuitest_coverline("build/matrix/matrix.js", 722);
var deg = rad * (180 / Math.PI);
        _yuitest_coverline("build/matrix/matrix.js", 723);
return deg;
    },

    /**
     * Converts a degree value to a radian.
     *
     * @method deg2rad
     * @param {Number} deg Degree value to be converted to radian.
     * @return Number
     */
    deg2rad: function(deg) {
        _yuitest_coverfunc("build/matrix/matrix.js", "deg2rad", 733);
_yuitest_coverline("build/matrix/matrix.js", 734);
var rad = deg * (Math.PI / 180);
        _yuitest_coverline("build/matrix/matrix.js", 735);
return rad;
    },

    angle2rad: function(val) {
        _yuitest_coverfunc("build/matrix/matrix.js", "angle2rad", 738);
_yuitest_coverline("build/matrix/matrix.js", 739);
if (typeof val === 'string' && val.indexOf('rad') > -1) {
            _yuitest_coverline("build/matrix/matrix.js", 740);
val = parseFloat(val);
        } else { // default to deg
            _yuitest_coverline("build/matrix/matrix.js", 742);
val = this.deg2rad(parseFloat(val));
        }

        _yuitest_coverline("build/matrix/matrix.js", 745);
return val;
    },

    /**
     * Applies a rotate transform.
     *
     * @method rotate
     * @param {Number} deg The degree of the rotation.
     */
    rotate: function(deg, x, y) {
        _yuitest_coverfunc("build/matrix/matrix.js", "rotate", 754);
_yuitest_coverline("build/matrix/matrix.js", 755);
var rad = this.angle2rad(deg),
            sin = Math.sin(rad),
            cos = Math.cos(rad);
        _yuitest_coverline("build/matrix/matrix.js", 758);
this.multiply(cos, sin, 0 - sin, cos, 0, 0);
        _yuitest_coverline("build/matrix/matrix.js", 759);
return this;
    },

    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The value to transate on the x-axis.
     * @param {Number} y The value to translate on the y-axis.
     */
    translate: function(x, y) {
        _yuitest_coverfunc("build/matrix/matrix.js", "translate", 769);
_yuitest_coverline("build/matrix/matrix.js", 770);
x = parseFloat(x) || 0;
        _yuitest_coverline("build/matrix/matrix.js", 771);
y = parseFloat(y) || 0;
        _yuitest_coverline("build/matrix/matrix.js", 772);
this.multiply(1, 0, 0, 1, x, y);
        _yuitest_coverline("build/matrix/matrix.js", 773);
return this;
    },
    
    /**
     * Applies a translate to the x-coordinate
     *
     * @method translateX
     * @param {Number} x x-coordinate
     */
    translateX: function(x) {
        _yuitest_coverfunc("build/matrix/matrix.js", "translateX", 782);
_yuitest_coverline("build/matrix/matrix.js", 783);
this.translate(x);
        _yuitest_coverline("build/matrix/matrix.js", 784);
return this;
    },

    /**
     * Applies a translate to the y-coordinate
     *
     * @method translateY
     * @param {Number} y y-coordinate
     */
    translateY: function(y) {
        _yuitest_coverfunc("build/matrix/matrix.js", "translateY", 793);
_yuitest_coverline("build/matrix/matrix.js", 794);
this.translate(null, y);
        _yuitest_coverline("build/matrix/matrix.js", 795);
return this;
    },


    /**
     * Returns an identity matrix.
     *
     * @method identity
     * @return Object
     */
    identity: function() {
        _yuitest_coverfunc("build/matrix/matrix.js", "identity", 805);
_yuitest_coverline("build/matrix/matrix.js", 806);
var config = this._config,
            defaults = this._defaults,
            prop;

        _yuitest_coverline("build/matrix/matrix.js", 810);
for (prop in config) {
            _yuitest_coverline("build/matrix/matrix.js", 811);
if (prop in defaults) {
                _yuitest_coverline("build/matrix/matrix.js", 812);
this[prop] = defaults[prop];
            }
        }
        _yuitest_coverline("build/matrix/matrix.js", 815);
return this;
    },

    /**
     * Returns a 3x3 Matrix array
     *
     * /                                             \
     * | matrix[0][0]   matrix[1][0]    matrix[2][0] |
     * | matrix[0][1]   matrix[1][1]    matrix[2][1] |
     * | matrix[0][2]   matrix[1][2]    matrix[2][2] |
     * \                                             /
     *
     * @method getMatrixArray
     * @return Array
     */
    getMatrixArray: function()
    {
        _yuitest_coverfunc("build/matrix/matrix.js", "getMatrixArray", 830);
_yuitest_coverline("build/matrix/matrix.js", 832);
var matrix = this,
            matrixArray = [
                [matrix.a, matrix.c, matrix.dx],
                [matrix.b, matrix.d, matrix.dy],
                [0, 0, 1]
            ];
        _yuitest_coverline("build/matrix/matrix.js", 838);
return matrixArray;
    },

    /**
     * Returns the left, top, right and bottom coordinates for a transformed
     * item.
     *
     * @method getContentRect
     * @param {Number} width The width of the item.
     * @param {Number} height The height of the item.
     * @param {Number} x The x-coordinate of the item.
     * @param {Number} y The y-coordinate of the item.
     * @return Object
     */
    getContentRect: function(width, height, x, y)
    {
        _yuitest_coverfunc("build/matrix/matrix.js", "getContentRect", 852);
_yuitest_coverline("build/matrix/matrix.js", 854);
var left = !isNaN(x) ? x : 0,
            top = !isNaN(y) ? y : 0,
            right = left + width,
            bottom = top + height,
            matrix = this,
            a = matrix.a,
            b = matrix.b,
            c = matrix.c,
            d = matrix.d,
            dx = matrix.dx,
            dy = matrix.dy,
            x1 = (a * left + c * top + dx), 
            y1 = (b * left + d * top + dy),
            //[x2, y2]
            x2 = (a * right + c * top + dx),
            y2 = (b * right + d * top + dy),
            //[x3, y3]
            x3 = (a * left + c * bottom + dx),
            y3 = (b * left + d * bottom + dy),
            //[x4, y4]
            x4 = (a * right + c * bottom + dx),
            y4 = (b * right + d * bottom + dy);
        _yuitest_coverline("build/matrix/matrix.js", 876);
return {
            left: Math.min(x3, Math.min(x1, Math.min(x2, x4))),
            right: Math.max(x3, Math.max(x1, Math.max(x2, x4))),
            top: Math.min(y2, Math.min(y4, Math.min(y3, y1))),
            bottom: Math.max(y2, Math.max(y4, Math.max(y3, y1)))
        };
    },       
    
    /**
     * Returns the determinant of the matrix.
     *
     * @method getDeterminant
     * @return Number
     */
    getDeterminant: function()
    {
        _yuitest_coverfunc("build/matrix/matrix.js", "getDeterminant", 890);
_yuitest_coverline("build/matrix/matrix.js", 892);
return Y.MatrixUtil.getDeterminant(this.getMatrixArray());
    },

    /**
     * Returns the inverse (in array form) of the matrix.
     *
     * @method inverse
     * @return Array
     */
    inverse: function()
    {
        _yuitest_coverfunc("build/matrix/matrix.js", "inverse", 901);
_yuitest_coverline("build/matrix/matrix.js", 903);
return Y.MatrixUtil.inverse(this.getMatrixArray());
    },

    /**
     * Returns the transpose of the matrix
     *
     * @method transpose
     * @return Array
     */
    transpose: function()
    {
        _yuitest_coverfunc("build/matrix/matrix.js", "transpose", 912);
_yuitest_coverline("build/matrix/matrix.js", 914);
return Y.MatrixUtil.transpose(this.getMatrixArray());
    },

    /**
     * Returns an array of transform commands that represent the matrix.
     *
     * @method decompose
     * @return Array
     */
    decompose: function()
    {
        _yuitest_coverfunc("build/matrix/matrix.js", "decompose", 923);
_yuitest_coverline("build/matrix/matrix.js", 925);
return Y.MatrixUtil.decompose(this.getMatrixArray());
    }
};

_yuitest_coverline("build/matrix/matrix.js", 929);
Y.Matrix = Matrix;


}, '3.7.3', {"requires": ["yui-base"]});

/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('matrix', function (Y, NAME) {

/**
 * Matrix utilities.
 *
 * @class MatrixUtil
 * @module matrix
 **/

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
            val = Math.round(val * MatrixUtil._rounder) / MatrixUtil._rounder;
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
            var deg = rad * (180 / Math.PI);
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
            var rad = deg * (Math.PI / 180);
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
            if (typeof val === 'string' && val.indexOf('rad') > -1) {
                val = parseFloat(val);
            } else { // default to deg
                val = MatrixUtil.deg2rad(parseFloat(val));
            }

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
            var matrixArray = [
                    [matrix.a, matrix.c, matrix.dx],
                    [matrix.b, matrix.d, matrix.dy],
                    [0, 0, 1]
                ];
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
            var determinant = 0,
                len = matrix.length,
                i = 0,
                multiplier;

            if(len == 2)
            {
                return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
            }
            for(; i < len; ++i)
            {
                multiplier = matrix[i][0];
                if(i % 2 === 0 || i === 0)
                {
                    determinant += multiplier * MatrixUtil.getDeterminant(MatrixUtil.getMinors(matrix, i, 0));  
                }
                else
                {
                    determinant -= multiplier * MatrixUtil.getDeterminant(MatrixUtil.getMinors(matrix, i, 0));
                }
            }
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
            var determinant = 0,
                len = matrix.length,
                i = 0,
                j,
                inverse,
                adjunct = [],
                //vector representing 2x2 matrix
                minor = [];
            if(len === 2) 
            {
                determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
                inverse = [
                    [matrix[1][1] * determinant, -matrix[1][0] * determinant],
                    [-matrix[0][1] * determinant, matrix[0][0] * determinant]
                ]; 
            }
            else
            {
                determinant = MatrixUtil.getDeterminant(matrix);
                for(; i < len; ++i)
                {
                    adjunct[i] = [];
                    for(j = 0; j < len; ++j)
                    {
                        minor = MatrixUtil.getMinors(matrix, j, i);
                        adjunct[i][j] = MatrixUtil.getDeterminant(minor);
                        if((i + j) % 2 !== 0 && (i + j) !== 0)
                        {
                            adjunct[i][j] *= -1;
                        }
                    }
                }
                inverse = MatrixUtil.scalarMultiply(adjunct, 1/determinant);
            }
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
            var i = 0,
                j,
                len = matrix.length;
            for(; i < len; ++i)
            {
                for(j = 0; j < len; ++j)
                {
                    matrix[i][j] = MatrixUtil._round(matrix[i][j] * multiplier);
                }
            }
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
            var len = matrix.length,
                i = 0,
                j = 0,
                transpose = [];
            for(; i < len; ++i)
            {
                transpose[i] = [];
                for(j = 0; j < len; ++j)
                {
                    transpose[i].push(matrix[j][i]);
                }
            }
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
            var minors = [],
                len = matrix.length,
                i = 0,
                j,
                column;
            for(; i < len; ++i)
            {
                if(i !== columnIndex)
                {
                    column = [];
                    for(j = 0; j < len; ++j)
                    {
                        if(j !== rowIndex)
                        {
                            column.push(matrix[i][j]);
                        }
                    }
                    minors.push(column);
                }
            }
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
            var i,
                j,
                len = vector.length,
                product = [],
                rowProduct;
            for(i = 0; i < len; ++i)
            {
                rowProduct = 0;
                for(j = 0; j < len; ++j)
                {
                    rowProduct += vector[i] * matrix[i][j];
                }
                product[i] = rowProduct;
            }
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
            if((a * d - b * c) === 0)
            {
                return false;
            }
            //get length of vector(ab)
            sx = MatrixUtil._round(Math.sqrt(a * a + b * b));
            //normalize components of vector(ab)
            a /= sx;
            b /= sx;
            shear = MatrixUtil._round(a * c + b * d);
            c -= a * shear;
            d -= b * shear;
            //get length of vector(cd)
            sy = MatrixUtil._round(Math.sqrt(c * c + d * d));
            //normalize components of vector(cd)
            c /= sy;
            d /= sy;
            shear /=sy;
            shear = MatrixUtil._round(MatrixUtil.rad2deg(Math.atan(shear)));
            rotate = MatrixUtil._round(MatrixUtil.rad2deg(Math.atan2(matrix[1][0], matrix[0][0])));

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
            var re = /\s*([a-z]*)\(([\w,\.,\-,\s]*)\)/gi,
                transforms = [],
                args,
                m,
                decomp,
                methods = MatrixUtil.transformMethods;
            
            while ((m = re.exec(transform))) {
                if (methods.hasOwnProperty(m[1])) 
                {
                    args = m[2].split(',');
                    args.unshift(m[1]);
                    transforms.push(args);
                }
                else if(m[1] == "matrix")
                {
                    args = m[2].split(',');
                    decomp = MatrixUtil.decompose([
                        [args[0], args[2], args[4]],
                        [args[1], args[3], args[5]],
                        [0, 0, 1]
                    ]);
                    transforms.push(decomp[0]);
                    transforms.push(decomp[1]);
                    transforms.push(decomp[2]);
                    transforms.push(decomp[3]);
                }
            }
            return transforms;
        },
        
        /**
         * Returns an array of transform arrays representing transform functions and arguments.
         *
         * @method getTransformFunctionArray
         * @return Array
         */
        getTransformFunctionArray: function(transform) {
            var list;
            switch(transform)
            {
                case "skew" :
                    list = [transform, 0, 0];
                break;
                case "scale" :
                    list = [transform, 1, 1];
                break;
                case "scaleX" :
                    list = [transform, 1];
                break;
                case "scaleY" :
                    list = [transform, 1];
                break;
                case "translate" :
                    list = [transform, 0, 0];
                break;
                default :
                    list = [transform, 0];
                break;
            }
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
            var i = 0,
                len = list1.length,
                len2 = list2.length,
                isEqual = len === len2;
            if(isEqual)
            {
                for(; i < len; ++i)
                {
                    if(list1[i][0] != list2[i][0])
                    {
                        isEqual = false;
                        break;
                    }
                }
            }
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

Y.MatrixUtil = MatrixUtil;

/**
 * Matrix is a class that allows for the manipulation of a transform matrix.
 * This class is a work in progress.
 *
 * @class Matrix
 * @constructor
 * @module matrix
 */
var Matrix = function(config) {
    this.init(config);
};

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
        var matrix = this,
            matrix_a = matrix.a * a + matrix.c * b,
            matrix_b = matrix.b * a + matrix.d * b,
            matrix_c = matrix.a * c + matrix.c * d,
            matrix_d = matrix.b * c + matrix.d * d,
            matrix_dx = matrix.a * dx + matrix.c * dy + matrix.dx,
            matrix_dy = matrix.b * dx + matrix.d * dy + matrix.dy;

        matrix.a = this._round(matrix_a);
        matrix.b = this._round(matrix_b);
        matrix.c = this._round(matrix_c);
        matrix.d = this._round(matrix_d);
        matrix.dx = this._round(matrix_dx);
        matrix.dy = this._round(matrix_dy);
        return this;
    },

    /**
     * Parses a string and updates the matrix.
     *
     * @method applyCSSText
     * @param {String} val A css transform string
     */
    applyCSSText: function(val) {
        var re = /\s*([a-z]*)\(([\w,\.,\-,\s]*)\)/gi,
            args,
            m;

        val = val.replace(/matrix/g, "multiply");
        while ((m = re.exec(val))) {
            if (typeof this[m[1]] === 'function') {
                args = m[2].split(',');
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
        var re = /\s*([a-z]*)\(([\w,\.,\-,\s]*)\)/gi,
            transforms = [],
            args,
            m;
        
        val = val.replace(/matrix/g, "multiply");
        while ((m = re.exec(val))) {
            if (typeof this[m[1]] === 'function') {
                args = m[2].split(',');
                args.unshift(m[1]);
                transforms.push(args);
            }
        }
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
        val = Math.round(val * this._rounder) / this._rounder;
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
        var defaults = this._defaults,
            prop;

        config = config || {};

        for (prop in defaults) {
            if(defaults.hasOwnProperty(prop))
            {
                this[prop] = (prop in config) ? config[prop] : defaults[prop];
            }
        }

        this._config = config;
    },

    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(x, y) {
        this.multiply(x, 0, 0, y, 0, 0);
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
        x = x || 0;
        y = y || 0;

        if (x !== undefined) { // null or undef
            x = Math.tan(this.angle2rad(x));

        }

        if (y !== undefined) { // null or undef
            y = Math.tan(this.angle2rad(y));
        }

        this.multiply(1, y, x, 1, 0, 0);
        return this;
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX
     * @param {Number} x x-coordinate
     */
    skewX: function(x) {
        this.skew(x);
        return this;
    },

    /**
     * Applies a skew to the y-coordinate
     *
     * @method skewY
     * @param {Number} y y-coordinate
     */
    skewY: function(y) {
        this.skew(null, y);
        return this;
    },

    /**
     * Returns a string of text that can be used to populate a the css transform property of an element.
     *
     * @method toCSSText
     * @return String
     */
    toCSSText: function() {
        var matrix = this,
            text = 'matrix(' +
                    matrix.a + ',' + 
                    matrix.b + ',' + 
                    matrix.c + ',' + 
                    matrix.d + ',' + 
                    matrix.dx + ',' +
                    matrix.dy + ')';
        return text;
    },

    /**
     * Returns a string that can be used to populate the css filter property of an element.
     *
     * @method toFilterText
     * @return String
     */
    toFilterText: function() {
        var matrix = this,
            text = 'progid:DXImageTransform.Microsoft.Matrix(';
        text +=     'M11=' + matrix.a + ',' + 
                    'M21=' + matrix.b + ',' + 
                    'M12=' + matrix.c + ',' + 
                    'M22=' + matrix.d + ',' +
                    'sizingMethod="auto expand")';

        text += '';

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
        var deg = rad * (180 / Math.PI);
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
        var rad = deg * (Math.PI / 180);
        return rad;
    },

    angle2rad: function(val) {
        if (typeof val === 'string' && val.indexOf('rad') > -1) {
            val = parseFloat(val);
        } else { // default to deg
            val = this.deg2rad(parseFloat(val));
        }

        return val;
    },

    /**
     * Applies a rotate transform.
     *
     * @method rotate
     * @param {Number} deg The degree of the rotation.
     */
    rotate: function(deg, x, y) {
        var rad = this.angle2rad(deg),
            sin = Math.sin(rad),
            cos = Math.cos(rad);
        this.multiply(cos, sin, 0 - sin, cos, 0, 0);
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
        x = parseFloat(x) || 0;
        y = parseFloat(y) || 0;
        this.multiply(1, 0, 0, 1, x, y);
        return this;
    },
    
    /**
     * Applies a translate to the x-coordinate
     *
     * @method translateX
     * @param {Number} x x-coordinate
     */
    translateX: function(x) {
        this.translate(x);
        return this;
    },

    /**
     * Applies a translate to the y-coordinate
     *
     * @method translateY
     * @param {Number} y y-coordinate
     */
    translateY: function(y) {
        this.translate(null, y);
        return this;
    },


    /**
     * Returns an identity matrix.
     *
     * @method identity
     * @return Object
     */
    identity: function() {
        var config = this._config,
            defaults = this._defaults,
            prop;

        for (prop in config) {
            if (prop in defaults) {
                this[prop] = defaults[prop];
            }
        }
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
        var matrix = this,
            matrixArray = [
                [matrix.a, matrix.c, matrix.dx],
                [matrix.b, matrix.d, matrix.dy],
                [0, 0, 1]
            ];
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
        return Y.MatrixUtil.decompose(this.getMatrixArray());
    }
};

Y.Matrix = Matrix;


}, '3.7.3', {"requires": ["yui-base"]});

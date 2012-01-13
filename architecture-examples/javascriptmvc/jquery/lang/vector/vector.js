steal.plugins('jquery').then(function($){
	var getSetZero = function(v){ return v !== undefined ? (this.array[0] = v) : this.array[0] },
		getSetOne = function(v){ return v !== undefined ? (this.array[1] = v) : this.array[1] }
/**
 * @class jQuery.Vector
 * A vector class
 * @constructor creates a new vector instance from the arguments.  Example:
 * @codestart
 * new jQuery.Vector(1,2)
 * @codeend
 * 
 */
	$.Vector = function() {
		this.update($.makeArray(arguments));
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector.  Returns the new vector.
		 * @param {Function} f
		 * @return {jQuery.Vector} new vector class.
		 */
		app: function( f ) {
			var i, vec, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i]));
			}
			vec = new $.Vector();
			return vec.update(newArr);
		},
		/**
		 * Adds two vectors together.  Example:
		 * @codestart
		 * new Vector(1,2).plus(2,3) //-> &lt;3,5>
		 * new Vector(3,5).plus(new Vector(4,5)) //-> &lt;7,10>
		 * @codeend
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Like plus but subtracts 2 vectors
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.  
		 * False if otherwise.
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
/*
	 * Returns the 2nd value of the vector
	 * @return {Number}
	 */
		x: getSetZero,
		width: getSetZero,
		/**
		 * Returns the first value of the vector
		 * @return {Number}
		 */
		y: getSetOne,
		height: getSetOne,
		/**
		 * Same as x()
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * same as y()
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * returns (x,y)
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array[0] + "," + this.array[1] + ")";
		},
		/**
		 * Replaces the vectors contents
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(this.pageX, this.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};
});

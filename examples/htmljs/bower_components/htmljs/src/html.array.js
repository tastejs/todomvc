(function(){
    //use this method for querying data from array, usage is similar to Linq
    //this method is also used for query DOM, using CSS query
    //arg (Array | string)
    //  if it is an array, then apply query fluent API for array
    //  if it is a string, then apply css query selector aka querySelectorAll
    this.query = function (arg) {
        if(arg instanceof Array){
            _html.extend(arg, _html.query);
            return arg;
        }
	};
	
    //This function takes html.query object and create methods for html.query namespace
    //html.query methods will be used in any array passed through html.query
    //because that array will inherits from methods inside html.query
    //NOTE: every html.query object method can be used with fluent API
    //for example: html.query([1,2,3,4].select(function(x){return x*x}).where(function(x){return x > 4});
	(function(){
        //each is a common used word, a handful method to loop through a list
		this.each = function (action) {
			for (var i = 0, j = this.length; i < j; i++)
				action(this[i], i);
		}

        //add item into array, simply use push - native method
		this.add = Array.prototype.push;

        //select is similar to map in modern browser
		this.select = function (mapping) {
			var result = [];
			for (var i = 0; i < this.length; i++)
				result.push(mapping(this[i]));
			return _html.query(result);
		}

        //where is similar to filter in modern browser
		this.where = function (predicate) {
			var ret = [];
			for (var i = 0; i < this.length; i++)
				if (predicate(this[i])) {
					ret.push(this[i]);
				}
			return _html.query(ret);
		}

        //reduce is a famous method in any functional programming language - also can use this with fluent API
		this.reduce = function (iterator, init, context) {
			var result = typeof (init) != 'undefined' && init != null ? init : [];
			for (var i = 0, j = this.length; i < j; i++) {
				result = iterator.call(context, result, this[i]);
			}
			return result;
		}

        //similar to reduce
		this.reduceRight = function (iterator, init, context) {
			var result = typeof (init) != 'undefined' && init != null ? init : [];
			for (var i = this.length - 1; i >= 0; i--) {
				result = iterator.call(context, result, this[i]);
			}
			return result;
		}
		
        //find a item that fits the comparer, the array maybe map to another array before performing searching if mapper was passed
        //NOTE: comparer takes 2 arguments and return a "better" one, then the find method can find the "best" one
		this.find = function (comparer, mapper) {
			var arr = mapper ? this.select(mapper) : this;
			return arr.reduce(function (best, current) {
				return best === comparer(best, current) ? best : current;
			}, arr[0]);
		}
		
        //find the first one that matches condition, throw exception if no item matches
		this.first = function (predicate, predicateOwner) {
			for (var i = 0, j = this.length; i < j; i++)
				if (predicate.call(predicateOwner, this[i]))
					return this[i];
			throw 'Can\'t find any element matches';
		}

        //find the first one that matches condition, if not found return null
		this.firstOrDefault = function (predicate, predicateOwner) {
			for (var i = 0, j = this.length; i < j; i++)
				if (predicate.call(predicateOwner, this[i]))
					return this[i];
			return null;
		}

        //find index of the item in a list, this method is used for old browser
        //if indexOf method is native code, then just call it
		this.indexOf = function (item) {
			if (typeof Array.prototype.indexOf == "function")
				return Array.prototype.indexOf.call(this, item);
			for (var i = 0, j = this.length; i < j; i++)
				if (this[i] === item)
					return i;
			return -1;
		}

        //remove item from a list
		this.remove = function (itemToRemove) {
			var index = this.indexOf(itemToRemove);
			if (index >= 0 && index < this.length)
				this.splice(index, 1);
		}

        //remove specified item from a list by its index
		this.removeAt = function (index) {
			if (index >= 0 && index < this.length)
				this.splice(index, 1);
		}

        //swap to elements in a list
		this.swap = function (fromIndex, toIndex) {
			if (fromIndex >= 0 && fromIndex < this.length && toIndex >= 0 && toIndex < this.length && fromIndex != toIndex) {
				var tmp = this[fromIndex];
				this[fromIndex] = this[toIndex];
				this[toIndex] = tmp;
			}
		}
	}).call(this.query);

    //use native concat method but return array still queryable (fluent API)
	this.query.addRange = function(items){
		return _html.query(Array.prototype.concat.call(this, items));
	};
}).call(html);
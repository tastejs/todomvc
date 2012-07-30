steal('jquery',function($){
	
var isArray = $.isArray,
	// essentially returns an object that has all the must have comparisons ...
	// must haves, do not return true when provided undefined
	cleanSet = function(obj, compares){
		var copy = $.extend({}, obj);
		for(var prop in copy) {
			var compare = compares[prop] === undefined ? compares["*"] : compares[prop];
			if( same(copy[prop], undefined, compare ) ) {
				delete copy[prop]
			}
		}
		return copy;
	},
	propCount = function(obj){
		var count = 0;
		for(var prop in obj) count++;
		return count;
	};

/**
 * @class jQuery.Object
 * @parent jquerymx.lang
 * 
 * Object contains several helper methods that 
 * help compare objects.
 * 
 * ## same
 * 
 * Returns true if two objects are similar.
 * 
 *     $.Object.same({foo: "bar"} , {bar: "foo"}) //-> false
 *   
 * ## subset
 * 
 * Returns true if an object is a set of another set.
 * 
 *     $.Object.subset({}, {foo: "bar"} ) //-> true
 * 
 * ## subsets
 * 
 * Returns the subsets of an object
 * 
 *     $.Object.subsets({userId: 20},
 *                      [
 *                       {userId: 20, limit: 30},
 *                       {userId: 5},
 *                       {}
 *                      ]) 
 *              //->    [{userId: 20, limit: 30}]
 */
$.Object = {};

/**
 * @function same
 * Returns if two objects are the same.  It takes an optional compares object that
 * can be used to make comparisons.
 * 
 * This function does not work with objects that create circular references.
 * 
 * ## Examples
 * 
 *     $.Object.same({name: "Justin"},
 *                   {name: "JUSTIN"}) //-> false
 *     
 *     // ignore the name property
 *     $.Object.same({name: "Brian"},
 *                   {name: "JUSTIN"},
 *                   {name: null})      //-> true
 *     
 *     // ignore case
 *     $.Object.same({name: "Justin"},
 *                   {name: "JUSTIN"},
 *                   {name: "i"})      //-> true
 *     
 *     // deep rule
 *     $.Object.same({ person : { name: "Justin" } },
 *                   { person : { name: "JUSTIN" } },
 *                   { person : { name: "i"      } }) //-> true
 *                   
 *     // supplied compare function
 *     $.Object.same({age: "Thirty"},
 *                   {age: 30},
 *                   {age: function( a, b ){
 *                           if( a == "Thirty" ) { 
 *                             a = 30
 *                           }
 *                           if( b == "Thirty" ) {
 *                             b = 30
 *                           }
 *                           return a === b;
 *                         }})      //-> true
 * 
 * @param {Object} a an object to compare
 * @param {Object} b an object to compare
 * @param {Object} [compares] an object that indicates how to 
 * compare specific properties. 
 * Typically this is a name / value pair
 * 
 *     $.Object.same({name: "Justin"},{name: "JUSTIN"},{name: "i"})
 *     
 * There are two compare functions that you can specify with a string:
 * 
 *   - 'i' - ignores case
 *   - null - ignores this property
 * 
 * @param {Object} [deep] used internally
 */
var same = $.Object.same = function(a, b, compares, aParent, bParent, deep){
	var aType = typeof a,
		aArray = isArray(a),
		comparesType = typeof compares,
		compare;
	
	if(comparesType == 'string' || compares === null ){
		compares = compareMethods[compares];
		comparesType = 'function'
	}
	if(comparesType == 'function'){
		return compares(a, b, aParent, bParent)
	} 
	compares = compares || {};
	
	if(deep === -1){
		return aType === 'object' || a === b;
	}
	if(aType !== typeof  b || aArray !== isArray(b)){
		return false;
	}
	if(a === b){
		return true;
	}
	if(aArray){
		if(a.length !== b.length){
			return false;
		}
		for(var i =0; i < a.length; i ++){
			compare = compares[i] === undefined ? compares["*"] : compares[i]
			if(!same(a[i],b[i], a, b, compare )){
				return false;
			}
		};
		return true;
	} else if(aType === "object" || aType === 'function'){
		var bCopy = $.extend({}, b);
		for(var prop in a){
			compare = compares[prop] === undefined ? compares["*"] : compares[prop];
			if(! same( a[prop], b[prop], compare , a, b, deep === false ? -1 : undefined )){
				return false;
			}
			delete bCopy[prop];
		}
		// go through bCopy props ... if there is no compare .. return false
		for(prop in bCopy){
			if( compares[prop] === undefined || 
			    ! same( undefined, b[prop], compares[prop] , a, b, deep === false ? -1 : undefined )){
				return false;
			}
		}
		return true;
	} 
	return false;
};

/**
 * @function subsets
 * Returns the sets in 'sets' that are a subset of checkSet
 * @param {Object} checkSet
 * @param {Object} sets
 */
$.Object.subsets = function(checkSet, sets, compares){
	var len = sets.length,
		subsets = [],
		checkPropCount = propCount(checkSet),
		setLength;
		
	for(var i =0; i < len; i++){
		//check this subset
		var set = sets[i];
		if( $.Object.subset(checkSet, set, compares) ){
			subsets.push(set)
		}
	}
	return subsets;
};
/**
 * @function subset
 * Compares if checkSet is a subset of set
 * @param {Object} checkSet
 * @param {Object} set
 * @param {Object} [compares]
 * @param {Object} [checkPropCount]
 */
$.Object.subset = function(subset, set, compares){
	// go through set {type: 'folder'} and make sure every property
	// is in subset {type: 'folder', parentId :5}
	// then make sure that set has fewer properties
	// make sure we are only checking 'important' properties
	// in subset (ones that have to have a value)
	
	var setPropCount =0,
		compares = compares || {};
			
	for(var prop in set){

		if(! same(subset[prop], set[prop], compares[prop], subset, set )  ){
			return false;
		} 
	}
	return true;
}


var compareMethods = {
	"null" : function(){
		return true;
	},
	i : function(a, b){
		return (""+a).toLowerCase() == (""+b).toLowerCase()
	}
}
	
	
});
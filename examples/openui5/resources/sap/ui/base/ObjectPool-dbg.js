/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.base.ObjectPool
sap.ui.define(['./Object'],
	function(BaseObject) {
	"use strict";


	/**
	 * Creates an ObjectPool instance based on the given oObjectClass.&lt;br/&gt;
	 * If there is a free pooled instance, returns that one, otherwise creates a new one.&lt;br/&gt;
	 * In order to be maintained by the ObjectPool, oObjectClass must implement
	 * methods described in the class description.
	 *
	 * @param {function} oObjectClass constructor for the class of objects that this pool should manage
	 *
	 * @class Manages a pool of objects all of the same type;
	 * the type has to be specified at pool construction time.
	 *
	 * Maintains a list of free objects of the given type.
	 * If {@link sap.ui.base.ObjectPool.prototype.borrowObject} is called, an existing free object
	 * is taken from the pool and the <code>init</code> method is called on this
	 * object.
	 *
	 * When no longer needed, any borrowed object should be returned to
	 * the pool by calling {@link #returnObject}. At that point in time,
	 * the reset method is called on the object and the object is added to the
	 * list of free objects.
	 *
	 * See {@link sap.ui.base.Poolable} for a description of the contract for poolable objects.
	 *
	 * Example:
	 * <pre>
	 *   this.oEventPool = new sap.ui.base.ObjectPool(sap.ui.base.Event);
	 *   var oEvent = this.oEventPool.borrowObject(iEventId, mParameters);
	 * </pre>
	 *
	 * @extends sap.ui.base.Object
	 * @author Malte Wedel
	 * @version 1.32.9
	 * @constructor
	 * @alias sap.ui.base.ObjectPool
	 * @public
	 */
	var ObjectPool = BaseObject.extend("sap.ui.base.ObjectPool", /** @lends sap.ui.base.ObjectPool.prototype */ {
		constructor: function(oObjectClass) {
		
			BaseObject.call(this);
		
			this.oObjectClass = oObjectClass;
		
			this.aFreeObjects = [];
		//	this.aUsedObjects = []; //PERFOPT: Holding those is currently senseless.
		
		}
	});
	
	/**
	 * Borrows a free object from the pool. Any arguments to this method
	 * are forwarded to the init method of the borrowed object.
	 *
	 * @param {any} [any] optional initialization parameters for the borrowed object
	 * @return {object} the borrowed object of the same type that has been specified for this pool
	 * @public
	 */
	ObjectPool.prototype.borrowObject = function() {
	
		// PERFOPT: Reduced callstack
		var oObject = this.aFreeObjects.length == 0 ?
				new this.oObjectClass() :
					this.aFreeObjects.pop();
		oObject.init.apply(oObject, arguments);
	//	this.aUsedObjects.push(oObject); //PERFOPT: Holding those is currently senseless.
	
		return oObject;
	};
	
	/**
	 * Returns an object to the pool. The object must have been borrowed from this
	 * pool beforehand. The reset method is called on the object before it is added
	 * to the set of free objects.
	 *
	 * @param {object} oObject the object to return to the pool
	 * @public
	 */
	ObjectPool.prototype.returnObject = function(oObject) {
	
		oObject.reset();
		// If the next line is ever activated again, ensure not simply the topmost object is poped but the one returned!!
	//	this.aUsedObjects.pop(); //PERFOPT: Holding those is currently senseless.
		this.aFreeObjects.push(oObject);
	
	};
	
	
	/**
	 * Poolable objects must provide a no-arg constructor which is used by the pool
	 * to construct new, unused objects.
	 *
	 * To be more convenient to use, poolable objects should implement their constructor
	 * in a way that it either can be called with no arguments (used by the pool) or
	 * with the same signature as their {@link #init} method (to be used by applications).
	 *
	 * @name sap.ui.base.Poolable
	 * @interface Contract for objects that can be pooled by ObjectPool
	 * @public
	 */
	
	/**
	 * Called by the object pool when this instance will be actived for a caller.
	 * The same method will be called after a new instance has been created by an otherwise
	 * exhausted pool.
	 *
	 * If the caller provided any arguments to {@link sap.ui.base.ObjectPool#borrowObject}
	 * all arguments will be propagated to this method.
	 *
	 * @name sap.ui.base.Poolable.prototype.init
	 * @function
	 * @public
	 */
	
	/**
	 * Called by the object pool when an instance is returned to the pool.
	 * While no specific implementation is required, poolable objects in general
	 * should clean all caller specific state (set to null) in this method to
	 * avoid memory leaks and to enforce garbage collection of the caller state.
	 *
	 * @name sap.ui.base.Poolable.prototype.reset
	 * @function
	 * @public
	 */

	return ObjectPool;

});

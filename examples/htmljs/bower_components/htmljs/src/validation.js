// validation framework, validate against data, not based on UI state
(function (root, factory) {
    /* CommonJS/NodeJs */
    if (typeof module === "object" && typeof module.exports === "object") module.exports = factory(root);
        /* AMD module */
    else if (typeof define === 'function' && define.amd) define(factory(root));
        /* Browser global */
    else root.validation = factory(root);
}
(this || (0, eval)('this'), function (window) {
	var element = null, $ = window.jQuery;
	// extend function, always useful
	var extend = function (des, src) {
        for (var fn in src) {
            if (src.hasOwnProperty(fn)) {
                des[fn] = src[fn];
            }
        }
        return des;
    };
	
	var each = function (list, action) {
		var i = -1, j = list.length;
		while (++i < j) action(list[i], i);
	};
	
	var validation = function (data) {
		var newData = data, oldData, validationHandler, validationResults = [], validators = [];
		var init = function (obj) {
			if (obj === null || obj === undefined) {
				// getter
				return newData;
			} else if (newData !== obj) {
				// setter
				// save the old data for later validation
				oldData = newData
				// set the new data
				newData = obj;
				// clear all validation result before running validators
				while (validationResults.length) validationResults.pop();
				// run all the validators
				for (var i = 0, j = validators.length; i < j; i++) validators[i](newData, oldData);
			}
		};
		// this function is used to get or set validation handler
		init.validationHandler = function (callback) {
			if (callback) {
				// only set if the callback is not null
				validationHandler = callback;
			} else {
				// return the validation handler for user to use
				return validationHandler;
			}
			// return this for fluent API
			return this;
		};
		// set the validation result
		// call this function inside a custom rule
		init.setValidationResult = function (isValid, message) {
			//push the validation result object to the list
			validationResults.push({ isValid: isValid, message: message });
			if (validators.length === validationResults.length || !isValid) {
				// when all validation rules have been run
				// or when one of validation rules is not valid
				// call the error handler callback
				validationCallback && validationCallback(validationResults);
			}
		};
		// validate function, call this when 
		init.validate = function () {
			if (validator) {
				//simply put the validator into the queue
				validators.push(validator);
			} else {
				// clear old validation results for running again
				while(validationResults.length) validationResults.pop();
				// run all the validators
				for (var i = 0, j = validators.length; i < j; i++) {
					validators[i](newData, oldData);
				}
			}
			return this;
		};
		validation.observe = function (control) {
			element = control;
			$(element).change(function () {
				validation(
			});
		};
		extend(init, validation.validation);
		return validation;
	};
	
	// built-in validation rules
	validation.validation.required = function (message) {
		this.validate(function(newValue, oldValue) {
            if (!isNotNull(newValue) || trim(newValue) === '') {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
	};
	
	validation.validation.isNumber = function(message) {
        this.validate(function(newValue, oldValue) {
            if (!isNotNull(newValue) || !isStrNumber(newValue)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    validation.validation.isEmail = function(message) {
        this.validate(function(newValue, oldValue) {
            if (!isNotNull(newValue) || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newValue)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    validation.validation.pattern = function(pattern, message) {
        this.validate(function(newValue, oldValue) {
            if (!isNotNull(newValue) || !pattern.test(newValue)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    validation.validation.maxLength = function(length, message) {
        this.validate(function(newValue, oldValue) {
            if (isString(newValue) && newValue.length > length) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
}));



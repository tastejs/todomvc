define(['./isNumber'], function (isNumber) {

    /**
     * Check if value is NaN for realz
     */
    function isNaN(val){
        // based on the fact that NaN !== NaN
        // need to check if it's a number to avoid conflicts with host objects
        // also need to coerce ToNumber to avoid edge case `new Number(NaN)`
        // jshint eqeqeq: false
        return !isNumber(val) || val != +val;
    }

    return isNaN;

});

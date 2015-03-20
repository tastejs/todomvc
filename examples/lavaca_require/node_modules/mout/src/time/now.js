define(function () {

    /**
     * Get current time in miliseconds
     */
    var now = (typeof Date.now === 'function')? Date.now : function(){
        return +(new Date());
    };

    return now;

});

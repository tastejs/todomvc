/*jshint unused:false */
(function () {
    'use strict';
    return function(uku){
        this.newTask = '';
        this.enterHandler = function(event){
            if(event.keyCode === 13 && this.newTask) {
                var task = this.newTask;
                this.fire('newtaskinputed',{message:task});
                this.newTask = '';
                uku.refresh();          
            }
        };
    };
})();
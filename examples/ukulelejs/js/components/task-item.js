/*jshint unused:false */
(function(){
    'use strict';
    return function(uku){
        var cancelEdit = false;
        this.task = {};
        this.editing = false;
        this.getTaskClassName = function(){
            if(this.editing){
                return ['editing'];
            }else if(this.task && this.task.completed){
                return ['completed'];
            }else{
                return '';
            }
        };
        this.editBegin = function(){
            this.editing = true;
            cancelEdit = false;
            this.titleBackup = this.task.title;
        };
        
        this.onKeyUp = function(event){
            var code = event.keyCode;
            if(code === 13){
                this.editEnd();
            }else if (code === 27) {
                cancelEdit = true;
                this.editing = false;
            }
        };

        this.editEnd = function(){
            if(!cancelEdit){
                this.task.title = this.titleBackup;
                this.editing = false;
            }
        };

        this.toggleTaskStatus = function(){
            this.fire('toggletaskstatus',null,true);
        };

        this.removeTask = function(){
            this.fire('removetask',{message:this.task},true);
        };

        Object.defineProperty(this, 'item', {
            set: function (value) {
                if(value){
                    this.task = value;
                }
            }
        });
    };
})();
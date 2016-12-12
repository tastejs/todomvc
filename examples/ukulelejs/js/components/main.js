/*jshint unused:false */
(function(){
    'use strict';
    return function(uku){
        this.tasks = [];
		this.isAllCompleted = false;
		this.isShowToggleAllBtn = false;
		this.toggleAllTodos = function(){
			this.isAllCompleted = !this.isAllCompleted;
			this.fire('toggleall',{message:this.isAllCompleted});
		};
        Object.defineProperty(this, 'todos', {
            set: function (value) {
                if(value){
                    this.tasks = value;
                }
            }
        });
		Object.defineProperty(this, 'showToggleAll', {
            set: function (value) {
                this.isShowToggleAllBtn = value;
            }
        });
    };
})();
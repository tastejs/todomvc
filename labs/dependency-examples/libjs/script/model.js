void
function() {
    
    var w = window,
        r = ruqq;

    w.tasksDB = new (Class({
        Construct: function() {
            this.restore();            
        },
        
        createNew: function(label, completed){
            var data = {
                label: label || '',
                completed: !!completed
            };
            this.tasks.push(data);
            this.save();
            return data;
        },
        
        restore: function() {
            var tasks = localStorage && localStorage.getItem('todo-libjs');
            this.tasks = tasks ? JSON.parse(tasks) : [];
            return this;
        },
        
        save: function() {
            localStorage && localStorage.setItem('todo-libjs', JSON.stringify(r.arr.select(this.tasks, ['label','completed'])));
            return this;
        },
        
        remove: function(model){            
            this.tasks.splice(r.arr.indexOf(this.tasks, model), 1);
            return this;
        },
        
        get completedCount(){
            return r.arr.count(this.tasks, 'completed', '==', true);
        },
        get todoCount(){
            return r.arr.count(this.tasks, 'completed', '==', false);
        }
    }));

}();
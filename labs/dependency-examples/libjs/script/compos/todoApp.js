include.js('todoTask.js').load('todoApp.mask').done(function(response) {

    var w = window,
        r = ruqq,
        ENTER_KEY = 13;

    var FilterAdapter = Class({
        Construct: function() {
            this.filters = [{
                title: 'All',
                action: ''
            }, {
                title: 'Active',
                action: 'active'
            }, {
                title: 'Completed',
                action: 'completed'
            }];            
        },
        isVisible: function(taskModel) {
            if (this.action == 'completed' && taskModel.completed == false) return false;
            if (this.action == 'active' && taskModel.completed) return false;
            return true;
        }    
    });

    mask.registerHandler('todoApp', Class({
        Base: Compo,
        Extends: [FilterAdapter, CompoUtils],
        Construct: function(model) {
            this.model = model;
            
            w.routes.add({
               match: /([\w]*)/,
               param: 'action=$1',
               callback: this.applyFilter.bind(this)
            });

            this.applyFilter(w.routes.current());
            this.refreshStatus();
            
        },

        render: function(data, container, cntx) {
            /** {data} is Application Model - @see {main.js}.render(model)
             * We make controller wrapper over that model and continue rendering
             */
            Compo.prototype.render.call(this, this, container, cntx);
        },

        attr: {
            template: response.load[0]
        },
        events: {
            'keypress: #new-todo': function(e) {
                e.which == ENTER_KEY && this.createTask(e.target.value) && (e.target.value = '');                
            },
            'task-changed: li': function(e, todoTask) {
                todoTask.visible(this.isVisible(todoTask.model));
                this.refreshStatus();
                this.model.save();
            },
            'task-removed: li': function(e, todoTask) {
                this.model.remove(todoTask.model).save();                
                this.refreshStatus();
            },
            'click: #filters > li:not(.selected) > a': function(e) {
                $(e.currentTarget).closest('ul').find('.selected').removeClass('selected').end().end().addClass('selected');
            },
            'click: #toggle-all': function(e) {
                r.arr.each(this.find('list').components, function(x) {
                    x.status(e.currentTarget.checked);
                });
                
                this.applyFilter();
                this.refreshStatus();
                this.model.save();                
            },
            'click: #clear-completed': 'removeCompleted'
        },
        
        createTask: function(label) {
            label = label.trim();
            if (!label) return 1;
            

            var taskModel;
            taskModel = this.model.createNew(label);
            taskModel.visible = this.isVisible(taskModel);
            
            this.find('list').append('todoTask;', taskModel);        
            this.refreshStatus();
            
            return 1;
        },

        refreshStatus: function() {
            Object.extend(this.status || (this.status = {}), {
                completed: this.model.completedCount,
                count: this.model.tasks.length,
                todos: String.format('<strong>%1</strong> item%2 left', this.model.todoCount, this.model.todoCount == 1 ? '' : 's'),
                allCompleted: (this.model.tasks.length && r.arr.any(this.model.tasks,'completed','==',false) == false) || ''
            });            
        },

        applyFilter: function(current) {
            if (current) this.action = current.action;
            
            
            r.arr.each(this.model.tasks, function(x){
                x.visible = this.isVisible(x);                
            }.bind(this));
            
            r.arr.each(this.filters, function(x){
                x.selected = this.action == x.action ? 'selected' : '';                
            }.bind(this));
            
        },
        
        removeCompleted: function(){
            
            r.arr(this.find('list').components).where('model.completed','==',true).each(function(task){
                this.model.remove(task.model);
                task.remove();
            }.bind(this));
            
            this.model.save();
            this.refreshStatus();
        }
    }));



});
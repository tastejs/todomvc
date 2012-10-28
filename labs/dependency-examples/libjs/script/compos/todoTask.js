include.load('todoTask.mask').done(function(response){

	var ENTER_KEY = 13,
        ESCAPE_KEY = 27;

    mask.registerHandler('todoTask', Class({
        Base: Compo,
        Construct: function(model) {
            this.model = model;
            this.compos = {
                input: '$: .edit',
                checkbox: '$: .toggle'
            };
			this.attr = {
				template : response.load[0]
			};
        },

        /** we dont override render function, as in {todoApp.js}, so that this view will recieve raw model object */

        events: {
            'change: input.toggle': function(e) {
                this.status(e.currentTarget.checked).$.trigger('task-changed', this)
            },
            'click: button.destroy': function() {
                this.$.trigger('task-removed', this);
                this.remove();
            },
            'dblclick: .view': function(e) {
                if (this.model.completed) return;
                this.$.addClass('editing');
                this.compos.input.val(this.model.label).focus();				
            },
            'blur: .edit': function(){
                this.$.removeClass('editing');
            },
            'keydown: .edit': function(e) {
                e.which == ENTER_KEY && this.editSave(e.currentTarget.value) && this.$.removeClass('editing');
                e.which == ESCAPE_KEY && this.$.removeClass('editing');
            }
        },
        status: function(isCompleted) {
            this.$.toggleClass('completed', (this.model.completed = isCompleted));
            this.compos.checkbox.prop('checked', isCompleted);
            
            return this;
        },
        editSave: function(label) {
			label = label && label.trim();
            if (label && label != this.model.label) {
                this.model.label = label;
                this.$.trigger('task-changed', this);
            }
            return 1;
        },
        visible: function(status) {
            this.$.css('display', status ? 'block' : 'none');
        }
    }));

});
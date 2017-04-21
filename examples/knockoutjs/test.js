
function toDo (title, completed, assignee) {
    return {
        title:title,//ko.observable(title);
        completed:completed,//ko.observable(completed);
        editing:false,//ko.observable(false);
        assignee:assignee//ko.observable(assignee);
    }
    
};

function ViewModel_observableArray(todos) {
    return ko.observableArray(todos.map(function (todo) {
        return new toDo(todo.title, todo.completed, todo.assignee);
    }));
}

(function () {

    QUnit.test( "Validate toDo.completed", function( assert ) {
        var todo = toDo('toDoTitle', false, 'toDoAssignee');
        assert.ok( todo.completed === false,  "Passed!" );
    });


    QUnit.test( "Validate toDo.title", function( assert ) {
        var todo = toDo('toDoTitle', false, 'toDoAssignee');
        assert.ok( todo.title === 'toDoTitle',  "Passed!" );
    });

    QUnit.test( "Validate toDo.assignee", function( assert ) {
        var todo = toDo('toDoTitle', false, 'toDoAssignee');
        assert.ok( todo.assignee === 'toDoAssignee',  "Passed!" );
    });

    QUnit.test( "Validate View Model observable array", function( assert ) {
        var vm = ko.observableArray();
        vm = ViewModel_observableArray([toDo('toDoTitle', false, 'toDoAssignee')]);
        assert.ok( vm().length>0,  "Passed!" );
    });


}());



	// 	// store the new todo value being entered
	// 	this.current = ko.observable();

	// 	this.assignees = ko.observableArray ([
	// 		"All","Tom","Dick","Harry"
	// 	]);
		
	// 	this.selectedAssignee = ko.observable();
	// 	this.selectedAssigneeFilter = ko.observable();
		
	// 	this.showEditForm = ko.observable(false);
	// 	this.isNewTask = function(){
	// 		this.showEditForm(true);
	// 	};
		
	// 	this.showMode = ko.observable('all');

	// 	this.filteredTodos = ko.computed(function () {
	// 		if (this.selectedAssigneeFilter())
	// 		{
	// 			this.showMode('assignee');
	// 		}
	// 		switch (this.showMode()) {
	// 		case 'active':
	// 			return this.todos().filter(function (todo) {
	// 				return !todo.completed();
	// 			});
	// 		case 'completed':
	// 			return this.todos().filter(function (todo) {
	// 				return todo.completed();
	// 			});
	// 		case 'assignee':
	// 			{	
	// 				var assignee = this.selectedAssigneeFilter();
	// 				if (assignee!='All')
	// 				{
	// 					return this.todos().filter(
	// 						function(todo)
	// 							{
	// 								if (todo.assignee() === this[0])
	// 								{
	// 									return todo;
	// 								}
	// 							}
	// 						,[assignee]);
	// 				}
	// 				return this.todos();
	// 			}
	// 		default:
	// 			return this.todos();
	// 		}
	// 	}.bind(this));
		
		
	// 	// add a new todo, when enter key is pressed
	// 	this.add = function () {
	// 		var current = this.current().trim();
	// 		if (current) {
	// 			this.todos.push(new Todo(current, false, this.selectedAssignee()));
	// 			this.current('');
	// 			this.showEditForm(false);
	// 		}
	// 	}.bind(this);

	// 	// remove a single todo
	// 	this.remove = function (todo) {
	// 		this.todos.remove(todo);
	// 	}.bind(this);

	// 	// remove all completed todos
	// 	this.removeCompleted = function () {
	// 		this.todos.remove(function (todo) {
	// 			return todo.completed();
	// 		});
	// 	}.bind(this);

	// 	// edit an item
	// 	this.editItem = function (item) {
	// 		this.todos().map(function(item){ return item.editing(false)})
	// 		this.showEditForm(false);
	// 		item.editing(true);
	// 		item.previousTitle = item.title();
	// 		item.previousAssignee = item.assignee();
	// 	}.bind(this);

	// 	// stop editing an item.  Remove the item, if it is now empty
	// 	this.saveEditing = function (item) {
	// 		item.editing(false);
	// 		item.assignee(this.selectedAssignee());
	// 		var title = item.title();
	// 		var trimmedTitle = title.trim();

	// 		// Observable value changes are not triggered if they're consisting of whitespaces only
	// 		// Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
	// 		// And if yes, we've to set the new value manually
	// 		if (title !== trimmedTitle) {
	// 			item.title(trimmedTitle);
	// 		}

	// 		if (!trimmedTitle) {
	// 			this.remove(item);
	// 		}
	// 	}.bind(this);

	// 	// cancel editing an item and revert to the previous content
	// 	this.cancelEditing = function (item) {
	// 		item.editing(false);
	// 		item.title(item.previousTitle);
	// 		item.assignee(item.previousAssignee);
	// 	}.bind(this);

	// 	this.cancel = function(){
	// 		this.current('');
	// 		this.showEditForm(false);
	// 	}.bind(this);

	// 	// count of all completed todos
	// 	this.completedCount = ko.computed(function () {
	// 		return this.todos().filter(function (todo) {
	// 			return todo.completed();
	// 		}).length;
	// 	}.bind(this));

	// 	// count of todos that are not complete
	// 	this.remainingCount = ko.computed(function () {
	// 		return this.todos().length - this.completedCount();
	// 	}.bind(this));

	// 	// writeable computed observable to handle marking all complete/incomplete
	// 		//always return true/false based on the done flag of all todos
	// 	this.allCompleted = ko.computed({
	// 		read: function () {
	// 			return !this.remainingCount();
	// 		}.bind(this),
	// 		// set all todos to the written value (true/false)
	// 		write: function (newValue) {
	// 			this.todos().forEach(function (todo) {
	// 				// set even if value is the same, as subscribers are not notified in that case
	// 				todo.completed(newValue);
	// 			});
	// 		}.bind(this)
	// 	});

	// 	// helper function to keep expressions out of markup
	// 	this.getLabel = function (count) {
	// 		return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
	// 	}.bind(this);

	// 	// internal computed observable that fires whenever anything changes in our todos
	// 	ko.computed(function () {
	// 		// store a clean copy to local storage, which also creates a dependency on
	// 		// the observableArray and all observables in each item
	// 		localStorage.setItem('todos-knockoutjs', ko.toJSON(this.todos));
	// 	}.bind(this)).extend({
	// 		rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
	// 	}); // save at most twice per second
	// };

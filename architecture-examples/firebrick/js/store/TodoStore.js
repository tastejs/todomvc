Firebrick.define("Todo.store.TodoStore", {
	extends:"Firebrick.store.Base",
	root:"todos",
	url:{
		submit:"/test.html"
	},
	data:{
		left: 0,
		completed: 0,
		todos:[],
		filters:[{
			text:"all",
			active: true,	//default
			link: "#/"
		},{
			text:"active",
			active: false,
			link: "#/active"
		},{
			text:"completed",
			active: false,
			link: "#/completed"
		}]
	}
});
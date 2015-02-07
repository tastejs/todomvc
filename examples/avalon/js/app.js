
avalon.state("todos", {
	url: "/:status",
	controller: "todos",
	views: {
		"list": {
			templateUrl: "js/views/list.html"
		},
		"footer": {
			templateUrl: "js/views/footer.html"
		}
	},
	onChange: function(status) {
		if(status in {"": 1, active: 1, completed:1}) {
			var todos = avalon.vmodels.todos
			if(todos) {
				todos.status = status
			} else {
				var done = this.async()
				require(["../../js/model/model"], function() {
					done()
					todos = avalon.vmodels.todos
					todos.status = status
					avalon.scan()
				})
			}
		} else {
			avalon.router.errorback()
		}
	}
})

avalon.router.errorback = function() {
	avalon.router.redirect("/")
}
avalon.history.start({
    hashPrefix: "",
    fireAnchor: false
})


avalon.scan()
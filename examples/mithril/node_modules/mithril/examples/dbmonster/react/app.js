"use strict"

var h = React.createElement

perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler("render")

var data = []

var DBMon = React.createClass({
	render: function() {
		return h("div", null,
			h("table", {className: "table table-striped latest-data"},
				h("tbody", null,
					data.map(function(db) {
						return h("tr", {key: db.dbname},
							h("td", {className: "dbname"}, db.dbname),
							h("td", {className: "query-count"},
								h("span", {className: db.lastSample.countClassName}, db.lastSample.nbQueries)
							),
							db.lastSample.topFiveQueries.map(function(query, i) {
								return h("td", {key: i, className: query.elapsedClassName},
									query.formatElapsed,
									h("div", {className: "popover left"},
										h("div", {className: "popover-content"}, query.query),
										h("div", {className: "arrow"})
									)
								)
							})
						)
					})
				)
			)
		)
	}
})

var root = document.getElementById("app")
function update() {
	requestAnimationFrame(update)
	
	data = ENV.generateData().toArray()

	perfMonitor.startProfile("render")
	ReactDOM.render(h(DBMon, null), root)
	perfMonitor.endProfile("render")
}

update()

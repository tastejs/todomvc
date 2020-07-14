"use strict"

perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler("render")

var data = []

m.mount(document.getElementById("app"), {
	view: function() {
		return m("div", [
			m("table", {className: "table table-striped latest-data"}, [
				m("tbody",
					data.map(function(db) {
						return m("tr", {key: db.dbname}, [
							m("td", {className: "dbname"}, db.dbname),
							m("td", {className: "query-count"},  [
								m("span", {className: db.lastSample.countClassName}, db.lastSample.nbQueries)
							]),
							db.lastSample.topFiveQueries.map(function(query) {
								return m("td", {className: query.elapsedClassName}, [
									query.formatElapsed,
									m("div", {className: "popover left"}, [
										m("div", {className: "popover-content"}, query.query),
										m("div", {className: "arrow"})
									])
								])
							})
						])
					})
				)
			])
		])
	}
})

function update() {
	requestAnimationFrame(update)
	
	data = ENV.generateData().toArray()

	perfMonitor.startProfile("render")
	m.redraw()
	perfMonitor.endProfile("render")
}

update()

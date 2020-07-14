var renderStage = 0
perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler("render")

var vm = new Vue({
	el: '#app',
	data: {
		databases: [],
	},
	methods: {
		update: function () {
			requestAnimationFrame(this.update.bind(this))
			this.databases = ENV.generateData().toArray()

			if (renderStage === 0) {
				renderStage = 1
				perfMonitor.startProfile('render')
			}
		},
	},
	updated: function () {
		if (renderStage === 1) {
			renderStage = 0
			perfMonitor.endProfile('render')
		}
	},
	template: '<div>' +
			'<table class="table table-striped latest-data">' +
				'<tbody>' +
					'<tr v-for="db of databases">' +
						'<td class="dbname">{{ db.dbname }}</td>' +
						'<td class="query-count">' +
							'<span v-bind:class="[ db.lastSample.countClassName ]">' +
								'{{ db.lastSample.nbQueries}}' +
							'</span>' +
						'</td>' +
						'<td v-for="q of db.lastSample.topFiveQueries" v-bind:class="[ q.elapsedClassName ]">' +
							'{{ q.formatElapsed }}' +
							'<div class="popover left">' +
								'<div className="popover-content">{{ q.query }}</div>' +
								'<div className="arrow"></div>' +
							'</div>' +
						'</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>' +
		'</div>',
})

vm.update()

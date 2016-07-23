/* global aria:true, Aria:true */
'use strict';

Aria.tplScriptDefinition({
	$classpath: 'js.view.TodoScript',
	$dependencies: ['aria.utils.HashManager'],

	$prototype: {
		$dataReady: function () {
			this.getRoute();
			this.data.editedTask = null;
			this.pauselistener = false;
			this.todolistUpdateHandler();
			this.$json.addListener(this.data, 'todolist', {fn: this.todolistUpdateHandler, scope: this}, false, true);
			aria.utils.HashManager.addCallback({fn: 'routeManager', scope: this});
		},

		$viewReady: function () {
			document.getElementById('new-todo').focus();
		},

		getRoute: function () {
			var route = aria.utils.HashManager.getHashString();
			this.$json.setValue(this.data, 'route', route[0] === '/' ? route.substr(1) : route);
		},

		routeManager: function () {
			var el = this.$getElementById('tasklist');
			this.getRoute();
			el.classList.setClassName('todo-list' + (this.data.route.length > 0 ? ' filter-' + this.data.route : ''));
		},

		changeTaskStyle: function (val, where) {
			var el = this.$getElementById(where);
			if (el) { el.classList.setClassName(val ? 'completed' : ''); }
			return val;
		},

		newTaskOnEnter: function (evt) {
			var val;
			if (evt.keyCode === evt.KC_ENTER) {
				val = aria.utils.String.trim(evt.target.getValue());
				if (val.length > 0) {
					this.moduleCtrl.addTask(val);
					evt.target.setValue('');
				}
			}
		},

		deleteTask: function (evt, e) {
			this.moduleCtrl.deleteTask(e.index);
		},

		toggleAll: function (val) {
			var i;
			this.pauselistener = true;
			for (i = 0; i < this.data.todolist.length; i++) {
				this.$json.setValue(this.data.todolist[i], 'completed', val);
			}
			this.pauselistener = false;
			this.todolistUpdateHandler();
			return val;
		},

		clearCompleted: function () {
			var i;
			aria.templates.RefreshManager.stop();
			this.pauselistener = true;
			for (i = this.data.todolist.length - 1; i >= 0; i--) {
				if (this.data.todolist[i].completed) { this.deleteTask(null, {index: i}); }
			}
			this.pauselistener = false;
			this.todolistUpdateHandler();
			aria.templates.RefreshManager.resume();
		},

		editTask: function (evt, e) {
			var el = null;
			this.data.editedTask = e.sectionId;
			el = this.$getElementById(e.sectionId);
			if (el) { el.classList.add('editing'); }
			this.$refresh({outputSection: e.sectionId});
			this.$focus('editbox');
		},

		confirmOrRevertEdit: function (evt, e) {
			if (evt.keyCode === evt.KC_ENTER) { this.stopEdit(evt, e); }
			if (evt.keyCode === evt.KC_ESCAPE) { this.revertEdit(evt, e); }
		},

		stopEdit: function (evt, e) {
			var el, val;
			this.data.editedTask = null;
			el = this.$getElementById(e.sectionId);
			if (el) { el.classList.remove('editing'); }
			val = aria.utils.String.trim(evt.target.getValue());
			if (val.length > 0) {
				if (val === e.item.title) {
					this.$refresh({outputSection: e.sectionId});
				}
				else {
					this.$json.setValue(e.item, 'title', val);
				}
			}
			else {
				this.deleteTask(evt, e);
			}
		},

		revertEdit: function (evt, e) {
			var el;
			this.data.editedTask = null;
			el = this.$getElementById(e.sectionId);
			if (el) { el.classList.remove('editing'); }
			this.$refresh({outputSection: e.sectionId});
			this.$json.setValue(e.item, 'title', e.item.title);
		},

		todolistUpdateHandler: function () {
			var size;
			if (this.pauselistener) { return; }
			aria.templates.RefreshManager.stop();
			size = this.data.todolist.length;
			this.$json.setValue(this.data, 'emptylist', size === 0);
			this.$json.setValue(this.data, 'itemsleft', this.data.todolist.filter(function (e) { return !(e.completed); }).length);
			this.$json.setValue(this.data, 'itemscompleted', size - this.data.itemsleft);
			this.$json.setValue(this.data, 'toggleall', size === this.data.itemscompleted);
			aria.templates.RefreshManager.resume();
			this.moduleCtrl.saveTasks();
		}

	}
});

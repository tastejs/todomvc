ListView {
	property string filterMode;
	height: contentHeight;
	anchors.left: parent.left;
	anchors.right: parent.right;
	anchors.topMargin: 1;
	contentFollowsCurrentItem: false;
	model: ProxyModel {
		target: todoModel;

		function filter(item) {
			switch (this.parent.filterMode) {
			case 'Active':
				return !item.completed
			case 'Completed':
				return item.completed
			case 'All':
			default:
				return true
			}
		}

		onCompleted: { this.setFilter(this.filter) }
	}
	delegate: TodoDelegate {
		onRemove(idx): { this.parent.remove(idx) }
		onEdit(idx, text): { this.parent.edit(idx, text) }
		onToggleCompleted(idx): { this.parent.toggleCompleted(idx) }
	}

	onFilterModeChanged: { this.model.rebuild() }

	remove(idx): { this.model.remove(idx); }

	edit(idx, title): {
		this.model.setProperty(idx, "title", title)
		this.model.target.update()
	}

	toggleCompleted(idx): {
		var completed = this.model.get(idx).completed
		this.model.setProperty(idx, "completed", !completed)
		this.model.target.update()
	}
}

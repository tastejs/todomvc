ListView {
	property bool editMode;
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
			case '#/active':
				return !item.completed
			case '#/completed':
				return item.completed
			case '#/all':
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
		onEditModeChanged: { if (value) this.parent.editMode = value }

		onClicked: {
			if (this.parent.currentIndex == this.index)
				return

			if (this.parent.editMode) {
				this.parent.editMode = false
			} else {
				this.parent.currentIndex = this.index
				this.setFocus()
			}
		}
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

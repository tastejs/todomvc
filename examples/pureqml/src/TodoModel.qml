ListModel {
	signal save;
	property int todoCount;
	property int completedCount;
	property string name: "todo-pureqml";

	onReset: { this.update() }
	onRowsRemoved: { this.update() }
	onRowsInserted: { this.update() }

	buildModel(data): {
		if (data && data.rows)
			this.append(data.rows)
	}

	toggleAll: {
		var newFlagValue = (this.count == this.todoCount) || this.todoCount
		for (var i = 0; i < this.count; ++i)
			this.setProperty(i, "completed", newFlagValue)
		this.reset()
	}

	clearCompleted: {
		var last = this.count - 1
		for (var i = last; i >= 0; --i)
			if (this._rows[i].completed)
				this.remove(i)
	}

	update: {
		this.save()

		var todo = 0
		for (var i = 0; i < this.count; ++i)
			if (!this._rows[i].completed)
				++todo
		this.completedCount = this.count - todo
		this.todoCount = todo
	}
}

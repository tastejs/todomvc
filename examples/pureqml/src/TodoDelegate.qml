TodoRectangle {
	ClickMixin { }
	DoubleClickMixin { }
	signal edit;
	signal remove;
	signal toggleCompleted;
	property bool editMode;
	property int index: model.index;
	property Mixin hoverMixin: HoverMixin { }
	height: !editMode ? todoText.paintedHeight + 31 : 59;

	Text {
		ClickMixin { }
		property string checkboxOn: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"-10 -18 100 135\"><circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"none\" stroke=\"#bddad5\" stroke-width=\"3\"/><path fill=\"#5dc2af\" d=\"M72 25L42 71 27 56l-4 4 20 20 34-52z\"/></svg>";
		property string checkboxOff: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"-10 -18 100 135\"><circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"none\" stroke=\"#ededed\" stroke-width=\"3\"/></svg>";
		width: 40;
		height: 40;
		anchors.verticalCenter: parent.verticalCenter;
		text: model.completed ? checkboxOn : checkboxOff;

		onClicked: { this.parent.toggleCompleted(this.parent.index) }
	}

	Text {
		id: todoText;
		HoverMixin { cursor: "default"; }
		anchors.left: parent.left;
		anchors.right: parent.right;
		anchors.verticalCenter: parent.verticalCenter;
		anchors.leftMargin: 60;
		anchors.rightMargin: 50;
		font.pixelSize: 24;
		font.strike: model.completed;
		text: model.title;
		color: model.completed ? "#d9d9d9" : "#4d4d4d";
		wrapMode: Text.WrapAnywhere;
	}

	TextInput {
		id: editInput;
		anchors.top: parent.top;
		anchors.left: todoText.left;
		anchors.right: parent.right;
		anchors.bottom: parent.bottom;
		visible: parent.editMode;
		text: model.title;
		font.pixelSize: 24;
		color: "#4d4d4d";
		border.width: 1;
		border.color: "#000";
		focus: true;

		onActiveFocusChanged: {
			if (!value)
				this.parent.editMode = false
		}

		onKeyPressed: {
			switch (key) {
				case 'Select':
					if (this.text)
						this.parent.edit(this.parent.index, this.text.trim())
					else
						this.parent.remove(this.parent.index)
					this.parent.editMode = false
					break
				case 'Back':
					this.parent.editMode = false
					break
			}
		}
	}

	Text {
		ClickMixin { }
		property Mixin hoverMixin: HoverMixin { cursor: "default"; }
		anchors.right: parent.right;
		anchors.verticalCenter: parent.verticalCenter;
		anchors.rightMargin: 20;
		color: hoverMixin.value ? "#af5b5e" : "#cc9a9a";
		font.pixelSize: 30;
		visible: parent.hoverMixin.value && !parent.editMode;
		text: "×";

		onClicked: { this.parent.remove(this.parent.index) }
	}

	onDoubleClicked: {
		if (!this.editMode) {
			this.editMode = true
			editInput.setFocus()
		}
	}
}

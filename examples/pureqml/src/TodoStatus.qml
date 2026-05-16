Column {
	id: todoStatusProto;
	signal clearCompleted;
	property int completedCount;
	property int todoCount;
	property string filter;
	property string name: "todoFilter";
	anchors.left: parent.left;
	anchors.right: parent.right;
	spacing: 1;

	TodoRectangle {
		height: context.width > 550 ? 40 : 70;

		Text {
			anchors.top: parent.top;
			anchors.left: parent.left;
			anchors.topMargin: 11;
			anchors.leftMargin: 15;
			font.pixelSize: 14;
			font.weight: 300;
			color: "#777";
			text: "<strong>" + parent.parent.todoCount + "</strong> item" + (todoStatusProto.todoCount > 1 ? "s " : " ") + "left";
		}

		ListView {
			id: filterList;
			width: contentWidth;
			height: contentHeight;
			anchors.bottom: parent.bottom;
			anchors.horizontalCenter: parent.horizontalCenter;
			anchors.bottomMargin: 10;
			orientation: ListView.Horizontal;
			spacing: 12;
			contentFollowsCurrentItem: false;
			model: ListModel {
				ListElement { text: "All"; filter: "#/all"; } ListElement { text: "Active"; filter: "#/active"; } ListElement { text: "Completed"; filter: "#/completed" }
			}
			delegate: Rectangle {
				ClickMixin { }
				property Mixin hoverMixin: HoverMixin { cursor: "pointer"; }
				property int index: model.index;
				width: statusDelegateText.width + 14;
				height: statusDelegateText.height + 5;
				radius: 2;
				border.width: hoverMixin.value || parent.currentIndex == index ? 1 : 0;
				border.color: parent.currentIndex == index ? "#AF2F2F32" : "#AF2F2F19";

				Text {
					id: statusDelegateText;
					anchors.centerIn: parent;
					font.pixelSize: 14;
					color: "#777";
					text: model.text;
				}

				onClicked: { this.parent.choose(this.index) }
			}

			choose(idx): {
				this.currentIndex = idx
				todoStatusProto.filter = this.model.get(idx).filter
			}
		}

		Text {
			ClickMixin { }
			property Mixin hoverMixin: HoverMixin { cursor: "pointer"; }
			anchors.top: parent.top;
			anchors.right: parent.right;
			anchors.topMargin: 12;
			anchors.rightMargin: 15;
			font.pixelSize: 14;
			font.underline: hoverMixin.value;
			color: "#777";
			text: "Clear completed";
			visible: todoStatusProto.completedCount > 0;

			onClicked: { todoStatusProto.clearCompleted() }
		}
	}

	TodoRectangle {
		height: 4;
		anchors.leftMargin: 3;
		anchors.rightMargin: 3;
		border.color: "#ddd";
	}

	TodoRectangle {
		height: 4;
		anchors.leftMargin: 6;
		anchors.rightMargin: 6;
		border.color: "#ddd";
	}

	setFilter(filter): {
		var newFilter = filter && filter.value ? filter.value : "All"
		this.filter = newFilter
		var model = filterList.model
		for (var i = 0; i < model.count; ++i)
			if (model.get(i).text == newFilter) {
				filterList.currentIndex = i
				break
			}
	}
}

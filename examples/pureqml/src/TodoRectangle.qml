Rectangle {
	height: 65;
	anchors.left: parent.left;
	anchors.right: parent.right;
	effects.shadow.y: 2;
	effects.shadow.blur: 1;
	effects.shadow.spread: 1;
	effects.shadow.color: "#00000015";
	color: "#fff";

	Rectangle {
		height: 1;
		anchors.left: parent.left;
		anchors.right: parent.right;
		color: "#ededed";
	}
}

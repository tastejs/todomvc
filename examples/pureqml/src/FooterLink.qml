Row {
	property string text;
	property string href;
	property string linkText;
	width: contentWidth;
	height: contentHeight;
	anchors.horizontalCenter: parent.horizontalCenter;
	spacing: 3;

	FooterText {
		width: paintedWidth;
		text: parent.text;
	}

	FooterText {
		ClickMixin { }
		property Mixin hoverMixin: HoverMixin { cursor: "pointer"; }
		width: paintedWidth;
		text: parent.linkText;
		font.underline: hoverMixin.value;

		onClicked: { window.location = this.parent.href; }
	}
}

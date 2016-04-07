System.register([], function (_export) {
	"use strict";

	var ENTER_KEY, ESC_KEY, TodoItem;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	return {
		setters: [],
		execute: function () {
			ENTER_KEY = 13;
			ESC_KEY = 27;

			TodoItem = (function () {
				function TodoItem(title) {
					_classCallCheck(this, TodoItem);

					this.isCompleted = false;
					this.isEditing = false;
					this.title = title.trim();
					this.editTitle = null;
				}

				_createClass(TodoItem, [{
					key: "labelDoubleClicked",
					value: function labelDoubleClicked() {
						this.editTitle = this.title;
						this.isEditing = true;
					}
				}, {
					key: "finishEditing",
					value: function finishEditing() {
						this.title = this.editTitle.trim();
						this.isEditing = false;
					}
				}, {
					key: "onKeyUp",
					value: function onKeyUp(ev) {
						if (ev.keyCode === ENTER_KEY) {
							return this.finishEditing();
						}
						if (ev.keyCode === ESC_KEY) {
							this.editTitle = this.title;
							this.isEditing = false;
						}
					}
				}]);

				return TodoItem;
			})();

			_export("TodoItem", TodoItem);
		}
	};
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvZG8taXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7S0FBTSxTQUFTLEVBQ1QsT0FBTyxFQUVBLFFBQVE7Ozs7Ozs7OztBQUhmLFlBQVMsR0FBRyxFQUFFO0FBQ2QsVUFBTyxHQUFHLEVBQUU7O0FBRUwsV0FBUTtBQUNULGFBREMsUUFBUSxDQUNSLEtBQUssRUFBRTsyQkFEUCxRQUFROztBQUVuQixTQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUN6QixTQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixTQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQixTQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztLQUN0Qjs7aUJBTlcsUUFBUTs7WUFRRiw4QkFBRztBQUNwQixVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDNUIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7TUFDdEI7OztZQUVZLHlCQUFHO0FBQ2YsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO01BQ3ZCOzs7WUFFTSxpQkFBQyxFQUFFLEVBQUU7QUFDWCxVQUFJLEVBQUUsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO0FBQzdCLGNBQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO09BQzVCO0FBQ0QsVUFBSSxFQUFFLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBRTtBQUMzQixXQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDNUIsV0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDdkI7TUFDRDs7O1dBMUJXLFFBQVEiLCJmaWxlIjoidG9kby1pdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRU5URVJfS0VZID0gMTM7XG5jb25zdCBFU0NfS0VZID0gMjc7XG5cbmV4cG9ydCBjbGFzcyBUb2RvSXRlbSB7XG5cdGNvbnN0cnVjdG9yKHRpdGxlKSB7XG5cdFx0dGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuXHRcdHRoaXMuaXNFZGl0aW5nID0gZmFsc2U7XG5cdFx0dGhpcy50aXRsZSA9IHRpdGxlLnRyaW0oKTtcblx0XHR0aGlzLmVkaXRUaXRsZSA9IG51bGw7XG5cdH1cblxuXHRsYWJlbERvdWJsZUNsaWNrZWQoKSB7XG5cdFx0dGhpcy5lZGl0VGl0bGUgPSB0aGlzLnRpdGxlO1xuXHRcdHRoaXMuaXNFZGl0aW5nID0gdHJ1ZTtcblx0fVxuXG5cdGZpbmlzaEVkaXRpbmcoKSB7XG5cdFx0dGhpcy50aXRsZSA9IHRoaXMuZWRpdFRpdGxlLnRyaW0oKTtcblx0XHR0aGlzLmlzRWRpdGluZyA9IGZhbHNlO1xuXHR9XG5cblx0b25LZXlVcChldikge1xuXHRcdGlmIChldi5rZXlDb2RlID09PSBFTlRFUl9LRVkpIHtcblx0XHRcdHJldHVybiB0aGlzLmZpbmlzaEVkaXRpbmcoKTtcblx0XHR9XG5cdFx0aWYgKGV2LmtleUNvZGUgPT09IEVTQ19LRVkpIHtcblx0XHRcdHRoaXMuZWRpdFRpdGxlID0gdGhpcy50aXRsZTtcblx0XHRcdHRoaXMuaXNFZGl0aW5nID0gZmFsc2U7XG5cdFx0fVxuXHR9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

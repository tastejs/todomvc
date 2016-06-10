import 'dart:html' as dom;
import 'package:angular/angular.dart';

@NgDirective(
	selector: '[todo-escape]',
	map: const {'todo-escape': '&onEscape'}
)
@NgDirective(
	selector: '[todo-focus]',
	map: const {'todo-focus': '@todoFocus'}
)
class TodoDOMEventDirective {
	final Map<int, Function> listeners = {};
	final dom.Element element;
	final Scope scope;

	TodoDOMEventDirective(this.element, this.scope);

	void initHandler(stream, value, [bool predicate(event)]) {
		final int key = stream.hashCode;

		if (!listeners.containsKey(key)) {
			listeners[key] = value;
			stream.listen((event) => scope.$apply(() {
				if (predicate == null || predicate(event)) {
					event.preventDefault();
					value({r'$event': event});
				}
			}));
		}
	}

	set onEscape(value) {
		initHandler(element.onKeyDown, value, (event) => event.keyCode ==
				dom.KeyCode.ESC);
	}

	set todoFocus(watchExpr) {
		scope.$watch(watchExpr, (value) {
			if (value) {
				element.focus();
			}
		});
	}
}

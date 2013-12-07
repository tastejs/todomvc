import 'dart:html' as dom;
import 'package:angular/angular.dart';

@NgDirective(
	// ng-submit is eventually going to be added, using `todo-` as prefix will
	// avoid future name clashes.
	selector: '[todo-submit]',
	map: const {'todo-submit': '&onSubmit'}
)
@NgDirective(
	selector: '[todo-dblclick]',
	map: const {'todo-dblclick': '&onDblclick'}
)
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

	set onSubmit(value) => initHandler(element.onSubmit, value);

	set onDblclick(value) => initHandler(element.onDoubleClick, value);

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

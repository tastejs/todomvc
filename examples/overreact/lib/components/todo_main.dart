import 'package:over_react/over_react.dart';
import 'package:react/react_client.dart';

import './common.dart';
import './todo_item.dart';
import './todo_list.dart';

@Factory()
UiFactory<TodoMainProps> TodoMain;

@Props()
class TodoMainProps extends UiProps {
  KeyboardEventCallback onInputKeyDown;

  List<TodoValue> todoValues;

  IndexCallback onTodoValueChange;

  FormEventCallback onToggleAll;

  bool toggleAllChecked;

  IndexCallback onItemDestroy;

  Filter activeFilter;
}

@Component()
class TodoMainComponent extends UiComponent<TodoMainProps> {
  @override
  Map getDefaultProps() => (newProps()
    ..todoValues = const []
    ..toggleAllChecked = false
    ..activeFilter = Filter.all
  );

  @override
  render() {
    var classes = forwardingClassNameBuilder()
      ..add('main')
      ..add('hidden', props.todoValues.isEmpty);

    return (Dom.section()
      ..addProps(copyUnconsumedDomProps())
      ..className = classes.toClassName()
    )(
      _renderCheckbox(),
      (Dom.label()..htmlFor = 'toggle-all')('Mark all as complete'),
      TodoList()(
        _renderTodoItems()
      )
    );
  }

  ReactElement _renderCheckbox() {
    return (Dom.input()
      ..className = 'toggle-all'
      ..id = 'toggle-all'
      ..type = 'checkbox'
      ..onChange = props.onToggleAll
      ..checked = props.toggleAllChecked
    )();
  }

  List<ReactElement> _renderTodoItems() {
    var items = <ReactElement>[];

    for (int i = 0; i < props.todoValues.length; i++) {
      var todoValue = props.todoValues[i];

      bool isItemHidden = (props.activeFilter == Filter.active && todoValue.isCompleted) ||
          (props.activeFilter == Filter.completed && !todoValue.isCompleted);

      items.add(
        (TodoItem()
          ..className = isItemHidden ? 'hidden' : ''
          ..defaultValue = todoValue
          ..onItemDestroy = () {
            if (props.onItemDestroy != null) {
              props.onItemDestroy(i);
            }
          }
          ..isCompleted = todoValue.isCompleted
          ..onCheckboxChange = (_) {
            if (props.onTodoValueChange != null) {
              props.onTodoValueChange(i);
            }
          }
          // The toString value of TodoValue is guaranteed to be unique.
          ..key = todoValue
        )()
      );
    }

    return items;
  }
}

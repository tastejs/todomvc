import 'package:over_react/over_react.dart';

import './common.dart';
import './todo_header.dart';
import './todo_main.dart';
import './todo_footer.dart';

@Factory()
UiFactory<TodoAppPrimitiveProps> TodoAppPrimitive;

@Props()
class TodoAppPrimitiveProps extends UiProps {
  List<TodoValue> todoValues;

  KeyboardEventCallback onInputKeyDown;

  IndexCallback onTodoValueChange;

  FormEventCallback onToggleAll;

  bool toggleAllChecked;

  IndexCallback onItemDestroy;

  MouseEventCallback onClearCompletedClick;

  FilterCallback onFilterUpdate;

  Filter activeFilter;
}

@Component()
class TodoAppPrimitiveComponent extends UiComponent<TodoAppPrimitiveProps> {
  @override
  Map getDefaultProps() => (newProps()
    ..todoValues = const []
    ..toggleAllChecked = false
    ..activeFilter = Filter.all
  );

  @override
  render() {
    var classes = forwardingClassNameBuilder()
      ..add('todoapp');


    return (Dom.section()
      ..addProps(copyUnconsumedDomProps())
      ..className = classes.toClassName()
    )(
      (TodoHeader()
        ..onInputKeyDown = props.onInputKeyDown
      )(),
      (TodoMain()
        ..className = props.todoValues.isEmpty ? 'hidden' : ''
        ..todoValues = props.todoValues
        ..onTodoValueChange = props.onTodoValueChange
        ..onToggleAll = props.onToggleAll
        ..toggleAllChecked = props.toggleAllChecked
        ..onItemDestroy = props.onItemDestroy
        ..activeFilter = props.activeFilter
      )(),
      (TodoFooter()
        ..className = props.todoValues.isEmpty ? 'hidden' : ''
        ..uncompletedCount = props.todoValues.where((todoValue) => !todoValue.isCompleted).length
        ..onClearCompletedClick = props.onClearCompletedClick
        ..onFilterUpdate = props.onFilterUpdate
        ..activeFilter = props.activeFilter
      )()
    );
  }
}

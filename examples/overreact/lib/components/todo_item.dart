import 'dart:html';

import 'package:over_react/over_react.dart';
import 'package:react/react.dart' as react;

import './common.dart';
import './todo_item_primitive.dart';
import './shared_todo_item_props.dart';

@Factory()
UiFactory<TodoItemProps> TodoItem;

@Props()
class TodoItemProps extends SharedTodoItemProps {
  @Required()
  TodoValue defaultValue;
}

@State()
class TodoItemState extends UiState {
  bool isEditing;

  TodoValue committedValue;
}

@Component()
class TodoItemComponent extends UiStatefulComponent<TodoItemProps, TodoItemState> {
  TodoItemPrimitiveComponent _primitiveRef;

  @override
  Map getInitialState() => (newState()
    ..isEditing = false
    ..committedValue = props.defaultValue
  );

  @override
  render() {
    return (TodoItemPrimitive()
      ..addProps(copyUnconsumedProps())
      ..value = state.committedValue
      ..isEditing = state.isEditing
      ..onContentDoubleClick = _handleOnContentDoubleClick
      ..onInputKeyDown = _handleOnInputKeyDown
      ..onInputBlur = _handleOnInputBlur
      ..ref = (ref) { _primitiveRef = ref; }
    )();
  }

  void _handleOnContentDoubleClick(_) {
    enterEditable();
  }

  void _handleOnInputBlur(_) {
    exitEditable();
  }

  void _handleOnInputKeyDown(react.SyntheticKeyboardEvent event) {
    if (event.keyCode == KeyCode.ENTER) {
      exitEditable();
    } else if (event.keyCode == KeyCode.ESC) {
      exitEditable(commitValue: false);
    }
  }

  // --------------------------------------------------------------------------
  // Public API Methods
  // --------------------------------------------------------------------------

  void enterEditable() {
    if (state.isEditing) return;

    setState(newState()..isEditing = true, () {
      _primitiveRef.getEditDomNode()
        ..focus()
        ..setSelectionRange(0, 0);
    });
  }

  void exitEditable({bool commitValue: true}) {
    if (!state.isEditing) return;

    var newValue = new TodoValue(_primitiveRef.getEditDomNode().value, state.committedValue.isCompleted);

    setState(newState()
      ..isEditing = false
      ..committedValue = commitValue ? newValue : state.committedValue
    );
  }
}

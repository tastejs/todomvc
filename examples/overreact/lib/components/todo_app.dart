import 'dart:html';

import 'package:over_react/over_react.dart';
import 'package:react/react.dart' as react;

import './common.dart';
import './todo_app_primitive.dart';

@Factory()
UiFactory<TodoAppProps> TodoApp;

@Props()
class TodoAppProps extends UiProps {}

@State()
class TodoAppState extends UiState {
  List<TodoValue> todoValues;

  bool toggleAllChecked;

  Filter activeFilter;
}

@Component()
class TodoAppComponent extends UiStatefulComponent<TodoAppProps, TodoAppState> {
  @override
  Map getInitialState() => (newState()
    ..todoValues = const []
    ..toggleAllChecked = false
    ..activeFilter = Filter.all
  );

  @override
  render() {
    return (TodoAppPrimitive()
      ..todoValues = state.todoValues
      ..onInputKeyDown = _handleInputKeyDown
      ..onTodoValueChange = _handleTodoValueChange
      ..onToggleAll = _handleToggleAll
      ..toggleAllChecked = _toggleAllChecked
      ..onItemDestroy = _handleOnItemDestroy
      ..onClearCompletedClick = _handleClearCompletedClick
      ..onFilterUpdate = _handleFilterUpdate
      ..activeFilter = state.activeFilter
    )();
  }

  bool get _toggleAllChecked => state.todoValues.every((todoValue) => todoValue.isCompleted);

  void _handleInputKeyDown(react.SyntheticKeyboardEvent event) {
    if (event.keyCode == KeyCode.ENTER && event.target.value.isNotEmpty) {
      var newValues = new List<TodoValue>.from(state.todoValues)
        ..add(new TodoValue(event.target.value, false));

      setState(newState()
        ..todoValues = newValues
        ..toggleAllChecked = false, () {
        event.target.value = '';
      });
    }
  }

  void _handleTodoValueChange(int index) {
    var newTodoValues = new List<TodoValue>.from(state.todoValues);

    newTodoValues[index].isCompleted = !newTodoValues[index].isCompleted;

    setState(newState()
      ..todoValues = newTodoValues
    );
  }

  void _handleToggleAll(react.SyntheticFormEvent event) {
    var newTodoValues = new List<TodoValue>.from(state.todoValues);

    newTodoValues.forEach((todoValue) {
      todoValue.isCompleted = event.target.checked;
    });

    setState(newState()
      ..todoValues = newTodoValues
    );
  }

  void _handleOnItemDestroy(int index) {
    var newTodoValues = new List<TodoValue>.from(state.todoValues);

    newTodoValues.removeAt(index);

    setState(newState()
      ..todoValues = newTodoValues
    );
  }

  void _handleClearCompletedClick(_) {
    var newTodoValues = new List<TodoValue>.from(state.todoValues);

    newTodoValues.removeWhere((todoValue) => todoValue.isCompleted);

    setState(newState()
      ..todoValues = newTodoValues
    );
  }

  void _handleFilterUpdate(Filter filter) {
    setState(newState()
      ..activeFilter = filter
    );
  }
}

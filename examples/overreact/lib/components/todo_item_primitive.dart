import 'dart:html';

import 'package:over_react/over_react.dart';
import 'package:react/react.dart' as react;
import 'package:react/react_client.dart';

import './common.dart';
import './shared_todo_item_props.dart';

@Factory()
UiFactory<TodoItemPrimitiveProps> TodoItemPrimitive;

@Props()
class TodoItemPrimitiveProps extends SharedTodoItemProps {
  TodoValue value;

  bool isEditing;

  MouseEventCallback onContentDoubleClick;

  KeyboardEventCallback onInputKeyDown;

  FocusEventCallback onInputBlur;
}

@Component()
class TodoItemPrimitiveComponent extends UiComponent<TodoItemPrimitiveProps> {
  InputElement _editRef;

  @override
  Map getDefaultProps() => (newProps()
    ..isCompleted = false
    ..isEditing = false
  );

  @override
  render() {
    var classes = forwardingClassNameBuilder()
      ..add('completed', props.isCompleted)
      ..add('editing', props.isEditing);

    return (Dom.li()
      ..addProps(copyUnconsumedDomProps())
      ..className = classes.toClassName()
    )(
      (Dom.div()..className = 'view')(
        _renderCheckbox(),
        _renderContent(),
        _renderDestroyButton()
      ),
      _renderInput()
    );
  }

  ReactElement _renderCheckbox() {
    return (Dom.input()
      ..type = 'checkbox'
      ..className = 'toggle'
      ..checked = props.isCompleted
      ..onChange = props.onCheckboxChange
    )();
  }

  ReactElement _renderContent() {
    return (Dom.label()
      ..className = 'todo-content'
      ..onDoubleClick = props.onContentDoubleClick
    )(props.value.displayValue);
  }

  ReactElement _renderDestroyButton() {
    return (Dom.button()
      ..className = 'destroy'
      ..onClick = _handleDestroyButtonClick
    )();
  }

  ReactElement _renderInput() {
    if (!props.isEditing) return null;

    var classes = new ClassNameBuilder()
      ..add('edit')
      ..add('editing');

    return (Dom.input()
      ..className = classes.toClassName()
      ..defaultValue = props.value.displayValue
      ..type = 'text'
      ..onKeyDown = props.onInputKeyDown
      ..onBlur = props.onInputBlur
      ..ref = (ref) { _editRef = ref; }
    )();
  }

  void _handleDestroyButtonClick(react.SyntheticMouseEvent event) {
    if (props.onItemDestroy != null) {
      props.onItemDestroy();
    }
  }

  // --------------------------------------------------------------------------
  // Public API Methods
  // --------------------------------------------------------------------------

  InputElement getEditDomNode() => _editRef;
}

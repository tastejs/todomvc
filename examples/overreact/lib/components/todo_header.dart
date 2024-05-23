import 'package:over_react/over_react.dart';
import 'package:react/react_client.dart';

@Factory()
UiFactory<TodoHeaderProps> TodoHeader;

@Props()
class TodoHeaderProps extends UiProps {
  KeyboardEventCallback onInputKeyDown;
}

@Component()
class TodoHeaderComponent extends UiComponent<TodoHeaderProps> {
  @override
  render() {
    var classes = forwardingClassNameBuilder()
      ..add('header');

    return (Dom.header()
      ..addProps(copyUnconsumedDomProps())
      ..className = classes.toClassName()
    )(
      Dom.h1()('todos'),
      _renderInput()
    );
  }

  ReactElement _renderInput() {
    return (Dom.input()
      ..className = 'new-todo'
      ..type = 'input'
      ..placeholder = 'What needs to be done?'
      ..autoFocus = true
      ..autoComplete = false
      ..onKeyDown = props.onInputKeyDown
    )();
  }
}

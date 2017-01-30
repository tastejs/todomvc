import 'package:over_react/over_react.dart';

@Factory()
UiFactory<TodoListProps> TodoList;

@Props()
class TodoListProps extends UiProps {}

@Component()
class TodoListComponent extends UiComponent<TodoListProps> {
  @override
  render() {
    var classes = forwardingClassNameBuilder()
      ..add('todo-list');

    return (Dom.ul()
      ..addProps(copyUnconsumedDomProps())
      ..className = classes.toClassName()
    )(props.children);
  }
}

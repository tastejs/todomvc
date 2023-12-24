import 'package:over_react/over_react.dart';

@AbstractProps()
class SharedTodoItemProps extends UiProps {
  FormEventCallback onCheckboxChange;

  Callback onItemDestroy;

  bool isCompleted;
}

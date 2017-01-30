import 'package:over_react/over_react.dart';
import 'package:react/react_client.dart';

import './common.dart';

@Factory()
UiFactory<TodoFooterProps> TodoFooter;

@Props()
class TodoFooterProps extends UiProps {
  int uncompletedCount;

  Filter activeFilter;

  MouseEventCallback onClearCompletedClick;

  FilterCallback onFilterUpdate;
}

@Component()
class TodoFooterComponent extends UiComponent<TodoFooterProps> {
  @override
  Map getDefaultProps() => (newProps()
    ..uncompletedCount = 0
    ..activeFilter = Filter.all
  );

  @override
  render() {
    var classes = forwardingClassNameBuilder()
      ..add('footer');

    var countMessage = '${props.uncompletedCount}';

    if (props.uncompletedCount == 1) {
      countMessage += ' item left';
    } else {
      countMessage += ' items left';
    }

    return (Dom.footer()
      ..addProps(copyUnconsumedDomProps())
      ..className = classes.toClassName()
    )(
      (Dom.span()..className = 'todo-count')(countMessage),
      _renderFilters(),
      _renderClearCompletedButton(),
      (Dom.button()..className = 'clear-completed')()
    );
  }

  ReactElement _renderFilters() {
    return (Dom.ul()
      ..className = 'filters'
    )(
      Dom.li()(
        (Dom.a()
          ..className = props.activeFilter == Filter.all ? 'selected' : ''
          ..onClick = (_) {
            props.onFilterUpdate(Filter.all);
          }
        )('All')
      ),
      Dom.li()(
        (Dom.a()
          ..className = props.activeFilter == Filter.active ? 'selected' : ''
          ..onClick = (_) {
            props.onFilterUpdate(Filter.active);
          }
        )('Active')
      ),
      Dom.li()(
        (Dom.a()
          ..className = props.activeFilter == Filter.completed ? 'selected' : ''
          ..onClick = (_) {
            props.onFilterUpdate(Filter.completed);
          }
        )('Completed')
      )
    );
  }

  ReactElement _renderClearCompletedButton() {
    return (Dom.button()
      ..className = 'clear-completed'
      ..onClick = props.onClearCompletedClick
    )('Clear completed');
  }
}

/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */

/// <reference path="../typings/react/react-global.d.ts" />
/// <reference path="./interfaces.d.ts"/>

namespace app.components {

  export class TodoFooter extends React.Component<ITodoFooterProps, {}> {

    public render() {
      var activeTodoWord = app.miscelanious.Utils.pluralize(this.props.count, 'item');
      var clearButton = null;

      if (this.props.completedCount > 0) {
        clearButton = (
          <button
            className="clear-completed"
            onClick={this.props.onClearCompleted}>
            Clear completed
          </button>
        );
      }

      // React idiom for shortcutting to `classSet` since it'll be used often
      var cx = React.addons.classSet;
      var nowShowing = this.props.nowShowing;
      return (
        <footer className="footer">
          <span className="todo-count">
            <strong>{this.props.count}</strong> {activeTodoWord} left
          </span>
          <ul className="filters">
            <li>
              <a
                href="#/"
                className={cx({selected: nowShowing === app.constants.ALL_TODOS})}>
                  All
              </a>
            </li>
            {' '}
            <li>
              <a
                href="#/active"
                className={cx({selected: nowShowing === app.constants.ACTIVE_TODOS})}>
                  Active
              </a>
            </li>
            {' '}
            <li>
              <a
                href="#/completed"
                className={cx({selected: nowShowing === app.constants.COMPLETED_TODOS})}>
                  Completed
              </a>
            </li>
          </ul>
          {clearButton}
        </footer>
      );
    }
  }

}

import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions/todos'

class App extends Component {
  renderApp() {
    const { todos, actions } = this.props
    return(
      <div className="todoapp">
        <Header addTodo={actions.addTodo} />
        <MainSection todos={todos} actions={actions} />
      </div>
    )
  }
  renderStatus() {
    const { authorizations, persistencies } = this.props
    if(authorizations.isAuthorized) {
      const onSave = (<a onClick={this.props.actions.saveTodos}>Save</a>)
      const isSaving = (persistencies.inFlight ? 'Saving...' : onSave)

      return(<span className="info">{isSaving}</span>)
    } else {
      const onAuthrorize = (<a onClick={this.props.actions.authorizeApp}>Authorize</a>)
      const isAuthorized = (authorizations.inFlight ? 'Authorizing...' : (authorizations.isAuthorized ? 'Authrorized' : onAuthrorize))

      return(<span className="info">{isAuthorized}</span>)
    }
  }
  render() {
    return(
      <div> {this.renderApp()} {this.renderStatus()} </div>
    )
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  authorizations: PropTypes.object.isRequired,
  persistencies: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    todos: state.todos, authorizations: state.authorizations, persistencies: state.persistencies
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

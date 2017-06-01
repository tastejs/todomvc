import { combineReducers } from 'redux'

import authorizations from './authorizations'
import persistencies from './persistencies'
import todos from './todos'

const rootReducer = combineReducers({
  authorizations, persistencies, todos
})

export default rootReducer

import { combineReducers } from 'redux';

import test from './test';
import globals from './globals';

export default combineReducers({
  test: test,
  globals: globals
});

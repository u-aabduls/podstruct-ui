import { combineReducers } from 'redux';

import settingsReducer from './settings.reducer.js';
import themesReducer from './themes.reducers.js';
import loaderReducer from './loader.reducer.js';

export default combineReducers({
    settings: settingsReducer,
    theme: themesReducer,
    loader: loaderReducer
});

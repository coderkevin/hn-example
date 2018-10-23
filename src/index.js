import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import createStore from './store';
import reducer from './store/reducer';
import * as serviceWorker from './serviceWorker';

const store = createStore( reducer );

ReactDOM.render( <App store={ store } />, document.getElementById( 'root' ) );

serviceWorker.register();

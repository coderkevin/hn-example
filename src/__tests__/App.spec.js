import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

it( 'renders without crashing', () => {
	const div = document.createElement( 'div' );
	const store = { getState: jest.fn(), dispatch: jest.fn(), subscribe: jest.fn () };
	ReactDOM.render( <App store={ store } />, div);
	ReactDOM.unmountComponentAtNode( div );
} );

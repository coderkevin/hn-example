import { createStore } from 'redux';

export default ( reducer ) => {
	if ( 'development' === process.env.NODE_ENV && window.__REDUX_DEVTOOLS_EXTENSION__ ) {
		const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__();
		return createStore( reducer, undefined, enhancer );
	}

	return createStore( reducer );
}

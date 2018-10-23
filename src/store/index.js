import { createStore } from 'redux';

export default ( reducer ) => {
	let enhancer = null;

	if ( 'development' === process.env.NODE_ENV && window.__REDUX_DEVTOOLS_EXTENSION__ ) {
		enhancer = window.__REDUX_DEVTOOLS_EXTENSION__();
	}

	// TODO: Preload state from offline data?
	return createStore(
		reducer,
		{},
		enhancer
	);
}

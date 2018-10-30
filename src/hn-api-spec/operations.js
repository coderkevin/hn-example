import {
	getResourceIdentifier,
	isResourcePrefix
} from './utils';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

function readNewStories( resourceNames, fetch ) {
	if ( -1 < resourceNames.indexOf( 'newstories' ) ) {
		const url = BASE_URL + 'newstories.json';
		const promise = fetch( url ).then( ( response ) => {
			return response.json().then( ( data ) => {
				return { 'newstories': { data } };
			} );
		} ).catch( ( error ) => {
			// TODO: Error handling.
			console.error( 'error in newstories fetch: ', error );
			return { error };
		} );
		return [ promise ];
	}
	return [];
}

function readItems( resourceNames, fetch ) {
	const filteredNames = resourceNames.filter( ( name ) => isResourcePrefix( name, 'item' ) );
	return filteredNames.map( ( name ) => readItem( name, fetch ) );
}

function readItem( resourceName, fetch ) {
	const id = getResourceIdentifier( resourceName );
	const url = `${ BASE_URL }item/${ id }.json`;

	return fetch( url ).then( ( response ) => {
		return response.json().then( ( data ) => {
			return { [ resourceName ]: { data } };
		} );
	} ).catch( ( error ) => {
		// TODO: Error handling.
		console.error( 'error in item fetch: ', error );
		return { error };
	} );
}

export function createOperations( fetch ) {
	return {
		read( resourceNames ) {
			return [
				...readNewStories( resourceNames, fetch ),
				...readItems( resourceNames, fetch ),
			];
		},
	};
};

export default createOperations( window.fetch );
import {
	getResourceIdentifier,
	isResourcePrefix
} from './utils';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

export function createApiSpec( fetch = window.fetch ) {
	return {
		operations: {
			read( resourceNames ) {
				return [
					...readNewStories( resourceNames, fetch ),
					...readItems( resourceNames, fetch ),
				];
			}
		},
		selectors: {
		},
	};
}

function readNewStories( resourceNames, fetch ) {
	if ( -1 < resourceNames.indexOf( 'newstories' ) ) {
		const url = BASE_URL + 'newstories.json';
		const promise = fetch( url ).then( ( response ) => {
			return { 'newstories': response.json() };
		} ).catch( ( error ) => {
			// TODO: Error handling.
			console.error( 'error in newstories fetch: ', error );
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
		return { [ resourceName ]: response.json() };
	} ).catch( ( error ) => {
		// TODO: Error handling.
		console.error( 'error in item fetch: ', error );
	} );
}

export default createApiSpec();

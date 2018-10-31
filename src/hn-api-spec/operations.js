import debugFactory from 'debug';
import {
	getResourceIdentifier,
	isResourcePrefix
} from './utils';
import persistOperation from './persist-operation';

const debug = debugFactory( 'hn-example:hn-api:operations' );
const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

function readNewStories( resourceNames, fetch ) {
	if ( -1 < resourceNames.indexOf( 'newstories' ) ) {
		const url = BASE_URL + 'newstories.json';
		const promise = fetch( url ).then( ( response ) => {
			return response.json().then( ( data ) => {
				return { 'newstories': { data } };
			} );
		} ).catch( ( error ) => {
			debug( 'error in newstories fetch: ', error );
			// TODO: Application error handling?
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
		debug( 'error in item fetch: ', error );
		// TODO: Application error handling?
		return { error };
	} );
}

export function createOperations( fetch, withPersistence ) {
	const operations = {
		read: ( resourceNames ) => {
			return [
				...readNewStories( resourceNames, fetch ),
				...readItems( resourceNames, fetch ),
			];
		},
	};

	if ( withPersistence ) {
		operations.read = persistOperation( operations.read );
	}

	return operations;
};

export default createOperations( window.fetch, true );

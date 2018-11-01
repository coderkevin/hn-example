import debugFactory from 'debug';
import localforage from 'localforage';

const debug = debugFactory( 'hn-example:persist' );

/**
 * Number of days stories to keep in cache
 */
const DAYS_RETENTION = 2;

/**
 * Calculated date: DAYS_RETENTION before now.
 */
const EXPIRATION_DATE = new Date( Date.now() - ( DAYS_RETENTION * 24 * 60 * 60 * 1000 ) );

// Average story data is 275 utf-8 chars
// Average stories are 750 per day for DAYS_RETENTION days
// Both values padded x2 to ensure we don't run out of space
const CACHE_SIZE = ( 275 * 2 ) * ( 750 * DAYS_RETENTION * 2 );

function createDefault() {
	localforage.config = {
		name: 'HNExampleApiData',
		driver: localforage.WEBSQL,
		version: 0.1,
		size: CACHE_SIZE,
		storeName: 'hn_example_api_data',
		description: 'HN Example App: API Data for offline'
	};

	cleanExpired( localforage, EXPIRATION_DATE );

	return localforage;
}

function persistOperation( operation, forage = createDefault() ) {
	const fetchedResourceKeys = new Set();

	return function combinedOperation( resourceNames ) {
		const cachedOperations = resourceNames.map( ( resourceName ) => {
			return forage.getItem( resourceName ).then( ( resource ) => {
				if ( null !== resource && ! fetchedResourceKeys.has( resourceName ) ) {
					debug( 'Loaded [' + resourceName + '] from cache:', resource );
					return { [ resourceName ]: resource };
				}
				return {};
			} ).catch( ( error ) => {
				debug( `localforage.getItem error for [${ resourceName }]:`, error );
				return {};
			});
		} );

		const fetchOperations = operation( resourceNames );
		const loggedFetchOperations = fetchOperations.map( ( promise ) => {
			return Promise.resolve( promise ).then( ( resources ) => {
				Object.keys( resources ).forEach( ( resourceName ) => {
					fetchedResourceKeys.add( resourceName );
					const now = new Date();
					const resource = { ...resources[ resourceName ], lastModified: now };
					forage.setItem( resourceName, resource ).catch( ( error ) => {
						debug( `localforage.setItem error for [${ resourceName }]:`, error );
					} );
				} );
				return resources;
			} );
		} );

		return [
			...cachedOperations,
			...loggedFetchOperations,
		];
	}
}

export function cleanExpired( forage, expirationDate ) {
	debug( `Cleaning expired resources (older than ${ expirationDate })` );

	return forage.keys().then( ( resourceNames ) => {
		const totalCount = resourceNames.length;
		let removedCount = 0;

		return Promise.all( resourceNames.map( ( resourceName ) => {
			return cleanResourceIfExpired( forage, resourceName, expirationDate ).then(
				( cleaned ) => {
					if ( cleaned ) {
						removedCount++;
					}
				}
			);
		} ) ).then( () => {
			debug( `${ removedCount } out of ${ totalCount } cached resources cleaned` );
		} );
	} ).catch( ( error ) => {
		debug( 'localforage.keys error:', error );
	} );
}

function cleanResourceIfExpired( forage, resourceName, expirationDate ) {
	return forage.getItem( resourceName ).then( ( resource ) => {
		const resourceDate = resource && resource.lastModified;
		const isExpired = ! resourceDate || ( resourceDate < expirationDate );
		if ( isExpired ) {
			return forage.removeItem( resourceName ).then( () => {
				return true;
			}).catch( ( error ) => {
				debug( `localforage.removeItem error for [${ resourceName }]:`, error );
			} );
		}
		return false;
	} ).catch( ( error ) => {
		debug( `localforage.getItem error for [${ resourceName }]:`, error );
	} );
}

export default persistOperation;

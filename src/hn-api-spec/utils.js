/**
 * Calculates a resource name string
 * @param {string} prefix The prefix for the name (e.g. post, article, user)
 * @param {any} identifier Any JSON serializable identifier (e.g. numeric id, json query)
 * @return {string} The combined resource name in `prefix:identifier` format
 */
export function getResourceName( prefix, identifier ) {
	const identifierString = JSON.stringify( identifier, Object.keys( identifier ).sort() );
	return `${ prefix }:${ identifierString }`;
}

/**
 * Checks if a resource has a matching prefix
 * @param {string} resourceName The resource name to check
 * @param {string} prefix The prefix for which to check
 * @return {boolean} True if the resource name has a matching prefix
 */
export function isResourcePrefix( resourceName, prefix ) {
	const resourcePrefix = resourceName.substring( 0, resourceName.indexOf( ':' ) );
	return resourcePrefix === prefix;
}

/**
 * Extracts the identifier from a prefixed resource name
 * @param {string} resourceName in the format of `prefix:identifier`
 * @return {any} The resulting parsed JSON from the identifier (can be string, number, or object)
 */
export function getResourceIdentifier( resourceName ) {
	const identifierString = resourceName.substring( resourceName.indexOf( ':' ) + 1 );
	return JSON.parse( identifierString );
}

import debugFactory from 'debug';

/*
 * Service Worker for offline access.
 */

const debug = debugFactory( 'hn-example:service-worker' );

const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
	// [::1] is the IPv6 localhost address.
	window.location.hostname === '[::1]' ||
	// 127.0.0.1/8 is considered localhost for IPv4.
	window.location.hostname.match(
	/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
	)
);

function registerValidSW( swUrl, config ) {
	debug( 'Registering service worker...' );
	navigator.serviceWorker.register( swUrl ).then( ( registration ) => {
		registration.onupdatefound = () => {
			const installingWorker = registration.installing;
			installingWorker.onstatechange = () => {
				if ( 'installed' === installingWorker.state ) {
					if ( navigator.serviceWorker.controller ) {
						debug(
							'New content is available and will be used ' +
							'after all tabs for this page are closed.'
						);

						if ( config && config.onUpdate ) {
							config.onUpdate( registration );
						}
					} else {
						debug( 'Content is cached for offline use.' );

						if ( config && config.onSuccess ) {
							config.onSuccess( registration );
						}
					}
				}
			};
		};
	} )
	.catch( ( error ) => {
		debug( 'Registration error: ', error );
	} );
}

function checkValidServiceWorker( swUrl, config ) {
	fetch( swUrl ).then( ( response ) => {
		const notFound = 404 === response.status;
		const isJS = -1 < response.headers.get( 'content-type' ).indexOf( 'javascript' );

		if ( notFound || ! isJS ) {
			debug( 'No service worker found. Trying a reload of the page.' );
			navigator.serviceWorker.ready.then( ( registration ) => {
				registration.unregister().then( () => {
					window.location.reload();
				} );
			} );
			return;
		}

		// Service worker found.
		registerValidSW( swUrl, config );
	} )
	.catch( () => {
		debug( 'No internet connection found. App is running in offline mode.' );
	} );
}

export function register( config ) {
	if ( 'development' === process.env.NODE_ENV ) {
		debug( 'Development mode: service worker disabled.' );
		return;
	}

	if ( 'production' === process.env.NODE_ENV && 'serviceWorker' in navigator ) {
		const publicUrl = new URL( process.env.PUBLIC_URL, window.location );
		if ( publicUrl.origin !== window.location.origin ) {
			debug( 'Application is served cross-origin, aborting register of service worker.')
			return;
		}

		window.addEventListener( 'load', () => {
			const swUrl = `${ process.env.PUBLIC_URL }/service-worker.js`;

			if ( isLocalhost ) {
				checkValidServiceWorker( swUrl, config );

				navigator.serviceWorker.ready.then( () => {
					debug( 'Service worker ready' );
				} );
			} else {
				registerValidSW( swUrl, config );
			}
		} );
	}
}

export function unregister() {
	if ( 'serviceWorker' in navigator ) {
		debug( 'Unregistering service worker' );
		navigator.serviceWorker.ready.then( ( registration ) => {
			registration.unregister();
		} );
	}
}

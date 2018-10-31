import persistOperation, { cleanExpired } from '../persist-operation';

describe( 'persist-operation', () => {
	const now = Date.now();
	const expirationDate = new Date( now - ( 24 * 60 * 60 * 1000 ) );

	let forageItems;
	let mockForage;

	beforeEach( () => {
		forageItems = {
			resource1: { data: 'one', lastModified: new Date( now - ( 12 * 60 * 60 * 1000 ) ) },
			resource2: { data: 'two', lastModified: new Date( now - ( 36 * 60 * 60 * 1000 ) ) },
		};

		mockForage = {
			keys: jest.fn(),
			getItem: jest.fn(),
			setItem: jest.fn(),
			removeItem: jest.fn(),
		};

		mockForage.keys.mockImplementation( () => {
			return Promise.resolve().then( () => Object.keys( forageItems ) );
		} );

		mockForage.getItem.mockImplementation( ( key ) => {
			return Promise.resolve().then( () => forageItems[ key ] );
		} );

		mockForage.setItem.mockImplementation( ( key, value ) => {
			return Promise.resolve().then( () => forageItems[ key ] = value );
		} );

		mockForage.removeItem.mockImplementation( ( key ) => {
			return Promise.resolve().then( () => {
				forageItems[ key ] = undefined;
			} );
		} );
	} );

	describe( 'persistOperation', () => {
		// TODO: Add negative tests.
		let operation;

		beforeEach( () => {
			operation = jest.fn();
			operation.mockImplementation( ( resourceNames ) => {
				return [
					{ resource1: { data: '1' } },
					{ resource4: { data: '4' } },
				];
			} );
		} );

		it( 'gets previously cached resources', () => {
			expect.assertions( 2 );

			const persistedOperation = persistOperation( operation, mockForage );
			return Promise.all( persistedOperation( [ 'resource1', 'resource4' ] ) ).then( () => {
				expect( operation ).toHaveBeenCalledTimes( 1 );
				expect( mockForage.getItem ).toHaveBeenCalledTimes( 2 );
			} );
		} );

		it( 'caches results of an operation', () => {
			expect.assertions( 4 );

			const persistedOperation = persistOperation( operation, mockForage );
			return Promise.all( persistedOperation( [ 'resource1', 'resource4' ] ) ).then( () => {
				expect( operation ).toHaveBeenCalledTimes( 1 );
				expect( mockForage.setItem ).toHaveBeenCalledTimes( 2 );
				expect( forageItems.resource1.data ).toEqual( '1' );
				expect( forageItems.resource4.data ).toEqual( '4' );
			} );
		} );
	} );

	describe( 'cleanExpired', () => {
		it( 'expires items properly', () => {
			expect.assertions( 4 );
			const { resource1 } = forageItems;

			return cleanExpired( mockForage, expirationDate ).then( () => {
				expect( mockForage.getItem ).toHaveBeenCalledTimes( 2 );
				expect( mockForage.removeItem ).toHaveBeenCalledTimes( 1 );
				expect( forageItems.resource1 ).toEqual( resource1 );
				expect( forageItems.resource2 ).toBeUndefined();
			} );
		} );
	} );
} );

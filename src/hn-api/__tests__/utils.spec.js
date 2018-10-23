import {
	getResourceIdentifier,
	getResourceName,
	isResourcePrefix,
} from '../utils';

describe( 'utils', () => {
	describe( 'getResourceName', () => {
		it( 'takes a string identifier', () => {
			expect( getResourceName( 'prefix', 'stringId' ) ).toEqual( 'prefix:"stringId"' );
		} );

		it( 'takes a numeric identifier', () => {
			expect( getResourceName( 'prefix', 42 ) ).toEqual( 'prefix:42' );
			expect( getResourceName( 'prefix', 33.3 ) ).toEqual( 'prefix:33.3' );
		} );

		it( 'takes an object identifier and sorts fields alphabetically', () => {
			const query = { search: 'abc', page: 1, per_page: 20 };
			expect(
				getResourceName( 'prefix', query )
			).toEqual( 'prefix:{"page":1,"per_page":20,"search":"abc"}' );
		} );
	} );

	describe( 'getResourceIdentifier', () => {
		it( 'returns a string identifier', () => {
			expect( getResourceIdentifier( 'pfx:"name"') ).toEqual( 'name' );
		} );
		it( 'returns a numeric identifier', () => {
			expect( getResourceIdentifier( 'pfx:12') ).toEqual( 12 );
		} );
		it( 'returns an object identifier', () => {
			const query = { search: 'test', page: 4, per_page: 100 };
			expect( getResourceIdentifier( 'pfx:{"page":4,"per_page":100,"search":"test"}') ).toEqual( query );
		} );
	} );

	describe( 'isResourcePrefix', () => {
		it( 'validates a matching prefix', () => {
			expect( isResourcePrefix( 'pre:123', 'pre' ) ).toBeTruthy();
		} );
		it( 'invalidates a non-matching prefix', () => {
			expect( isResourcePrefix( 'abc:123', 'pre' ) ).toBeFalsy();
		} );
		it( 'invalidates only a prefix without an identifier', () => {
			expect( isResourcePrefix( 'pre', 'pre' ) ).toBeFalsy();
		} );
		it( 'handles a missing prefix', () => {
			expect( isResourcePrefix( 'defg', 'pre' ) ).toBeFalsy();
		} );
		it( 'handles an empty string', () => {
			expect( isResourcePrefix( '', 'pre' ) ).toBeFalsy();
		} );
	} );
} );

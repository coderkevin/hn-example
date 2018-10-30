import { createApiSpec } from '../index';

describe( 'createApiSpec', () => {
	let apiSpec;

	beforeEach( () => {
		apiSpec = createApiSpec();
	} );

	it( 'should provide a read operation', () => {
		expect( apiSpec.operations ).toBeInstanceOf( Object );
		expect( apiSpec.operations.read ).toBeInstanceOf( Function );
	} );

	it( 'should provide selectors', () => {
		expect( apiSpec.selectors.getItem ).toBeInstanceOf( Function );
		expect( apiSpec.selectors.getNewStoryIds ).toBeInstanceOf( Function );
	} );
} );

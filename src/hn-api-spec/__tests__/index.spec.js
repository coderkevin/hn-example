import { createApiSpec } from '../index';

describe( 'createApiSpec', () => {
	let mockFetch;
	let apiSpec;

	beforeEach( () => {
		mockFetch = jest.fn();
		apiSpec = createApiSpec( mockFetch );
	} );

	it( 'should provide a read operation', () => {
		expect( apiSpec.operations ).toBeInstanceOf( Object );
		expect( apiSpec.operations.read ).toBeInstanceOf( Function );
	} );

	it( 'should provide selectors', () => {
		expect( apiSpec.selectors.getItem ).toBeInstanceOf( Function );
		expect( apiSpec.selectors.getNewStoryIds ).toBeInstanceOf( Function );
	} );

	describe( 'operations.read', () => {
		const base_url = 'https://hacker-news.firebaseio.com/v0/';

		it( 'should not fetch an empty list', () => {
			Promise.all(
				apiSpec.operations.read( [] ),
			).then( () => {
				expect( mockFetch ).not.toHaveBeenCalled();
			} );
		} );

		it( 'should read newstories', () => {
			expect.assertions( 3 );
			const response = [ 1, 2, 3, 4, 5 ];

			mockFetch.mockReturnValueOnce( Promise.resolve().then( () => {
				return { json: () => response };
			} ) );

			return Promise.all(
				apiSpec.operations.read( [ 'newstories' ] )
			).then( ( responses ) => {
				expect( mockFetch ).toHaveBeenCalledTimes( 1 );
				expect( mockFetch ).toHaveBeenCalledWith( base_url + 'newstories.json' );
				expect( responses ).toEqual( [ { 'newstories': response } ] );
			} );
		} );

		it( 'should read items by id', () => {
			expect.assertions( 4 );

			const now = new Date();

			const response1 = {
				by: "authorname1",
				descendants: 0,
				id: 12345,
				score: 1,
				time: now.getTime() - 4000,
				title: "Story 1 title",
				type: "story",
				url: "http://example.com/example-story-1",
			};
			mockFetch.mockReturnValueOnce( Promise.resolve().then( () => {
				return { json: () => response1 };
			} ) );

			const response2 = {
				by: "authorname2",
				descendants: 0,
				id: 12356,
				score: 1,
				time: now.getTime() - 2000,
				title: "Story 2 title",
				type: "story",
				url: "http://example.com/example-story-2",
			};
			mockFetch.mockReturnValueOnce( Promise.resolve().then( () => {
				return { json: () => response2 };
			} ) );

			return Promise.all(
				apiSpec.operations.read( [ 'item:12345', 'item:12356' ] )
			).then( ( responses ) => {
				expect( mockFetch ).toHaveBeenCalledTimes( 2 );
				expect( mockFetch ).toHaveBeenCalledWith( base_url + 'item/12345.json' );
				expect( mockFetch ).toHaveBeenCalledWith( base_url + 'item/12356.json' );
				expect( responses ).toEqual( [
					{ 'item:12345': response1 },
					{ 'item:12356': response2 },
				] );
			} );
		} );
	} );
} );

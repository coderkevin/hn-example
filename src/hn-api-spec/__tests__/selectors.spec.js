import {
	getNewStoryIds, getItem,
} from '../selectors';

describe( 'selectors', () => {
	let getResource;
	let requireResource;

	beforeEach( () => {
		getResource = jest.fn();
		requireResource = jest.fn();
	} );

	describe( 'getNewStoryIds', () => {
		it( 'requires the newstories resource', () => {
			const requirement = {};
			getNewStoryIds( getResource, requireResource )( requirement );

			expect( getResource ).not.toHaveBeenCalled();
			expect( requireResource ).toHaveBeenCalledTimes( 1 );
			expect( requireResource ).toHaveBeenCalledWith( requirement, 'newstories' );
		} );

		it( 'returns the result of newstories', () => {
			const requirement = {};
			const ids = [ 4, 3, 2, 1 ];

			requireResource.mockReturnValueOnce( ids );
			const result = getNewStoryIds( getResource, requireResource )( requirement );
			expect( result ).toBe( ids );
		} );
	} );

	describe( 'getItem', () => {
		it( 'requires the item resource', () => {
			const requirement = {};
			const id = 5575;

			getItem( getResource, requireResource )( id, requirement );

			expect( getResource ).not.toHaveBeenCalled();
			expect( requireResource ).toHaveBeenCalledTimes( 1 );
			expect( requireResource ).toHaveBeenCalledWith( requirement, 'item:5575' );
		} );

		it( 'returns the result of the item', () => {
			const requirement = {};
			const now = new Date();
			const item1 = {
				by: "authorname1",
				descendants: 0,
				id: 12345,
				score: 1,
				time: now.getTime() - 4000,
				title: "Story 1 title",
				type: "story",
				url: "http://example.com/example-story-1",
			};

			requireResource.mockReturnValueOnce( item1 );
			const result = getItem( getResource, requireResource )( 12345, requirement );
			expect( result ).toBe( item1 );
		} );
	} );
} );

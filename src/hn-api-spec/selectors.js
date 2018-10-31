import { MINUTE, SECOND } from '@fresh-data/framework';
import { getResourceName } from './utils';

const DEFAULT_REQ = { timeout: 60 * SECOND, freshness: 30 * MINUTE };
const NEW_STORIES_REQ = { ...DEFAULT_REQ, freshness: 5 * MINUTE };

export const getNewStoryIds =
	( getResource, requireResource ) =>
	( requirement = NEW_STORIES_REQ ) =>
{
	return requireResource( requirement, 'newstories' ).data;
}

export const getItem =
	( getResource, requireResource ) =>
	( id, requirement = DEFAULT_REQ ) =>
{
	return requireResource( requirement, getResourceName( 'item', id ) ).data;
}

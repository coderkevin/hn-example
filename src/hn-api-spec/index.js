import * as selectors from './selectors';
import operations from './operations';

export function createApiSpec() {
	return {
		operations,
		selectors,
	};
}

export default createApiSpec();

import React from 'react';
import { ViewportChild } from './viewport';

function HNStory( { id } ) {
	return (
		<ViewportChild>
			{ ( { visible } ) => (
				<li>
					<h3>{ id }</h3>
				</li>
			) }
		</ViewportChild>
	);
}

export default HNStory;

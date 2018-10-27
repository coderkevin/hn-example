import React from 'react';
import PropTypes from 'prop-types';
import { withApiClient } from '@fresh-data/react-provider';
import Viewport, { ViewportChild } from './viewport';
import HNStory from './hn-story';

function Stories( { storyIds, start, end, onMore } ) {
	const stories = storyIds.slice( start, end ).map( ( id ) => {
		return (
			<HNStory key={ id } id={ id } />
		);
	} );

	const more = end < storyIds.length ? <More key="more" onMore={ onMore } /> : null;

	return [ ...stories, more ];
}

// TODO: Fix known issue of when this component is visible from the initial render,
//       the callback doesn't get called because it's already visible.
function More( { onMore } ) {
	return (
		<ViewportChild>
			{ ( { onVisible } ) => {
				onVisible( onMore );
				return <li>Loading more...</li>
			} }
		</ViewportChild>
	);
}

class HNNewStories extends React.Component {
	static propTypes = {
		initialLength: PropTypes.number,
		step: PropTypes.number,
	}

	static defaultProps = {
		initialLength: 10,
		step: 10,
	}

	constructor( props ) {
		super( ...arguments );
		this.state = { start: 0, end: props.initialLength };
	}

	onMore = () => {
		this.setState( ( state ) => {
			return { end: state.end + this.props.step };
		} );
	}

	renderLoading() {
		return (
			<Viewport className="App-body">
				<ul>
					<li><h3>Loading...</h3></li>
				</ul>
			</Viewport>
		);
	}

	render() {
		const { storyIds } = this.props;

		if ( ! storyIds ) {
			return this.renderLoading();
		}

		return (
			<Viewport className="App-body">
				<ul>
					<Stories
						storyIds={ storyIds }
						start={ this.state.start }
						end={ this.state.end }
						onMore={ this.onMore }
					/>
				</ul>
			</Viewport>
		);
	}
}

function mapSelectorsToProps( selectors ) {
	const storyIds = selectors.getNewStoryIds();

	return {
		storyIds,
	};
}

export default withApiClient( { mapSelectorsToProps } )( HNNewStories );

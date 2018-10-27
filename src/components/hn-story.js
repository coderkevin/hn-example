import React from 'react';
import PropTypes from 'prop-types';
import { withApiClient } from '@fresh-data/react-provider';
import { ViewportChild } from './viewport';

class HNStory extends React.Component {
	static propTypes = {
		id: PropTypes.number.isRequired,
	}

	constructor() {
		super( ...arguments );
		this.state = { visible: false };
	}

	onVisible = () => {
		console.log( 'onVisible' );
		this.setState( { visible: true } );
	}

	onHidden = () => {
		console.log( 'onHidden' );
		this.setState( { visible: false } );
	}

	render() {
		const { id } = this.props;
		const { visible } = this.state;

		return (
			<ViewportChild>
				{ ( { onVisible, onHidden } ) => {
					visible ? onHidden( this.onHidden ) : onVisible( this.onVisible );

					return <StoryItem id={ id } visible={ visible } />;
				} }
			</ViewportChild>
		);
	}
}

const StoryItem = withApiClient( { mapSelectorsToProps } )(
	function StoryItem( { story, dateOptions } ) {
		if ( ! story ) {
			return (
				<li><h3>Loading story...</h3></li>
			);
		}

		console.log( 'story: ', story );
		const date = new Date( story.time * 1000 );
		const dateString = date.toLocaleDateString( undefined, dateOptions );
		const timeString = date.toLocaleTimeString();
		return (
			<li>
				<h3><a href={ story.url }>{ story.title }</a></h3>
				<p>Posted: { dateString } at { timeString } by { story.by }</p>
			</li>
		);
	}
);

StoryItem.propTypes = {
	id: PropTypes.number.isRequired,
	visible: PropTypes.bool.isRequired,
	story: PropTypes.object,
	dateOptions: PropTypes.object,
};

StoryItem.defaultProps = {
	dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
};

function mapSelectorsToProps( selectors, ownProps ) {
	if ( ! ownProps.visible ) {
		return { story: null };
	}

	return {
		story: selectors.getItem( ownProps.id ),
	};
}

export default HNStory;

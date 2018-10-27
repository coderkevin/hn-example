import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Viewport extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		style: PropTypes.object,
		children: PropTypes.node,
		useCapture: PropTypes.bool,
	};

	static defaultProps = {
		className: '',
		style: { overflow: 'auto' },
		useCapture: false,
	};

	// TODO: Use new Context API with contextType after upgrading to React 16.6
	static childContextTypes = {
		setViewportCallback: PropTypes.func,
	}

	constructor() {
		super( ...arguments );

		this.viewport = {};
		this.viewportCallbacks = new Map();
	}

	// TODO: Use new Context API with contextType after upgrading to React 16.6
	getChildContext() {
		const { setViewportCallback } = this;
		return { setViewportCallback };
	}

	componentDidMount() {
		this.node = ReactDOM.findDOMNode( this );
		this.attachScrollListener();
		this.setViewport();
	}

	componentDidUpdate() {
		this.node = ReactDOM.findDOMNode( this );
		this.attachScrollListener();
		this.setViewport();
	}

	componentWillUnmount() {
		this.viewport = {};
		this.viewportCallbacks.clear();
		this.detachScrollListener();
	}

	attachScrollListener = () => {
		const { useCapture } = this.props;
		this.node.addEventListener( 'mousewheel', this.mousewheelListener, useCapture );
		this.node.addEventListener( 'scroll', this.scrollListener, useCapture );
		window.addEventListener( 'resize', this.resizeListener, useCapture );

	}

	detachScrollListener = () => {
		const { useCapture } = this.props;
		this.node.removeEventListener( 'mousewheel', this.mousewheelListener, useCapture );
		this.node.removeEventListener( 'scroll', this.scrollListener, useCapture );
		window.removeEventListener( 'resize', this.resizeListener, useCapture );
	}

	mousewheelListener = ( e ) => {
		// Prevents Chrome hangups
		// See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
		if ( e.deltaY === 1 ) {
			e.preventDefault();
		}
	}

	resizeListener = () => {
		this.setViewport();
	}

	scrollListener = () => {
		this.setViewport();
	}

	setViewport = () => {
		this.viewport = this.node.getBoundingClientRect();
		this.notifyCallbacks();
	}

	notifyCallbacks = () => {
		this.viewportCallbacks.forEach( ( eventCallback ) => {
			eventCallback();
		} );
	}

	getComponentDistance = ( component ) => {
		const node = ReactDOM.findDOMNode( component );
		const rect = node.getBoundingClientRect();
		const distance = calculateDistance( this.viewport, rect );
		return distance;
	}

	setViewportCallback = ( component, compare, callback ) => {
		if ( callback ) {
			const onEvent = ( component, compare, callback ) => () => {
				const distance = this.getComponentDistance( component );
				if ( compare( distance ) ) {
					this.viewportCallbacks.delete( component );
					callback( distance );
				}
			};

			const eventCallback = onEvent( component, compare, callback );
			this.viewportCallbacks.set( component, eventCallback );
		} else {
			this.viewportCallbacks.delete( component );
		}
	}

	render() {
		const { className, style, children } = this.props;

		return (
			<div className={ className } style={ style }>
				{ children }
			</div>
		);
	}
}

function calculateDistance( r1, r2 ) {
	let xDistance;
	let yDistance;

	if ( r1.right < r2.left ) {
		xDistance = r2.left - r1.right;
	} else if ( r2.right < r1.left ) {
		xDistance = r1.left - r2.right;
	} else {
		xDistance = 0;
	}

	if ( r1.bottom < r2.top ) {
		yDistance = r2.top - r1.bottom;
	} else if ( r2.bottom < r1.top ) {
		yDistance = r1.top - r2.bottom;
	} else {
		yDistance = 0;
	}

	return Math.max( xDistance, yDistance );
}

export class ViewportChild extends React.Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
	};

	static contextTypes = {
		setViewportCallback: PropTypes.func,
	}

	constructor() {
		super( ...arguments );
		this.state = { visible: false };
		this.onVisibleCallback = null;
		this.onHiddenCallback = null;
	}

	componentDidMount() {
		this.setVisibleCallback();
	}

	componentWillUnmount() {
		this.context.setViewportCallback( this, null );
	}

	onVisible = ( callback ) => {
		this.onVisibleCallback = callback;
	}

	onHidden = ( callback ) => {
		this.onHiddenCallback = callback;
	}

	setVisible = () => {
		if ( ! this.state.visible ) {
			this.setState( { visible: true } );
			this.onVisibleCallback && this.onVisibleCallback();
		}
		this.setHiddenCallback();
	}

	setHidden = () => {
		if ( this.state.visible ) {
			this.setState( { visible: false } );
			this.onHiddenCallback && this.onHiddenCallback();
		}
		this.setVisibleCallback();
	}

	setVisibleCallback = () => {
		const compare = ( distance ) => ( 0 === distance );
		this.context.setViewportCallback( this, compare, this.setVisible );
	}

	setHiddenCallback = () => {
		const compare = ( distance ) => ( 0 < distance );
		this.context.setViewportCallback( this, compare, this.setHidden );
	}

	render() {
		const { visible } = this.state;
		const { onVisible, onHidden } = this;
		return this.props.children( { visible, onVisible, onHidden } );
	}
}

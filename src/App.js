import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { ApiProvider } from '@fresh-data/react-provider';
import hnApiSpec from './hn-api-spec';
import HNNewStories from './components/hn-new-stories';
import './App.css';

function App( { store } ) {
	return (
		<ReduxProvider store={ store }>
			<ApiProvider apiName="hn-api" apiSpec={ hnApiSpec }>
				<div className="App">
					<header className="App-header">
						<h1 className="App-title">Hacker News Reader</h1>
					</header>
					<HNNewStories />
					<footer className="App-footer">
						<p>created by <a href="https://github.com/coderkevin/hn-example">coderkevin</a></p>
					</footer>
				</div>
			</ApiProvider>
		</ReduxProvider>
	);
}

App.propTypes = {
	store: PropTypes.object.isRequired,
};

export default App;

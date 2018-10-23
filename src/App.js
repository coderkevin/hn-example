import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ApiProvider } from '@fresh-data/react-provider';
import hnApiSpec from './hn-api-spec';
import './App.css';

function App( { store } ) {
	return (
		<ReduxProvider store={ store }>
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Hacker News Reader</h1>
				</header>
				<div className="App-body">
					<ApiProvider apiName="hn-api" apiSpec={ hnApiSpec }>
						<ul>
							<li>
								<h3>News Article</h3>
								<p>Details about the article.</p>
							</li>
							<li>
								<h3>Another News Article</h3>
								<p>Details about the article.</p>
							</li>
							<li>
								<h3>And Another News Article</h3>
								<p>Details about the article.</p>
							</li>
							<li>
								<h3>Yet Another News Article</h3>
								<p>Details about the article.</p>
							</li>
						</ul>
					</ApiProvider>
				</div>
				<footer className="App-footer">
					<p>created by <a href="https://github.com/coderkevin/hn-example">coderkevin</a></p>
				</footer>
			</div>
		</ReduxProvider>
	);
}

export default App;

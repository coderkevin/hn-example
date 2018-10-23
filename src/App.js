import React, { Component } from 'react';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Hacker News Reader</h1>
				</header>
				<div className="App-body">
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
				</div>
				<footer className="App-footer">
					<p>created by <a href="https://github.com/coderkevin/hn-example">coderkevin</a></p>
				</footer>
			</div>
		);
	}
}

export default App;

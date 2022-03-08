import React, { Component } from 'react';

import './App.css';

// import Home from './components/Home';
import MainComponent from './components/Main';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<div>
				<MainComponent
				></MainComponent>
			</div>
		);
	}
}

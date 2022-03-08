import React from 'react';

export default class StartComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {pageKey: props.pageKey};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.pageKey !== nextProps.pageKey) {
			this.setState({pageKey:nextProps.pageKey}, () => {
			});
		}
	}

	render() {
		const {pageKey} = this.state;
		return (
			<div className={`back-board flex start ${pageKey==='start'?'active':''}`}>
				<div className='button' onClick={() => this.props.callPurposePage('custom')}>CUSTOM</div>
				<div className='button' onClick={() => this.props.callPurposePage('premade')}>PREMADE</div>
			</div>
		);
	}
}

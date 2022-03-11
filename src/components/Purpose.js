import React from 'react';

const subArrPerson = [
	{key:'easyOne', label:'EASY ONE'},
	{key:'easyTwo', label:'EASY TWO'},
	{key:'carGolion', label:'CARGOLINO'},
];
const subArrBusiness = [
	{key:'carGolion', label:'CARGOLINO'},
	{key:'space', label:'SPACE'},
	{key:'spaceXl', label:'SPACE XL'},
];

const buttonArr = [
	{key:'personal', label:'PERSONAL', subArr:subArrPerson},
	{key:'business', label:'BUSINESS', subArr:subArrBusiness},
]

export default class PurposeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {pageKey: props.pageKey, selPart:''};
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
		const {pageKey, selPart} = this.state;
		return (
			<div className={`back-board flex purpose ${pageKey==='purpose'?'active':''}`}>
				<div className='title'>What is your purpose?</div>
				<div className='content flex'>
					{buttonArr.map((item, idx) =>
						<div className={`main-part flex ${selPart===item.key?'active':''}`} key={idx}>
							<div className='main-button button' onClick={()=>this.setState({selPart:item.key})}>{item.label}</div>
							<div className='sub-content flex'>
								{item.subArr.map((subItem, subIdx) =>
									<div className='sub-button button' onClick={() => {
										if (selPart !== item.key) return;
										this.props.callCanvasPage(subItem.key);
									}} key={subIdx}>{subItem.label}</div>
								) }
							</div>
						</div>
					) }
				</div>
			</div>
		);
	}
}

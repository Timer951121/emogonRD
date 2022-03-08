import React from 'react';
import imgArrow from '../assets/images/arrow.png';

const sizeArr = [
	{key:'mini', label:'Mini'},
	{key:'small', label:'Small'},
	{key:'regular', label:'Regular'},
	{key:'xl', label:'XL'},
]

export default class SideComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, rear, brake} = props;
		this.state = {pageKey, side:false, selSize:null, rear, brake};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		['pageKey', 'selSize', 'rear', 'brake'].forEach(key => {
			if (key==='pageKey' && this.state.pageKey !== 'canvas' && nextProps.pageKey==='canvas') {
				setTimeout(() => { this.setState({side:true}) }, 500);
				setTimeout(() => { this.setState({side:false}) }, 2000);
			}
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
				});
			}
		});
	}

	render() {
		const {pageKey, side, selSize, rear, brake} = this.state;
		return (
			<div className={`side ${side?'open':''}`}>
				<div className='side-wrapper'>
					{/* <img className='arrow' src={imgArrow} onClick={()=>this.setState({side:!side})}></img> */}
					<div className='part size-part'>
						<div className='title'>What windshield do you wish?</div>
						<div className='part-content flex'>
							{sizeArr.map((item, idx) =>
								<div className={`button ${selSize===item.key?'active':''}`} onClick={() => {
									this.props.setSelSize(item.key);
								}} key={idx}>{item.label}</div>
							) }
						</div>
					</div>
					<div className='part switch-part'>
						<div className='title'>Do you want a rear panel?</div>
						<div className='part-content flex'>
							<div className={`button ${rear?'active':''}`} onClick={() => { this.props.setRear(!rear); }}>Yes</div>
							{/* <label onClick={()=>this.props.setRear(false)}>No</label>
							<div className={`switch-wrapper ${rear?'push':''} flex`} onClick={()=>this.props.setRear(!rear)}>
								<div className={`switch-inner `}></div>
							</div>
							<label onClick={()=>this.props.setRear(true)}>Yes</label> */}
						</div>
					</div>
					<div className='part switch-part'>
						<div className='title'>Do you want a brake light?</div>
						<div className='part-content flex'>
							<div className={`button ${brake?'active':''}`} onClick={() => { this.props.setBrake(!brake); }}>Yes</div>
							{/* <label onClick={()=>this.props.setBrake(false)}>No</label>
							<div className={`switch-wrapper ${brake?'push':''} flex`} onClick={()=>this.props.setBrake(!brake)}>
								<div className={`switch-inner`}></div>
							</div>
							<label onClick={()=>this.props.setBrake(true)}>Yes</label> */}
						</div>
					</div>


				</div>
			</div>
		);
	}
}

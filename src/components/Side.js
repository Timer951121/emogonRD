import React from 'react';
import imgArrow from '../assets/images/arrow.png';
import { sizeArr, colArr } from '../data/info';

export default class SideComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, rear, brake, selSize, selCol} = props;
		this.state = {pageKey, side:false, selSize, selCol, rear, brake};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		['pageKey', 'selSize', 'selCol', 'rear', 'brake'].forEach(key => {
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
		const {pageKey, side, selSize, selCol, rear, brake} = this.state;
		return (
			<div className={`side ${side?'open':''}`}>
				<div className='side-wrapper'>
					{/* <img className='arrow' src={imgArrow} onClick={()=>this.setState({side:!side})}></img> */}
					<div className='part color-part'>
						<div className='title'>Choice color</div>
						<div className='part-content flex'>
							{colArr.map((item, idx) =>
								<img className={`color-img ${selCol===item.hex?'active':''}`} src={item.img} onClick={()=>this.props.setSelCol(item.hex)} key={idx}></img>
							) }
						</div>
					</div>
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

import React from 'react';
import imgArrow from '../assets/images/arrow.png';
import { sizeArr, colArr, easyTwoArr } from '../data/info';

export default class SideComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, rear, brake, selFront, selCol, frontArr, selType, selSubPart} = props;
		this.state = {pageKey, side:false, selFront, selCol, rear, brake, frontArr, selType, selSubPart, optionArr:[]};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		['pageKey', 'selFront', 'selCol', 'rear', 'brake', 'frontArr', 'selType', 'selSubPart', 'selOption'].forEach(key => {
			if (key==='pageKey' && this.state.pageKey !== 'canvas' && nextProps.pageKey==='canvas') {
				setTimeout(() => { this.setState({side:true}) }, 500);
				setTimeout(() => { this.setState({side:false}) }, 2000);
			}
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					if (key==='selSubPart') {
						const optionArr = easyTwoArr.filter(item=>{return item.inArr.includes(this.state.selSubPart)});
						this.setState({optionArr})
					}
				});
			}
		});
	}

	render() {
		const {pageKey, side, selFront, selCol, rear, brake, frontArr, selType, selSubPart, selOption, optionArr} = this.state;
		return (
			<div className={`side ${side?'open':''}`}>
				<div className='side-wrapper scroll scroll-y'>
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
								<div className={`button ${frontArr.includes(item.key)?'':'disable'} ${selFront===item.key?'active':''}`} onClick={() => {
									if (!frontArr.includes(item.key)) return;
									this.props.setSelFront(item.key);
								}} key={idx}>{item.label}</div>
							) }
						</div>
					</div>
					{optionArr.length > 0 &&
						<div className='part easyTwo-part'>
							<div className='title'>Choose your option</div>
							<div className='part-content flex'>
								{optionArr.map((item, idx) =>
									<div className={`button ${selOption===item.key?'active':''}`} onClick={() => {
										this.props.setSelOption(item.key);
									}} key={idx}>{item.label}</div>
								) }
							</div>
						</div>
					}
					<div className={`part switch-part rear-part ${(selOption !== 'passenger' && selOption !== 'basic')?'hide':''}`}>
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

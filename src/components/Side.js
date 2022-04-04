import React from 'react';
import imgChevron from '../assets/images/chevron.png';
import imgOptionRear from '../assets/images/side-option/rear.jpg';
import imgOptionBrake from '../assets/images/side-option/brake.jpg';
import { sizeArr, colArr, easyTwoArr } from '../data/info';

export default class SideComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, rear, brake, selFront, selCol, frontArr, selType, selSubPart} = props;
		this.state = {pageKey, selFront, selCol, rear, brake, frontArr, selType, selSubPart, optionArr:[], openColor:true, openFront:true, openOption:true, openRear:true, openBrake:true};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		['selFront', 'selCol', 'rear', 'brake', 'frontArr', 'selSubPart', 'selOption'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					if (key==='selSubPart') {
						const optionArr = easyTwoArr.filter(item=>{return item.inArr.includes(this.state.selSubPart)});
						console.log(optionArr)
						this.setState({optionArr})
					}
				});
			}
		});
	}

	render() {
		const { selFront, selCol, rear, brake, frontArr, selOption, optionArr, openColor, openFront, openOption, openRear, openBrake} = this.state;
		return (
			<div className={`side`}>
				<div className='side-outer side-header'>
					<div className='outer-line header-top'><label>EMOGON</label><label className='right'>1ST EDITION</label></div>
					<div className='outer-line'>EASY TWO</div>
				</div>
				<div className='side-wrapper scroll scroll-y'>
					<div className={`part color-part ${openColor?'open':''}`}>
						<div className='title' onClick={()=>this.setState({openColor:!openColor})}><img src={imgChevron}></img> COLOR</div>
						<div className='part-content'>
							<div className='color-wrapper flex'>
								{colArr.map((item, idx) =>
									<div className={`color-item ${item.hex===selCol?'active':''}`} style={{backgroundImage:'linear-gradient('+item.backCol+')'}} onClick={()=>this.props.setSelCol(item.hex)} key={idx}></div>
								) }
							</div>
							<div className='price-line'><label>ELECTRIC BLUE</label> <label className='right'>259.99 EUR</label></div>
						</div>
					</div>
					<div className={`part front-part ${openFront?'open':''}`}>
						<div className='title' onClick={()=>this.setState({openFront:!openFront})}><img src={imgChevron}></img> WINDSHIELD</div>
						<div className='part-content'>
							{sizeArr.map((item, idx) =>
								<div className={`option-item ${frontArr.includes(item.key)?'':'disable'} ${selFront===item.key?'active':''}`} onClick={() => {
									if (!frontArr.includes(item.key)) return;
									this.props.setSelFront(item.key);
								}} key={idx}>
									<div className='option-img'><img src={item.img}></img></div>
									<div className='option-label'>
										<div className='sub-title'>{item.label}</div>
										<div className='description'>{item.description}</div>
									</div>
								</div>
							) }
							<div className='price-line'><label className='right'>259.99 EUR</label></div>
						</div>
					</div>
					{optionArr.length > 0 &&
						<div className={`part option-part ${openOption?'open':''}`}>
							<div className='title' onClick={()=>this.setState({openOption:!openOption})}><img src={imgChevron}></img> YOUR OPTION</div>
							<div className='part-content'>
								{optionArr.map((item, idx) =>
									<div className={`option-item ${selOption===item.key?'active':''}`} onClick={() => {
										this.props.setRear(false);
										this.props.setSelOption(item.key);
									}} key={idx}>
										<div className='option-img'><img src={item.img}></img></div>
										<div className='option-label'>
											<div className='sub-title'>{item.label}</div>
											<div className='description'>{item.description}</div>
										</div>
									</div>
								) }
								<div className='price-line'><label className='right'>259.99 EUR</label></div>
							</div>
						</div>
					}
					<div className={`part rear-part ${(selOption !== 'passenger' && selOption !== 'basic')?'hide':''} ${openRear?'open':''}`}>
						<div className='title' onClick={()=>this.setState({openRear:!openRear})}><img src={imgChevron}></img> REAR PANEL</div>
						<div className='part-content'>
							<div className={`option-item ${rear?'active':''}`} onClick={() => { this.props.setRear(!rear); }}>
								<div className='option-img'><img src={imgOptionRear}></img></div>
								<div className='option-label'>
									Yes
								</div>
							</div>
							<div className='price-line'><label className='right'>259.99 EUR</label></div>
						</div>
					</div>
					<div className={`part brake-part ${openBrake?'open':''}`}>
						<div className='title' onClick={()=>this.setState({openBrake:!openBrake})}><img src={imgChevron}></img> BRAKE LIGHT</div>
						<div className='part-content'>
							<div className={`option-item ${brake?'active':''}`} onClick={() => { this.props.setBrake(!brake); }}>
								<div className='option-img'><img src={imgOptionBrake}></img></div>
								<div className='option-label'>
									Yes
								</div>
							</div>
							<div className='price-line'><label className='right'>259.99 EUR</label></div>
						</div>
					</div>
				</div>
				<div className='side-outer side-footer'>
					<div className='outer-line'>
						<label>Add to Cart +</label> <label className='right'>5,499.99 EUR</label>
					</div>
				</div>
			</div>
		);
	}
}

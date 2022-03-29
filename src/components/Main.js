import React from 'react';
import axios from 'axios';
import StartComponent from './Start';
import PurposeComponent from './Purpose';
import CanvasComponent from './Canvas';
import SideComponent from './Side';
import LoadingComponent from './Loading';
import { sizeArr, colArr } from '../data/info';

import '../assets/css/index.css';

const testMode = true;
const device = getDevice();
function getDevice() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (/windows phone/i.test(userAgent)) { return "windows"; }
	if (/android/i.test(userAgent)) { return "android"; }
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) { return "ios"; }
	return undefined;
}

function getWSize(wWidth, wHeight) {
	var width = wWidth - 400, height = wHeight;
	if (device==='android') height = wHeight - 55;
	else if (device==='ios') height = wHeight - 5;
	return {width, height};
}

export default class MainComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loading:false, pageKey:'start', wSize:getWSize(window.innerWidth, window.innerHeight), rear:false, brake:false, selCol:colArr[0].hex, frontArr:[], selFront:''};
	}

	componentDidMount() {
		this.setState({loading:false, loadPro:0, pageKey:'start', rear:true, brake:true});
		window.addEventListener('resize', this.setCanvasSize);
	}

	setCanvasSize = () => {
		this.setState({portrait:window.innerHeight>window.innerWidth});
		if (window.innerHeight< 320) return;
		this.setState({wSize:getWSize(window.innerWidth, window.innerHeight)});
	}

	render() {
		const {pageKey, loading, portrait, selType, wSize, rear, brake, selCol, selPart, selSubPart, frontArr, selFront, selOption} = this.state;
		return (
			<div className={`page-wrapper ${device?'mobile':'web'} ${device} ${pageKey}-page`}>
				<StartComponent
					pageKey={pageKey}
					callPurposePage={(selType)=>this.setState({pageKey:'purpose', selType})}
				></StartComponent>
				<PurposeComponent
					pageKey={pageKey}
					callCanvasPage={(selPart, selSubPart)=>{
						this.setState({pageKey:'canvas', selPart, selSubPart, selOption:''}, () => {
							const frontType = selSubPart.includes('space')?'xl':'regular';
							var box = selSubPart.includes('easy')?false:true;
							const preSelFront = (selType==='custom' && frontType==='regular')?'mini':frontType;
							const selOption = (selType==='premade' && box)?'cargo' : 'basic';
							this.setState({rear:box,
								selFront:preSelFront,
								frontArr:frontType==='xl'?['xl']:['mini', 'small', 'regular'],
								selOption
							});
						})
					}}
				></PurposeComponent>
				<CanvasComponent
					testMode={testMode}
					pageKey={pageKey}
					wSize={wSize}
					selType={selType}
					selPart={selPart}
					selSubPart={selSubPart}
					selCol={selCol}
					selOption={selOption}
					selFront={selFront}
					rear={rear}
					brake={brake}
					setPage={(pageKey)=>this.setState({pageKey})}
					setLoading={(loading, loadPro)=>this.setState({loading, loadPro})}
				></CanvasComponent>
				<SideComponent
					pageKey={pageKey}
					rear={rear}
					brake={brake}
					selCol={selCol}
					selType={selType}
					selFront={selFront}
					frontArr={frontArr}
					selOption={selOption}
					selSubPart={selSubPart}
					setRear={rear=>this.setState({rear}, () => {
						if (rear) this.setState({selFront:selSubPart.includes('space')?'xl':'regular'})
					})}
					setBrake={brake=>this.setState({brake})}
					setSelCol={selCol=>this.setState({selCol})}
					setSelFront={selFront=>this.setState({selFront}, () => {
						if (selFront === 'mini' || selFront === 'small') {
							this.setState({rear:false})
							if (selOption==='cargo') this.setState({selOption:'basic'})
						}
					})}
					setSelOption={selOption=>this.setState({selOption}, () => {
						if (selOption!=='passenger' && selOption!=='pickUp') this.setState({rear:false});
						if (selOption==='cargo') {
							this.setState({rear:true});
							if (selSubPart.includes('space')) this.setState({selFront:'xl'});
							else this.setState({selFront:'regular'});
						}
					})}
				></SideComponent>
				<LoadingComponent
					loading={loading}
					// loadPro={loadPro}
				></LoadingComponent>
			</div>
		);
	}
}

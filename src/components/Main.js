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
		this.state = {loading:false, pageKey:'start', wSize:getWSize(window.innerWidth, window.innerHeight), rear:false, brake:false, selSize:sizeArr[0].key, selCol:colArr[0].hex};
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
		const {pageKey, loading, portrait, wSize, rear, brake, selSize, selCol, selPart, selSubPart} = this.state;
		return (
			<div className={`page-wrapper ${device?'mobile':'web'} ${device} ${pageKey}-page`}>
				<StartComponent
					pageKey={pageKey}
					callPurposePage={(type)=>this.setState({pageKey:'purpose'})}
				></StartComponent>
				<PurposeComponent
					pageKey={pageKey}
					callCanvasPage={(selSubPart)=>this.setState({pageKey:'canvas', selSubPart})}
				></PurposeComponent>
				<CanvasComponent
					testMode={testMode}
					pageKey={pageKey}
					wSize={wSize}
					selPart={selPart}
					selSubPart={selSubPart}
					selCol={selCol}
					selSize={selSize}
					rear={rear}
					brake={brake}
					setPage={(pageKey)=>this.setState({pageKey})}
					setLoading={(loading, loadPro)=>this.setState({loading, loadPro})}
				></CanvasComponent>
				<SideComponent
					pageKey={pageKey}
					selCol={selCol}
					selSize={selSize}
					rear={rear}
					brake={brake}
					setRear={rear=>this.setState({rear})}
					setBrake={brake=>this.setState({brake})}
					setSelCol={selCol=>this.setState({selCol})}
					setSelSize={selSize=>this.setState({selSize})}
				></SideComponent>
				<LoadingComponent
					loading={loading}
					// loadPro={loadPro}
				></LoadingComponent>
			</div>
		);
	}
}

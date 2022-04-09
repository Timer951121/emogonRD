import React from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';

import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
// import Stats from 'three/examples/jsm/libs/stats.module';
import modelCar from '../assets/model/test.fbx';
import { modelH } from '../data/info';

import imgIconRotate from '../assets/images/icon_rotate.png';
import imgIconMoon from '../assets/images/icon_moon.png';
import imgIconSun from '../assets/images/icon_sun.png';
import imgIconLight from '../assets/images/icon_light.png';
import imgIconUnLight from '../assets/images/icon_unlight.png';
import imgBloomBrake from '../assets/images/bloom-brake.png';
import imgBloomIn from '../assets/images/bloom_in.png';
import imgBloomOut from '../assets/images/bloom_out.png';

import imgEnvPX from '../assets/images/px.png';
import imgEnvPY from '../assets/images/py.png';
import imgEnvPZ from '../assets/images/pz.png';
import imgEnvNX from '../assets/images/nx.png';
import imgEnvNY from '../assets/images/ny.png';
import imgEnvNZ from '../assets/images/nz.png';

const imgEnv0Arr = [imgEnvPX, imgEnvNX, imgEnvPY, imgEnvNY, imgEnvPZ, imgEnvNZ];
const disM = 2.12 - 1.41, disL = 2.42 - 1.41, bottomY=0.231, langEasyY = 1.583, langSpaceY = 2.033, langEasyH = langEasyY - bottomY, langSpaceH = langSpaceY - bottomY, boxBottomH = 0.3;
// const stats = Stats();
// document.body.appendChild(stats.dom)

export default class CanvasComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, selSize, selCol, selEasyTwo} = props;
		this.wheelArr = []; this.bodyMeshArr = []; this.lightMeshArr = []; this.bottomArr=[]; this.rearArr = []; this.backArr = []; this.boxArr = []; this.frontArr=[]; this.frameArr=[]; this.ceilingArr = []; this.bloomArr = [];
		this.state = {pageKey, rotate:1, selCol, selSize, selEasyTwo, envMode:'sun', light:true}; this.mouseStatus = 'none';
	}

	componentDidMount() {
		this.initScene();
		this.loadPlane();
		this.loadModel();
		this.animate();
		// window.addEventListener('pointerdown', (e)=>{this.mouseStatus = 'down'; });
		// window.addEventListener('pointermove', (e)=>{if (this.mouseStatus==='down' || this.mouseStatus==='drag') this.mouseStatus = 'drag'; });
		// window.addEventListener('pointerup', (e)=>{this.mouseStatus = 'none'; });
		window.addEventListener('keydown', (e)=> {
			if (!this.totalGroup) return;
			else if (e.key==='ArrowLeft') this.totalGroup.rotation.y -= 0.015;
			else if (e.key==='ArrowRight') this.totalGroup.rotation.y += 0.015;
		});
		// var self = this;
		// function createWheelStopListener(element, callback, timeout) {
		// 	var handle = null;
		// 	var onScroll = function() {
		// 		self.mouseStatus = 'zoom';
		// 		if (handle) {
		// 			clearTimeout(handle);
		// 		}
		// 		handle = setTimeout(callback, timeout || 200);
		// 	};
		// 	element.addEventListener('wheel', onScroll);
		// 	return function() {
		// 		element.removeEventListener('wheel', onScroll);
		// 	};
		// }
		// createWheelStopListener(window, () => {
		// 	self.mouseStatus = 'none';
		// });
	}

	componentWillReceiveProps(nextProps) {
		['pageKey', 'box', 'rear', 'selType', 'brake', 'selSize', 'selCol', 'selSubPart', 'selFront', 'selOption'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					const {box, selSubPart, rear, brake, selFront, selOption} = this.state;
					if (key==='selCol') this.setColor();
					else if (key === 'selSubPart') this.setBottomMesh();
					else if (key==='box') {this.boxArr.forEach(child => { child.visible = box });}
					else if (key === 'rear' && this.backBrake) {
						this.rearArr.forEach(child => { child.visible = rear;});
						this.backBrake.visible = rear;
						this.setCeiling();
					}
					else if (key === 'brake' && this.brakeGroup) this.brakeGroup.visible = brake;
					else if (key === 'selFront') {
						this.frontArr.forEach(child => { child.visible = child.name.includes('frontMain_'+selFront) });
						this.setCeiling({show:(selFront === 'regular' || selFront === 'xl')});
						this.setSelFrame();
					} else if (key === 'selOption') {
						this.setOption();
						this.setCeiling();
					}
				});
			}
		});
	}

	setSelFrame = () => {
		const {selFront} = this.state;
		this.frameArr.forEach(child => { 
			child.visible = false;
			if ((selFront==='xl' || selFront==='regular') && child.preVisible) child.visible = true;
			else if (child.name==='frame_RAHMEN_Mini') child.visible = true;
		});
	}

	setOption = () => {
		const {selOption} = this.state;
		switch (this.state.selOption) {
			case 'basic':  case 'eppBox':  case 'passenger': this.boxArr.forEach(child => { child.visible = false; }); break;
			case 'pickUp': this.boxArr.forEach(child => { child.visible = !child.name.includes('top'); }); break;
			case 'cargo': this.boxArr.forEach(child => { child.visible = true; }); break;
			default: break;
		}
		this.eppBox.visible = selOption==='eppBox';
		this.passenger.visible = selOption==='passenger';
		this.backBrake.visible = (selOption==='cargo' || selOption==='pickUp');
		this.framePickUp.visible = selOption==='pickUp';
		// this.frameArr.forEach(child => { child.visible = child.preVisible && selOption==='cargo'; });
	}

	setCeiling = (info) => {
		const {selSubPart, selOption, rear} = this.state;
		var ceilingW = 0;
		if (selSubPart==='easyTwo' || selSubPart==='carGolion' || selSubPart==='space') ceilingW = disM;
		else if (selSubPart === 'spaceXl') ceilingW = disL;
		const oriW = (selOption ==='cargo' || rear)?ceilingW:0, realW = oriW/disL * 0.01;
		this.ceilingArr.forEach(child => {
			if (child.name === 'ceiling_back_body') child.position.x = child.oriBackPos + realW * 100;
			else if (child.name === 'ceiling_body') child.scale.x = realW;
			if (!info) return;
			if (info.top) child.position.y = info.top;
			if (info.show !== undefined) child.visible = info.show;
		});
	}

	setBottomMesh = () => {
		const {selType, selSubPart} = this.state;
		// hor-pos 1.41, 2.12, 2.42 // ver-pos 0.231 1.583, 2.033
		const topLevel = selSubPart.includes('space')?true:false, topH = topLevel?langSpaceY:langEasyY;
		var selBottom = '', dis = 0, pushR = 1, frameName = 'frame_RAHMEN_';
		switch (selSubPart) {
			case 'easyOne': 	selBottom = 'SWB'; dis = 0;   	pushR = 1;	 frameName+='EasyOne'; break;
			case 'easyTwo': 	selBottom = 'MWB'; dis = disM;	pushR = 1.2; frameName+='EasyOne'; break;
			case 'carGolion': 	selBottom = 'MWB'; dis = disM;	pushR = 1.2; frameName+='EasyOne'; break; // EasyTwo
			case 'space': 		selBottom = 'MWB'; dis = disM;	pushR = 1.2; frameName+='Space';   break;
			case 'spaceXl': 	selBottom = 'LWB'; dis = disL;	pushR = 1.4; frameName+='Space';   break; // XL
			default: break;
		}
		this.bottomArr.forEach(child => { child.visible = child.name.includes(selBottom); });
		this.backArr.forEach(child => {
			if (child.name.includes('box') || child.name==='back_brake') child.position.x = child.oriBackPos + dis;
			else {
				if (dis === 0) child.position.x = child.oriBackPos;
				else child.position.x = child.oriBackPos + dis - 0.06;
			}
		});
		this.setCeiling({top:topH});
		this.boxArr.forEach(child => {
			if (child.name.includes('side')) child.scale.x = selBottom==='LWB'?0.01: disM/disL * 0.0102;
			if (child.name.includes('top')) child.scale.z = topLevel?0.01: (langEasyH - boxBottomH)/langSpaceH * 0.0101;
		});
		this.framePickUp.scale.x = selBottom==='MWB'?0.01: disL/disM * 0.01;
		this.frameArr.forEach(child => { child.preVisible = child.name===frameName;});
		this.modelObj.position.x = modelH/-2.5 * pushR;
		this.totalGroup.position.y = topLevel?modelH/-2.5:modelH/-3;
	}

	setEnvMode = () => {
		this.setState({envMode:this.state.envMode==='sun'?'moon':'sun'}, () => {
			const {envMode} = this.state, darkLight = 0.2;
			this.ambientLight.intensity = envMode==='sun'? 0.3 : darkLight;
			this.shadowLight.intensity = envMode==='sun'? 0.8 : darkLight;
			this.frontLight.intensity = envMode==='sun'? 0.4 : darkLight;
			this.backLight.intensity = envMode==='sun'? 0.4 : darkLight;
			this.renderer.setClearColor(envMode==='sun'?0xFFFFFF:0x555555, 1);
		})
	}

	initScene = () => {
		this.renderer = new THREE.WebGLRenderer({antialias:true});
		this.renderer.setSize(this.props.wSize.width, this.props.wSize.height);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);

		// this.renderer.setPixelRatio( 2 );
		this.renderer.setClearColor(0xFFFFFF, 1);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(40, this.props.wSize.width / this.props.wSize.height, 0.01, 100);
		// this.camera.position.set(-8, 2.5, 6);
		this.camera.position.set(-6.4, 2, 4.8);
		
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.enablePan = false;
		this.controls.maxPolarAngle = Math.PI / 2 + 0.3;
		
		this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3); this.scene.add(this.ambientLight);
		this.shadowLight = new THREE.DirectionalLight(0xFFFFFF, 0.8 ); this.scene.add( this.shadowLight ); this.shadowLight.castShadow = true;
		this.shadowLight.position.set(-5, 8, 5);
		this.shadowLight.shadow.mapSize.width = 512; // default
		this.shadowLight.shadow.mapSize.height = 512; // default
		this.shadowLight.shadow.camera.near = 0.5; // default
		this.shadowLight.shadow.camera.far = 500;
		this.backLight = new THREE.DirectionalLight(0xFFFFFF, 0.4 ); this.backLight.position.set(5, 5, -5); this.scene.add( this.backLight );
		this.frontLight = new THREE.DirectionalLight(0xFFFFFF, 0.4 ); this.frontLight.position.set(-5, -1, 0); this.scene.add( this.frontLight );
	}

	setColor = () => {
		this.bodyMeshArr.forEach(child => {
			child.material.color.setHex(this.state.selCol);
		});
	}

	loadPlane = () => {
		const planeGeo = new THREE.PlaneGeometry(100, 100);
		const planeMat = new THREE.MeshStandardMaterial({color:0xFFFFFF}); // planeGeo = new THREE.BoxGeometry(100, 0.01, 100), 
		const planeMesh = new THREE.Mesh(planeGeo, planeMat); planeMesh.receiveShadow = true;
		planeMesh.rotation.x = Math.PI / -2;
		this.totalGroup.add(planeMesh);
	}

	loadModel = () => {
		const envMap0 = new THREE.CubeTextureLoader().load(imgEnv0Arr);
		const normalMap3 = new THREE.CanvasTexture( new FlakesTexture() );
		normalMap3.wrapS = THREE.RepeatWrapping;
		normalMap3.wrapT = THREE.RepeatWrapping;
		normalMap3.repeat.x = 10;
		normalMap3.repeat.y = 6;
		normalMap3.anisotropy = 16;
		// const bodyMat = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, envMap:envMap0, reflectivity:0, roughness:0, metalness:0 })
		const bodyMat = new THREE.MeshPhysicalMaterial({ clearcoat:1.0, envMap:envMap0, clearcoatRoughness: 0.1, metalness: 0.5, roughness: 0.5, color: 0x00ff00, normalMap: normalMap3, normalScale: new THREE.Vector2( 0.15, 0.15 ) } );
		const mapBloomBrake = new THREE.TextureLoader().load(imgBloomBrake),
			mapBloomIn = new THREE.TextureLoader().load(imgBloomIn),
			mapBloomOut = new THREE.TextureLoader().load(imgBloomOut);
			// mapBloomBrake.rotation = mapBloomIn.rotation = mapBloomOut.rotation = Math.PI/2;
		new FBXLoader().load( modelCar, (object) => {
			object.traverse(child => {
				if (child.name.includes('body')) { child.material = bodyMat; this.bodyMeshArr.push(child); }
				if (child.name.includes('PLATTFORM')) this.bottomArr.push(child);
				if (child.name.includes('back')) {child.oriBackPos = Math.round(child.position.x * 1000)/1000; this.backArr.push(child);}
				if (child.name.includes('box')) this.boxArr.push(child);
				if (child.name.includes('box_back')) this.rearArr.push(child);
				if (child.name.includes('ceiling')) this.ceilingArr.push(child);
				// if (child.name === 'Rear_back') this.rearGroup = child;
				else if (child.name === 'Brake') this.brakeGroup = child;
				else if (child.name.includes('Wheel')) this.wheelArr.push(child);
				else if (child.name.includes('frontMain')) this.frontArr.push(child);
				else if (child.name.includes('frame_RAHMEN')) this.frameArr.push(child);
				else if (child.name==='easyTwo_eppBox') this.eppBox = child;
				else if (child.name==='easyTwo_passenger') this.passenger = child;
				else if (child.name==='back_brake') this.backBrake = child;
				else if (child.name==='frame_pickUp') this.framePickUp = child;
				if (child.name === 'FRONT_BLACK')
					child.material = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, color:0x000000, envMap:envMap0, reflectivity:1});
					// child.material = new THREE.MeshStandardMaterial({envMap:envMap0, reflectivity:0.9, color:0x151515, metalness:0.4, roughness:0.6});
				else if (child.name.includes('glass')) {
					child.material = new THREE.MeshPhongMaterial({envMap:envMap0, transparent:true, opacity:0.4, side:0, color:0xEEEEEE, reflectivity:1});
				} else if (child.name.includes('emissive')) {
					child.oriCol = child.material.color.getHex();
					this.lightMeshArr.push(child);
					// child.material = new THREE.MeshBasicMaterial({color:colVal});
				} else if (child.name.includes('BLOOM')) {
					this.bloomArr.push(child);
					child.material = new THREE.MeshBasicMaterial({transparent:true});
					if 		(child.name.includes('BLOOM_center')) child.material.map = mapBloomBrake;
					else if (child.name.includes('BLOOM_side_in')) {child.material.map = mapBloomIn;}
					else if (child.name.includes('BLOOM_side_out')) child.material.map = mapBloomOut;
				}
				if (child instanceof THREE.Mesh) {
					child.material.side = 2;
					child.castShadow = true;
				}
			})
			const vPos = new THREE.Box3().setFromObject(object), vSize = vPos.getSize(), scl = modelH/vSize.y;
			object.scale.set(scl, scl, scl);
			this.modelObj = object;
			this.setColor();
			this.totalGroup.add(object);
			this.props.setLoading(false);
			this.setLightAnimate(true);
			// this.rotateWheel();
		}, (xhr) => { }, (error) => { console.log(error); } );
	}

	setLightAnimate = (flag, lightStop) => {
		this.lightMeshArr.forEach(item => {
			if (flag) item.material = new THREE.MeshBasicMaterial({color:item.oriCol});
			else item.material = new THREE.MeshStandardMaterial({color:item.oriCol});
		});
		this.bloomArr.forEach(child => { child.visible = flag; });
		if (lightStop) return;
		setTimeout(() => {
			if (this.state.light) this.setLightAnimate(!flag);
			else this.setLightAnimate(false, true);
		}, 1000);
	}

	rotateWheel = () => {
		this.wheelArr.forEach(wheel => {
			wheel.rotation.y -= 0.02 * this.state.rotate;
		});
		// setTimeout(() => {
		// 	this.rendering();
		// 	this.rotateWheel();
		// 	stats.update();
		// }, testMode?100:20);
	}

	animate=()=>{
		if (!this.camera || !this.scene) return;
		requestAnimationFrame(this.animate);
		this.rotateWheel();
		this.rendering();
		// stats.update();
		// if (this.mouseStatus === 'drag' || this.mouseStatus==='zoom') this.rendering();
		// const camPos = this.camera.position;
		// this.shadowLight.position.set(camPos.x, camPos.y, camPos.z);
	}
	rendering = () => {
		if (!this.camera || !this.renderer) return;
		this.camera.lookAt( 0, 0, 0 );
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		this.camera.updateProjectionMatrix();
	}

	render() {
		const {pageKey, rotate, envMode, light} = this.state;
		return (
			<div className={`back-board canvas ${pageKey==='canvas'?'active':''}`}>
				<div id='container'></div>
				<div className='set-item set-light' onClick={()=>this.setState({light: !light}, () => {if (this.state.light) {this.setLightAnimate(true);} }) }>
					<div className='circle'><img src={light?imgIconLight:imgIconUnLight}></img></div>
				</div>
				<div className={`set-item set-rotate ${rotate?'rotate':''}`} onClick={()=> this.setState({rotate:rotate===1?0:1}) }>
					<div className='circle'><img src={imgIconRotate}></img></div>
				</div>
				<div className='set-item set-sun' onClick={this.setEnvMode }>
					<div className='circle'><img src={envMode==='sun'?imgIconSun:imgIconMoon}></img></div>
				</div>
			</div>
		);
	}
}

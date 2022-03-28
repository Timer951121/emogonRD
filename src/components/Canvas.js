import React from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import modelCar from '../assets/model/test.fbx';
import { modelH } from '../data/info';

import imgEnvPX from '../assets/images/px.png';
import imgEnvPY from '../assets/images/py.png';
import imgEnvPZ from '../assets/images/pz.png';
import imgEnvNX from '../assets/images/nx.png';
import imgEnvNY from '../assets/images/ny.png';
import imgEnvNZ from '../assets/images/nz.png';

const imgEnv0Arr = [imgEnvPX, imgEnvNX, imgEnvPY, imgEnvNY, imgEnvPZ, imgEnvNZ];
const disM = 2.12 - 1.41, disL = 2.42 - 1.41, bottomY=0.231, langEasyY = 1.583, langSpaceY = 2.033, langEasyH = langEasyY - bottomY, langSpaceH = langSpaceY - bottomY, boxBottomH = 0.3;
const stats = Stats();
document.body.appendChild(stats.dom)

export default class CanvasComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, selSize, selCol, selEasyTwo} = props;
		this.wheelArr = []; this.bodyMeshArr = []; this.lightMeshArr = []; this.boxArr = []; this.frontArr=[]; this.frameArr=[]; this.ceilingArr = []; this.easyTwoArr = [];
		this.state = {pageKey, rotate:1, selCol, selSize, selEasyTwo, envMode:'light'}; this.mouseStatus = 'none';
	}

	componentDidMount() {
		this.initScene();
		this.loadPlane();
		this.loadModel();
		this.animate();
		// window.addEventListener('pointerdown', (e)=>{this.mouseStatus = 'down'; });
		// window.addEventListener('pointermove', (e)=>{if (this.mouseStatus==='down' || this.mouseStatus==='drag') this.mouseStatus = 'drag'; });
		// window.addEventListener('pointerup', (e)=>{this.mouseStatus = 'none'; });
		window.addEventListener('keydown', (e)=>{
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
		['pageKey', 'box', 'rear', 'selType', 'brake', 'selSize', 'selCol', 'selSubPart', 'selFront', 'selEasyTwo'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					const {box, selSubPart, rear, brake, selFront, selEasyTwo} = this.state;
					if (key==='selCol') this.setColor();
					else if (key === 'selSubPart') this.setBottomMesh();
					else if (key==='box') {this.boxArr.forEach(child => { child.visible = box });}
					else if (key === 'rear' && this.rearGroup) {
						if (selSubPart==='easyTwo') {
							const ceilingW = rear?disM:0
							this.setCeiling({width:ceilingW/disL * 0.01})
						}
						this.rearGroup.visible = rear;
					}
					else if (key === 'brake' && this.brakeGroup) this.brakeGroup.visible = brake;
					else if (key === 'selFront') {
						this.frontArr.forEach(child => { child.visible = child.name.includes('frontMain_'+selFront) });
						this.setCeiling({show:(selFront === 'regular' || selFront === 'xl')})
						this.frameArr.forEach(child => { 
							child.visible = false;
							if ((selFront==='xl' || selFront==='regular') && child.preVisible) child.visible = true;
							else if (child.name==='frame_RAHMEN_Mini') child.visible = true;
						});
					} else if (key === 'selEasyTwo') {
						this.easyTwoArr.forEach(child => { child.visible = child.name==='easyTwo_'+selEasyTwo }); // 
					}
				});
			}
		});
	}

	setCeiling = (info) => {
		this.ceilingArr.forEach(child => {
			if (info.top) child.position.y = info.top;
			if (info.width !== undefined) {
				if (child.name === 'ceiling_back_body') child.position.x = child.oriBackPos + info.width * 100;
				else if (child.name === 'ceiling_body') child.scale.x = info.width;
			}
			if (info.show !== undefined) child.visible = info.show;
		}); // child.position.x = selBottom==='LWB'?1.2:1.23;
	}

	setBottomMesh = () => {
		const {selType, selSubPart} = this.state;
		// hor-pos 1.41, 2.12, 2.42 // ver-pos 0.231 1.583, 2.033
		const topLevel = selSubPart.includes('space')?true:false, topH = topLevel?langSpaceY:langEasyY;
		var selBottom = '', dis = 0, ceilingW = 0, pushR = 1, frameName = 'frame_RAHMEN_';
		switch (selSubPart) {
			case 'easyOne': 	selBottom = 'SWB'; dis = 0;    ceilingW = 0;	pushR = 1;	 frameName+='EasyOne'; break;
			case 'easyTwo': 	selBottom = 'MWB'; dis = disM; ceilingW = 0;	pushR = 1.2; frameName+='EasyOne'; break;
			case 'carGolion': 	selBottom = 'MWB'; dis = disM; ceilingW = disM;	pushR = 1.2; frameName+='EasyTwo'; break;
			case 'space': 		selBottom = 'MWB'; dis = disM; ceilingW = disM;	pushR = 1.2; frameName+='Space';   break;
			case 'spaceXl': 	selBottom = 'LWB'; dis = disL; ceilingW = disL;	pushR = 1.4; frameName+='SpaceXL'; break;
			default: break;
		}
		this.modelObj.traverse(function (child) {
			if (child.name.includes('PLATTFORM')) child.visible = child.name.includes(selBottom);
			else if (child.name.includes('back')) {
				if 		(child.name==='Rear_back') child.position.x = child.oriBackPos + dis;
				else {
					if (dis === 0) child.position.x = child.oriBackPos;
					else child.position.x = child.oriBackPos + dis - 0.06;
				}
			}
			else if (child.name==='rear_body') {child.scale.z = topLevel?(langSpaceH/langEasyH)*0.01:0.01;}
		})
		this.setCeiling({top:topH, width:ceilingW/disL * 0.01})
		this.boxArr.forEach(child => {
			if (child.name==='box_front_body') child.scale.z=topLevel?0.01: langEasyH/langSpaceH * 0.01;
			else {
				child.scale.x = selBottom==='LWB'?0.01: disM/disL * 0.0102;
				if (child.name==='box_side_top_body') child.scale.z = topLevel?0.01: (langEasyH - boxBottomH)/langSpaceH * 0.0101;
			}
		});
		// this.frontArr.forEach(child => { child.preVisible = child.name.includes('frontMain_'+frontName); if (selType==='premade') child.visible = child.name.includes('frontMain_'+frontName); });
		this.frameArr.forEach(child => { child.preVisible = child.name===frameName;}); //  if (selType==='premade') child.visible = child.name===frameName; 
		this.modelObj.position.x = modelH/-2 * pushR;
		this.totalGroup.position.y = topLevel?modelH/-2:modelH/-3;
	}

	setEnvMode = () => {
		this.setState({envMode:this.state.envMode==='light'?'dark':'light'}, () => {
			const {envMode} = this.state, darkLight = 0.2;
			this.ambientLight.intensity = envMode==='light'? 0.3 : darkLight;
			this.shadowLight.intensity = envMode==='light'? 0.8 : darkLight;
			this.frontLight.intensity = envMode==='light'? 0.4 : darkLight;
			this.backLight.intensity = envMode==='light'? 0.4 : darkLight;
			this.renderer.setClearColor(envMode==='light'?0xFFFFFF:0x555555, 1);
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
		this.camera.position.set(-8, 2.5, 6);
		
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
		const bodyMat = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, envMap:envMap0, reflectivity:0, roughness:0, metalness:0 })
		new FBXLoader().load( modelCar, (object) => {
			object.traverse(child => {
				if (child.name.includes('back')) {child.oriBackPos = Math.round(child.position.x * 1000)/1000;}
				if (child.name.includes('ceiling')) this.ceilingArr.push(child);
				if (child.name === 'Rear_back') this.rearGroup = child;
				else if (child.name === 'Brake') this.brakeGroup = child;
				else if (child.name.includes('box')) this.boxArr.push(child);
				else if (child.name.includes('Wheel')) this.wheelArr.push(child);
				else if (child.name.includes('easyTwo')) this.easyTwoArr.push(child);
				else if (child.name.includes('frontMain')) this.frontArr.push(child);
				else if (child.name.includes('frame_RAHMEN')) this.frameArr.push(child);

				if (child.name.includes('body')) { child.material = bodyMat; this.bodyMeshArr.push(child); }
				else if (child.name === 'FRONT_BLACK')
					child.material = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, color:0x000000, envMap:envMap0, reflectivity:1});
					// child.material = new THREE.MeshStandardMaterial({envMap:envMap0, reflectivity:0.9, color:0x151515, metalness:0.4, roughness:0.6});
				else if (child.name.includes('glass')) {
					child.material = new THREE.MeshPhongMaterial({envMap:envMap0, transparent:true, opacity:0.4, side:0, color:0xEEEEEE, reflectivity:1});
				} else if (child.name.includes('emissive')) {
					child.oriCol = child.material.color.getHex();
					this.lightMeshArr.push(child);
					// child.material = new THREE.MeshBasicMaterial({color:colVal});
				} else if (child.name==='ceiling_back_body') this.frontBackMesh = child;
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
			this.flagLight = false;
			this.setLightAnimate();
			// this.rotateWheel();
		}, (xhr) => { }, (error) => { console.log(error); } );
	}

	setLightAnimate = () => {
		this.lightMeshArr.forEach(item => {
			if (this.flagLight) item.material = new THREE.MeshBasicMaterial({color:item.oriCol});
			else item.material = new THREE.MeshStandardMaterial({color:item.oriCol});
		});
		this.flagLight = !this.flagLight;
		setTimeout(() => { this.setLightAnimate(); }, 1000);
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
		stats.update();
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
		const {pageKey, selCol, rotate, envMode} = this.state;
		return (
			<div className={`back-board canvas ${pageKey==='canvas'?'active':''}`}>
				<div id='container'></div>
				<div className='setting-wrapper'>
					<div className='set-item button' onClick={()=> this.setState({rotate:rotate===1?0:1}) }>{rotate?'Stop':'Rotate'}</div>
					<div className='set-item button' onClick={this.setEnvMode }>{envMode==='light'?'Dark':'Light'}</div>
					{this.props.testMode &&
						<div className='set-item button' onClick={()=>this.props.setPage('purpose') }>Back</div>
					}
				</div>
			</div>
		);
	}
}

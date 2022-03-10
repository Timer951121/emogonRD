import React from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import modelCar from '../assets/model/test.fbx';

import imgEnvPX from '../assets/images/px.png';
import imgEnvPY from '../assets/images/py.png';
import imgEnvPZ from '../assets/images/pz.png';
import imgEnvNX from '../assets/images/nx.png';
import imgEnvNY from '../assets/images/ny.png';
import imgEnvNZ from '../assets/images/nz.png';

const imgEnv0Arr = [imgEnvPX, imgEnvNX, imgEnvPY, imgEnvNY, imgEnvPZ, imgEnvNZ];

const tPosY = -2, testMode = false;

const stats = Stats()
document.body.appendChild(stats.dom)

export default class CanvasComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, selSize, selCol} = props;
		this.wheelArr = []; this.bodyMeshArr = []; this.lightMeshArr = [];
		this.state = {pageKey, rotate:1, selCol, selSize, envMode:'light'}; this.mouseStatus = 'none';
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
		['pageKey', 'rear', 'brake', 'selSize', 'selCol'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					if (key==='selCol') this.setColor();
					else if (key === 'rear' && this.rearGroup) this.rearGroup.visible = this.state.rear;
					else if (key === 'brake' && this.brakeGroup) this.brakeGroup.visible = this.state.brake;
				});
			}
		});
	}

	setEnvMode = () => {
		this.setState({envMode:this.state.envMode==='light'?'dark':'light'}, () => {
			const {envMode} = this.state, darkLight = 0.1;
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
		const planeMesh = new THREE.Mesh(planeGeo, planeMat); planeMesh.receiveShadow = true; planeMesh.position.y = tPosY;
		planeMesh.rotation.x = Math.PI / -2;
		this.totalGroup.add(planeMesh);
	}

	loadModel = () => {
		const envMap0 = new THREE.CubeTextureLoader().load(imgEnv0Arr);
		new FBXLoader().load( modelCar, (object) => {
			object.traverse(child => {
				if 	(child.name.includes('body')) {
					child.material = new THREE.MeshPhysicalMaterial({ clearcoat:0.9, envMap:envMap0, reflectivity:0, roughness:0, metalness:0 });
					// child.material = new THREE.MeshStandardMaterial({envMap:envMap0, reflectivity:0.9, metalness:0.4, roughness:0.5});
					this.bodyMeshArr.push(child);
				} else if (child.name.includes('Wheel')) {this.wheelArr.push(child); }
				if (child.name==='PLATTFORM') this.bottomMesh = child;
				else if (child.name === 'Rear') this.rearGroup = child;
				else if (child.name === 'Brake') this.brakeGroup = child;
				else if (child.name === 'FRONT_BLACK')
				child.material = new THREE.MeshPhysicalMaterial({clearcoat:0.9, color:0x000000, envMap:envMap0, reflectivity:1});
				// child.material = new THREE.MeshStandardMaterial({envMap:envMap0, reflectivity:0.9, color:0x151515, metalness:0.4, roughness:0.6});
				if (child instanceof THREE.Mesh) {
					child.material.side = 2;
					child.castShadow = true;
				}
				if (child.name.includes('glass')) {
					child.material = new THREE.MeshPhongMaterial({envMap:envMap0, transparent:true, opacity:0.3, side:0, color:0xFFFFFF, reflectivity:1});
				} else if (child.name.includes('emissive')) {
					child.oriCol = child.material.color.getHex();
					this.lightMeshArr.push(child);
					// child.material = new THREE.MeshBasicMaterial({color:colVal});
				}
			})
			const vPos = new THREE.Box3().setFromObject(object), vSize = vPos.getSize(), scl = 4/vSize.x;
			object.scale.set(scl, scl, scl);
			object.position.x = -2;
			object.position.y = tPosY;
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
				</div>
			</div>
		);
	}
}

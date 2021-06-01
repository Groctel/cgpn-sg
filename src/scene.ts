import * as $ from 'jquery';
import * as THREE from 'three';
import { GUI } from 'dat-gui';
import * as TWEEN from '@tweenjs/tween.js';

import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {JugadorPrimeraPersona} from '../Modelos/JugadorPrimeraPersona';
import {DropItem} from '../Modelos/DropItem';
import {ModelBase} from '../Modelos/ModelBase';

const SCENE_DEFAULTS = {
	AXES:            true,
	LIGHT_INTENSITY: 0.5,
};

class GameScene extends THREE.Scene
{
	axes: THREE.AxesHelper;
	properties: {
		axes: boolean,
		light_intensity: number,
		default: VoidFunction
	};
	gui: GUI;
	renderer: THREE.WebGLRenderer;
	camera: THREE.PerspectiveCamera;
	spotlight: THREE.SpotLight;

	player: JugadorPrimeraPersona;
	drop: DropItem;
	controls;

	constructor (canvas: string)
	{
		super();

		this.properties = {
			axes:            SCENE_DEFAULTS.AXES,
			light_intensity: SCENE_DEFAULTS.LIGHT_INTENSITY,

			default: () =>
			{
				this.properties.axes            = SCENE_DEFAULTS.AXES;
				this.properties.light_intensity = SCENE_DEFAULTS.LIGHT_INTENSITY;
			}
		};

		this.player = new JugadorPrimeraPersona();
		this.drop = new DropItem(new THREE.MeshBasicMaterial({color: 0xff0000}));

		this.renderer = this.constructRenderer(canvas);
		this.gui      = this.constructGUI();
		this.constructLights();
		this.constructCamera();


		this.axes = new THREE.AxesHelper (50);

		this.add(this.axes);
		this.add(this.drop);
		this.add(new THREE.GridHelper(100,100));

		this.drop.position.x += 4;
		this.drop.position.y += 1;

		this.add(this.player);

		this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
	}


	constructCamera (): void
	{
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.camera.position.set(0, 4.5, 0);
		//this.camera.lookAt(new THREE.Vector3(this.player.modelPosition().x, this.player.modelPosition().y, this.player.modelPosition().z));

		this.add(this.camera);

		this.camera.lookAt(0,4.5,0)
//		this.camera_control.target      = new THREE.Vector3(this.player.modelPosition().x, this.player.modelPosition().y, this.player.modelPosition().z);
	}

	constructGUI (): GUI
	{
		const gui    = new GUI();
		const folder = gui.addFolder("Lights and axes");

		folder
			.add(this.properties, 'light_intensity', 0, 1)
			.name("Light intensity");

		folder
			.add(this.properties, 'axes')
			.name("Show axes");

		return gui;
	}

	constructLights (): void
	{
		const light    = new THREE.AmbientLight(0xccddee, 0.35);
		this.spotlight = new THREE.SpotLight(
			0xffffff,
			this.properties.light_intensity
		);

		this.spotlight.position.set(60, 60, 40);

		this.add(light);
		this.add(this.spotlight);
	}

	constructRenderer (canvas: string): THREE.WebGLRenderer
	{
		const renderer = new THREE.WebGLRenderer();

		renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
		renderer.setSize(window.innerWidth, window.innerHeight);
		$(canvas).append(renderer.domElement);

		return renderer;
	}

	setCameraAspect (ratio: number): void
	{
		this.camera.aspect = ratio;
		this.camera.updateProjectionMatrix();
	}

	onWindowResize (): void
	{
		this.setCameraAspect(window.innerWidth / window.innerHeight);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	//Función para la detección de teclas pulsadas
	onKeyDown(event): void
	{
		var key = event.wich || event.keyCode;
		var keyC = String.fromCharCode(key);

		if(keyC == "W"){
	//		this.player.walkForwardStart();
			//this.camera.position.set(this.camera.position.x, this.camera.pddosition.y, this.camera.position.z+0.1);
			this.controls.moveForward(1)
		}

		if(keyC == "A"){
	//		this.player.walkLeftStart();
			//this.camera.position.set(this.camera.position.x+0.1, this.camera.position.y, this.camera.position.z);
			this.controls.moveRight(-1)
		}

		if(keyC == "S"){
	//		this.player.walkBackwardStart();
			//this.camera.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z-0.1);
			this.controls.moveForward(-1)
		}

		if(keyC == "D"){
	//		this.player.walkRightStart();
			//this.camera.position.set(this.camera.position.x-0.1, this.camera.position.y, this.camera.position.z);
			this.controls.moveRight(1)
		}

		if(keyC == "Q"){
			this.controls.lock();
		}


		this.update();
	}


	updateCamera(): void{
		this.player.position.set(
			this.camera.position.x + Math.sin(this.camera.rotation.y + Math.PI/6) *0.75,
			this.camera.position.y - 0.5 + Math.sin(4*(Date.now() * 0.0005) + this.camera.position.x + this.camera.position.z)*0.01,
			this.camera.position.z + Math.cos(this.camera.rotation.y + Math.PI/6) *0.75
		);

		this.player.rotation.set(
			this.camera.rotation.x,
			this.camera.rotation.y - Math.PI,
			this.camera.rotation.z
		);

	}

	update (): void
	{
		this.updateCamera();


		this.spotlight.intensity = this.properties.light_intensity;

		this.axes.visible = this.properties.axes;

		requestAnimationFrame(() => this.update());

		this.renderer.render(this, this.camera);
	}
}

export { GameScene };

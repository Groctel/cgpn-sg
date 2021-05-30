import * as $ from 'jquery';
import * as THREE from 'three';
import { GUI } from 'dat-gui';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import * as TWEEN from '@tweenjs/tween.js';

import {JugadorPrimeraPersona} from '../Modelos/JugadorPrimeraPersona';
import {Jugador} from '../Modelos/Jugador';
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
	camera_control: TrackballControls;

	player: JugadorPrimeraPersona;

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
		this.renderer = this.constructRenderer(canvas);
		this.gui      = this.constructGUI();
		this.constructLights();
		this.constructCamera();

		this.axes = new THREE.AxesHelper (50);

		this.add(this.axes);
		this.add(this.player);

	}

	constructCamera (): void
	{
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.camera.position.set(this.player.modelPosition().x, this.player.modelPosition().y+20, this.player.modelPosition().z-25);
		this.camera.up.set(0,1,0);
		this.camera.lookAt(new THREE.Vector3(this.player.modelPosition().x, this.player.modelPosition().y, this.player.modelPosition().z));

		this.add(this.camera);

		this.camera_control = new TrackballControls(
			this.camera,
			this.renderer.domElement
		);

		this.camera_control.rotateSpeed = 5;
		this.camera_control.zoomSpeed   = 2;
		this.camera_control.panSpeed    = 0.5;
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
			this.player.walkForwardStart();
		}

		if(keyC == "A"){
			this.player.walkLeftStart();
		}

		if(keyC == "S"){
			this.player.walkBackwardStart();
		}

		if(keyC == "D"){
			this.player.walkRightStart();
		}

		this.update();
	}

	onKeyUp(event): void
	{
		var key = event.wich || event.keyCode;
		var keyC = String.fromCharCode(key);

		if(keyC== "W"){
			this.player.walkForwardStop();
		}

		if(keyC == "A"){
			this.player.walkLeftStop();
		}

		if(keyC == "S"){
			this.player.walkBackwardStop();
		}

		if(keyC == "D"){
			this.player.walkRightStop();
		}
		this.update();
	}

	updateCamera(): void{
		var look = new THREE.Vector3(this.player.modelPosition().x, this.player.modelPosition().y, this.player.modelPosition().z);
		this.camera.position.set(this.player.modelPosition().x+25, this.player.modelPosition().y, this.player.modelPosition().z);
		this.camera.lookAt(look);
	}

	update (): void
	{
		this.player.update();
		this.updateCamera();
		this.renderer.render(this, this.camera);

		this.spotlight.intensity = this.properties.light_intensity;
		this.camera_control.update();

		this.axes.visible = this.properties.axes;

		requestAnimationFrame(() => this.update());

	}
}

export { GameScene };

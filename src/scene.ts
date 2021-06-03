import $ from 'jquery';
import * as THREE from 'three';
import { GUI } from 'dat-gui';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {JugadorPrimeraPersona} from '../Modelos/JugadorPrimeraPersona';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

import World from './world';

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
	playerModel: JugadorPrimeraPersona;
	player: THREE.Mesh;
	controls;

	world: World;
	world_size = 5;
	camera_control: TrackballControls;
	composer: EffectComposer;
	ssao_pass: SSAOPass;

	cubeGeo: THREE.BoxGeometry;
	cubeMesh: THREE.Mesh;

	raycaster: THREE.Raycaster;

	timeStep = 1/60;
	speed = 1.5;

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

		this.playerModel = new JugadorPrimeraPersona();

		this.renderer = this.constructRenderer(canvas);
		this.gui      = this.constructGUI();
		this.constructLights();
		this.constructCamera();

		this.axes = new THREE.AxesHelper (50);

		this.add(this.axes);
		this.add(new THREE.GridHelper(100,100));

		this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
		this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,1), 0, 1.5);

		this.playerModel.position.set(
			this.camera.position.x + 1.5,
			this.camera.position.y - 0.5,
			this.camera.position.z - 1.75
		);

		this.player = new THREE.Mesh();
		this.player.add(this.playerModel);

		this.add(this.player);
		this.world = new World(this);
		const light = new THREE.AmbientLight( 0x404040 ); // soft white light
		this.add(light);

		this.world = new World(this);
		this.composer = new EffectComposer(this.renderer);
		this.ssao_pass = new SSAOPass(this, this.camera, window.innerWidth, window.innerHeight);

		for (let z = 0; z < this.world_size; z++)
		{
			this.world[x][z] = new Chunk();
			this.add(this.world[x][z].generateTerrain()
				.translateX(x*Chunk.base)
				.translateZ(z*Chunk.base)
			);
		}

		this.ssao_pass.kernelRadius = 5;
		this.ssao_pass.minDistance  = 0.001;
		this.ssao_pass.maxDistance  = 0.1;

		this.composer.addPass(this.ssao_pass);
	}

	constructCamera (): void
	{
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.camera.position.set(0, 1.5, 0);

		this.add(this.camera);

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

		this.raycaster.ray.origin.copy(this.controls.getObject().position);
		this.raycaster.ray.origin.z -= 1.5;

		const intersection = this.raycaster.intersectObject(this.cubeMesh);

		var key = event.wich || event.keyCode;
		var keyC = String.fromCharCode(key);

		//El movimiento se efectua sobre la esfera para las físicas
		//Es necesario que se relaciones con la rotación de la cámara para que avanzar hacia adelante
		//con la w siempre sea el adelante de la cámara
		if(keyC == "W" && !(intersection.length > 0)){
			this.controls.moveForward(this.speed);
		}

		if(keyC == "A"){
			this.controls.moveRight(-this.speed);
		}

		if(keyC == "S"){
			this.controls.moveForward(-this.speed);
		}

		if(keyC == "D"){
			this.controls.moveRight(this.speed);
		}

		if(keyC == "Q"){
			this.controls.lock();
		}

		this.update();
	}

	updateCamera(): void{

		this.player.position.set(
			this.camera.position.x,
			this.camera.position.y - 1,
			this.camera.position.z
		);

		this.player.rotation.set(
			this.camera.rotation.x,
			this.camera.rotation.y,
			this.camera.rotation.z
		);

	}

	update (): void
	{
		this.updateCamera();

		// this.composer.render();
		this.spotlight.intensity = this.properties.light_intensity;

		this.axes.visible = this.properties.axes;

		requestAnimationFrame(() => this.update());

		this.renderer.render(this, this.camera);
	}
}

export { GameScene };

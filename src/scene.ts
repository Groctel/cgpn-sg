import $ from 'jquery';
import * as CANNON from 'cannon';
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
	controls: PointerLockControls;

	world: World;
	world_size = 5;
	worldMeshes: THREE.Object3D[];
	camera_control: TrackballControls;
	composer: EffectComposer;
	ssao_pass: SSAOPass;

	raycaster: THREE.Raycaster;

	raycasterY: THREE.Raycaster;
	raycasterYNeg: THREE.Raycaster;

	raycasterX: THREE.Raycaster;

	raycasterZ: THREE.Raycaster;

	movingForward: boolean;
	movingLeft: boolean;
	movingBackward: boolean;
	movingRight: boolean;

	direction: THREE.Vector3;

	speed: number;

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

		this.raycasterY = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,1,0), 0, 1);
		this.raycasterYNeg = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0), 0, 1);

		this.playerModel.position.set(
			this.camera.position.x + 1.5,
			this.camera.position.y - 1.2,
			this.camera.position.z - 1.75
		);

		this.player = new THREE.Mesh();
		this.player.add(this.playerModel);

		this.add(this.player);

		const light = new THREE.AmbientLight( 0x404040 ); // soft white light
		this.add(light);

		this.world = new World(this);
		this.composer = new EffectComposer(this.renderer);
		this.ssao_pass = new SSAOPass(this, this.camera, window.innerWidth, window.innerHeight);

		this.ssao_pass.kernelRadius = 5;
		this.ssao_pass.minDistance  = 0.001;
		this.ssao_pass.maxDistance  = 0.1;

		this.composer.addPass(this.ssao_pass);

		this.worldMeshes = new Array<THREE.Object3D>();
		this.worldMeshes = this.world.returnMeshes();

		this.direction = new THREE.Vector3();
		this.movingForward = false;
		this.movingLeft = false;
		this.movingRight = false;
		this.movingBackward = false;
		this.speed = 0.5;

		this.camera.position.y += 80;

	}

	constructCamera (): void
	{
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.camera.position.set(0, 1.8, 0);

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

		const key = event.wich || event.keyCode;
		const keyC = String.fromCharCode(key);

		//con la w siempre sea el adelante de la cámara
		if(keyC == "W" ){
			this.movingForward = true;
		}

		if(keyC == "A"){
			this.movingLeft = true;
		}

		if(keyC == "S"){
			this.movingBackward = true;
		}

		if(keyC == "D"){
			this.movingRight = true;
		}

		if(keyC == "Q"){
			this.controls.lock();
		}


		this.update();
	}

	onKeyUp(event): void
	{

		const key = event.wich || event.keyCode;
		const keyC = String.fromCharCode(key);

		//con la w siempre sea el adelante de la cámara
		if(keyC == "W" ){
			this.movingForward = false;
		}

		if(keyC == "A"){
			this.movingLeft = false;
		}

		if(keyC == "S"){
			this.movingBackward = false;
		}

		if(keyC == "D"){
			this.movingRight = false;
		}

		this.update();
	}

	updateCamera(): void
	{

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

	gravity(): void
	{

		let noObjectForward = true;
		let noObjectLeft = true;
		let noObjectRight = true;
		let noObjectBackward = true;

		const velocity = new THREE.Vector3(0,0,0);

		const directionVectorZ = new THREE.Vector3();
		this.controls.getDirection(directionVectorZ);
		directionVectorZ.y = 0;

		const directionVectorX = directionVectorZ;

		directionVectorX.applyAxisAngle(new THREE.Vector3(0,1,0), -90*(Math.PI/180));

		//Raycaster Para Movimiento en el eje Z de la cámara

		if(this.movingForward){

			this.raycasterZ = new THREE.Raycaster(new THREE.Vector3(), directionVectorZ, 0, 1);
			this.raycasterZ.ray.origin.copy(this.controls.getObject().position);
			this.raycasterZ.ray.origin.y -= 1;

			const intersectionZ = this.raycasterZ.intersectObjects(this.worldMeshes);

			if(intersectionZ.length > 0){
				noObjectForward = false;
			}

		}

		if(this.movingBackward){

			directionVectorZ.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI);

			this.raycasterZ = new THREE.Raycaster(new THREE.Vector3(), directionVectorZ, 0, 0.5);
			this.raycasterZ.ray.origin.copy(this.controls.getObject().position);
			this.raycasterZ.ray.origin.y -= 1;

			const intersectionZ = this.raycasterZ.intersectObjects(this.worldMeshes);

			if(intersectionZ.length > 0){
				noObjectBackward = false;
			}

		}
		//Raycaster para el movimiento en el eje X de la cámara

		if(this.movingRight){

			this.raycasterX = new THREE.Raycaster(new THREE.Vector3(), directionVectorX, 0, 0.5);
			this.raycasterX.ray.origin.copy(this.controls.getObject().position);
			this.raycasterX.ray.origin.y -= 1;

			const intersectionX = this.raycasterX.intersectObjects(this.worldMeshes);

			if(intersectionX.length > 0){
				noObjectRight = false;
			}

		}

		if(this.movingLeft){

			directionVectorX.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI);

			this.raycasterX = new THREE.Raycaster(new THREE.Vector3(), directionVectorX, 0, 1);
			this.raycasterX.ray.origin.copy(this.controls.getObject().position);
			this.raycasterX.ray.origin.y -= 1;

			const intersectionX = this.raycasterX.intersectObjects(this.worldMeshes);

			if(intersectionX.length > 0){
				noObjectLeft = false;
			}

		}
		//El raycaster de la gravedad siempre tiene que estar activado sin importar si el jugador
		//se mueve o no.

		this.raycasterYNeg.ray.origin.copy(this.controls.getObject().position);
		this.raycasterYNeg.ray.origin.y -= 1;
		this.raycasterYNeg.ray.origin.z -= 0.75;

		const intersectionFeetY = this.raycasterYNeg.intersectObjects(this.worldMeshes);

		if(intersectionFeetY.length > 0){

		}
		else{
			this.controls.getObject().position.y -= 1;
		}

		//Aquí se realiza el cálculo para el movimiento

		this.direction.z = Number(this.movingForward)*Number(noObjectForward) - Number(this.movingBackward)*Number(noObjectBackward);
		this.direction.x = Number(this.movingRight)*Number(noObjectRight) - Number(this.movingLeft)*Number(noObjectLeft);
		this.direction.normalize();

		if(this.movingForward || this.movingBackward){
			velocity.z = this.direction.z * this.speed;
		}
		if(this.movingLeft || this.movingRight){
			velocity.x = this.direction.x * this.speed;
		}

		this.controls.moveForward(velocity.z);
		this.controls.moveRight(velocity.x);

	}

	update (): void
	{


		// this.composer.render();
		this.gravity();
		this.spotlight.intensity = this.properties.light_intensity;

		this.updateCamera();

		this.axes.visible = this.properties.axes;
		this.renderer.render(this, this.camera);

		requestAnimationFrame(() => this.update());
	}
}

export { GameScene };

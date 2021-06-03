import * as $ from 'jquery';
import * as THREE from 'three';
import { GUI } from 'dat-gui';
import * as CANNON from 'cannon';

import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {JugadorPrimeraPersona} from '../Modelos/JugadorPrimeraPersona';
import {DropItem} from '../Modelos/DropItem';

import Chunk from './chunk';

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
	drop: DropItem;
	controls;
	cannonWorld: CANNON.World;

	world: Array<Array<Chunk>>;
	world_size = 5;

	body: CANNON.Body;
	shape: CANNON.Box;

	cubeBody: CANNON.Body;
	cubeshape: CANNON.Box;

	cubeGeo: THREE.BoxGeometry;
	cubeMesh: THREE.Mesh;

	timeStep = 1/60;
	speed = 1.5;

	//Fricción
	contactMaterial: CANNON.ContactMaterial;
	physicsMaterial: CANNON.Material;

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



		this.drop = new DropItem(new THREE.MeshBasicMaterial({color: 0xff0000}));

		this.renderer = this.constructRenderer(canvas);
		this.gui      = this.constructGUI();
		this.constructLights();
		this.constructCamera();
		this.constructCannon();

		this.axes = new THREE.AxesHelper (50);

		this.add(this.axes);
		this.add(this.drop);
		this.add(new THREE.GridHelper(100,100));

		this.drop.position.x += 4;
		this.drop.position.y += 1;

		this.controls = new PointerLockControls(this.camera, this.renderer.domElement);

		this.playerModel.position.set(
			this.camera.position.x + 1.5,
			this.camera.position.y - 0.5,
			this.camera.position.z - 1.75
		);

		this.player = new THREE.Mesh();
		this.player.add(this.playerModel);

		this.add(this.player);
/*		this.world = new Array<Array<Chunk>>(this.world_size);

		for (let x = 0; x < this.world_size; x++)
		{
			this.world[x] = new Array<Chunk>(this.world_size);

			for (let z = 0; z < this.world_size; z++)
			{
				this.world[x][z] = new Chunk();
				this.add(this.world[x][z].generateTerrain()
					.translateX(x*Chunk.base)
					.translateZ(z*Chunk.base)
				);
			}
		}*/

		this.cubeGeo = new THREE.BoxGeometry(5,5,5);
		this.cubeMesh = new THREE.Mesh(this.cubeGeo, new THREE.MeshBasicMaterial({color:0xffff00}));

		this.add(this.cubeMesh);

	}

	constructCannon() : void
	{
		this.cannonWorld = new CANNON.World();
		this.cannonWorld.gravity.set(0,-10,0);

		//Inicializamos la fricción
		this.physicsMaterial = new CANNON.Material("slipperyMaterial");
		this.contactMaterial = new CANNON.ContactMaterial(
			this.physicsMaterial,
			this.physicsMaterial
		);

		this.cannonWorld.addContactMaterial(this.contactMaterial);

		this.body = new CANNON.Body({ mass: 10, material: this.physicsMaterial});
		this.shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
		this.body.addShape(this.shape);
		this.cannonWorld.addBody(this.body);

		const plane = new CANNON.Body({mass: 0, material: this.physicsMaterial}); //Masa 0= estático
		const shapeP = new CANNON.Plane();
		plane.addShape(shapeP);

		this.cubeBody = new CANNON.Body({mass: 0, material: this.physicsMaterial});
		this.cubeshape = new CANNON.Box(new CANNON.Vec3(5,5,5));

		this.cubeBody.addShape(this.cubeshape);


		this.cannonWorld.addBody(plane);
		this.cannonWorld.addBody(this.cubeBody);

		plane.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2); // Rotamos el plano

		this.body.position.y += 0.5;
		this.cubeBody.position.y += 2.5;
		this.cubeBody.position.z += 15;
		this.cubeBody.position.x += 15;

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
		var key = event.wich || event.keyCode;
		var keyC = String.fromCharCode(key);

		//El movimiento se efectua sobre la esfera para las físicas
		//Es necesario que se relaciones con la rotación de la cámara para que avanzar hacia adelante
		//con la w siempre sea el adelante de la cámara
		if(keyC == "W"){
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

		if(key == 32 && this.body.velocity.y <= 0.0){
			this.body.applyImpulse(new CANNON.Vec3(0,360,0), this.body.position);
		}

		this.body.position.x = this.camera.position.x;
		this.body.position.z = this.camera.position.z;

		this.update();
	}

	updatePhysics(){
		this.cannonWorld.step(this.timeStep);

		console.log(this.body.velocity.y);

		this.camera.position.set(
			this.body.position.x,
			this.body.position.y + 3.5,
			this.body.position.z
		);

		this.cubeMesh.position.set(
			this.cubeBody.position.x,
			this.cubeBody.position.y,
			this.cubeBody.position.z,
		);

	}

	updateCamera(): void{

		this.player.position.set(
			this.camera.position.x,
			this.camera.position.y - 4.5,
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
		this.updatePhysics();

		this.spotlight.intensity = this.properties.light_intensity;

		this.axes.visible = this.properties.axes;

		requestAnimationFrame(() => this.update());

		this.renderer.render(this, this.camera);
	}
}

export { GameScene };

import $ from 'jquery';
import * as THREE from 'three';

import { Cube } from './cubes';
import Player from './player';
import World from './world';

export default class GameScene extends THREE.Scene
{
	private static cast_direction = new THREE.Vector3();
	private static direction = new THREE.Vector3();
	private static raycaster = new THREE.Raycaster(
		new THREE.Vector3(), GameScene.direction, 0, 10
	);

	public static renderer = new THREE.WebGLRenderer();

	constructor (canvas: string)
	{
		super();

		this.constructRenderer(canvas);
		this.constructLights();

		new World(this);
		Player.spawn(this);
		this.add(Player.camera);
	}

	private static intersectRaycaster (): THREE.Intersection[]
	{
		Player.camera.getWorldDirection(GameScene.cast_direction);
		GameScene.raycaster.set(Player.position, GameScene.cast_direction);
		return GameScene.raycaster.intersectObjects(Player.cast_meshes);
	}

	public static addCube (cube: Cube): void
	{
		const intersection = GameScene.intersectRaycaster();

		if (intersection.length > 0)
		{
			const cube_position = intersection[0].point;
			const orientation   = intersection[0].face.normal;

			cube_position.add(orientation);

			World.addCube(cube_position, cube);
			Player.updateCastMeshes();
		}
	}

	public static delCube (): void
	{
		const intersection = GameScene.intersectRaycaster();

		if (intersection.length > 0)
		{
			const cube_position = intersection[0].point;

			World.delCube(cube_position);
			Player.updateCastMeshes();
		}
	}

	private constructLights (): void
	{
		const light     = new THREE.AmbientLight(0xccddee, 1);
		const spotlight = new THREE.SpotLight(0xffffff, 1);

		spotlight.position.set(0, 100, 0);

		this.add(light);
		this.add(spotlight);
	}

	private constructRenderer (canvas: string): void
	{
		GameScene.renderer = new THREE.WebGLRenderer();
		GameScene.renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
		GameScene.renderer.setSize(window.innerWidth, window.innerHeight);
		$(canvas).append(GameScene.renderer.domElement);
	}

	public update (): void
	{
		Player.updatePosition();
		GameScene.renderer.render(this, Player.camera);

		requestAnimationFrame(() => this.update());
	}
}

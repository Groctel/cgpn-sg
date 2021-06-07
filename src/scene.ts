import $ from 'jquery';
import * as THREE from 'three';

import { Block } from './blocks';
import Player from './player';
import World from './world';

export default class GameScene extends THREE.Scene
{
	public static renderer = new THREE.WebGLRenderer();

	private static direction = new THREE.Vector3();
	private static raycaster = new THREE.Raycaster(
		new THREE.Vector3(), GameScene.direction, 0, 10
	);
	private static cast_direction = new THREE.Vector3();

	constructor (canvas: string)
	{
		super();

		this.constructRenderer(canvas);
		this.constructLights();

		new World(this);
		Player.spawn(this);
		this.add(Player.camera);
	}

	constructLights (): void
	{
		const light     = new THREE.AmbientLight(0xccddee, 1);
		const spotlight = new THREE.SpotLight(0xffffff, 1);

		spotlight.position.set(0, 100, 0);

		this.add(light);
		this.add(spotlight);
	}

	private static intersectRaycaster (): THREE.Intersection[]
	{
		Player.camera.getWorldDirection(GameScene.cast_direction);
		GameScene.raycaster.set(Player.position, GameScene.cast_direction);
		return GameScene.raycaster.intersectObjects(Player.cast_meshes);
	}

	public static addBlock (block: Block): void
	{
		const intersection = GameScene.intersectRaycaster();

		if (intersection.length > 0)
		{
			const cube_position = intersection[0].point;
			const orientation   = intersection[0].face.normal;

			cube_position.add(orientation);

			World.addBlock(cube_position, block);
			Player.updateCastMeshes();
		}
	}

	public static delBlock (): void
	{
		const intersection = GameScene.intersectRaycaster();

		if (intersection.length > 0)
		{
			const cube_position = intersection[0].point;

			World.delBlock(cube_position);
			Player.updateCastMeshes();
		}
	}

	constructRenderer (canvas: string): void
	{
		GameScene.renderer = new THREE.WebGLRenderer();
		GameScene.renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
		GameScene.renderer.setSize(window.innerWidth, window.innerHeight);
		$(canvas).append(GameScene.renderer.domElement);
	}

	update (): void
	{
		Player.updatePosition();
		GameScene.renderer.render(this, Player.camera);

		requestAnimationFrame(() => this.update());
	}
}

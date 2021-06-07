import $ from 'jquery';
import * as THREE from 'three';

import { Block, Blocks } from './blocks';
import Player from './player';
import World from './world';

export default class GameScene extends THREE.Scene
{
	public static renderer = new THREE.WebGLRenderer();

	public static selectedBlock: Block;
	private static direction = new THREE.Vector3();
	private static raycaster = new THREE.Raycaster(
		new THREE.Vector3(), GameScene.direction, 0, 10
	);

	constructor (canvas: string)
	{
		super();

		this.constructRenderer(canvas);
		this.constructLights();

		GameScene.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,1,0), 0, 10);

		GameScene.selectedBlock = Blocks.bedrock;

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

	public static addBlock (block: Block): void
	{
		Player.camera.getWorldDirection(GameScene.direction);
		GameScene.raycaster.set(Player.position, GameScene.direction);

		const intersection = GameScene.raycaster.intersectObjects(Player.cast_meshes);

		if (intersection.length > 0)
		{
			const cube_position = intersection[0].point;
			const orientation   = intersection[0].face.normal;

			if (block === Blocks.air)
			{
				orientation.y = 0;
				cube_position.sub(orientation);
			}
			else
			{
				cube_position.add(orientation);
			}

			World.addBlock(cube_position, block);
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

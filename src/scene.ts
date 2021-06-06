import $ from 'jquery';
import * as THREE from 'three';

import { Block, Blocks } from './blocks';
import Player from './player';
import World from './world';

export default class GameScene extends THREE.Scene
{
	public static renderer = new THREE.WebGLRenderer();

	private world: World;
	private selectedBlock: Block;
	private raycaster: THREE.Raycaster;
	private worldMeshes: THREE.Mesh[];

	constructor (canvas: string)
	{
		super();

		this.constructRenderer(canvas);
		this.constructLights();

		this.world = new World(this);

		this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,1,0), 0, 16);

		this.world = new World(this);
		this.add(Player.camera);
		Player.spawn();

		this.worldMeshes = new Array<THREE.Mesh>();
		this.recalculate();

		this.selectedBlock = Blocks.bedrock;

		Player.spawn();
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

	onDocumentMouseDown (event: MouseEvent): void
	{
		switch(event.button)
		{
		case 0:
			this.putBlock(Blocks.air);
			break;

		case 2:
			this.putBlock(this.selectedBlock);
			break;
		}
	}

	putBlock (block: Block): void
	{
		const directionVector = new THREE.Vector3();
		Player.camera.getWorldDirection(directionVector);

		this.raycaster = new THREE.Raycaster(new THREE.Vector3(), directionVector, 0, 16);
		this.raycaster.ray.origin.copy(Player.position);

		const intersection = this.raycaster.intersectObjects(this.worldMeshes);

		if(intersection.length >0){
			const x = intersection[0].point.x;
			const y = Math.ceil(intersection[0].point.y);
			const z = intersection[0].point.z;

			const chunkX = intersection[0].object.position.x;
			const chunkZ = intersection[0].object.position.z;


			this.world.putBlock(chunkX, chunkZ, x, y, z, block);
		}
	}

	recalculate (): void
	{
		this.worldMeshes = this.world.returnMeshesRelativePosition(Player.position.x, Player.position.z);
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

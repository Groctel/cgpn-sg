import $ from 'jquery';
import * as THREE from 'three';

import { Block, Blocks } from './blocks';
import { AdyChunks, Chunk } from './chunk';
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
		this.recalculate();
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
			const cube_position = new THREE.Vector3();
			const orientation = intersection[0].face.normal;

			if(block == Blocks.air){
				cube_position.copy(intersection[0].point).sub(new THREE.Vector3(orientation.x, 0, orientation.z));
			}
			else{
				cube_position.copy(intersection[0].point).add(orientation);
			}

			const chunk = intersection[0].object.position;

			this.world.putBlock(chunk, cube_position, block);
		}
	}

	constructRenderer (canvas: string): void
	{
		GameScene.renderer = new THREE.WebGLRenderer();
		GameScene.renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
		GameScene.renderer.setSize(window.innerWidth, window.innerHeight);
		$(canvas).append(GameScene.renderer.domElement);
	}

	recalculate (): void
	{
		this.worldMeshes = this.world.returnMeshesRelativePosition(Player.position.x, Player.position.z);
	}

	update (): void
	{
		Player.updatePosition();
		GameScene.renderer.render(this, Player.camera);

		requestAnimationFrame(() => this.update());
	}
}

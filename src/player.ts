import * as THREE from 'three';

import { AdyChunks, Chunk } from './chunk';
import { Block, Blocks} from './block';
import World from './world';

const y_axis = new THREE.Vector3(0, 1, 0);

export default class Player
{
	// private materialUp = new THREE.MeshNormalMaterial();
	// private material = new THREE.MeshBasicMaterial({color:0xff0000});
	// private geometria = new THREE.BoxGeometry(1, 1, 1);

	// private character: THREE.Object3D;
	// private brazoAparte: THREE.Object3D;
	// private brazoDch: THREE.Object3D;
	// private cubo: THREE.Mesh;

	private static speed       = 0.15;
	private static fall_speed  = 0;
	private static front_speed = 0;
	private static right_speed = 0;
	private static jump_stage  = 0;

	private static look       = new THREE.Vector3(0, 0, 0);
	private static next_block  = new THREE.Vector3(0, 0, 0);
	private static next_step  = new THREE.Vector3(0, 0, 0);
	private static step_fwd   = new THREE.Vector3(0, 0, 0);
	private static step_side  = new THREE.Vector3(0, 0, 0);
	private static curr_block = new THREE.Vector3(0, 0, 0);
	private static curr_chunk = new THREE.Vector3(-1, 0, -1);

	private static ady_chunks: AdyChunks;
	private static chunk: Chunk;

	private static geometry = new THREE.BoxGeometry(1,1,1);
	private static material= new THREE.MeshPhongMaterial({color: 0xffff00});

	private static cubo = new THREE.Mesh();
	private static player_mod = new THREE.Mesh();
	private static scene: THREE.Scene;

	public static camera = new THREE.PerspectiveCamera(
		80,
		window.innerWidth / window.innerHeight,
		0.01,
		1000
	);
	public static position  = Player.camera.position;
	public static direction = new THREE.Vector3(0, 0, 0);

	constructor ()
	{
		//Creamos el brazo
		// Player.brazoDch = new THREE.Mesh(Player.geometria, Player.material);
		// Player.brazoDch.scale.x *=0.75;
		// Player.brazoDch.scale.y *=3;
		// Player.brazoDch.scale.z *=0.75;

		// Player.brazoDch.position.y -= 1.3;

		// Player.brazoAparte = new THREE.Object3D();

		// Player.brazoAparte.add(Player.brazoDch);
		// Player.brazoAparte.rotation.x = 70*(Math.PI/180);

		////Creamos El cubo que señala el objeto que sujeta el jugador
		// Player.character.add(Player.cubo);
		// Player.add(Player.character);
	}

	private static generateModel(): void
	{
		Player.cubo = new THREE.Mesh(Player.geometry,Player.material);
		Player.cubo.scale.x *=0.75;
		Player.cubo.scale.y *=0.75;
		Player.cubo.scale.z *=0.75;

		Player.cubo.position.z -= 1.7;
		Player.cubo.position.y -= 0.5;
		Player.cubo.position.x += 0.5;


		Player.player_mod.add(Player.cubo);
		Player.scene.add(Player.player_mod);

	}

	private static generateCubeTextures (block: Block): number[]
	{
		const uvs = new Array<Array<number>>(24);

		uvs.push(block.uv_side);
		uvs.push(block.uv_side);
		uvs.push(block.uv_top);
		uvs.push(block.uv_bottom);
		uvs.push(block.uv_side);
		uvs.push(block.uv_side);

		return uvs.flat();
	}

	private static willCollideAt (x: number, z: number, y: number): boolean
	{
		let collide = true;

		if (
			x >= 0 && x < Chunk.base &&
			z >= 0 && z < Chunk.base &&
			y >= 0 && y < Chunk.height
		) {
			collide = Player.chunk.struct()[x][z][y].attrs.solid;
		}
		else if (x < 0)
		{
			if (z < 0)
				collide = Player.ady_chunks.nxnz === null
					? true
					: Player.ady_chunks.nxnz.struct()[Chunk.base+x][Chunk.base+z][y].attrs.solid;
			else
				collide = Player.ady_chunks.nx === null
					? true
					: Player.ady_chunks.nx.struct()[Chunk.base+x][z][y].attrs.solid;
		}
		else if (x >= Chunk.base)
		{
			if (z >= Chunk.base)
				collide = Player.ady_chunks.pxpz === null
					? true
					: Player.ady_chunks.pxpz.struct()[x-Chunk.base][z-Chunk.base][y].attrs.solid;
			else
				collide = Player.ady_chunks.px === null
					? true
					: Player.ady_chunks.px.struct()[x-Chunk.base][z][y].attrs.solid;
		}
		else if (z < 0)
		{
			if (x >= Chunk.base)
				collide = Player.ady_chunks.pxnz === null
					? true
					: Player.ady_chunks.pxnz.struct()[x-Chunk.base][Chunk.base-z][y].attrs.solid;
			else
				collide = Player.ady_chunks.nz === null
					? true
					: Player.ady_chunks.nz.struct()[x][Chunk.base-z][y].attrs.solid;
		}
		else if (z >= Chunk.base)
		{
			if (x < 0)
				collide = Player.ady_chunks.nxpz === null
					? true
					: Player.ady_chunks.nxpz.struct()[Chunk.base-x][z-Chunk.base][y].attrs.solid;
			else
				collide = Player.ady_chunks.pz === null
					? true
					: Player.ady_chunks.pz.struct()[x][z-Chunk.base][y].attrs.solid;
		}

		return collide;
	}

	private static updatePositionAgainstCollisions (): void
	{
		Player.step_fwd = Player.look.clone()
			.multiplyScalar(Player.front_speed);

		Player.step_side = Player.look.clone()
			.applyAxisAngle(y_axis, Math.PI/2)
			.multiplyScalar(Player.right_speed);

		Player.next_step.addVectors(Player.step_fwd, Player.step_side);
		Player.next_block.addVectors(Player.curr_block, Player.next_step);

		if (Player.jump_stage > 0)
		{
			Player.fall_speed -= Math.sin(Player.jump_stage) * 0.01;
			Player.jump_stage += 0.1;

			if (Player.jump_stage > Math.PI + 0.2)
				Player.jump_stage = 0;
		}
		else
		{
			if (!Player.willCollideAt(
				~~Player.curr_block.x,
				~~Player.curr_block.z,
				~~(Player.position.y-1.3)
			)) {
				if (Player.fall_speed > 0 && Player.fall_speed <= 1.5)
					Player.fall_speed += World.gravity * Player.fall_speed;
				else
					Player.fall_speed = 0.15;
			}
			else
			{
				Player.fall_speed = 0;

				if (Player.willCollideAt(
					~~Player.curr_block.x,
					~~Player.curr_block.z,
					~~Player.position.y-1
				)) {
					Player.position.y += 1;
				}
			}

			if (Player.willCollideAt(
				~~Player.next_block.x,
				~~Player.next_block.z,
				~~Player.position.y-1
			)) {
				Player.next_step.setScalar(0);
			}
		}

		Player.next_step.y = -Player.fall_speed;

		Player.position.add(Player.next_step);
	}

	private static updateWorldPosition (): void
	{
		const curr_chunk = Player.position.clone()
			.divideScalar(Chunk.base)
			.addScalar(World.size/2);

		const x_chunk = ~~curr_chunk.x;
		const z_chunk = ~~curr_chunk.z;

		if (
			x_chunk !== Player.curr_chunk.x ||
			z_chunk !== Player.curr_chunk.z
		) {
			Player.ady_chunks   = World.adyChunksAt(x_chunk, z_chunk);
			Player.chunk        = World.chunkAt(x_chunk, z_chunk);
			Player.curr_chunk.x = x_chunk;
			Player.curr_chunk.z = z_chunk;
		}

		Player.curr_block.x = (curr_chunk.x - x_chunk) * Chunk.base + 0.5;
		Player.curr_block.z = (curr_chunk.z - z_chunk) * Chunk.base + 0.5;
	}

	public static moveForward     (): void { Player.front_speed =  Player.speed; }
	public static moveBackwards   (): void { Player.front_speed = -Player.speed; }
	public static moveLeft        (): void { Player.right_speed =  Player.speed; }
	public static moveRight       (): void { Player.right_speed = -Player.speed; }
	public static stopMovingFront (): void { Player.front_speed = 0; }
	public static stopMovingSide  (): void { Player.right_speed = 0; }

	public static jump (): void
	{
		if (Player.willCollideAt(
			~~Player.curr_block.x,
			~~Player.curr_block.z,
			~~(Player.position.y-1.3)
		)) {
			Player.jump_stage = Math.PI / 2 + 0.5;
			Player.fall_speed = -Math.sin(Player.jump_stage) * 0.1;
		}
	}

	public static spawn (sce: THREE.Scene): void
	{
		Player.position.set(0, 23, 0);
		Player.updateWorldPosition();
		Player.scene = sce;
		Player.generateModel();
	}

	public static updatePosition (): void
	{
		Player.camera.getWorldDirection(Player.look);
		Player.look.y = 0;
		Player.look.normalize();

		Player.updatePositionAgainstCollisions();
		Player.updateWorldPosition();

		Player.player_mod.position.set(
			Player.camera.position.x,
			Player.camera.position.y,
			Player.camera.position.z
		);

		Player.player_mod.rotation.set(
			Player.camera.rotation.x,
			Player.camera.rotation.y,
			Player.camera.rotation.z
		);
	}
}

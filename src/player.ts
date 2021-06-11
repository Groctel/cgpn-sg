import * as THREE from 'three';

import { AdyChunks, Chunk } from './chunk';
import { Cube, Cubes } from './cubes';
import Textures from './textures';
import World from './world';

const y_axis = new THREE.Vector3(0, 1, 0);

export default class Player
{
	private static speed       = 0.075;
	private static fall_speed  = 0;
	private static front_speed = 0;
	private static right_speed = 0;
	private static jump_stage  = 0;

	private static look       = new THREE.Vector3(0, 0, 0);
	private static next_cube  = new THREE.Vector3(0, 0, 0);
	private static next_step  = new THREE.Vector3(0, 0, 0);
	private static step_fwd   = new THREE.Vector3(0, 0, 0);
	private static step_side  = new THREE.Vector3(0, 0, 0);
	private static curr_cube  = new THREE.Vector3(0, 0, 0);
	private static curr_chunk = new THREE.Vector3(-1, 0, -1);

	private static ady_chunks: AdyChunks;
	private static chunk: Chunk;

	private static cube_geometry = new THREE.BoxBufferGeometry(0.4, 0.4, 0.4);
	private static cube_mesh     = new THREE.Mesh();
	private static player_mod    = new THREE.Mesh();
	private static scene: THREE.Scene;

	public static readonly cast_meshes = new Array<THREE.Mesh>(9);
	public static camera = new THREE.PerspectiveCamera(
		80,
		window.innerWidth / window.innerHeight,
		0.01,
		1000
	);
	public static position  = Player.camera.position;
	public static direction = new THREE.Vector3(0, 0, 0);

	private static generateCubeTextures (cube: Cube): number[]
	{
		const uvs = new Array<Array<number>>(24);

		uvs.push(cube.uv_side);
		uvs.push(cube.uv_side);
		uvs.push(cube.uv_top);
		uvs.push(cube.uv_bottom);
		uvs.push(cube.uv_side);
		uvs.push(cube.uv_side);

		return uvs.flat();
	}

	private static generateModel (cube: Cube): void
	{
		Player.cube_geometry.setAttribute('uv', new THREE.BufferAttribute(
			new Float32Array(Player.generateCubeTextures(cube)), 2
		));

		Player.cube_mesh = new THREE.Mesh(
			Player.cube_geometry,
			Textures.material
		);
		Player.cube_mesh.position.set(0.4, -0.4, -0.4);

		Player.player_mod.add(Player.cube_mesh);
		Player.scene.add(Player.player_mod);
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
		Player.next_cube.addVectors(Player.curr_cube, Player.next_step);

		if (Player.jump_stage > 0)
		{
			if (!Player.willCollideAt(
				~~Player.curr_cube.x,
				~~Player.curr_cube.z,
				~~(Player.position.y+1)
			)) {
				Player.fall_speed -= Math.sin(Player.jump_stage) * 0.01;
				Player.jump_stage += 0.1;

				if (Player.jump_stage > Math.PI + 0.2)
					Player.jump_stage = 0;
			}
			else
			{
				Player.jump_stage = 0;
			}
		}
		else
		{
			if (!Player.willCollideAt(
				~~Player.curr_cube.x,
				~~Player.curr_cube.z,
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
					~~Player.curr_cube.x,
					~~Player.curr_cube.z,
					~~Player.position.y-1
				)) {
					Player.position.y += 1;
				}
			}

			if (
				Player.willCollideAt(
					~~Player.next_cube.x,
					~~Player.next_cube.z,
					~~Player.position.y-1
				) ||
				Player.willCollideAt(
					~~Player.next_cube.x,
					~~Player.next_cube.z,
					~~Player.position.y
				)
			) {
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
			Player.updateCastMeshes();
		}

		Player.curr_cube.x = (curr_chunk.x - x_chunk) * Chunk.base + 0.5;
		Player.curr_cube.z = (curr_chunk.z - z_chunk) * Chunk.base + 0.5;
	}

	public static updateCastMeshes (): void
	{
		Player.cast_meshes.length = 0;

		Player.cast_meshes[0] = World.meshAt(Player.curr_chunk.x, Player.curr_chunk.z);

		const mesh_px   = World.meshAt(Player.curr_chunk.x+1, Player.curr_chunk.z);
		const mesh_nx   = World.meshAt(Player.curr_chunk.x-1, Player.curr_chunk.z);
		const mesh_pz   = World.meshAt(Player.curr_chunk.x,   Player.curr_chunk.z+1);
		const mesh_nz   = World.meshAt(Player.curr_chunk.x,   Player.curr_chunk.z-1);
		const mesh_pxpz = World.meshAt(Player.curr_chunk.x+1, Player.curr_chunk.z+1);
		const mesh_pxnz = World.meshAt(Player.curr_chunk.x+1, Player.curr_chunk.z-1);
		const mesh_nxpz = World.meshAt(Player.curr_chunk.x-1, Player.curr_chunk.z+1);
		const mesh_nxnz = World.meshAt(Player.curr_chunk.x-1, Player.curr_chunk.z-1);

		if (mesh_px !== null)
			Player.cast_meshes.push(mesh_px);
		if (mesh_nx !== null)
			Player.cast_meshes.push(mesh_nx);
		if (mesh_pz !== null)
			Player.cast_meshes.push(mesh_pz);
		if (mesh_nz !== null)
			Player.cast_meshes.push(mesh_nz);
		if (mesh_pxpz !== null)
			Player.cast_meshes.push(mesh_pxpz);
		if (mesh_pxnz !== null)
			Player.cast_meshes.push(mesh_pxnz);
		if (mesh_nxpz !== null)
			Player.cast_meshes.push(mesh_nxpz);
		if (mesh_nxnz !== null)
			Player.cast_meshes.push(mesh_nxnz);
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
			~~Player.curr_cube.x,
			~~Player.curr_cube.z,
			~~(Player.position.y-1.3)
		)) {
			Player.jump_stage = Math.PI / 2 + 0.5;
			Player.fall_speed = -Math.sin(Player.jump_stage) * 0.1;
		}
	}

	public static spawn (scene: THREE.Scene): void
	{
		Player.position.set(0, 23, 0);
		Player.updateWorldPosition();
		Player.scene = scene;
		Player.generateModel(Cubes.brick);
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

	public static updateCube (cube: Cube): void
	{
		Player.generateModel(cube);
	}
}

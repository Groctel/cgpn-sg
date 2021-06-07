import * as THREE from 'three';

import { AdyChunks, Chunk } from './chunk';
import { Cube } from './cubes';
import ChunkBuilder from './chunk_builder';
import Sky from './sky';

export default class World
{
	private static builders:  ChunkBuilder[][];
	private static meshes:    THREE.Mesh[][];
	private static scene:     THREE.Scene;
	private static structure: Chunk[][];
	private static sky:       Sky;

	public static readonly size = 5;
	public static readonly gravity = 0.04;

	constructor (scene: THREE.Scene)
	{
		World.scene     = scene;
		World.structure = new Array<Array<Chunk>>(World.size);
		World.builders  = new Array<Array<ChunkBuilder>>(World.size);
		World.sky       = new Sky(World.size * Chunk.base);
		World.meshes    = new Array<Array<THREE.Mesh>>(World.size);

		scene.add(World.sky.mesh());

		for (let x = 0; x < World.size; x++)
		{
			World.builders[x]  = new Array<ChunkBuilder>(World.size);
			World.meshes[x]    = new Array<THREE.Mesh>(World.size);
			World.structure[x] = new Array<Chunk>(World.size);

			for (let z = 0; z < World.size; z++)
				World.generateStructure(x, z);
		}

		for (let x = 0; x < World.size; x++)
			for (let z = 0; z < World.size; z++)
				World.buildStructure(x, z);
	}

	private static buildStructure (x: number, z: number): void
	{
		const ady_chunks = new AdyChunks(
			x+1 < World.size ? World.structure[x+1][z] : null,
			x-1 >= 0         ? World.structure[x-1][z] : null,
			z+1 < World.size ? World.structure[x][z+1] : null,
			z-1 >= 0         ? World.structure[x][z-1] : null,
			x+1 < World.size && z+1 < World.size ? World.structure[x+1][z+1] : null,
			x+1 < World.size && z-1 >= 0         ? World.structure[x+1][z-1] : null,
			x-1 >= 0         && z+1 < World.size ? World.structure[x-1][z+1] : null,
			x-1 >= 0         && z-1 >= 0         ? World.structure[x-1][z-1] : null
		);

		World.builders[x][z] = new ChunkBuilder(World.structure[x][z], ady_chunks);

		World.scene.add(World.builders[x][z].chunkMesh()
			.translateX(x * Chunk.base - (Chunk.base * World.size) / 2)
			.translateZ(z * Chunk.base - (Chunk.base * World.size) / 2)
		);

		World.meshes[x][z] = World.builders[x][z].chunkMesh();
	}

	private static renewStructure (x: number, z: number): void
	{
		World.scene.remove(World.meshes[x][z]);
		World.builders[x][z].generateMesh();
		World.scene.add(World.builders[x][z].chunkMesh()
			.translateX(x * Chunk.base - (Chunk.base * World.size) / 2)
			.translateZ(z * Chunk.base - (Chunk.base * World.size) / 2)
		);
		World.meshes[x][z] = World.builders[x][z].chunkMesh();
	}

	private static generateStructure (x: number, z: number): void
	{
		World.structure[x][z] = new Chunk(x, z, World.size);
	}

	public static addCube (pos: THREE.Vector3, cube: Cube): void
	{
		const chunk_x = ~~((pos.x + (World.size * Chunk.base)/2)/Chunk.base);
		const chunk_z = ~~((pos.z + (World.size * Chunk.base)/2)/Chunk.base);
		const cube_x = ~~(pos.x + (World.size * Chunk.base)/2) % Chunk.base;
		const cube_z = ~~(pos.z + (World.size * Chunk.base)/2) % Chunk.base;

		const selected_cube = World.structure[chunk_x][chunk_z].struct()[cube_x][cube_z][~~pos.y];

		if (selected_cube.attrs.empty || selected_cube.attrs.x_shaped)
		{
			World.structure[chunk_x][chunk_z].addCube(cube_x, cube_z, ~~pos.y, cube);
			World.renewStructure(chunk_x, chunk_z);
		}
	}

	public static delCube (pos: THREE.Vector3): void
	{
		const chunk_x = ~~((pos.x + (World.size * Chunk.base)/2)/Chunk.base);
		const chunk_z = ~~((pos.z + (World.size * Chunk.base)/2)/Chunk.base);
		const cube_x = ~~(pos.x + (World.size * Chunk.base)/2) % Chunk.base;
		const cube_z = ~~(pos.z + (World.size * Chunk.base)/2) % Chunk.base;

		const selected_cube = World.structure[chunk_x][chunk_z].struct()[cube_x][cube_z][~~pos.y];

		if (selected_cube.attrs.breakable)
		{
			World.structure[chunk_x][chunk_z].delCube(cube_x, cube_z, ~~pos.y);
			World.renewStructure(chunk_x, chunk_z);

			if (cube_x == 0 && chunk_x > 0)
				World.renewStructure(chunk_x-1, chunk_z);

			if (cube_z == 0 && chunk_z > 0)
				World.renewStructure(chunk_x, chunk_z-1);

			if (cube_x == Chunk.base-1 && chunk_x < World.size-1)
				World.renewStructure(chunk_x+1, chunk_z);

			if (cube_z == Chunk.base-1 && chunk_z < World.size-1)
				World.renewStructure(chunk_x, chunk_z+1);
		}
	}

	public static adyChunksAt (x: number, z: number): AdyChunks
	{
		return World.builders[x][z].adyChunks();
	}

	public static chunkAt (x: number, z: number): Chunk
	{
		return World.structure[x][z];
	}

	public static meshAt(x: number, z: number): THREE.Mesh
	{
		let mesh = null;

		if (x >= 0 && x < World.size && z >= 0 && z < World.size)
			mesh = World.meshes[x][z];

		return mesh;
	}
}

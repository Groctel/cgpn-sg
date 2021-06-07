import * as THREE from 'three';

import { AdyChunks, Chunk } from './chunk';
import { Block } from './blocks';
import ChunkBuilder from './chunk_builder';
import Sky from './sky';

export default class World
{
	private static scene:     THREE.Scene;
	private static structure: Chunk[][];
	private static builders:  ChunkBuilder[][];
	private static sky:       Sky;
	private static worldMesh: THREE.Mesh[];

	public static readonly size = 5;
	public static readonly gravity = 0.04;

	constructor (scene: THREE.Scene)
	{
		World.scene     = scene;
		World.structure = new Array<Array<Chunk>>(World.size);
		World.builders  = new Array<Array<ChunkBuilder>>(World.size);
		World.sky       = new Sky(World.size * Chunk.base);
		World.worldMesh = new Array<THREE.Mesh>();

		scene.add(World.sky.mesh());

		for (let x = 0; x < World.size; x++)
		{
			World.builders[x]  = new Array<ChunkBuilder>(World.size);
			World.structure[x] = new Array<Chunk>(World.size);

			for (let z = 0; z < World.size; z++)
				this.generateStructure(x, z);
		}

		for (let x = 0; x < World.size; x++)
			for (let z = 0; z < World.size; z++)
				this.buildStructure(x, z);
	}

	private buildStructure (x: number, z: number): void
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

		World.worldMesh.push(World.builders[x][z].chunkMesh());
	}

	private generateStructure (x: number, z: number): void
	{
		World.structure[x][z] = new Chunk(x, z, World.size);
	}

	public static adyChunksAt (x: number, z: number): AdyChunks
	{
		return World.builders[x][z].adyChunks();
	}

	public static chunkAt (x: number, z: number): Chunk
	{
		return World.structure[x][z];
	}

	public returnMeshes(): THREE.Object3D[]
	{
		return World.worldMesh;
	}

	public putBlock(chunkX: number, chunkZ: number, position: THREE.Vector3, block: Block): void
	{

		chunkX = ~~((chunkX + (Chunk.base*World.size) /2) / Chunk.base);
		chunkZ = ~~((chunkZ + (Chunk.base*World.size) /2) / Chunk.base);

		World.scene.remove(World.builders[chunkX][chunkZ].chunkMesh());

		const index = World.worldMesh.indexOf(World.builders[chunkX][chunkZ].chunkMesh());
		World.worldMesh.splice(index,1);

		World.structure[chunkX][chunkZ].positionBlock(
			Math.floor((position.x+chunkX*Chunk.base)%Chunk.base),
			Math.floor((position.z+chunkZ*Chunk.base)%Chunk.base),
			Math.floor(position.y),
			block);

		this.buildStructure(chunkX, chunkZ);

	}

	public returnMeshesRelativePosition(pos_x: number, pos_z: number): THREE.Mesh[]
	{
		const relativeMeshes = new Array<THREE.Mesh>();

		for(let x = 0; x < World.worldMesh.length; x++){
			let distance = 0;
			distance += Math.abs(World.worldMesh[x].position.x - pos_x);
			distance += Math.abs(World.worldMesh[x].position.z - pos_z);
			if(distance <= 32){
				relativeMeshes.push(World.worldMesh[x]);
			}
		}

		return relativeMeshes;
	}
}

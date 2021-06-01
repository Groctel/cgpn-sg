import * as THREE from 'three';

import Chunk from './chunk';
import ChunkBuilder from './chunk_builder';

export default class World
{
	private static scene:     THREE.Scene;
	private static structure: Chunk[][];
	private static builders:  ChunkBuilder[][];

	public static readonly size = 5;

	constructor (scene: THREE.Scene)
	{
		World.scene     = scene;
		World.structure = new Array<Array<Chunk>>(World.size);
		World.builders  = new Array<Array<ChunkBuilder>>(World.size);

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
		World.builders[x][z] = new ChunkBuilder(
			World.structure[x][z],
			[
				x+1 < World.size ? World.structure[x+1][z] : null,
				x-1 > 0          ? World.structure[x-1][z] : null,
				z+1 < World.size ? World.structure[x][z+1] : null,
				z-1 > 0          ? World.structure[x][z-1] : null
			]
		);

		World.scene.add(World.builders[x][z].chunkMesh()
			.translateX(x*Chunk.base)
			.translateZ(z*Chunk.base)
		);
	}

	private generateStructure (x: number, z: number): void
	{
		World.structure[x][z] = new Chunk(x, z, World.size);
	}
}

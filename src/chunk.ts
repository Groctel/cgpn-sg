import { Block, Blocks } from './blocks';
import Noise from './noise';

export class AdyChunks
{
	public px: Chunk;
	public nx: Chunk;
	public pz: Chunk;
	public nz: Chunk;
	public pxpz: Chunk;
	public pxnz: Chunk;
	public nxpz: Chunk;
	public nxnz: Chunk;

	constructor (
		px: Chunk, nx: Chunk, pz: Chunk, nz: Chunk,
		pxpz: Chunk, pxnz: Chunk, nxpz: Chunk, nxnz: Chunk
	) {
		this.px = px; this.nx = nx;
		this.pz = pz; this.nz = nz;
		this.pxpz = pxpz; this.pxnz = pxnz;
		this.nxpz = nxpz; this.nxnz = nxnz;
	}
}

export class Chunk
{
	private static noise_terrain = new Noise(Math.random());
	private static noise_plants  = new Noise(Math.random());
	private structure: Block[][][];
	private pos_x: number;
	private pos_z: number;
	private max_height = 0;

	public static readonly base   = 16;
	public static readonly height = 64;

	constructor (pos_x: number, pos_z: number, world_size: number)
	{
		this.pos_x     = pos_x;
		this.pos_z     = pos_z;
		this.structure = new Array<Array<Array<Block>>>(Chunk.base);

		for (let x = 0; x < Chunk.base; x++)
		{
			this.structure[x] = new Array<Array<Block>>(Chunk.base);

			for (let z = 0; z < Chunk.base; z++)
			{
				this.structure[x][z] = new Array<Block>(Chunk.height);
				this.generateTerrain(x, z, world_size);
				//this.generatePlants(x, z, world_size);
			}
		}

		this.updateMaxHeight();
	}

	public findHighestBlock (x: number, z: number): number
	{
		let y = Chunk.height - 1;

		while (this.structure[x][z][y].attrs.empty)
			y--;

		return y;
	}

	private generatePlants (x: number, z: number, world_size: number): void
	{
		const y = this.findHighestBlock(x, z);

		if (y < Chunk.height-1 && this.structure[x][z][y] === Blocks.grass)
		{
			const noise = Chunk.noise_plants.simplex2(
				(this.pos_x * Chunk.base + x) / (world_size * Chunk.base / 5) + 0.1,
				(this.pos_z * Chunk.base + z) / (world_size * Chunk.base / 5) + 0.1
			);

			if (noise > 0.05)
				if (Math.abs(~~(noise * 10000) % 100))
					this.structure[x][z][y+1] = Blocks.weeds;
				else
					this.structure[x][z][y+1] = Blocks.dev_marker;
		}
	}

	private generateTerrain (x: number, z: number, world_size: number): void
	{
		const perlin = Chunk.noise_terrain.perlin2(
			(this.pos_x * Chunk.base + x) / (world_size * Chunk.base / 5) + 0.1,
			(this.pos_z * Chunk.base + z) / (world_size * Chunk.base / 5) + 0.1
		);
/*
		const bedrock_height = Math.ceil(3);
		const stone_height   = Math.ceil(5);
		const terrain_height = Math.ceil(10);
		*/
		const bedrock_height = Math.ceil(Math.random() * 3);
		const stone_height   = Math.ceil(Math.abs(perlin * 10) + 5);
		const terrain_height = Math.ceil(Math.abs(perlin * 15) + 10);

		let y = 0;

		while (y < bedrock_height)
			this.structure[x][z][y++] = Blocks.bedrock;

		while (y < stone_height)
			this.structure[x][z][y++] = Blocks.stone;

		while (y < terrain_height -1)
			this.structure[x][z][y++] = Blocks.dirt;

		this.structure[x][z][y++] = Blocks.grass;

		while (y < Chunk.height)
			this.structure[x][z][y++] = Blocks.air;
	}

	public updateMaxHeight (): void
	{
		let max_height = 0;

		for (let x = 0; x < Chunk.base; x++)
			for (let z = 0; z < Chunk.base; z++)
				max_height = Math.max(max_height, this.findHighestBlock(x, z));

		this.max_height = max_height;
	}

	public maxHeight (): number
	{
		return this.max_height;
	}

	public struct (): Block[][][]
	{
		return this.structure;
	}

	public positionBlock(x: number, z: number): void
	{
		const y = this.findHighestBlock(x, z)+1;
		this.structure[x][z][y] = Blocks.bedrock;

	}
}

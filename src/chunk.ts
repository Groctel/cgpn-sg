import { Block, Blocks } from './blocks';
import Noise from './noise';

export default class Chunk
{
	private static noise = new Noise();
	private structure: Block[][][];
	private pos_x: number;
	private pos_z: number;

	public static readonly base   = 16;
	public static readonly height = 32;

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

				const perlin = Chunk.noise.perlin2(
					(this.pos_x * Chunk.base + x) / (world_size * Chunk.base / 5) + 0.1,
					(this.pos_z * Chunk.base + z) / (world_size * Chunk.base / 5) + 0.1
				);

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
		}
	}

	public struct (): Block[][][]
	{
		return this.structure;
	}
}

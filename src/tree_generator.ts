import { Cubes } from './cubes';
import { AdyChunks, Chunk } from './chunk';
import OakTree from './tree';

export default class TreeGenerator
{
	private static genTrunk (xi: number, zi: number, yi: number, chunk: Chunk): number
	{
		const trunk_height = ~~Math.abs(Math.random() * 4 + 2);
		const struct = chunk.struct();

		for (let y = 0; y < trunk_height; y++)
			struct[xi][zi][yi+y] = Cubes.oak_wood;

		return trunk_height;
	}

	public static genAt (
		xi: number, zi: number, yi: number, chunk: Chunk, ady_chunks: AdyChunks
	): void
	{
		const offset = ~~(OakTree.crown_base/2);
		yi += this.genTrunk(xi, zi, yi, chunk) - 1;

		for (let x = 0; x < OakTree.crown_base; x++)
		{
			let curr_chunk = chunk;
			let x_pos = xi + x - offset;

			if (x_pos < 0)
			{
				x_pos = Chunk.base + x_pos;
				curr_chunk = ady_chunks.nx;
			}
			else if (x_pos >= Chunk.base)
			{
				x_pos -= Chunk.base;
				curr_chunk = ady_chunks.px;
			}

			for (let z = 0; z < OakTree.crown_base; z++)
			{
				let z_pos = zi + z - offset;

				if (z_pos < 0)
				{
					z_pos = Chunk.base + z_pos;

					if (curr_chunk === chunk)
						curr_chunk = ady_chunks.nz;
					else if (curr_chunk === ady_chunks.px)
						curr_chunk = ady_chunks.pxnz;
					else if (curr_chunk === ady_chunks.nx)
						curr_chunk = ady_chunks.nxnz;
				}
				else if (z_pos >= Chunk.base)
				{
					z_pos -= Chunk.base;

					if (curr_chunk === chunk)
						curr_chunk = ady_chunks.pz;
					else if (curr_chunk === ady_chunks.px)
						curr_chunk = ady_chunks.pxpz;
					else if (curr_chunk === ady_chunks.nx)
						curr_chunk = ady_chunks.nxpz;
				}

				if (curr_chunk !== null)
				{
					const struct = curr_chunk.struct();

					for (let y = 0; y < OakTree.crown_height; y++)
					{
						if (struct[x_pos][z_pos][yi+y] === Cubes.air)
							struct[x_pos][z_pos][yi+y] = OakTree.crown[y][x][z];
					}
				}
			}
		}
	}
}


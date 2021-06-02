import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

import { Block, Blocks } from './blocks';
import { AdyChunks, Chunk } from './chunk';
import Faces from './faces';
import TreeGenerator from './tree_generator';
import Textures from './textures';

export default class ChunkBuilder
{
	private buff: THREE.BufferGeometry[];
	private mesh: THREE.Mesh;
	private uv:   number[][];

	private chunk:      Chunk;
	private struct:     Block[][][];
	private ady_chunks: AdyChunks;

	constructor (chunk: Chunk, ady_chunks: AdyChunks)
	{
		this.chunk      = chunk;
		this.struct     = this.chunk.struct();
		this.ady_chunks = ady_chunks;

		this.generateTrees();
		chunk.updateMaxHeight();
		this.generateMesh();
	}

	private blockTransparent (x: number, z: number, y: number): boolean
	{
		let transparent = true;

		if (x < 0)
		{
			transparent = this.ady_chunks.nx === null ||
				this.ady_chunks.nx.struct()[Chunk.base-1][z][y].attrs.transparent;
		}
		else if (x >= Chunk.base)
		{
			transparent = this.ady_chunks.px === null ||
				this.ady_chunks.px.struct()[0][z][y].attrs.transparent;
		}
		else if (z < 0)
		{
			transparent = this.ady_chunks.nz === null ||
				this.ady_chunks.nz.struct()[x][Chunk.base-1][y].attrs.transparent;
		}
		else if (z >= Chunk.base)
		{
			transparent = this.ady_chunks.pz === null ||
				this.ady_chunks.pz.struct()[x][0][y].attrs.transparent;
		}
		else if (y >= 0 && y < Chunk.height)
		{
			transparent = this.struct[x][z][y].attrs.transparent;
		}

		return transparent;
	}

	private generateBlockFaces (x: number, z: number, y: number): void
	{
		if (this.blockTransparent(x+1, z, y))
		{
			this.buff.push(Faces.px.clone().translate(x, y, z));
			this.uv.push(this.struct[x][z][y].uv_side);
		}

		if (this.blockTransparent(x, z+1, y))
		{
			this.buff.push(Faces.pz.clone().translate(x, y, z));
			this.uv.push(this.struct[x][z][y].uv_side);
		}

		if (this.blockTransparent(x, z, y+1))
		{
			this.buff.push(Faces.py.clone().translate(x, y, z));
			this.uv.push(this.struct[x][z][y].uv_top);
		}

		if (this.blockTransparent(x-1, z, y))
		{
			this.buff.push(Faces.nx.clone().translate(x, y, z));
			this.uv.push(this.struct[x][z][y].uv_side);
		}

		if (this.blockTransparent(x, z-1, y))
		{
			this.buff.push(Faces.nz.clone().translate(x, y, z));
			this.uv.push(this.struct[x][z][y].uv_side);
		}

		if (this.blockTransparent(x, z, y-1))
		{
			this.buff.push(Faces.ny.clone().translate(x, y, z));
			this.uv.push(this.struct[x][z][y].uv_bottom);
		}
	}

	private generateTrees (): void
	{
		for (let x = 0; x < Chunk.base; x++)
			for (let z = 0; z < Chunk.base; z++)
				for (let y = 0; y <= this.chunk.maxHeight(); y++)
					if (this.struct[x][z][y] === Blocks.dev_marker)
						TreeGenerator.genAt(x, z, y, this.chunk, this.ady_chunks);
	}

	private generateXBlock (x: number, z: number, y: number): void
	{
		const shift_x1 = (Math.random() - 0.5) / 2.5;
		const shift_z1 = (Math.random() - 0.5) / 2.5;
		const shift_x2 = shift_x1 - (Math.random() - 0.5) / 6;
		const shift_z2 = shift_z1 - (Math.random() - 0.5) / 6;

		this.buff.push(Faces.x1.clone().translate(x + shift_x1, y, z + shift_z1));
		this.uv.push(this.struct[x][z][y].uv_x1);

		this.buff.push(Faces.x1.clone().rotateY(Math.PI).translate(x + shift_x1, y, z + shift_z1));
		this.uv.push(this.struct[x][z][y].uv_x2);

		this.buff.push(Faces.x2.clone().translate(x + shift_x2, y, z + shift_z2));
		this.uv.push(this.struct[x][z][y].uv_x1);

		this.buff.push(Faces.x2.clone().rotateY(Math.PI).translate(x + shift_x2, y, z + shift_z2));
		this.uv.push(this.struct[x][z][y].uv_x2);
	}

	public generateMesh (): void
	{
		this.buff = new Array<THREE.BufferGeometry>();
		this.uv   = new Array<Array<number>>();

		for (let x = 0; x < Chunk.base; x++)
			for (let z = 0; z < Chunk.base; z++)
				for (let y = 0; y <= this.chunk.maxHeight(); y++)
					if (!this.struct[x][z][y].attrs.empty)
					{
						if (!this.struct[x][z][y].attrs.x_shaped)
							this.generateBlockFaces(x, z, y);
						else
							this.generateXBlock(x, z, y);
					}

		const geometry = BufferGeometryUtils.mergeBufferGeometries(this.buff);

		geometry.setAttribute('uv', new THREE.BufferAttribute(
			new Float32Array(this.uv.flat()), 2
		));

		this.buff.length = 0;
		this.uv.length   = 0;

		this.mesh = new THREE.Mesh(geometry, Textures.material);
	}

	public chunkMesh (): THREE.Mesh
	{
		return this.mesh;
	}
}

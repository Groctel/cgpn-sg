import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

import { Block, Blocks } from './blocks';
import { AdyChunks, Chunk } from './chunk';
import Faces from './faces';
import TreeGenerator from './tree_generator';
import Textures from './textures';

export default class ChunkBuilder
{
	private buff:  THREE.BufferGeometry[];
	private mesh:  THREE.Mesh;
	private uv:    number[][];

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

	private blockAt (x: number, z: number, y: number): Block
	{
		let block = null;

		if (
			x >= 0 && x < Chunk.base &&
			z >= 0 && z < Chunk.base &&
			y >= 0 && y < Chunk.height
		) {
			block = this.struct[x][z][y];
		}
		else if (x < 0)
		{
			block = this.ady_chunks.nx === null
				? null
				: this.ady_chunks.nx.struct()[Chunk.base-1][z][y];
		}
		else if (x >= Chunk.base)
		{
			block = this.ady_chunks.px === null
				? null
				: this.ady_chunks.px.struct()[0][z][y];
		}
		else if (z < 0)
		{
			block = this.ady_chunks.nz === null
				? null
				: this.ady_chunks.nz.struct()[x][Chunk.base-1][y];
		}
		else if (z >= Chunk.base)
		{
			block = this.ady_chunks.pz === null
				? null
				: this.ady_chunks.pz.struct()[x][0][y];
		}

		return block;
	}

	private generateBlockFaces (x: number, z: number, y: number): void
	{
		const block    = this.struct[x][z][y];
		const block_px = this.blockAt(x+1, z,   y);
		const block_pz = this.blockAt(x,   z+1, y);
		const block_py = this.blockAt(x,   z,   y+1);
		const block_nx = this.blockAt(x-1, z,   y);
		const block_nz = this.blockAt(x,   z-1, y);
		const block_ny = this.blockAt(x,   z,   y-1);

		if (
			!block_px ||
			(block_px.attrs.transparent &&
				!(block.attrs.groupable && (block === block_px))
			)
		) {
			this.buff.push(Faces.px.clone().translate(x, y, z));
			this.uv.push(block.uv_side);
		}

		if (
			!block_pz ||
			(block_pz.attrs.transparent &&
				!(block.attrs.groupable && (block === block_pz))
			)
		) {
			this.buff.push(Faces.pz.clone().translate(x, y, z));
			this.uv.push(block.uv_side);
		}

		if (
			!block_py ||
			(block_py.attrs.transparent &&
				!(block.attrs.groupable && (block === block_py))
			)
		) {
			this.buff.push(Faces.py.clone().translate(x, y, z));
			this.uv.push(block.uv_top);
		}

		if (
			!block_nx ||
			(block_nx.attrs.transparent &&
				!(block.attrs.groupable && (block === block_nx))
			)
		) {
			this.buff.push(Faces.nx.clone().translate(x, y, z));
			this.uv.push(block.uv_side);
		}

		if (
			!block_nz ||
			(block_nz.attrs.transparent &&
				!(block.attrs.groupable && (block === block_nz))
			)
		) {
			this.buff.push(Faces.nz.clone().translate(x, y, z));
			this.uv.push(block.uv_side);
		}

		if (
			!block_ny ||
			(block_ny.attrs.transparent &&
				!(block.attrs.groupable && (block === block_ny))
			)
		) {
			this.buff.push(Faces.ny.clone().translate(x, y, z));
			this.uv.push(block.uv_bottom);
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
		this.buff  = new Array<THREE.BufferGeometry>();
		this.uv    = new Array<Array<number>>();

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

		this.buff.length  = 0;
		this.uv.length    = 0;

		this.mesh = new THREE.Mesh(geometry, Textures.material);
	}

	public chunkMesh (): THREE.Mesh
	{
		return this.mesh;
	}
}

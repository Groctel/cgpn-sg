import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

import { Block } from './blocks';
import Chunk from './chunk';
import Textures from './textures';

const px = 0; const nx = 1;
const pz = 2; const nz = 3;
const py = 4; const ny = 5;

const faces = [
	new THREE.PlaneGeometry(1,1)
		.rotateY(Math.PI / 2)
		.translate(0.5, 0, 0),

	new THREE.PlaneGeometry(1,1)
		.rotateY(-Math.PI / 2)
		.translate(-0.5, 0, 0),

	new THREE.PlaneGeometry(1,1)
		.translate(0, 0, 0.5),

	new THREE.PlaneGeometry(1,1)
		.rotateY(Math.PI)
		.translate(0, 0, -0.5),

	new THREE.PlaneGeometry(1,1)
		.rotateX(-Math.PI / 2)
		.translate(0, 0.5, 0),

	new THREE.PlaneGeometry(1,1)
		.rotateX(Math.PI / 2)
		.translate(0, -0.5, 0),

];

export default class ChunkBuilder
{
	private buff: THREE.BufferGeometry[];
	private mesh: THREE.Mesh;
	private uv:   number[][];

	private chunk:      Block[][][];
	private ady_chunks: Block[][][][];

	constructor (chunk: Chunk, ady_chunks: Chunk[])
	{
		this.chunk      = chunk.struct();
		this.ady_chunks = new Array<Array<Array<Array<Block>>>>(4);

		for (let i = 0; i < 4; i++)
			this.ady_chunks[i] = ady_chunks[i] === null ? null : ady_chunks[i].struct();

		this.generateMesh();
	}

	private blockEmpty (x: number, z: number, y: number): boolean
	{
		let empty = true;

		if (x < 0)
		{
			empty = this.ady_chunks[nx] === null ||
				this.ady_chunks[nx][Chunk.base-1][z][y].attrs.empty;
		}
		else if (x >= Chunk.base)
		{
			empty = this.ady_chunks[px] === null ||
				this.ady_chunks[px][0][z][y].attrs.empty;
		}
		else if (z < 0)
		{
			empty = this.ady_chunks[nz] === null ||
				this.ady_chunks[nz][x][Chunk.base-1][y].attrs.empty;
		}
		else if (z >= Chunk.base)
		{
			empty = this.ady_chunks[pz] === null ||
				this.ady_chunks[pz][x][0][y].attrs.empty;
		}
		else if (y >= 0 && y < Chunk.height)
		{
			empty = this.chunk[x][z][y].attrs.empty;
		}

		return empty;
	}

	private generateBlockFaces (x: number, z: number, y: number): void
	{
		if (this.blockEmpty(x+1, z, y))
		{
			this.buff.push(faces[px].clone().translate(x, y, z));
			this.uv.push(this.chunk[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z+1, y))
		{
			this.buff.push(faces[pz].clone().translate(x, y, z));
			this.uv.push(this.chunk[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z, y+1))
		{
			this.buff.push(faces[py].clone().translate(x, y, z));
			this.uv.push(this.chunk[x][z][y].uv_top);
		}

		if (this.blockEmpty(x-1, z, y))
		{
			this.buff.push(faces[nx].clone().translate(x, y, z));
			this.uv.push(this.chunk[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z-1, y))
		{
			this.buff.push(faces[nz].clone().translate(x, y, z));
			this.uv.push(this.chunk[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z, y-1))
		{
			this.buff.push(faces[ny].clone().translate(x, y, z));
			this.uv.push(this.chunk[x][z][y].uv_bottom);
		}
	}

	public generateMesh (): void
	{
		this.buff = new Array<THREE.BufferGeometry>();
		this.uv   = new Array<Array<number>>();

		for (let x = 0; x < Chunk.base; x++)
			for (let z = 0; z < Chunk.base; z++)
				for (let y = 0; y < Chunk.height; y++)
					if (!this.chunk[x][z][y].attrs.empty)
						this.generateBlockFaces(x, z, y);

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

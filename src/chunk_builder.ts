import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

import { Cube, Cubes } from './cubes';
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
	private struct:     Cube[][][];
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

	private cubeAt (x: number, z: number, y: number): Cube
	{
		let cube = null;

		if (
			x >= 0 && x < Chunk.base &&
			z >= 0 && z < Chunk.base &&
			y >= 0 && y < Chunk.height
		) {
			cube = this.struct[x][z][y];
		}
		else if (x < 0)
		{
			cube = this.ady_chunks.nx === null
				? null
				: this.ady_chunks.nx.struct()[Chunk.base-1][z][y];
		}
		else if (x >= Chunk.base)
		{
			cube = this.ady_chunks.px === null
				? null
				: this.ady_chunks.px.struct()[0][z][y];
		}
		else if (z < 0)
		{
			cube = this.ady_chunks.nz === null
				? null
				: this.ady_chunks.nz.struct()[x][Chunk.base-1][y];
		}
		else if (z >= Chunk.base)
		{
			cube = this.ady_chunks.pz === null
				? null
				: this.ady_chunks.pz.struct()[x][0][y];
		}

		return cube;
	}

	public generateCubeFaces (x: number, z: number, y: number): void
	{
		const cube    = this.struct[x][z][y];
		const cube_px = this.cubeAt(x+1, z,   y);
		const cube_pz = this.cubeAt(x,   z+1, y);
		const cube_py = this.cubeAt(x,   z,   y+1);
		const cube_nx = this.cubeAt(x-1, z,   y);
		const cube_nz = this.cubeAt(x,   z-1, y);
		const cube_ny = this.cubeAt(x,   z,   y-1);

		if (
			!cube_px ||
			(cube_px.attrs.transparent &&
				!(cube.attrs.groupable && (cube === cube_px))
			)
		) {
			this.buff.push(Faces.px.clone().translate(x, y, z));
			this.uv.push(cube.uv_side);
		}

		if (
			!cube_pz ||
			(cube_pz.attrs.transparent &&
				!(cube.attrs.groupable && (cube === cube_pz))
			)
		) {
			this.buff.push(Faces.pz.clone().translate(x, y, z));
			this.uv.push(cube.uv_side);
		}

		if (
			!cube_py ||
			(cube_py.attrs.transparent &&
				!(cube.attrs.groupable && (cube === cube_py))
			)
		) {
			this.buff.push(Faces.py.clone().translate(x, y, z));
			this.uv.push(cube.uv_top);
		}

		if (
			!cube_nx ||
			(cube_nx.attrs.transparent &&
				!(cube.attrs.groupable && (cube === cube_nx))
			)
		) {
			this.buff.push(Faces.nx.clone().translate(x, y, z));
			this.uv.push(cube.uv_side);
		}

		if (
			!cube_nz ||
			(cube_nz.attrs.transparent &&
				!(cube.attrs.groupable && (cube === cube_nz))
			)
		) {
			this.buff.push(Faces.nz.clone().translate(x, y, z));
			this.uv.push(cube.uv_side);
		}

		if (
			!cube_ny ||
			(cube_ny.attrs.transparent &&
				!(cube.attrs.groupable && (cube === cube_ny))
			)
		) {
			this.buff.push(Faces.ny.clone().translate(x, y, z));
			this.uv.push(cube.uv_bottom);
		}
	}

	private generateTrees (): void
	{
		for (let x = 0; x < Chunk.base; x++)
			for (let z = 0; z < Chunk.base; z++)
				for (let y = 0; y <= this.chunk.maxHeight(); y++)
					if (this.struct[x][z][y] === Cubes.dev_marker)
						TreeGenerator.genAt(x, z, y, this.chunk, this.ady_chunks);
	}

	private generateXCube (x: number, z: number, y: number): void
	{
		// const shift_x1 = (Math.random() - 0.5) / 2.5;
		// const shift_z1 = (Math.random() - 0.5) / 2.5;
		// const shift_x2 = shift_x1 - (Math.random() - 0.5) / 6;
		// const shift_z2 = shift_z1 - (Math.random() - 0.5) / 6;

		this.buff.push(Faces.x1.clone().translate(x, y, z));
		this.uv.push(this.struct[x][z][y].uv_x1);

		this.buff.push(Faces.x1.clone().rotateY(Math.PI).translate(x, y, z));
		this.uv.push(this.struct[x][z][y].uv_x2);

		this.buff.push(Faces.x2.clone().translate(x, y, z));
		this.uv.push(this.struct[x][z][y].uv_x1);

		this.buff.push(Faces.x2.clone().rotateY(Math.PI).translate(x, y, z));
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
							this.generateCubeFaces(x, z, y);
						else
							this.generateXCube(x, z, y);
					}

		const geometry = BufferGeometryUtils.mergeBufferGeometries(this.buff);

		geometry.setAttribute('uv', new THREE.BufferAttribute(
			new Float32Array(this.uv.flat()), 2
		));

		this.buff.length  = 0;
		this.uv.length    = 0;

		this.mesh = new THREE.Mesh(geometry, Textures.material);
	}

	public adyChunks (): AdyChunks
	{
		return this.ady_chunks;
	}

	public chunkMesh (): THREE.Mesh
	{
		return this.mesh;
	}
}

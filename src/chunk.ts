// import SimplexNoise from 'simplex-noise';
// import Noise from 'noisejs';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

import { Block, Blocks } from './blocks';
import Textures from './textures';

const px = 0; const nx = 1; const py = 2;
const ny = 3; const pz = 4; const nz = 5;

export default class Chunk
{
	private static readonly faces = [
		new THREE.PlaneGeometry(1,1)
			.rotateY(Math.PI / 2)
			.translate(0.5, 0, 0),

		new THREE.PlaneGeometry(1,1)
			.rotateY(-Math.PI / 2)
			.translate(-0.5, 0, 0),

		new THREE.PlaneGeometry(1,1)
			.rotateX(-Math.PI / 2)
			.translate(0, 0.5, 0),

		new THREE.PlaneGeometry(1,1)
			.rotateX(Math.PI / 2)
			.translate(0, -0.5, 0),

		new THREE.PlaneGeometry(1,1)
			.translate(0, 0, 0.5),

		new THREE.PlaneGeometry(1,1)
			.rotateY(Math.PI)
			.translate(0, 0, -0.5)
	];
	private structure: Array<Array<Array<Block>>>;
	public static readonly base = 16;
	public static readonly build_height = 32;
	public static readonly noise_height = 16;
	private terrain = Array<THREE.BufferGeometry>();
	private uv = Array<Array<number>>();

	constructor ()
	{
		this.structure = new Array<Array<Array<Block>>>(Chunk.base);

		for (let x = 0; x < Chunk.base; x++)
		{
			this.structure[x] = new Array<Array<Block>>(Chunk.base);

			for (let z = 0; z < Chunk.base; z++)
			{
				this.structure[x][z] = new Array<Block>(Chunk.build_height);
				// const terrain_height = Math.floor((new Noise().perlin2(x, z) + 1) * Chunk.noise_height);
				const terrain_height = 10;

				for (let y = 0; y < terrain_height; y++)
				{
					if (y != terrain_height -1)
						this.structure[x][z][y] = Blocks.dirt;
					else
						this.structure[x][z][y] = Blocks.grass;
				}

				for (let y = terrain_height; y < Chunk.build_height; y++)
					this.structure[x][z][y] = Blocks.air;
			}
		}

	}

	private blockEmpty (x: number, z: number, y: number): boolean
	{
		let empty = true;

		if (
			x >= 0 && x < Chunk.base &&
			z >= 0 && z < Chunk.base &&
			y >= 0 && y < Chunk.build_height
		) {
			empty = this.structure[x][z][y].attrs.empty;
		}

		return empty;
	}

	private generateBlockFaces (x: number, z: number, y: number): void
	{
		if (this.blockEmpty(x+1, z, y))
		{
			this.terrain.push(Chunk.faces[px].clone().translate(x, y, z));
			this.uv.push(this.structure[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z+1, y))
		{
			this.terrain.push(Chunk.faces[pz].clone().translate(x, y, z));
			this.uv.push(this.structure[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z, y+1))
		{
			this.terrain.push(Chunk.faces[py].clone().translate(x, y, z));
			this.uv.push(this.structure[x][z][y].uv_top);
		}

		if (this.blockEmpty(x-1, z, y))
		{
			this.terrain.push(Chunk.faces[nx].clone().translate(x, y, z));
			this.uv.push(this.structure[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z-1, y))
		{
			this.terrain.push(Chunk.faces[nz].clone().translate(x, y, z));
			this.uv.push(this.structure[x][z][y].uv_side);
		}

		if (this.blockEmpty(x, z, y-1))
		{
			this.terrain.push(Chunk.faces[ny].clone().translate(x, y, z));
			this.uv.push(this.structure[x][z][y].uv_bottom);
		}
	}

	public generateTerrain (): THREE.Mesh
	{
		this.terrain = new Array<THREE.BufferGeometry>();

		for (let x = 0; x < Chunk.base; x++)
			for (let z = 0; z < Chunk.base; z++)
				for (let y = 0; y < Chunk.build_height; y++)
					if (!this.structure[x][z][y].attrs.empty)
						this.generateBlockFaces(x, z, y);

		const geometry = BufferGeometryUtils.mergeBufferGeometries(this.terrain);
		geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.uv.flat()), 2));

		return new THREE.Mesh(geometry, Textures.material);
	}
}

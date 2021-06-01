import Noise from './noise';
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
	private static noise = new Noise();

	constructor ()
	{
		this.structure = new Array<Array<Array<Block>>>(Chunk.base);

		for (let x = 0; x < Chunk.base; x++)
		{
			this.structure[x] = new Array<Array<Block>>(Chunk.base);

			for (let z = 0; z < Chunk.base; z++)
			{
				this.structure[x][z] = new Array<Block>(Chunk.build_height);

				const perlin  = Chunk.noise.perlin2(x / Chunk.base + 0.1, z / Chunk.base + 0.1);

				const bedrock_height = Math.ceil(Math.random() * 3);
				const stone_height   = Math.ceil(Math.abs(perlin * 10) + 5);
				const terrain_height = Math.ceil(Math.abs(perlin * 8) + 10);

				let y = 0;

				while (y < bedrock_height)
					this.structure[x][z][y++] = Blocks.bedrock;

				while (y < stone_height)
					this.structure[x][z][y++] = Blocks.stone;

				while (y < terrain_height -1)
					this.structure[x][z][y++] = Blocks.dirt;

				this.structure[x][z][y++] = Blocks.grass;

				while (y < Chunk.build_height)
					this.structure[x][z][y++] = Blocks.air;
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

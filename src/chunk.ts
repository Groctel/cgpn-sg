import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

import { Block, Blocks } from './blocks';

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
	public static readonly height = 32;
	private materials = Array<THREE.MeshBasicMaterial>();
	private terrain = Array<THREE.BufferGeometry>();
	private group_indexes = Array<{xi: number, yi: number, zi: number}>();

	constructor ()
	{
		this.structure = new Array<Array<Array<Block>>>(Chunk.base);

		for (let x = 0; x < Chunk.base; x++)
		{
			this.structure[x] = new Array<Array<Block>>(Chunk.height);

			for (let y = 0; y < Chunk.height; y++)
			{
				this.structure[x][y] = new Array<Block>(Chunk.base);

				for (let z = 0; z < Chunk.base; z++)
					if ((x+y+z) % 2)
						this.structure[x][y][z] = Blocks.grass;
					else
						this.structure[x][y][z] = Blocks.air;
			}
		}
	}

	private blockEmpty (x: number, y: number, z: number): boolean
	{
		let empty = true;

		if (
			x >= 0 && x < Chunk.base &&
			y >= 0 && y < Chunk.height &&
			z >= 0 && z < Chunk.base
		) {
			empty = this.structure[x][y][z].attrs.empty;
		}

		return empty;
	}

	private generateBlockFaces (x: number, y: number, z: number): void
	{
		if (this.blockEmpty(x+1, y, z))
		{
			this.terrain.push(Chunk.faces[px].clone().translate(x, y, z));
			this.materials.push(this.structure[x][y][z].mat_side);
			this.group_indexes.push({xi: x, yi: y, zi: x});
		}

		if (this.blockEmpty(x, y, z+1))
		{
			this.terrain.push(Chunk.faces[nx].clone().translate(x, y, z));
			this.materials.push(this.structure[x][y][z].mat_side);
			this.group_indexes.push({xi: x, yi: y, zi: x});
		}

		if (this.blockEmpty(x, y-1, z))
		{
			this.terrain.push(Chunk.faces[py].clone().translate(x, y, z));
			this.materials.push(this.structure[x][y][z].mat_bottom);
			this.group_indexes.push({xi: x, yi: y, zi: x});
		}

		if (this.blockEmpty(x, y+1, z))
		{
			this.terrain.push(Chunk.faces[ny].clone().translate(x, y, z));
			this.materials.push(this.structure[x][y][z].mat_top);
			this.group_indexes.push({xi: x, yi: y, zi: x});
		}

		if (this.blockEmpty(x, y, z-1))
		{
			this.terrain.push(Chunk.faces[pz].clone().translate(x, y, z));
			this.materials.push(this.structure[x][y][z].mat_side);
			this.group_indexes.push({xi: x, yi: y, zi: x});
		}

		if (this.blockEmpty(x-1, y, z))
		{
			this.terrain.push(Chunk.faces[nz].clone().translate(x, y, z));
			this.materials.push(this.structure[x][y][z].mat_side);
			this.group_indexes.push({xi: x, yi: y, zi: x});
		}
	}

	public generateTerrain (): THREE.Mesh
	{
		this.terrain   = new Array<THREE.BufferGeometry>();
		this.materials = new Array<THREE.MeshBasicMaterial>();

		for (let x = 0; x < Chunk.base; x++)
			for (let y = 0; y < Chunk.height; y++)
				for (let z = 0; z < Chunk.base; z++)
					if (!this.structure[x][y][z].attrs.empty)
						this.generateBlockFaces(x, y, z);

		const geometry = BufferGeometryUtils.mergeBufferGeometries(this.terrain);

		return new THREE.Mesh(geometry, new THREE.MeshNormalMaterial);
	}
}

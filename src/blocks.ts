import * as THREE from 'three';

const loader = new THREE.TextureLoader();

interface BlockAttrs
{
	breakable: boolean;
	empty:     boolean;
}

export interface Block
{
	attrs:       BlockAttrs;
	mat_bottom?: THREE.MeshBasicMaterial;
	mat_side?:   THREE.MeshBasicMaterial;
	mat_top?:    THREE.MeshBasicMaterial;
}

interface BlockList
{
	[key: string]: Block;
}

export const Blocks: BlockList = {
	air:
	{
		attrs:
		{
			breakable: false,
			empty: true,
		},
	},
	grass:
	{
		attrs:
		{
			breakable: true,
			empty: false,
		},
		mat_bottom: new THREE.MeshBasicMaterial({map: loader.load("/tex/dirt.png")}),
		mat_side: new THREE.MeshBasicMaterial({map: loader.load("/tex/grass-side.png")}),
		mat_top: new THREE.MeshBasicMaterial({map: loader.load("/tex/grass-top.png")}),
	},
};

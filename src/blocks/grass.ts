import * as THREE from 'three';
import Block from '../block';

export default class GrassBlock extends Block
{
	static tex_path = "/tex/grass-side.png";
	static texture  = new THREE.TextureLoader().load(GrassBlock.tex_path);

	constructor ()
	{
		super();
	}
}

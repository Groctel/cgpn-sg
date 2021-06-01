import * as THREE from 'three';

export default class Textures
{
	private static readonly loader = new THREE.TextureLoader();

	public static readonly rows = 3;
	public static readonly cols = 2;

	public static readonly atlas    = Textures.loader.load("/tex/atlas.png");
	public static readonly material = new THREE.MeshBasicMaterial({map: Textures.atlas});
}

Textures.atlas.magFilter = THREE.NearestFilter;
Textures.atlas.minFilter = THREE.NearestFilter;

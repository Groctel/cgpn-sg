import * as THREE from 'three';

export default class Textures
{
	private static readonly loader = new THREE.TextureLoader();

	public static readonly rows = 3;
	public static readonly cols = 4;

	public static readonly atlas    = Textures.loader.load("/tex/atlas.png");
	public static readonly material = new THREE.MeshPhongMaterial({
		alphaTest: 1,
		map: Textures.atlas,
		transparent: true
	});
}

Textures.atlas.magFilter = THREE.NearestFilter;
Textures.atlas.minFilter = THREE.NearestFilter;

import * as THREE from 'three';

export default class Sky extends THREE.Object3D
{
	sky: THREE.Mesh;

	constructor (radius: number)
	{
		super();

		const geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
		const material = new THREE.MeshBasicMaterial({
			color: 0x689daf,
			side: THREE.BackSide
		});
		this.sky = new THREE.Mesh(geometry, material);
	}

	public mesh (): THREE.Mesh
	{
		return this.sky;
	}
}

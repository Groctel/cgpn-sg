import * as THREE from 'three';

export default class Faces
{
	public static px = new THREE.PlaneGeometry(1,1)
		.rotateY(Math.PI / 2)
		.translate(0.5, 0, 0);

	public static nx = new THREE.PlaneGeometry(1,1)
		.rotateY(-Math.PI / 2)
		.translate(-0.5, 0, 0);

	public static pz = new THREE.PlaneGeometry(1,1)
		.translate(0, 0, 0.5);

	public static nz = new THREE.PlaneGeometry(1,1)
		.rotateY(Math.PI)
		.translate(0, 0, -0.5);

	public static py = new THREE.PlaneGeometry(1,1)
		.rotateX(-Math.PI / 2)
		.translate(0, 0.5, 0);

	public static ny = new THREE.PlaneGeometry(1,1)
		.rotateX(Math.PI / 2)
		.translate(0, -0.5, 0);

	public static x1 = new THREE.PlaneGeometry(1,1)
		.rotateY(Math.PI / 4);

	public static x2 = new THREE.PlaneGeometry(1,1)
		.rotateY(-Math.PI / 4);
}


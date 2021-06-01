import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export class DropItem extends THREE.Object3D {
	protected geometry = new THREE.BoxGeometry(1,1,1);
	protected material:THREE.MeshBasicMaterial;

	protected cube: THREE.Object3D;
	private rotate;
	private tweenUp;

	constructor(mat: THREE.MeshBasicMaterial){
		super();

		this.material = mat;

		this.cube = new THREE.Mesh(this.geometry,this.material);
		this.cube.scale.x *= 0.25;
		this.cube.scale.y *= 0.25;
		this.cube.scale.z *= 0.25;

		this.tweenUp = new TWEEN.Tween(this.cube.position)
			.to({y:0.75},500)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity);

		this.rotate = new TWEEN.Tween(this.cube.rotation)
			.to({y: 360*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Linear.None)
			.repeat(Infinity);

		this.tweenUp.start();
		this.rotate.start();

		this.add(this.cube);
	}

}
